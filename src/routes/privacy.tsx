import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bula Creation" },
      {
        name: "description",
        content:
          "Privacy Policy for the 40-Point Creation Algorithm — how your audit data, Chief Aim, and coaching history are stored and protected.",
      },
      { property: "og:title", content: "Privacy Policy — Bula Creation" },
      { property: "og:description", content: "How Bula Creation handles your data." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyComponent,
});

function PrivacyComponent() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <header className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Lock className="size-6 text-gold" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Legal</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: 27 September 2026</p>
      </header>

      <section className="panel space-y-3 p-6">
        <p className="text-sm text-muted-foreground">
          Bula Creation is built <strong>private by default</strong>. This policy explains what we
          collect, how it is used, and the controls you have.
        </p>
        {[
          {
            t: "1. What We Collect",
            b: "Your name and email (used as your identity), your 40-point audit scores, Chief Aim and related intake fields, trajectory snapshots, AI coaching transcripts (session-only unless you choose to log them), and subscription status.",
          },
          {
            t: "2. Local vs Cloud Storage",
            b: "By default your data is stored locally in your browser. When you enable Cloud Sync, your audit and snapshots are mirrored to your CRM contact record and persistent database storage. You can disable Cloud Sync at any time to return to local-only operation.",
          },
          {
            t: "3. AI Coaching",
            b: "When you use the AI Coach, your live score, Chief Aim, bottlenecks, and open commitments are injected as context to personalise guidance. Conversations are processed by our AI provider to generate responses. We do not sell your data.",
          },
          {
            t: "4. CRM Integration",
            b: "If Cloud Sync is enabled, your Creation Voltage, zone, Chief Aim, and top bottleneck are written to your contact record to support automations you control. This is for your benefit, not third-party sale.",
          },
          {
            t: "5. Data Retention",
            b: "Local data persists until you clear your browser storage. Cloud-synced data is retained while your account is active and can be deleted on request.",
          },
          {
            t: "6. Your Rights",
            b: "You may access, export, or request deletion of your data at any time. Contact support to exercise these rights.",
          },
          {
            t: "7. Security",
            b: "Identity is established without a password. Secrets and API keys are stored server-side and never exposed to the browser bundle.",
          },
          {
            t: "8. Children",
            b: "The Service is not directed to anyone under 16. We do not knowingly collect data from minors.",
          },
        ].map((s) => (
          <div key={s.t}>
            <h2 className="font-display text-sm font-semibold text-gold-soft">{s.t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.b}</p>
          </div>
        ))}
      </section>

      <Link
        to="/support"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-bright"
      >
        Need to exercise a data right? Contact Support →
      </Link>
    </div>
  );
}
