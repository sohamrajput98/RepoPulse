import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ReportProvider } from "./context/ReportContext";
import { PaletteProvider } from "./context/PaletteContext";

/* ── Lazy pages ──────────────────────────────────────────── */
const Intro = lazy(() => import("./pages/Intro"));
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FileDetail = lazy(() => import("./pages/FileDetail"));

/* ── Full-screen loader ──────────────────────────────────── */
function PageLoader() {
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
}

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <PaletteProvider>
      <ReportProvider>
        <HashRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Intro splash */}
              <Route path="/" element={<Intro />} />

              {/* Landing / analyze — GitHub URL input */}
              <Route path="/analyze" element={<Landing />} />

              {/* Dashboard shell — nested tabs via Outlet */}
              <Route path="/dashboard/*" element={<Dashboard />} />

              {/* File detail drilldown */}
              <Route path="/file/:filePath" element={<FileDetail />} />

              {/* Fallback */}
              <Route path="" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ReportProvider>
    </PaletteProvider>
  );
}
