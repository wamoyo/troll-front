// CSS: styles/pages/about.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `About Us - ${data.site.name}`,
  description: 'We created Troll Hair to bring the world\'s strongest material, carbon nanotubes, out of the lab and into the marketplace.',
  url: 'https://trollhair.com/about'
}

var team = [
  {
    name: 'Brad Edwards',
    linkedin: 'https://www.linkedin.com/in/drbradedwards/',
    bio: 'is our founder and CEO. He was commissioned by NASA to conduct the original feasibility study on the Space Elevator. Here he is on <a href="https://www.bloomberg.com/news/articles/2022-02-17/building-a-space-elevator-may-be-getting-closer-to-reality" target="_blank" rel="noopener">Bloomberg</a>. This project set him on a path to study and innovate the manufacturing and application of carbon nanotubes with...'
  },
  {
    name: 'Rick Beed',
    linkedin: 'https://www.linkedin.com/in/rick-beed-379722119/',
    bio: ', our chief engineer. Rick is a prolific engineer. He has worked on autonomous underwater drones, a variety of state-of-the-art sensors and tools, and dozens of applications of carbon nanotubes including for the F35 stealth aircraft.'
  },
  {
    name: 'Lee Nolan',
    linkedin: 'https://www.linkedin.com/in/leland-nolan-803451/',
    bio: 'is our Chief Operations Officer. Lee has built companies across Europe and the US, gone public on NASDAQ, and leads the effort to expand our business to serve an array of industries.'
  },
  {
    name: 'Constantinos Michailidis',
    linkedin: 'https://www.linkedin.com/in/costamichailidis/',
    bio: 'is our Chief Revenue Officer. An AI expert and scientific innovation consultant, Constantinos serves as a champion for our customers, here to make sure our business adds as much value to yours as possible.'
  }
]

// Pure: returns complete about page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/about'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/about.css">
    `,
    body: html`
      <section id="pg-about" class="grid-container">
        <h1>About Us</h1>

        <p>We created Troll Hair here at Industrial CNT with the purpose of bringing the world's strongest material, <a href="/articles/carbon-nanotubes-material-of-future">carbon nanotubes</a>, out of the lab and into the marketplace.</p>

        <p class="spec-highlight"><strong>Troll Hair clocks in at over 100 gigapascals of tensile strength.</strong></p>
        <p>That's roughly 27 times stronger than Kevlar (carbon fiber). This signals a transformational shift and enables entirely new use cases. Imagine stronger construction materials, dramatically lighter vehicles, new space craft, and more.</p>

        <h2>Our Team</h2>
        ${team.map(member => html`
          <p><a href="${member.linkedin}" target="_blank" rel="noopener">${member.name}</a> ${member.bio}</p>
        `).join('\n        ')}

        <p>We cannot wait to see what you can build with our incredible new material! Learn all about it in <a href="/articles">our articles</a>, or visit <a href="/products">our shop</a>.</p>
      </section>
    `
  })
}
