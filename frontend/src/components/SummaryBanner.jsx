export default function SummaryBanner({ summary, generatedAt }) {
    if (!summary) return null;
    const avg = summary.averageComplexity?.toFixed(1) ?? '—';
    const time = generatedAt ? new Date(generatedAt).toLocaleString() : '—';
    return (
        <div className="card px-6 py-4 mb-6 flex flex-wrap gap-4 items-center justify-between text-sm">
            <div className="flex flex-wrap gap-6">
                <span className="text-gray-500 dark:text-slate-400">
                    🗂 <b className="text-gray-800 dark:text-white">{summary.totalFiles}</b> files scanned
                </span>
                <span className="text-gray-500 dark:text-slate-400">
                    🔍 <b className="text-gray-800 dark:text-white">{summary.totalSmells}</b> smells found
                </span>
                <span className="text-gray-500 dark:text-slate-400">
                    ⚙️ <b className="text-gray-800 dark:text-white">{summary.totalFunctions}</b> functions analyzed
                </span>
                <span className="text-gray-500 dark:text-slate-400">
                    📊 Avg complexity: <b className="text-gray-800 dark:text-white">{avg}</b>
                </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500">Generated: {time}</span>
        </div>
    );
}