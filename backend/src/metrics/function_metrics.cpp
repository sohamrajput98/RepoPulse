#include "function_metrics.h"
#include <regex>

std::vector<FunctionInfo> FunctionMetrics::extract(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: detect function signature lines with a regex or
    // parser, then count body lines until the matching closing brace to set
    // FunctionInfo::lineCount, and count parameters to set paramCount
    std::vector<FunctionInfo> functions;
    std::regex fnSignature(R"(^\s*\w[\w\s\*&:<>]*\s+(\w+)\s*\([^;]*\)\s*(const\s*)?\{?)");
    for (const auto& line : lines) {
        std::smatch match;
        if (std::regex_search(line, match, fnSignature)) {
            FunctionInfo info;
            info.name = match[1];
            functions.push_back(info);
        }
    }
    return functions;
}