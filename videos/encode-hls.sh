#!/bin/bash
#
# HLS Encoder - Converts MP4 videos to multi-quality HLS streams
#
# Usage: ./encode-hls.sh [filename.mp4]
#   - With argument: Encodes only that file
#   - Without argument: Encodes all MP4s that don't have HLS output yet
#
# Source: videos/*.mp4
# Output: site/videos/video-name/
#           ├── playlist.m3u8 (master)
#           ├── 1080p/playlist.m3u8 + segments
#           ├── 720p/playlist.m3u8 + segments
#           ├── 480p/playlist.m3u8 + segments
#           └── 240p/playlist.m3u8 + segments

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$FRONTEND_DIR/site/videos"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

encode_video() {
  local input="$1"
  local basename=$(basename "$input" .mp4)
  local output_dir="$OUTPUT_DIR/$basename"

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

  # Generate thumbnail sprites for scrubbing preview
  echo "Generating thumbnail sprites..."
  generate_sprites "$input" "$output_dir"
}

# Pure: generates thumbnail sprite sheet and VTT file
generate_sprites() {
  local input="$1"
  local output_dir="$2"

  # Get video duration in seconds
  local duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input")
  duration=${duration%.*}  # Remove decimal

  # Thumbnail settings
  local thumb_width=160
  local thumb_height=90
  local interval=2  # Seconds between thumbnails
  local cols=10     # Thumbnails per row in sprite

  # Calculate number of thumbnails and rows
  local num_thumbs=$((duration / interval + 1))
  local rows=$(( (num_thumbs + cols - 1) / cols ))

  # Generate sprite sheet
  ffmpeg -i "$input" \
    -vf "fps=1/$interval,scale=${thumb_width}:${thumb_height},tile=${cols}x${rows}" \
    -frames:v 1 \
    -y \
    "$output_dir/sprite.jpg"

  # Generate VTT file
  local vtt_file="$output_dir/thumbnails.vtt"
  echo "WEBVTT" > "$vtt_file"
  echo "" >> "$vtt_file"

  local i=0
  while [ $i -lt $num_thumbs ]; do
    local start_time=$((i * interval))
    local end_time=$(( (i + 1) * interval ))
    if [ $end_time -gt $duration ]; then
      end_time=$duration
    fi

    # Calculate sprite position
    local col=$((i % cols))
    local row=$((i / cols))
    local x=$((col * thumb_width))
    local y=$((row * thumb_height))

    # Format times as HH:MM:SS.mmm
    local start_fmt=$(printf "%02d:%02d:%02d.000" $((start_time/3600)) $(((start_time%3600)/60)) $((start_time%60)))
    local end_fmt=$(printf "%02d:%02d:%02d.000" $((end_time/3600)) $(((end_time%3600)/60)) $((end_time%60)))

    echo "${start_fmt} --> ${end_fmt}" >> "$vtt_file"
    echo "sprite.jpg#xywh=${x},${y},${thumb_width},${thumb_height}" >> "$vtt_file"
    echo "" >> "$vtt_file"

    i=$((i + 1))
  done

  echo "  ✓ sprite.jpg (${cols}x${rows} grid)"
  echo "  ✓ thumbnails.vtt ($num_thumbs cues)"
}

# Main logic
if [ -n "$1" ]; then
  # Encode specific file
  if [ -f "$SCRIPT_DIR/$1" ]; then
    encode_video "$SCRIPT_DIR/$1"
  elif [ -f "$1" ]; then
    encode_video "$1"
  else
    echo "Error: File not found: $1"
    exit 1
  fi
else
  # Encode all unencoded videos
  found=0
  for video in "$SCRIPT_DIR"/*.mp4; do
    [ -f "$video" ] || continue
    found=1
    encode_video "$video"
  done

  if [ $found -eq 0 ]; then
    echo "No MP4 files found in $SCRIPT_DIR"
  fi
fi

echo ""
echo "All done!"
