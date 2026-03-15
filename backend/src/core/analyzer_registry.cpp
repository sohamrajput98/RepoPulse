#include "analyzer_registry.h"

void AnalyzerRegistry::registerAnalyzer(std::unique_ptr<AnalyzerInterface> analyzer) {
    // EXTEND THIS FUNCTION: support priority ordering so more specific analyzers
    // (e.g. a header-only analyzer) can override a general language analyzer
    analyzers.push_back(std::move(analyzer));
}

AnalyzerInterface* AnalyzerRegistry::getAnalyzer(const std::string& filePath) const {
    // EXTEND THIS FUNCTION: iterate registered analyzers and return the first
    // one whose canHandle() returns true for the given file path
    for (const auto& a : analyzers)
        if (a->canHandle(filePath)) return a.get();
    return nullptr;
}