import { Link } from 'react-router-dom';
import { scoreBadgeClass, scoreColor } from '../utils/path';

export default function FileColorTree({ files }) {
    if (!files?.length) return null;
    const sorted = [...files].sort((a, b) => a.healthScore - b.healthScore);

    return (
        <div className="card p-6">
            <p className="card-header">File Health Tree</p>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {sorted.map((f, i) => {
                    const name = f.path.split(/[\\/]/).pop();
                    const color = scoreColor(f.healthScore);
                    const pct   = f.healthScore ?? 0;
                    return (
                        <Link key={i} to={`/file/${encodeURIComponent(f.path)}`}
                            className="flex items-center gap-3 group px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span className="font-mono text-xs text-gray-700 dark:text-slate-300 truncate flex-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {name}
                            </span>
                            <div className="w-20 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <span className={`badge ${scoreBadgeClass(f.healthScore)} text-xs`}>
                                {pct.toFixed(0)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}