# Troll Hair Frontend - SSG Architecture

Custom Deno-based static site generator using JavaScript template literals.

## Core Principles

- **Pure functions** - Layouts, components, pages are pure functions
- **No templating engine** - JS template literals with `html` tag
- **Three sections** - imports → front matter (optional) → function
- **Split CSS** - One file per layout/component/page
- **Import maps** - `@utils/`, `@data/`, `@components/`, `@layouts/`

## Directory Structure

```
troll-front/
├── src/
│   ├── data/          # Site-wide data (site.js)
│   ├── layouts/       # standard.js, article.js
│   ├── components/    # header.js, footer.js, team-card.js
│   ├── pages/         # Pages → HTML files (supports nesting)
│   ├── styles/        # Mirrors: layouts/, components/, pages/
│   ├── scripts/       # Client-side JS
│   ├── root/          # Copied to site root
│   └── generators/    # sitemap.xml, feed.xml
├── site/              # Built output
└── build.js           # Recursively builds all pages
```

## THE THREE SECTION RULE

Every file has exactly three sections:

1. **Imports** - Dependencies
2. **Front matter** (optional) - Data only, NO vars, NO component instantiation
3. **Function** - Return statement ONLY

**Never:**
- Declare component instances in front matter
- Put logic in the function
- Use `var` for anything except data

**Always:**
- Call components inline in templates
- Keep functions pure with only return statements

## Layouts

### Standard Layout

Includes header/footer automatically. Uses **options pattern** for customization.

```javascript
// CSS: src/styles/layouts/standard.css

import html from '@utils/html.js'
import header from '@components/header.js'
import footer from '@components/footer.js'

// Pure: complete HTML document with header/footer
export default function standard ({ options = {}, head, body, scripts }) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width">
      <link rel="stylesheet" href="/styles/layouts/standard.css">
      ${header().head}
      ${footer().head}
      ${head || ''}
    </head>
    <body id="ly-standard">
      ${header({ currentPath: options.currentPath }).body}
      ${body || ''}
      ${footer().body}
      ${scripts || ''}
      ${header().scripts}
    </body>
    </html>
  `
}
```

### Article Layout

Extends standard layout, wraps content in article structure.

```javascript
// CSS: src/styles/layouts/article.css

import html from '@utils/html.js'
import standardLayout from '@layouts/standard.js'
import data from '@data/site.js'

// Pure: wraps body in article structure with metadata
export default function article (article, { head = html``, body, scripts = html`` } = {}) {
  return standardLayout({
    head: html`
      <title>${article.title} - ${data.site.name}</title>
      <meta name="description" content="${article.description}">
      <link rel="stylesheet" href="/styles/layouts/article.css">
      ${head}
    `,
    body: html`
      <article id="ly-article">
        <div class="container">
          <header class="article-header">
            <h1>${article.title}</h1>
            <div class="article-meta">
              <span class="date">${article.date}</span>
              <span class="author">By ${article.author}</span>
            </div>
          </header>
          <div class="article-content">${body}</div>
          <footer class="article-footer">
            <a href="/articles.html" class="back-link">← Back to Articles</a>
          </footer>
        </div>
      </article>
    `,
    scripts: html`${scripts}`
  })
}
```

## Components

Components return `{ head, body, scripts }` (all optional).

```javascript
// CSS: src/styles/components/header.css

import html from '@utils/html.js'
import data from '@data/site.js'

// Front matter - nav links
var nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" }
]

// Pure: returns header with nav
export default function header ({ currentPath = '/' } = {}) {
  return {
    head: html`<link rel="stylesheet" href="/styles/components/header.css">`,
    body: html`
      <header class="cp-header">
        <div class="container">
          <div class="logo"><a href="/">${data.site.name}</a></div>
          <nav>
            ${nav.map(item => html`
              <a href="${item.href}" class="${item.href === currentPath ? 'active' : ''}">${item.label}</a>
            `).join('')}
          </nav>
        </div>
      </header>
    `,
    scripts: html`<script src="/scripts/nav.js"></script>`
  }
}
```

## Pages

### Regular Pages

Use **options** to pass `currentPath` for nav highlighting. Header/footer automatic.

```javascript
// CSS: src/styles/pages/about.css

import html from '@utils/html.js'
import standardLayout from '@layouts/standard.js'
import data from '@data/site.js'

// Front matter - page data only
var pageData = {
  title: 'About Us',
  stats: [
    { number: '99.9%', label: 'Purity' },
    { number: '15+', label: 'Years Experience' }
  ]
}

// Pure: returns complete page
export default function page () {
  return standardLayout({
    options: {
      currentPath: '/about'
    },
    head: html`
      <title>${pageData.title} - ${data.site.name}</title>
      <link rel="stylesheet" href="/styles/pages/about.css">
    `,
    body: html`
      <section id="pg-about">
        <h1>${pageData.title}</h1>
        <div class="stats">
          ${pageData.stats.map(stat => html`
            <div class="stat">
              <div class="number">${stat.number}</div>
              <div class="label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `
  })
}
```

### Article Pages

Pass article object, just supply body content. Layout handles title, date, author, header, footer.

```javascript
// CSS: src/styles/layouts/article.css

import html from '@utils/html.js'
import articleLayout from '@layouts/article.js'

// Front matter - article metadata
var article = {
  title: 'Breakthrough in CNT Synthesis',
  date: '2025-10-15',
  author: 'Dr. Sarah Chen',
  description: 'Our new CVD process achieves 99.9% purity...'
}

// Pure: returns complete article page
export default function page () {
  return articleLayout(article, {
    body: html`
      <p class="lead">Article intro paragraph...</p>
      <h2>Section Heading</h2>
      <p>Article content...</p>
    `
  })
}
```

## Key Patterns

### CSS Namespacing

- **Layouts**: `body#ly-standard { ... }`
- **Pages**: `section#pg-about { ... }`
- **Components**: `header.cp-header { ... }`

### File Comment

Every file starts with: `// CSS: src/styles/[path].css`

### Options Pattern

Layouts accept `options` as first parameter for customization without breaking `{ head, body, scripts }` pattern:

```javascript
standard({ options: { currentPath: '/about' }, head, body, scripts })
```

Options are optional with sensible defaults.

## Build Process

```bash
deno task build
```

1. Recursively find all `src/pages/**/*.js` files
2. Import and call each page function
3. Write HTML to `site/` (mirrors src/pages structure)
4. Copy CSS, assets, root files
5. Run generators

Nested pages work: `pages/articles/foo.js` → `site/articles/foo.html`

## File Conventions

- **Layouts**: Accept `{ options, head, body, scripts }`, return HTML
- **Components**: Return `{ head, body, scripts }` (all optional)
- **Pages**: Export `page()` function returning layout call
- **Data**: Export default object
- **CSS**: Mirrors source structure exactly
