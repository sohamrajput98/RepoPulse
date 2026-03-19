import { useParams, Link, useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import { useChartColors } from "../hooks/useChartColors";
import { useCountUp } from "../hooks/useCountUp";
import { scoreBadgeClass } from "../utils/path";

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ label, value, colorVar, delay }) {
  const animated = useCountUp(value ?? 0, 900);
  return (
    <div
      className="card"
      style={{
        padding: "1rem 1.25rem",
        textAlign: "center",
        borderTop: `3px solid var(${colorVar})`,
        opacity: 0,
        animation: `fadeUp 0.45s ease ${delay}ms forwards`,
      }}
    >
      <p className="card-header" style={{ marginBottom: 4 }}>
        {label}
      </p>
      <span
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "1.9rem",
          fontWeight: 700,
          color: `var(${colorVar})`,
          lineHeight: 1,
        }}
      >
        {animated.toLocaleString()}
      </span>
    </div>
  );
}

/* ── Smell badge chip ────────────────────────────────────── */
function SmellBadge({ label, colors }) {
  const type = label.split(":")[0];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.22rem 0.65rem",
        borderRadius: 99,
        fontSize: "0.72rem",
        fontWeight: 600,
        background: `color-mix(in srgb, ${colors.c1} 10%, var(--bg-raise))`,
        border: `1px solid color-mix(in srgb, ${colors.c1} 25%, transparent)`,
        color: colors.c1,
      }}
    >
      {type}
    </span>
  );
}

/* ── CC severity colour ──────────────────────────────────── */
function ccColor(cc, colors) {
  if (cc > 15) return { color: colors.c1, glow: colors.glowC1 };
  if (cc > 10) return { color: colors.c3, glow: colors.glowC3 };
  if (cc > 6) return { color: colors.c5, glow: colors.glowC5 };
  return { color: colors.c2, glow: colors.glowC2 };
}

/* ── FileDetail ──────────────────────────────────────────── */
export default function FileDetail() {
  const { filePath } = useParams();
  const navigate = useNavigate();
  const { report, loading, error } = useReport();
  const colors = useChartColors();

  /* loading */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-base)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid var(--border-strong)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  /* error */
  if (error && !report)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-base)",
        }}
      >
        <div
          className="card"
          style={{ padding: "2rem", maxWidth: 380, textAlign: "center" }}
        >
          <p
            style={{
              color: "var(--score-poor)",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            {error.message}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            ← Dashboard
          </button>
        </div>
      </div>
    );

  const file = report?.files?.find(
    (f) => f.path === decodeURIComponent(filePath),
  );

  if (!file)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-base)",
        }}
      >
        <div
          className="card"
          style={{ padding: "2rem", maxWidth: 380, textAlign: "center" }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</p>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            File not found in report.
          </p>
          <button
            onClick={() => navigate("/dashboard/files")}
            className="btn-primary"
          >
            ← Files
          </button>
        </div>
      </div>
    );

  const stats = [
    { label: "Total Lines", value: file.totalLines, colorVar: "--c4" },
    { label: "Code Lines", value: file.codeLines, colorVar: "--c2" },
    { label: "Comment Lines", value: file.commentLines, colorVar: "--c6" },
    { label: "Blank Lines", value: file.blankLines, colorVar: "--text-muted" },
  ];

  const thStyle = (align = "left") => ({
    padding: "0.6rem 1rem",
    textAlign: align,
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    background: "var(--bg-raise)",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        {/* back nav */}
        <button
          onClick={() => navigate("/dashboard/files")}
          className="btn-ghost"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: "1.25rem",
            fontSize: "0.82rem",
            opacity: 0,
            animation: "fadeUp 0.35s ease forwards",
          }}
        >
          ← Back to Files
        </button>

        {/* file header card */}
        <div
          className="card"
          style={{
            padding: "1rem 1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            borderLeft: `3px solid ${scoreColor(file.healthScore, colors)}`,
            opacity: 0,
            animation: "fadeUp 0.4s ease 60ms forwards",
          }}
        >
          <h1
            style={{
              fontFamily: "Fira Code, monospace",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              wordBreak: "break-all",
            }}
          >
            {file.path}
          </h1>
          <span
            className={scoreBadgeClass(file.healthScore)}
            style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}
          >
            Score: {file.healthScore?.toFixed(1)}
          </span>
        </div>

        {/* stat cards row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.85rem",
            marginBottom: "1.25rem",
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={120 + i * 55} />
          ))}
        </div>

        {/* smell chips */}
        {file.smells?.length > 0 && (
          <div
            className="card"
            style={{
              padding: "0.85rem 1.25rem",
              marginBottom: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.5rem",
              opacity: 0,
              animation: "fadeUp 0.45s ease 340ms forwards",
            }}
          >
            <span
              className="card-header"
              style={{ marginBottom: 0, marginRight: 4 }}
            >
              Smells
            </span>
            {file.smells.map((s, i) => (
              <SmellBadge key={i} label={s} colors={colors} />
            ))}
          </div>
        )}

        {/* functions table */}
        <div
          className="card"
          style={{
            overflow: "hidden",
            opacity: 0,
            animation: "fadeUp 0.45s ease 400ms forwards",
          }}
        >
          <p
            className="card-header"
            style={{ padding: "1.25rem 1.25rem 0.5rem" }}
          >
            Functions ({file.functions?.length ?? 0})
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
                fontSize: "0.82rem",
              }}
            >
              <thead>
                <tr>
                  {[
                    ["Function", "left"],
                    ["Lines", "right"],
                    ["Start", "right"],
                    ["End", "right"],
                    ["Params", "right"],
                    ["Complexity", "right"],
                    ["Nesting", "right"],
                  ].map(([h, a]) => (
                    <th key={h} style={thStyle(a)}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.functions?.map((fn, i) => {
                  const { color: ccClr, glow: ccGlow } = ccColor(
                    fn.complexity,
                    colors,
                  );
                  const highRisk = fn.complexity > 10;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--border)",
                        background: highRisk
                          ? `color-mix(in srgb, ${colors.c1} 5%, transparent)`
                          : i % 2 === 0
                            ? "transparent"
                            : "color-mix(in srgb, var(--bg-raise) 40%, transparent)",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-raise)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = highRisk
                          ? `color-mix(in srgb, ${colors.c1} 5%, transparent)`
                          : i % 2 === 0
                            ? "transparent"
                            : "color-mix(in srgb, var(--bg-raise) 40%, transparent)";
                      }}
                    >
                      {/* function name */}
                      <td style={{ padding: "0.65rem 1rem" }}>
                        <span
                          style={{
                            fontFamily: "Fira Code, monospace",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: highRisk ? ccClr : "var(--text-primary)",
                            textShadow: highRisk ? `0 0 8px ${ccGlow}` : "none",
                          }}
                        >
                          {fn.name}
                        </span>
                      </td>
                      {/* numeric cells */}
                      {[
                        fn.lineCount,
                        fn.startLine,
                        fn.endLine,
                        fn.paramCount,
                      ].map((v, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "0.65rem 1rem",
                            textAlign: "right",
                            color: "var(--text-secondary)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {v}
                        </td>
                      ))}
                      {/* CC — styled */}
                      <td
                        style={{ padding: "0.65rem 1rem", textAlign: "right" }}
                      >
                        <span
                          style={{
                            fontFamily: "Orbitron, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            color: ccClr,
                            textShadow:
                              fn.complexity > 6 ? `0 0 8px ${ccGlow}` : "none",
                          }}
                        >
                          {fn.complexity}
                          {highRisk && (
                            <span style={{ fontSize: "0.6rem", marginLeft: 2 }}>
                              ⚠
                            </span>
                          )}
                        </span>
                      </td>
                      {/* nesting depth */}
                      <td
                        style={{
                          padding: "0.65rem 1rem",
                          textAlign: "right",
                          color:
                            fn.nestingDepth > 3
                              ? colors.c3
                              : "var(--text-secondary)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {fn.nestingDepth}
                      </td>
                    </tr>
                  );
                })}
                {!file.functions?.length && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      No function data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}

/* helper — inline score color */
function scoreColor(score, colors) {
  if (score >= 85) return colors.scoreExcellent || "var(--score-excellent)";
  if (score >= 70) return colors.scoreGood || "var(--score-good)";
  if (score >= 50) return colors.scoreFair || "var(--score-fair)";
  return colors.scorePoor || "var(--score-poor)";
}
