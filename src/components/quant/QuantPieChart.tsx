import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { QuantDatum } from "@/lib/survey/quant";

function formatPct(p: number) {
  return `${p.toFixed(p >= 10 ? 0 : 1)}%`;
}

export function QuantPieChart({ data }: { data: QuantDatum[] }) {
  const palette = ["#DD406F", "#69C5EE", "#BACE4B", "#FBA720", "#8B5CF6", "#22C55E"];
  const pieData = data.slice(0, 8);
  const withColor = pieData.map((item, idx) => ({
    ...item,
    color: palette[idx % palette.length],
  }));

  function short(label: string, max = 44) {
    if (label.length <= max) return label;
    return `${label.slice(0, max - 1).trimEnd()}...`;
  }

  return (
    <div className="space-y-3">
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
          <Pie
            data={withColor}
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
            {withColor.map((d) => (
              <Cell key={d.label} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid rgba(15,23,42,0.10)",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
            }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as (QuantDatum & { color?: string }) | undefined;
              if (!active || !p) return null;
              return (
                <div className="rounded-[10px] border border-[rgba(15,23,42,0.10)] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.10)]">
                  <div className="text-[12.5px] font-semibold text-[var(--text)]">
                    {String(p.label)}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-[var(--muted)]">
                    <span className="font-semibold text-[var(--text)]">{p.count}</span>{" "}
                    · {formatPct(p.pct)}
                  </div>
                </div>
              );
            }}
          />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {withColor.map((item) => (
          <div
            key={`legend-${item.label}`}
            className="flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-white px-2.5 py-1.5 text-[12.5px]"
            title={item.label}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-0 flex-1 truncate">{short(item.label)}</span>
            <span className="shrink-0 text-[var(--muted)]">{formatPct(item.pct)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
