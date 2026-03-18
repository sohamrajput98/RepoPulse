import { useState } from "react";
import { useReport } from "../../context/ReportContext";
import FileColorTree from "../../components/FileColorTree";
import RiskFilesTable from "../../components/RiskFilesTable";
import LanguageBreakdown from "../../components/LanguageBreakdown";
import DependencyGraph from "../../components/DependencyGraph";

/* ── All unique smell types across files ─────────────────── */
function collectSmellTypes(files) {
  const seen = new Set();
  files?.forEach((f) => f.smells?.forEach((s) => seen.add(s.split(":")[0])));
  return ["All", ...Array.from(seen).sort()];
}

/* ── Smell filter chip bar ───────────────────────────────── */
function SmellFilterBar({ types, active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: "0.85rem",
      }}
    >
      {types.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: "0.25rem 0.7rem",
            borderRadius: 99,
            fontSize: "0.73rem",
            fontWeight: 600,
            border: "1px solid",
            cursor: "pointer",
            transition: "all 0.15s ease",
            background: active === t ? "var(--accent)" : "var(--bg-raise)",
            color: active === t ? "#fff" : "var(--text-secondary)",
            borderColor: active === t ? "var(--accent)" : "var(--border)",
            boxShadow: active === t ? "0 0 10px var(--glow-c4)" : "none",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ── Filtered table wrapper ──────────────────────────────── */
function FilteredTable({ files, filter }) {
  const filtered =
    filter === "All"
      ? files
      : files?.filter((f) => f.smells?.some((s) => s.split(":")[0] === filter));

  if (!filtered?.length)
    return (
      <div
        className="card"
        style={{
          padding: "2.5rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.9rem",
        }}
      >
        No files match the{" "}
        <strong style={{ color: "var(--accent)" }}>{filter}</strong> filter 🎉
      </div>
    );
  return <RiskFilesTable files={filtered} />;
}

/* ── Files tab ───────────────────────────────────────────── */
export default function Files() {
  const { report } = useReport();
  const files = report?.files ?? [];
  const smellTypes = collectSmellTypes(files);
  const [filter, setFilter] = useState("All");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* summary strip */}
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
          { label: "Total Files", value: files.length, colorVar: "--c4" },
          {
            label: "High Risk",
            value: files.filter((f) => (f.healthScore ?? 100) < 50).length,
            colorVar: "--c1",
          },
          {
            label: "With Smells",
            value: files.filter((f) => f.smells?.length > 0).length,
            colorVar: "--c3",
          },
          {
            label: "Clean",
            value: files.filter((f) => !f.smells?.length).length,
            colorVar: "--c2",
          },
        ].map(({ label, value, colorVar }) => (
          <div
            key={label}
            className="card"
            style={{
              padding: "0.65rem 1.1rem",
              flex: "1 1 140px",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: `var(${colorVar})`,
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

      {/* two-column layout: tree left, filtered table right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 80ms forwards" }}
        >
          <FileColorTree files={files} />
        </div>
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 160ms forwards" }}
        >
          <div className="card" style={{ padding: "1.25rem 1.25rem 0.5rem" }}>
            <p className="card-header">Filter by Smell Type</p>
            <SmellFilterBar
              types={smellTypes}
              active={filter}
              onChange={setFilter}
            />
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <FilteredTable files={files} filter={filter} />
          </div>
        </div>
      </div>

      {/* bottom row: LanguageBreakdown + DependencyGraph */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
        }}
      >
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 240ms forwards" }}
        >
          <LanguageBreakdown files={files} />
        </div>
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 300ms forwards" }}
        >
          <DependencyGraph files={files} />
        </div>
      </div>

      <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  );
}
