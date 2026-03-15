import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

function getColor(score) {
    if (score >= 85) return '#22c55e';
    if (score >= 70) return '#84cc16';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
}

export default function HealthScoreCard({ score, label }) {
    const color = getColor(score ?? 0);
    const data  = [{ value: score ?? 0, fill: color }];
    return (
        <div className="bg-white rounded-xl p-6 shadow text-center">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Health Score</h2>
            <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart innerRadius="60%" outerRadius="100%"
                    startAngle={180} endAngle={0} data={data}>
                    <RadialBar dataKey="value" max={100} cornerRadius={6} />
                </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-4xl font-bold mt-2" style={{ color }}>
                {score?.toFixed(1) ?? 'N/A'}
            </p>
            <p className="text-sm font-medium mt-1" style={{ color }}>{label}</p>
        </div>
    );
}