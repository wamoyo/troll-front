# Troll Hair Frontend - SSG Architecture

Custom Deno-based static site generator using JavaScript template literals for templating.

## Core Principles

- **Pure functions everywhere** - Components and pages are pure functions
- **No templating engine** - Just JS template literals with `html` tag for syntax highlighting
- **Split CSS** - One file per layout/component/page (HTTP/2 friendly)
- **Flat asset structure** - Fonts, images, audios, videos at src root (not nested in assets/)
- **Smart rebuilding** - Only rebuild changed files (TODO: not yet implemented)

## Architecture

### Template System

**`html` utility** (`src/utils/html.js`): Tagged template literal that concatenates strings
```javascript
html`<div>${content}</div>`  // Returns string
```

**Layouts**: Two-slot pattern (head + body)
```javascript
function standard ({ head, body }) {
  return html`<!DOCTYPE html>...<head>${head}</head><body>${body}</body>`
}
```

**Pages**: Choose layout, fill slots
```javascript
function page () {
  return standardLayout({
    head: html`<title>...</title>`,
    body: html`${header()}<main>...</main>`
  })
}
```

**Components**: Pure functions with parameters
```javascript
function teamCard ({ name, title, bio }) {
  return html`<div>...</div>`
}
```

### Data Flow

1. `data.js` exports site data
2. Components/pages import data
3. Components take parameters for dynamic content
4. Build script imports pages, calls functions, writes HTML

### CSS Strategy

**Directory Structure:**
```
src/
├── layouts/         # Page layouts
│   └── standard.js
├── components/      # Reusable components
│   ├── header.js
│   └── footer.js
├── pages/           # Pages (become HTML files)
│   ├── index.js
│   └── about.js
├── styles/          # CSS mirrors structure above
│   ├── layouts/
│   ├── components/
│   └── pages/
├── fonts/           # Font files
├── images/          # Images
├── audios/          # Audio files
├── videos/          # Video files
├── scripts/         # Client-side JavaScript files
├── root/            # Files copied to site root (robots.txt, favicon.ico, manifest.json)
│   ├── robots.txt
│   ├── manifest.json
│   └── favicon.ico
└── generators/      # JS files that generate content for site root
    ├── sitemap.js   # Generates sitemap.xml
    └── feed.js      # Generates feed.xml

site/                # Built website (goes to S3)
```

**Namespace Pattern** - Prevents CSS collisions:
- **Layouts**: `<body id="ly-{filename}">`, CSS nested under `#ly-{filename} { }`
- **Pages**: Wrapped in `<section id="pg-{filename}">`, CSS nested under `#pg-{filename} { }`
- **Components**: Wrapped in `.cp-{filename}` class, CSS nested under `.cp-{filename} { }`

Examples:
```javascript
// src/layouts/standard.js applies ID to body:
<body id="ly-standard">...</body>

// src/pages/about.js wraps content in:
<section id="pg-about">...</section>

// src/components/header.js wraps in class:
<header class="cp-header">...</header>
```

```css
/* src/styles/layouts/standard.css */
body#ly-standard {
  .container { max-width: 1200px; }
  a { color: #0066cc; }
}

/* src/styles/pages/about.css */
section#pg-about {
  .hero { padding: 4rem 0; }
  .team-grid { display: grid; }
}

/* src/styles/components/header.css */
header.cp-header {
  background: #1a1a1a;
  nav { display: flex; }
}
```

This makes CSS collision-free, semantic, and maintainable. HTTP/2 makes multiple small CSS files faster than one large bundle.

### Build Process

1. Read all files in `src/pages/*.js`
2. Import each page module
3. Call page function → get HTML string
4. Write to `site/*.html`
5. Copy all CSS files to `site/styles/`
6. Copy all static assets (fonts, images, audios, videos, scripts) to `site/`
7. Copy all files from `src/root/` to `site/` (robots.txt, favicon.ico, etc)
8. Run all generators in `src/generators/` and write output to `site/` (sitemap.xml, feed.xml)

## Key Patterns

**Component with parameters:**
```javascript
function card ({ title, content }) {
  return html`<div class="card">
    <link rel="stylesheet" href="/styles/components/card.css">
    <h3>${title}</h3>
    <p>${content}</p>
  </div>`
}
```

**Mapping data to components:**
```javascript
var cards = data.items.map(item => card(item)).join('\n')
return html`<div class="grid">${cards}</div>`
```

**Active nav highlighting:**
```javascript
function nav (currentPath) {
  return data.nav.map(item => {
    var active = item.href === currentPath ? 'active' : ''
    return html`<a href="${item.href}" class="${active}">${item.label}</a>`
  }).join('\n')
}
```

## File Conventions

- **Layouts**: `src/layouts/[name].js` - Export function taking `{ head, body }`
- **Components**: `src/components/[name].js` - Export pure function
- **Pages**: `src/pages/[name].js` - Export function returning HTML (becomes `[name].html`)
- **Styles**: Mirror structure in `src/styles/` (layout.css, components/*, pages/*)
- **Data**: `data.js` at root - Export object with site data

## Adding New Pages

1. Create `src/pages/my-page.js`
2. Create `src/styles/pages/my-page.css`
3. Import layout, components, data
4. Export page function
5. Run `deno task build`

Result: `site/my-page.html`

## Adding Static Assets

Place files directly in `src/fonts/`, `src/images/`, `src/audios/`, or `src/videos/`. They'll be copied to `site/` on build.

Reference in HTML: `/images/logo.png`, `/fonts/custom.woff2`, etc.

## Root Files & Generators

**Static root files** (robots.txt, favicon.ico, manifest.json):
- Place in `src/root/`
- Copied directly to `site/` root

**Generated root files** (sitemap.xml, feed.xml):
- Create generator in `src/generators/`
- Generator exports function returning `{ filename, content }`
- Example:
```javascript
// src/generators/sitemap.js
function sitemap () {
  var xml = '<?xml version="1.0"?>...'
  return {
    filename: 'sitemap.xml',
    content: xml
  }
}
export default sitemap
```

## Important Notes

### Session Status (Oct 31, 2025)
- ✅ Basic SSG fully implemented and working
- ✅ Two-slot layout system (head + body)
- ✅ CSS namespace pattern with element types (body#ly-*, section#pg-*, element.cp-*)
- ✅ Component system with parameters
- ✅ Root files and generators working
- ✅ Git repo initialized with first commit
- 🚀 Ready to build real pages and deploy

### Key Conventions Established

**File Comments:** Every HTML-generating file (layouts, components, pages) has CSS location comment at top:
```javascript
// CSS: src/styles/components/header.css
```

**CSS Namespacing:** Always include element type in selectors:
- Layouts: `body#ly-standard { }`
- Pages: `section#pg-index { }`
- Components: `header.cp-header { }`, `div.cp-team-card { }`

**Generator Pattern:** Return `{ filename, content }`
```javascript
export default function sitemap() {
  return { filename: 'sitemap.xml', content: '...' }
}
```

**Clean URLs:** Not yet implemented - need to decide on localhost vs S3/CloudFront approach

### Next Steps / TODO

- [ ] File watching for auto-rebuild (dev mode)
- [ ] Smart rebuilding (hash-based, track dependencies)
- [ ] Deploy script for S3 + CloudFront cache invalidation
- [ ] Clean URLs solution (about.html vs about/index.html)
- [ ] Minification for production builds
- [ ] Build actual site pages (products, resources, contact, etc)
- [ ] Add real content to data.js (products, team details)
- [ ] Service worker (sw.js) if needed
- [ ] Image optimization pipeline
