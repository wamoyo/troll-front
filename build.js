// Simple build script - compiles JS template pages to HTML

import { ensureDir } from "https://deno.land/std@0.208.0/fs/mod.ts"
import { join } from "https://deno.land/std@0.208.0/path/mod.ts"

var siteDir = "./site"
var srcDir = "./src"

// Get all page files
var pages = []
for await (var entry of Deno.readDir(`${srcDir}/pages`)) {
  if (entry.isFile && entry.name.endsWith('.js')) {
    pages.push(entry.name)
  }
}

console.log(`Building ${pages.length} pages...`)

// Build each page
for (var pageName of pages) {
  var pagePath = `${srcDir}/pages/${pageName}`

  // Import the page module
  var pageModule = await import(`./${pagePath}`)
  var pageFunction = pageModule.default

  // Generate HTML
  var html = pageFunction()

  // Determine output path
  var outputName = pageName.replace('.js', '.html')
  var outputPath = join(siteDir, outputName)

  // Write HTML file
  await ensureDir(siteDir)
  await Deno.writeTextFile(outputPath, html)

  console.log(`  ✓ ${pageName} → ${outputName}`)
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

// Copy page CSS
for await (var entry of Deno.readDir(`${srcDir}/styles/pages`)) {
  if (entry.isFile && entry.name.endsWith('.css')) {
    await Deno.copyFile(
      `${srcDir}/styles/pages/${entry.name}`,
      `${siteDir}/styles/pages/${entry.name}`
    )
    console.log(`  ✓ pages/${entry.name}`)
  }
}

// Copy static assets
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
    if (entry.isFile && entry.name.endsWith('.js')) {
      var generatorPath = `${srcDir}/generators/${entry.name}`
      var generator = await import(`./${generatorPath}`)
      var result = generator.default()

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
