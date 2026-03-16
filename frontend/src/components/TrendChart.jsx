import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { generateTrendData } from '../utils/insights';
import { scoreColor } from '../utils/path';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value;
    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs shadow">
            <p className="font-bold" style={{ color: scoreColor(v) }}>{v} / 100</p>
        </div>
    );
};

export default function TrendChart({ score }) {
    const data = generateTrendData(score ?? 72);
    const color = scoreColor(score ?? 72);
    return (
        <div className="card p-6">
            <p className="card-header">Health Score Trend (6 weeks)</p>
            <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data} margin={{ left: 0, right: 10, top: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="4 2"
                        label={{ value: 'target', fontSize: 9, fill: '#f59e0b', position: 'insideTopRight' }} />
                    <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2.5}
                        dot={{ fill: color, r: 3 }} activeDot={{ r: 5 }}
                        isAnimationActive animationDuration={1000} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}