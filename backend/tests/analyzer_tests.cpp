#include <cassert>
#include <iostream>
#include "../src/metrics/loc_counter.h"
#include "../src/metrics/function_metrics.h"
#include "../src/analyzers/cpp/complexity_analyzer.h"
#include "../src/analyzers/cpp/smell_detector.h"
#include "../src/scoring/health_score.h"

// EXTEND THIS FUNCTION: replace manual assert() calls with a proper test
// framework (e.g. Catch2 or Google Test) and add parametrised test cases

static void testLocCounter() {
    LocCounter lc;
    std::vector<std::string> lines = {
        "int main() {", "  // comment", "  return 0;", "", "}"
    };
    auto r = lc.count(lines);
    assert(r.total == 5);
    assert(r.blank == 1);
    assert(r.comments == 1);
    assert(r.code == 3);
    std::cout << "[PASS] testLocCounter\n";
}

static void testCyclomaticComplexity() {
    ComplexityAnalyzer ca;
    // EXTEND THIS FUNCTION: add cases for switch, catch, &&, || and verify
    // that complexity correctly resets between separate function extractions
    std::vector<std::string> lines = {
        "if (x) {", "  for (int i=0;i<n;i++) {", "  }", "}"
    };
    assert(ca.computeCyclomaticComplexity(lines) >= 3);
    std::cout << "[PASS] testCyclomaticComplexity\n";
}

static void testSmellDetector() {
    SmellDetector sd;
    // EXTEND THIS FUNCTION: add assertions for LongFunction, ExcessiveParameters,
    // and CodeDuplication once those detectors are implemented
    std::vector<std::string> clean(10, "int x = 0;");
    assert(sd.detectAll(clean).empty());
    std::cout << "[PASS] testSmellDetector\n";
}

static void testHealthScore() {
    HealthScore hs;
    // EXTEND THIS FUNCTION: add cases with seeded smells and high-complexity
    // functions to verify that penalty weighting produces expected score ranges
    assert(hs.compute({}) == 100.0);
    std::cout << "[PASS] testHealthScore\n";
}

int main() {
    testLocCounter();
    testCyclomaticComplexity();
    testSmellDetector();
    testHealthScore();
    std::cout << "[tests] All passed.\n";
    return 0;
}