#!/usr/bin/env bash
# Render a letter-size handout HTML file to PDF + 2× PNG via headless Chrome.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: render.sh path/to/handout.html" >&2
  exit 1
fi

HTML_INPUT=$1
if [[ ! -f "$HTML_INPUT" ]]; then
  echo "Not a file: $HTML_INPUT" >&2
  exit 1
fi

HTML_DIR=$(cd "$(dirname "$HTML_INPUT")" && pwd)
HTML_BASE=$(basename "$HTML_INPUT")
STEM=${HTML_BASE%.html}

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at: $CHROME" >&2
  exit 1
fi

FILE_URL="file://${HTML_DIR}/${HTML_BASE}"

"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --virtual-time-budget=6000 \
  --print-to-pdf="${HTML_DIR}/${STEM}.pdf" \
  --no-pdf-header-footer \
  "$FILE_URL"

"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --virtual-time-budget=6000 \
  --hide-scrollbars \
  --force-device-scale-factor=2 \
  --window-size=816,1056 \
  --screenshot="${HTML_DIR}/${STEM}.png" \
  "$FILE_URL"

echo "Wrote ${HTML_DIR}/${STEM}.pdf"
echo "Wrote ${HTML_DIR}/${STEM}.png"
