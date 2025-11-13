// CSS: styles/pages/articles.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Articles - ${data.site.name}`,
  description: `News, updates, and insights from ${data.site.company} about carbon nanotube technology and applications.`,
  url: 'https://trollhair.com/articles'
}

var articles = [
  {
    title: 'Carbon Nanotubes: The Material Of The Future',
    url: '/articles/carbon-nanotubes-material-of-future',
    date: 'November 21, 2024',
    author: 'Troll Hair Team',
    excerpt: 'Carbon nanotubes (CNTs) are tubular molecules of carbon with incredible properties, including immense tensile strength, conduction, chemical resistance, and more.'
  },
  {
    title: 'Long Carbon Nanotubes For Composites',
    url: '/articles/long-carbon-nanotubes-composites',
    date: 'November 21, 2024',
    author: 'Troll Hair Team',
    excerpt: 'Exploring the importance of length when using carbon nanotubes in composites to increase strength and toughness.'
  }
]

// Pure: returns complete articles index page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/articles'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/articles.css">
    `,
    body: html`
      <section id="pg-articles" class="grid-container">
        <header class="articles-header">
          <h1>Articles</h1>
          <p class="subtitle">News, updates, and insights about carbon nanotube technology</p>
        </header>

        <div class="articles-list">
          ${articles.map(article => html`
            <a href="${article.url}" class="article-card">
              <h2>${article.title}</h2>
              <div class="article-meta">
                <span class="date">${article.date}</span>
                <span class="author">By ${article.author}</span>
              </div>
              <p class="excerpt">${article.excerpt}</p>
              <span class="read-more">Read more →</span>
            </a>
          `).join('\n')}
        </div>
      </section>
    `
  })
}
