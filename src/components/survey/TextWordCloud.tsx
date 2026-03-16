import type { TopToken } from "@/lib/survey/textInsights";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function TextWordCloud({ tokens }: { tokens: TopToken[] }) {
  if (!tokens.length) {
    return (
      <div className="rounded-[12px] border border-[var(--border)] bg-white p-3 text-[13px] text-[var(--muted)]">
        Te weinig herhaalde woorden voor een cloud.
      </div>
    );
  }

  const maxCount = Math.max(1, ...tokens.map((t) => t.count));

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-white p-3">
      <div className="mb-2 text-[12px] font-semibold tracking-[0.08em] text-[var(--faint)]">
        WOORD-CLOUD
      </div>
      <div className="flex flex-wrap gap-2">
        {tokens.map((t) => {
          const strength = t.count / maxCount;
          const fontSize = clamp(Math.round(12 + strength * 14), 12, 26);
          const alpha = clamp(0.08 + strength * 0.24, 0.08, 0.32);
          return (
            <span
              key={t.token}
              className="rounded-full px-3 py-1.5 leading-tight"
              style={{
                fontSize: `${fontSize}px`,
                background: `rgba(221,64,111,${alpha})`,
                color: "rgba(15,23,42,0.92)",
              }}
              title={`${t.count} keer genoemd`}
            >
              {t.token}
            </span>
          );
        })}
      </div>
    </div>
  );
}
