// CSS: styles/components/footer.css

import html from '@utilities/html.js'
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
          <p class="social">Connect with us on <a href="${data.social.linkedin}" target="_blank" rel="noopener"><img src="/images/linkedin-icon.svg" alt="LinkedIn Icon" class="linkedin-icon">LinkedIn</a></p>
          <p class="copyright">&copy; ${new Date().getFullYear()} Copyright ${data.site.company}</p>
          <p class="legal">
            <a href="/terms">Terms &amp; Conditions</a> |
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </footer>
    `
  }
}
