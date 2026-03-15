#pragma once
#include <string>
#include <vector>

class FileUtils {
public:
    // EXTEND THIS FUNCTION: add an ignore-pattern list (e.g. build/, vendor/)
    // and skip files whose paths match any pattern before returning the list
    static std::vector<std::string> listFiles(const std::string& dirPath);
};