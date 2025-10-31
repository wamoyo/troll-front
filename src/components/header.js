// CSS: src/styles/components/header.css

import html from '../utils/html.js'
import nav from './nav.js'
import data from '../../data.js'

// Pure: returns header HTML with navigation
// currentPath parameter passed to nav for active highlighting
function header (currentPath = '/') {
  return html`<header class="cp-header">
  <link rel="stylesheet" href="/styles/components/header.css">
  <div class="container">
    <div class="logo">
      <a href="/">
        <span class="brand">${data.site.name}</span>
      </a>
    </div>
    ${nav(currentPath)}
  </div>
</header>`
}

export default header
