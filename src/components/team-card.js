// CSS: src/styles/components/team-card.css

import html from '../utils/html.js'

// Pure: returns team member card
// Parameters: name, title, bio, image
function teamCard ({ name, title, bio, image }) {
  return html`<div class="cp-team-card">
  <link rel="stylesheet" href="/styles/components/team-card.css">
  <div class="image">
    <img src="${image}" alt="${name}">
  </div>
  <div class="content">
    <h3>${name}</h3>
    <p class="title">${title}</p>
    <p class="bio">${bio}</p>
  </div>
</div>`
}

export default teamCard
