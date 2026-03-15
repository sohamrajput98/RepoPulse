#include "smell_detector.h"

static int cfg(const char* key, int def) {
    // TODO: load from analysis_rules.json — using defaults for now
    (void)key; return def;
}

std::vector<std::string> SmellDetector::detectAll(const std::vector<std::string>& lines,
                                                    const std::vector<FunctionInfo>& functions) const {
    std::vector<std::string> smells;
    int maxFile  = cfg("maxFileLines",     300);
    int maxFn    = cfg("maxFunctionLines",  50);
    int maxParam = 5;
    int maxNest  = cfg("maxNestingDepth",    4);
    int maxCC    = cfg("maxComplexity",     10);
    int maxLine  = cfg("longLineLength",   120);

    if ((int)lines.size() > maxFile)
        smells.push_back("LargeFile");

    for (const auto& line : lines)
        if ((int)line.size() > maxLine) { smells.push_back("LongLine"); break; }

    for (const auto& fn : functions) {
        if (fn.lineCount  > maxFn)   smells.push_back("LongFunction:"   + fn.name);
        if (fn.paramCount > maxParam) smells.push_back("ExcessiveParams:" + fn.name);
        if (fn.nestingDepth > maxNest) smells.push_back("DeepNesting:"   + fn.name);
        if (fn.complexity > maxCC)   smells.push_back("HighComplexity:" + fn.name);
    }

    return smells;
}