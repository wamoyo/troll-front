// CSS: styles/pages/contact.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Contact - ${data.site.name}`,
  description: 'Troll Hair is a new company bringing breakthroughs in carbon nanotube manufacturing and application to the market.',
  url: 'https://trollhair.com/contact'
}

// Pure: returns complete contact page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/contact'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/contact.css">
    `,
    body: html`
      <section id="pg-contact" class="grid-container">
        <h1>Contact</h1>

        <p>Troll Hair is a new company bringing breakthroughs in carbon nanotube manufacturing and application to the market. We cannot wait to build incredible new things with you! Reach out to us using the form below, or email us at <a href="mailto:info@trollhair.com" target="_blank">info@trollhair.com</a> or call <a href="tel:+12126021401">(212) 602-1401</a>.</p>

        <form action="/api/contact" method="post" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Name">
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" placeholder="Email *" required>
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Phone number</label>
              <input type="tel" id="phone" name="phone" placeholder="Phone number">
            </div>

            <div class="form-group">
              <label for="comment">Comment</label>
              <textarea id="comment" name="comment" rows="6" placeholder="Comment"></textarea>
            </div>

          <button type="submit" class="button primary">Send</button>
        </form>
      </section>
    `
  })
}
