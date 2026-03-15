#pragma once
#include "analysis_result.h"
#include <string>

class AnalyzerInterface {
public:
    virtual ~AnalyzerInterface() = default;
    virtual bool canHandle(const std::string& filePath) const = 0;
    virtual AnalysisResult analyze(const std::string& filePath) const = 0;
};