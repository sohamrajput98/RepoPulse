#pragma once
#include <vector>
#include <string>

struct LocResult {
    int total    = 0;
    int code     = 0;
    int comments = 0;
    int blank    = 0;
    double commentRatio = 0.0;
};

class LocCounter {
public:
    LocResult count(const std::vector<std::string>& lines) const;
};