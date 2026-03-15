#include "loc_counter.h"

LocResult LocCounter::count(const std::vector<std::string>& lines) const {
    LocResult r;
    r.total = (int)lines.size();
    bool inBlock = false;

    for (const auto& line : lines) {
        std::string t = line;
        size_t first = t.find_first_not_of(" \t\r\n");

        if (first == std::string::npos) { r.blank++; continue; }

        std::string trimmed = t.substr(first);
        bool isCodeLine = false;
        size_t i = 0;
        bool inString = false;

        while (i < trimmed.size()) {
            // toggle string literal
            if (!inBlock && trimmed[i] == '"' && (i == 0 || trimmed[i-1] != '\\')) {
                inString = !inString;
                isCodeLine = true;
                i++; continue;
            }
            if (inString) { isCodeLine = true; i++; continue; }

            // block comment start
            if (!inBlock && i+1 < trimmed.size() && trimmed[i]=='/' && trimmed[i+1]=='*') {
                inBlock = true; i += 2; continue;
            }
            // block comment end
            if (inBlock && i+1 < trimmed.size() && trimmed[i]=='*' && trimmed[i+1]=='/') {
                inBlock = false; i += 2; continue;
            }
            if (inBlock) { i++; continue; }

            // line comment
            if (i+1 < trimmed.size() && trimmed[i]=='/' && trimmed[i+1]=='/') {
                if (!isCodeLine) { r.comments++; goto nextline; }
                else             { isCodeLine = true; goto nextline; }
            }

            isCodeLine = true;
            i++;
        }

        if (inBlock) { r.comments++; goto nextline; }
        if (isCodeLine) r.code++;
        else            r.comments++;

        nextline:;
    }

    r.commentRatio = r.code > 0 ? (double)r.comments / r.code : 0.0;
    return r;
}