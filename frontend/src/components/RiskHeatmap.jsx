import { Link } from "react-router-dom";
import { useChartColors } from "../hooks/useChartColors";

/* ── Score → palette-aware colour + glow ─────────────────── */
function resolveScoreColor(score, colors) {
  if (score >= 85) return { color: colors.scoreExcellent, glow: colors.glowC2 };
  if (score >= 70) return { color: colors.scoreGood, glow: colors.glowC2 };
  if (score >= 50) return { color: colors.scoreFair, glow: colors.glowC3 };
  if (score >= 30) return { color: colors.scorePoor, glow: colors.glowC1 };
  return { color: colors.scoreCritical, glow: colors.glowC1 };
}

/* ── Legend badge chips ──────────────────────────────────── */
const LEGEND = [
  { label: "Excellent ≥85", colorKey: "scoreExcellent" },
  { label: "Good ≥70", colorKey: "scoreGood" },
  { label: "Fair ≥50", colorKey: "scoreFair" },
  { label: "Poor <50", colorKey: "scorePoor" },
];

function LegendChips({ colors }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.45rem",
        alignItems: "center",
        marginTop: "1rem",
      }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          marginRight: 2,
        }}
      >
        Score:
      </span>
      {LEGEND.map(({ label, colorKey }) => {
        const c = colors[colorKey];
        return (
          <span
            key={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.32rem",
              padding: "0.2rem 0.6rem",
              borderRadius: 99,
              fontSize: "0.7rem",
              fontWeight: 600,
              background: `color-mix(in srgb, ${c} 12%, var(--bg-raise))`,
              border: `1px solid color-mix(in srgb, ${c} 28%, transparent)`,
              color: c,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 5px ${c}99`,
                flexShrink: 0,
              }}
            />
            {label}
          </span>
        );
      })}
      <span
        style={{
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          marginLeft: 4,
        }}
      >
        · size = LOC
      </span>
    </div>
  );
}

/* ── RiskHeatmap ─────────────────────────────────────────── */
export default function RiskHeatmap({ files }) {
  const colors = useChartColors();
  if (!files?.length) return null;

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <p className="card-header">Risk Heatmap</p>
      <p
        style={{
          fontSize: "0.74rem",
          color: "var(--text-muted)",
          marginBottom: "0.9rem",
        }}
      >
        Cell size = lines of code · colour = health score · click to inspect
      </p>

      {/* cells */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        {files.map((f, i) => {
          const name = f.path.split(/[\\/]/).pop();
          const s = f.healthScore ?? 0;
          const { color, glow } = resolveScoreColor(s, colors);
          /* larger cells: min 40, max 80 based on LOC */
          const size = Math.max(40, Math.min(80, f.totalLines / 4.5));

          return (
            <Link
              key={i}
              to={`/file/${encodeURIComponent(f.path)}`}
              title={`${name}\nScore: ${s.toFixed(1)}\nLOC: ${f.totalLines}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: 10,
                  background: color,
                  opacity: 0.82,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition:
                    "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                  boxShadow: `0 2px 8px color-mix(in srgb, ${color} 28%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
                  position: "relative",
                  zIndex: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.14)";
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.boxShadow = `0 0 18px ${glow}, 0 4px 14px color-mix(in srgb, ${color} 40%, transparent)`;
                  e.currentTarget.style.zIndex = "10";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "0.82";
                  e.currentTarget.style.boxShadow = `0 2px 8px color-mix(in srgb, ${color} 28%, transparent)`;
                  e.currentTarget.style.zIndex = "1";
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontFamily: "Syne, sans-serif",
                    fontSize: size > 55 ? "0.8rem" : "0.62rem",
                    fontWeight: 700,
                    userSelect: "none",
                    textShadow: "0 1px 4px rgba(0,0,0,0.55)",
                  }}
                >
                  {s.toFixed(0)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* badge-chip legend */}
      <LegendChips colors={colors} />
    </div>
  );
}
