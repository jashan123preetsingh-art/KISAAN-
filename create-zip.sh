#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
output="${1:-../Vetan-Ledger.zip}"
rm -f "$output"
zip -q "$output" README.md RUNNING_THE_APP.md START-VETAN.bat start-vetan.sh server.mjs package.json index.html app.js core.js styles.css manifest.webmanifest sw.js
echo "Created $output"
