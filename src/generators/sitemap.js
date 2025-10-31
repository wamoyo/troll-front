import data from '../../data.js'

// Pure: generates sitemap.xml
// Returns { filename, content }
function sitemap () {
  var pages = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' }
  ]

  var entries = pages.map(page => `  <url>
    <loc>${data.site.url}${page.loc}</loc>
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

export default sitemap
