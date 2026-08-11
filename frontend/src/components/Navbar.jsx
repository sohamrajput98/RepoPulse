import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  usePalette,
  DARK_PALETTES,
  LIGHT_PALETTES,
} from "../context/PaletteContext";
import { useReport } from "../context/ReportContext";
import {
  IconOverview,
  IconComplexity,
  IconSmells,
  IconFiles,
  IconInsights,
  IconSun,
  IconMoon,
  IconWarning,
  IconRefresh,
  IconChevronDown,
  IconCheck,
  IconLightning,
} from "./icons";

/* ── Tab definitions ─────────────────────────────────────── */
const TABS = [
  { id: "overview", label: "Overview", icon: IconOverview },
  { id: "complexity", label: "Complexity", icon: IconComplexity },
  { id: "smells", label: "Smells", icon: IconSmells },
  { id: "files", label: "Files", icon: IconFiles },
  { id: "insights", label: "Insights", icon: IconInsights },
];

/* ── Palette dot swatch ──────────────────────────────────── */
function Swatch({ colors }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {colors.map((c, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: c,
          }}
        />
      ))}
    </span>
  );
}

/* ── Palette dropdown ────────────────────────────────────── */
function PalettePicker({ dark }) {
  const { palette, setPalette } = usePalette();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const palettes = dark ? DARK_PALETTES : LIGHT_PALETTES;
  const current = palettes.find((p) => p.id === palette) ?? palettes[0];

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="btn-ghost"
        onClick={() => setOpen((o) => !o)}
        title="Switch colour palette"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.8rem",
        }}
      >
        <Swatch colors={current.swatch} />
        <span style={{ fontSize: "0.75rem" }}>{current.label}</span>
        <IconChevronDown size={10} style={{ color: "var(--text-muted)" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: 12,
            padding: "0.4rem",
            minWidth: 160,
            zIndex: 200,
            boxShadow: "var(--shadow-card)",
            animation: "scaleIn 0.18s ease",
          }}
        >
          {palettes.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPalette(p.id);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "0.45rem 0.7rem",
                borderRadius: 8,
                border: "none",
                background:
                  palette === p.id ? "var(--bg-raise)" : "transparent",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "0.82rem",
                fontWeight: palette === p.id ? 600 : 400,
              }}
            >
              <Swatch colors={p.swatch} />
              {p.label}
              {palette === p.id && (
                <IconCheck
                  size={12}
                  style={{ marginLeft: "auto", color: "var(--accent)" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────────── */
export default function Navbar({ onPrint }) {
  const [dark, setDark] = useDarkMode();
  const { report, refresh, isStale } = useReport();
  const navigate = useNavigate();

  const repoName = report?.summary?.repoName ?? "Local Report";

  return (
    <nav
      className="no-print"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        height: 56,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {/* ── LEFT — logo ── */}
      <button
        onClick={() => navigate("/analyze")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          fontFamily: "Orbitron, sans-serif",
          fontWeight: 800,
          fontSize: "1.15rem",
          letterSpacing: "-0.01em",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
          flexShrink: 0,
          padding: 0,
        }}
      >
        <IconLightning size={20} style={{ color: "var(--accent)" }} />
        RepoPulse
      </button>

      {/* ── CENTER — tab nav ── */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div className="tab-bar" style={{ display: "flex", gap: 2 }}>
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={`/dashboard/${tab.id}`}
                className={({ isActive }) =>
                  `tab-item${isActive ? " active" : ""}`
                }
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <IconComponent size={14} />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT — controls ── */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
      >
        {/* Repo chip */}
        {report && (
          <span
            className="badge badge-neutral"
            style={{
              fontSize: "0.72rem",
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
            title={repoName}
          >
            <IconFiles size={12} />
            {repoName}
            {isStale && (
              <IconWarning size={12} style={{ color: "var(--score-fair)" }} />
            )}
          </span>
        )}

        {/* Palette switcher */}
        <PalettePicker dark={dark} />

        {/* Theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="btn-ghost"
          title={dark ? "Light mode" : "Dark mode"}
          style={{ padding: "0.35rem 0.6rem", fontSize: "0.9rem" }}
        >
          {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
        </button>

        {/* Refresh */}
        <button
          onClick={() => refresh()}
          className="btn-ghost no-print"
          style={{ fontSize: "0.8rem" }}
          title="Refresh report"
        >
          <IconRefresh size={14} />
        </button>

        {/* Export PDF */}
        {onPrint && (
          <button
            onClick={onPrint}
            className="btn-ghost no-print"
            style={{ fontSize: "0.8rem" }}
          >
            Export PDF
          </button>
        )}
      </div>
    </nav>
  );
}
