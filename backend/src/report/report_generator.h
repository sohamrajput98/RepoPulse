#pragma once
#include "../analyzers/base/analysis_result.h"
#include "../scoring/health_score.h"
#include <string>
#include <vector>

class ReportGenerator {
public:
    void generate(const std::vector<AnalysisResult>& results,
                  const ScoreResult& score,
                  const std::vector<std::string>& skipped,
                  const std::string& outputPath) const;
};