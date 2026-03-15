#pragma once
#include "../analyzers/base/analysis_result.h"
#include <string>
#include <vector>

class JsonReporter {
public:
    // EXTEND THIS FUNCTION: serialise every AnalysisResult field into valid JSON,
    // escape special characters in strings, and include a repository-level summary
    // block (total files, total LOC, average complexity, overall health score)
    std::string generate(const std::vector<AnalysisResult>& results, double healthScore) const;
};