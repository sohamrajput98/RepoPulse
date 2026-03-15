#include "loc_counter.h"

LocResult LocCounter::count(const std::vector<std::string>& lines) const {
    // EXTEND THIS FUNCTION: handle block comments (/* ... */ spanning multiple
    // lines) using a state machine to correctly classify each line category
    LocResult result;
    result.total = static_cast<int>(lines.size());
    for (const auto& line : lines) {
        auto first = line.find_first_not_of(" \t\r\n");
        if (first == std::string::npos)              result.blank++;
        else if (line.substr(first, 2) == "//")      result.comments++;
        else                                          result.code++;
    }
    return result;
}