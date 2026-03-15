#include "cpp_analyzer.h"
#include "../../metrics/loc_counter.h"
#include "../../metrics/function_metrics.h"
#include <fstream>

bool CppAnalyzer::canHandle(const std::string& filePath) const {
    // EXTEND THIS FUNCTION: check the file extension against .cpp, .h, .hpp,
    // and optionally .cc and .cxx when additional extensions are needed
    auto dot = filePath.rfind('.');
    if (dot == std::string::npos) return false;
    auto ext = filePath.substr(dot + 1);
    return ext == "cpp" || ext == "h" || ext == "hpp";
}

AnalysisResult CppAnalyzer::analyze(const std::string& filePath) const {
    // EXTEND THIS FUNCTION: read the file into lines, then delegate to
    // LocCounter, FunctionMetrics, ComplexityAnalyzer, and SmellDetector
    // to populate all fields of the returned AnalysisResult
    AnalysisResult result;
    result.filePath = filePath;

    std::ifstream file(filePath);
    if (!file.is_open()) return result;

    std::vector<std::string> lines;
    std::string line;
    while (std::getline(file, line)) lines.push_back(line);

    LocCounter locCounter;
    auto loc = locCounter.count(lines);
    result.totalLines   = loc.total;
    result.codeLines    = loc.code;
    result.commentLines = loc.comments;
    result.blankLines   = loc.blank;

    FunctionMetrics fm;
    result.functions = fm.extract(lines);

    for (auto& fn : result.functions)
        fn.complexity = complexityAnalyzer.computeCyclomaticComplexity(lines);

    result.smells = smellDetector.detectAll(lines);
    return result;
}