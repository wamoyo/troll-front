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

        <p class='med'>Interested in testing out our carbon nanotubes, or carbon nanotube infused plastics? Email us at <a href="mailto:info@trollhair.com" target="_blank">info@trollhair.com</a> or call us at <a href="tel:+12126021401">(212) 602-1401</a>.</p>
        <p>(Carbon nanotubes available now. Infused plastic pellets and filaments coming soon.)</p>

        <div class="sample-image width-full">
          <img
            src="/images/carbon-nanotube-samples-1200.jpg"
            srcset="/images/carbon-nanotube-samples-400.jpg 400w,
                    /images/carbon-nanotube-samples-800.jpg 800w,
                    /images/carbon-nanotube-samples-1200.jpg 1200w"
            sizes="(max-width: 480px) 100vw,
                   (max-width: 768px) 100vw,
                   1200px"
            alt="Troll Hair sample box containing carbon nanotube materials"
            width="1200"
            height="692"
          >
        </div>

        <h2>Is This Right For You?</h2>

        <p>We provide samples primarily to interested <em>Plastics Makers</em>, <em>Injection Molders</em>, and <em>3D Printers</em>, but all interest is welcome. Researchers are welcome to test our material for various applications as well.</p>

        <h3>How does this work?</h3>
        <ol>
          <li>Reach out and tell us about your company and intended use case(s).</li>
          <li>We'll set up a Zoom or phone call to go over technical details, relevant case studies, and answer any questions you have.</li>
          <li>Technical Data Sheets and Material Safety Data Sheets (MSDS) will be provided, and are available on our website (on  the product pages).</li>
          <li>If our carbon nanotubes are a good fit for your use case and company, we'll ship your samples.</li>
          <li>Our technical team are at your disposal to support your testing and implementation to ensure your success.</li>
        </ol>

        <p>We look forward to building incredible things together!</p>

        <p class="med"><strong>Email:</strong> <a href="mailto:info@trollhair.com" target="_blank">info@trollhair.com</a></p>
        <p class="med"><strong>Phone:</strong> <a href="tel:+12126021401">(212) 602-1401</a></p>
      </section>
    `
  })
}
