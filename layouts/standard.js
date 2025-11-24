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
      <meta name="theme-color" content="#000000">

      <!-- Favicons -->
      <link rel="icon" type="image/png" sizes="16x16" href="/images/icon-16.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/images/icon-32.png">
      <link rel="icon" type="image/png" sizes="192x192" href="/images/icon-192.png">
      <link rel="icon" type="image/png" sizes="512x512" href="/images/icon-512.png">
      <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
      <link rel="shortcut icon" href="/favicon.ico">
      <link rel="manifest" href="/manifest.json">

      <link rel="stylesheet" href="/styles/site.css">
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
