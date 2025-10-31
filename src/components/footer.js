// CSS: src/styles/components/footer.css

import html from '../utils/html.js'
import data from '../../data.js'

// Pure: returns footer HTML
function footer () {
  var year = new Date().getFullYear()

  return html`<footer class="cp-footer">
  <link rel="stylesheet" href="/styles/components/footer.css">
  <div class="container">
    <p>&copy; ${year} ${data.site.company}. All rights reserved.</p>
    <p class="tagline">${data.site.tagline}</p>
  </div>
</footer>`
}

export default footer
