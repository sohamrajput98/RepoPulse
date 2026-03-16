import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { basename } from '../utils/path';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const v = payload[0].value;
    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs shadow-lg">
            <p className="font-semibold text-gray-700 dark:text-white">{payload[0].payload.name}</p>
            <p className="text-indigo-600 dark:text-indigo-400">Complexity: <b>{v}</b></p>
            {v > 10 && <p className="text-red-500 font-medium">⚠ Exceeds threshold</p>}
        </div>
    );
};

export default function ComplexityChart({ files }) {
    if (!files?.length) return null;
    const data = files
        .map(f => ({
            name: basename(f.path),
            complexity: Math.max(0, ...(f.functions?.map(fn => fn.complexity) ?? [0]))
        }))
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 15);

    return (
        <div className="card p-6">
            <p className="card-header">Cyclomatic Complexity — Top Files</p>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ left: 0, right: 10, top: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="5 3"
                        label={{ value: 'threshold (10)', fontSize: 10, fill: '#ef4444', position: 'insideTopRight' }} />
                    <Bar dataKey="complexity" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={800}>
                        {data.map((d, i) => (
                            <Cell key={i} fill={d.complexity > 10 ? '#ef4444' : '#6366f1'} fillOpacity={0.85} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}