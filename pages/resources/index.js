// CSS: styles/pages/resources/index.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Resources - ${data.site.name}`,
  description: `Articles, videos, podcasts, and insights from ${data.site.company} about carbon nanotube technology and applications.`,
  url: 'https://trollhair.com/resources'
}

var resources = [
  {
    title: 'Carbon Nanotubes: The Material Of The Future',
    url: '/resources/carbon-nanotubes-material-of-future',
    date: 'November 21, 2024',
    author: 'Troll Hair Team',
    excerpt: 'Carbon nanotubes (CNTs) are tubular molecules of carbon with incredible properties, including immense tensile strength, conduction, chemical resistance, and more.',
    image: {
      src: '/images/tubes-bg-400.jpg',
      srcset: '/images/tubes-bg-400.jpg 400w, /images/tubes-bg-800.jpg 800w',
      alt: 'Carbon nanotube molecular structure visualization'
    }
  },
  {
    title: 'Long Carbon Nanotubes For Composites',
    url: '/resources/long-carbon-nanotubes-composites',
    date: 'November 21, 2024',
    author: 'Troll Hair Team',
    excerpt: 'Exploring the importance of length when using carbon nanotubes in composites to increase strength and toughness.',
    image: {
      src: '/images/short-cnts-pull-out-zoomed-400.jpg',
      srcset: '/images/short-cnts-pull-out-zoomed-400.jpg 400w, /images/short-cnts-pull-out-zoomed-800.jpg 800w',
      alt: 'Carbon nanotubes in composite material under microscope'
    }
  }
]

// Pure: returns complete resources index page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/resources'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/resources/index.css">
    `,
    body: html`
      <section id="pg-resources" class="grid-container">
        <header class="resources-header">
          <h1>Resources</h1>
          <p class="subtitle">Learn how <strong>Troll Hair</strong> is transforming the advanced materials industry...</p>
        </header>

        <div class="resources-list width-full">
          ${resources.map(resource => html`
            <a href="${resource.url}" class="resource-card">
              <h2>${resource.title}</h2>
              <div class="resource-image">
                <img
                  src="${resource.image.src}"
                  srcset="${resource.image.srcset}"
                  sizes="(max-width: 500px) 100vw, 500px"
                  alt="${resource.image.alt}"
                  loading="lazy"
                >
              </div>
              <p class="excerpt">${resource.excerpt}</p>
              <span class="read-more">Read more →</span>
            </a>
          `).join('\n')}
        </div>
      </section>
    `
  })
}
