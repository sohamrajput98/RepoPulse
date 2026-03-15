#pragma once
#include "../base/analyzer_interface.h"
#include "complexity_analyzer.h"
#include "smell_detector.h"

class CppAnalyzer : public AnalyzerInterface {
public:
    // EXTEND THIS FUNCTION: check the file extension against .cpp, .h, .hpp,
    // and optionally .cc and .cxx when additional extensions are needed
    bool canHandle(const std::string& filePath) const override;

    // EXTEND THIS FUNCTION: read the file into lines, then delegate to
    // LocCounter, FunctionMetrics, ComplexityAnalyzer, and SmellDetector
    // to populate all fields of the returned AnalysisResult
    AnalysisResult analyze(const std::string& filePath) const override;

private:
    ComplexityAnalyzer complexityAnalyzer;
    SmellDetector      smellDetector;
};