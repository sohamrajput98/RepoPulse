import { useState, useEffect } from 'react';

export default function LastAnalyzed({ generatedAt }) {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        if (!generatedAt) return;
        const update = () => {
            const diff = Math.floor((Date.now() - new Date(generatedAt).getTime()) / 1000);
            if (diff < 60)       setElapsed(`${diff}s ago`);
            else if (diff < 3600) setElapsed(`${Math.floor(diff/60)}m ago`);
            else                  setElapsed(`${Math.floor(diff/3600)}h ago`);
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, [generatedAt]);

    return (
        <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Last analyzed: <span className="font-medium text-gray-600 dark:text-slate-300">{elapsed || '—'}</span>
        </span>
    );
}