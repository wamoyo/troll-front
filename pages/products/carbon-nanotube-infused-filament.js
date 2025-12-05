// CSS: styles/pages/products/product.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import productSeo from '@components/product-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: 'Carbon Nanotube Infused Filament',
  description: 'Ultra high strength 3D printing filament infused with carbon nanotubes for rapid production of high strength parts. 0.2% concentration provides 40% boost in tensile strength.',
  url: 'https://trollhair.com/products/carbon-nanotube-infused-filament',
  image: 'https://trollhair.com/images/cnt-filament-800.jpg'
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
            <p class="subtitle">Ultra high strength carbon nanotubes infused into 3D printing filament for rapid production of high strength parts.</p>
          </div>

          <div class="product-image">
            <img
              src="/images/cnt-filament-400.jpg"
              srcset="/images/cnt-filament-400.jpg 400w, /images/cnt-filament-800.jpg 800w"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Carbon Nanotube Infused Filament"
            >
            <p class="caption">Carbon nanotube infused 3D printing filament (example image)</p>
          </div>

          <div class="product-content">
            <p>A 0.2% concentration of our carbon nanotubes produced a 40% boost in tensile strength above baseline, including across the z-axis (showing interlayer adhesion) for 3D printing (Fused Deposition Modeling).</p>

            <p>We are testing and adding various concentrations to different base polymers. If you're a 3D printer, contact us and tell us what materials, properties, and effects would be most valuable to you!</p>

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
