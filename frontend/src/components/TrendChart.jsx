import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { useReport } from "../context/ReportContext";
import { generateTrendData } from "../utils/insights";

/* ── Themed tooltip ──────────────────────────────────────── */
function CustomTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const c =
    v >= 85
      ? colors.scoreExcellent
      : v >= 70
        ? colors.scoreGood
        : v >= 50
          ? colors.scoreFair
          : colors.scorePoor;
  return (
    <div className="chart-tooltip">
      <p
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: c,
          lineHeight: 1,
        }}
      >
        {v}
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
        >
          {" "}
          / 100
        </span>
      </p>
      {payload[0].payload.repo && (
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: 3,
          }}
        >
          {payload[0].payload.repo}
        </p>
      )}
      <p
        style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 1 }}
      >
        {payload[0].payload.week}
      </p>
    </div>
  );
}

export default function TrendChart({ score }) {
  const colors = useChartColors();
  const { history } = useReport();

  /* ── Build trend data ─────────────────────────────────
       Real history (≥2 entries from ReportContext localStorage)
       → use it.  Otherwise fall back to generated data.    */
  const isReal = history.length >= 2;

  const trendData = (() => {
    if (isReal) {
      return [...history]
        .reverse() // oldest → newest
        .map((h) => ({
          week: new Date(h.analyzedAt).toLocaleDateString("en", {
            month: "short",
            day: "numeric",
          }),
          score: Math.round(h.score ?? 0),
          repo: h.repo,
        }));
    }
    return generateTrendData(score ?? 72).map((d) => ({ ...d }));
  })();

  /* score-based line colour */
  const s = score ?? 0;
  const lineColor =
    s >= 85
      ? colors.scoreExcellent
      : s >= 70
        ? colors.scoreGood
        : s >= 50
          ? colors.scoreFair
          : colors.scorePoor;

  return (
    <div className="card" style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
      {/* header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <p className="card-header" style={{ marginBottom: 0 }}>
          Health Score Trend
        </p>
        {!isReal && (
          <span
            style={{
              fontSize: "0.67rem",
              color: "var(--text-muted)",
              background: "var(--bg-raise)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "0.15rem 0.55rem",
              whiteSpace: "nowrap",
            }}
          >
            simulated · run more analyses for real data
          </span>
        )}
        {isReal && (
          <span
            style={{
              fontSize: "0.67rem",
              color: "var(--score-excellent)",
              background:
                "color-mix(in srgb, var(--score-excellent) 10%, var(--bg-raise))",
              border:
                "1px solid color-mix(in srgb, var(--score-excellent) 25%, transparent)",
              borderRadius: 99,
              padding: "0.15rem 0.55rem",
              whiteSpace: "nowrap",
            }}
          >
            ● {history.length} real data point{history.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* gradient defs injected outside Recharts — same pattern as ComplexityChart */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.38} />
            <stop offset="75%" stopColor={lineColor} stopOpacity={0.06} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={190}>
        <AreaChart
          data={trendData}
          margin={{ left: 0, right: 10, top: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: colors.text }}
            axisLine={{ stroke: colors.grid }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: colors.text }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip colors={colors} />} />
          <ReferenceLine
            y={70}
            stroke={colors.scoreFair}
            strokeDasharray="4 2"
            strokeWidth={1.5}
            label={{
              value: "target",
              fontSize: 9,
              fill: colors.scoreFair,
              position: "insideTopRight",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={lineColor}
            strokeWidth={2.5}
            fill="url(#trendAreaGrad)"
            dot={{
              fill: lineColor,
              r: 3.5,
              strokeWidth: 0,
              style: { filter: `drop-shadow(0 0 4px ${lineColor}99)` },
            }}
            activeDot={{
              r: 6,
              fill: lineColor,
              stroke: "var(--bg-card)",
              strokeWidth: 2,
            }}
            isAnimationActive
            animationDuration={1100}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
