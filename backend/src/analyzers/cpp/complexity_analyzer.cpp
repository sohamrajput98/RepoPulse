#include "complexity_analyzer.h"
#include <regex>

int ComplexityAnalyzer::computeCyclomaticComplexity(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: count branching keywords (if, for, while, switch,
    // case, catch, &&, ||) per function body to compute cyclomatic complexity
    int complexity = 1;
    std::regex branch(R"(\b(if|for|while|case|catch|&&|\|\|)\b)");
    for (const auto& line : lines) {
        auto it = std::sregex_iterator(line.begin(), line.end(), branch);
        complexity += std::distance(it, std::sregex_iterator());
    }
    return complexity;
}

int ComplexityAnalyzer::computeMaxNestingDepth(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: track the current indentation depth per line
    // to detect functions that exceed a configurable nesting threshold
    int depth = 0, maxDepth = 0;
    for (const auto& line : lines) {
        for (char c : line) {
            if (c == '{') maxDepth = std::max(maxDepth, ++depth);
            else if (c == '}') depth = std::max(0, depth - 1);
        }
    }
    return maxDepth;
}