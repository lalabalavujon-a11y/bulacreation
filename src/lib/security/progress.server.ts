import { db } from "./database.server";
import { requireAccount, assertSameOrigin } from "./session.server";
import { ProgressSchema, type Progress } from "./progress";
import { PLANS } from "../diagnostic/subscription";
export async function readProgress() {
  const account = await requireAccount();
  const rows = await db<{ data: Progress; version: number; updated_at: string }[]>(
    `bula_progress?user_id=eq.${encodeURIComponent(account.id)}&select=data,version,updated_at&limit=1`,
  );
  const row = rows[0];
  return row
    ? { data: ProgressSchema.parse(row.data), version: row.version, updatedAt: row.updated_at }
    : null;
}
export async function writeProgress(data: Progress, version: number, privateMode: boolean) {
  assertSameOrigin();
  const account = await requireAccount();
  if (privateMode) throw new Error("Private Mode is on. Your progress has not been uploaded.");
  const parsed = ProgressSchema.parse(data);
  if (JSON.stringify(parsed).length > 1000000) throw new Error("Progress is too large to sync.");
  const cap = PLANS[account.plan].limits.snapshots;
  // Preserve existing history after downgrades; don't allow a free account to add beyond its limit.
  if (cap >= 0 && parsed.snapshots.length > cap) {
    const existing = await readProgress();
    const ids = new Set(existing?.data.snapshots.map((s) => s.id));
    if (parsed.snapshots.some((s) => !ids.has(s.id)))
      throw new Error("Your plan's cloud snapshot limit has been reached.");
  }
  const next = await db<number | null>("rpc/bula_save_progress", {
    method: "POST",
    body: JSON.stringify({ p_user: account.id, p_version: version, p_data: parsed }),
  });
  if (next === null)
    throw new Error(
      "Newer progress exists in your account. Export this device's progress before restoring the cloud copy.",
    );
  return { version: next };
}
