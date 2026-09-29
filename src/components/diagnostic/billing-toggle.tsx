// Shared monthly/annual billing toggle — noir-gold, semantic tokens only.
// Lifts the billing cycle state to the parent so pricing cards and checkout
// links can react to it. Annual shows the per-month-equivalent and a savings
// badge derived from the plan data.
import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/lib/diagnostic/subscription";

export interface BillingToggleProps {
  billing: BillingCycle;
  onChange: (b: BillingCycle) => void;
  /** Savings percentage to badge (defaults to 17). */
  savingsPct?: number;
  className?: string;
}

export function BillingToggle({
  billing,
  onChange,
  savingsPct = 17,
  className,
}: BillingToggleProps) {
  const yearly = billing === "yearly";
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.05em] transition-colors",
          yearly ? "text-muted-foreground" : "text-foreground",
        )}
      >
        Monthly
      </span>

      <button
        type="button"
        onClick={() => onChange(yearly ? "monthly" : "yearly")}
        aria-label="Toggle billing cycle"
        aria-pressed={yearly}
        className={cn(
          "relative h-[26px] w-12 shrink-0 rounded-full border-none p-0 transition-colors",
          yearly ? "bg-gold" : "bg-secondary",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] block size-5 rounded-full bg-background transition-[left] duration-200",
            yearly ? "left-[25px]" : "left-[3px]",
          )}
        />
      </button>

      <span className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.05em] transition-colors",
            yearly ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Annual
        </span>
        <span
          className={cn(
            "rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[11px] font-bold tracking-[0.05em] text-gold transition-opacity",
            yearly ? "opacity-100" : "opacity-40",
          )}
        >
          Save {savingsPct}%
        </span>
      </span>
    </div>
  );
}
