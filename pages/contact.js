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
      <link rel="stylesheet" href="/styles/components/form-message.css">
    `,
    body: html`
      <section id="pg-contact" class="grid-container">
        <h1>Contact</h1>

        <p>Troll Hair is a new company bringing breakthroughs in carbon nanotube manufacturing and application to the market. We cannot wait to build incredible new things with you! Reach out to us using the form below, or email us at <a href="mailto:info@trollhair.com" target="_blank">info@trollhair.com</a> or call <a href="tel:+12126021401">(212) 602-1401</a>.</p>

        <form action="/api/contact" method="post" class="contact-form">
            <input type="text" name="website" id="website" autocomplete="off" style="left: -8975px; position: absolute;" aria-hidden="true" tabindex="-1">

            <div class="form-row">
              <div class="form-group">
                <label for="name">Name *</label>
                <input type="text" id="name" name="name" placeholder="Name *" maxlength="350" required>
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" placeholder="Email *" maxlength="450" required>
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Phone number</label>
              <input type="tel" id="phone" name="phone" placeholder="Phone number">
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea id="message" name="message" rows="6" placeholder="Message *" maxlength="5500" required></textarea>
            </div>

          <!-- TEMPORARY: Mock messages for preview -->
          <div class="cp-form-message cp-form-message-success">
            Thank you! Your message has been sent. We'll get back to you soon.
          </div>

          <div class="cp-form-message cp-form-message-error">
            Something went wrong. Please try again.
          </div>
          <!-- END TEMPORARY -->

          <button type="submit" class="button primary">Send</button>
        </form>
      </section>
    `,
    scripts: html`
      <script type="module" src="/scripts/contact-form.js"></script>
    `
  })
}
