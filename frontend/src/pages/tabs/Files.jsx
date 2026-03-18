import { useState } from "react";
import { Link } from "react-router-dom";
import { useReport } from "../../context/ReportContext";
import FileColorTree from "../../components/FileColorTree";
import RiskFilesTable from "../../components/RiskFilesTable";
import { basename, scoreBadgeClass } from "../../utils/path";

/* ── All unique smell type keys across all files ─────────── */
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

/* ── Filtered RiskFilesTable wrapper ─────────────────────── */
function FilteredRiskTable({ files, smellFilter }) {
  const filtered =
    smellFilter === "All"
      ? files
      : files?.filter((f) =>
          f.smells?.some((s) => s.split(":")[0] === smellFilter),
        );

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
        <strong style={{ color: "var(--accent)" }}>{smellFilter}</strong> filter
        🎉
      </div>
    );

  return <RiskFilesTable files={filtered} />;
}

/* ── Files tab ───────────────────────────────────────────── */
export default function Files() {
  const { report } = useReport();
  const files = report?.files ?? [];
  const smellTypes = collectSmellTypes(files);
  const [smellFilter, setSmellFilter] = useState("All");

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
          { label: "Total Files", value: files.length, color: "--c4" },
          {
            label: "High Risk",
            value: files.filter((f) => (f.healthScore ?? 100) < 50).length,
            color: "--c1",
          },
          {
            label: "With Smells",
            value: files.filter((f) => f.smells?.length > 0).length,
            color: "--c3",
          },
          {
            label: "Clean Files",
            value: files.filter((f) => !f.smells?.length).length,
            color: "--c2",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="card"
            style={{
              padding: "0.65rem 1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flex: "1 1 140px",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
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

      {/* ── Two-column layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "1.25rem",
          alignItems: "start",
        }}
      >
        {/* LEFT — File Health Tree */}
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 80ms forwards" }}
        >
          <FileColorTree files={files} />
        </div>

        {/* RIGHT — Smell filter + Risk table */}
        <div
          style={{ opacity: 0, animation: "fadeUp 0.45s ease 160ms forwards" }}
        >
          <div className="card" style={{ padding: "1.25rem 1.25rem 0.5rem" }}>
            <p className="card-header">Filter by Smell Type</p>
            <SmellFilterBar
              types={smellTypes}
              active={smellFilter}
              onChange={setSmellFilter}
            />
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <FilteredRiskTable files={files} smellFilter={smellFilter} />
          </div>
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
