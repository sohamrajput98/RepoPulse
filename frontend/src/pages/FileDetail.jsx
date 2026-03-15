import { useParams, Link } from 'react-router-dom';
import { useAnalysisReport } from '../hooks/useAnalysisReport';

export default function FileDetail() {
    const { filePath } = useParams();
    const { report, loading, error } = useAnalysisReport();

    if (loading) return <p className="p-8">Loading...</p>;
    if (error)   return <p className="p-8 text-red-500">{error.message}</p>;

    const file = report.files.find(f => f.path === decodeURIComponent(filePath));
    if (!file)   return <p className="p-8">File not found.</p>;

    return (
        <div className="max-w-5xl mx-auto p-8">
            <Link to="/" className="text-blue-500 text-sm mb-4 inline-block">← Back</Link>
            <h1 className="text-lg font-bold font-mono mb-6">{file.path}</h1>
            <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                {[['LOC', file.totalLines],['Code', file.codeLines],['Comments', file.commentLines],['Score', file.healthScore?.toFixed(1)]].map(([l,v]) => (
                    <div key={l} className="bg-white rounded-xl p-4 shadow">
                        <p className="text-xs text-gray-400 uppercase">{l}</p>
                        <p className="text-2xl font-bold">{v}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-2 text-left">Function</th>
                            <th className="px-4 py-2 text-right">Lines</th>
                            <th className="px-4 py-2 text-right">Start</th>
                            <th className="px-4 py-2 text-right">End</th>
                            <th className="px-4 py-2 text-right">Params</th>
                            <th className="px-4 py-2 text-right">Complexity</th>
                            <th className="px-4 py-2 text-right">Nesting</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {file.functions?.map((fn, i) => (
                            <tr key={i} className={fn.complexity > 10 ? 'bg-red-50' : ''}>
                                <td className="px-4 py-2 font-mono text-xs">{fn.name}</td>
                                <td className="px-4 py-2 text-right">{fn.lineCount}</td>
                                <td className="px-4 py-2 text-right">{fn.startLine}</td>
                                <td className="px-4 py-2 text-right">{fn.endLine}</td>
                                <td className="px-4 py-2 text-right">{fn.paramCount}</td>
                                <td className="px-4 py-2 text-right">
                                    <span className={fn.complexity > 10 ? 'text-red-500 font-bold' : ''}>{fn.complexity}</span>
                                </td>
                                <td className="px-4 py-2 text-right">{fn.nestingDepth}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}