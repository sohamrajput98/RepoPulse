import { useReport } from "../context/ReportContext";
import { useChartColors } from "../hooks/useChartColors";
import { scoreBadgeClass, scoreColorVar, basename } from "../utils/path";
import {
  getAISuggestions,
  getOptimizationHints,
  getDeadCodeHints,
  getMagicNumbers,
  getDuplicateFunctions,
  getUnusedVarHints,
} from "../utils/insights";

/* ── Section wrapper ─────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "2rem", pageBreakInside: "avoid" }}>
      <h2
        style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          borderBottom: "2px solid #333",
          paddingBottom: "0.4rem",
          marginBottom: "1rem",
          color: "#111",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Score bar ───────────────────────────────────────────── */
function ScoreBar({ label, value, max = 100, color = "#039be5" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.78rem",
          marginBottom: 3,
        }}
      >
        <span style={{ color: "#333" }}>{label}</span>
        <span style={{ fontWeight: 700, color: "#111" }}>{value}</span>
      </div>
      <div
        style={{
          height: 6,
          background: "#e5e7eb",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  );
}

/* ── PrintReport ─────────────────────────────────────────── */
export default function PrintReport() {
  const { report } = useReport();
  if (!report) return null;

  const { summary, files = [] } = report;
  const score = summary?.healthScore ?? 0;
  const allFns = files.flatMap((f) =>
    (f.functions ?? []).map((fn) => ({
      ...fn,
      file: basename(f.path),
      filePath: f.path,
    })),
  );
  const topFns = [...allFns]
    .sort((a, b) => b.complexity - a.complexity)
    .slice(0, 15);
  const aiSuggs = getAISuggestions(files, score);
  const optHints = getOptimizationHints(files);
  const deadHints = getDeadCodeHints(files);
  const magicHints = getMagicNumbers(files);
  const dupeHints = getDuplicateFunctions(files);
  const unusedHints = getUnusedVarHints(files);

  /* smell counts */
  const smellCounts = {};
  files.forEach((f) =>
    f.smells?.forEach((s) => {
      const k = s.split(":")[0];
      smellCounts[k] = (smellCounts[k] || 0) + 1;
    }),
  );
  const smellEntries = Object.entries(smellCounts).sort((a, b) => b[1] - a[1]);
  const totalSmells = Object.values(smellCounts).reduce((s, n) => s + n, 0);

  /* score color for print */
  const scoreCol =
    score >= 85
      ? "#43a047"
      : score >= 70
        ? "#039be5"
        : score >= 50
          ? "#fb8c00"
          : "#e53935";

  return (
    <div id="print-report" style={{ display: "none" }}>
      {/* ── HEADER ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          borderBottom: "3px solid #111",
          paddingBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "#111",
            marginBottom: "0.4rem",
          }}
        >
          ⚡ RepoPulse — Code Health Report
        </h1>
        <p style={{ color: "#555", fontSize: "0.85rem" }}>
          {summary?.repoName ?? "Repository"} · Generated{" "}
          {new Date().toLocaleString()}
        </p>
      </div>

      {/* ── 1. HEALTH SUMMARY ── */}
      <Section title="1. Health Summary">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {[
            {
              label: "Health Score",
              value: `${score.toFixed(1)} / 100`,
              color: scoreCol,
            },
            {
              label: "Total Files",
              value: summary?.totalFiles,
              color: "#039be5",
            },
            {
              label: "Total LOC",
              value: summary?.totalLOC?.toLocaleString(),
              color: "#43a047",
            },
            {
              label: "Functions",
              value: summary?.totalFunctions,
              color: "#7e57c2",
            },
            {
              label: "Total Smells",
              value: summary?.totalSmells,
              color: "#e53935",
            },
            {
              label: "Avg Complexity",
              value: summary?.averageComplexity?.toFixed(1),
              color: "#fb8c00",
            },
            {
              label: "Health Label",
              value: summary?.healthLabel,
              color: scoreCol,
            },
            {
              label: "Skipped Files",
              value: summary?.skippedFiles ?? 0,
              color: "#888",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "0.65rem 0.85rem",
                borderTop: `3px solid ${color}`,
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Score breakdown penalties */}
        {summary?.scoreBreakdown && (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "0.85rem",
            }}
          >
            <p
              style={{
                fontSize: "0.72rem",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.6rem",
              }}
            >
              Score Penalties
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              {Object.entries(summary.scoreBreakdown).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.82rem",
                    padding: "0.3rem 0.6rem",
                    background: "#fff5f5",
                    borderRadius: 6,
                    border: "1px solid #fee2e2",
                  }}
                >
                  <span style={{ color: "#555", textTransform: "capitalize" }}>
                    {k.replace("Penalty", "")}
                  </span>
                  <span style={{ fontWeight: 700, color: "#e53935" }}>
                    −{v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── 2. SMELL DISTRIBUTION ── */}
      <Section title="2. Code Smell Distribution">
        <div
          style={{
            marginBottom: "0.75rem",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "#e53935",
            }}
          >
            {totalSmells}
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              color: "#555",
              alignSelf: "flex-end",
              marginBottom: 3,
            }}
          >
            total smells across all files
          </span>
        </div>
        {smellEntries.map(([type, count]) => (
          <ScoreBar
            key={type}
            label={type}
            value={count}
            max={smellEntries[0]?.[1] ?? 1}
            color="#e53935"
          />
        ))}
      </Section>

      {/* ── 3. FILE RISK TABLE ── */}
      <Section title="3. File Risk Analysis">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.78rem",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              {[
                "File",
                "LOC",
                "Code Lines",
                "Functions",
                "Max CC",
                "Smells",
                "Score",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.45rem 0.6rem",
                    textAlign: "left",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#666",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...files]
              .sort((a, b) => a.healthScore - b.healthScore)
              .map((f, i) => {
                const maxCC = Math.max(
                  0,
                  ...(f.functions?.map((fn) => fn.complexity) ?? [0]),
                );
                const sColor =
                  f.healthScore >= 70
                    ? "#43a047"
                    : f.healthScore >= 50
                      ? "#fb8c00"
                      : "#e53935";
                return (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      background:
                        f.healthScore < 50 ? "#fff5f5" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.4rem 0.6rem",
                        fontFamily: "Fira Code, monospace",
                        fontSize: "0.72rem",
                        color: "#039be5",
                      }}
                    >
                      {basename(f.path)}
                    </td>
                    <td style={{ padding: "0.4rem 0.6rem" }}>{f.totalLines}</td>
                    <td style={{ padding: "0.4rem 0.6rem" }}>{f.codeLines}</td>
                    <td style={{ padding: "0.4rem 0.6rem" }}>
                      {f.functions?.length ?? 0}
                    </td>
                    <td
                      style={{
                        padding: "0.4rem 0.6rem",
                        fontWeight: 700,
                        color: maxCC > 10 ? "#e53935" : "#333",
                      }}
                    >
                      {maxCC}
                    </td>
                    <td style={{ padding: "0.4rem 0.6rem", color: "#e53935" }}>
                      {f.smells?.length ?? 0}
                    </td>
                    <td
                      style={{
                        padding: "0.4rem 0.6rem",
                        fontFamily: "Orbitron, sans-serif",
                        fontWeight: 700,
                        color: sColor,
                      }}
                    >
                      {f.healthScore?.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Section>

      {/* ── 4. TOP COMPLEX FUNCTIONS ── */}
      <Section title="4. Top Complex Functions">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.78rem",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              {[
                "#",
                "Function",
                "File",
                "CC",
                "Lines",
                "Params",
                "Nesting",
                "Severity",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.45rem 0.6rem",
                    textAlign: "left",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#666",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topFns.map((fn, i) => {
              const ccColor =
                fn.complexity > 15
                  ? "#e53935"
                  : fn.complexity > 10
                    ? "#fb8c00"
                    : fn.complexity > 6
                      ? "#ec407a"
                      : "#43a047";
              const sevLabel =
                fn.complexity > 15
                  ? "Critical"
                  : fn.complexity > 10
                    ? "High"
                    : fn.complexity > 6
                      ? "Medium"
                      : "Low";
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: fn.complexity > 10 ? "#fffbf5" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "0.4rem 0.6rem",
                      color: "#999",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "0.7rem",
                    }}
                  >
                    #{i + 1}
                  </td>
                  <td
                    style={{
                      padding: "0.4rem 0.6rem",
                      fontFamily: "Fira Code, monospace",
                      fontSize: "0.72rem",
                    }}
                  >
                    {fn.name}
                  </td>
                  <td
                    style={{
                      padding: "0.4rem 0.6rem",
                      fontFamily: "Fira Code, monospace",
                      fontSize: "0.68rem",
                      color: "#039be5",
                    }}
                  >
                    {fn.file}
                  </td>
                  <td
                    style={{
                      padding: "0.4rem 0.6rem",
                      fontFamily: "Orbitron, sans-serif",
                      fontWeight: 700,
                      color: ccColor,
                    }}
                  >
                    {fn.complexity}
                  </td>
                  <td style={{ padding: "0.4rem 0.6rem" }}>{fn.lineCount}</td>
                  <td style={{ padding: "0.4rem 0.6rem" }}>{fn.paramCount}</td>
                  <td style={{ padding: "0.4rem 0.6rem" }}>
                    {fn.nestingDepth}
                  </td>
                  <td
                    style={{
                      padding: "0.4rem 0.6rem",
                      fontWeight: 700,
                      color: ccColor,
                      fontSize: "0.7rem",
                    }}
                  >
                    {sevLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      {/* ── 5. AI SUGGESTIONS ── */}
      <Section title="5. AI Suggestions">
        {aiSuggs.length === 0 ? (
          <p style={{ color: "#43a047", fontStyle: "italic" }}>
            No issues detected — codebase looks clean!
          </p>
        ) : (
          ["high", "medium", "low"].map((level) => {
            const items = aiSuggs.filter((s) => s.level === level);
            if (!items.length) return null;
            const color =
              level === "high"
                ? "#e53935"
                : level === "medium"
                  ? "#fb8c00"
                  : "#039be5";
            const label =
              level === "high"
                ? "High Priority"
                : level === "medium"
                  ? "Medium Priority"
                  : "Low Priority";
            return (
              <div key={level} style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color,
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {label} ({items.length})
                </p>
                {items.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "0.5rem 0.75rem",
                      marginBottom: "0.3rem",
                      borderLeft: `3px solid ${color}`,
                      background: "#fafafa",
                      borderRadius: "0 6px 6px 0",
                      fontSize: "0.8rem",
                      color: "#333",
                    }}
                  >
                    {s.icon} {s.text}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </Section>

      {/* ── 6. STATIC ANALYSIS INSIGHTS ── */}
      <Section title="6. Static Analysis Insights">
        {[
          { label: "Optimization Issues", items: optHints, color: "#fb8c00" },
          { label: "Dead Code", items: deadHints, color: "#e53935" },
          { label: "Magic Numbers", items: magicHints, color: "#039be5" },
          { label: "Duplicate Functions", items: dupeHints, color: "#7e57c2" },
          { label: "Unused Variables", items: unusedHints, color: "#ec407a" },
        ].map(({ label, items, color }) => {
          if (!items.length) return null;
          return (
            <div key={label} style={{ marginBottom: "1rem" }}>
              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color,
                  marginBottom: "0.4rem",
                }}
              >
                {label} ({items.length})
              </p>
              {items.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0.45rem 0.75rem",
                    marginBottom: "0.25rem",
                    borderLeft: `3px solid ${color}`,
                    background: "#fafafa",
                    borderRadius: "0 6px 6px 0",
                    fontSize: "0.78rem",
                    color: "#333",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Fira Code, monospace",
                      color: "#039be5",
                      fontSize: "0.7rem",
                    }}
                  >
                    {h.file}
                    {h.fn ? ` → ${h.fn}` : ""}
                  </span>
                  <span style={{ marginLeft: 8 }}>{h.message}</span>
                </div>
              ))}
            </div>
          );
        })}
      </Section>

      {/* ── FOOTER ── */}
      <div
        style={{
          marginTop: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: "0.72rem",
          color: "#999",
        }}
      >
        Generated by RepoPulse · {new Date().toLocaleString()} · {files.length}{" "}
        files · {summary?.totalFunctions} functions analyzed
      </div>
    </div>
  );
}
