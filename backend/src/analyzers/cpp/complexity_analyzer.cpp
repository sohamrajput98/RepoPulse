#include "complexity_analyzer.h"
#include <regex>

int ComplexityAnalyzer::computeCyclomaticComplexity(const std::vector<std::string>& lines) const {
    int cc = 1;
    std::regex branch(R"(\b(if|else|for|while|do|case|catch)\b|(\?\s*[^:])|(&&|\|\|))");
    for (const auto& line : lines) {
        auto it = std::sregex_iterator(line.begin(), line.end(), branch);
        cc += std::distance(it, std::sregex_iterator());
    }
    return cc;
}

int ComplexityAnalyzer::computeMaxNestingDepth(const std::vector<std::string>& lines) const {
    int depth = 0, maxDepth = 0;
    for (const auto& line : lines) {
        for (char c : line) {
            if (c == '{') maxDepth = std::max(maxDepth, ++depth);
            else if (c == '}') if (depth > 0) depth--;
        }
    }
    return maxDepth;
}