import { useState } from "react";
import { useReport } from "../../context/ReportContext";
import FileColorTree from "../../components/FileColorTree";
import RiskFilesTable from "../../components/RiskFilesTable";
import LanguageBreakdown from "../../components/LanguageBreakdown";
import DependencyGraph from "../../components/DependencyGraph";

/* ── collect unique smell type names ─────────────────────── */
function collectSmellTypes(files) {
  const seen = new Set();
  files?.forEach((f) => f.smells?.forEach((s) => seen.add(s.split(":")[0])));
  return ["All", ...Array.from(seen).sort()];
}

/* ── filter chip bar ──────────────────────────────────────── */
function SmellFilterBar({ types, active, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {types.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: 99,
            fontSize: "0.78rem",
            fontFamily: "Rajdhani, sans-serif",
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

/* ── Files tab ────────────────────────────────────────────── */
export default function Files() {
  const { report } = useReport();
  const files = report?.files ?? [];
  const smellTypes = collectSmellTypes(files);
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? files
      : files.filter((f) => f.smells?.some((s) => s.split(":")[0] === filter));

  const FADE = (ms) => ({
    opacity: 0,
    animation: `filesTab 0.45s ease ${ms}ms forwards`,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* ── Row 1: 4 summary stat chips ───────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "0.75rem",
          ...FADE(0),
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
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}
          >
            <span
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: `var(${colorVar})`,
                lineHeight: 1,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontFamily: "Rajdhani, sans-serif",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Row 2: File Health Tree (left) + Language Breakdown (right) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          alignItems: "start",
          ...FADE(80),
        }}
      >
        <FileColorTree files={files} />
        <LanguageBreakdown files={files} />
      </div>

      {/* ── Row 3: Dependency Graph full width ────────────── */}
      <div style={FADE(160)}>
        <DependencyGraph files={files} />
      </div>

      {/* ── Row 4: Smell filter + Risk table ─────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          ...FADE(240),
        }}
      >
        {/* filter chip bar inside its own card */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <p className="card-header">Filter by Smell Type</p>
          <SmellFilterBar
            types={smellTypes}
            active={filter}
            onChange={setFilter}
          />
        </div>

        {/* filtered table */}
        {filtered.length > 0 ? (
          <RiskFilesTable files={filtered} />
        ) : (
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
            <strong style={{ color: "var(--accent)" }}>{filter}</strong> filter
            🎉
          </div>
        )}
      </div>

      <style>{`
        @keyframes filesTab {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
