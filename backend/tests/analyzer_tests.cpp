#include <cassert>
#include <iostream>
#include "../src/metrics/loc_counter.h"
#include "../src/metrics/function_metrics.h"
#include "../src/analyzers/cpp/complexity_analyzer.h"
#include "../src/analyzers/cpp/smell_detector.h"
#include "../src/scoring/health_score.h"

static void testLoc() {
    LocCounter lc;
    auto r = lc.count({"int x = 0;", "// comment", "", "/* block", "end */"});
    assert(r.total == 5); assert(r.blank == 1);
    std::cout << "[PASS] testLoc\n";
}

static void testComplexity() {
    ComplexityAnalyzer ca;
    auto r = ca.computeCyclomaticComplexity({"if(x){","for(;;){","}}"}); 
    assert(r >= 3);
    std::cout << "[PASS] testComplexity\n";
}

static void testSmells() {
    SmellDetector sd;
    std::vector<std::string> big(310, "int x;");
    auto s = sd.detectAll(big, {});
    assert(!s.empty());
    std::cout << "[PASS] testSmells\n";
}

static void testHealth() {
    HealthScore hs;
    assert(hs.compute({}).score == 100.0);
    std::cout << "[PASS] testHealth\n";
}

int main() {
    testLoc(); testComplexity(); testSmells(); testHealth();
    std::cout << "All passed.\n";
    return 0;
}