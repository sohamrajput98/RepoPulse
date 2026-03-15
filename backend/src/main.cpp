#include "core/repository_scanner.h"
#include "core/analyzer_registry.h"
#include "analyzers/cpp/cpp_analyzer.h"
#include "scoring/health_score.h"
#include "report/report_generator.h"
#include <iostream>

int main(int argc, char* argv[]) {
    std::string repoPath   = (argc > 1) ? argv[1] : ".";
    std::string reportPath = "reports/analysis_report.json";

    AnalyzerRegistry registry;
    registry.registerAnalyzer(std::make_unique<CppAnalyzer>(), 0);

    RepositoryScanner scanner(registry);
    auto results = scanner.scan(repoPath);
    std::cout << "Analyzed: " << results.size() << " file(s)\n";

    HealthScore hs;
    hs.computePerFile(results);
    auto score = hs.compute(results);
    std::cout << "Health: " << score.score << " (" << score.label << ")\n";

    ReportGenerator gen;
    gen.generate(results, score, scanner.getSkippedFiles(), reportPath);
    return 0;
}