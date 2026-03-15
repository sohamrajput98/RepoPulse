#include "health_score.h"
#include <algorithm>
#include <numeric>

static std::string label(double s) {
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Fair";
    if (s >= 30) return "Poor";
    return "Critical";
}

ScoreResult HealthScore::compute(const std::vector<AnalysisResult>& results) const {
    if (results.empty()) return {100.0, "Excellent", {}};

    ScoreBreakdown bd;
    int totalLOC = 0;
    for (const auto& r : results) {
        bd.smellPenalty += r.smells.size() * 2.0;
        for (const auto& fn : r.functions) {
            if (fn.complexity   > 10) bd.complexityPenalty += 5.0;
            if (fn.nestingDepth > 4)  bd.nestingPenalty    += 3.0;
        }
        totalLOC += r.totalLines;
    }
    if (totalLOC > 1000) bd.locPenalty = (totalLOC - 1000) * 0.01;

    double total = bd.smellPenalty + bd.complexityPenalty + bd.nestingPenalty + bd.locPenalty;
    double score = std::max(0.0, std::min(100.0, 100.0 - total));
    return {score, label(score), bd};
}

void HealthScore::computePerFile(std::vector<AnalysisResult>& results) const {
    for (auto& r : results) {
        double penalty = r.smells.size() * 2.0;
        for (const auto& fn : r.functions) {
            if (fn.complexity   > 10) penalty += 5.0;
            if (fn.nestingDepth > 4)  penalty += 3.0;
        }
        if (r.totalLines > 300) penalty += (r.totalLines - 300) * 0.01;
        r.healthScore = std::max(0.0, std::min(100.0, 100.0 - penalty));
    }
}