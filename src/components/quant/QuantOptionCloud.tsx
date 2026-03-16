import type { QuantDatum } from "@/lib/survey/quant";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function QuantOptionCloud({
  data,
  maxItems = 40,
}: {
  data: QuantDatum[];
  maxItems?: number;
}) {
  const items = data.slice(0, maxItems);
  const maxCount = Math.max(1, ...items.map((x) => x.count));

  if (!items.length) {
    return (
      <div className="rounded-[12px] border border-[var(--border)] bg-white p-3 text-[13px] text-[var(--muted)]">
        Geen data voor de cloud.
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-white p-3">
      <div className="mb-2 text-[12px] font-semibold tracking-[0.08em] text-[var(--faint)]">
        OPTIE-CLOUD
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => {
          const strength = item.count / maxCount;
          const fontSize = clamp(Math.round(12 + strength * 12), 12, 24);
          const alpha = clamp(0.1 + strength * 0.25, 0.1, 0.35);
          return (
            <span
              key={`${item.label}-${idx}`}
              className="rounded-full px-3 py-1.5 leading-tight"
              style={{
                fontSize: `${fontSize}px`,
                background: `rgba(105,197,238,${alpha})`,
                color: "rgba(15,23,42,0.92)",
              }}
              title={`${item.count} responses`}
            >
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
