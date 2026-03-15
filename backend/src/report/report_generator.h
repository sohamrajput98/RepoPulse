#pragma once
#include "../analyzers/base/analysis_result.h"
#include <string>
#include <vector>

class ReportGenerator {
public:
    // EXTEND THIS FUNCTION: accept a format parameter (json, html, csv) and
    // delegate to the appropriate reporter implementation for each format
    void generate(const std::vector<AnalysisResult>& results,
                  double healthScore,
                  const std::string& outputPath) const;
};