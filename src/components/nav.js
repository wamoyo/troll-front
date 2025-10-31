// CSS: None (styled by parent header component)

import html from '../utils/html.js'
import data from '../../data.js'

// Pure: returns navigation links
// currentPath parameter highlights active page
function nav (currentPath = '/') {
  var links = data.nav.map(item => {
    var isActive = item.href === currentPath
    var className = isActive ? 'active' : ''
    return html`<a href="${item.href}" class="${className}">${item.label}</a>`
  }).join('\n      ')

  return html`<nav>
      ${links}
    </nav>`
}

export default nav
