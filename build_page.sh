#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$ROOT/__default/PageProject"

rm -rf "$ROOT/assets"
rm -f "$ROOT/.nojekyll" "$ROOT/404.html" "$ROOT/favicon.ico" "$ROOT/icons.ico" "$ROOT/index.html"

(
    cd "$PROJECT"
    npm run build
)

cp -a "$PROJECT/dist/." "$ROOT/"

echo Done.
