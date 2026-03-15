#include "json_reporter.h"
#include <sstream>

std::string JsonReporter::generate(const std::vector<AnalysisResult>& results, double healthScore) const {
    // EXTEND THIS FUNCTION: serialise every AnalysisResult field into valid JSON,
    // escape special characters in strings, and include a repository-level summary
    // block (total files, total LOC, average complexity, overall health score)
    std::ostringstream o;
    o << "{\n  \"healthScore\": " << healthScore << ",\n  \"files\": [\n";

    for (size_t i = 0; i < results.size(); i++) {
        const auto& r = results[i];
        o << "    {\n"
          << "      \"path\": \""         << r.filePath     << "\",\n"
          << "      \"totalLines\": "     << r.totalLines   << ",\n"
          << "      \"codeLines\": "      << r.codeLines    << ",\n"
          << "      \"commentLines\": "   << r.commentLines << ",\n";

        o << "      \"smells\": [";
        for (size_t j = 0; j < r.smells.size(); j++)
            o << "\"" << r.smells[j] << "\"" << (j + 1 < r.smells.size() ? ", " : "");
        o << "],\n";

        o << "      \"functions\": [";
        for (size_t j = 0; j < r.functions.size(); j++) {
            const auto& fn = r.functions[j];
            o << "{\"name\":\"" << fn.name
              << "\",\"lines\":"      << fn.lineCount
              << ",\"complexity\":"   << fn.complexity << "}";
            if (j + 1 < r.functions.size()) o << ", ";
        }
        o << "]\n    }";
        if (i + 1 < results.size()) o << ",";
        o << "\n";
    }

    o << "  ]\n}\n";
    return o.str();
}