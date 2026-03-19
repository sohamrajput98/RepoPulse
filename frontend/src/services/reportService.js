const DEFAULT_URL = "/analysis_report.json";

export async function fetchReport(customUrl = null) {
  /* Always cache-bust so a freshly written report is never served stale.
       The ?_t= param is ignored by the static server but forces a new request. */
  const base = customUrl || DEFAULT_URL;
  const url = base.includes("?")
    ? `${base}&_t=${Date.now()}`
    : `${base}?_t=${Date.now()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store" /* belt-and-suspenders: bypass browser cache */,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.summary || !Array.isArray(data.files))
      throw new Error("Invalid report schema");
    data.healthScore = data.summary.healthScore;
    return data;
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Request timed out");
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

// const DEFAULT_URL = '/analysis_report.json';

// export async function fetchReport(customUrl = null) {
//     const url = customUrl || DEFAULT_URL;
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 8000);
//     try {
//         const res = await fetch(url, { signal: controller.signal });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();
//         if (!data.summary || !Array.isArray(data.files))
//             throw new Error('Invalid report schema');
//         data.healthScore = data.summary.healthScore;
//         return data;
//     } catch (e) {
//         if (e.name === 'AbortError') throw new Error('Request timed out');
//         throw e;
//     } finally {
//         clearTimeout(timeout);
//     }
// }
