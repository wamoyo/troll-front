import data from '@data/site.js'

// Pure: generates sitemap.xml dynamically from pages directory
// Returns { filename, content }
export default async function sitemap () {
  var pages = []
  var srcDir = "."

  // Recursively get all page files (same logic as build.js)
  async function findPages(dir, relativePath = '') {
    for await (var entry of Deno.readDir(dir)) {
      var entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
      var fullPath = `${dir}/${entry.name}`

      if (entry.isDirectory) {
        await findPages(fullPath, entryPath)
      } else if (entry.isFile && entry.name.endsWith('.js')) {
        // Get file stats for lastmod
        var stats = await Deno.stat(fullPath)
        pages.push({
          path: entryPath,
          lastmod: stats.mtime
        })
      }
    }
  }

  await findPages(`${srcDir}/pages`)

  // Convert page paths to URLs
  var urls = pages
    .filter(page => !page.path.includes('private/')) // Exclude private pages
    .map(page => {
      var url
      if (page.path === 'index.js') {
        url = '/'
      } else if (page.path.endsWith('index.js')) {
        // articles/index.js → /articles
        url = '/' + page.path.replace('/index.js', '')
      } else {
        // about.js → /about, articles/foo.js → /articles/foo
        url = '/' + page.path.replace('.js', '')
      }

      // Determine changefreq and priority based on path
      var changefreq = 'monthly'
      var priority = '0.8'

      if (url === '/') {
        changefreq = 'weekly'
        priority = '1.0'
      } else if (url.startsWith('/articles')) {
        changefreq = 'monthly'
        priority = '0.7'
      }

      // Format lastmod as YYYY-MM-DD
      var lastmod = page.lastmod.toISOString().split('T')[0]

      return { loc: url, lastmod, changefreq, priority }
    })
    .sort((a, b) => {
      // Sort by priority (desc), then alphabetically
      if (b.priority !== a.priority) return parseFloat(b.priority) - parseFloat(a.priority)
      return a.loc.localeCompare(b.loc)
    })

  var entries = urls.map(page => `  <url>
    <loc>${data.site.url}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')

  var xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`

  return {
    filename: 'sitemap.xml',
    content: xml
  }
}
