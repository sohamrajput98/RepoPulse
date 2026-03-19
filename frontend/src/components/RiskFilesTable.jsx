import { useState } from "react";
import { Link } from "react-router-dom";
import { basename, scoreBadgeClass } from "../utils/path";
import { useChartColors } from "../hooks/useChartColors";

const PAGE = 10;

/* ── Smell badge chip ────────────────────────────────────── */
function SmellChip({ label, colors }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.15rem 0.5rem",
        borderRadius: 99,
        fontSize: "0.68rem",
        fontWeight: 600,
        background: `color-mix(in srgb, ${colors.c1} 10%, var(--bg-raise))`,
        border: `1px solid color-mix(in srgb, ${colors.c1} 25%, transparent)`,
        color: colors.c1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/* ── Overflow count chip ─────────────────────────────────── */
function MoreChip({ count }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.15rem 0.45rem",
        borderRadius: 99,
        fontSize: "0.68rem",
        fontWeight: 600,
        background: "var(--bg-raise)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        whiteSpace: "nowrap",
      }}
    >
      +{count}
    </span>
  );
}

/* ── Max CC cell ─────────────────────────────────────────── */
function CCCell({ value, colors }) {
  const over = value > 10;
  return (
    <span
      style={{
        fontFamily: "Orbitron, sans-serif",
        fontWeight: over ? 700 : 500,
        fontSize: "0.82rem",
        color: over ? colors.c1 : "var(--text-secondary)",
        textShadow: over ? `0 0 8px ${colors.glowC1}` : "none",
      }}
    >
      {value}
      {over && <span style={{ fontSize: "0.6rem", marginLeft: 2 }}>⚠</span>}
    </span>
  );
}

/* ── Styled pagination button ────────────────────────────── */
function PageBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.3rem 0.75rem",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: disabled ? "transparent" : "var(--bg-raise)",
        color: disabled ? "var(--text-muted)" : "var(--text-primary)",
        fontSize: "0.8rem",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          e.currentTarget.style.boxShadow = "0 0 8px var(--glow-c4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}

/* ── RiskFilesTable ──────────────────────────────────────── */
export default function RiskFilesTable({ files }) {
  const colors = useChartColors();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  if (!files?.length) return null;

  const filtered = [...files]
    .filter((f) =>
      basename(f.path).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.healthScore - b.healthScore);

  const total = Math.ceil(filtered.length / PAGE);
  const rows = filtered.slice(page * PAGE, page * PAGE + PAGE);

  /* th style helper */
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
    <div className="card" style={{ overflow: "hidden" }}>
      {/* header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem 0.75rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <p className="card-header" style={{ marginBottom: 0 }}>
          Risk Files
        </p>
        <input
          className="input no-print"
          placeholder="Search files…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          style={{ maxWidth: 220 }}
        />
      </div>

      {/* table */}
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
              <th style={thStyle("left")}>File</th>
              <th style={thStyle("right")}>LOC</th>
              <th style={thStyle("right")}>Fns</th>
              <th style={thStyle("right")}>Max CC</th>
              <th style={thStyle("left")}>Smells</th>
              <th style={thStyle("right")}>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f, i) => {
              const maxCC = Math.max(
                0,
                ...(f.functions?.map((fn) => fn.complexity) ?? [0]),
              );
              const isOdd = i % 2 === 0;

              return (
                <tr
                  key={i}
                  style={{
                    background: isOdd
                      ? "transparent"
                      : "color-mix(in srgb, var(--bg-raise) 50%, transparent)",
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-raise)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isOdd
                      ? "transparent"
                      : "color-mix(in srgb, var(--bg-raise) 50%, transparent)";
                  }}
                >
                  {/* filename */}
                  <td style={{ padding: "0.65rem 1rem" }}>
                    <Link
                      to={`/file/${encodeURIComponent(f.path)}`}
                      style={{
                        fontFamily: "Fira Code, monospace",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "var(--accent)",
                        textDecoration: "none",
                        transition: "text-shadow 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textShadow = `0 0 8px var(--glow-c4)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textShadow = "none";
                      }}
                    >
                      {basename(f.path)}
                    </Link>
                  </td>

                  {/* LOC */}
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      textAlign: "right",
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {f.totalLines}
                  </td>

                  {/* functions count */}
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      textAlign: "right",
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {f.functions?.length ?? 0}
                  </td>

                  {/* max CC */}
                  <td style={{ padding: "0.65rem 1rem", textAlign: "right" }}>
                    <CCCell value={maxCC} colors={colors} />
                  </td>

                  {/* smell chips */}
                  <td style={{ padding: "0.65rem 1rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {f.smells?.slice(0, 3).map((s, j) => (
                        <SmellChip
                          key={j}
                          label={s.split(":")[0]}
                          colors={colors}
                        />
                      ))}
                      {(f.smells?.length ?? 0) > 3 && (
                        <MoreChip count={f.smells.length - 3} />
                      )}
                    </div>
                  </td>

                  {/* health score badge */}
                  <td style={{ padding: "0.65rem 1rem", textAlign: "right" }}>
                    <span className={scoreBadgeClass(f.healthScore)}>
                      {f.healthScore?.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  No files match &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {total > 1 && (
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.25rem",
            borderTop: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {filtered.length} file{filtered.length !== 1 ? "s" : ""} · page{" "}
            {page + 1} of {total}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <PageBtn onClick={() => setPage(0)} disabled={page === 0}>
              «
            </PageBtn>
            <PageBtn
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              ← Prev
            </PageBtn>
            <span
              style={{
                padding: "0.3rem 0.7rem",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 8,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {page + 1}
            </span>
            <PageBtn
              onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              disabled={page === total - 1}
            >
              Next →
            </PageBtn>
            <PageBtn
              onClick={() => setPage(total - 1)}
              disabled={page === total - 1}
            >
              »
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}
