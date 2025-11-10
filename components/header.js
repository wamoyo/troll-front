// CSS: styles/components/header.css

import html from '@utils/html.js'
import data from '@data/site.js'

// Front matter
var nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Samples", href: "/samples" },
  { label: "Careers", href: "/careers" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" }
]

// Pure: returns header component with head, body, scripts
export default function header (currentPath) {
  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/header.css">
    `,
    body: html`
      <header class="cp-header">
        <div class="container">
          <div class="logo">
            <a href="/">
              <img src="/images/logo-icon.png" alt="Troll Hair Logo" class="logo-icon">
              <span class="brand"><span class="brand-troll">Troll</span> <span class="brand-hair">Hair</span></span>
            </a>
          </div>
          <nav>
            ${nav.map(item => html`
              <a href="${item.href}" class="${item.href === currentPath ? 'active' : ''}">${item.label}</a>
            `).join('\n            ')}
          </nav>
        </div>
      </header>
    `,
    scripts: html`<script src="/scripts/nav.js"></script>`
  }
}
