#pragma once
#include "analyzer_registry.h"
#include "../analyzers/base/analysis_result.h"
#include <string>
#include <vector>

class RepositoryScanner {
public:
    explicit RepositoryScanner(AnalyzerRegistry& registry);
    std::vector<AnalysisResult> scan(const std::string& repoPath) const;
    const std::vector<std::string>& getSkippedFiles() const;

private:
    AnalyzerRegistry& registry;
    mutable std::vector<std::string> skippedFiles;
};