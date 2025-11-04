// CSS: src/styles/components/footer.css

import html from '@utils/html.js'
import data from '@data/site.js'

// Pure: returns footer component with head, body
export default function footer () {
  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/footer.css">
    `,
    body: html`
      <footer class="cp-footer">
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} ${data.site.company}. All rights reserved.</p>
          <p class="tagline">${data.site.tagline}</p>
        </div>
      </footer>
    `
  }
}
