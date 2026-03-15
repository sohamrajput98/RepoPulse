import { useAnalysisReport } from "../hooks/useAnalysisReport";
import HealthScoreCard  from "../components/HealthScoreCard";
import RepoOverview     from "../components/RepoOverview";
import ComplexityChart  from "../components/ComplexityChart";
import RiskFilesTable   from "../components/RiskFilesTable";

export default function Dashboard() {
    // EXTEND THIS FUNCTION: add a manual refresh button that re-invokes
    // fetchReport and updates all child components with the latest data
    const { report, loading, error } = useAnalysisReport();
    if (loading) return <p>Loading report…</p>;
    if (error)   return <p>Error: {error.message}</p>;
    return (
        <div>
            <h1>Code Health Monitor</h1>
            <HealthScoreCard score={report.healthScore} />
            <RepoOverview    report={report} />
            <ComplexityChart files={report.files} />
            <RiskFilesTable  files={report.files} />
        </div>
    );
}