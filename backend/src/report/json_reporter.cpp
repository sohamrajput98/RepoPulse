#include "report_generator.h"
#include "json_reporter.h"
#include <fstream>
#include <filesystem>
#include <iostream>

void ReportGenerator::generate(const std::vector<AnalysisResult>& results,
                                const ScoreResult& score,
                                const std::vector<std::string>& skipped,
                                const std::string& outputPath) const {
    std::filesystem::create_directories(
        std::filesystem::path(outputPath).parent_path());
    JsonReporter reporter;
    std::ofstream out(outputPath);
    if (!out.is_open()) { std::cerr << "Cannot open: " << outputPath << "\n"; return; }
    out << reporter.generate(results, score, skipped);
    std::cout << "Report written to: " << outputPath << "\n";
}