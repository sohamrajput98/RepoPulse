#include "function_metrics.h"
#include <regex>

std::vector<FunctionInfo> FunctionMetrics::extract(const std::vector<std::string>& lines) const {
    std::vector<FunctionInfo> functions;
    std::regex sig(R"(^\s*(?:[\w\*&:<>~]+\s+)+(\~?\w+)\s*\(([^;]*)\)\s*(const\s*)?\{?)");

    for (size_t i = 0; i < lines.size(); i++) {
        std::smatch m;
        if (!std::regex_search(lines[i], m, sig)) continue;
        if (lines[i].find(';') != std::string::npos &&
            lines[i].find('{') == std::string::npos) continue;

        FunctionInfo fn;
        fn.name      = m[1];
        fn.startLine = (int)i + 1;

        // count params
        std::string params = m[2];
        if (!params.empty() && params.find_first_not_of(" \t") != std::string::npos) {
            fn.paramCount = 1;
            int depth = 0;
            for (char c : params) {
                if (c == '<' || c == '(') depth++;
                else if (c == '>' || c == ')') depth--;
                else if (c == ',' && depth == 0) fn.paramCount++;
            }
        }

        // find body end via brace matching
        int depth = 0;
        bool started = false;
        for (size_t j = i; j < lines.size(); j++) {
            for (char c : lines[j]) {
                if (c == '{') { depth++; started = true; }
                else if (c == '}') depth--;
            }
            if (started && depth == 0) {
                fn.endLine   = (int)j + 1;
                fn.lineCount = fn.endLine - fn.startLine + 1;
                break;
            }
        }
        if (fn.endLine == 0) continue;
        functions.push_back(fn);
    }
    return functions;
}