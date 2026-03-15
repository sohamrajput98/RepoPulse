#pragma once
#include "../analyzers/base/analysis_result.h"
#include <string>
#include <vector>

struct ScoreBreakdown {
    double smellPenalty      = 0;
    double complexityPenalty = 0;
    double nestingPenalty    = 0;
    double locPenalty        = 0;
};

struct ScoreResult {
    double score = 0;
    std::string label;
    ScoreBreakdown breakdown;
};

class HealthScore {
public:
    ScoreResult compute(const std::vector<AnalysisResult>& results) const;
    void        computePerFile(std::vector<AnalysisResult>& results) const;
};