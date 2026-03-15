import { useState, useEffect } from "react";
import { fetchReport } from "../services/reportService";

export function useAnalysisReport() {
    const [report,  setReport]  = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
        // EXTEND THIS FUNCTION: add a polling interval so the UI refreshes
        // automatically when a new report is written by the backend
        fetchReport()
            .then(setReport)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { report, loading, error };
}