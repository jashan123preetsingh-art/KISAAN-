#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install the LTS version from https://nodejs.org"
  exit 1
fi
printf 'Opening Vetan Ledger at http://localhost:4173\n'
if command -v open >/dev/null 2>&1; then open http://localhost:4173
elif command -v xdg-open >/dev/null 2>&1; then xdg-open http://localhost:4173 >/dev/null 2>&1 || true
fi
node server.mjs
