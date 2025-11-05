import data from '@data/site.js'

// Pure: generates RSS feed (feed.xml)
// Returns { filename, content }
export default function feed () {
  // Placeholder - add your actual content/blog posts here
  var items = []

  var itemsXml = items.map(item => `    <item>
      <title>${item.title}</title>
      <link>${data.site.url}${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('\n')

  var xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${data.site.name}</title>
    <link>${data.site.url}</link>
    <description>${data.site.tagline}</description>
    <language>en-us</language>
    <atom:link href="${data.site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`

  return {
    filename: 'feed.xml',
    content: xml
  }
}
