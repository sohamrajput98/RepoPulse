import { useAnalysisReport } from '../hooks/useAnalysisReport';
import HealthScoreCard from '../components/HealthScoreCard';
import RepoOverview    from '../components/RepoOverview';
import ComplexityChart from '../components/ComplexityChart';
import RiskFilesTable  from '../components/RiskFilesTable';

export default function Dashboard() {
    const { report, loading, error, refresh, isStale } = useAnalysisReport();

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
    );
    if (error) return <p className="p-8 text-red-500">{error.message}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {isStale && (
                <div className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2 rounded mb-4">
                    Report may be outdated.
                    <button onClick={refresh} className="ml-3 underline">Refresh</button>
                </div>
            )}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">RepoPulse</h1>
                <button onClick={refresh}
                    className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Refresh
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <HealthScoreCard score={report.summary.healthScore} label={report.summary.healthLabel} />
                <div className="md:col-span-2"><RepoOverview summary={report.summary} /></div>
            </div>
            <div className="mb-6"><ComplexityChart files={report.files} /></div>
            <RiskFilesTable files={report.files} />
        </div>
    );
}