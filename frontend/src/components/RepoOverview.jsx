import { useCountUp } from '../hooks/useCountUp';

function StatCard({ label, value, icon, color = 'text-indigo-600 dark:text-indigo-400' }) {
    const animated = useCountUp(value ?? 0, 1000);
    return (
        <div className="card p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">{label}</span>
                <span className="text-lg">{icon}</span>
            </div>
            <span className={`text-3xl font-bold count-anim ${color}`}>{animated.toLocaleString()}</span>
        </div>
    );
}

export default function RepoOverview({ summary }) {
    if (!summary) return null;
    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Files"     value={summary.totalFiles}     icon="📁" color="text-indigo-600 dark:text-indigo-400" />
            <StatCard label="Lines"     value={summary.totalLOC}       icon="📄" color="text-blue-600 dark:text-blue-400" />
            <StatCard label="Functions" value={summary.totalFunctions} icon="⚙️" color="text-violet-600 dark:text-violet-400" />
            <StatCard label="Smells"    value={summary.totalSmells}    icon="🚨" color="text-red-500 dark:text-red-400" />
        </div>
    );
}