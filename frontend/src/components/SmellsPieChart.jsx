import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#ef4444','#f59e0b','#6366f1','#22c55e','#3b82f6','#a855f7','#ec4899'];

export default function SmellsPieChart({ files }) {
    if (!files?.length) return null;

    const counts = {};
    files.forEach(f => f.smells?.forEach(s => {
        const key = s.split(':')[0];
        counts[key] = (counts[key] || 0) + 1;
    }));

    const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
    if (!data.length) return (
        <div className="card p-6 flex items-center justify-center h-48">
            <p className="text-gray-400 dark:text-slate-500 text-sm">No smells detected 🎉</p>
        </div>
    );

    return (
        <div className="card p-6">
            <p className="card-header">Smell Distribution</p>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        dataKey="value" paddingAngle={3} isAnimationActive animationDuration={800}>
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}