#pragma once
#include <vector>
#include <string>

class SmellDetector {
public:
    // EXTEND THIS FUNCTION: compare lines.size() against a threshold to flag
    // files that are too large to maintain (LargeFile smell)
    std::vector<std::string> detectLargeFile(const std::vector<std::string>& lines) const;

    // EXTEND THIS FUNCTION: inspect each FunctionInfo's lineCount and paramCount
    // to flag LongFunction and ExcessiveParameters smells
    std::vector<std::string> detectFunctionSmells(const std::vector<std::string>& lines) const;

    // EXTEND THIS FUNCTION: measure line.length() per line to flag LongLine
    // and check for repeated token patterns to flag CodeDuplication
    std::vector<std::string> detectStyleSmells(const std::vector<std::string>& lines) const;

    // Runs all detectors and returns the combined smell list
    std::vector<std::string> detectAll(const std::vector<std::string>& lines) const;
};