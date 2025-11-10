// CSS: styles/pages/legal.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Terms & Conditions - ${data.site.name}`,
  description: 'Terms and Conditions for Troll Hair (Industrial CNT LLC). Read our terms of service for using our website and purchasing our products.',
  url: 'https://trollhair.com/terms'
}

// Pure: returns complete terms page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/terms'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/legal.css">
    `,
    body: html`
      <section id="pg-legal">
        <div class="container">
          <h1>Terms & Conditions</h1>

          <p class="effective-date"><strong>Effective Date: December 1st 2024</strong></p>

          <p>Welcome to Troll Hair (Industrial CNT LLC)! By accessing or using our website, you agree to comply with these Terms and Conditions. Please read them carefully.</p>

          <h2>1. General Information</h2>
          <ul>
            <li>This website is owned and operated by Industrial CNT LLC, specializing in carbon nanotubes and advanced materials.</li>
            <li>By accessing our website, you confirm that you are at least 18 years old or accessing under the supervision of a parent or guardian.</li>
          </ul>

          <h2>2. Products and Services</h2>
          <ul>
            <li><strong>Products:</strong> We market and sell carbon nanotubes and other advanced materials, including offering free samples when applicable.</li>
            <li><strong>Ecommerce:</strong> We use Shopify to process transactions. By making a purchase, you agree to Shopify's Terms of Service and Privacy Policy.</li>
            <li>All product descriptions, images, and prices are subject to change without notice. We reserve the right to discontinue any product or service at any time.</li>
          </ul>

          <h2>3. Payment</h2>
          <ul>
            <li>We accept major credit cards for purchases, in addition other other payment methods. All payment information is securely processed by Shopify.</li>
            <li>You are responsible for providing accurate billing and shipping information.</li>
          </ul>

          <h2>4. Shipping and Returns</h2>
          <ul>
            <li>Shipping timelines will be provided at checkout. We strive for timely delivery but are not responsible for delays caused by third-party carriers.</li>
            <li>Returns are accepted, in the event of a defective product, within 30 days of purchase, subject to our Return Policy.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <ul>
            <li>All content, including text, images, videos, podcasts, and articles, is the property of Industrial CNT (Troll Hair) or its licensors. Unauthorized use is prohibited.</li>
          </ul>

          <h2>6. User Conduct</h2>
          <ul>
            <li>You agree not to engage in unlawful, harmful, or disruptive activities on the site.</li>
            <li>We reserve the right to suspend or terminate access to users who violate these terms.</li>
          </ul>

          <h2>7. Third-Party Links</h2>
          <ul>
            <li>Our website may include links to third-party sites, such as social media platforms. We are not responsible for their content or practices.</li>
          </ul>

          <h2>8. Limitation of Liability</h2>
          <ul>
            <li>Industrial CNT LLC (Troll Hair) is not liable for indirect, incidental, or consequential damages arising from the use of our website or products.</li>
          </ul>

          <h2>9. Governing Law</h2>
          <ul>
            <li>These Terms are governed by the laws of New York. Any disputes shall be resolved in courts located in New York.</li>
          </ul>

          <h2>10. Changes to Terms</h2>
          <ul>
            <li>We may update these Terms at any time. Continued use of our site constitutes acceptance of the updated Terms.</li>
          </ul>
        </div>
      </section>
    `
  })
}
