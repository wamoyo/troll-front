# Troll Hair Website - Frontend

Static site generator built with Deno and JavaScript template literals.

## Quick Start

```bash
# Start dev server (builds + watches + serves on localhost:8700)
deno task dev

# Build only
deno task build

# Build for production (sets PRODUCTION=true for config.js)
deno task build:prod

# Build and clean orphaned files
deno task build --clean

# Deploy to S3
deno task build:prod --clean -y
aws s3 sync site/ s3://trollhair.com --delete
```

## How It Works

This is a custom static site generator that uses plain JavaScript template literals instead of a templating engine like Pug or Handlebars.

### Structure

```
frontend/
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
│   ├── pages/       # Page-specific scripts
│   ├── components/  # Component scripts
│   ├── layouts/     # Layout scripts
│   ├── utilities/   # Pure helper functions
│   └── libraries/   # Third-party code
├── root/            # Static files for site root
│   ├── robots.txt
│   ├── manifest.json
│   └── favicon.ico
├── generators/      # Generate site root files
│   ├── sitemap.js   # → sitemap.xml
│   └── feed.js      # → feed.xml
├── data/            # Site-wide data (site.js)
└── site/            # Built output (goes to S3)
```

### Creating Pages

Pages are functions that return HTML using template literals:

```javascript
import html from '@utilities/html.js'
import standard from '@layouts/standard.js'

export default function page () {
  return standard({
    options: { currentPath: '/my-page' },
    head: html`
      <title>My Page</title>
      <link rel="stylesheet" href="/styles/pages/my-page.css">
    `,
    body: html`
      <section id="pg-my-page" class="grid-container">
        <h1>Hello World</h1>
      </section>
    `
  })
}
```

### Creating Components

Components are pure functions that take parameters and return HTML:

```javascript
import html from '@utilities/html.js'

// Pure: returns button component with head, body
export default function button ({ text, href, style = 'primary' }) {
  return {
    head: html`<link rel="stylesheet" href="/styles/components/button.css">`,
    body: html`<a href="${href}" class="cp-button cp-button-${style}">${text}</a>`
  }
}
```

### Using Data

Import from `@data/` to access site-wide data:

```javascript
import data from '@data/site.js'

// Use in templates
html`<h1>${data.site.name}</h1>`

// Map over arrays
data.team.map(member => teamCard(member))
```

## Development

- Pages in `pages/*.js` become HTML files in `site/`
- Components return `{ head, body, scripts }` objects
- CSS files are copied to `site/styles/`
- Static assets (fonts, images, etc) copied to `site/`
- Dev server runs at http://localhost:8700

## Backend Integration

A build generator makes `config.js` with backend URL. Client-side scripts import it:

```javascript
import { BACKEND } from '/config.js'
fetch(`${BACKEND}/contact/send`, {...})
```

## Deployment

Built site in `site/` directory deploys to S3 + CloudFront.
