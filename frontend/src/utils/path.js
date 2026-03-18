export function basename(p) {
  return p?.split(/[\\/]/).pop() ?? p;
}

export function scoreColor(score) {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export function scoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Poor";
  return "Critical";
}

export function scoreBadgeClass(score) {
  if (score >= 85)
    return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
  if (score >= 70)
    return "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300";
  if (score >= 50)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
}
