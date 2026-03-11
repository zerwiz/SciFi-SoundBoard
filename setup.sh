#!/usr/bin/env bash
# Sci-Fi SoundBoard — full setup (Linux/macOS)
# Detects OS and arch, installs dependencies, downloads sounds.
# Run from repo root: ./setup.sh

set -e
cd "$(dirname "$0")"

echo "=== Sci-Fi SoundBoard Setup ==="
echo "OS:     $(uname -s)"
echo "Arch:   $(uname -m)"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed or not in PATH."
  echo "Install Node.js 18+ from https://nodejs.org and run this script again."
  exit 1
fi

NODE_VER=$(node -v)
echo "Node:   $NODE_VER"
echo ""

node scripts/full-setup.js "$@"
