#!/bin/bash
set -e

REPO_URL=$1
if [ -z "$REPO_URL" ]; then
  echo "Usage: ./scripts/analyze_github.sh https://github.com/user/repo"
  exit 1
fi

REPO_NAME=$(basename "$REPO_URL" .git)
TMP_DIR="/tmp/repopulse_$REPO_NAME"
BIN="./backend/build/repopulse"

# build backend if needed
if [ ! -f "$BIN" ]; then
  echo "Building backend..."
  cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Release -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
  cmake --build backend/build
fi

# clone
echo "Cloning $REPO_URL..."
rm -rf "$TMP_DIR"
git clone --depth=1 "$REPO_URL" "$TMP_DIR"

# analyze
echo "Analyzing..."
$BIN "$TMP_DIR"

# copy report
cp reports/analysis_report.json frontend/public/analysis_report.json
echo "Done! Open http://localhost:5173"

# cleanup
rm -rf "$TMP_DIR"