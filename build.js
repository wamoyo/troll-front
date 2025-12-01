// Manifest-based build script - compiles JS template pages to HTML
// Tracks all output files, enables incremental builds, detects orphans
//
// Usage:
//   deno task build              # Build, show orphans
//   deno task build --clean      # Build, prompt to delete orphans
//   deno task build --clean -y   # Build, delete orphans without prompt (CI/CD)

import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts"
import { join } from "https://deno.land/std@0.208.0/path/mod.ts"

var siteDir = "./site"
var srcDir = "."
var manifestPath = "./site/.build.json"

// ============================================================================
// CLI ARGUMENT PARSING
// ============================================================================

var args = Deno.args
var cleanFlag = args.includes('--clean')
var yesFlag = args.includes('-y') || args.includes('--yes')

// ============================================================================
// MANIFEST FUNCTIONS
// ============================================================================

// Pure: loads manifest from disk, returns empty manifest if not found
async function loadManifest () {
  try {
    var content = await Deno.readTextFile(manifestPath)
    return JSON.parse(content)
  } catch {
    return { version: 1, built: null, files: {} }
  }
}

// Side effect: saves manifest to disk
async function saveManifest (manifest) {
  manifest.built = new Date().toISOString()
  await Deno.writeTextFile(manifestPath, JSON.stringify(manifest, null, 2))
}

// ============================================================================
// FILE SYSTEM HELPERS
// ============================================================================

// Pure: recursively finds all files with given extension
async function findFiles (dir, extension = '.js') {
  var files = []

  async function walk (currentDir, relativePath = '') {
    try {
      for await (var entry of Deno.readDir(currentDir)) {
        var entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        var fullPath = `${currentDir}/${entry.name}`

        if (entry.isDirectory) {
          await walk(fullPath, entryPath)
        } else if (entry.isFile && entry.name.endsWith(extension)) {
          files.push(entryPath)
        }
      }
    } catch {
      // Directory doesn't exist, return empty
    }
  }

  await walk(dir)
  return files
}

// Pure: recursively finds all files in a directory (any extension)
async function findAllFiles (dir, basePath = '') {
  var files = []

  async function walk (currentDir, relativePath) {
    try {
      for await (var entry of Deno.readDir(currentDir)) {
        var entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        var fullPath = `${currentDir}/${entry.name}`

        if (entry.isDirectory) {
          await walk(fullPath, entryPath)
        } else if (entry.isFile) {
          files.push(entryPath)
        }
      }
    } catch {
      // Directory doesn't exist
    }
  }

  await walk(dir, basePath)
  return files
}

// Pure: gets file mtime as timestamp
async function getFileMtime (path) {
  try {
    var stat = await Deno.stat(path)
    return stat.mtime?.getTime() || 0
  } catch {
    return 0
  }
}

// Pure: reads file content, returns null if not found
async function readFileContent (path) {
  try {
    return await Deno.readTextFile(path)
  } catch {
    return null
  }
}

// Pure: formats bytes to human readable
function formatSize (bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

// Pure: gets file or directory size
async function getSize (path) {
  try {
    var stat = await Deno.stat(path)
    if (stat.isFile) {
      return stat.size
    } else if (stat.isDirectory) {
      var total = 0
      for await (var entry of Deno.readDir(path)) {
        total += await getSize(`${path}/${entry.name}`)
      }
      return total
    }
  } catch {
    return 0
  }
  return 0
}

// ============================================================================
// BUILD FUNCTIONS
// ============================================================================

// Side effect: builds HTML pages, returns stats
async function buildPages (oldManifest, newManifest) {
  var pages = await findFiles(`${srcDir}/pages`, '.js')
  var stats = { total: pages.length, changed: 0, unchanged: 0 }

  console.log(`Building ${pages.length} pages...`)

  for (var pagePath of pages) {
    var fullPagePath = `${srcDir}/pages/${pagePath}`

    // Import the page module (cache bust for fresh imports)
    var pageModule = await import(`./${fullPagePath}?t=${Date.now()}`)
    var pageFunction = pageModule.default

    // Generate HTML
    var html = pageFunction()

    // Determine output path
    var outputPath
    if (pagePath.endsWith('index.js')) {
      outputPath = pagePath.replace('index.js', 'index.html')
    } else {
      outputPath = pagePath.replace('.js', '/index.html')
    }
    var fullOutputPath = join(siteDir, outputPath)

    // Ensure output directory exists
    var outputDir = fullOutputPath.substring(0, fullOutputPath.lastIndexOf('/'))
    await ensureDir(outputDir)

    // Compare to existing content
    var existingContent = await readFileContent(fullOutputPath)

    if (html !== existingContent) {
      await Deno.writeTextFile(fullOutputPath, html)
      console.log(`  ✓ ${pagePath} → ${outputPath}`)
      stats.changed++
    } else {
      console.log(`  · ${pagePath} (unchanged)`)
      stats.unchanged++
    }

    // Add to new manifest
    newManifest.files[outputPath] = {
      source: `pages/${pagePath}`,
      type: 'generated'
    }
  }

  return stats
}

// Side effect: copies assets incrementally, returns stats
async function copyAssetsIncremental (srcPath, destPath, label, oldManifest, newManifest, recursive = false) {
  var stats = { copied: 0, unchanged: 0 }

  try {
    await ensureDir(destPath)
  } catch {
    return stats
  }

  async function processDir (currentSrc, currentDest, currentLabel) {
    try {
      for await (var entry of Deno.readDir(currentSrc)) {
        var srcFilePath = `${currentSrc}/${entry.name}`
        var destFilePath = `${currentDest}/${entry.name}`
        var manifestKey = destFilePath.replace(`${siteDir}/`, '')
        var sourceKey = srcFilePath.replace(`${srcDir}/`, '')

        if (entry.isDirectory && recursive) {
          await ensureDir(destFilePath)
          await processDir(srcFilePath, destFilePath, `${currentLabel}/${entry.name}`)
        } else if (entry.isFile) {
          var srcMtime = await getFileMtime(srcFilePath)
          var destExists = await getFileMtime(destFilePath) > 0
          var oldEntry = oldManifest.files[manifestKey]

          // Check if we can skip (source unchanged AND dest exists)
          if (oldEntry && oldEntry.mtime && oldEntry.mtime >= srcMtime && destExists) {
            // Source unchanged and dest exists, skip copy
            newManifest.files[manifestKey] = oldEntry
            stats.unchanged++
          } else {
            // Source changed, new, or dest missing - copy it
            await Deno.copyFile(srcFilePath, destFilePath)
            newManifest.files[manifestKey] = {
              source: sourceKey,
              type: 'copied',
              mtime: srcMtime
            }
            stats.copied++
          }
        }
      }
    } catch {
      // Directory doesn't exist
    }
  }

  await processDir(srcPath, destPath, label)
  return stats
}

// Side effect: copies root files incrementally
async function copyRootFiles (oldManifest, newManifest) {
  var stats = { copied: 0, unchanged: 0 }

  try {
    for await (var entry of Deno.readDir(`${srcDir}/root`)) {
      if (entry.isFile) {
        var srcFilePath = `${srcDir}/root/${entry.name}`
        var destFilePath = `${siteDir}/${entry.name}`
        var manifestKey = entry.name
        var srcMtime = await getFileMtime(srcFilePath)
        var destExists = await getFileMtime(destFilePath) > 0
        var oldEntry = oldManifest.files[manifestKey]

        if (oldEntry && oldEntry.mtime && oldEntry.mtime >= srcMtime && destExists) {
          newManifest.files[manifestKey] = oldEntry
          stats.unchanged++
        } else {
          await Deno.copyFile(srcFilePath, destFilePath)
          newManifest.files[manifestKey] = {
            source: `root/${entry.name}`,
            type: 'copied',
            mtime: srcMtime
          }
          stats.copied++
        }
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return stats
}

// Side effect: runs generators, returns stats
async function runGenerators (oldManifest, newManifest) {
  var stats = { changed: 0, unchanged: 0 }

  try {
    for await (var entry of Deno.readDir(`${srcDir}/generators`)) {
      if (entry.isFile && entry.name.endsWith('.js')) {
        var generatorPath = `${srcDir}/generators/${entry.name}`
        var generator = await import(`./${generatorPath}?t=${Date.now()}`)
        var result = await generator.default()

        var outputPath = result.filename
        var fullOutputPath = `${siteDir}/${outputPath}`
        var existingContent = await readFileContent(fullOutputPath)

        if (result.content !== existingContent) {
          await Deno.writeTextFile(fullOutputPath, result.content)
          console.log(`  ✓ ${entry.name} → ${result.filename}`)
          stats.changed++
        } else {
          console.log(`  · ${entry.name} → ${result.filename} (unchanged)`)
          stats.unchanged++
        }

        newManifest.files[outputPath] = {
          source: `generators/${entry.name}`,
          type: 'generated'
        }
      }
    }
  } catch (err) {
    console.log(`  (no generators or error: ${err.message})`)
  }

  return stats
}

// Side effect: scans existing video directories into manifest
async function scanVideos (newManifest) {
  var videoCount = 0

  try {
    for await (var entry of Deno.readDir(`${siteDir}/videos`)) {
      if (entry.isDirectory) {
        var videoDir = `${siteDir}/videos/${entry.name}`
        var playlistPath = `${videoDir}/playlist.m3u8`

        // Check if this is an encoded video directory
        try {
          await Deno.stat(playlistPath)

          // Find corresponding source file
          var sourcePath = `videos/${entry.name}.mp4`
          var sourceExists = false
          try {
            await Deno.stat(`${srcDir}/${sourcePath}`)
            sourceExists = true
          } catch {
            // Source doesn't exist - video is orphaned
          }

          if (sourceExists) {
            // Scan all files in video directory into manifest
            var videoFiles = await findAllFiles(videoDir, `videos/${entry.name}`)
            for (var file of videoFiles) {
              newManifest.files[file] = {
                source: sourcePath,
                type: 'encoded'
              }
            }
            videoCount++
          }
          // If source doesn't exist, don't add to manifest (will be orphaned)
        } catch {
          // Not a valid video directory
        }
      }
    }
  } catch {
    // videos directory doesn't exist
  }

  if (videoCount > 0) {
    console.log(`  ✓ Scanned ${videoCount} encoded video(s)`)
  }

  return videoCount
}

// ============================================================================
// ORPHAN DETECTION AND CLEANUP
// ============================================================================

// Pure: finds orphaned files (in old manifest but not new)
function findOrphans (oldManifest, newManifest) {
  var orphans = []

  for (var filePath of Object.keys(oldManifest.files)) {
    if (!newManifest.files[filePath]) {
      orphans.push(filePath)
    }
  }

  return orphans
}

// Pure: groups orphans by directory for cleaner display
function groupOrphans (orphans) {
  var groups = {}

  for (var orphan of orphans) {
    // Check if this is part of a video directory
    var match = orphan.match(/^videos\/([^/]+)\//)
    if (match) {
      var videoDir = `videos/${match[1]}`
      if (!groups[videoDir]) {
        groups[videoDir] = []
      }
      groups[videoDir].push(orphan)
    } else {
      groups[orphan] = [orphan]
    }
  }

  return groups
}

// Side effect: reports orphans
async function reportOrphans (orphans) {
  if (orphans.length === 0) {
    return
  }

  var groups = groupOrphans(orphans)
  var groupKeys = Object.keys(groups)

  console.log(`\nOrphaned files (${orphans.length} files in ${groupKeys.length} items):`)

  var totalSize = 0

  for (var key of groupKeys) {
    var files = groups[key]
    var fullPath = `${siteDir}/${key}`

    if (files.length === 1 && files[0] === key) {
      // Single file
      var size = await getSize(fullPath)
      totalSize += size
      console.log(`  - ${key} (${formatSize(size)})`)
    } else {
      // Directory (video)
      var size = await getSize(fullPath)
      totalSize += size
      var fileCount = files.length
      console.log(`  - ${key}/ (${formatSize(size)}, ${fileCount} files)`)
    }
  }

  console.log(`\nTotal: ${formatSize(totalSize)}`)
}

// Side effect: deletes orphans
async function deleteOrphans (orphans) {
  var groups = groupOrphans(orphans)

  for (var key of Object.keys(groups)) {
    var fullPath = `${siteDir}/${key}`
    try {
      await Deno.remove(fullPath, { recursive: true })
    } catch {
      // Already deleted or doesn't exist
    }
  }

  console.log(`\nDeleted ${Object.keys(groups).length} orphaned items.`)
}

// Side effect: prompts user for confirmation
async function promptConfirm (message) {
  var buf = new Uint8Array(1)
  Deno.stdout.writeSync(new TextEncoder().encode(`${message} [y/N] `))
  await Deno.stdin.read(buf)

  var response = new TextDecoder().decode(buf).toLowerCase()
  // Read rest of line
  var rest = new Uint8Array(100)
  await Deno.stdin.read(rest)

  return response === 'y'
}

// ============================================================================
// MAIN BUILD
// ============================================================================

console.log('🔨 Building site...\n')

// Load existing manifest
var oldManifest = await loadManifest()
var newManifest = { version: 1, built: null, files: {} }

// Build pages (always regenerate, write only if changed)
var pageStats = await buildPages(oldManifest, newManifest)

// Copy styles
console.log('\nCopying styles...')

// Copy root-level CSS files (like site.css) - non-recursive
var styleStats = await copyAssetsIncremental(
  `${srcDir}/styles`,
  `${siteDir}/styles`,
  'styles',
  oldManifest,
  newManifest,
  false
)

// Copy layout and component CSS
for (var cssType of ['layouts', 'components']) {
  var stats = await copyAssetsIncremental(
    `${srcDir}/styles/${cssType}`,
    `${siteDir}/styles/${cssType}`,
    cssType,
    oldManifest,
    newManifest
  )
  styleStats.copied += stats.copied
  styleStats.unchanged += stats.unchanged
}

// Copy page CSS (recursive for nested directories)
var pageStyleStats = await copyAssetsIncremental(
  `${srcDir}/styles/pages`,
  `${siteDir}/styles/pages`,
  'pages',
  oldManifest,
  newManifest,
  true // recursive
)
styleStats.copied += pageStyleStats.copied
styleStats.unchanged += pageStyleStats.unchanged

console.log(`  (${styleStats.copied} copied, ${styleStats.unchanged} unchanged)`)

// Copy scripts (recursive)
console.log('\nCopying scripts...')
var scriptStats = await copyAssetsIncremental(
  `${srcDir}/scripts`,
  `${siteDir}/scripts`,
  'scripts',
  oldManifest,
  newManifest,
  true
)
if (scriptStats.copied + scriptStats.unchanged > 0) {
  console.log(`  (${scriptStats.copied} copied, ${scriptStats.unchanged} unchanged)`)
}

// Copy static assets
console.log('\nCopying assets...')
var assetStats = { copied: 0, unchanged: 0 }

for (var assetDir of ['fonts', 'images', 'pdfs', 'audios']) {
  var stats = await copyAssetsIncremental(
    `${srcDir}/${assetDir}`,
    `${siteDir}/${assetDir}`,
    assetDir,
    oldManifest,
    newManifest
  )
  assetStats.copied += stats.copied
  assetStats.unchanged += stats.unchanged
}

if (assetStats.copied + assetStats.unchanged > 0) {
  console.log(`  (${assetStats.copied} copied, ${assetStats.unchanged} unchanged)`)
}

// Copy root files
console.log('\nCopying root files...')
var rootStats = await copyRootFiles(oldManifest, newManifest)
if (rootStats.copied + rootStats.unchanged > 0) {
  console.log(`  (${rootStats.copied} copied, ${rootStats.unchanged} unchanged)`)
}

// Scan existing videos (no encoding)
console.log('\nScanning videos...')
await scanVideos(newManifest)

// Run generators
console.log('\nRunning generators...')
await runGenerators(oldManifest, newManifest)

// Save new manifest
await saveManifest(newManifest)

console.log('\n✨ Build complete!')

// Detect and handle orphans
var orphans = findOrphans(oldManifest, newManifest)

if (orphans.length > 0) {
  await reportOrphans(orphans)

  if (cleanFlag) {
    if (yesFlag) {
      await deleteOrphans(orphans)
    } else {
      var confirmed = await promptConfirm('\nDelete these orphaned files?')
      if (confirmed) {
        await deleteOrphans(orphans)
      } else {
        console.log('\nOrphans preserved. Run with --clean -y to force delete.')
      }
    }
  } else {
    console.log('\nRun with --clean to remove orphans.')
  }
}
