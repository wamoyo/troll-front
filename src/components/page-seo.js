// CSS: None (meta tags only)

import html from '@utils/html.js'
import data from '@data/site.js'

// Pure: returns SEO meta tags for generic pages (including title, description, canonical)
export default function pageSeo (page) {
  return {
    head: html`
      <title>${page.title}</title>
      <meta name="description" content="${page.description}">
      <link rel="canonical" href="${page.url}">
      <script type="application/ld+json">
        {
          "@context": "http://schema.org",
          "@type": "WebPage",
          "name": "${page.title}",
          "description": "${page.description}",
          "url": "${page.url}",
          "image": "${page.image || data.site.url + '/images/og-default.jpg'}",
          "publisher": {
            "@type": "Organization",
            "name": "${data.site.company}",
            "url": "${data.site.url}"
          }
        }
      </script>
      <meta property="og:type" content="website">
      <meta property="og:title" content="${page.title}">
      <meta property="og:description" content="${page.description}">
      <meta property="og:url" content="${page.url}">
      <meta property="og:image" content="${page.image || data.site.url + '/images/og-default.jpg'}">
      <meta property="og:site_name" content="${data.site.name}">
      <meta property="og:locale" content="en_US">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@trollhair">
      <meta name="twitter:title" content="${page.title}">
      <meta name="twitter:description" content="${page.description}">
      <meta name="twitter:image" content="${page.image || data.site.url + '/images/og-default.jpg'}">
    `
  }
}
