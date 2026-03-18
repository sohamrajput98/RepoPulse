import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useChartColors } from "../hooks/useChartColors";
import { useMemo } from "react";

/* ── Generate stable fake commit data from report metadata ── */
function generateCommitData(seed) {
  const weeks = ["8w", "7w", "6w", "5w", "4w", "3w", "2w", "1w", "Now"];
  let rng = seed;
  const next = () => {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(rng) / 0x7fffffff;
  };
  return weeks.map((w, i) => ({
    week: w,
    commits: Math.round(2 + next() * 14 + (i / weeks.length) * 4),
  }));
}

/* ── Tooltip ─────────────────────────────────────────────── */
function CustomTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ fontWeight: 700, color: colors.c4, fontSize: "0.9rem" }}>
        {payload[0].value} commits
      </p>
      <p
        style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}
      >
        {payload[0].payload.week} ago
      </p>
    </div>
  );
}

/* ── CommitActivityChart ─────────────────────────────────── */
export default function CommitActivityChart({ report }) {
  const colors = useChartColors();

  /* seed from report metadata for stable fake data */
  const seed = useMemo(() => {
    const s = report?.summary?.totalLOC ?? 42837;
    return (s * 6364136223846793005 + 1442695040888963407) | 0;
  }, [report?.summary?.totalLOC]);

  const data = useMemo(() => generateCommitData(seed), [seed]);
  const peak = Math.max(...data.map((d) => d.commits));

  return (
    <div className="card" style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <p className="card-header" style={{ marginBottom: 0 }}>
          Commit Activity
        </p>
        <span
          style={{
            fontSize: "0.67rem",
            color: "var(--text-muted)",
            background: "var(--bg-raise)",
            border: "1px solid var(--border)",
            borderRadius: 99,
            padding: "0.15rem 0.55rem",
          }}
        >
          simulated · last 9 weeks
        </span>
      </div>

      {/* gradient defs via hidden svg */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="commitBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.c4} stopOpacity={0.95} />
            <stop offset="100%" stopColor={colors.c4} stopOpacity={0.35} />
          </linearGradient>
          <linearGradient id="commitPeakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.c2} stopOpacity={0.95} />
            <stop offset="100%" stopColor={colors.c2} stopOpacity={0.35} />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 6, bottom: 0 }}>
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
            tick={{ fontSize: 10, fill: colors.text }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip colors={colors} />}
            cursor={{
              fill: "color-mix(in srgb, var(--accent) 6%, transparent)",
            }}
          />
          <Bar
            dataKey="commits"
            radius={[5, 5, 0, 0]}
            isAnimationActive
            animationDuration={900}
          >
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.commits === peak
                    ? "url(#commitPeakGrad)"
                    : "url(#commitBarGrad)"
                }
                style={{
                  filter:
                    d.commits === peak
                      ? `drop-shadow(0 0 5px ${colors.glowC2})`
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
