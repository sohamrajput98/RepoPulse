#include "smell_detector.h"

std::vector<std::string> SmellDetector::detectLargeFile(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: compare lines.size() against a threshold to flag
    // files that are too large to maintain (LargeFile smell)
    std::vector<std::string> result;
    if (lines.size() > 300) result.push_back("LargeFile");
    return result;
}

std::vector<std::string> SmellDetector::detectFunctionSmells(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: inspect each FunctionInfo's lineCount and paramCount
    // to flag LongFunction and ExcessiveParameters smells
    (void)lines;
    return {};
}

std::vector<std::string> SmellDetector::detectStyleSmells(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: measure line.length() per line to flag LongLine
    // and check for repeated token patterns to flag CodeDuplication
    std::vector<std::string> result;
    for (const auto& line : lines) {
        if (line.length() > 120) { result.push_back("LongLine"); break; }
    }
    return result;
}

std::vector<std::string> SmellDetector::detectAll(const std::vector<std::string>& lines) const {
    auto result = detectLargeFile(lines);
    auto fn     = detectFunctionSmells(lines);
    auto style  = detectStyleSmells(lines);
    result.insert(result.end(), fn.begin(),    fn.end());
    result.insert(result.end(), style.begin(), style.end());
    return result;
}