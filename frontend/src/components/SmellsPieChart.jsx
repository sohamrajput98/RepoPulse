import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useChartColors } from "../hooks/useChartColors";

/* ── Themed tooltip ──────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <p
        style={{
          fontWeight: 600,
          color: "var(--text-primary)",
          fontSize: "0.8rem",
          marginBottom: 3,
        }}
      >
        {name}
      </p>
      <p style={{ color, fontSize: "0.8rem" }}>
        <strong>{value}</strong> occurrence{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

/* ── Custom badge-chip legend ────────────────────────────── */
function ChipLegend({ data }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.45rem",
        justifyContent: "center",
        marginTop: "0.9rem",
      }}
    >
      {data.map((d, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.38rem",
            padding: "0.22rem 0.65rem",
            borderRadius: 99,
            fontSize: "0.72rem",
            fontWeight: 600,
            background: `color-mix(in srgb, ${d.color} 12%, var(--bg-raise))`,
            border: `1px solid color-mix(in srgb, ${d.color} 32%, transparent)`,
            color: d.color,
            transition: "box-shadow 0.18s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 10px color-mix(in srgb, ${d.color} 45%, transparent)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* color dot with glow */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: d.color,
              boxShadow: `0 0 5px ${d.color}99`,
              flexShrink: 0,
            }}
          />

          {/* smell type name */}
          {d.name}

          {/* count badge */}
          <span
            style={{
              marginLeft: 2,
              background: `color-mix(in srgb, ${d.color} 22%, transparent)`,
              padding: "0 0.35rem",
              borderRadius: 99,
              fontSize: "0.65rem",
              fontWeight: 700,
            }}
          >
            {d.value}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ── SmellsPieChart ──────────────────────────────────────── */
export default function SmellsPieChart({ files }) {
  /* palette-reactive: re-resolves when theme/palette changes */
  const colors = useChartColors();

  /* palette in order: most alarming first */
  const PALETTE = [
    colors.c1,
    colors.c3,
    colors.c6,
    colors.c4,
    colors.c5,
    colors.c2,
  ];

  if (!files?.length) return null;

  /* aggregate smell counts */
  const counts = {};
  files.forEach((f) =>
    f.smells?.forEach((s) => {
      const key = s.split(":")[0];
      counts[key] = (counts[key] || 0) + 1;
    }),
  );

  const data = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]) // most frequent first
    .map(([name, value], i) => ({
      name,
      value,
      color: PALETTE[i % PALETTE.length],
    }));

  /* empty state */
  if (!data.length)
    return (
      <div
        className="card"
        style={{
          padding: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: 6 }}>🎉</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No smells detected
          </p>
        </div>
      </div>
    );

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={120}
            dataKey="value"
            paddingAngle={3}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            strokeWidth={0}
          >
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.color}
                stroke="transparent"
                style={{
                  /* neon glow on each slice */
                  filter: `drop-shadow(0 0 5px ${d.color}88)`,
                  transition: "filter 0.2s ease",
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* badge-chip legend — palette-reactive */}
      <ChipLegend data={data} />
    </div>
  );
}
