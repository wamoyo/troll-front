// CSS: styles/pages/articles/article.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import articleSeo from '@components/article-seo.js'

// Front matter
var meta = {
  title: 'Long Carbon Nanotubes For Composites',
  date: 'November 21, 2024',
  author: 'Troll Hair Team',
  description: 'Exploring the importance of length when using carbon nanotubes in composites to increase strength and toughness.',
  url: 'https://trollhair.com/articles/long-carbon-nanotubes-composites'
}

// Pure: returns complete article page
export default function page () {
  return standard({
    options: {
      currentPath: '/articles'
    },
    head: html`
      ${articleSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/articles/article.css">
    `,
    body: html`
      <article id="pg-article-custom" class="grid-container">
        <header class="article-header">
          <h1>${meta.title}</h1>
          <div class="article-meta">
            <time class="article-date">${meta.date}</time>
            <span class="author">By ${meta.author}</span>
          </div>
        </header>

        <p class="intro">In this article we'll explore the importance of length when using carbon nanotubes in composites to increase strength and toughness.</p>

        <div class="hero-image width-full">
          <img src="/images/short-cnts-pull-out-zoomed.jpg" alt="Carbon nanotubes in composite material under microscope">
        </div>

        <div class="article-content">
          <h2>How do short carbon nanotubes fail?</h2>
          <p>When you pull on a carbon nanotube it will get longer and skinnier. When a carbon nanotube is in a composite and the material is put under tension, the composite, along with the nanotubes are pulled slightly. This will reduce the diameter of the nanotube slightly and may reduce the adhesion to it in the matrix.</p>
          <p>We have tested this and found that nanotubes that are not at least about 100 microns in length pull out of a matrix when under stress. Have a look at the image below.</p>
          <p>Now imagine a long nanotube (1 mm to 2 mm) that wanders back and forth and around other nanotubes and back on itself. It can't pull out. Imagine thousands of long carbon nanotubes in a intertwined mesh, or see the image below. These nanotubes impart all their strength to the matrix, to the composite.</p>
          <p>The other issue is even dispersion. You must get individual nanotubes spread out through a composite material to be effective. Clumps of nanotubes don't work. We have developed a proprietary method to uniformly disperse our nanotubes so the user simply needs to uniformly mix them in. No special equipment required.</p>

          <h2>What kind of composites can be created?</h2>
          <p>We have incorporated our nanotubes directly into high-end epoxies used for composites, plastics for 3D printing, polyurethane, simple white glue, and more. The only thing we've had problems with is pure water, since nanotubes are hydrophobic. Though we do have a trick for that as well if you really need nanotubes in water.</p>
        </div>

        <footer class="article-footer">
          <a href="/articles" class="button secondary">« Back to Articles</a>
          <a href="/samples" class="button primary">Get Samples »</a>
        </footer>
      </article>
    `
  })
}
