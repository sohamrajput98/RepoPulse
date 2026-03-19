import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { basename } from "../utils/path";
import { useChartColors } from "../hooks/useChartColors";

/* ── Themed tooltip ──────────────────────────────────────── */
function CustomTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const over = v > 10;
  return (
    <div className="chart-tooltip">
      <p
        style={{
          fontFamily: "Fira Code, monospace",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        {payload[0].payload.name}
      </p>
      <p style={{ fontSize: "0.8rem", color: over ? colors.c1 : colors.c4 }}>
        CC: <strong>{v}</strong>
      </p>
      {over && (
        <p style={{ fontSize: "0.72rem", color: colors.c1, marginTop: 3 }}>
          ⚠ Exceeds threshold (10)
        </p>
      )}
    </div>
  );
}

/* ── Gradient defs injected as a custom SVG layer ────────── */
function GradientDefs() {
  return (
    <defs>
      <linearGradient id="ccBarSafe" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--c4)" stopOpacity={0.95} />
        <stop offset="100%" stopColor="var(--c4)" stopOpacity={0.4} />
      </linearGradient>
      <linearGradient id="ccBarRisk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--c1)" stopOpacity={0.95} />
        <stop offset="100%" stopColor="var(--c1)" stopOpacity={0.4} />
      </linearGradient>
    </defs>
  );
}

export default function ComplexityChart({ files }) {
  const colors = useChartColors();

  if (!files?.length) return null;

  const data = files
    .map((f) => ({
      name: basename(f.path),
      complexity: Math.max(
        0,
        ...(f.functions?.map((fn) => fn.complexity) ?? [0]),
      ),
    }))
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 15);

  return (
    <div className="card" style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
      <p className="card-header">Cyclomatic Complexity — Top Files</p>

      {/* inject SVG gradient defs outside Recharts via a hidden svg */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <GradientDefs />
      </svg>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={data}
          margin={{ left: 0, right: 10, top: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            strokeOpacity={1}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: colors.text }}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={82}
            axisLine={{ stroke: colors.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 13, fill: colors.text }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip colors={colors} />}
            cursor={{
              fill: "color-mix(in srgb, var(--accent) 6%, transparent)",
            }}
          />
          <ReferenceLine
            y={10}
            stroke={colors.c1}
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{
              value: "threshold",
              fontSize: 13,
              fill: colors.c1,
              position: "insideTopRight",
            }}
          />
          <Bar
            dataKey="complexity"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.complexity > 10 ? "url(#ccBarRisk)" : "url(#ccBarSafe)"}
                style={{
                  filter:
                    d.complexity > 10
                      ? `drop-shadow(0 0 4px ${colors.glowC1})`
                      : "none",
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
