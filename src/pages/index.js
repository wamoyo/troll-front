// CSS: src/styles/pages/index.css

import html from '../utils/html.js'
import standardLayout from '../layouts/standard.js'
import header from '../components/header.js'
import footer from '../components/footer.js'
import data from '../../data.js'

// Pure: returns complete HTML page
function page () {
  return standardLayout({
    head: html`
      <title>${data.site.name} - ${data.site.tagline}</title>
      <meta name="description" content="High-performance carbon nanotube materials from Industrial CNT LLC. Request samples today.">
      <link rel="stylesheet" href="/styles/pages/index.css">
    `,
    body: html`
      ${header('/')}

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

      ${footer()}
    `
  })
}

export default page
