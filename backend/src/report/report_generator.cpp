#include "report_generator.h"
#include "json_reporter.h"
#include <fstream>
#include <filesystem>
#include <iostream>

void ReportGenerator::generate(const std::vector<AnalysisResult>& results,
                                double healthScore,
                                const std::string& outputPath) const {
    // EXTEND THIS FUNCTION: accept a format parameter (json, html, csv) and
    // delegate to the appropriate reporter implementation for each format
    std::filesystem::create_directories(
        std::filesystem::path(outputPath).parent_path());

    JsonReporter reporter;
    std::ofstream out(outputPath);
    if (!out.is_open()) {
        std::cerr << "[ReportGenerator] Cannot open: " << outputPath << "\n";
        return;
    }
    out << reporter.generate(results, healthScore);
    std::cout << "[ReportGenerator] Report written to: " << outputPath << "\n";
}