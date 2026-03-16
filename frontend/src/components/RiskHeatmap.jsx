import { Link } from 'react-router-dom';
import { scoreColor } from '../utils/path';

export default function RiskHeatmap({ files }) {
    if (!files?.length) return null;
    return (
        <div className="card p-6">
            <p className="card-header">Risk Heatmap</p>
            <div className="flex flex-wrap gap-1.5">
                {files.map((f, i) => {
                    const name  = f.path.split(/[\\/]/).pop();
                    const color = scoreColor(f.healthScore);
                    const size  = Math.max(28, Math.min(56, f.totalLines / 6));
                    return (
                        <Link key={i} to={`/file/${encodeURIComponent(f.path)}`}
                            title={`${name}\nScore: ${f.healthScore?.toFixed(1)}\nLOC: ${f.totalLines}`}>
                            <div className="rounded-md flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-110 transition-transform"
                                style={{ width: size, height: size, background: color, opacity: 0.75 }}>
                                <span className="text-white font-bold text-xs select-none">
                                    {f.healthScore?.toFixed(0)}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 dark:text-slate-400">
                <span>Size = LOC</span>
                <span>Color:</span>
                {[['#22c55e','Good'],['#f59e0b','Fair'],['#ef4444','Poor']].map(([c,l]) => (
                    <span key={l} className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />{l}
                    </span>
                ))}
            </div>
        </div>
    );
}