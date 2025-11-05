// CSS: styles/pages/about.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import teamCard from '@components/team-card.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `About Us - ${data.site.name}`,
  description: `Learn about ${data.site.company} and the team behind ${data.site.name} carbon nanotube materials.`,
  url: 'https://trollhair.com/about'
}

var pageData = {
  subtitle: 'Pioneering the future of carbon nanotube technology',
  story: {
    heading: 'Our Story',
    intro: `${data.site.company} was founded with a singular mission: to make high-performance carbon nanotube materials accessible to industries that need them most.`,
    mission: 'From aerospace to automotive, our CNT materials are enabling breakthrough innovations in strength, conductivity, and performance.'
  },
  stats: [
    { number: '99.9%', label: 'Purity' },
    { number: '15+', label: 'Years Experience' },
    { number: '500+', label: 'Clients Worldwide' }
  ],
  team: {
    heading: 'Our Team',
    intro: 'World-class scientists and engineers dedicated to advancing CNT technology',
    members: data.team
  },
  cta: {
    heading: `Ready to Experience ${data.site.name}?`,
    text: 'Request a sample and see the difference our CNT materials can make',
    buttonText: 'Get Samples',
    buttonHref: '/contact'
  }
}

// Pure: returns complete about page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/about'
    },
    head: html`
      ${pageSeo(meta).head}
      ${teamCard().head}
      <link rel="stylesheet" href="/styles/pages/about.css">
    `,
    body: html`
      <section id="pg-about">
        <section class="about-hero">
          <div class="container">
            <h1>${meta.title}</h1>
            <p class="subtitle">${pageData.subtitle}</p>
          </div>
        </section>

        <section class="about-story">
          <div class="container">
            <h2>${pageData.story.heading}</h2>
            <p>${pageData.story.intro}</p>
            <p>${pageData.story.mission}</p>

            <div class="stats">
              ${pageData.stats.map(stat => html`
                <div class="stat">
                  <div class="stat-number">${stat.number}</div>
                  <div class="stat-label">${stat.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <section class="team">
          <div class="container">
            <h2>${pageData.team.heading}</h2>
            <p class="section-intro">${pageData.team.intro}</p>

          <div class="team-grid">
              ${pageData.team.members.map(member => teamCard(member).body).join('')}
            </div>
          </div>
        </section>

        <section class="cta">
          <div class="container">
            <h2>${pageData.cta.heading}</h2>
            <p>${pageData.cta.text}</p>
            <a href="${pageData.cta.buttonHref}" class="cta-button">${pageData.cta.buttonText}</a>
          </div>
        </section>
      </section>
    `
  })
}
