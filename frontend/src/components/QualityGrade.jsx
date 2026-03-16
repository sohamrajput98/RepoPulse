import { getQualityGrade } from '../utils/insights';

export default function QualityGrade({ score }) {
    const { grade, color } = getQualityGrade(score ?? 0);
    return (
        <div className="card p-6 flex flex-col items-center justify-center text-center">
            <p className="card-header">Quality Grade</p>
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 mt-2"
                style={{ borderColor: color }}>
                <span className="text-5xl font-black" style={{ color }}>{grade}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-400 mt-3">
                Based on complexity,<br />smells & maintainability
            </p>
        </div>
    );
}