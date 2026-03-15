#pragma once
#include "../analyzers/base/analyzer_interface.h"
#include <memory>
#include <vector>
#include <string>

struct RegisteredAnalyzer {
    std::unique_ptr<AnalyzerInterface> analyzer;
    int priority = 0;
};

class AnalyzerRegistry {
public:
    void registerAnalyzer(std::unique_ptr<AnalyzerInterface> analyzer, int priority = 0);
    AnalyzerInterface* getAnalyzer(const std::string& filePath) const;
    std::vector<std::string> listRegistered() const;

private:
    std::vector<RegisteredAnalyzer> analyzers;
};