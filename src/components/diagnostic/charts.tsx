import { cn } from "@/lib/utils";
import type { ScoreResult } from "@/lib/diagnostic/scoring";

export function ScoreRing({ result, size = 220 }: { result: ScoreResult; size?: number }) {
  const pct = Math.max(0, Math.min(1, result.final / 10000));
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const zoneColor =
    result.zone === "operative"
      ? "var(--gold-bright)"
      : result.zone === "emergence"
        ? "var(--gold)"
        : "var(--muted-foreground)";
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={zoneColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold tabular-nums" style={{ color: zoneColor }}>
          {result.finalRounded.toLocaleString()}
        </span>
        <span className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          / 10,000
        </span>
      </div>
    </div>
  );
}

export function RadarChart({ result, size = 320 }: { result: ScoreResult; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;
  const n = result.pillars.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, rad: number) => [
    cx + Math.cos(angle(i)) * rad,
    cy + Math.sin(angle(i)) * rad,
  ];
  const dataPts = result.pillars.map((p, i) => point(i, r * p.efficiency));
  const dataPath = dataPts.map((p) => p.join(",")).join(" ");
  const thresholdPts = result.pillars.map((_, i) => point(i, r * 0.6));
  const thresholdPath = thresholdPts.map((p) => p.join(",")).join(" ");
  const grid = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <svg width={size} height={size} className="mx-auto">
      {grid.map((g) => {
        const pts = result.pillars.map((_, i) => point(i, r * g).join(",")).join(" ");
        return (
          <polygon
            key={g}
            points={pts}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
            opacity={g === 0.6 ? 0.6 : 0.3}
          />
        );
      })}
      <polygon
        points={thresholdPath}
        fill="none"
        stroke="var(--gold)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.7}
      />
      {result.pillars.map((_, i) => {
        const [x, y] = point(i, r);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth={1}
            opacity={0.4}
          />
        );
      })}
      <polygon
        points={dataPath}
        fill="var(--gold)"
        fillOpacity={0.18}
        stroke="var(--gold-bright)"
        strokeWidth={2}
      />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill="var(--gold-bright)" />
      ))}
      {result.pillars.map((p, i) => {
        const [x, y] = point(i, r + 16);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10, fontFamily: "var(--font-display)" }}
          >
            {p.roman}
          </text>
        );
      })}
    </svg>
  );
}

export function ZoneBadge({ result, className }: { result: ScoreResult; className?: string }) {
  const color =
    result.zone === "operative"
      ? "text-gold-bright border-gold/40 bg-gold/10"
      : result.zone === "emergence"
        ? "text-gold border-gold/30 bg-gold/5"
        : "text-muted-foreground border-border bg-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider",
        color,
        className,
      )}
    >
      {result.zone === "operative"
        ? "Execution"
        : result.zone === "emergence"
          ? "Emergence"
          : "Friction"}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("panel p-4", accent && "gold-glow")}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div
        className={cn("mt-2 font-display text-2xl font-bold tabular-nums", accent && "gold-text")}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
