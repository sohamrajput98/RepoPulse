#include "cpp_analyzer.h"
#include "../../metrics/loc_counter.h"
#include "../../metrics/function_metrics.h"
#include <fstream>

static const std::vector<std::string> CPP_EXTS = {
    ".cpp", ".cc", ".cxx", ".c", ".h", ".hpp"
};

bool CppAnalyzer::canHandle(const std::string& filePath) const {
    auto dot = filePath.rfind('.');
    if (dot == std::string::npos) return false;
    std::string ext = filePath.substr(dot);
    for (const auto& e : CPP_EXTS)
        if (ext == e) return true;
    return false;
}

AnalysisResult CppAnalyzer::analyze(const std::string& filePath) const {
    AnalysisResult result;
    result.filePath = filePath;

    std::ifstream file(filePath);
    if (!file.is_open()) return result;

    std::vector<std::string> lines;
    std::string line;
    while (std::getline(file, line)) lines.push_back(line);

    LocCounter loc;
    auto lr = loc.count(lines);
    result.totalLines   = lr.total;
    result.codeLines    = lr.code;
    result.commentLines = lr.comments;
    result.blankLines   = lr.blank;

    FunctionMetrics fm;
    result.functions = fm.extract(lines);

    for (auto& fn : result.functions) {
        int start = fn.startLine - 1;
        int end   = fn.endLine;
        if (start < 0) start = 0;
        if (end > (int)lines.size()) end = lines.size();
        std::vector<std::string> body(lines.begin() + start, lines.begin() + end);
        fn.complexity   = complexityAnalyzer.computeCyclomaticComplexity(body);
        fn.nestingDepth = complexityAnalyzer.computeMaxNestingDepth(body);
    }

    result.smells = smellDetector.detectAll(lines, result.functions);
    return result;
}