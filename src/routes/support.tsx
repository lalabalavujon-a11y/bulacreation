import { createFileRoute } from "@tanstack/react-router";
import { Mail, LifeBuoy, BookOpen } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Bula Creation" },
      {
        name: "description",
        content:
          "Get help with the 40-Point Creation Algorithm — read the operating manual, contact the team, or report an issue.",
      },
      { property: "og:title", content: "Support — Bula Creation" },
      { property: "og:description", content: "How to get help with Bula Creation." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupportComponent,
});

function SupportComponent() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <header className="space-y-3">
        <div className="flex items-center gap-2.5">
          <LifeBuoy className="size-6 text-gold" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Help</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Support</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Most questions are answered in the operating manual. If something is broken or you need a
          data right exercised, reach out below.
        </p>
      </header>

      <section className="panel space-y-4 p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gold/10">
            <BookOpen className="size-4 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold">Read the Operating Manual</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The Guide is your complete playbook for the weekly audit → leverage → execute → log
              loop, plus every module in the system.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gold/10">
            <Mail className="size-4 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold">Contact the Team</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              For account, billing, or data-rights requests (access, export, deletion) email{" "}
              <a
                href="mailto:support@bulacreation.app"
                className="font-medium text-gold hover:underline"
              >
                support@bulacreation.app
              </a>
              . We aim to respond within 2 business days.
            </p>
          </div>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Reporting a bug? Include the route, what you expected, and what happened — screenshots help.
      </p>
    </div>
  );
}
