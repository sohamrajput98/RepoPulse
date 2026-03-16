#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <numeric>
#include <regex>
#include <filesystem>
#include <chrono>
#include <memory>
#include <functional>
#include <optional>
#include <variant>
#include <cassert>
#include <cmath>

// ─── Token Types ─────────────────────────────────────────────────────────────

enum class TokenType {
    KEYWORD, IDENTIFIER, LITERAL_INT, LITERAL_FLOAT, LITERAL_STRING,
    OPERATOR, PUNCTUATION, COMMENT, WHITESPACE, UNKNOWN
};

struct Token {
    TokenType   type;
    std::string value;
    int         line;
    int         col;
};

// ─── Lexer ───────────────────────────────────────────────────────────────────

class Lexer {
public:
    explicit Lexer(const std::string& source) : src(source), pos(0), line(1), col(1) {}

    std::vector<Token> tokenize() {
        std::vector<Token> tokens;
        while (pos < src.size()) {
            skipWhitespace();
            if (pos >= src.size()) break;

            if (isAlpha(src[pos]))        tokens.push_back(readIdentifier());
            else if (isDigit(src[pos]))   tokens.push_back(readNumber());
            else if (src[pos] == '"')     tokens.push_back(readString());
            else if (src[pos] == '/' && pos+1 < src.size() && src[pos+1] == '/')
                                          tokens.push_back(readLineComment());
            else if (src[pos] == '/' && pos+1 < src.size() && src[pos+1] == '*')
                                          tokens.push_back(readBlockComment());
            else                          tokens.push_back(readOperator());
        }
        return tokens;
    }

private:
    std::string src;
    size_t pos, line, col;

    static bool isAlpha(char c) { return std::isalpha(c) || c == '_'; }
    static bool isDigit(char c) { return std::isdigit(c) != 0; }
    static bool isAlNum(char c) { return std::isalnum(c) || c == '_'; }

    void skipWhitespace() {
        while (pos < src.size() && std::isspace(src[pos])) {
            if (src[pos] == '\n') { line++; col = 1; } else col++;
            pos++;
        }
    }

    Token readIdentifier() {
        static const std::set<std::string> keywords = {
            "if","else","for","while","do","switch","case","break","continue",
            "return","class","struct","namespace","template","typename","auto",
            "const","static","virtual","override","public","private","protected",
            "int","float","double","bool","void","char","long","short","unsigned"
        };
        size_t start = pos; int c = col;
        while (pos < src.size() && isAlNum(src[pos])) { pos++; col++; }
        std::string val = src.substr(start, pos - start);
        TokenType t = keywords.count(val) ? TokenType::KEYWORD : TokenType::IDENTIFIER;
        return {t, val, (int)line, c};
    }

    Token readNumber() {
        size_t start = pos; int c = col;
        bool isFloat = false;
        while (pos < src.size() && (isDigit(src[pos]) || src[pos] == '.')) {
            if (src[pos] == '.') isFloat = true;
            pos++; col++;
        }
        return {isFloat ? TokenType::LITERAL_FLOAT : TokenType::LITERAL_INT,
                src.substr(start, pos - start), (int)line, c};
    }

    Token readString() {
        size_t start = pos; int c = col;
        pos++; col++;
        while (pos < src.size() && src[pos] != '"') {
            if (src[pos] == '\\') { pos++; col++; }
            pos++; col++;
        }
        if (pos < src.size()) { pos++; col++; }
        return {TokenType::LITERAL_STRING, src.substr(start, pos - start), (int)line, c};
    }

    Token readLineComment() {
        size_t start = pos; int c = col;
        while (pos < src.size() && src[pos] != '\n') { pos++; col++; }
        return {TokenType::COMMENT, src.substr(start, pos - start), (int)line, c};
    }

    Token readBlockComment() {
        size_t start = pos; int c = col;
        pos += 2; col += 2;
        while (pos + 1 < src.size() && !(src[pos] == '*' && src[pos+1] == '/')) {
            if (src[pos] == '\n') { line++; col = 1; } else col++;
            pos++;
        }
        if (pos + 1 < src.size()) { pos += 2; col += 2; }
        return {TokenType::COMMENT, src.substr(start, pos - start), (int)line, c};
    }

    Token readOperator() {
        int c = col;
        std::string val(1, src[pos++]); col++;
        return {TokenType::OPERATOR, val, (int)line, c};
    }
};

// ─── AST Node Types ──────────────────────────────────────────────────────────

enum class NodeKind {
    TRANSLATION_UNIT, FUNCTION_DECL, VAR_DECL, IF_STMT, FOR_STMT,
    WHILE_STMT, RETURN_STMT, BINARY_EXPR, CALL_EXPR, LITERAL, IDENTIFIER
};

struct ASTNode {
    NodeKind                         kind;
    std::string                      value;
    int                              line = 0;
    std::vector<std::shared_ptr<ASTNode>> children;

    ASTNode(NodeKind k, std::string v = "", int l = 0)
        : kind(k), value(std::move(v)), line(l) {}

    void addChild(std::shared_ptr<ASTNode> child) {
        children.push_back(std::move(child));
    }
};

// ─── Scope & Symbol Table ─────────────────────────────────────────────────────

struct Symbol {
    std::string name;
    std::string type;
    int         declaredAt = 0;
    int         usageCount = 0;
    bool        isParam    = false;
};

class SymbolTable {
public:
    void pushScope() { scopes.push_back({}); }

    void popScope() {
        if (!scopes.empty()) scopes.pop_back();
    }

    void declare(const Symbol& sym) {
        if (!scopes.empty()) scopes.back()[sym.name] = sym;
    }

    Symbol* lookup(const std::string& name) {
        for (auto it = scopes.rbegin(); it != scopes.rend(); ++it) {
            auto found = it->find(name);
            if (found != it->end()) return &found->second;
        }
        return nullptr;
    }

    std::vector<Symbol> getUnused() const {
        std::vector<Symbol> unused;
        for (const auto& scope : scopes)
            for (const auto& [name, sym] : scope)
                if (sym.usageCount == 0 && !sym.isParam)
                    unused.push_back(sym);
        return unused;
    }

    void markUsed(const std::string& name) {
        Symbol* s = lookup(name);
        if (s) s->usageCount++;
    }

private:
    std::vector<std::map<std::string, Symbol>> scopes;
};

// ─── Control Flow Graph ──────────────────────────────────────────────────────

struct CFGNode {
    int              id;
    std::string      label;
    std::vector<int> successors;
    std::vector<int> predecessors;
    bool             isEntry = false;
    bool             isExit  = false;
};

class ControlFlowGraph {
public:
    int addNode(const std::string& label) {
        int id = (int)nodes.size();
        nodes.push_back({id, label, {}, {}, false, false});
        return id;
    }

    void addEdge(int from, int to) {
        if (from < (int)nodes.size() && to < (int)nodes.size()) {
            nodes[from].successors.push_back(to);
            nodes[to].predecessors.push_back(from);
        }
    }

    int cyclomaticComplexity() const {
        int edges = 0;
        for (const auto& n : nodes) edges += (int)n.successors.size();
        return edges - (int)nodes.size() + 2;
    }

    std::vector<int> unreachableNodes() const {
        if (nodes.empty()) return {};
        std::set<int> visited;
        std::vector<int> stack = {0};
        while (!stack.empty()) {
            int cur = stack.back(); stack.pop_back();
            if (visited.count(cur)) continue;
            visited.insert(cur);
            for (int s : nodes[cur].successors) stack.push_back(s);
        }
        std::vector<int> unreachable;
        for (const auto& n : nodes)
            if (!visited.count(n.id)) unreachable.push_back(n.id);
        return unreachable;
    }

    void clear() { nodes.clear(); }

private:
    std::vector<CFGNode> nodes;
};

// ─── Metric Accumulators ─────────────────────────────────────────────────────

struct FileMetrics {
    std::string path;
    int totalLines       = 0;
    int codeLines        = 0;
    int commentLines     = 0;
    int blankLines       = 0;
    int functionCount    = 0;
    int classCount       = 0;
    int maxComplexity    = 0;
    int avgComplexity    = 0;
    int maxNesting       = 0;
    int duplicateBlocks  = 0;
    double maintainability = 0.0;
    double commentDensity  = 0.0;
};

struct ProjectMetrics {
    int totalFiles         = 0;
    int totalLOC           = 0;
    int totalFunctions     = 0;
    int totalClasses       = 0;
    int totalSmells        = 0;
    double avgComplexity   = 0.0;
    double healthScore     = 0.0;
    std::vector<FileMetrics> files;
};

// ─── Maintainability Index Calculator ────────────────────────────────────────

class MaintainabilityCalculator {
public:
    static double compute(int loc, double avgCC, int commentLines) {
        if (loc <= 0) return 100.0;
        double halsteadVolume = loc * std::log2(std::max(1, loc));
        double mi = 171.0
                  - 5.2  * std::log(std::max(1.0, halsteadVolume))
                  - 0.23 * avgCC
                  - 16.2 * std::log(std::max(1.0, (double)loc))
                  + 50.0 * std::sin(std::sqrt(2.4 * commentLines));
        return std::max(0.0, std::min(100.0, mi));
    }

    static std::string classify(double mi) {
        if (mi >= 85) return "Highly Maintainable";
        if (mi >= 65) return "Maintainable";
        if (mi >= 40) return "Moderate";
        return "Difficult to Maintain";
    }
};

// ─── Duplicate Block Detector ─────────────────────────────────────────────────

class DuplicateDetector {
public:
    struct DuplicateBlock {
        std::string hash;
        std::vector<std::pair<std::string, int>> locations;
        int lineCount = 0;
    };

    void addFile(const std::string& path, const std::vector<std::string>& lines) {
        const int BLOCK_SIZE = 6;
        for (int i = 0; i + BLOCK_SIZE <= (int)lines.size(); i++) {
            std::string block;
            for (int j = i; j < i + BLOCK_SIZE; j++)
                block += trim(lines[j]) + "\n";
            if (block.find_first_not_of(" \t\n") == std::string::npos) continue;
            blocks[simpleHash(block)].push_back({path, i + 1});
        }
    }

    std::vector<DuplicateBlock> getDuplicates() const {
        std::vector<DuplicateBlock> result;
        for (const auto& [hash, locs] : blocks) {
            if (locs.size() >= 2)
                result.push_back({hash, locs, 6});
        }
        return result;
    }

private:
    std::map<std::string, std::vector<std::pair<std::string, int>>> blocks;

    static std::string trim(const std::string& s) {
        size_t a = s.find_first_not_of(" \t");
        size_t b = s.find_last_not_of(" \t\r\n");
        return (a == std::string::npos) ? "" : s.substr(a, b - a + 1);
    }

    static std::string simpleHash(const std::string& s) {
        size_t h = 0;
        for (char c : s) h = h * 31 + c;
        return std::to_string(h);
    }
};

// ─── Code Clone Classifier ────────────────────────────────────────────────────

enum class CloneType { TYPE1, TYPE2, TYPE3 };

struct Clone {
    CloneType   type;
    std::string fileA, fileB;
    int         lineA = 0, lineB = 0;
    double      similarity = 0.0;
};

class CloneClassifier {
public:
    static CloneType classify(double similarity) {
        if (similarity >= 1.0)   return CloneType::TYPE1;
        if (similarity >= 0.9)   return CloneType::TYPE2;
        return CloneType::TYPE3;
    }

    static double similarity(const std::string& a, const std::string& b) {
        if (a.empty() && b.empty()) return 1.0;
        if (a.empty() || b.empty()) return 0.0;
        int match = 0;
        size_t len = std::min(a.size(), b.size());
        for (size_t i = 0; i < len; i++)
            if (a[i] == b[i]) match++;
        return (double)match / std::max(a.size(), b.size());
    }
};

// ─── Coupling Analyzer ────────────────────────────────────────────────────────

class CouplingAnalyzer {
public:
    void addDependency(const std::string& from, const std::string& to) {
        deps[from].insert(to);
        revDeps[to].insert(from);
    }

    int afferentCoupling(const std::string& module) const {
        auto it = revDeps.find(module);
        return it != revDeps.end() ? (int)it->second.size() : 0;
    }

    int efferentCoupling(const std::string& module) const {
        auto it = deps.find(module);
        return it != deps.end() ? (int)it->second.size() : 0;
    }

    double instability(const std::string& module) const {
        int ca = afferentCoupling(module);
        int ce = efferentCoupling(module);
        if (ca + ce == 0) return 0.0;
        return (double)ce / (ca + ce);
    }

    std::vector<std::string> findCircularDeps() const {
        std::vector<std::string> cycles;
        for (const auto& [mod, depSet] : deps)
            for (const auto& dep : depSet)
                if (deps.count(dep) && deps.at(dep).count(mod))
                    cycles.push_back(mod + " <-> " + dep);
        return cycles;
    }

private:
    std::map<std::string, std::set<std::string>> deps;
    std::map<std::string, std::set<std::string>> revDeps;
};

// ─── Technical Debt Estimator ─────────────────────────────────────────────────

struct DebtItem {
    std::string category;
    std::string description;
    int         estimatedMinutes = 0;
};

class TechnicalDebtEstimator {
public:
    void addSmell(const std::string& smell, int loc) {
        if (smell == "LargeFile")
            items.push_back({"Structure",   "Split large file",          loc / 10});
        else if (smell == "LongFunction")
            items.push_back({"Refactoring", "Extract method",            30});
        else if (smell == "HighComplexity")
            items.push_back({"Complexity",  "Simplify control flow",     45});
        else if (smell == "DeepNesting")
            items.push_back({"Readability", "Flatten nesting",           20});
        else if (smell == "ExcessiveParams")
            items.push_back({"Design",      "Introduce parameter object", 25});
        else if (smell == "LongLine")
            items.push_back({"Style",       "Wrap long lines",            5});
    }

    int totalDebtMinutes() const {
        return std::accumulate(items.begin(), items.end(), 0,
            [](int sum, const DebtItem& d) { return sum + d.estimatedMinutes; });
    }

    std::string formattedDebt() const {
        int mins = totalDebtMinutes();
        int hours = mins / 60;
        int rem   = mins % 60;
        if (hours > 0) return std::to_string(hours) + "h " + std::to_string(rem) + "m";
        return std::to_string(rem) + "m";
    }

    const std::vector<DebtItem>& getItems() const { return items; }

private:
    std::vector<DebtItem> items;
};

// ─── Report Builder ───────────────────────────────────────────────────────────

class ReportBuilder {
public:
    ReportBuilder& setProject(const std::string& name) { projectName = name; return *this; }
    ReportBuilder& setMetrics(const ProjectMetrics& m) { metrics = m; return *this; }
    ReportBuilder& setDebt(const TechnicalDebtEstimator& d) { debt = d; return *this; }
    ReportBuilder& setTimestamp(const std::string& ts) { timestamp = ts; return *this; }

    std::string buildJson() const {
        std::ostringstream o;
        o << "{\n";
        o << "  \"project\": \"" << projectName << "\",\n";
        o << "  \"generatedAt\": \"" << timestamp << "\",\n";
        o << "  \"summary\": {\n";
        o << "    \"totalFiles\": "     << metrics.totalFiles     << ",\n";
        o << "    \"totalLOC\": "       << metrics.totalLOC       << ",\n";
        o << "    \"totalFunctions\": " << metrics.totalFunctions << ",\n";
        o << "    \"totalClasses\": "   << metrics.totalClasses   << ",\n";
        o << "    \"totalSmells\": "    << metrics.totalSmells    << ",\n";
        o << "    \"avgComplexity\": "  << metrics.avgComplexity  << ",\n";
        o << "    \"healthScore\": "    << metrics.healthScore    << ",\n";
        o << "    \"technicalDebt\": \"" << debt.formattedDebt() << "\"\n";
        o << "  },\n";
        o << "  \"files\": []\n";
        o << "}\n";
        return o.str();
    }

private:
    std::string           projectName;
    std::string           timestamp;
    ProjectMetrics        metrics;
    TechnicalDebtEstimator debt;
};

// ─── Pipeline Orchestrator ────────────────────────────────────────────────────

class AnalysisPipeline {
public:
    struct Config {
        std::string repoPath;
        std::string outputPath;
        int         maxComplexityThreshold = 10;
        int         maxFileLinesThreshold  = 300;
        int         maxFunctionLines       = 50;
        bool        detectDuplicates       = true;
        bool        detectCoupling         = true;
        bool        estimateDebt           = true;
    };

    explicit AnalysisPipeline(Config cfg) : config(std::move(cfg)) {}

    void run() {
        std::cout << "[Pipeline] Starting analysis of: " << config.repoPath << "\n";
        auto files = collectFiles();
        std::cout << "[Pipeline] Found " << files.size() << " files\n";
        auto metrics = analyzeFiles(files);
        double score = computeScore(metrics);
        writeReport(metrics, score);
        std::cout << "[Pipeline] Done. Score: " << score << "\n";
    }

private:
    Config config;

    std::vector<std::string> collectFiles() const {
        std::vector<std::string> result;
        std::vector<std::string> ignore = {"build/", ".git/", "vendor/"};
        std::vector<std::string> exts   = {".cpp", ".h", ".hpp", ".cc"};
        namespace fs = std::filesystem;
        for (const auto& e : fs::recursive_directory_iterator(config.repoPath)) {
            if (!e.is_regular_file()) continue;
            std::string p = e.path().string();
            bool skip = false;
            for (const auto& ig : ignore)
                if (p.find(ig) != std::string::npos) { skip = true; break; }
            if (skip) continue;
            std::string ext = e.path().extension().string();
            for (const auto& ex : exts)
                if (ext == ex) { result.push_back(p); break; }
        }
        return result;
    }

    ProjectMetrics analyzeFiles(const std::vector<std::string>& files) const {
        ProjectMetrics pm;
        pm.totalFiles = (int)files.size();
        for (const auto& f : files) {
            FileMetrics fm = analyzeFile(f);
            pm.totalLOC       += fm.totalLines;
            pm.totalFunctions += fm.functionCount;
            pm.totalClasses   += fm.classCount;
            pm.files.push_back(fm);
        }
        if (!pm.files.empty()) {
            double sumCC = 0;
            for (const auto& f : pm.files) sumCC += f.avgComplexity;
            pm.avgComplexity = sumCC / pm.files.size();
        }
        return pm;
    }

    FileMetrics analyzeFile(const std::string& path) const {
        FileMetrics fm;
        fm.path = path;
        std::ifstream file(path);
        if (!file.is_open()) return fm;
        std::string line;
        while (std::getline(file, line)) {
            fm.totalLines++;
            auto first = line.find_first_not_of(" \t\r\n");
            if (first == std::string::npos)       fm.blankLines++;
            else if (line.substr(first,2) == "//") fm.commentLines++;
            else                                   fm.codeLines++;
        }
        fm.commentDensity = fm.codeLines > 0
            ? (double)fm.commentLines / fm.codeLines : 0.0;
        fm.maintainability = MaintainabilityCalculator::compute(
            fm.codeLines, fm.avgComplexity, fm.commentLines);
        return fm;
    }

    double computeScore(const ProjectMetrics& pm) const {
        double penalty = pm.totalSmells * 2.0;
        if (pm.totalLOC > 1000) penalty += (pm.totalLOC - 1000) * 0.01;
        return std::max(0.0, std::min(100.0, 100.0 - penalty));
    }

    void writeReport(const ProjectMetrics& pm, double score) const {
        ReportBuilder builder;
        builder.setProject(config.repoPath)
               .setMetrics(pm)
               .setTimestamp("2026-01-01T00:00:00Z");
        std::filesystem::create_directories(
            std::filesystem::path(config.outputPath).parent_path());
        std::ofstream out(config.outputPath);
        if (out.is_open()) out << builder.buildJson();
    }
};

// ─── Entry Point ─────────────────────────────────────────────────────────────

int runEngine(int argc, char* argv[]) {
    std::string repoPath   = argc > 1 ? argv[1] : ".";
    std::string outputPath = argc > 2 ? argv[2] : "reports/analysis_report.json";

    AnalysisPipeline::Config cfg;
    cfg.repoPath   = repoPath;
    cfg.outputPath = outputPath;

    AnalysisPipeline pipeline(cfg);
    pipeline.run();
    return 0;
}