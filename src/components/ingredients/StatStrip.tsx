import type { Flavor } from "@/content/flavors";

/** Shows a label number, or a dash when it isn't confirmed yet. Never 0 or NaN for a missing value. */
export function formatStat(value: number | null, unit: string): string {
  return value === null || !Number.isFinite(value) ? "—" : `${value} ${unit}`;
}

/** One flavour's numbers per can, straight from the can label. */
export function StatStrip({ flavor }: { flavor: Flavor }) {
  const stats = [
    { label: "Caffeine", value: formatStat(flavor.caffeineMg, "mg") },
    { label: "Sugar", value: formatStat(flavor.sugarG, "g") },
    { label: "Energy", value: formatStat(flavor.kcal, "kcal") },
  ];

  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[6px] bg-border-subtle">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 bg-background-secondary px-4 py-5">
            <dt className="text-caption02 uppercase tracking-[0.25em] text-foreground-subtle">{s.label}</dt>
            <dd className="font-display text-heading02 font-bold tabular-nums" style={{ color: s.value === "—" ? undefined : flavor.color }}>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-caption01 text-foreground-subtle">
        {flavor.servingMl ? `Per ${flavor.servingMl} ml can.` : "Per can."} From the India can label.
      </p>
    </div>
  );
}
