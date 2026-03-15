#include "health_score.h"
#include <algorithm>

double HealthScore::compute(const std::vector<AnalysisResult>& results) const {
    // EXTEND THIS FUNCTION: apply a weighted formula combining average cyclomatic
    // complexity, smell count, comment ratio, and large-file penalties to produce
    // a score in [0, 100] that reflects overall repository maintainability
    if (results.empty()) return 100.0;
    double penalty = 0.0;
    for (const auto& r : results) {
        penalty += r.smells.size() * 2.0;
        for (const auto& fn : r.functions)
            if (fn.complexity > 10) penalty += 5.0;
    }
    return std::max(0.0, std::min(100.0, 100.0 - penalty));
}