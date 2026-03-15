#pragma once
#include "../analyzers/base/analysis_result.h"
#include <vector>
#include <string>

class FunctionMetrics {
public:
    // EXTEND THIS FUNCTION: detect function signature lines with a regex or
    // parser, then count body lines until the matching closing brace to set
    // FunctionInfo::lineCount, and count parameters to set paramCount
    std::vector<FunctionInfo> extract(const std::vector<std::string>& lines) const;
};