# Troll Hair Frontend - SSG Architecture

Custom Deno-based static site generator using JavaScript template literals.

## Core Principles

- **Pure functions** - Layouts, components, pages are pure functions
- **No templating engine** - JS template literals with `html` tag
- **Three sections** - imports → front matter (optional) → function
- **Split CSS** - One file per layout/component/page
- **Import maps** - `@utilities/`, `@data/`, `@components/`, `@layouts/`
- **Clean URLs** - Output as directory/index.html for extensionless URLs

## Brand Guidelines

Reference `pages/private/brand-guidelines.js` (or `/private/brand-guidelines` in browser) for colors, typography, voice/tone, and component examples.

## Directory Structure

```
frontend/
├── data/          # Site-wide data (site.js)
├── layouts/       # standard.js, article.js
├── components/    # header.js, footer.js, page-seo.js, article-seo.js
├── pages/         # Pages → HTML files (supports nesting)
├── styles/        # Mirrors: layouts/, components/, pages/
├── scripts/       # Client-side JS (see Scripts Structure below)
├── root/          # Copied to site root
├── generators/    # sitemap.xml, feed.xml
├── archive/       # Development files (gitignored)
├── site/          # Built output
└── build.js       # Recursively builds all pages
```

## Scripts Structure

Client-side JavaScript organized by purpose:

```
scripts/
├── components/    # Component scripts (mirrors components/ structure)
├── layouts/       # Layout scripts (mirrors layouts/ structure)
├── pages/         # Page-specific scripts (mirrors pages/ structure)
├── utilities/     # Pure helper functions
└── libraries/     # Third-party code or complex shared modules
```

### Page Scripts Naming

- **Single script**: `pages/[page-name].js`
- **Multiple scripts**: `pages/[page-name]-[purpose].js`
- **Nested pages**: Mirror the `pages/` directory structure

```
scripts/pages/
├── contact.js                        # Single script for contact page
├── samples.js                        # General script for samples page
├── samples-materials.js              # Additional script for samples page
└── resources/                        # Nested directory mirrors pages/resources/
    ├── index.js                      # Script for resources listing page
    ├── index-filters.js              # Additional script for resources listing
    └── carbon-nanotubes-material-of-future.js  # Script for specific resource
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

import html from '@utilities/html.js'
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

import html from '@utilities/html.js'
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
            <a href="/resources" class="back-link">← Back to Resources</a>
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

import html from '@utilities/html.js'
import data from '@data/site.js'

// Front matter - nav links
var nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Samples", href: "/samples" },
  { label: "Careers", href: "/careers" },
  { label: "Resources", href: "/resources" },
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

import html from '@utilities/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `About - ${data.site.name}`,
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
      <section id="pg-about" class="grid-container">
        <h1>About</h1>
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

import html from '@utilities/html.js'
import article from '@layouts/article.js'

// Front matter
var meta = {
  title: 'Breakthrough in Carbon Nanotube Manufacturing',
  date: '2025-10-15',
  author: 'Dr. Bradley Edwards',
  description: 'Our carbon nanotuebs achieve over 100 gigapascals of tensile strength...',
  url: 'https://trollhair.com/resources/breakthrough-cnt-synthesis'
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

**Adding new content types** (podcast, video, etc.): Create a new page in `pages/resources/` with appropriate `meta` and consider whether `article-seo.js` fits or a new SEO component is needed (e.g., `VideoObject` schema for videos).

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

Manifest-based build system that tracks all output files, enables incremental builds, and detects orphaned files.

```bash
deno task build              # Build, show orphans (if any)
deno task build --clean      # Build, prompt to delete orphans
deno task build --clean -y   # Build, delete orphans without prompt (CI/CD)
```

**How it works:**
1. Load existing manifest (`site/.build.json`)
2. Generate HTML pages (always run, write only if content changed)
3. Copy assets (skip if source mtime unchanged since last build)
4. Scan existing encoded videos into manifest
5. Run generators (always run, write only if content changed)
6. Compare old manifest to new → detect orphans
7. Report orphans, optionally delete with `--clean`
8. Save new manifest

**Incremental behavior:**
- **HTML/generators**: Always regenerate, but only write to disk if content differs (preserves mtime)
- **CSS/JS/images/fonts/PDFs**: Compare source mtime to manifest, skip copy if unchanged
- **Videos**: Scanned from `site/videos/`, not rebuilt (use `deno task videos` separately)

**Orphan detection:**
When source files are renamed or deleted, the old output becomes an "orphan" (in old manifest but not new). Build reports these and `--clean` removes them.

**Clean URL Structure:**
- `pages/index.js` → `site/index.html`
- `pages/about.js` → `site/about/index.html`
- `pages/resources/index.js` → `site/resources/index.html`
- `pages/resources/foo.js` → `site/resources/foo/index.html`

**Result:** Clean URLs without .html extensions (`/about`, `/resources/foo`)

## Deployment Infrastructure

Static files hosted on S3 + CloudFront CDN.

| Environment | Domain | S3 Bucket | CloudFront ID |
|-------------|--------|-----------|---------------|
| Test | test.trollhair.com | test.trollhair.com | E1AAWB5YT2L06L |
| Production | trollhair.com | trollhair.com | E30W92P5BYVD4T |

**CloudFront URLs (for debugging):**
- Test: `d3mzgog5m5apba.cloudfront.net`
- Prod: `d19bwekdwm3tl0.cloudfront.net`

**Deploy commands:**

| Command | What it does |
|---------|--------------|
| `deno task deploy test` | Build → Sync site → Invalidate cache |
| `deno task deploy test --media` | Sync videos/audios → Invalidate cache |
| `deno task deploy prod` | Build → Sync site → Invalidate cache (with confirmation) |
| `deno task deploy prod -y` | Same, skip confirmation |
| `deno task deploy prod --media` | Sync videos/audios → Invalidate cache (with confirmation) |
| `deno task deploy prod --media -y` | Same, skip confirmation |
| `deno task deploy prod --invalidate` | Invalidate cache only (no confirmation) |

**Notes:**
- All deploys invalidate `/*` (entire cache) - simple and consistent
- `--invalidate` is for rare cache debugging, doesn't change files so no confirmation needed
- Site deploys exclude videos/audios; use `--media` to deploy those separately

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

## Design System (site.css)

### CSS Custom Properties

All design tokens are defined as CSS custom properties in `site.css` for consistency and maintainability.

**Dual Color Naming System:**
```css
/* Literal Colors - explicit values for direct use */
--black: #000;
--white: #fff;
--red: #e22c3b;
--red-dark: #c91f2e;
--green: #00ff88;
--light-grey: #B3B3B3;
--dark-grey: #808080;

/* Opacity Variants */
--white-03: rgba(255, 255, 255, 0.03);
--white-10: rgba(255, 255, 255, 0.1);
--white-30: rgba(255, 255, 255, 0.3);
--red-30: rgba(226, 44, 59, 0.3);

/* Semantic Colors - theme-aware, use these for components */
--bg: var(--black);
--bg-2: var(--white-03);
--text: var(--white);
--text-2: var(--light-grey);
--text-3: var(--dark-grey);
--accent: var(--red);
--accent-hover: var(--red-dark);
--success: var(--green);
--border: var(--white-10);
```

**Typography:**
```css
/* Fonts */
--ubuntu: 'Ubuntu', Ubuntu, system-ui, -apple-system, sans-serif;
--mono: 'Ubuntu Mono', ...;

/* Sizes */
--h1: 3.5rem;
--h2: 2rem;
--h3: 1.5rem;
--h4: 1.25rem;
--medium: 1.325rem;
--body: 1rem;
--small: 0.9375rem;

/* Weights */
--bold: bold;
/* Use 'normal' keyword directly, no variable needed */

/* Line Heights */
--tight: 1.1;
/* Use 1.6 directly for middle value */
--relaxed: 1.7;
```

**Spacing:**
```css
--xs: 0.5rem;
--sm: 1rem;
--md: 1.5rem;
--lg: 2rem;
--xl: 3rem;
--2xl: 4rem;
```

**Container Widths:**
```css
--narrow: 700px;  /* Forms, narrow content */
--page: 965px;    /* Main page content (aligns with logo) */
--wide: 1200px;   /* Wide content, header container */
```

**Transitions:**
```css
--fast: 0.2s;
--normal: 0.3s;
```

### Global Responsive Typography

Headings automatically scale down on mobile to maintain hierarchy while improving readability. Defined globally in `site.css`:

```css
/* Desktop: Use CSS variables */
h1 { font-size: var(--h1); }  /* 3.5rem */
h2 { font-size: var(--h2); }  /* 2rem */
h3 { font-size: var(--h3); }  /* 1.5rem */
h4 { font-size: var(--h4); }  /* 1.25rem */

/* 768px and below: Gentle shrinking */
@media (max-width: 768px) {
  h1 { font-size: 3rem; }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.375rem; }
  h4 { font-size: 1.125rem; }
}

/* 480px and below: More compression */
@media (max-width: 480px) {
  h1 { font-size: 2.5rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: var(--h4); }
  h4 { font-size: 1.125rem; }
}

/* 320px and below: Maximum compression while maintaining hierarchy */
@media (max-width: 320px) {
  h1 { font-size: 2.25rem; }
  h2 { font-size: var(--h3); }
  h3 { font-size: var(--h4); }
  h4 { font-size: 1.125rem; }  /* Never smaller than body text */
}
```

**Important:** Pages should NOT override heading sizes unless absolutely necessary. The global responsive typography maintains proper hierarchy across all screen sizes.

## Grid Container System

The grid system provides consistent layout, spacing, and alignment across all pages. Defined in `styles/layouts/standard.css`.

### How It Works

```css
body#ly-standard .grid-container {
  display: grid;
  grid-template-columns:
    [full-start]
    minmax(var(--md), 1fr)      /* Left gutter (min 1.5rem) */
    [page-start]
    minmax(0, calc(var(--page) - (var(--md) * 2)))  /* Content (965px - 3rem = 917px) */
    [page-end]
    minmax(var(--md), 1fr)      /* Right gutter (min 1.5rem) */
    [full-end];
  padding-top: var(--2xl);      /* 4rem vertical padding */
  padding-bottom: var(--2xl);
}

/* All children default to page lane */
body#ly-standard .grid-container > * {
  grid-column: page;
}

/* Opt-in to full width */
body#ly-standard .grid-container > .width-full {
  grid-column: full;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
```

### Why 917px Content Width?

The grid content width (917px) is carefully calculated to align the left edge of page content with the "Troll Hair" text in the logo:

**Header alignment math:**
- Header container: 1200px (`--wide`)
- On 1440px viewport: margin = (1440-1200)/2 = 120px
- Plus padding: 1.5rem = 24px
- Plus logo: 100px
- Plus gap: 0.75rem = 12px
- **"Troll Hair" starts at: 256px from left**

**Page content alignment:**
- Content: 917px (965px - 48px internal padding)
- Gutters: (1440-965)/2 = 237.5px each
- Plus gutter min-width: 1.5rem = 24px
- **Content starts at: ~261px from left** ✓

This creates a visually pleasing vertical alignment between the logo text and page content.

### Using Grid Container

**Basic Usage:**
```html
<section id="pg-about" class="grid-container">
  <h1>About Us</h1>
  <p>Content stays in the page lane (917px max)</p>
</section>
```

**Breaking Out to Full Width:**
```html
<section id="pg-resources" class="grid-container">
  <h1>Resources</h1>
  <p class="subtitle">This stays in page lane</p>

  <!-- This breaks out to full viewport width -->
  <div class="resources-list width-full">
    <!-- Resource cards can spread across full width -->
  </div>
</section>
```

**Responsive Vertical Padding:**
The grid container's top/bottom padding scales down on smaller screens:
- **Desktop**: 4rem (--2xl)
- **768px**: 3rem (--xl)
- **480px**: 2rem (--lg)
- **320px**: 1.5rem (--md)

### Grid Container vs Old Containers

**Before (deprecated):**
```html
<section id="pg-about">
  <div class="container-medium">  <!-- Extra wrapper div -->
    <h1>About</h1>
  </div>
</section>
```

**After (current):**
```html
<section id="pg-about" class="grid-container">  <!-- One class, no wrapper -->
  <h1>About</h1>
</section>
```

**Benefits:**
- ✅ No wrapper divs needed
- ✅ Consistent spacing (horizontal gutters + vertical padding)
- ✅ Easy to break out to full width with `.width-full`
- ✅ Aligns content with logo
- ✅ Responsive padding built-in

## Image Best Practices

### Preventing Layout Shift

Always include `width` and `height` attributes on images to reserve space before the image loads. This prevents content from jumping around (Cumulative Layout Shift).

**Bad - No dimensions:**
```html
<img src="/images/logo.png" alt="Logo">
<!-- Browser doesn't know size, layout shifts when image loads -->
```

**Good - Explicit dimensions:**
```html
<img
  src="/images/logo-icon-100.png"
  srcset="/images/logo-icon-100.png 1x, /images/logo-icon-200.png 2x"
  alt="Troll Hair Logo"
  width="100"
  height="100"
>
<!-- Browser reserves 100x100 space immediately, no layout shift -->
```

The CSS can still scale the image with `max-height`, `max-width`, etc. The aspect ratio is preserved.

## Video Player Component

Custom video player with HLS streaming, thumbnail sprites, and full controls.

### Files
- `components/video-player.js` - HTML structure
- `styles/components/video-player.css` - Styling
- `scripts/components/video-player.js` - Client-side logic

### Features
- HLS adaptive streaming (hls.js for Chrome/Firefox, native Safari)
- Quality selector (Auto + manual resolution)
- Speed control (0.5x - 2x)
- Keyboard shortcuts (Space, J/K/L, M, F, arrows)
- Media Session API (OS-level controls)
- Thumbnail sprite scrubbing (hover preview + drag overlay)
- Captions support (WebVTT)

### Usage
```javascript
import videoPlayer from '@components/video-player.js'

var video = videoPlayer({
  id: 'my-video',
  src: '/videos/my-video/playlist.m3u8',
  poster: '/images/my-video-poster.jpg',
  title: 'Video Title',             // Optional: overlay heading
  captions: '/videos/captions.vtt', // Optional
  wide: true                        // Optional: full-width mode
})

// Returns { head, body, scripts }
```

## Video Encoding

### Folder Structure
```
videos/
├── encode-hls.sh     # Encoding script
├── my-video.mp4      # Source files (gitignored)
└── ...

site/videos/
├── my-video/
│   ├── playlist.m3u8   # Master playlist
│   ├── 1080p/          # Quality variants
│   ├── 720p/
│   ├── 480p/
│   ├── 240p/
│   ├── sprite.jpg      # Thumbnail sprite sheet
│   └── thumbnails.vtt  # Sprite time mapping
```

### Encoding Workflow
```bash
# Encode all not-yet-encoded videos
deno task videos

# Encode specific video
./videos/encode-hls.sh my-video.mp4
```

### What It Generates
1. **HLS streams** - 4 quality levels (1080p, 720p, 480p, 240p)
2. **Master playlist** - Adaptive bitrate switching
3. **Thumbnail sprite** - Grid of preview images
4. **VTT file** - Maps timestamps to sprite coordinates

### Thumbnail Sprite Intervals
Dynamic based on video duration (keeps sprite under browser size limits):
- < 30 min → every 2 seconds
- 30-60 min → every 5 seconds
- 1+ hours → every 10 seconds

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

- **Fix watch.js debouncing**: Sometimes misses component file changes (needs investigation of debounce window and atomic write handling)
- **Dependency tracking**: Build dependency graph for incremental component rebuilds (currently rebuilds all pages)
- **Image optimization**: WebP format with fallbacks, lazy loading
