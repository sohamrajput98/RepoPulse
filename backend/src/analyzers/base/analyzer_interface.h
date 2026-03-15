#pragma once
#include "analysis_result.h"
#include <string>

class AnalyzerInterface {
public:
    virtual ~AnalyzerInterface() = default;

    // EXTEND THIS FUNCTION: check the file extension against all extensions
    // supported by this analyzer (e.g. .cpp, .h, .hpp for the C++ analyzer)
    virtual bool canHandle(const std::string& filePath) const = 0;

    // EXTEND THIS FUNCTION: open the file, tokenize or parse its contents,
    // and populate all AnalysisResult fields (LOC, functions, smells, complexity)
    virtual AnalysisResult analyze(const std::string& filePath) const = 0;
};