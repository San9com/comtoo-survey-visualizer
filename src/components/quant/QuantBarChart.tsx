import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuantDatum } from "@/lib/survey/quant";

function formatPct(p: number) {
  return `${p.toFixed(p >= 10 ? 0 : 1)}%`;
}

function shortenLabel(label: string, max = 52) {
  const s = (label ?? "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trimEnd()}...`;
}

export function QuantBarChart({ data }: { data: QuantDatum[] }) {
  const palette = ["#DD406F", "#69C5EE", "#BACE4B", "#FBA720"];
  const visible = data.slice(0, 30);
  const chartHeight = Math.max(320, Math.min(760, visible.length * 34));
  // Editorial chart styling: quiet grid, readable labels, no dashboard gloss.
  return (
    <div className="w-full" style={{ height: `${chartHeight}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={visible}
          margin={{ top: 8, right: 18, bottom: 8, left: 8 }}
        >
          <CartesianGrid stroke="rgba(15,23,42,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "rgba(71,85,105,0.9)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(15,23,42,0.10)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={280}
            tick={{ fill: "rgba(15,23,42,0.86)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(label: string) => shortenLabel(label)}
          />
          <Tooltip
            cursor={{ fill: "rgba(124,199,255,0.10)" }}
            contentStyle={{
              background: "white",
              border: "1px solid rgba(15,23,42,0.10)",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
            }}
            labelStyle={{ color: "rgba(15,23,42,0.9)", fontWeight: 600 }}
            formatter={(value: unknown, _name, item) => {
              const v = typeof value === "number" ? value : Number(value);
              const pct = (item?.payload?.pct as number) ?? 0;
              return [`${v} (${formatPct(pct)})`, "Responses"];
            }}
          />
          <Bar
            dataKey="count"
            stroke="rgba(15,23,42,0.18)"
            strokeWidth={1}
            radius={[8, 8, 8, 8]}
          >
            {visible.map((_, idx) => (
              <Cell key={idx} fill={palette[idx % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

