# Troll Hair Website - Frontend

Static site generator built with Deno and JavaScript template literals.

## Quick Start

```bash
# Build the site
deno task build

# Start dev server
deno task dev

# Deploy to S3
deno task deploy
```

## How It Works

This is a custom static site generator that uses plain JavaScript template literals instead of a templating engine like Pug or Handlebars.

### Structure

```
src/
├── layouts/         # Page layouts (standard.js, etc)
├── components/      # Reusable components (header, footer, etc)
├── pages/           # Page files → HTML files
├── styles/          # CSS organized by layout/component/page
│   ├── layouts/
│   ├── components/
│   └── pages/
├── fonts/           # Font files
├── images/          # Images
├── audios/          # Audio files
├── videos/          # Video files
├── scripts/         # Client-side JavaScript
├── root/            # Static files for site root
│   ├── robots.txt
│   ├── manifest.json
│   └── favicon.ico
└── generators/      # Generate site root files
    ├── sitemap.js   # → sitemap.xml
    └── feed.js      # → feed.xml

site/                # Built site (goes to S3)
data.js              # Site data available to all pages/components
```

### Creating Pages

Pages are functions that return HTML using template literals:

```javascript
import html from '../utils/html.js'
import standardLayout from '../layouts/standard.js'
import header from '../components/header.js'

function page () {
  return standardLayout({
    head: html`
      <title>My Page</title>
      <link rel="stylesheet" href="/styles/pages/my-page.css">
    `,
    body: html`
      ${header('/my-page')}
      <main>
        <h1>Hello World</h1>
      </main>
    `
  })
}

export default page
```

### Creating Components

Components are pure functions that take parameters and return HTML:

```javascript
import html from '../utils/html.js'

function button ({ text, href, style = 'primary' }) {
  return html`<a href="${href}" class="btn btn-${style}">
  <link rel="stylesheet" href="/styles/components/button.css">
  ${text}
</a>`
}

export default button
```

### Using Data

Import `data.js` to access site-wide data:

```javascript
import data from '../../data.js'

// Use in templates
html`<h1>${data.site.name}</h1>`

// Map over arrays
data.team.map(member => teamCard(member))
```

## Development

- Pages in `src/pages/*.js` become HTML files in `site/`
- Components load their own CSS inline
- CSS files are copied to `site/styles/`
- Static assets (fonts, images, etc) copied to `site/`
- Dev server runs at http://localhost:8700

## Deployment

Built site in `site/` directory deploys to S3 + CloudFront.
