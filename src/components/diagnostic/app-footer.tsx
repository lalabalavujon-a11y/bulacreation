import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";

/** Global app footer — shown on every authenticated route inside the main shell. */
export function AppFooter() {
  return (
    <footer className="mt-12 border-t border-border px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png"
            alt="Bula Creation Logo"
            className="size-6 rounded-sm object-contain"
          />
          <div className="leading-tight">
            <div className="font-display text-sm font-bold tracking-tight text-foreground">
              BULA CREATION
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              40-Point Algorithm
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <Link to="/terms" className="transition-colors hover:text-gold">
            Terms of Service
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-gold">
            Privacy Policy
          </Link>
          <Link to="/support" className="transition-colors hover:text-gold">
            Support
          </Link>
          <Link to="/vsl" className="transition-colors hover:text-gold">
            Watch the Method
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-5 max-w-6xl text-center text-[11px] leading-relaxed text-muted-foreground md:text-left">
        <p>
          Copyright © 2026 Bula Creation. Powered by{" "}
          <span className="font-medium text-gold-soft">Bula Creation</span>. Operated by{" "}
          <span className="font-medium text-gold-soft">Bula Group</span>.
        </p>
        <p className="mt-1 text-muted-foreground/70">
          AI Goal Execution System · Private by default · Not a substitute for professional medical
          or financial advice.
        </p>
      </div>
    </footer>
  );
}
