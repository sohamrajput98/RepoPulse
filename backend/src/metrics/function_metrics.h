#pragma once
#include "../analyzers/base/analysis_result.h"
#include <vector>
#include <string>

class FunctionMetrics {
public:
    std::vector<FunctionInfo> extract(const std::vector<std::string>& lines) const;
};