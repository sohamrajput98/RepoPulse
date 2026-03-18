import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useReport } from "../context/ReportContext";
import Navbar from "../components/Navbar";

/* ── Lazy tab pages ──────────────────────────────────────── */
const Overview = lazy(() => import("./tabs/Overview"));
const Functions = lazy(() => import("./tabs/Functions"));
const Smells = lazy(() => import("./tabs/Smells"));
const Files = lazy(() => import("./tabs/Files"));
const AI = lazy(() => import("./tabs/AI"));

/* ── Tab loader ──────────────────────────────────────────── */
function TabLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 260,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid var(--border-strong)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Stale banner ────────────────────────────────────────── */
function StaleBanner({ onRefresh }) {
  return (
    <div className="stale-banner no-print" style={{ marginBottom: "1rem" }}>
      <span>
        ⚠ Report may be outdated — data was fetched over a minute ago.
      </span>
      <button
        onClick={onRefresh}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--score-fair)",
          fontWeight: 600,
          fontSize: "0.82rem",
          textDecoration: "underline",
        }}
      >
        Refresh now
      </button>
    </div>
  );
}

/* ── Dashboard shell ─────────────────────────────────────── */
export default function Dashboard() {
  const { report, loading, error, refresh, isStale } = useReport();
  const navigate = useNavigate();

  /* Guard: no report → send to /analyze */
  useEffect(() => {
    if (!loading && !report && !error) {
      navigate("/analyze", { replace: true });
    }
  }, [loading, report, error, navigate]);

  /* Loading state */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--bg-base)",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            border: "3px solid var(--border-strong)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Analyzing repository…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  /* Error state */
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
          style={{ padding: "2rem", maxWidth: 420, textAlign: "center" }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠️</p>
          <p
            style={{
              color: "var(--score-poor)",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            {error.message}
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
            }}
          >
            Make sure{" "}
            <code
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.78rem",
              }}
            >
              frontend/public/analysis_report.json
            </code>{" "}
            exists.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={() => refresh()} className="btn-primary">
              Retry
            </button>
            <button onClick={() => navigate("/analyze")} className="btn-ghost">
              ← Back
            </button>
          </div>
        </div>
      </div>
    );

  if (!report) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar onPrint={() => window.print()} />

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "1.5rem 1.5rem 3rem",
        }}
      >
        {isStale && <StaleBanner onRefresh={refresh} />}

        <Suspense fallback={<TabLoader />}>
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="complexity" element={<Functions />} />
            <Route path="smells" element={<Smells />} />
            <Route path="files" element={<Files />} />
            <Route path="insights" element={<AI />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
