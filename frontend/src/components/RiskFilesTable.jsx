import { useState } from 'react';
import { Link } from 'react-router-dom';
import { basename } from '../utils/path';

function ScoreDot({ score }) {
    const color = score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-lime-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-500';
    return <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${color}`} />;
}

const PAGE = 10;

export default function RiskFilesTable({ files }) {
    const [page, setPage] = useState(0);
    if (!files?.length) return null;

    const sorted = [...files].sort((a, b) => a.healthScore - b.healthScore);
    const total  = Math.ceil(sorted.length / PAGE);
    const rows   = sorted.slice(page * PAGE, page * PAGE + PAGE);

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <h2 className="text-sm font-semibold text-gray-500 uppercase p-6 pb-3">Risk Files</h2>
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-2 text-left">File</th>
                        <th className="px-4 py-2 text-right">LOC</th>
                        <th className="px-4 py-2 text-right">Fns</th>
                        <th className="px-4 py-2 text-right">Complexity</th>
                        <th className="px-4 py-2 text-left">Smells</th>
                        <th className="px-4 py-2 text-right">Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map((f, i) => {
                        const maxCC = Math.max(0, ...(f.functions?.map(fn => fn.complexity) ?? [0]));
                        return (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-2 font-mono text-xs text-blue-600">
                                    <Link to={`/file/${encodeURIComponent(f.path)}`}>{basename(f.path)}</Link>
                                </td>
                                <td className="px-4 py-2 text-right">{f.totalLines}</td>
                                <td className="px-4 py-2 text-right">{f.functions?.length ?? 0}</td>
                                <td className="px-4 py-2 text-right">
                                    <span className={maxCC > 10 ? 'text-red-500 font-bold' : ''}>{maxCC}</span>
                                </td>
                                <td className="px-4 py-2">
                                    {f.smells?.slice(0,3).map((s,j) => (
                                        <span key={j} className="inline-block bg-red-100 text-red-700 text-xs rounded px-1.5 py-0.5 mr-1">{s}</span>
                                    ))}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <ScoreDot score={f.healthScore} />{f.healthScore?.toFixed(1)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {total > 1 && (
                <div className="flex justify-end gap-2 p-4 text-sm">
                    <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0}
                        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40">Prev</button>
                    <span className="px-2 py-1">{page+1}/{total}</span>
                    <button onClick={() => setPage(p => Math.min(total-1,p+1))} disabled={page===total-1}
                        className="px-3 py-1 rounded bg-gray-100 disabled:opacity-40">Next</button>
                </div>
            )}
        </div>
    );
}