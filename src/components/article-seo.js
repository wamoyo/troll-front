// CSS: None (meta tags only)

import html from '@utils/html.js'
import data from '@data/site.js'

// Pure: returns SEO meta tags for articles (including title, description, canonical)
export default function articleSeo (article) {
  return {
    head: html`
      <title>${article.title} - ${data.site.name}</title>
      <meta name="description" content="${article.description}">
      <link rel="canonical" href="${article.url}">
      <script type="application/ld+json">
        {
          "@context": "http://schema.org",
          "@type": "Article",
          "headline": "${article.title}",
          "description": "${article.description}",
          "url": "${article.url}",
          "image": "${article.image || data.site.url + '/images/og-default.jpg'}",
          "author": {
            "@type": "Person",
            "name": "${article.author}"
          },
          "datePublished": "${article.date}",
          "dateModified": "${article.updated || article.date}",
          "publisher": {
            "@type": "Organization",
            "name": "${data.site.company}",
            "url": "${data.site.url}",
            "logo": {
              "@type": "ImageObject",
              "url": "${data.site.url}/images/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${article.url}"
          }
        }
      </script>
      <meta property="og:type" content="article">
      <meta property="og:title" content="${article.title}">
      <meta property="og:description" content="${article.description}">
      <meta property="og:url" content="${article.url}">
      <meta property="og:image" content="${article.image || data.site.url + '/images/og-default.jpg'}">
      <meta property="og:site_name" content="${data.site.name}">
      <meta property="article:published_time" content="${article.date}">
      <meta property="article:modified_time" content="${article.updated || article.date}">
      <meta property="article:author" content="${article.author}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@trollhair">
      <meta name="twitter:title" content="${article.title}">
      <meta name="twitter:description" content="${article.description}">
      <meta name="twitter:image" content="${article.image || data.site.url + '/images/og-default.jpg'}">
    `
  }
}
