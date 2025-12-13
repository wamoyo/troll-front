// CSS: styles/pages/privacy.css

import html from '@utilities/html.js'
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
      <link rel="stylesheet" href="/styles/pages/privacy.css">
    `,
    body: html`
      <section id="pg-privacy" class="grid-container">
          <h1>Privacy Policy</h1>

          <p class="effective-date"><strong>Effective Date: November 25th, 2025</strong></p>

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
            <li>We share your payment information with secure third-party payment processors (e.g., <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>) to complete transactions.</li>
            <li>We may share data with service providers that assist in operations (e.g., shipping, hosting).</li>
            <li>We do not sell or rent your personal data to third parties.</li>
          </ul>

          <h2>4. Cookies and Tracking</h2>
          <ul>
            <li>We do not use tracking cookies or analytics tools.</li>
            <li>We use essential cookies only for authentication purposes when you log in to your account.</li>
            <li>We honor Do Not Track (DNT) browser signals.</li>
          </ul>

          <h2>5. Social Media and Third-Party Links</h2>
          <ul>
            <li>Interactions with our social media pages (e.g., comments, likes) are governed by the privacy policies of the respective platforms.</li>
            <li>Third-party links on our site are not covered by this Privacy Policy.</li>
          </ul>

          <h2>6. Security</h2>
          <p>We implement industry-standard measures to protect your personal information. However, no online system is completely secure.</p>

          <h2>7. Your Rights</h2>
          <ul>
            <li>You may request access, correction, or deletion of your personal data by contacting us at <a href="mailto:info@trollhair.com" target="_blank" rel="noopener noreferrer">info@trollhair.com</a>.</li>
            <li>You can opt-out of marketing emails by clicking "unsubscribe" in our communications.</li>
          </ul>

          <h2>8. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, maintain business records, and comply with legal obligations.</p>

          <h2>9. International Users</h2>
          <ul>
            <li>Our services are operated from the United States. If you are located outside the U.S., your information will be transferred to and processed in the U.S.</li>
            <li>We do not use tracking cookies, so no cookie consent is required under GDPR. You may request access to or deletion of your data at any time.</li>
          </ul>

          <h2>10. California Privacy Rights</h2>
          <ul>
            <li>California residents have the right to know what personal information we collect and how it is used.</li>
            <li>You may request deletion of your personal data.</li>
            <li>We do not sell personal information to third parties.</li>
            <li>To exercise these rights, contact us at <a href="mailto:info@trollhair.com" target="_blank" rel="noopener noreferrer">info@trollhair.com</a>.</li>
          </ul>

          <h2>11. Children's Privacy</h2>
          <p>Our website is not intended for children under 13. We do not knowingly collect personal information from children.</p>

          <h2>12. Changes to Privacy Policy</h2>
          <p>We may update this policy periodically. Changes will be posted on this page with an updated effective date.</p>

          <h2>13. Contact Information</h2>
          <p>For questions about this policy, contact us at <a href="mailto:info@trollhair.com" target="_blank" rel="noopener noreferrer">info@trollhair.com</a> or call <a href="tel:+12126021401">(212) 602-1401</a>.</p>
      </section>
    `
  })
}
