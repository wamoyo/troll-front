// CSS: styles/pages/article-custom.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import articleSeo from '@components/article-seo.js'

// Front matter
var meta = {
  title: 'Carbon Nanotubes: The Material Of The Future',
  date: 'November 21, 2024',
  author: 'Troll Hair Team',
  description: 'Carbon nanotubes (CNTs) are tubular molecules of carbon with incredible properties, including immense tensile strength, conduction, chemical resistance, and more.',
  url: 'https://trollhair.com/articles/carbon-nanotubes-material-of-future'
}

// Pure: returns complete article page
export default function page () {
  return standard({
    options: {
      currentPath: '/articles'
    },
    head: html`
      ${articleSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/article-custom.css">
    `,
    body: html`
      <article id="pg-article-custom">
        <div class="hero-image">
          <img src="/images/tubes-bg.png" alt="Carbon nanotube molecular structure visualization">
        </div>

        <div class="container">
          <header class="article-header">
            <h1>${meta.title}</h1>
            <time class="article-date">${meta.date}</time>
            <button class="share-button">Share</button>
          </header>

          <div class="article-content">
            <h2>What are carbon nanotubes?</h2>
            <p>Carbon nanotubes (CNTs) are tubular molecules of carbon. They are a few nanometers up to hundreds of nanometers in diameter–1000 times smaller than a hair. Their chemical structure gives them incredible properties, including immense tensile strength, conduction or EM sheilding, chemial resistance, and more.</p>
            <p>Bulk nanotubes have been produced in extremely short lengths and individual nanotubes have been made up to 55 cm (about 19 inches) in length. We are creating long, strong carbon nanotubes from 1 mm up to 2 cm, and developing continuous spun threads made of CNTs.</p>

            <h2>What are their impressive features?</h2>
            <p>First, they're strong, really strong! Because of their structure, they are the strongest material that can be made. Tens of times stronger than any other material we have.</p>
            <p>Carbon nanotubes have high chemical resistance. CNTs are cylindrical crystals, perfect, with no loose ends. This means they are chemically very inert, they are unaffected by most chemicals.</p>
            <p>However, these qualities also mean that they are slippery, chemicals don't bond to them or stick to them. To use CNTs without damaging their unique properties, techniques other than chemical must be used.</p>
            <p>In addition, CNTs can be conductive or non-conducting depending on the specific arrangement of carbon atoms in the molecule.</p>

            <h2>What kind of improvements can be made with carbon nanotubes?</h2>
            <p>In most composite structures the epoxy matrix is the weakest component. By adding even a small amount (&lt;1%) of our CNTs to the epoxy for a composite structure the overall strength and stiffness can be improved dramatically. Our customers have seen improvements in overall composite stiffness of 25% when 0.1% CNTs are added to the epoxy.</p>
            <p>In brittle plastics, a small fraction of our CNTs (&lt;1%) has been shown to eliminate the brittleness entirely and a flexible, almost unbreakable plastic results.</p>
            <p>An almost single layer of our CNTs laid out on a surface can create an EMF barrier. This has been done at our lab on a sparse web of carbon fibers.</p>
            <p>These incremental improvements would dramatically improve airplanes, recreational equipment, autos, and more.</p>

            <h2>What kind of entirely new things become possible with long, strong carbon nanotubes?</h2>
            <p>We like this question.</p>
            <p>Carbon nanotubes enable the Space Elevator, which is why our founder, Dr. Bradley Edwards, originally began his work on CNTs.</p>
            <p>Large, long-duration airships become possible. These are basically small cities on blimps floating above the clouds.</p>
            <p>CNTs enable city-sized, inflatable space stations, large tensile structures, even entire cities under a single protective tent. Not to mention the world's best golf clubs, tennis rackets, and sailboats.</p>
          </div>

          <footer class="article-footer">
            <a href="/articles" class="back-link">Back to articles</a>
          </footer>
        </div>
      </article>
    `
  })
}
