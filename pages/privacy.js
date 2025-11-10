// CSS: styles/pages/legal.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Privacy Policy - ${data.site.name}`,
  description: 'Privacy Policy for Troll Hair (Industrial CNT LLC). Learn how we collect, use, and protect your personal information.',
  url: 'https://trollhair.com/privacy'
}

// Pure: returns complete privacy page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/privacy'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/legal.css">
    `,
    body: html`
      <section id="pg-legal">
        <div class="container">
          <h1>Privacy Policy</h1>

          <p class="effective-date"><strong>Effective Date: December 1st 2024</strong></p>

          <p>Troll Hair (Industrial CNT LLC) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share your data.</p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> Name, email, phone number, billing and shipping address, and payment details when you make a purchase.</li>
            <li><strong>Optional Information:</strong> Information you provide in inquiries, demo requests, or sample orders.</li>
            <li><strong>Automatic Information:</strong> IP address, browser type, and usage data when you visit our site.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfill orders.</li>
            <li>To provide customer support.</li>
            <li>To improve our website, content, and services.</li>
            <li>To send marketing communications, if you opt-in.</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <ul>
            <li>We share your payment information with Shopify for order processing.</li>
            <li>We may share data with service providers that assist in operations (e.g., shipping, hosting).</li>
            <li>We do not sell or rent your personal data to third parties.</li>
          </ul>

          <h2>4. Cookies and Tracking</h2>
          <ul>
            <li>Our website may use cookies to enhance user experience. You can control cookie settings in your browser.</li>
            <li>We currently do not use Google Analytics but may implement analytics tools in the future to improve our site.</li>
          </ul>

          <h2>5. Social Media and Third-Party Links</h2>
          <ul>
            <li>Interactions with our social media pages (e.g., comments, likes) are governed by the privacy policies of the respective platforms.</li>
            <li>Third-party links on our site are not covered by this Privacy Policy.</li>
          </ul>

          <h2>6. Security</h2>
          <ul>
            <li>We implement industry-standard measures to protect your personal information. However, no online system is completely secure.</li>
          </ul>

          <h2>7. Your Rights</h2>
          <ul>
            <li>You may request access, correction, or deletion of your personal data by contacting us at <a href="mailto:info@trollhair.com">info@trollhair.com</a>.</li>
            <li>You can opt-out of marketing emails by clicking "unsubscribe" in our communications.</li>
          </ul>

          <h2>8. Children's Privacy</h2>
          <ul>
            <li>Our website is not intended for children under 13. We do not knowingly collect personal information from children.</li>
          </ul>

          <h2>9. Changes to Privacy Policy</h2>
          <ul>
            <li>We may update this policy periodically. Changes will be posted on this page with an updated effective date.</li>
          </ul>

          <h2>10. Contact Information</h2>
          <ul>
            <li>For questions about this policy, contact us at:</li>
            <li>Email: <a href="mailto:info@trollhair.com">info@trollhair.com</a></li>
            <li>Phone: <a href="tel:+12126021401">212-602-1401</a></li>
          </ul>
        </div>
      </section>
    `
  })
}
