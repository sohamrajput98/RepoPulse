import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useCountUp } from '../hooks/useCountUp';
import { scoreColor } from '../utils/path';

export default function HealthScoreCard({ score, label, breakdown }) {
    const animated = useCountUp(Math.round(score ?? 0), 1200);
    const color     = scoreColor(score ?? 0);
    const data      = [{ value: score ?? 0, fill: color }];

    return (
        <div className="card p-6 text-center">
            <p className="card-header">Health Score</p>
            <div className="relative">
                <ResponsiveContainer width="100%" height={150}>
                    <RadialBarChart innerRadius="65%" outerRadius="100%"
                        startAngle={180} endAngle={0} data={data}>
                        <RadialBar dataKey="value" max={100} cornerRadius={8} isAnimationActive />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
                    <span className="text-4xl font-bold count-anim" style={{ color }}>{animated}</span>
                    <span className="text-sm font-semibold mt-0.5" style={{ color }}>{label}</span>
                </div>
            </div>
            {breakdown && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-left">
                    {Object.entries(breakdown).map(([k, v]) => (
                        <div key={k} className="flex justify-between bg-gray-50 dark:bg-slate-700 rounded-lg px-2 py-1">
                            <span className="text-gray-500 dark:text-slate-400 capitalize">{k.replace('Penalty','')}</span>
                            <span className="font-semibold text-red-500">-{v}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}