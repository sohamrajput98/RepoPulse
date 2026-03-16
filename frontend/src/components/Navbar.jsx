import { useDarkMode } from '../hooks/useDarkMode';

function SunIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );
}

export default function Navbar({ onRefresh, onPrint }) {
    const [dark, setDark] = useDarkMode();
    return (
        <nav className="no-print sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg tracking-tight">
                    ⚡ RepoPulse
                </span>
                <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 ml-1">
                    v1.0
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onPrint}    className="btn-ghost no-print">Export PDF</button>
                <button onClick={onRefresh}  className="btn-ghost no-print">Refresh</button>
                <button onClick={() => setDark(d => !d)} className="btn-ghost p-2">
                    {dark ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </nav>
    );
}