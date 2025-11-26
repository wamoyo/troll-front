#!/bin/bash
#
# HLS Encoder - Converts MP4 videos to multi-quality HLS streams
#
# Usage: ./encode-hls.sh [filename.mp4]
#   - With argument: Encodes only that file
#   - Without argument: Encodes all MP4s in sources/ that don't have HLS output yet
#
# Output structure:
#   hls/video-name/
#     ├── playlist.m3u8 (master)
#     ├── 1080p/playlist.m3u8 + segments
#     ├── 720p/playlist.m3u8 + segments
#     ├── 480p/playlist.m3u8 + segments
#     └── 240p/playlist.m3u8 + segments

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCES_DIR="$SCRIPT_DIR/sources"
HLS_DIR="$SCRIPT_DIR/hls"

# Create hls directory if it doesn't exist
mkdir -p "$HLS_DIR"

encode_video() {
  local input="$1"
  local basename=$(basename "$input" .mp4)
  local output_dir="$HLS_DIR/$basename"

  # Skip if already encoded
  if [ -d "$output_dir" ] && [ -f "$output_dir/playlist.m3u8" ]; then
    echo "Skipping $basename - already encoded"
    return 0
  fi

  echo "Encoding: $basename"
  echo "This may take a while..."

  # Create output directories
  mkdir -p "$output_dir/1080p" "$output_dir/720p" "$output_dir/480p" "$output_dir/240p"

  # Encode all quality levels
  # Using -preset veryslow for best compression (takes longer but smaller files)
  ffmpeg -i "$input" \
    -filter_complex "[0:v]split=4[v1][v2][v3][v4]; \
      [v1]scale=1920:1080[v1out]; \
      [v2]scale=1280:720[v2out]; \
      [v3]scale=854:480[v3out]; \
      [v4]scale=426:240[v4out]" \
    -map "[v1out]" -map 0:a -c:v libx264 -b:v 5000k -preset veryslow -c:a aac -b:a 192k \
      -hls_time 6 -hls_list_size 0 -hls_segment_filename "$output_dir/1080p/segment%03d.ts" "$output_dir/1080p/playlist.m3u8" \
    -map "[v2out]" -map 0:a -c:v libx264 -b:v 2800k -preset veryslow -c:a aac -b:a 128k \
      -hls_time 6 -hls_list_size 0 -hls_segment_filename "$output_dir/720p/segment%03d.ts" "$output_dir/720p/playlist.m3u8" \
    -map "[v3out]" -map 0:a -c:v libx264 -b:v 1400k -preset veryslow -c:a aac -b:a 128k \
      -hls_time 6 -hls_list_size 0 -hls_segment_filename "$output_dir/480p/segment%03d.ts" "$output_dir/480p/playlist.m3u8" \
    -map "[v4out]" -map 0:a -c:v libx264 -b:v 400k -preset veryslow -c:a aac -b:a 64k \
      -hls_time 6 -hls_list_size 0 -hls_segment_filename "$output_dir/240p/segment%03d.ts" "$output_dir/240p/playlist.m3u8"

  # Create master playlist
  cat > "$output_dir/playlist.m3u8" << 'EOF'
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=5200000,RESOLUTION=1920x1080
1080p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2928000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1528000,RESOLUTION=854x480
480p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=464000,RESOLUTION=426x240
240p/playlist.m3u8
EOF

  echo "Done: $output_dir/playlist.m3u8"
}

# Main logic
if [ -n "$1" ]; then
  # Encode specific file
  if [ -f "$SOURCES_DIR/$1" ]; then
    encode_video "$SOURCES_DIR/$1"
  elif [ -f "$1" ]; then
    encode_video "$1"
  else
    echo "Error: File not found: $1"
    exit 1
  fi
else
  # Encode all unencoded videos in sources/
  found=0
  for video in "$SOURCES_DIR"/*.mp4; do
    [ -f "$video" ] || continue
    found=1
    encode_video "$video"
  done

  if [ $found -eq 0 ]; then
    echo "No MP4 files found in $SOURCES_DIR"
  fi
fi

echo ""
echo "All done!"
