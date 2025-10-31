// CSS: src/styles/layouts/standard.css

import html from '../utils/html.js'

// Pure: takes head and body slots, returns complete HTML document
function standard ({ head, body }) {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Base layout styles -->
  <link rel="stylesheet" href="/styles/layouts/standard.css">

  <!-- Page-specific head content -->
  ${head}
</head>
<body id="ly-standard">
  ${body}
</body>
</html>`
}

export default standard
