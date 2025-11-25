// CSS: styles/pages/products/product.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import productSeo from '@components/product-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: 'Carbon Nanotube Infused Plastic Pellets',
  description: 'Ultra high strength carbon nanotubes infused into plastic pellets for injection molding, extrusion, and more. Every 1% adds 1 gigapascal of tensile strength.',
  url: 'https://trollhair.com/products/carbon-nanotube-infused-plastic-pellets',
  image: 'https://trollhair.com/images/cnt-plasticpellets-800.jpg'
}

// Pure: returns complete product page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/products'
    },
    head: html`
      ${productSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/products/product.css">
    `,
    body: html`
      <section id="pg-product-detail">
        <div class="product-wrapper">
          <div class="product-header">
            <h1>${meta.title}</h1>
            <p class="subtitle">Ultra high strength carbon nanotubes infused into plastic pellets for injection molding, extrusion, and more.</p>
          </div>

          <div class="product-image">
            <img
              src="/images/cnt-plasticpellets-400.jpg"
              srcset="/images/cnt-plasticpellets-400.jpg 400w, /images/cnt-plasticpellets-800.jpg 800w"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Carbon Nanotube Infused Plastic Pellets"
            >
            <p class="caption">Carbon nanotube infused plastic pellets (example image)</p>
          </div>

          <div class="product-content">
            <p>We are currently testing our carbon nanotubes in Nylon, Polypropylene, and other thermoplastics. Every 1% of our carbon nanotubes boost tensile strength by 1 <em><strong>gigapascal</strong></em>.</p>

            <p>Our carbon nanotubes are not harsh to extruders, mixers, and are suitable for almost all nozzles and narrow mold areas.</p>

            <p>If you're an Injection Molding building high strength parts, reach out to us. We'd love to learn about your use cases!</p>

            <div class="contact-info">
              <h2>Contact Us For More Info:</h2>
              <p>
                Email: <a href="mailto:info@trollhair.com">info@trollhair.com</a><br>
                Phone: <a href="tel:+12126021401">212-602-1401</a>
              </p>
            </div>

            <footer class="product-footer">
              <a href="/products" class="button secondary">« All Products</a>
              <span class="coming-soon">Coming Soon!</span>
            </footer>
          </div>
        </div>
      </section>
    `
  })
}
