#!/usr/bin/env bash
# Sci-Fi SoundBoard — start the app (Linux/macOS)
# Run from repo root: ./start.sh

set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed or not in PATH. Run ./setup.sh first."
  exit 1
fi

if [ ! -d "systems/soundboard-app/node_modules" ]; then
  echo "Dependencies not installed. Run ./setup.sh first."
  exit 1
fi

# On Linux, avoid Electron SUID sandbox errors when chrome-sandbox is not set up
if [ "$(uname -s)" = "Linux" ]; then
  export ELECTRON_DISABLE_SANDBOX=1
fi

npm start
