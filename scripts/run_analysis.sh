#!/bin/bash
REPO=${1:-.}
BIN=./backend/build/repopulse

if [ ! -f "$BIN" ]; then
  cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Release
  cmake --build backend/build
fi

$BIN "$REPO"
cp reports/analysis_report.json frontend/public/analysis_report.json
echo "Done. Report copied to frontend/public/"