// CSS: styles/components/team-card.css

import html from '@utilities/html.js'

// Pure: returns team member card component with head and body
export default function teamCard ({ name = '', title = '', bio = '', image = '' } = {}) {
  return {
    head: html`
      <link rel="stylesheet" href="/styles/components/team-card.css">
    `,
    body: html`
      <div class="cp-team-card">
        <div class="image">
          <img src="${image}" alt="${name}">
        </div>
        <div class="content">
          <h3>${name}</h3>
          <p class="title">${title}</p>
          <p class="bio">${bio}</p>
        </div>
      </div>
    `
  }
}
