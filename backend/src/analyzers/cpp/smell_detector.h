#pragma once
#include "../base/analysis_result.h"
#include <vector>
#include <string>

class SmellDetector {
public:
    std::vector<std::string> detectAll(const std::vector<std::string>& lines,
                                       const std::vector<FunctionInfo>& functions) const;
};