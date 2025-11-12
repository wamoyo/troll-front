// Smart watch system - monitors source files and rebuilds intelligently

import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts"
import { join } from "https://deno.land/std@0.208.0/path/mod.ts"
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts"

var siteDir = "./site"
var srcDir = "."

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Pure: recursively finds all .js files in a directory
async function findFiles (dir, extension = '.js') {
  var files = []

  async function walk (currentDir, relativePath = '') {
    for await (var entry of Deno.readDir(currentDir)) {
      var entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
      var fullPath = `${currentDir}/${entry.name}`

      if (entry.isDirectory) {
        await walk(fullPath, entryPath)
      } else if (entry.isFile && entry.name.endsWith(extension)) {
        files.push(entryPath)
      }
    }
  }

  await walk(dir)
  return files
}

// Pure: calculates output path for a page
function getPageOutputPath (pagePath) {
  if (pagePath.endsWith('index.js')) {
    return pagePath.replace('index.js', 'index.html')
  } else {
    return pagePath.replace('.js', '/index.html')
  }
}

// Pure: calculates output directory path for a page (for deletion)
function getPageOutputDir (pagePath) {
  if (pagePath.endsWith('index.js')) {
    // index.js -> just the directory it's in
    return pagePath.replace('index.js', '')
  } else {
    // about.js -> about/
    return pagePath.replace('.js', '')
  }
}

// Side effect: builds a single page
async function buildPage (pagePath) {
  try {
    var fullPagePath = `${srcDir}/pages/${pagePath}`

    // Import with cache busting to get latest version
    var pageModule = await import(`./${fullPagePath}?t=${Date.now()}`)
    var pageFunction = pageModule.default

    // Generate HTML
    var html = pageFunction()

    // Determine output path
    var outputPath = getPageOutputPath(pagePath)
    var fullOutputPath = join(siteDir, outputPath)

    // Ensure output directory exists
    var outputDir = fullOutputPath.substring(0, fullOutputPath.lastIndexOf('/'))
    await ensureDir(outputDir)

    // Write HTML file
    await Deno.writeTextFile(fullOutputPath, html)

    console.log(`  ✓ ${pagePath} → ${outputPath}`)
    return true
  } catch (err) {
    console.error(`  ✗ Error building ${pagePath}:`, err.message)
    return false
  }
}

// Side effect: builds all pages
async function buildAllPages () {
  console.log('\nRebuilding all pages...')
  var pages = await findFiles(`${srcDir}/pages`, '.js')

  for (var pagePath of pages) {
    await buildPage(pagePath)
  }
}

// Side effect: copies a file from src to dest
async function copyFile (src, dest) {
  try {
    var destDir = dest.substring(0, dest.lastIndexOf('/'))
    await ensureDir(destDir)
    await Deno.copyFile(src, dest)
    return true
  } catch (err) {
    console.error(`  ✗ Error copying ${src}:`, err.message)
    return false
  }
}

// Side effect: deletes a file
async function deleteFile (path) {
  try {
    await Deno.remove(path)
    return true
  } catch (err) {
    // Ignore errors if file doesn't exist
    if (!(err instanceof Deno.errors.NotFound)) {
      console.error(`  ✗ Error deleting ${path}:`, err.message)
    }
    return false
  }
}

// Side effect: recursively deletes a directory
async function deleteDir (path) {
  try {
    await Deno.remove(path, { recursive: true })
    return true
  } catch (err) {
    // Ignore errors if directory doesn't exist
    if (!(err instanceof Deno.errors.NotFound)) {
      console.error(`  ✗ Error deleting ${path}:`, err.message)
    }
    return false
  }
}

// Side effect: runs a single generator
async function runGenerator (generatorPath) {
  try {
    var fullPath = `${srcDir}/generators/${generatorPath}`

    // Import with cache busting
    var generator = await import(`./${fullPath}?t=${Date.now()}`)
    var result = generator.default()

    await Deno.writeTextFile(`${siteDir}/${result.filename}`, result.content)

    console.log(`  ✓ ${generatorPath} → ${result.filename}`)
    return true
  } catch (err) {
    console.error(`  ✗ Error running ${generatorPath}:`, err.message)
    return false
  }
}

// Side effect: copies all CSS files
async function copyAllCSS () {
  console.log('\nCopying styles...')
  await ensureDir(`${siteDir}/styles`)
  await ensureDir(`${siteDir}/styles/layouts`)
  await ensureDir(`${siteDir}/styles/components`)
  await ensureDir(`${siteDir}/styles/pages`)

  var cssTypes = ['layouts', 'components', 'pages']

  for (var type of cssTypes) {
    try {
      for await (var entry of Deno.readDir(`${srcDir}/styles/${type}`)) {
        if (entry.isFile && entry.name.endsWith('.css')) {
          await Deno.copyFile(
            `${srcDir}/styles/${type}/${entry.name}`,
            `${siteDir}/styles/${type}/${entry.name}`
          )
          console.log(`  ✓ ${type}/${entry.name}`)
        }
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }
}

// Side effect: copies all static assets
async function copyAllAssets () {
  var assetDirs = ['fonts', 'images', 'audios', 'videos', 'scripts']

  for (var dir of assetDirs) {
    var srcPath = `${srcDir}/${dir}`
    var destPath = `${siteDir}/${dir}`

    try {
      await ensureDir(destPath)
      var hasFiles = false

      for await (var entry of Deno.readDir(srcPath)) {
        if (entry.isFile) {
          await Deno.copyFile(
            `${srcPath}/${entry.name}`,
            `${destPath}/${entry.name}`
          )
          hasFiles = true
        }
      }

      if (hasFiles) {
        console.log(`  ✓ ${dir}/`)
      }
    } catch {
      // Directory doesn't exist or is empty, skip
    }
  }
}

// Side effect: copies all root files
async function copyAllRootFiles () {
  console.log('\nCopying root files...')
  try {
    for await (var entry of Deno.readDir(`${srcDir}/root`)) {
      if (entry.isFile) {
        await Deno.copyFile(
          `${srcDir}/root/${entry.name}`,
          `${siteDir}/${entry.name}`
        )
        console.log(`  ✓ ${entry.name}`)
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }
}

// Side effect: runs all generators
async function runAllGenerators () {
  console.log('\nRunning generators...')
  try {
    for await (var entry of Deno.readDir(`${srcDir}/generators`)) {
      if (entry.isFile && entry.name.endsWith('.js')) {
        await runGenerator(entry.name)
      }
    }
  } catch (err) {
    console.log(`  (no generators or error: ${err.message})`)
  }
}

// Side effect: runs complete build
async function fullBuild () {
  console.log('🔨 Running full build...\n')

  // Build all pages
  var pages = await findFiles(`${srcDir}/pages`, '.js')
  console.log(`Building ${pages.length} pages...`)

  for (var pagePath of pages) {
    await buildPage(pagePath)
  }

  // Copy all assets
  await copyAllCSS()
  await copyAllAssets()
  await copyAllRootFiles()

  // Run generators
  await runAllGenerators()

  console.log('\n✨ Build complete!\n')
}

// Side effect: starts dev server
async function startDevServer () {
  console.log('🚀 Starting dev server on http://localhost:8700\n')
  console.log('👀 Watching for changes...\n')

  Deno.serve({
    port: 8700,
    onListen: () => {} // Suppress default listen message
  }, (req) => {
    return serveDir(req, {
      fsRoot: siteDir,
      enableCors: true,
      showDirListing: true
    })
  })
}

// ============================================================================
// FILE CHANGE HANDLERS
// ============================================================================

// Pure: checks if a path is a temp file that should be ignored
function isTempFile (path) {
  var filename = path.split('/').pop()

  // Common temp file patterns from editors and tools
  return (
    filename.startsWith('.') ||               // Hidden files (.DS_Store, .file.swp)
    filename.endsWith('~') ||                 // Backup files (file~)
    filename.includes('.tmp') ||              // Temp files (file.tmp, file.tmp.123)
    filename.endsWith('.swp') ||              // Vim swap files
    filename.endsWith('.swx') ||              // Vim swap files
    filename.endsWith('.swo') ||              // Vim swap files
    filename.startsWith('#') ||               // Emacs temp files (#file#)
    filename.endsWith('#') ||                 // Emacs temp files (file#)
    path.includes('/.git/') ||                // Git directory
    path.includes('/node_modules/') ||        // Node modules
    path.startsWith('site/') ||               // Build output directory
    filename === 'deno.lock' ||               // Deno lock file
    filename === '4913'                       // Vim specific temp file
  )
}

// Side effect: handles file change events (treats create and modify the same)
async function handleFileChange (path, kind) {
  console.log(`\n📝 ${kind}: ${path}`)

  // Handle CSS changes
  if (path.startsWith('styles/') && path.endsWith('.css')) {
    var destPath = path.replace('styles/', 'site/styles/')

    if (kind === 'remove') {
      await deleteFile(destPath)
      console.log(`  ✓ Deleted ${destPath}`)
    } else {
      await copyFile(path, destPath)
      console.log(`  ✓ Copied to ${destPath}`)
    }
    return
  }

  // Handle page changes
  if (path.startsWith('pages/') && path.endsWith('.js')) {
    var pagePath = path.replace('pages/', '')

    if (kind === 'remove') {
      var outputDir = getPageOutputDir(pagePath)
      var fullOutputPath = join(siteDir, outputDir)

      if (pagePath.endsWith('index.js')) {
        // Delete just the index.html file
        var indexPath = fullOutputPath + 'index.html'
        await deleteFile(indexPath)
        console.log(`  ✓ Deleted ${indexPath}`)
      } else {
        // Delete entire directory
        await deleteDir(fullOutputPath)
        console.log(`  ✓ Deleted ${fullOutputPath}`)
      }
    } else {
      await buildPage(pagePath)
    }
    return
  }

  // Handle component, layout, or data changes - rebuild all pages
  if (path.startsWith('components/') || path.startsWith('layouts/') || path.startsWith('data/')) {
    console.log('  ⚠️  Component/layout/data changed - rebuilding all pages')
    console.log('  💡 TODO: Add dependency tracking for incremental builds')
    await buildAllPages()
    return
  }

  // Handle asset changes (images, fonts, audios, videos, scripts)
  var assetDirs = ['images', 'fonts', 'audios', 'videos', 'scripts']
  for (var dir of assetDirs) {
    if (path.startsWith(`${dir}/`)) {
      var destPath = path.replace(`${dir}/`, `site/${dir}/`)

      if (kind === 'remove') {
        await deleteFile(destPath)
        console.log(`  ✓ Deleted ${destPath}`)
      } else {
        await copyFile(path, destPath)
        console.log(`  ✓ Copied to ${destPath}`)
      }
      return
    }
  }

  // Handle root file changes
  if (path.startsWith('root/')) {
    var filename = path.replace('root/', '')
    var destPath = `${siteDir}/${filename}`

    if (kind === 'remove') {
      await deleteFile(destPath)
      console.log(`  ✓ Deleted ${destPath}`)
    } else {
      await copyFile(path, destPath)
      console.log(`  ✓ Copied to ${destPath}`)
    }
    return
  }

  // Handle generator changes
  if (path.startsWith('generators/') && path.endsWith('.js')) {
    if (kind === 'remove') {
      console.log('  ℹ️  Generator deleted - output file not automatically removed')
    } else {
      var generatorPath = path.replace('generators/', '')
      await runGenerator(generatorPath)
    }
    return
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

// Initial full build
await fullBuild()

// Start dev server
await startDevServer()

// Watch for file changes using Deno.watchFs
var watcher = Deno.watchFs([
  'pages',
  'components',
  'layouts',
  'data',
  'styles',
  'images',
  'fonts',
  'audios',
  'videos',
  'scripts',
  'root',
  'generators'
])

// Track changed files and prevent concurrent processing
var changedFiles = new Set()
var removedFiles = new Set()
var debounceTimer = null
var isProcessing = false

for await (var event of watcher) {
  // Handle file system events that indicate content changes
  // - create: new file created
  // - modify: file content modified
  // - rename: file renamed/moved (atomic saves use this!)
  // - remove: file deleted
  // Ignore: access (read-only), any (too vague), other (unspecified)
  if (!['create', 'modify', 'rename', 'remove'].includes(event.kind)) {
    continue
  }

  // Collect all changed files during debounce period
  for (var path of event.paths) {
    // Normalize to relative path
    var relativePath = path.replace(Deno.cwd() + '/', '')

    // Skip temp files entirely
    if (isTempFile(relativePath)) {
      continue
    }

    // Track removed files separately
    if (event.kind === 'remove') {
      removedFiles.add(relativePath)
      changedFiles.delete(relativePath) // Remove from changed if it was there
    } else {
      // 'create', 'modify', and 'rename' are all treated as file changes
      changedFiles.add(relativePath)
      removedFiles.delete(relativePath) // Remove from deleted if it was there
    }
  }

  // Reset debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Process all accumulated changes after 100ms of no activity
  debounceTimer = setTimeout(async () => {
    // Prevent concurrent processing
    if (isProcessing) {
      return
    }

    isProcessing = true

    try {
      // Process all removed files first
      for (var removedPath of removedFiles) {
        await handleFileChange(removedPath, 'remove')
      }

      // Then process all changed/created files
      for (var changedPath of changedFiles) {
        await handleFileChange(changedPath, 'modify')
      }
    } finally {
      // Clear the sets and reset processing flag
      changedFiles.clear()
      removedFiles.clear()
      isProcessing = false
    }
  }, 100)
}
