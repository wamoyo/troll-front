# Troll Hair Frontend - SSG Architecture

Custom Deno-based static site generator using JavaScript template literals.

## Core Principles

- **Pure functions** - Layouts, components, pages are pure functions
- **No templating engine** - JS template literals with `html` tag
- **Three sections** - imports → front matter (optional) → function
- **Split CSS** - One file per layout/component/page
- **Import maps** - `@utils/`, `@data/`, `@components/`, `@layouts/`
- **Clean URLs** - Output as directory/index.html for extensionless URLs

## Directory Structure

```
troll-front/
├── data/          # Site-wide data (site.js)
├── layouts/       # standard.js, article.js
├── components/    # header.js, footer.js, page-seo.js, article-seo.js
├── pages/         # Pages → HTML files (supports nesting)
├── styles/        # Mirrors: layouts/, components/, pages/
├── scripts/       # Client-side JS
├── root/          # Copied to site root
├── generators/    # sitemap.xml, feed.xml
├── archive/       # Development files (gitignored)
├── site/          # Built output
└── build.js       # Recursively builds all pages
```

## THE THREE SECTION RULE

Every file has exactly three sections:

1. **Imports** - Dependencies
2. **Front matter** (optional) - Data only, NO vars, NO component instantiation
3. **Function** - Return statement ONLY

**Never:**
- Declare component instances in front matter
- Put logic in the function body (only return statements)
- Use `var` for anything except data
- Place media queries outside their parent selector block
- Nest @keyframes inside selector blocks

**Always:**
- Call components inline in templates
- Keep functions pure with only return statements

## Development Workflow

**Dev Server with Smart Watch:**
```bash
deno task dev  # Full build + dev server on localhost:8700 + smart file watching
```

The dev server includes a smart watch system that:
- Runs a full build on startup to ensure clean state
- Watches all source directories using `Deno.watchFs`
- Handles ALL file system events: create, modify, rename, remove
- Intelligently rebuilds only what's needed
- Maintains exact sync between source and output (including deletions)
- Filters temp files from editors (vim swap, emacs temp, etc.)
- Debounces events (100ms) to handle rapid changes

**File System Event Handling:**
The watcher handles these event types:
- `create` - New file created
- `modify` - File content modified
- `rename` - File renamed/moved (critical for atomic saves from editors!)
- `remove` - File deleted

Atomic writes (used by most editors) create temp files and rename them, which fires `rename` events. The watcher properly detects these.

**Smart Rebuild Strategy:**

| File Type | Action | Rebuild Behavior |
|-----------|--------|------------------|
| CSS (`styles/**/*.css`) | Create/Modify/Rename | Copy to site/ |
| CSS | Delete | Delete from site/ |
| Pages (`pages/**/*.js`) | Create/Modify/Rename | Rebuild only that page + cache bust |
| Pages | Delete | Delete output directory |
| Components/Layouts/Data | Any change | Rebuild ALL pages* |
| Assets (images/fonts/etc) | Create/Modify/Rename | Copy to site/ |
| Assets | Delete | Delete from site/ |
| Root files | Create/Modify/Rename | Copy to site/ root |
| Root files | Delete | Delete from site/ root |
| Generators | Create/Modify/Rename | Run that generator |
| Generators | Delete | Do nothing (orphaned) |

*Component/layout/data changes trigger full page rebuild. Future: implement dependency tracking.

**Module Cache Busting:**
Pages are dynamically imported with `?t=${Date.now()}` query parameters to bypass Deno's module cache in the long-running watch process.

**Manual Build:**
```bash
deno task build  # Builds site to site/ directory (no watch, no server)
```

**Visual Feedback with Screenshots:**

When developing pages visually, use Chromium CLI to take screenshots for review. All screenshots should be saved to `archive/screenshots/` (gitignored).

```bash
# Start dev server in background (if not already running)
deno task dev &

# Take screenshot of a page
chromium --headless --disable-gpu \
  --screenshot=archive/screenshots/[page-name].png \
  --window-size=1440,6000 \
  --virtual-time-budget=2000 \
  http://localhost:8700/[page-path]
```

**Screenshot Workflow:**
1. Take "before" screenshot
2. Edit HTML/CSS (dev server auto-rebuilds on save)
3. Take "after" screenshot to see changes
4. Iterate until satisfied

**Screenshot Parameters:**
- `--window-size=1440,6000` - Width 1440px, height adjustable for full page
- `--virtual-time-budget=2000` - Wait 2s for fonts/assets to load
- Name screenshots descriptively: `page-name-v1.png`, `page-name-final.png`, etc.

**Why Chromium CLI?**
- ✅ Fast (1-2 seconds per screenshot)
- ✅ No dependencies (uses system Chromium)
- ✅ Perfect for iterative development
- ✅ Saved history in archive/screenshots/

## Layouts

### Standard Layout

Includes header/footer automatically. Uses **options pattern** for customization.

```javascript
// CSS: styles/layouts/standard.css

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
      ${header(options.currentPath).body}
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

Extends standard layout, wraps content in article structure. Automatically includes articleSeo.

```javascript
// CSS: styles/layouts/article.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import articleSeo from '@components/article-seo.js'

// Pure: wraps body in article structure with metadata
// Note: Pass options through for nav highlighting if needed
export default function article (meta, { options = {}, head = '', body, scripts = ''}) {
  return standard({
    options,  // Pass through for currentPath/nav highlighting
    head: html`
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
          <div class="article-content">${body}</div>
          <footer class="article-footer">
            <a href="/articles" class="back-link">← Back to Articles</a>
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

### Header Component Example

Shows mobile menu toggle pattern with checkbox/hamburger icon.

```javascript
// CSS: styles/components/header.css

import html from '@utils/html.js'
import data from '@data/site.js'

// Front matter - nav links
var nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Samples", href: "/samples" },
  { label: "Careers", href: "/careers" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" }
]

// Pure: returns header component with head, body, scripts
export default function header (currentPath) {
  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/header.css">
    `,
    body: html`
      <header class="cp-header">
        <div class="container">
          <div class="logo">
            <a href="/">
              <img
                src="/images/logo-icon-100.png"
                srcset="/images/logo-icon-100.png 1x, /images/logo-icon-200.png 2x"
                alt="Troll Hair Logo"
                class="logo-icon"
              >
              <span class="brand"><span class="brand-troll">Troll</span> <span class="brand-hair">Hair</span></span>
            </a>
          </div>
          <input type="checkbox" id="menu-toggle" class="menu-toggle" autocomplete="off">
          <label for="menu-toggle" class="mobile-menu-toggle" aria-label="Toggle menu">
            <span class="menu-text"></span>
            <span class="hamburger"></span>
          </label>
          <nav>
            ${nav.map(item => html`
              <a href="${item.href}" class="${item.href === currentPath ? 'active' : ''}">${item.label}</a>
            `).join('\n            ')}
          </nav>
        </div>
      </header>
    `,
    scripts: html``
  }
}
```

## Pages

### Regular Pages

Use **options** to pass `currentPath` for nav highlighting. Use `meta` for SEO data, `pageData` for page-specific content.

```javascript
// CSS: styles/pages/about.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `About Us - ${data.site.name}`,
  description: `Learn about ${data.site.company}...`,
  url: 'https://trollhair.com/about'
}

var pageData = {
  subtitle: 'Our story...',
  stats: [
    { number: '99.9%', label: 'Purity' },
    { number: '15+', label: 'Years Experience' }
  ]
}

// Pure: returns complete page
export default function page () {
  return standard({
    options: {
      currentPath: '/about'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/about.css">
    `,
    body: html`
      <section id="pg-about">
        <h1>${meta.title}</h1>
        <div class="stats">
          ${pageData.stats.map(stat => html`
            <div class="stat">
              <div class="number">${stat.number}</div>
              <div class="label">${stat.label}</div>
            </div>
          `).join('\n          ')}
        </div>
      </section>
    `
  })
}
```

### Article Pages

Pass `meta` object with article metadata. Layout handles title, date, author, SEO, header, footer.

```javascript
// No dedicated CSS file - uses article layout's CSS

import html from '@utils/html.js'
import article from '@layouts/article.js'

// Front matter
var meta = {
  title: 'Breakthrough in CNT Synthesis',
  date: '2025-10-15',
  author: 'Dr. Sarah Chen',
  description: 'Our new CVD process achieves 99.9% purity...',
  url: 'https://trollhair.com/articles/breakthrough-cnt-synthesis'
}

// Pure: returns complete article page
export default function page () {
  return article(meta, {
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

**@keyframes Namespacing:**
- `@keyframes` must be at root level (cannot be nested in current CSS)
- Namespace by name: `@keyframes pg-index-hero-zoom { ... }`, `@keyframes cp-header-slide { ... }`, `@keyframes ly-standard-fade { ... }`
- **Critical:** Place @keyframes AFTER the closing brace of your main selector block, never inside it
- If animations don't work, check that @keyframes are at file root level

### File Comment

Every file starts with: `// CSS: styles/[path].css`

Or if no CSS file: `// No CSS file - uses layout's CSS`

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

1. Recursively find all `pages/**/*.js` files
2. Import and call each page function
3. Write HTML to `site/` as directory/index.html for clean URLs
4. Copy CSS, assets, root files
5. Run generators

**Clean URL Structure:**
- `pages/index.js` → `site/index.html`
- `pages/about.js` → `site/about/index.html`
- `pages/articles/index.js` → `site/articles/index.html`
- `pages/articles/foo.js` → `site/articles/foo/index.html`

**Result:** Clean URLs without .html extensions (`/about`, `/articles/foo`)

## SEO Components

Content-type specific SEO components handle all SEO markup including title, meta description, canonical URL, Schema.org, Open Graph, and Twitter Cards.

**page-seo.js** - For regular pages (WebPage schema)
- Expects `meta.title` to include full title with site name

**article-seo.js** - For articles (Article schema with author/dates)
- Automatically appends site name to article title

Both accept a data object and return `{ head }` with complete SEO markup. Pages only need to call the SEO component and add any additional head content (stylesheets, scripts, etc).

## File Conventions

- **Layouts**: Accept `{ options, head, body, scripts }`, return HTML
- **Components**: Return `{ head, body, scripts }` (all optional)
- **Pages**: Export `page()` function returning layout call
- **Data**: Export default object
- **CSS**: Mirrors source structure exactly
- **Front matter naming**: Use `meta` for SEO data, `pageData` for page-specific content

## CSS Best Practices

### Nesting and Media Queries

Always ensure media queries are INSIDE their parent selector block. CSS nesting syntax is used throughout.

**Bad - Media queries outside parent:**
```css
section#pg-index {
  .hero {
    padding: 4rem 0;
  }
}

/* These won't apply! */
@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;
  }
}
```

**Good - Media queries inside parent:**
```css
section#pg-index {
  .hero {
    padding: 4rem 0;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 2rem 0;
    }
  }
}
```

### Specificity and !important

- Use `!important` sparingly, only for overriding specificity conflicts
- Example: Header nav links need `!important` to override global `body#ly-standard a` styles
- Always document why `!important` is needed with a comment

```css
/* Override global link color for nav - needs !important due to body#ly-standard a specificity */
nav a {
  color: var(--color-text-secondary) !important;
}
```

### Responsive Breakpoints

Standard breakpoints used throughout:
- **1100px** - Large tablets (logo/brand size adjustment)
- **900px** - Tablets / Mobile menu activation
- **768px** - Small tablets
- **640px** - Large phones
- **480px** - Medium phones
- **375px** - Small phones
- **320px** - Very small phones

## Common Pitfalls

### 1. Media queries outside parent selector
**Problem:** Media queries placed outside the main selector block will not apply.

**Solution:** Always nest media queries inside the main selector block.

### 2. CSS specificity conflicts
**Problem:** Global link styles in `standard.css` use `body#ly-standard a` which has high specificity.

**Solution:** Component-specific overrides may need `!important` or matching specificity.

### 3. Forgetting currentPath
**Problem:** Nav highlighting doesn't work.

**Solution:** Pages must pass `options: { currentPath: '/path' }` to standard layout.

### 4. Testing without build
**Problem:** CSS changes don't appear to work.

**Solution:** Always check dev server (auto-rebuilds) or run `deno task build` to verify changes apply.

### 5. @keyframes placement
**Problem:** Animations don't work.

**Solution:** @keyframes must be at root level, outside all selector blocks. Place them after the closing brace of your main selector.

### 6. Front matter violations
**Problem:** Components instantiated in front matter cause errors.

**Solution:** Only declare data in front matter. Call components inline in templates.

```javascript
// BAD - Don't instantiate components in front matter
var headerComponent = header('/about')  // ❌

// GOOD - Only declare data
var meta = { title: 'About' }  // ✅
```

## Watch System Implementation Notes

**Temp File Filtering:**
The watcher filters temporary files created by editors and tools:
- Hidden files (`.DS_Store`, `.file.swp`)
- Backup files (`file~`)
- Temp files (contains `.tmp`)
- Vim swap files (`.swp`, `.swx`, `.swo`)
- Emacs temp files (`#file#`, `file#`)
- Build output (`site/` directory)
- Git directory (`/.git/`)

**Debouncing:**
File system events are collected over 100ms windows and processed together. This handles:
- Editors that fire multiple events for a single save
- Rapid successive changes
- Atomic write operations that generate multiple events

**Why Rename Events Matter:**
Most editors perform atomic writes:
1. Write to temporary file (`about.js.tmp.12345`)
2. Rename temp file to target (`about.js`)

Without handling `rename` events, the watcher won't detect most editor saves!

## TODO

- **Dependency tracking**: Build dependency graph for incremental component rebuilds (currently rebuilds all pages)
- **Create favicon**: Add proper favicon.ico to root/
- **Image optimization**: WebP format with fallbacks, lazy loading
