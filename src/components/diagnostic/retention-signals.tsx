import { accountStorage } from "@/lib/diagnostic/local-storage";
// Retention / anti-churn signals panel (spec §13.4).
// Surfaces missed audits, stagnant velocity, low completion, and philosophy
// churn — each triggers a re-engagement intervention. Shown on Overview so
// the user sees their own loop health front-and-centre.

import { useDiagnostic } from "@/lib/diagnostic/context";
import { retentionSignals, loadCommitments } from "@/lib/diagnostic/protocol";
import { useEffect, useState } from "react";
import type { Commitment } from "@/lib/diagnostic/protocol";
import { AlertTriangle, CheckCircle2, Eye, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function RetentionSignals() {
  const { snapshots, philosophy } = useDiagnostic();
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  useEffect(() => {
    setCommitments(loadCommitments());
  }, [snapshots]);

  // Philosophy history is lightweight — we track switches in localStorage.
  const [philHistory, setPhilHistory] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = accountStorage.getItem("creation-philosophy-history");
      setPhilHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setPhilHistory([]);
    }
    // Record current philosophy on mount.
    try {
      const raw = accountStorage.getItem("creation-philosophy-history");
      const hist: string[] = raw ? JSON.parse(raw) : [];
      if (hist[hist.length - 1] !== philosophy) {
        const next = [...hist, philosophy].slice(-10);
        accountStorage.setItem("creation-philosophy-history", JSON.stringify(next));
        setPhilHistory(next);
      }
    } catch {
      /* ignore */
    }
  }, [philosophy]);

  const signals = retentionSignals(snapshots, commitments, philHistory);

  if (signals.risk === "none") {
    return (
      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-gold" />
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider">
            Loop Health
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          No churn signals detected. Your Creation loop is running cleanly — keep the weekly
          cadence.
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "panel p-5",
        signals.risk === "intervene" ? "border-destructive/30" : "border-gold/30",
      )}
    >
      <div className="flex items-center gap-2">
        {signals.risk === "intervene" ? (
          <AlertTriangle className="size-4 text-destructive" />
        ) : (
          <Eye className="size-4 text-gold" />
        )}
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider">
          Loop Health — {signals.risk === "intervene" ? "Needs Attention" : "Watch"}
        </h2>
      </div>
      <div className="mt-3 space-y-2">
        {signals.alerts.map((a, i) => (
          <div
            key={i}
            className={cn(
              "rounded-md border px-3 py-2",
              a.severity === "intervene"
                ? "border-destructive/30 bg-destructive/10"
                : "border-gold/30 bg-gold/5",
            )}
          >
            <div className="flex items-center gap-2">
              <Activity
                className={cn(
                  "size-3.5 shrink-0",
                  a.severity === "intervene" ? "text-destructive" : "text-gold",
                )}
              />
              <span className="text-sm font-medium text-foreground">{a.label}</span>
            </div>
            <p className="mt-1 pl-5 text-xs text-muted-foreground">{a.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
