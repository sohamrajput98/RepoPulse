#pragma once
#include <vector>
#include <string>

struct LocResult {
    int total    = 0;
    int code     = 0;
    int comments = 0;
    int blank    = 0;
};

class LocCounter {
public:
    // EXTEND THIS FUNCTION: handle block comments (/* ... */ spanning multiple
    // lines) using a state machine to correctly classify each line category
    LocResult count(const std::vector<std::string>& lines) const;
};