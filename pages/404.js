// CSS: styles/pages/404.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `404 - Page Not Found - ${data.site.name}`,
  description: 'The webpage you are looking for does not exist.'
}

// Pure: returns complete 404 page HTML
export default function page () {
  return standard({
    options: {
      currentPath: null
    },
    head: html`
      <title>${meta.title}</title>
      <meta name="description" content="${meta.description}">
      <meta name="robots" content="noindex">
      <link rel="stylesheet" href="/styles/pages/404.css">
    `,
    body: html`
      <section id="pg-404" class="grid-container">
        <div class="content">
          <h1>404 - Not Found</h1>
          <h2>Gremlins Ate This Page!</h2>
          <img src="/images/gremlin-sad.jpg" alt="Sad gremlin" class="gremlin">
          <p class="medium">We sent our best engineers to investigate, but they just found crumbs and tiny footprints.</p>
          <p>The page you're looking for might have been moved, deleted, or the link (URL) may contain mispellings or typos.</p>
          <a href="/" class="button primary">Back To Homepage</a>
        </div>
      </section>
    `
  })
}
