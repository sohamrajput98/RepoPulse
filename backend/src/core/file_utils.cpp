#include "file_utils.h"
#include <filesystem>

namespace fs = std::filesystem;

std::vector<std::string> FileUtils::listFiles(const std::string& dir,
                                               const std::vector<std::string>& ignore,
                                               const std::vector<std::string>& extensions) {
    std::vector<std::string> files;
    for (const auto& entry : fs::recursive_directory_iterator(dir)) {
        if (!entry.is_regular_file()) continue;

        std::string path = entry.path().string();

        bool skip = false;
        for (const auto& ig : ignore) {
            if (path.find(ig) != std::string::npos) { skip = true; break; }
        }
        if (skip) continue;

        std::string ext = entry.path().extension().string();
        bool match = false;
        for (const auto& e : extensions) {
            if (ext == e) { match = true; break; }
        }
        if (!match) continue;

        files.push_back(path);
    }
    return files;
}