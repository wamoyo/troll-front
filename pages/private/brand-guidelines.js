// CSS: styles/pages/private/brand-guidelines.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Brand Guidelines - ${data.site.name}`,
  description: 'Typography and brand elements for Troll Hair',
  url: 'https://trollhair.com/private/brand-guidelines'
}

// Pure: returns complete brand guidelines page
export default function page () {
  return standard({
    options: {
      currentPath: '/private/brand-guidelines'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/private/brand-guidelines.css">
    `,
    body: html`
      <section id="pg-brand-guidelines">
        <div class="container">
          <header class="page-header">
            <h1>Brand Guidelines</h1>
            <p class="subtitle">Typography, colors, and design elements for Troll Hair</p>
          </header>

          <section class="guide-section">
            <h2 class="section-title">Typography</h2>

            <div class="subsection">
              <h3>Font Family</h3>
              <p class="font-info">Primary: <strong>Ubuntu</strong> (Google Fonts)</p>
              <p class="font-info">Fallback: system-ui, -apple-system, sans-serif</p>
            </div>

            <div class="subsection">
              <h3>Headings</h3>
              <div class="type-specimen">
                <h1>Heading 1 - 3.5rem / 700 weight</h1>
                <p class="type-meta">Use for page titles only</p>
              </div>
              <div class="type-specimen">
                <h2>Heading 2 - 2rem / 700 weight</h2>
                <p class="type-meta">Use for major sections</p>
              </div>
              <div class="type-specimen">
                <h3>Heading 3 - 1.5rem / 700 weight</h3>
                <p class="type-meta">Use for subsections</p>
              </div>
              <div class="type-specimen">
                <h4>Heading 4 - 1.25rem / 700 weight</h4>
                <p class="type-meta">Use for minor sections</p>
              </div>
            </div>

            <div class="subsection">
              <h3>Body Text</h3>
              <div class="type-specimen">
                <p>Regular body copy is 1.125rem with 1.7 line-height. Our Carbon Nanotubes enable ultra high strength plastics for 3D Printing, Injection Molding, Extrusion, and more. This size provides optimal readability on screens of all sizes.</p>
                <p class="type-meta">Body: 1.125rem / line-height 1.7</p>
              </div>
            </div>

            <div class="subsection">
              <h3>Text Formatting</h3>
              <p>Use <strong>strong/bold (700 weight)</strong> for emphasis and <em>em/italic</em> for alternative voice or technical terms. You can combine: <strong><em>bold italic together</em></strong>.</p>
            </div>

            <div class="subsection">
              <h3>Links</h3>
              <p>Links appear in <a href="#">brand red (#e22c3b)</a> with 600 weight. They have no underline by default but <a href="#">underline on hover</a> for clear affordance.</p>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Colors</h2>
            <div class="color-grid">
              <div class="color-card">
                <div class="color-swatch swatch-black"></div>
                <h4>Black</h4>
                <p class="color-value">#000000</p>
                <p class="color-usage">Primary background</p>
              </div>
              <div class="color-card">
                <div class="color-swatch swatch-red"></div>
                <h4>Brand Red</h4>
                <p class="color-value">#e22c3b</p>
                <p class="color-usage">Links, CTAs, accents</p>
              </div>
              <div class="color-card">
                <div class="color-swatch swatch-white"></div>
                <h4>White</h4>
                <p class="color-value">#ffffff</p>
                <p class="color-usage">Primary text color</p>
              </div>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Components</h2>

            <div class="subsection">
              <h3>Buttons</h3>
              <a href="#" class="cta-button">Primary CTA Button</a>
              <p class="type-meta">Background: #e22c3b, Hover: #c91f2e</p>
            </div>

            <div class="subsection">
              <h3>Lists</h3>
              <h4>Unordered</h4>
              <ul>
                <li>Carbon Nanotubes</li>
                <li>3D Printing Materials</li>
                <li>Injection Molding Additives</li>
              </ul>

              <h4>Ordered</h4>
              <ol>
                <li>Contact us for information</li>
                <li>Request free samples</li>
                <li>Test in your process</li>
              </ol>
            </div>

            <div class="subsection">
              <h3>Blockquote</h3>
              <blockquote>
                "Troll Hair's carbon nanotubes have revolutionized our manufacturing process, enabling us to create parts with unprecedented strength-to-weight ratios."
              </blockquote>
            </div>
          </section>
        </div>
      </section>
    `
  })
}
