#pragma once
#include <string>
#include <vector>

class FileUtils {
public:
    static std::vector<std::string> listFiles(const std::string& dir,
                                               const std::vector<std::string>& ignore,
                                               const std::vector<std::string>& extensions);
};