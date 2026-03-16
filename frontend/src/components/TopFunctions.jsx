import { scoreColor } from '../utils/path';

export default function TopFunctions({ files }) {
    if (!files?.length) return null;

    const fns = files.flatMap(f =>
        (f.functions ?? []).map(fn => ({ ...fn, file: f.path.split(/[\\/]/).pop() }))
    ).sort((a, b) => b.complexity - a.complexity).slice(0, 7);

    return (
        <div className="card p-6">
            <p className="card-header">Top Complex Functions</p>
            <div className="space-y-2">
                {fns.map((fn, i) => {
                    const pct = Math.min(100, (fn.complexity / 20) * 100);
                    const color = scoreColor(100 - fn.complexity * 5);
                    return (
                        <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-mono text-gray-700 dark:text-slate-200 truncate max-w-[60%]">
                                    {fn.name}
                                    <span className="text-gray-400 dark:text-slate-500 ml-1 font-sans">({fn.file})</span>
                                </span>
                                <span className="font-bold" style={{ color }}>CC: {fn.complexity}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%`, background: color }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}