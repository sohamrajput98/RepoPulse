import { useState } from 'react';
import { useAnalysisReport } from '../hooks/useAnalysisReport';
import Navbar          from '../components/Navbar';
import SummaryBanner   from '../components/SummaryBanner';
import GitHubInput     from '../components/GitHubInput';
import HealthScoreCard from '../components/HealthScoreCard';
import QualityGrade    from '../components/QualityGrade';
import RepoOverview    from '../components/RepoOverview';
import ComplexityChart from '../components/ComplexityChart';
import SmellsPieChart  from '../components/SmellsPieChart';
import TopFunctions    from '../components/TopFunctions';
import FileColorTree   from '../components/FileColorTree';
import TrendChart      from '../components/TrendChart';
import RiskHeatmap     from '../components/RiskHeatmap';
import AISuggestions   from '../components/AISuggestions';
import InsightsPanel   from '../components/InsightsPanel';
import RiskFilesTable  from '../components/RiskFilesTable';

export default function Dashboard() {
    const { report, loading, error, refresh, isStale } = useAnalysisReport();
    const [overrideReport, setOverrideReport] = useState(null);
    const data = overrideReport || report;

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
                <p className="text-gray-400 dark:text-slate-400 text-sm">Analyzing repository…</p>
            </div>
        </div>
    );

    if (error && !data) return (
        <div className="flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
            <div className="card p-8 max-w-md text-center">
                <p className="text-3xl mb-3">⚠️</p>
                <p className="text-red-500 font-medium mb-2">{error.message}</p>
                <p className="text-gray-400 dark:text-slate-400 text-sm mb-4">
                    Make sure <code className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-1 py-0.5 rounded">frontend/public/analysis_report.json</code> exists.
                </p>
                <button onClick={refresh} className="btn-primary">Retry</button>
            </div>
        </div>
    );

    const score = data?.summary?.healthScore;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Navbar onRefresh={refresh} onPrint={() => window.print()} />
            <main className="max-w-7xl mx-auto px-6 py-8">

                {isStale && (
                    <div className="no-print mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm px-4 py-2 rounded-xl flex items-center justify-between">
                        <span>⚠ Report may be outdated.</span>
                        <button onClick={refresh} className="underline font-medium">Refresh now</button>
                    </div>
                )}

                <GitHubInput onLoad={setOverrideReport} />
                <SummaryBanner summary={data?.summary} generatedAt={data?.generatedAt} />

                {/* Row 1: Score + Grade + Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <HealthScoreCard score={score} label={data?.summary?.healthLabel} breakdown={data?.summary?.scoreBreakdown} />
                    <QualityGrade score={score} />
                    <div className="lg:col-span-2"><RepoOverview summary={data?.summary} /></div>
                </div>

                {/* Row 2: Complexity + Smells */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ComplexityChart files={data?.files} />
                    <SmellsPieChart  files={data?.files} />
                </div>

                {/* Row 3: Trend + Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <TrendChart  score={score} />
                    <RiskHeatmap files={data?.files} />
                </div>

                {/* Row 4: Top Functions + File Tree */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <TopFunctions  files={data?.files} />
                    <FileColorTree files={data?.files} />
                </div>

                {/* Row 5: AI Suggestions */}
                <div className="mb-6">
                    <AISuggestions files={data?.files} score={score} />
                </div>

                {/* Row 6: Insights Panel */}
                <div className="mb-6">
                    <InsightsPanel files={data?.files} />
                </div>

                {/* Row 7: Risk Table */}
                <RiskFilesTable files={data?.files} />
            </main>
        </div>
    );
}