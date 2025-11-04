// CSS: src/styles/pages/contact.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Contact ${data.site.name} - Get in Touch`,
  description: `Contact ${data.site.company} to request samples, discuss your project, or learn more about our carbon nanotube materials.`,
  url: 'https://trollhair.com/contact'
}

// Pure: returns complete contact page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/contact'
    },
    head: html`
      <title>${meta.title}</title>
      <meta name="description" content="${meta.description}">
      <link rel="canonical" href="${meta.url}">
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/contact.css">
    `,
    body: html`
      <section id="pg-contact">
        <section class="contact-hero">
          <div class="container">
            <h1>Contact Us</h1>
            <p class="subtitle">Ready to experience the power of carbon nanotubes?</p>
          </div>
        </section>

        <section class="contact-content">
          <div class="container">
            <div class="contact-grid">
              <div class="contact-info">
                <h2>Get in Touch</h2>
                <p>Request samples, discuss your project requirements, or ask us anything about our CNT materials.</p>

                <div class="contact-details">
                  <div class="detail">
                    <h3>Email</h3>
                    <a href="mailto:${data.site.email}">${data.site.email}</a>
                  </div>

                  <div class="detail">
                    <h3>Phone</h3>
                    <a href="tel:${data.site.phone}">${data.site.phone}</a>
                  </div>

                  <div class="detail">
                    <h3>Response Time</h3>
                    <p>We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div class="contact-form">
                <form action="/api/contact" method="post">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                  </div>

                  <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                  </div>

                  <div class="form-group">
                    <label for="company">Company</label>
                    <input type="text" id="company" name="company">
                  </div>

                  <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                  </div>

                  <div class="form-group">
                    <label>
                      <input type="checkbox" name="samples" value="yes">
                      I'd like to request samples
                    </label>
                  </div>

                  <button type="submit" class="submit-button">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </section>
    `
  })
}
