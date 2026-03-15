#pragma once
#include <vector>
#include <string>

class ComplexityAnalyzer {
public:
    // EXTEND THIS FUNCTION: count branching keywords (if, for, while, switch,
    // case, catch, &&, ||) per function body to compute cyclomatic complexity
    int computeCyclomaticComplexity(const std::vector<std::string>& lines) const;

    // EXTEND THIS FUNCTION: track the current indentation depth per line
    // to detect functions that exceed a configurable nesting threshold
    int computeMaxNestingDepth(const std::vector<std::string>& lines) const;
};