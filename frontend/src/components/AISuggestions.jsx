import { useState } from 'react';
import { getAISuggestions } from '../utils/insights';

export default function AISuggestions({ files, score }) {
    const [open, setOpen] = useState(true);
    const suggestions = getAISuggestions(files ?? [], score ?? 100);
    if (!suggestions.length) return null;

    return (
        <div className="card overflow-hidden">
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <p className="card-header mb-0">AI Suggestions</p>
                    <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        {suggestions.length}
                    </span>
                </div>
                <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
            </button>
            {open && (
                <div className="px-6 pb-5 space-y-2">
                    {suggestions.map((s, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-600">
                            <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
                            <p className="text-sm text-gray-700 dark:text-slate-200">{s.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}