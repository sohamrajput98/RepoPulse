export function getQualityGrade(score) {
    if (score >= 90) return { grade: 'A', color: '#22c55e' };
    if (score >= 80) return { grade: 'B', color: '#84cc16' };
    if (score >= 70) return { grade: 'C', color: '#f59e0b' };
    if (score >= 50) return { grade: 'D', color: '#f97316' };
    return { grade: 'F', color: '#ef4444' };
}

export function generateTrendData(currentScore) {
    
    const weeks = ['6w ago','5w ago','4w ago','3w ago','2w ago','1w ago','Now'];
    let score = Math.max(20, currentScore - 18);
    return weeks.map((week, i) => {
        const noise = (Math.random() - 0.5) * 6;
        score = Math.min(100, Math.max(0, score + (i * 3) + noise));
        return { week, score: Math.round(i === 6 ? currentScore : score) };
    });
}

export function getUnusedVarHints(files) {
    
    const hints = [];
    files?.forEach(f => {
        f.functions?.forEach(fn => {
            if (fn.paramCount >= 2 && fn.complexity === 1) {
                hints.push({
                    file: f.path.split(/[\\/]/).pop(),
                    fn: fn.name,
                    message: `Parameters in '${fn.name}' may not all be used (complexity=1 with ${fn.paramCount} params)`
                });
            }
        });
    });
    return hints.slice(0, 6);
}

export function getOptimizationHints(files) {
    const hints = [];
    files?.forEach(f => {
        f.functions?.forEach(fn => {
            if (fn.nestingDepth >= 3 && fn.lineCount > 20) {
                hints.push({
                    file: f.path.split(/[\\/]/).pop(),
                    fn: fn.name,
                    type: 'O(n²) risk',
                    message: `'${fn.name}' has ${fn.nestingDepth} nesting levels — possible nested loop, consider refactoring`
                });
            }
            if (fn.lineCount > 40 && fn.complexity > 5) {
                hints.push({
                    file: f.path.split(/[\\/]/).pop(),
                    fn: fn.name,
                    type: 'Split candidate',
                    message: `'${fn.name}' is ${fn.lineCount} lines with CC=${fn.complexity} — split into smaller functions`
                });
            }
        });
        if (f.smells?.includes('LargeFile')) {
            hints.push({
                file: f.path.split(/[\\/]/).pop(),
                fn: null,
                type: 'Modularize',
                message: `File exceeds 300 lines — consider splitting into modules`
            });
        }
    });
    return hints.slice(0, 6);
}

export function getDeadCodeHints(files) {
    const hints = [];
    files?.forEach(f => {
        f.functions?.forEach(fn => {
            if (fn.complexity === 1 && fn.lineCount <= 5 && fn.paramCount === 0) {
                hints.push({
                    file: f.path.split(/[\\/]/).pop(),
                    fn: fn.name,
                    message: `'${fn.name}' is trivial (${fn.lineCount} lines, no params) — potentially unused`
                });
            }
        });
    });
    return hints.slice(0, 4);
}

export function getMagicNumbers(files) {
    const results = [];
    files?.forEach(f => {
        f.functions?.forEach(fn => {
            if (fn.complexity > 7) {
                results.push({
                    file: f.path.split(/[\\/]/).pop(),
                    fn: fn.name,
                    message: `'${fn.name}' likely contains magic numbers (CC=${fn.complexity}) — use named constants`
                });
            }
        });
    });
    return results.slice(0, 5);
}

export function getDuplicateFunctions(files) {
    const seen = {};
    const dupes = [];
    files?.forEach(f => {
        f.functions?.forEach(fn => {
            if (seen[fn.name]) {
                dupes.push({
                    name: fn.name,
                    files: [seen[fn.name], f.path.split(/[\\/]/).pop()]
                });
            } else {
                seen[fn.name] = f.path.split(/[\\/]/).pop();
            }
        });
    });
    return dupes.slice(0, 5);
}

export function getAISuggestions(files, score) {
    const suggestions = [];
    files?.forEach(f => {
        const fname = f.path.split(/[\\/]/).pop();
        f.functions?.forEach(fn => {
            if (fn.complexity > 10)
                suggestions.push({ level:'high', icon:'🔴', text:`Function '${fn.name}' in ${fname} has complexity ${fn.complexity} — consider breaking it into smaller, focused functions` });
            if (fn.nestingDepth > 3)
                suggestions.push({ level:'medium', icon:'🟠', text:`'${fn.name}' in ${fname} has ${fn.nestingDepth} nesting levels — extract inner blocks into helper functions` });
            if (fn.paramCount > 4)
                suggestions.push({ level:'medium', icon:'🟡', text:`'${fn.name}' takes ${fn.paramCount} parameters — consider grouping into a struct or config object` });
        });
        if (f.totalLines > 250)
            suggestions.push({ level:'medium', icon:'🟠', text:`${fname} is ${f.totalLines} lines — split into smaller modules for better maintainability` });
        if (f.commentLines === 0 && f.codeLines > 50)
            suggestions.push({ level:'low', icon:'🔵', text:`${fname} has no comments — add documentation for public functions` });
    });
    if (score < 70)
        suggestions.unshift({ level:'high', icon:'🔴', text:`Overall health score is ${score.toFixed(1)} — prioritize refactoring high-complexity files first` });
    return suggestions.slice(0, 8);
}