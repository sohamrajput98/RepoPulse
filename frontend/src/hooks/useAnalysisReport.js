import { useState, useEffect, useCallback } from 'react';
import { fetchReport } from '../services/reportService';

export function useAnalysisReport() {
    const [report,    setReport]    = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);
    const [fetchedAt, setFetchedAt] = useState(null);

    const load = useCallback((url = null) => {
        setLoading(true);
        setError(null);
        fetchReport(url)
            .then(data => { setReport(data); setFetchedAt(Date.now()); })
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const isStale = fetchedAt ? (Date.now() - fetchedAt) > 60000 : false;

    return { report, loading, error, refresh: load, isStale };
}