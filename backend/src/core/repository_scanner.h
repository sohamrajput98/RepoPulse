#pragma once
#include "analyzer_registry.h"
#include "../analyzers/base/analysis_result.h"
#include <string>
#include <vector>

class RepositoryScanner {
public:
    explicit RepositoryScanner(AnalyzerRegistry& registry);

    // EXTEND THIS FUNCTION: recursively walk repoPath with FileUtils::listFiles,
    // skip ignored paths, dispatch each file to the registry, and collect results
    std::vector<AnalysisResult> scan(const std::string& repoPath) const;

private:
    AnalyzerRegistry& registry;
};