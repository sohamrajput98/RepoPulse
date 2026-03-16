import { useParams, Link } from 'react-router-dom';
import { useAnalysisReport } from '../hooks/useAnalysisReport';
import { scoreColor, scoreBadgeClass } from '../utils/path';

export default function FileDetail() {
    const { filePath } = useParams();
    const { report, loading, error } = useAnalysisReport();

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
    );
    if (error) return <p className="p-8 text-red-500">{error.message}</p>;

    const file = report.files.find(f => f.path === decodeURIComponent(filePath));
    if (!file) return <p className="p-8 text-gray-500">File not found.</p>;

    const stats = [
        ['Total Lines', file.totalLines],
        ['Code Lines',  file.codeLines],
        ['Comments',    file.commentLines],
        ['Blank',       file.blankLines],
    ];

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <Link to="/" className="text-indigo-500 text-sm mb-4 inline-flex items-center gap-1 hover:underline">
                    ← Back to Dashboard
                </Link>
                <div className="card px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
                    <h1 className="font-mono text-sm text-gray-700 dark:text-slate-200">{file.path}</h1>
                    <span className={`badge text-sm px-3 py-1 ${scoreBadgeClass(file.healthScore)}`}>
                        Score: {file.healthScore?.toFixed(1)}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map(([l, v]) => (
                        <div key={l} className="card p-4 text-center">
                            <p className="text-xs text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1">{l}</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{v}</p>
                        </div>
                    ))}
                </div>

                {file.smells?.length > 0 && (
                    <div className="card p-4 mb-6 flex flex-wrap gap-2">
                        <span className="text-xs text-gray-400 dark:text-slate-400 uppercase tracking-widest self-center mr-2">Smells</span>
                        {file.smells.map((s, i) => (
                            <span key={i} className="badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">{s}</span>
                        ))}
                    </div>
                )}

                <div className="card overflow-hidden">
                    <p className="card-header px-6 pt-5 pb-2">Functions</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-400 dark:text-slate-400 text-xs uppercase">
                                <tr>
                                    {['Function','Lines','Start','End','Params','Complexity','Nesting'].map(h => (
                                        <th key={h} className={`px-4 py-3 ${h === 'Function' ? 'text-left' : 'text-right'}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {file.functions?.map((fn, i) => {
                                    const color = scoreColor(100 - fn.complexity * 5);
                                    return (
                                        <tr key={i} className={fn.complexity > 10 ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'}>
                                            <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-slate-200">{fn.name}</td>
                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{fn.lineCount}</td>
                                            <td className="px-4 py-3 text-right text-gray-400 dark:text-slate-400">{fn.startLine}</td>
                                            <td className="px-4 py-3 text-right text-gray-400 dark:text-slate-400">{fn.endLine}</td>
                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{fn.paramCount}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="font-bold" style={{ color }}>{fn.complexity}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-300">{fn.nestingDepth}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}