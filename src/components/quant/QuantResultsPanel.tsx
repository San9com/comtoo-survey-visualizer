import type { Question } from "@/lib/types";
import { computeQuant, pickQuantVisual } from "@/lib/survey/quant";
import { QuantBarChart } from "@/components/quant/QuantBarChart";
import { QuantPieChart } from "@/components/quant/QuantPieChart";

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
  const fullData = result.data.map((d) => ({ ...d, label: tr(d.label) }));
  const top = fullData.slice(0, 12);
  const topData = top.map((d) => ({ ...d, label: tr(d.label) }));
  const top3Share = fullData.slice(0, 3).reduce((s, d) => s + d.pct, 0);
  const missingCount = Math.max(0, result.responseCount - result.answeredCount);

  const maxBars = 14;
  const chartData =
    fullData.length > maxBars
      ? [
          ...fullData.slice(0, maxBars),
          {
            label: "Overig",
            count: fullData.slice(maxBars).reduce((s, d) => s + d.count, 0),
            pct: fullData.slice(maxBars).reduce((s, d) => s + d.pct, 0),
          },
        ]
      : fullData;
  const visual = pickQuantVisual(chartData);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[var(--radius-sm)] bg-[var(--bg)] p-4">
          <div className="text-[13px] font-semibold">Verdeling</div>
          <div className="mt-1 text-[12.5px] text-[var(--muted)]">
            Percentages zijn berekend per reactie (n={result.responseCount}
            {missingCount ? `, ${missingCount} leeg` : ""}).
          </div>
          <div className="mt-3">
            {visual === "pie" ? (
              <QuantPieChart data={chartData} />
            ) : (
              <QuantBarChart data={chartData} />
            )}
          </div>
          {fullData.length > maxBars ? (
            <div className="mt-2 text-[12.5px] text-[var(--muted)]">
              We tonen top {maxBars} + &ldquo;Overig&rdquo; voor leesbaarheid.
            </div>
          ) : null}
          <div className="mt-2 text-[12.5px] text-[var(--muted)]">
            {question.type === "multiple_choice" ? (
              <>
                Top 3 opties samen: {formatPct(top3Share)} van alle reacties (meerkeuze kan boven
                100% uitkomen).
              </>
            ) : (
              <>Top 3 opties vertegenwoordigen {formatPct(top3Share)} van alle reacties.</>
            )}
          </div>
          <details className="mt-3 rounded-[12px] bg-white p-3">
            <summary className="cursor-pointer text-[12.5px] font-medium text-[var(--text)]">
              Controle / onderbouwing
            </summary>
            <div className="mt-2 text-[12.5px] leading-6 text-[var(--muted)]">
              <div>
                <span className="font-medium text-[var(--text)]">n</span> = totaal aantal
                reacties ({result.responseCount}). Lege antwoorden tellen mee in het
                percentage‑basis.
              </div>
              <div className="mt-1">
                <span className="font-medium text-[var(--text)]">Berekening</span>: %
                = (aantal / n) × 100.
              </div>
              {missingCount ? (
                <div className="mt-1">
                  <span className="font-medium text-[var(--text)]">Leeg</span>: {missingCount}{" "}
                  reacties zonder antwoord.
                </div>
              ) : null}
            </div>
            <div className="mt-3 overflow-hidden rounded-[10px] border border-black/[0.06]">
              <div className="grid grid-cols-[1fr_80px_70px] gap-2 bg-[var(--bg)] px-3 py-2 text-[12px] font-semibold text-[var(--muted)]">
                <div>Optie</div>
                <div className="text-right">Aantal</div>
                <div className="text-right">%</div>
              </div>
              <div className="divide-y divide-black/[0.06]">
                {fullData.map((d) => (
                  <div
                    key={`audit-${d.label}`}
                    className="grid grid-cols-[1fr_80px_70px] gap-2 px-3 py-2 text-[12.5px]"
                  >
                    <div className="min-w-0 truncate" title={d.label}>
                      {d.label}
                    </div>
                    <div className="text-right font-medium text-[var(--text)]">
                      {d.count}
                    </div>
                    <div className="text-right text-[var(--muted)]">{formatPct(d.pct)}</div>
                  </div>
                ))}
                {!fullData.length ? (
                  <div className="px-3 py-3 text-[12.5px] text-[var(--muted)]">
                    Geen antwoorden gevonden voor deze vraag.
                  </div>
                ) : null}
              </div>
            </div>
          </details>
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

