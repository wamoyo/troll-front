// CSS: styles/pages/samples.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Get Samples - ${data.site.name}`,
  description: 'Interested in testing our carbon nanotubes or carbon nanotube infused plastics? Contact us to get samples for your injection molding, 3D printing, or research projects.',
  url: 'https://trollhair.com/samples'
}

// Pure: returns complete samples page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/samples'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/samples.css">
    `,
    body: html`
      <section id="pg-samples" class="grid-container">
        <h1>Get Samples Today</h1>

        <p>Interested in testing out our carbon nanotubes, or carbon nanotube infused plastics? Email us at <a href="mailto:info@trollhair.com" target="_blank">info@trollhair.com</a> or call us directly at <a href="tel:+12126021401">(212) 602-1401</a>.</p>

        <div class="sample-image">
          <img src="/images/carbon-nanotube-samples.png" alt="Troll Hair sample box containing carbon nanotube materials">
        </div>

        <h2>More Information</h2>

        <p>We provide samples primarily to interested <em>Injection Molders</em> and <em>3D Printers</em>. Researchers are welcome to test our material for various applications as well.</p>

        <p>We'll happily provide our Material Safety Data Sheets (MSDS) ahead of sending samples, as well as share data and use cases over a video conference.</p>

        <p>We look forward to building incredible things together!</p>

        <p><strong>Email:</strong> <a href="mailto:info@trollhair.com" target="_blank">info@trollhair.com</a></p>
        <p><strong>Phone:</strong> <a href="tel:+12126021401">(212) 602-1401</a></p>
      </section>
    `
  })
}
