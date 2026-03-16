import type { Question } from "@/lib/types";
import { computeQuant } from "@/lib/survey/quant";
import { QuantBarChart } from "@/components/quant/QuantBarChart";
import { QuantPareto } from "@/components/quant/QuantPareto";

function formatPct(p: number) {
  return `${p.toFixed(p >= 10 ? 0 : 1)}%`;
}

export function QuantResultsPanel({
  question,
  rows,
  translateLabel,
}: {
  question: Question;
  rows: Record<string, string>[];
  translateLabel?: (s: string) => string;
}) {
  const result = computeQuant(question, rows);
  if (!result) return null;

  const tr = translateLabel ?? ((s: string) => s);
  const top = result.data.slice(0, 12);
  const chartData = result.data.map((d) => ({ ...d, label: tr(d.label) }));
  const topData = top.map((d) => ({ ...d, label: tr(d.label) }));
  const manyOptions = result.data.length > 14;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] p-4">
          <div className="text-[13px] font-semibold">Verdeling</div>
          <div className="mt-1 text-[12.5px] text-[var(--muted)]">
            Percentages zijn berekend per reactie (n={result.responseCount}).
          </div>
          <div className="mt-3">
            {manyOptions ? (
              <QuantPareto data={chartData} topN={10} />
            ) : (
              <QuantBarChart data={chartData} />
            )}
          </div>
          {result.data.length > 30 ? (
            <div className="mt-2 text-[12.5px] text-[var(--muted)]">
              We tonen de top 30 opties voor leesbaarheid.
            </div>
          ) : null}
          {manyOptions ? (
            <div className="mt-2 text-[12.5px] text-[var(--muted)]">
              Tip: bij veel opties vatten we samen als top 10 + “Overig” (Pareto).
            </div>
          ) : null}
        </div>

        <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-white p-4">
          <div className="text-[12px] font-semibold tracking-[0.12em] text-[var(--faint)]">
            SAMENVATTING
          </div>
          <div className="mt-3 space-y-2">
            {topData.map((d) => (
              <div
                key={d.label}
                className="flex items-baseline justify-between gap-3"
              >
                <div className="min-w-0 truncate text-[13px]">{d.label}</div>
                <div className="shrink-0 text-right text-[12.5px] text-[var(--muted)]">
                  <span className="font-semibold text-[var(--text)]">
                    {d.count}
                  </span>{" "}
                  · {formatPct(d.pct)}
                </div>
              </div>
            ))}
            {!top.length ? (
              <div className="text-[13px] text-[var(--muted)]">
                Geen antwoorden gevonden voor deze vraag.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

