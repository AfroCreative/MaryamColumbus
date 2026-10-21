#!/usr/bin/env bash
# Convert a drone / cinematic flight video into a scroll-scrubbable WebP frame
# sequence plus manifest.json in public/flythrough/frames.
#
#   scripts/extract-frames.sh path/to/flight.mp4 [fps] [width] [quality]
#
#   fps      frames per second of footage to keep   (default 24)
#   width    output width in px, height keeps ratio (default 1920)
#   quality  WebP quality 0–100                    (default 72)
#
# Aim for 150–400 frames total. Lower fps or width if the folder is too big.
set -euo pipefail

src="${1:?usage: extract-frames.sh <video> [fps] [width] [quality]}"
fps="${2:-24}"
width="${3:-1920}"
quality="${4:-72}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/flythrough/frames"

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

mkdir -p "$out"
find "$out" -maxdepth 1 -name 'frame_*.webp' -delete

ffmpeg -hide_banner -loglevel error -i "$src" \
  -vf "fps=${fps},scale=${width}:-2:flags=lanczos" \
  -c:v libwebp -quality "$quality" -compression_level 6 \
  "$out/frame_%04d.webp"

count=$(find "$out" -maxdepth 1 -name 'frame_*.webp' | wc -l | tr -d ' ')
cat > "$out/manifest.json" <<JSON
{ "count": $count, "pattern": "frame_{n}.webp", "pad": 4, "start": 1 }
JSON

size=$(du -sh "$out" | cut -f1)
echo "Wrote $count frames ($size) to public/flythrough/frames"
