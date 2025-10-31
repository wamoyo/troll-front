// CSS: None (meta tags only)

import html from '../utils/html.js'
import data from '../../data.js'

// Pure: returns SEO meta tags based on page type and parameters
function seo ({
  type = 'website',
  title,
  description,
  image = '/images/og-default.jpg',
  url
}) {
  var fullTitle = title || `${data.site.name} - ${data.site.tagline}`
  var fullDescription = description || `High-performance carbon nanotube materials from ${data.site.company}`
  var fullUrl = url || data.site.url
  var fullImage = image.startsWith('http') ? image : `${data.site.url}${image}`

  return html`
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${fullUrl}">
    <meta property="og:title" content="${fullTitle}">
    <meta property="og:description" content="${fullDescription}">
    <meta property="og:image" content="${fullImage}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${fullUrl}">
    <meta property="twitter:title" content="${fullTitle}">
    <meta property="twitter:description" content="${fullDescription}">
    <meta property="twitter:image" content="${fullImage}">

    <!-- Additional SEO -->
    <link rel="canonical" href="${fullUrl}">
  `
}

export default seo
