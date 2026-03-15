const REPORT_URL = "/analysis_report.json";

export async function fetchReport() {
    // EXTEND THIS FUNCTION: add request timeout, retry logic, and schema
    // validation so malformed reports surface a clear error to the UI
    const res = await fetch(REPORT_URL);
    if (!res.ok) throw new Error(`Failed to load report (HTTP ${res.status})`);
    return res.json();
}