// CSS: styles/pages/index.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `${data.site.name} - ${data.site.tagline}`,
  description: 'High-performance carbon nanotube materials from Industrial CNT LLC. Request samples today.',
  url: 'https://trollhair.com'
}

// Pure: returns complete HTML page
export default function page () {
  return standard({
    options: {
      currentPath: '/'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/index.css">
    `,
    body: html`
      <section id="pg-index">
        <section class="hero">
          <div class="container">
            <h1>Welcome to ${data.site.name}</h1>
            <p class="tagline">${data.site.tagline}</p>
            <a href="#samples" class="cta-button">Get Samples</a>
          </div>
        </section>

        <section class="intro">
          <div class="container">
            <h2>Revolutionary Carbon Nanotube Technology</h2>
            <p>Industrial CNT LLC manufactures high-performance carbon nanotube materials for advanced applications.</p>
          </div>
        </section>
      </section>
    `
  })
}
