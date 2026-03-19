import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { fetchReport } from "../services/reportService";

/* ── helpers ─────────────────────────────────────────────── */
const HISTORY_KEY = "repopulse_history";
const MAX_HISTORY = 10;

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  try {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(entries.slice(0, MAX_HISTORY)),
    );
  } catch {
    /* quota */
  }
}

/* ── context ─────────────────────────────────────────────── */
const ReportContext = createContext(null);

export function ReportProvider({ children }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [delta, setDelta] = useState(null); // score delta vs previous run
  const prevScoreRef = useRef(null);

  const load = useCallback(async (url = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReport(url);
      const newScore = data?.summary?.healthScore ?? null;

      // compute delta
      if (prevScoreRef.current !== null && newScore !== null) {
        setDelta(+(newScore - prevScoreRef.current).toFixed(1));
      }
      prevScoreRef.current = newScore;

      setReport(data);
      setFetchedAt(Date.now());

      // push to history
      if (data?.summary) {
        const entry = {
          score: newScore,
          label: data.summary.healthLabel,
          repo: data.summary.repoName ?? url ?? "Local",
          analyzedAt: data.generatedAt ?? new Date().toISOString(),
        };
        setHistory((prev) => {
          const next = [entry, ...prev.filter((h) => h.repo !== entry.repo)];
          saveHistory(next);
          return next;
        });
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    load();
  }, [load]);

  const isStale = fetchedAt ? Date.now() - fetchedAt > 60_000 : false;

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return (
    <ReportContext.Provider
      value={{
        report,
        loading,
        error,
        refresh: load,
        isStale,
        fetchedAt,
        history,
        clearHistory,
        delta,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used inside <ReportProvider>");
  return ctx;
}
