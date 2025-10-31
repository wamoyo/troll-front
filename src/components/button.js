// CSS: src/styles/components/button.css

import html from '../utils/html.js'

// Pure: returns button component
// Parameters: text, href, style (primary/secondary)
function button ({ text, href, style = 'primary' }) {
  return html`<a href="${href}" class="cp-button ${style}">
  <link rel="stylesheet" href="/styles/components/button.css">
  ${text}
</a>`
}

export default button
