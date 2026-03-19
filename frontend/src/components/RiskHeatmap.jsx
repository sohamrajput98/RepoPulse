import { Link } from "react-router-dom";
import { useChartColors } from "../hooks/useChartColors";
import { useState } from "react";

/* ── Score → palette-aware colour + glow ─────────────────── */
function resolveScoreColor(score, colors) {
  if (score >= 85) return { color: colors.c2, glow: colors.glowC2 };
  if (score >= 70) return { color: colors.c4, glow: colors.glowC2 };
  if (score >= 50) return { color: colors.c3, glow: colors.glowC3 };
  if (score >= 30) return { color: colors.c1, glow: colors.glowC1 };
  return { color: colors.c1, glow: colors.glowC1 };
}

/* ── Legend badge chips ──────────────────────────────────── */
const LEGEND = [
  { label: "Excellent ≥85", colorKey: "c2" },
  { label: "Good ≥70", colorKey: "c4" },
  { label: "Fair ≥50", colorKey: "c3" },
  { label: "Poor <50", colorKey: "c1" },
];

function LegendChips({ colors }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "0.75rem",
        borderTop: "1px solid var(--border)",
        marginTop: "1rem",
      }}
    >
      {LEGEND.map(({ label, colorKey }) => {
        const c = colors[colorKey];
        return (
          <span
            key={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.25rem 0.7rem",
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
    </div>
  );
}

/* ── RiskHeatmap ─────────────────────────────────────────── */
export default function RiskHeatmap({ files }) {
  const colors = useChartColors();
  const [view, setView] = useState("grid"); // toggle between grid and list

  if (!files?.length) return null;

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <p className="card-header">Risk Heatmap</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setView("grid")}
            style={{
              fontSize: "0.7rem",
              padding: "0.5rem 0.6rem",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: view === "grid" ? "var(--bg-raise)" : "transparent",
              cursor: "pointer",
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            style={{
              fontSize: "0.7rem",
              padding: "0.25rem 0.6rem",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: view === "list" ? "var(--bg-raise)" : "transparent",
              cursor: "pointer",
            }}
          >
            List
          </button>
        </div>
      </div>

      {view === "grid" ? (
        /* Grid view */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {files.map((f, i) => {
            const name = f.path.split(/[\\/]/).pop();
            const s = f.healthScore ?? 0;
            const { color } = resolveScoreColor(s, colors);

            return (
              <Link
                key={i}
                to={`/file/${encodeURIComponent(f.path)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: color,
                    borderRadius: 10,
                    padding: "0.75rem",
                    textAlign: "center",
                    color: "#fff",
                    fontFamily: "Orbitron, sans-serif",
                    fontWeight: 700,
                    transition: "transform 0.2s ease",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div style={{ fontSize: "1rem" }}>{s.toFixed(0)}</div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "0.25rem",
                      textShadow: "0 1px 4px rgba(0,0,0,0.55)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* List view */
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <th style={{ padding: "0.4rem" }}>File</th>
              <th style={{ padding: "0.4rem" }}>LOC</th>
              <th style={{ padding: "0.4rem" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f, i) => {
              const name = f.path.split(/[\\/]/).pop();
              const s = f.healthScore ?? 0;
              const { color } = resolveScoreColor(s, colors);

              return (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.4rem", wordBreak: "break-word" }}>
                    {name}
                  </td>
                  <td style={{ padding: "0.4rem" }}>{f.totalLines}</td>
                  <td style={{ padding: "0.4rem", color }}>{s.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* legend */}
      <LegendChips colors={colors} />
    </div>
  );
}
