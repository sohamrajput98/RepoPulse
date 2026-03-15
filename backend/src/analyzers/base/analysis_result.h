#pragma once
#include <string>
#include <vector>

struct FunctionInfo {
    std::string name;
    int lineCount   = 0;
    int complexity  = 0;
    int paramCount  = 0;
};

struct AnalysisResult {
    std::string filePath;
    int totalLines   = 0;
    int codeLines    = 0;
    int commentLines = 0;
    int blankLines   = 0;
    std::vector<FunctionInfo> functions;
    std::vector<std::string>  smells;
    double healthScore = 0.0;
};