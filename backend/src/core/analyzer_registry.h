#pragma once
#include "../analyzers/base/analyzer_interface.h"
#include <memory>
#include <vector>

class AnalyzerRegistry {
public:
    // EXTEND THIS FUNCTION: support priority ordering so more specific analyzers
    // (e.g. a header-only analyzer) can override a general language analyzer
    void registerAnalyzer(std::unique_ptr<AnalyzerInterface> analyzer);

    // EXTEND THIS FUNCTION: iterate registered analyzers and return the first
    // one whose canHandle() returns true for the given file path
    AnalyzerInterface* getAnalyzer(const std::string& filePath) const;

private:
    std::vector<std::unique_ptr<AnalyzerInterface>> analyzers;
};