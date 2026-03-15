#include "repository_scanner.h"
#include "file_utils.h"

RepositoryScanner::RepositoryScanner(AnalyzerRegistry& registry)
    : registry(registry) {}

std::vector<AnalysisResult> RepositoryScanner::scan(const std::string& repoPath) const {
    // EXTEND THIS FUNCTION: recursively walk repoPath with FileUtils::listFiles,
    // skip ignored paths, dispatch each file to the registry, and collect results
    std::vector<AnalysisResult> results;
    for (const auto& filePath : FileUtils::listFiles(repoPath)) {
        auto* analyzer = registry.getAnalyzer(filePath);
        if (analyzer) results.push_back(analyzer->analyze(filePath));
    }
    return results;
}