// CSS: src/styles/pages/articles.css

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
    title: 'Breakthrough in CNT Synthesis Achieves 99.9% Purity',
    url: '/articles/breakthrough-cnt-synthesis',
    date: '2025-10-15',
    author: 'Dr. Sarah Chen',
    excerpt: 'Our new CVD process has achieved unprecedented purity levels, opening doors for next-generation applications in quantum computing and advanced electronics.'
  },
  {
    title: 'Industrial CNT Partners with Leading Aerospace Company',
    url: '/articles/aerospace-partnership',
    date: '2025-09-22',
    author: 'Marcus Rivera',
    excerpt: 'We\'re excited to announce a strategic partnership to develop next-generation composite materials for commercial aircraft, reducing weight by up to 30%.'
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
      <section id="pg-articles">
        <div class="container">
          <header class="articles-header">
            <h1>Articles</h1>
            <p class="subtitle">News, updates, and insights about carbon nanotube technology</p>
          </header>

          <div class="articles-list">
            ${articles.map(article => html`
              <article class="article-card">
                <h2><a href="${article.url}">${article.title}</a></h2>
                <div class="article-meta">
                  <span class="date">${article.date}</span>
                  <span class="author">By ${article.author}</span>
                </div>
                <p class="excerpt">${article.excerpt}</p>
                <a href="${article.url}" class="read-more">Read more →</a>
              </article>
            `).join('\n')}
          </div>
        </div>
      </section>
    `
  })
}
