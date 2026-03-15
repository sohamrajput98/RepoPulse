#pragma once
#include "../analyzers/base/analysis_result.h"
#include <vector>

class HealthScore {
public:
    // EXTEND THIS FUNCTION: apply a weighted formula combining average cyclomatic
    // complexity, smell count, comment ratio, and large-file penalties to produce
    // a score in [0, 100] that reflects overall repository maintainability
    double compute(const std::vector<AnalysisResult>& results) const;
};