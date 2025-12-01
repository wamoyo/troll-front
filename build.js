// Simple build script - compiles JS template pages to HTML

import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts"
import { join } from "https://deno.land/std@0.208.0/path/mod.ts"

var siteDir = "./site"
var srcDir = "."

// Recursively get all page files
var pages = []

async function findPages(dir, relativePath = '') {
  for await (var entry of Deno.readDir(dir)) {
    var entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
    var fullPath = `${dir}/${entry.name}`

    if (entry.isDirectory) {
      await findPages(fullPath, entryPath)
    } else if (entry.isFile && entry.name.endsWith('.js')) {
      pages.push(entryPath)
    }
  }
}

await findPages(`${srcDir}/pages`)

console.log(`Building ${pages.length} pages...`)

// Build each page
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
    // index.js → index.html (same directory)
    outputPath = pagePath.replace('index.js', 'index.html')
  } else {
    // about.js → about/index.html
    outputPath = pagePath.replace('.js', '/index.html')
  }
  var fullOutputPath = join(siteDir, outputPath)

  // Ensure output directory exists
  var outputDir = fullOutputPath.substring(0, fullOutputPath.lastIndexOf('/'))
  await ensureDir(outputDir)

  // Write HTML file
  await Deno.writeTextFile(fullOutputPath, html)

  console.log(`  ✓ ${pagePath} → ${outputPath}`)
}

// Copy CSS files
console.log('\nCopying styles...')
await ensureDir(`${siteDir}/styles`)
await ensureDir(`${siteDir}/styles/layouts`)
await ensureDir(`${siteDir}/styles/components`)
await ensureDir(`${siteDir}/styles/pages`)

// Copy layout CSS
for await (var entry of Deno.readDir(`${srcDir}/styles/layouts`)) {
  if (entry.isFile && entry.name.endsWith('.css')) {
    await Deno.copyFile(
      `${srcDir}/styles/layouts/${entry.name}`,
      `${siteDir}/styles/layouts/${entry.name}`
    )
    console.log(`  ✓ layouts/${entry.name}`)
  }
}

// Copy component CSS
for await (var entry of Deno.readDir(`${srcDir}/styles/components`)) {
  if (entry.isFile && entry.name.endsWith('.css')) {
    await Deno.copyFile(
      `${srcDir}/styles/components/${entry.name}`,
      `${siteDir}/styles/components/${entry.name}`
    )
    console.log(`  ✓ components/${entry.name}`)
  }
}

// Recursive function to copy directory contents
async function copyDirRecursive (src, dest, label) {
  await ensureDir(dest)
  for await (var entry of Deno.readDir(src)) {
    var srcPath = `${src}/${entry.name}`
    var destPath = `${dest}/${entry.name}`
    if (entry.isDirectory) {
      await copyDirRecursive(srcPath, destPath, `${label}/${entry.name}`)
    } else if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath)
      console.log(`  ✓ ${label}/${entry.name}`)
    }
  }
}

// Copy page CSS (including nested directories)
await copyDirRecursive(`${srcDir}/styles/pages`, `${siteDir}/styles/pages`, 'pages')

// Copy scripts (including nested directories like scripts/components/)
console.log('\nCopying scripts...')
try {
  await copyDirRecursive(`${srcDir}/scripts`, `${siteDir}/scripts`, 'scripts')
} catch {
  // Directory doesn't exist, skip
}

// Copy static assets (flat directories only)
var assetDirs = ['fonts', 'images', 'pdfs']

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

// Copy root files (favicon, robots.txt, etc)
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

// Run generators (sitemap, feed, etc)
console.log('\nRunning generators...')
try {
  for await (var entry of Deno.readDir(`${srcDir}/generators`)) {
    if (entry.isFile && entry.name.endsWith('.js') && entry.name !== 'config.js') {
      var generatorPath = `${srcDir}/generators/${entry.name}`
      var generator = await import(`./${generatorPath}?t=${Date.now()}`)
      var result = await generator.default() // Await in case generator is async

      await Deno.writeTextFile(
        `${siteDir}/${result.filename}`,
        result.content
      )

      console.log(`  ✓ ${entry.name} → ${result.filename}`)
    }
  }
} catch (err) {
  console.log(`  (no generators or error: ${err.message})`)
}

console.log('\n✨ Build complete!')
