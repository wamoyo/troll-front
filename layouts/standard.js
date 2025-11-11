// CSS: styles/layouts/standard.css

import html from '@utils/html.js'
import header from '@components/header.js'
import footer from '@components/footer.js'

// Pure: takes options and slots, returns complete HTML document with header/footer
export default function standard ({ options = {}, head, body, scripts }) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width">
      <link rel="shortcut icon" href="/images/favicon.ico">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/styles/layouts/standard.css">
      ${header().head}
      ${footer().head}
      ${head || ''}
    </head>
    <body id="ly-standard">
      ${header(options.currentPath).body}
      <main class="main-content">
        ${body || ''}
      </main>
      ${footer().body}

      <!-- Scripts -->
      ${header().scripts}
      ${scripts || ''}
    </body>
    </html>
  `
}
