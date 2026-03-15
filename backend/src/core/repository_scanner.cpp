#include "repository_scanner.h"
#include "file_utils.h"
#include <future>

RepositoryScanner::RepositoryScanner(AnalyzerRegistry& registry) : registry(registry) {}

std::vector<AnalysisResult> RepositoryScanner::scan(const std::string& repoPath) const {
    std::vector<std::string> ignore = {"build/","vendor/",".git/","third_party/","node_modules/"};
    std::vector<std::string> exts   = {".cpp",".cc",".cxx",".h",".hpp"};

    auto files = FileUtils::listFiles(repoPath, ignore, exts);

    std::vector<std::future<AnalysisResult>> futures;
    for (const auto& f : files) {
        auto* analyzer = registry.getAnalyzer(f);
        if (!analyzer) { skippedFiles.push_back(f); continue; }
        futures.push_back(std::async(std::launch::async,
            [analyzer, f]() { return analyzer->analyze(f); }));
    }

    std::vector<AnalysisResult> results;
    for (auto& fut : futures) results.push_back(fut.get());
    return results;
}

const std::vector<std::string>& RepositoryScanner::getSkippedFiles() const {
    return skippedFiles;
}