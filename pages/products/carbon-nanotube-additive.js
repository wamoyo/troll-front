// CSS: styles/pages/products/product.css

import html from '@utilities/html.js'
import standard from '@layouts/standard.js'
import productSeo from '@components/product-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: 'Carbon Nanotube Additive',
  description: '1mm to 2mm multi-walled carbon nanotubes, prepared for easy mixing into liquids (plastics, epoxies, resins, etc). Every 1% concentration adds 1 gigapascal of tensile strength.',
  url: 'https://trollhair.com/products/carbon-nanotube-additive',
  image: 'https://trollhair.com/images/powered-tubes-800.jpg'
}

var features = [
  {
    title: 'Extreme Strength',
    description: 'Every 1% concentration of our carbon nanotubes adds 1 gigapascal of tensile strength to your composite.'
  },
  {
    title: 'Improved Material Properties',
    description: 'In multiple case studies and tests with various polymers, our carbon nanotubes improve tensile strength and decrease brittleness.'
  },
  {
    title: 'High Conductivity',
    description: 'Our carbon nanotubes have conductivity roughly equivalent to gold.'
  }
]

var downloads = [
  {
    title: 'Technical Data & Spec Sheet',
    filename: 'Technical Data & Spec Sheet - Troll Hair - 1mm to 2mm Carbon Nanotubes.pdf',
    url: '/pdfs/Technical Data & Spec Sheet - Troll Hair - 1mm to 2mm Carbon Nanotubes.pdf'
  },
  {
    title: 'Material Safety Data Sheet (MSDS)',
    filename: 'Material Safety Data Sheet - Troll Hair - Carbon Nanotube Product - March 2025.pdf',
    url: '/pdfs/Material Safety Data Sheet - Troll Hair - Carbon Nanotube Product - March 2025.pdf'
  }
]

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
            <p class="subtitle">1mm to 2mm multi-walled carbon nanotubes, prepared for easy mixing into liquids (plastics, epoxies, resins, etc).</p>
          </div>

          <div class="product-image">
            <img
              src="/images/powered-tubes-400.jpg"
              srcset="/images/powered-tubes-400.jpg 400w, /images/powered-tubes-800.jpg 800w"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Carbon Nanotube Additive - Black powder form"
            >
            <p class="caption">1mm to 2mm multi-walled carbon nanotubes in powder form</p>
          </div>

          <div class="product-content">
            <p class="med"><strong>Every 1% concentration of our carbon nanotubes adds 1 <a href="/resources/carbon-nanotubes-material-of-future/">gigapascal</a> of tensile strength to your composite.</strong></p>

            <p>In multiple case studies and tests with various polymers, our carbon nanotubes improve tensile strength and decrease brittleness.</p>

            <p>Our carbon nanotubes have conductivity roughly equivalent to gold.</p>

            <div class="downloads">
              <a href="/pdfs/Technical Data & Spec Sheet - Troll Hair - 1mm to 2mm Carbon Nanotubes.pdf" class="download-link" download>
                <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Download Technical Data & Spec Sheet PDF
              </a>
              <a href="/pdfs/Material Safety Data Sheet - Troll Hair - Carbon Nanotube Product - March 2025.pdf" class="download-link" download>
                <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Download Material Safety Data Sheet (MSDS) PDF
              </a>
            </div>

            <div class="contact-info">
              <h2>Contact Us For More Info:</h2>
              <p>
                Email: <a href="mailto:info@trollhair.com">info@trollhair.com</a><br>
                Phone: <a href="tel:+12126021401">212-602-1401</a>
              </p>
            </div>

            <footer class="product-footer">
              <a href="/products" class="button secondary">« All Products</a>
              <a href="/samples" class="button primary">Get Samples »</a>
            </footer>
          </div>
        </div>
      </section>
    `
  })
}
