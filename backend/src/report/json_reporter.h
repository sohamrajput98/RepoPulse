#pragma once
#include "../analyzers/base/analysis_result.h"
#include "../scoring/health_score.h"
#include <string>
#include <vector>

class JsonReporter {
public:
    std::string generate(const std::vector<AnalysisResult>& results,
                         const ScoreResult& score,
                         const std::vector<std::string>& skipped) const;
private:
    std::string esc(const std::string& s) const;
};