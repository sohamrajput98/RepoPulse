import { Link } from "react-router-dom";
import { scoreBadgeClass } from "../utils/path";
import { useChartColors } from "../hooks/useChartColors";

/* ── Score → palette-aware colour ───────────────────────── */
function resolveColor(score, colors) {
  if (score >= 85) return { color: colors.c2, glow: colors.glowC2 };
  if (score >= 70) return { color: colors.c4, glow: colors.glowC2 };
  if (score >= 50) return { color: colors.c3, glow: colors.glowC3 };
  if (score >= 30) return { color: colors.c1, glow: colors.glowC1 };
  return { color: colors.c1, glow: colors.glowC1 };
}

/* ── FileColorTree ───────────────────────────────────────── */
export default function FileColorTree({ files }) {
  const colors = useChartColors();
  if (!files?.length) return null;

  const sorted = [...files].sort((a, b) => a.healthScore - b.healthScore);

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <p className="card-header">File Health Tree</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.2rem",
          maxHeight: 320,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {sorted.map((f, i) => {
          const name = f.path.split(/[\\/]/).pop();
          const s = f.healthScore ?? 0;
          const { color, glow } = resolveColor(s, colors);

          return (
            <Link
              key={i}
              to={`/file/${encodeURIComponent(f.path)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                textDecoration: "none",
                /* neon left-border accent — colour matches health */
                borderLeft: `3px solid ${color}`,
                background: "transparent",
                transition:
                  "background 0.15s, box-shadow 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-raise)";
                e.currentTarget.style.boxShadow = `inset 0 0 0 1px var(--border), 0 0 10px ${glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* colour dot */}
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 5px ${glow}`,
                  flexShrink: 0,
                }}
              />

              {/* filename */}
              <span
                style={{
                  fontFamily: "Fira Code, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {name}
              </span>

              {/* palette-aware health bar */}
              <div
                style={{
                  width: 72,
                  height: 4,
                  background: "var(--bg-raise)",
                  borderRadius: 99,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${s}%`,
                    background: color,
                    boxShadow: `0 0 4px ${glow}`,
                    borderRadius: 99,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>

              {/* new badge class score */}
              <span
                className={scoreBadgeClass(s)}
                style={{ flexShrink: 0, minWidth: 34, textAlign: "center" }}
              >
                {s.toFixed(0)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
