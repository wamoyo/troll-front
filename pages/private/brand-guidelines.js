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
      <link rel="stylesheet" href="/styles/components/form-message.css">
    `,
    body: html`
      <section id="pg-brand-guidelines" class="grid-container">
        <header class="page-header">
          <h1>Brand Guidelines</h1>
          <p class="subtitle">Complete brand identity system for Troll Hair</p>
        </header>

        <section class="guide-section">
            <h2 class="section-title">Brand Overview</h2>
            <div class="brand-overview width-full">
              <div class="subsection">
                <h3>Who We Are</h3>
                <p>Industrial CNT LLC (soon to be Troll Hair Inc.) is a carbon nanotube manufacturing startup producing CNT-based materials that enable ultra-high strength plastics for 3D printing, injection molding, extrusion, and advanced manufacturing.</p>
              </div>
              <div class="subsection">
                <h3>Brand Personality</h3>
                <p>Scientific yet approachable. Cutting-edge but practical. We're the rebellious innovators making the impossible possible—hence "Troll Hair" for materials that sound mythical but are very real.</p>
              </div>
              <div class="subsection">
                <h3>Target Audience</h3>
                <p>Engineering teams, R&D departments, manufacturers, and innovators looking to push the boundaries of material science in their products.</p>
              </div>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Logo & Brand Mark</h2>
            <div class="subsection">
              <h3>Primary Logo</h3>
              <div class="logo-display">
                <img src="/images/logo-icon-200.png" alt="Troll Hair Logo" style="max-width: 150px; padding: 2rem; border-radius: 8px;">
              </div>
              <p class="usage-note"><strong>Usage:</strong> The troll hair icon combined with wordmark. Use on light backgrounds with sufficient contrast.</p>
            </div>
            <div class="subsection">
              <h3>Wordmark Treatment</h3>
              <p class="wordmark-example"><span style="color: #fff;">Troll</span> <span style="color: #e22c3b;">Hair</span></p>
              <p class="usage-note">"Troll" in white, "Hair" in brand red. Always maintain this color distinction to create visual interest.</p>
            </div>
          </section>

          <h2 class="section-title">Typography</h2>

          <section class="guide-section" style="max-width: 965px; margin: 0 auto;">
            <p>Above this paragraph sits the red section title variant—it's 2.5rem, uses the accent color (#e22c3b), and has a 1px bottom border. We use it to divide major page sections like "Typography" or "Color Palette" on this page.</p>

            <p>The H1 (like "Building a Clear Visual Hierarchy" below) is 3.5rem, bold, white, with tight 1.1 line-height. Use once per page for the main title.</p>

            <h1>Building a Clear Visual Hierarchy</h1>

            <time class="type-meta" style="display: block; margin-bottom: 2rem;">Updated November 2024</time>

            <p>Our fonts: We use <strong>Ubuntu</strong> for almost everything, and <strong>Ubuntu Mono</strong> for technical content and numbers (like the update date just above this paragraph).</p>

            <p>Body text is 1rem with a relaxed 1.7 line-height. It's set in a light grey (#B3B3B3) to reduce eye strain and create hierarchy against the black background.</p>

            <h2>Heading Hierarchy</h2>

            <p>H2 headings (2rem, bold, white, tight line-height) divide major sections. They get extra top margin of 2rem, like all headings, to create breathing room and define a new section of the copy. The one above is a standard H2.</p>

            <h3>Subsection Heading</h3>

            <p>H3 headings (1.5rem, bold, white) break down H2 sections. Same top/bottom margin as H2 for consistent rhythm.</p>

            <h4>Minor Heading</h4>

            <p>H4 headings (1.25rem/20px, bold, white) are the smallest. Less top margin (2rem) since they're minor divisions. Use sparingly.</p>

            <p>If you need any headings to be numbered, just add the class <em>numbered</em>.</p>

            <h4 class="numbered">Something</h4>
            <p>The first section...</p>
            <h4 class="numbered">Something Else</h4>
            <p>The second section...</p>
            <h4 class="numbered">A Third Thing!</h4>
            <p>The third section...</p>

            <h3>But then...</h3>
            <p>A new h3 resets!</p>

            <h4 class="numbered">Next Set Of Numbers</h4>
            <p>Numbering starts over.</p>

            <h2>Inline Formatting</h2>

            <p>Use <strong>bold</strong> for emphasis (appears in full white). Use <em>italic</em> for alternative voice or technical terms. <strong><em>Combine both</em></strong> when needed.</p>

            <p>Links are <a href="#">brand red (#e22c3b)</a>, bold weight, no underline by default. They <a href="#">gain an underline on hover</a> for clear affordance.</p>

            <p>Lists inherit body text styling with comfortable spacing between items, like this...</p>

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


            <h3>Technical Content</h3>

            <p class="type-meta">Technical content like this uses Ubuntu Mono at 0.9375rem (15px) in a darker grey (50% opacity). Use for code, specifications, color values (#e22c3b), measurements (1.5rem), or any monospace content.</p>
          </section>

          <h2 class="section-title">Color Palette</h2>

          <h3>Primary Colors</h3>

          <div class="color-grid width-full">
            <div class="color-card">
              <div class="color-swatch swatch-black"></div>
              <h4>Black</h4>
              <p class="color-value">#000000</p>
              <p class="color-usage">Primary background, creates dramatic contrast and emphasizes the high-tech nature of our materials</p>
            </div>
            <div class="color-card">
              <div class="color-swatch swatch-red"></div>
              <h4>Brand Red</h4>
              <p class="color-value">#e22c3b</p>
              <p class="color-usage">Links, CTAs, accents, "Hair" in wordmark. The energy and passion of innovation.</p>
            </div>
            <div class="color-card">
              <div class="color-swatch swatch-white"></div>
              <h4>White</h4>
              <p class="color-value">#ffffff</p>
              <p class="color-usage">Primary text, "Troll" in wordmark. Clean, precise, scientific.</p>
            </div>
            <div class="color-card">
              <div class="color-swatch swatch-green"></div>
              <h4>Success Green</h4>
              <p class="color-value">#00ff88</p>
              <p class="color-usage">Positive actions, success states, affirmative messaging. Bright and energetic.</p>
            </div>
            <div class="color-card">
              <div class="color-swatch swatch-orange"></div>
              <h4>Warning Orange</h4>
              <p class="color-value">#f2833b</p>
              <p class="color-usage">Form failures, warnings, caution states. Signals attention needed without being alarming.</p>
            </div>
            <div class="color-card">
              <div class="color-swatch swatch-grey"></div>
              <h4>Light Grey</h4>
              <p class="color-value">#B3B3B3</p>
              <p class="color-usage">Body text, secondary content. Softer than pure white for comfortable reading.</p>
            </div>
            <div class="color-card">
              <div class="color-swatch swatch-grey-dark"></div>
              <h4>Dark Grey</h4>
              <p class="color-value">#808080</p>
              <p class="color-usage">Muted text, de-emphasized content. Use sparingly for lowest hierarchy text.</p>
            </div>
          </div>

          <h3>Color Usage Guidelines</h3>
          <ul>
            <li><strong>Always</strong> use black backgrounds for primary brand materials</li>
            <li><strong>Never</strong> use red as a background color—it's for accents only</li>
            <li>Maintain high contrast ratios for accessibility (minimum 7:1 for body text)</li>
            <li>Red should represent 10-15% of any design, not dominate</li>
          </ul>

          <section class="guide-section">
            <h2 class="section-title">Components</h2>

            <div class="subsection">
              <h3>Buttons</h3>
              <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <a href="#" class="button primary">Primary Button</a>
                <a href="#" class="button secondary">Secondary Button</a>
                <a href="#" class="button tertiary">Tertiary Button</a>
              </div>
              <p class="type-meta">Primary: Solid red background. Secondary: White text with red border. Tertiary: Grey text with grey border (white on hover).</p>
            </div>

            <div class="subsection">
              <h3>Blockquote</h3>
              <blockquote>
                "Troll Hair's carbon nanotubes have revolutionized our manufacturing process, enabling us to create parts with unprecedented strength-to-weight ratios."
              </blockquote>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Form Elements</h2>

            <div class="subsection">
              <h3>Form Inputs</h3>
              <p>All form inputs share a consistent visual style: transparent background, semi-transparent white border (30% opacity), brand red border on focus. Click into any field below to see the focus state.</p>

              <div class="form-examples">
                <div class="form-group">
                  <label for="example-text">Text Input</label>
                  <input type="text" id="example-text" placeholder="Name *">
                </div>

                <div class="form-group">
                  <label for="example-email">Email Input</label>
                  <input type="email" id="example-email" placeholder="Email *">
                </div>

                <div class="form-group">
                  <label for="example-tel">Telephone Input</label>
                  <input type="tel" id="example-tel" placeholder="Phone number">
                </div>

                <div class="form-group">
                  <label for="example-textarea">Textarea</label>
                  <textarea id="example-textarea" rows="6" placeholder="Message *"></textarea>
                </div>
              </div>

              <p class="type-meta" style="margin-top: var(--md);">Background: transparent • Border: 1px solid var(--white-30) • Padding: var(--sm) • Focus: border-color var(--accent) • Transition: var(--fast)</p>
            </div>

            <div class="subsection">
              <h3>Form Messages</h3>
              <p>Form messages provide clear feedback for form submissions. Success messages use green, error messages use orange.</p>

              <div class="cp-form-message cp-form-message-success">
                Thank you! Your message has been sent. We'll get back to you soon.
              </div>

              <div class="cp-form-message cp-form-message-error">
                Something went wrong. Please try again.
              </div>

              <p class="type-meta" style="margin-top: var(--md);">Success: background var(--green-10), border/text var(--green) • Error: background var(--orange-10), border/text var(--orange) • Padding: var(--md) • Border radius: 4px</p>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Spacing & Layout</h2>
            <div class="subsection">
              <h3>Container Width</h3>
              <p>Maximum content width: <strong>1200px</strong> centered with auto margins. Provides comfortable reading experience on all screen sizes.</p>
            </div>
            <div class="subsection">
              <h3>Spacing Scale</h3>
              <ul>
                <li><strong>Small:</strong> 0.5rem (8px) - Tight spacing between related elements</li>
                <li><strong>Medium:</strong> 1rem (16px) - Default spacing for most elements</li>
                <li><strong>Large:</strong> 2rem (32px) - Section padding, card spacing</li>
                <li><strong>XL:</strong> 4rem (64px) - Major section breaks</li>
              </ul>
            </div>
            <div class="subsection">
              <h3>Grid System</h3>
              <p>Use CSS Grid or Flexbox for layouts. Maintain consistent gutters of 2rem between columns. Mobile-first responsive approach with breakpoints at 768px, 1024px, and 1440px.</p>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Voice & Tone</h2>
            <div class="subsection">
              <h3>Brand Voice</h3>
              <ul>
                <li><strong>Scientific but Accessible:</strong> Use precise technical language when needed, but always explain complex concepts clearly</li>
                <li><strong>Confident:</strong> We know our materials work. Back it up with data and real-world results</li>
                <li><strong>Playful Edge:</strong> The "Troll Hair" name shows we don't take ourselves too seriously, even though we take our science seriously</li>
                <li><strong>Action-Oriented:</strong> Focus on what customers can achieve with our materials, not just what the materials are</li>
              </ul>
            </div>
            <div class="subsection">
              <h3>Writing Guidelines</h3>
              <ul>
                <li>Use active voice: "Our CNTs enable stronger parts" not "Stronger parts are enabled by our CNTs"</li>
                <li>Lead with benefits, follow with features</li>
                <li>Avoid jargon unless your audience is technical (then embrace it)</li>
                <li>Be direct: "Request samples" not "Consider the possibility of requesting samples"</li>
              </ul>
            </div>
          </section>

          <section class="guide-section">
            <h2 class="section-title">Brand Do's & Don'ts</h2>
            <div class="dos-donts-grid">
              <div class="dos-donts-card">
                <h3 class="do">✓ Do</h3>
                <ul>
                  <li>Maintain the two-tone wordmark (Troll = white, Hair = red)</li>
                  <li>Use black backgrounds for primary brand materials</li>
                  <li>Keep generous whitespace around logos and text</li>
                  <li>Use Ubuntu font family consistently</li>
                  <li>Show real product photography and microscopy images</li>
                  <li>Write in active, confident voice</li>
                </ul>
              </div>
              <div class="dos-donts-card">
                <h3 class="dont">✗ Don't</h3>
                <ul>
                  <li>Change the logo colors or rearrange elements</li>
                  <li>Use red as a background color</li>
                  <li>Crowd designs—give elements room to breathe</li>
                  <li>Mix multiple font families in one design</li>
                  <li>Use generic stock photos of "science"</li>
                  <li>Be vague or use passive voice excessively</li>
                </ul>
              </div>
            </div>
          </section>
      </section>
    `
  })
}
