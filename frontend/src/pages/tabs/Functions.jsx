import { useReport } from "../../context/ReportContext";
import ComplexityChart from "../../components/ComplexityChart";
import { useChartColors } from "../../hooks/useChartColors";
import { basename } from "../../utils/path";
import { Link } from "react-router-dom";

/* ── Severity config ─────────────────────────────────────── */
function getSeverity(cc) {
  if (cc > 15) return { label: "Critical", colorVar: "--c1", bg: "--glow-c1" };
  if (cc > 10) return { label: "High", colorVar: "--c3", bg: "--glow-c3" };
  if (cc > 6) return { label: "Medium", colorVar: "--c5", bg: "--glow-c5" };
  return { label: "Low", colorVar: "--c2", bg: "--glow-c2" };
}

/* ── Ranked function card ────────────────────────────────── */
function FunctionCard({ fn, rank, delay }) {
  const colors = useChartColors();
  const sev = getSeverity(fn.complexity);
  const barPct = Math.min(100, (fn.complexity / 20) * 100);
  const color = `var(${sev.colorVar})`;

  return (
    <div
      className="card"
      style={{
        padding: "1.2rem 1.55rem",
        display: "grid",
        gridTemplateColumns: "1fr", // single column grid
        rowGap: "2rem",
        columnGap: "2rem", // vertical spacing between rows
        opacity: 0,
        animation: `fadeUp 0.55s ease ${delay}ms forwards`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      {/* top row */}
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
      >
        {/* rank badge */}
        <span
          style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--text-muted)",
            lineHeight: 1,
            minWidth: 28,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          #{rank}
        </span>

        {/* name + file */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "Fira Code, monospace",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fn.name}
          </p>
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            in{" "}
            <Link
              to={`/file/${encodeURIComponent(fn.filePath)}`}
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              {fn.file}
            </Link>
          </p>
        </div>

        {/* CC badge + severity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "1.3rem",
              fontWeight: 800,
              color,
              lineHeight: 1,
            }}
          >
            {fn.complexity}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color,
            }}
          >
            {sev.label}
          </span>
        </div>
      </div>

      {/* complexity bar */}
      <div
        style={{
          height: 5,
          borderRadius: 99,
          background: "var(--bg-raise)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 99,
            width: `${barPct}%`,
            background: color,
            boxShadow: `0 0 8px var(${sev.bg})`,
            transition: "width 0.8s ease",
          }}
        />
      </div>

      {/* meta chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {fn.lineCount !== undefined && (
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              background: "var(--bg-raise)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "0.15rem 0.55rem",
            }}
          >
            {fn.lineCount} lines
          </span>
        )}
        {fn.paramCount !== undefined && (
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              background: "var(--bg-raise)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "0.15rem 0.55rem",
            }}
          >
            {fn.paramCount} params
          </span>
        )}
        {fn.nestingDepth !== undefined && (
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              background: "var(--bg-raise)",
              border: "1px solid var(--border)",
              borderRadius: 99,
              padding: "0.15rem 0.55rem",
            }}
          >
            depth {fn.nestingDepth}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Functions tab ───────────────────────────────────────── */
export default function Functions() {
  const { report } = useReport();
  const files = report?.files ?? [];

  /* flatten all functions with file context */
  const allFns = files
    .flatMap((f) =>
      (f.functions ?? []).map((fn) => ({
        ...fn,
        file: basename(f.path),
        filePath: f.path,
      })),
    )
    .sort((a, b) => b.complexity - a.complexity);

  const top = allFns.slice(0, 12);

  /* stat summary */
  const avgCC = allFns.length
    ? (allFns.reduce((s, fn) => s + fn.complexity, 0) / allFns.length).toFixed(
        1,
      )
    : 0;
  const highRisk = allFns.filter((fn) => fn.complexity > 10).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* ── Summary strip ── */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          opacity: 0,
          animation: "fadeUp 0.45s ease 0ms forwards",
        }}
      >
        {[
          { label: "Total Functions", value: allFns.length, color: "--c4" },
          { label: "High Complexity", value: highRisk, color: "--c1" },
          { label: "Avg CC", value: avgCC, color: "--c3" },
          { label: "Max CC", value: allFns[0]?.complexity ?? 0, color: "--c5" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="card"
            style={{
              padding: "0.65rem 1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flex: "1 1 130px",
            }}
          >
            <span
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: `var(${color})`,
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── ComplexityChart full width ── */}
      <div style={{ opacity: 0, animation: "fadeUp 0.45s ease 80ms forwards" }}>
        <ComplexityChart files={files} />
      </div>

      {/* ── Ranked function cards ── */}
      <div
        style={{ opacity: 0, animation: "fadeUp 0.45s ease 160ms forwards" }}
      >
        <p className="card-header" style={{ marginBottom: "0.75rem" }}>
          Top {top.length} Complex Functions — Ranked
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "0.85rem",
        }}
      >
        {top.map((fn, i) => (
          <FunctionCard
            key={`${fn.name}-${fn.file}-${i}`}
            fn={fn}
            rank={i + 1}
            delay={200 + i * 40}
          />
        ))}
      </div>

      {allFns.length === 0 && (
        <div
          className="card"
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          No function data available in the report.
        </div>
      )}

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
