import { useState } from 'react';
import { getUnusedVarHints, getOptimizationHints, getDeadCodeHints, getMagicNumbers, getDuplicateFunctions } from '../utils/insights';

const tabs = ['Optimization','Unused Vars','Dead Code','Magic Numbers','Duplicates'];

function HintList({ items, emptyMsg }) {
    if (!items?.length) return <p className="text-sm text-gray-400 dark:text-slate-500 py-4 text-center">{emptyMsg} 🎉</p>;
    return (
        <div className="space-y-2">
            {items.map((h, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-600">
                    <div className="min-w-0">
                        <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-0.5">
                            {h.file}{h.fn ? ` → ${h.fn}` : ''}
                            {h.type && <span className="ml-2 badge bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">{h.type}</span>}
                            {h.files && <span className="ml-2 text-gray-400">also in {h.files[1]}</span>}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-300">{h.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function InsightsPanel({ files }) {
    const [tab, setTab] = useState(0);
    const opt   = getOptimizationHints(files ?? []);
    const unused = getUnusedVarHints(files ?? []);
    const dead  = getDeadCodeHints(files ?? []);
    const magic = getMagicNumbers(files ?? []);
    const dupes = getDuplicateFunctions(files ?? []);
    const counts = [opt.length, unused.length, dead.length, magic.length, dupes.length];

    const content = [opt, unused, dead, magic, dupes];
    const msgs    = ['No optimization issues','No unused variable hints','No dead code detected','No magic numbers found','No duplicate functions'];

    return (
        <div className="card overflow-hidden">
            <p className="card-header px-6 pt-5 pb-3">Static Analysis Insights</p>
            <div className="flex gap-1 px-6 pb-3 overflow-x-auto no-scrollbar">
                {tabs.map((t, i) => (
                    <button key={i} onClick={() => setTab(i)}
                        className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition-all ${
                            tab === i
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                        }`}>
                        {t} {counts[i] > 0 && <span className="ml-1 opacity-80">({counts[i]})</span>}
                    </button>
                ))}
            </div>
            <div className="px-6 pb-5">
                <HintList items={content[tab]} emptyMsg={msgs[tab]} />
            </div>
        </div>
    );
}