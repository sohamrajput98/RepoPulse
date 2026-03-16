import LastAnalyzed from './LastAnalyzed';

export default function SummaryBanner({ summary, generatedAt }) {
    if (!summary) return null;
    const avg = summary.averageComplexity?.toFixed(1) ?? '—';
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
            <LastAnalyzed generatedAt={generatedAt} />
        </div>
    );
}