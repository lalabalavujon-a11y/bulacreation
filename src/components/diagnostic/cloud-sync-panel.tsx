import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { useAuth } from "@/lib/diagnostic/auth-context";
import { syncToCrm } from "@/lib/diagnostic/crm-sync.functions";
import { zoneTag } from "@/lib/diagnostic/crm-shared";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CloudUpload,
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  ShieldOff,
} from "lucide-react";

type Busy = "none" | "crm" | "cloud";
type Msg = { type: "ok" | "err"; text: string };

export function CloudSyncPanel() {
  const { result, chiefAim, snapshots, privateMode, setPrivateMode } = useDiagnostic();
  const { email: authEmail, name, contactId } = useAuth();
  const sync = useServerFn(syncToCrm);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<Busy>("none");
  const [msg, setMsg] = useState<Msg | null>(null);

  // Pre-fill email from the authenticated identity.
  useEffect(() => {
    if (authEmail) setEmail(authEmail);
  }, [authEmail]);

  const peak = snapshots.reduce((m, s) => Math.max(m, s.final), 0);

  async function saveCloud() {
    if (privateMode) return;
    if (!email.trim()) {
      setMsg({ type: "err", text: "Enter an email — cloud saves auto-mirror to the CRM contact." });
      return;
    }
    setBusy("cloud");
    setMsg(null);
    try {
      const id = contactId ? `audit_${contactId}_${Date.now()}` : `audit_${Date.now()}`;
      const res = await fetch("/api/audit/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          contactId: contactId ?? undefined,
          email: email.trim(),
          final: result.finalRounded,
          raw: Math.round(result.raw),
          zone: result.zone,
          teachabilityPct: Math.round(result.teachabilityFactor * 100),
          peak,
          snapshots: snapshots.length,
          chiefAim: chiefAim.text,
          scores: {},
          ts: Date.now(),
        }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && j.ok) {
        setMsg({
          type: "ok",
          text: `Cloud snapshot saved · id ${id}. CRM mirror queued (${zoneTag(result.zone)}).`,
        });
      } else {
        setMsg({ type: "err", text: j.error ?? `Save failed (${res.status})` });
      }
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setBusy("none");
    }
  }

  async function syncCrm() {
    if (privateMode) return;
    if (!email.trim()) {
      setMsg({ type: "err", text: "Enter an email to sync to CRM." });
      return;
    }
    setBusy("crm");
    setMsg(null);
    try {
      const parts = (name ?? "").trim().split(/\s+/);
      const topBn = result.bottlenecks[0];
      const res = await sync({
        email: email.trim(),
        firstName: parts[0] || undefined,
        lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
        voltage: result.finalRounded,
        rawScore: Math.round(result.raw),
        zone: result.zone,
        teachabilityPct: Math.round(result.teachabilityFactor * 100),
        peak,
        snapshots: snapshots.length,
        chiefAim: chiefAim.text,
        topBottleneck: topBn ? `Point #${topBn.point.id}: ${topBn.point.title}` : undefined,
      });
      if (res.ok) {
        setMsg({
          type: "ok",
          text: `Synced to CRM${res.contactId ? ` · ${res.contactId.slice(0, 8)}…` : ""}. Tagged ${zoneTag(result.zone)}.`,
        });
      } else {
        setMsg({ type: "err", text: res.error });
      }
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setBusy("none");
    }
  }

  return (
    <section className="panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CloudUpload className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Cloud Sync</h2>
        </div>
        {/* Private Mode toggle */}
        <div className="flex items-center gap-2.5 rounded-md border border-border bg-muted/40 px-3 py-1.5">
          {privateMode ? (
            <Lock className="size-3.5 text-gold" />
          ) : (
            <ShieldOff className="size-3.5 text-muted-foreground" />
          )}
          <span className="text-xs font-medium">Private Mode {privateMode ? "ON" : "OFF"}</span>
          <Switch
            checked={privateMode}
            onCheckedChange={setPrivateMode}
            aria-label="Private mode"
          />
        </div>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">
        Persist this audit to the cloud. When an email is provided, live metrics (voltage, zone,
        chief aim) auto-mirror onto the CRM contact and apply the zone tag for workflow triggers.
      </p>

      {privateMode ? (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-gold/30 bg-gold/5 px-3 py-3 text-xs text-gold">
          <Lock className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <strong>Private Mode is ON.</strong> All cloud sync and CRM pushes are disabled — your
            audit data stays in this browser only. Toggle Private Mode OFF above to enable syncing.
          </span>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                CRM contact email
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={syncCrm}
              disabled={busy !== "none"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {busy === "crm" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Database className="size-4" />
              )}
              Sync to CRM
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Voltage</span>
                <span className="tabular-nums text-gold">
                  {result.finalRounded.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Zone</span>
                <span className="text-foreground">{result.zone}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Teachability</span>
                <span className="tabular-nums">{Math.round(result.teachabilityFactor * 100)}%</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Peak / snapshots</span>
                <span className="tabular-nums">
                  {peak.toLocaleString()} / {snapshots.length}
                </span>
              </div>
            </div>
            <button
              onClick={saveCloud}
              disabled={busy !== "none"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              {busy === "cloud" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CloudUpload className="size-4 text-gold" />
              )}
              Save snapshot to cloud
            </button>
          </div>
        </div>
      )}

      {msg && !privateMode && (
        <div
          className={cn(
            "mt-4 flex items-start gap-2 rounded-md px-3 py-2 text-xs",
            msg.type === "ok"
              ? "border border-gold/30 bg-gold/5 text-gold"
              : "border border-destructive/30 bg-destructive/10 text-destructive",
          )}
        >
          {msg.type === "ok" ? (
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}
    </section>
  );
}
