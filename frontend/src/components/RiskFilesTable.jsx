export default function RiskFilesTable({ files }) {
    // EXTEND THIS FUNCTION: sort files by a computed risk score
    // (smell count + max complexity) descending and add pagination
    if (!files?.length) return <p>No files to display.</p>;
    const risky = files.filter(f => f.smells?.length > 0);
    return (
        <div>
            <h2>Risky Files</h2>
            <table>
                <thead>
                    <tr><th>File</th><th>Smells</th><th>Lines</th></tr>
                </thead>
                <tbody>
                    {risky.map((f, i) => (
                        <tr key={i}>
                            <td>{f.path}</td>
                            <td>{f.smells.join(", ")}</td>
                            <td>{f.totalLines}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}