import { useState } from 'react';
import { Link } from 'react-router-dom';
import { basename, scoreBadgeClass } from '../utils/path';

const PAGE = 10;

export default function RiskFilesTable({ files }) {
    const [page,   setPage]   = useState(0);
    const [search, setSearch] = useState('');
    if (!files?.length) return null;

    const filtered = [...files]
        .filter(f => basename(f.path).toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.healthScore - b.healthScore);

    const total = Math.ceil(filtered.length / PAGE);
    const rows  = filtered.slice(page * PAGE, page * PAGE + PAGE);

    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 gap-4">
                <p className="card-header mb-0">Risk Files</p>
                <input
                    className="input max-w-xs no-print"
                    placeholder="Search files…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0); }}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-400 dark:text-slate-400 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">File</th>
                            <th className="px-4 py-3 text-right">LOC</th>
                            <th className="px-4 py-3 text-right">Fns</th>
                            <th className="px-4 py-3 text-right">Max CC</th>
                            <th className="px-4 py-3 text-left">Smells</th>
                            <th className="px-4 py-3 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {rows.map((f, i) => {
                            const maxCC = Math.max(0, ...(f.functions?.map(fn => fn.complexity) ?? [0]));
                            return (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                                    <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                                        <Link to={`/file/${encodeURIComponent(f.path)}`}>
                                            {basename(f.path)}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{f.totalLines}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{f.functions?.length ?? 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={maxCC > 10 ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-slate-300'}>
                                            {maxCC}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {f.smells?.slice(0, 3).map((s, j) => (
                                                <span key={j} className="badge bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                                                    {s.split(':')[0]}
                                                </span>
                                            ))}
                                            {(f.smells?.length ?? 0) > 3 && (
                                                <span className="badge bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400">
                                                    +{f.smells.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`badge ${scoreBadgeClass(f.healthScore)}`}>
                                            {f.healthScore?.toFixed(1)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {total > 1 && (
                <div className="flex justify-end items-center gap-2 px-6 py-3 text-sm no-print border-t border-gray-100 dark:border-slate-700">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                        className="btn-ghost py-1 disabled:opacity-40">← Prev</button>
                    <span className="text-gray-400 dark:text-slate-400">{page + 1} / {total}</span>
                    <button onClick={() => setPage(p => Math.min(total - 1, p + 1))} disabled={page === total - 1}
                        className="btn-ghost py-1 disabled:opacity-40">Next →</button>
                </div>
            )}
        </div>
    );
}