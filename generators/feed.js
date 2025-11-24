import data from '@data/site.js'

// Pure: generates RSS feed (feed.xml)
// Returns { filename, content }
export default function feed () {
  // Current articles (will be expanded to include podcasts/videos later)
  var items = [
    {
      title: 'Carbon Nanotubes: The Material Of The Future',
      link: '/articles/carbon-nanotubes-material-of-future',
      description: 'Carbon nanotubes (CNTs) are tubular molecules of carbon with incredible properties, including immense tensile strength, conduction, chemical resistance, and more.',
      pubDate: 'Thu, 21 Nov 2024 00:00:00 GMT'
    },
    {
      title: 'Long Carbon Nanotubes For Composites',
      link: '/articles/long-carbon-nanotubes-composites',
      description: 'Exploring the importance of length when using carbon nanotubes in composites to increase strength and toughness.',
      pubDate: 'Thu, 21 Nov 2024 00:00:00 GMT'
    }
  ]

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
