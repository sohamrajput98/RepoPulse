#include "core/repository_scanner.h"
#include "core/analyzer_registry.h"
#include "analyzers/cpp/cpp_analyzer.h"
#include "scoring/health_score.h"
#include "report/report_generator.h"
#include <iostream>

int main(int argc, char* argv[]) {
    // EXTEND THIS FUNCTION: add a proper CLI parser that accepts --repo, --output,
    // and --ignore flags, and print a usage message when arguments are missing
    const std::string repoPath   = (argc > 1) ? argv[1] : ".";
    const std::string reportPath = "reports/analysis_report.json";

    std::cout << "[main] Scanning: " << repoPath << "\n";

    AnalyzerRegistry registry;
    registry.registerAnalyzer(std::make_unique<CppAnalyzer>());
    // EXTEND THIS FUNCTION: register additional language analyzers here
    // (Python, JavaScript, etc.) as they are implemented

    RepositoryScanner scanner(registry);
    auto results = scanner.scan(repoPath);
    std::cout << "[main] Files analyzed: " << results.size() << "\n";

    HealthScore scorer;
    double score = scorer.compute(results);
    std::cout << "[main] Health score: " << score << "\n";

    ReportGenerator generator;
    generator.generate(results, score, reportPath);

    return 0;
}