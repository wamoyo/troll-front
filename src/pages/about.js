// CSS: src/styles/pages/about.css

import html from '../utils/html.js'
import standardLayout from '../layouts/standard.js'
import header from '../components/header.js'
import footer from '../components/footer.js'
import seo from '../components/seo.js'
import teamCard from '../components/team-card.js'
import button from '../components/button.js'
import data from '../../data.js'

// Pure: returns complete about page HTML
function page () {
  // Generate team cards from data
  var teamCards = data.team.map(member =>
    teamCard({
      name: member.name,
      title: member.title,
      bio: member.bio,
      image: member.image
    })
  ).join('\n        ')

  return standardLayout({
    head: html`
      <title>About ${data.site.name} - Meet Our Team</title>
      <meta name="description" content="Learn about ${data.site.company} and the team behind ${data.site.name} carbon nanotube materials.">

      ${seo({
        type: 'website',
        title: `About ${data.site.name}`,
        description: `Meet the team at ${data.site.company} creating the future of carbon nanotube materials`,
        url: `${data.site.url}/about`,
        image: '/images/about-og.jpg'
      })}

      <link rel="stylesheet" href="/styles/pages/about.css">
    `,
    body: html`
      ${header('/about')}

      <section id="pg-about">
        <section class="about-hero">
          <div class="container">
            <h1>About ${data.site.name}</h1>
            <p class="subtitle">Pioneering the future of carbon nanotube technology</p>
          </div>
        </section>

        <section class="about-story">
          <div class="container">
            <h2>Our Story</h2>
            <p>${data.site.company} was founded with a singular mission: to make high-performance carbon nanotube materials accessible to industries that need them most.</p>
            <p>From aerospace to automotive, our CNT materials are enabling breakthrough innovations in strength, conductivity, and performance.</p>

            <div class="stats">
              <div class="stat">
                <div class="stat-number">99.9%</div>
                <div class="stat-label">Purity</div>
              </div>
              <div class="stat">
                <div class="stat-number">15+</div>
                <div class="stat-label">Years Experience</div>
              </div>
              <div class="stat">
                <div class="stat-number">500+</div>
                <div class="stat-label">Clients Worldwide</div>
              </div>
            </div>
          </div>
        </section>

        <section class="team">
          <div class="container">
            <h2>Our Team</h2>
            <p class="section-intro">World-class scientists and engineers dedicated to advancing CNT technology</p>

            <div class="team-grid">
              ${teamCards}
            </div>
          </div>
        </section>

        <section class="cta">
          <div class="container">
            <h2>Ready to Experience ${data.site.name}?</h2>
            <p>Request a sample and see the difference our CNT materials can make</p>
            <div class="cta-buttons">
              ${button({ text: 'Get Samples', href: '/contact', style: 'primary' })}
              ${button({ text: 'View Products', href: '/products', style: 'secondary' })}
            </div>
          </div>
        </section>
      </section>

      ${footer()}
    `
  })
}

export default page
