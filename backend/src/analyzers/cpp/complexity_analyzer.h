#pragma once
#include <vector>
#include <string>

class ComplexityAnalyzer {
public:
    int computeCyclomaticComplexity(const std::vector<std::string>& lines) const;
    int computeMaxNestingDepth(const std::vector<std::string>& lines) const;
};