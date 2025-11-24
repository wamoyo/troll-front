// CSS: styles/pages/products.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Products - ${data.site.name}`,
  description: 'High-performance carbon nanotube products including additives, infused filaments, and plastic pellets for manufacturing and research.',
  url: 'https://trollhair.com/products'
}

var products = [
  {
    title: 'Carbon Nanotube Additive',
    url: '/products/carbon-nanotube-additive',
    image: '/images/powered-tubes-400.jpg',
    imageSrcset: '/images/powered-tubes-400.jpg 400w, /images/powered-tubes-800.jpg 800w',
    description: 'Pure carbon nanotube powder for mixing into plastics, composites, and other materials.',
    status: 'available'
  },
  {
    title: 'Carbon Nanotube Infused Filament',
    url: '/products/carbon-nanotube-infused-filament',
    image: '/images/cnt-filament-400.jpg',
    imageSrcset: '/images/cnt-filament-400.jpg 400w, /images/cnt-filament-800.jpg 800w',
    description: '3D printing filament infused with carbon nanotubes for ultra-strong prints.',
    status: 'coming-soon'
  },
  {
    title: 'Carbon Nanotube Infused Plastic Pellets',
    url: '/products/carbon-nanotube-infused-plastic-pellets',
    image: '/images/cnt-plasticpellets-400.jpg',
    imageSrcset: '/images/cnt-plasticpellets-400.jpg 400w, /images/cnt-plasticpellets-800.jpg 800w',
    description: 'Ready-to-use plastic pellets infused with carbon nanotubes for injection molding and extrusion.',
    status: 'coming-soon'
  }
]

// Pure: returns complete products index page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/products'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/products.css">
    `,
    body: html`
      <section id="pg-products" class="grid-container">
        <header class="products-header">
          <h1>Products</h1>
          <p class="subtitle">High-performance carbon nanotube materials for manufacturing and research</p>
        </header>

        <div class="products-list width-full">
          ${products.map(product => html`
            <a href="${product.url}" class="product-card">
              <div class="product-image">
                <img
                  src="${product.image}"
                  srcset="${product.imageSrcset}"
                  sizes="(max-width: 768px) 100vw, 400px"
                  alt="${product.title}"
                >
              </div>
              <div class="product-content">
                <h2>${product.title}</h2>
                ${product.status === 'coming-soon' ? html`<span class="status-badge">Coming Soon</span>` : ''}
                <p class="description">${product.description}</p>
                <span class="learn-more">Learn more →</span>
              </div>
            </a>
          `).join('\n')}
        </div>
      </section>
    `
  })
}
