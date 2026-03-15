export default function HealthScoreCard({ score }) {
    // EXTEND THIS FUNCTION: map score ranges to colour classes
    // (green ≥ 80, yellow ≥ 50, red < 50) and add a descriptive label
    return (
        <div>
            <h2>Health Score</h2>
            <p>{score !== undefined ? score.toFixed(1) : "N/A"} / 100</p>
        </div>
    );
}