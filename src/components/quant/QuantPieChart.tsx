import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { QuantDatum } from "@/lib/survey/quant";

function formatPct(p: number) {
  return `${p.toFixed(p >= 10 ? 0 : 1)}%`;
}

export function QuantPieChart({ data }: { data: QuantDatum[] }) {
  const palette = ["#DD406F", "#69C5EE", "#BACE4B", "#FBA720", "#8B5CF6", "#22C55E"];
  const pieData = data.slice(0, 8);

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={118}
            paddingAngle={2}
            stroke="rgba(15,23,42,0.10)"
            strokeWidth={1}
          >
            {pieData.map((d, idx) => (
              <Cell key={d.label} fill={palette[idx % palette.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid rgba(15,23,42,0.10)",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
            }}
            formatter={(value: unknown, _name, item) => {
              const v = typeof value === "number" ? value : Number(value);
              const pct = (item?.payload?.pct as number) ?? 0;
              return [`${v} (${formatPct(pct)})`, "Aantal"];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
