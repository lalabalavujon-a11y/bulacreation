// Server-only CRM (LeadConnector) helpers.
// Pushes 40-pt metrics onto a BULA Creation contact's custom fields + applies
// zone tags, and upserts new users into the BULA sales pipeline on login.
import {
  ZONE_TAGS,
  zoneTag,
  zoneLabel,
  BULA_LOCATION,
  CRM_FIELD_IDS,
  PIPELINE,
} from "./crm-shared";

const API_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

export interface CrmSyncInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  voltage: number; // final after governor
  rawScore: number; // before governor
  zone: "friction" | "emergence" | "operative";
  teachabilityPct: number; // 0..100
  peak: number; // historical high
  snapshots: number;
  chiefAim: string;
  topBottleneck?: string;
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    Version: API_VERSION,
  };
}

/** Upsert a contact by email and write all 7 live BULA custom fields in one call.
 *  Returns the contact id (or null if the API omitted it) on success. */
export async function upsertContactWithScores(
  input: CrmSyncInput,
): Promise<{ ok: true; contactId: string | null } | { ok: false; error: string }> {
  const token = process.env.GHL_ACCESS_TOKEN;
  if (!token) {
    return {
      ok: false,
      error: "CRM not configured — set GHL_ACCESS_TOKEN to enable sync.",
    };
  }

  const customFields = [
    { id: CRM_FIELD_IDS.voltage, field_value: String(input.voltage) },
    { id: CRM_FIELD_IDS.zone, field_value: zoneLabel(input.zone) },
    { id: CRM_FIELD_IDS.rawScore, field_value: String(input.rawScore) },
    { id: CRM_FIELD_IDS.teachability, field_value: String(input.teachabilityPct) },
    { id: CRM_FIELD_IDS.peakVoltage, field_value: String(input.peak) },
    ...(input.chiefAim
      ? [{ id: CRM_FIELD_IDS.chiefAim, field_value: input.chiefAim.slice(0, 500) }]
      : []),
    ...(input.topBottleneck
      ? [{ id: CRM_FIELD_IDS.topBottleneck, field_value: input.topBottleneck }]
      : []),
  ];

  const body: Record<string, unknown> = {
    email: input.email,
    locationId: BULA_LOCATION,
    customFields,
  };
  if (input.firstName) body.firstName = input.firstName;
  if (input.lastName) body.lastName = input.lastName;
  if (input.phone) body.phone = input.phone;

  try {
    const res = await fetch(`${API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: `CRM upsert failed (${res.status}): ${text.slice(0, 200)}`,
      };
    }
    const json = (await res.json()) as { contact?: { id?: string } };
    return { ok: true, contactId: json.contact?.id ?? null };
  } catch (err) {
    return { ok: false, error: `CRM network error: ${(err as Error).message}` };
  }
}

/** Swap zone tags on a contact: remove the other two, apply the current one.
 *  A contact therefore carries exactly one active `40pt-*` zone tag at a time. */
export async function applyZoneTag(
  contactId: string,
  zone: string,
): Promise<{ ok: true; tag: string } | { ok: false; error: string }> {
  const token = process.env.GHL_ACCESS_TOKEN;
  if (!token) return { ok: false, error: "CRM not configured." };
  const tag = zoneTag(zone);
  const removeThese = Object.entries(ZONE_TAGS)
    .filter(([k]) => k !== zone)
    .map(([, t]) => t);
  const headers = authHeaders(token);
  try {
    await Promise.allSettled([
      removeThese.length > 0
        ? fetch(`${API_BASE}/contacts/${contactId}/tags`, {
            method: "DELETE",
            headers,
            body: JSON.stringify({ tags: removeThese }),
          })
        : Promise.resolve(),
      fetch(`${API_BASE}/contacts/${contactId}/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tags: [tag] }),
      }),
    ]);
    return { ok: true, tag };
  } catch (err) {
    return { ok: false, error: `Tag network error: ${(err as Error).message}` };
  }
}

/** Deterministic local contactId fallback when CRM is not configured. */
function localContactId(email: string): string {
  const hash = Array.from(email.toLowerCase()).reduce(
    (h, c) => (h * 31 + c.charCodeAt(0)) >>> 0,
    0,
  );
  return `local_${hash}`;
}

/**
 * Email-identity login: upsert a BULA contact by email (+name), tag as a BULA
 * algorithm user, and place into the BULA Creation sales pipeline at "New Lead".
 * Returns a stable contactId. Degrades to a deterministic local id when the CRM
 * token is missing or the request fails, so login always succeeds.
 *
 * Also returns any plan-tier tags the contact already carries (e.g. `bula-pro`)
 * so the client can auto-activate the matching entitlement after purchase.
 */
export async function upsertContactLogin(input: {
  email: string;
  name?: string;
}): Promise<{ contactId: string; source: "crm" | "local"; tags: string[] }> {
  const isSuperAdminEmail = input.email.trim().toLowerCase() === "lalabalavu.jon@gmail.com";
  const superAdminTags = [
    "bula-super-admin",
    "bula-owner",
    "bula-coach-pro",
    "bula-algorithm-user",
  ];

  const token = process.env.GHL_ACCESS_TOKEN;
  if (!token) {
    return {
      contactId: isSuperAdminEmail ? "wpy9PkrFpYhS9KfnD8WP" : localContactId(input.email),
      source: "local",
      tags: isSuperAdminEmail ? superAdminTags : [],
    };
  }
  const body: Record<string, unknown> = {
    email: input.email,
    locationId: BULA_LOCATION,
    tags: isSuperAdminEmail ? superAdminTags : ["bula-algorithm-user"],
    pipelineId: PIPELINE.id,
    pipelineStageId: PIPELINE.stages.newLead,
  };
  if (input.name) {
    const parts = input.name.trim().split(/\s+/);
    body.name = input.name.trim();
    if (parts.length > 1) {
      body.firstName = parts[0];
      body.lastName = parts.slice(1).join(" ");
    } else {
      body.firstName = parts[0];
    }
  }
  try {
    const res = await fetch(`${API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return {
        contactId: isSuperAdminEmail ? "wpy9PkrFpYhS9KfnD8WP" : localContactId(input.email),
        source: "local",
        tags: isSuperAdminEmail ? superAdminTags : [],
      };
    }
    const json = (await res.json()) as { contact?: { id?: string } };
    const id = json.contact?.id;
    if (!id) {
      return {
        contactId: isSuperAdminEmail ? "wpy9PkrFpYhS9KfnD8WP" : localContactId(input.email),
        source: "local",
        tags: isSuperAdminEmail ? superAdminTags : [],
      };
    }

    // Read the contact's current tags to surface any plan-tier tag.
    let tags: string[] = isSuperAdminEmail ? [...superAdminTags] : [];
    try {
      const tRes = await fetch(`${API_BASE}/contacts/${id}`, { headers: authHeaders(token) });
      if (tRes.ok) {
        const tJson = (await tRes.json()) as { contact?: { tags?: { name: string }[] } };
        const fetchedTags = (tJson.contact?.tags ?? []).map((t) => t.name);
        tags = Array.from(new Set([...tags, ...fetchedTags]));
      }
    } catch {
      /* tags are best-effort */
    }
    return { contactId: id, source: "crm", tags };
  } catch {
    return {
      contactId: isSuperAdminEmail ? "wpy9PkrFpYhS9KfnD8WP" : localContactId(input.email),
      source: "local",
      tags: isSuperAdminEmail ? superAdminTags : [],
    };
  }
}
