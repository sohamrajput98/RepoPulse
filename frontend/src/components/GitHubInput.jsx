import { useState } from 'react';

export default function GitHubInput({ onLoad }) {
    const [url,     setUrl]     = useState('');
    const [loading, setLoading] = useState(false);
    const [status,  setStatus]  = useState('');
    const [err,     setErr]     = useState('');

    async function handle() {
        setErr(''); setStatus('');
        const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (!match) { setErr('Enter a valid GitHub repo URL'); return; }

        setLoading(true);
        setStatus('Cloning repository…');

        try {
            // 1. trigger backend analysis
            const res = await fetch('http://localhost:7777/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            setStatus('Running analysis…');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Analysis failed');

            // 2. load the freshly generated report
            setStatus('Loading results…');
            await new Promise(r => setTimeout(r, 600)); // small delay for effect
            const rep = await fetch('/analysis_report.json?t=' + Date.now());
            const report = await rep.json();
            if (!report.summary || !Array.isArray(report.files))
                throw new Error('Invalid report');
            report.healthScore = report.summary.healthScore;
            onLoad(report);
            setStatus('');
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card p-4 mb-6 no-print">
            <p className="card-header">Analyze GitHub Repository</p>
            <div className="flex gap-2">
                <input
                    className="input"
                    placeholder="https://github.com/user/repo"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !loading && handle()}
                    disabled={loading}
                />
                <button onClick={handle} disabled={loading} className="btn-primary whitespace-nowrap min-w-[120px]">
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Working…
                        </span>
                    ) : 'Analyze'}
                </button>
            </div>
            {status && (
                <div className="flex items-center gap-2 mt-2 text-xs text-indigo-500 dark:text-indigo-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    {status}
                </div>
            )}
            {err && <p className="text-red-500 text-xs mt-2">⚠ {err}</p>}
        </div>
    );
}