#include "json_reporter.h"
#include <sstream>
#include <ctime>
#include <numeric>

std::string JsonReporter::esc(const std::string& s) const {
    std::string o;
    for (char c : s) {
        if (c == '"')  o += "\\\"";
        else if (c == '\\') o += "\\\\";
        else o += c;
    }
    return o;
}

std::string JsonReporter::generate(const std::vector<AnalysisResult>& results,
                                    const ScoreResult& score,
                                    const std::vector<std::string>& skipped) const {
    std::time_t now = std::time(nullptr);
    char ts[32]; std::strftime(ts, sizeof(ts), "%Y-%m-%dT%H:%M:%SZ", std::gmtime(&now));

    int totalLOC  = 0, totalFn = 0, totalSmells = 0;
    double avgCC  = 0; int fnCount = 0;
    for (const auto& r : results) {
        totalLOC    += r.totalLines;
        totalFn     += r.functions.size();
        totalSmells += r.smells.size();
        for (const auto& fn : r.functions) { avgCC += fn.complexity; fnCount++; }
    }
    if (fnCount > 0) avgCC /= fnCount;

    std::ostringstream o;
    o << "{\n";
    o << "  \"generatedAt\": \"" << ts << "\",\n";
    o << "  \"summary\": {\n";
    o << "    \"totalFiles\": "       << results.size()  << ",\n";
    o << "    \"totalLOC\": "         << totalLOC        << ",\n";
    o << "    \"totalFunctions\": "   << totalFn         << ",\n";
    o << "    \"totalSmells\": "      << totalSmells     << ",\n";
    o << "    \"averageComplexity\": "<< avgCC           << ",\n";
    o << "    \"healthScore\": "      << score.score     << ",\n";
    o << "    \"healthLabel\": \""    << score.label     << "\",\n";
    o << "    \"scoreBreakdown\": {\n";
    o << "      \"smellPenalty\": "      << score.breakdown.smellPenalty      << ",\n";
    o << "      \"complexityPenalty\": " << score.breakdown.complexityPenalty << ",\n";
    o << "      \"nestingPenalty\": "    << score.breakdown.nestingPenalty    << ",\n";
    o << "      \"locPenalty\": "        << score.breakdown.locPenalty        << "\n";
    o << "    },\n";
    o << "    \"skippedFiles\": [";
    for (size_t i = 0; i < skipped.size(); i++)
        o << "\"" << esc(skipped[i]) << "\"" << (i+1<skipped.size()?",":"");
    o << "]\n  },\n";

    o << "  \"files\": [\n";
    for (size_t i = 0; i < results.size(); i++) {
        const auto& r = results[i];
        o << "    {\n";
        o << "      \"path\": \""         << esc(r.filePath)   << "\",\n";
        o << "      \"totalLines\": "     << r.totalLines      << ",\n";
        o << "      \"codeLines\": "      << r.codeLines       << ",\n";
        o << "      \"commentLines\": "   << r.commentLines    << ",\n";
        o << "      \"blankLines\": "     << r.blankLines      << ",\n";
        o << "      \"healthScore\": "    << r.healthScore     << ",\n";
        o << "      \"smells\": [";
        for (size_t j = 0; j < r.smells.size(); j++)
            o << "\"" << esc(r.smells[j]) << "\"" << (j+1<r.smells.size()?",":"");
        o << "],\n";
        o << "      \"functions\": [\n";
        for (size_t j = 0; j < r.functions.size(); j++) {
            const auto& fn = r.functions[j];
            o << "        {";
            o << "\"name\":\""      << esc(fn.name)   << "\",";
            o << "\"startLine\":"   << fn.startLine   << ",";
            o << "\"endLine\":"     << fn.endLine     << ",";
            o << "\"lineCount\":"   << fn.lineCount   << ",";
            o << "\"paramCount\":"  << fn.paramCount  << ",";
            o << "\"complexity\":"  << fn.complexity  << ",";
            o << "\"nestingDepth\":"<< fn.nestingDepth<< "}";
            if (j+1 < r.functions.size()) o << ",";
            o << "\n";
        }
        o << "      ]\n";
        o << "    }";
        if (i+1 < results.size()) o << ",";
        o << "\n";
    }
    o << "  ]\n}\n";
    return o.str();
}