#pragma once
#include "../base/analyzer_interface.h"
#include "complexity_analyzer.h"
#include "smell_detector.h"

class CppAnalyzer : public AnalyzerInterface {
public:
    bool canHandle(const std::string& filePath) const override;
    AnalysisResult analyze(const std::string& filePath) const override;
private:
    ComplexityAnalyzer complexityAnalyzer;
    SmellDetector      smellDetector;
};