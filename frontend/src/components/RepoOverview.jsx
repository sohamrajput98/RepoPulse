export default function RepoOverview({ report }) {
    // EXTEND THIS FUNCTION: compute and display aggregated metrics from
    // report.files — total LOC, total functions, total smells, file count
    if (!report) return <p>No report loaded.</p>;
    return (
        <div>
            <h2>Repository Overview</h2>
            <p>Files analysed: {report.files?.length ?? 0}</p>
        </div>
    );
}