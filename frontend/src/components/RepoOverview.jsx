function StatCard({ label, value }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
        </div>
    );
}

export default function RepoOverview({ summary }) {
    if (!summary) return null;
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Files"      value={summary.totalFiles} />
            <StatCard label="Lines"      value={summary.totalLOC} />
            <StatCard label="Functions"  value={summary.totalFunctions} />
            <StatCard label="Smells"     value={summary.totalSmells} />
        </div>
    );
}