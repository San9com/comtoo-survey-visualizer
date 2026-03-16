import {
  Bar,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuantDatum } from "@/lib/survey/quant";

type ParetoDatum = QuantDatum & { cumPct: number };

function formatPct(p: number) {
  return `${p.toFixed(p >= 10 ? 0 : 1)}%`;
}

export function QuantPareto({
  data,
  topN = 10,
}: {
  data: QuantDatum[];
  topN?: number;
}) {
  const palette = ["#DD406F", "#69C5EE", "#BACE4B", "#FBA720"];
  const top = data.slice(0, topN);
  const otherCount = data.slice(topN).reduce((s, d) => s + d.count, 0);
  const total = data.reduce((s, d) => s + d.count, 0) || 1;

  const combined: QuantDatum[] =
    otherCount > 0
      ? [...top, { label: "Overig", count: otherCount, pct: (otherCount / total) * 100 }]
      : top;

  const pareto: ParetoDatum[] = combined.reduce<ParetoDatum[]>((acc, d) => {
    const prev = acc.length ? acc[acc.length - 1]!.cumPct : 0;
    const next = Math.min(100, prev + d.pct);
    acc.push({ ...d, cumPct: next });
    return acc;
  }, []);

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={pareto} margin={{ top: 10, right: 18, bottom: 8, left: 8 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(71,85,105,0.9)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(15,23,42,0.10)" }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={70}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "rgba(71,85,105,0.9)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(15,23,42,0.10)" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: "rgba(71,85,105,0.9)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid rgba(15,23,42,0.10)",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
            }}
            formatter={(value, name, item) => {
              const key = String(name ?? "");
              const v = typeof value === "number" ? value : Number(value);
              if (key === "cumPct") return [formatPct(v), "Cumulatief"] as const;
              const pct = ((item?.payload as unknown as { pct?: number } | undefined)?.pct ?? 0);
              return [`${v} (${formatPct(pct)})`, "Aantal"] as const;
            }}
          />
          <Bar yAxisId="left" dataKey="count" radius={[10, 10, 10, 10]}>
            {pareto.map((d, idx) => (
              <Cell key={d.label} fill={palette[idx % palette.length]} />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumPct"
            stroke="rgba(15,23,42,0.55)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

