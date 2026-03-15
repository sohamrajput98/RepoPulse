import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { basename } from '../utils/path';

export default function ComplexityChart({ files }) {
    if (!files?.length) return null;

    const data = files
        .map(f => ({
            name: basename(f.path),
            complexity: Math.max(0, ...( f.functions?.map(fn => fn.complexity) ?? [0]))
        }))
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 15);

    return (
        <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Complexity per File</h2>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ left: 0, right: 10 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="4 2" label={{ value:'threshold', fontSize:10, fill:'#ef4444' }} />
                    <Bar dataKey="complexity" radius={[4,4,0,0]}>
                        {data.map((d, i) => (
                            <Cell key={i} fill={d.complexity > 10 ? '#ef4444' : '#3b82f6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}