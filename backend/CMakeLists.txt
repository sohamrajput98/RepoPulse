cmake_minimum_required(VERSION 3.16)
project(repopulse)

set(CMAKE_CXX_STANDARD 17)

file(GLOB_RECURSE SOURCES "src/*.cpp")
list(FILTER SOURCES EXCLUDE REGEX ".*main\\.cpp$")

add_executable(repopulse src/main.cpp ${SOURCES})
target_include_directories(repopulse PRIVATE src)

add_executable(tests tests/analyzer_tests.cpp ${SOURCES})
target_include_directories(tests PRIVATE src)