#include "analyzer_registry.h"
#include <algorithm>

void AnalyzerRegistry::registerAnalyzer(std::unique_ptr<AnalyzerInterface> analyzer, int priority) {
    analyzers.push_back({std::move(analyzer), priority});
    std::sort(analyzers.begin(), analyzers.end(),
        [](const RegisteredAnalyzer& a, const RegisteredAnalyzer& b) {
            return a.priority > b.priority;
        });
}

AnalyzerInterface* AnalyzerRegistry::getAnalyzer(const std::string& filePath) const {
    for (const auto& ra : analyzers)
        if (ra.analyzer->canHandle(filePath)) return ra.analyzer.get();
    return nullptr;
}

std::vector<std::string> AnalyzerRegistry::listRegistered() const {
    std::vector<std::string> list;
    for (const auto& ra : analyzers)
        list.push_back("priority=" + std::to_string(ra.priority));
    return list;
}