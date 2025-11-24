// CSS: None (meta tags only)

import html from '@utils/html.js'
import data from '@data/site.js'

// Pure: returns SEO meta tags for product pages (including title, description, canonical)
export default function productSeo (product) {
  return {
    head: html`
      <title>${product.title} - ${data.site.name}</title>
      <meta name="description" content="${product.description}">
      <link rel="canonical" href="${product.url}">
      <script type="application/ld+json">
        {
          "@context": "http://schema.org",
          "@type": "Product",
          "name": "${product.title}",
          "description": "${product.description}",
          "url": "${product.url}",
          "image": "${product.image || data.site.url + '/images/Troll-Hair-Website.jpg'}",
          "brand": {
            "@type": "Brand",
            "name": "${data.site.name}"
          },
          "manufacturer": {
            "@type": "Organization",
            "name": "${data.site.company}",
            "url": "${data.site.url}"
          },
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "price": "0",
            "priceCurrency": "USD",
            "url": "${product.url}"
          }
        }
      </script>
      <meta property="og:type" content="product">
      <meta property="og:title" content="${product.title}">
      <meta property="og:description" content="${product.description}">
      <meta property="og:url" content="${product.url}">
      <meta property="og:image" content="${product.image || data.site.url + '/images/Troll-Hair-Website.jpg'}">
      <meta property="og:site_name" content="${data.site.name}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@trollhair">
      <meta name="twitter:title" content="${product.title}">
      <meta name="twitter:description" content="${product.description}">
      <meta name="twitter:image" content="${product.image || data.site.url + '/images/Troll-Hair-Website.jpg'}">
    `
  }
}
