// CSS: src/styles/layouts/article.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import articleSeo from '@components/article-seo.js'
import data from '@data/site.js'

// Pure: article layout that extends standard layout, wraps body in article structure
export default function article (meta, { head = '', body, scripts = ''}) {
  return standard({
    head: html`
      <title>${meta.title} - ${data.site.name}</title>
      <meta name="description" content="${meta.description}">
      <link rel="canonical" href="${meta.url}">
      ${articleSeo(meta).head}
      <link rel="stylesheet" href="/styles/layouts/article.css">
      ${head}
    `,
    body: html`
      <article id="ly-article">
        <div class="container">
          <header class="article-header">
            <h1>${meta.title}</h1>
            <div class="article-meta">
              <span class="date">${meta.date}</span>
              <span class="author">By ${meta.author}</span>
            </div>
          </header>

          <div class="article-content">
            ${body}
          </div>

          <footer class="article-footer">
            <a href="/articles" class="back-link">← Back to Articles</a>
          </footer>
        </div>
      </article>
    `,
    scripts: html`${scripts}`
  })
}
