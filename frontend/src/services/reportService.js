const REPORT_URL = '/analysis_report.json';

export async function fetchReport() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const res = await fetch(REPORT_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.summary || !Array.isArray(data.files))
            throw new Error('Invalid report schema');
        data.healthScore = data.summary.healthScore;
        return data;
    } catch (e) {
        if (e.name === 'AbortError') throw new Error('Request timed out');
        throw e;
    } finally {
        clearTimeout(timeout);
    }
}