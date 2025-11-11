// CSS: styles/pages/index.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `${data.site.name} - Titanium Strength Plastics`,
  description: 'Our Carbon Nanotubes enable ultra high strength plastics for 3D Printing, Injection Molding, Extrusion, and more...',
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
            <div class="hero-content">
              <h1>Titanium Strength Plastics</h1>
              <p class="hero-description">Our <strong>Carbon Nanotubes</strong> enable ultra high strength plastics for 3D Printing, Injection Molding, Extrusion, and more...</p>
              <a href="/samples" class="cta-button">Get Samples</a>
            </div>
            <div class="hero-image">
              <img src="/images/hero-3d-printed-carbon-nanotube.png" alt="Red 3D printed geometric object demonstrating carbon nanotube enhanced plastic">
            </div>
          </div>
        </section>
      </section>
    `
  })
}
