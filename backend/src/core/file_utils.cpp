#include "file_utils.h"
#include <filesystem>

std::vector<std::string> FileUtils::listFiles(const std::string& dirPath) {
    // EXTEND THIS FUNCTION: add an ignore-pattern list (e.g. build/, vendor/)
    // and skip files whose paths match any pattern before returning the list
    std::vector<std::string> files;
    for (const auto& entry : std::filesystem::recursive_directory_iterator(dirPath))
        if (entry.is_regular_file()) files.push_back(entry.path().string());
    return files;
}