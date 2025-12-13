// CSS: styles/components/form-message.css

import html from '@utilities/html.js'

// Pure: returns form message component (success or error)
export default function formMessage ({ type, text }) {
  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/form-message.css">
    `,
    body: html`
      <div class="cp-form-message cp-form-message-${type}">
        ${text}
      </div>
    `
  }
}
