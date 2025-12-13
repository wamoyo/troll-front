// CSS: styles/pages/terms.css

import html from '@utilities/html.js'
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
      <link rel="stylesheet" href="/styles/pages/terms.css">
    `,
    body: html`
      <section id="pg-terms" class="grid-container">
          <h1>Terms & Conditions</h1>

          <p class="effective-date"><strong>Effective Date: November 25th, 2025</strong></p>

          <p>Welcome to Troll Hair (Industrial CNT LLC)! By accessing or using our website, you agree to comply with these Terms and Conditions. Please read them carefully.</p>

          <h2>1. General Information</h2>
          <ul>
            <li>This website is owned and operated by Industrial CNT LLC, specializing in carbon nanotubes and advanced materials.</li>
            <li>By accessing our website, you confirm that you are at least 18 years old or accessing under the supervision of a parent or guardian.</li>
          </ul>

          <h2>2. Products and Services</h2>
          <ul>
            <li><strong>Products:</strong> We market and sell carbon nanotubes and other advanced materials, including offering free samples when applicable.</li>
            <li><strong>Ecommerce:</strong> We may offer products for purchase through our website. Payment processing is handled by secure third-party providers.</li>
            <li>All product descriptions, images, and prices are subject to change without notice. We reserve the right to discontinue any product or service at any time.</li>
          </ul>

          <h2>3. Payment</h2>
          <ul>
            <li>We accept major credit cards and other payment methods for purchases.</li>
            <li>You are responsible for providing accurate billing and shipping information.</li>
          </ul>

          <h2>4. Shipping and Returns</h2>
          <ul>
            <li>Shipping timelines will be provided at checkout. We strive for timely delivery but are not responsible for delays caused by third-party carriers.</li>
            <li>Returns are accepted, in the event of a defective product, within 30 days of purchase, subject to our Return Policy.</li>
          </ul>

          <h2>5. Sample Requests</h2>
          <ul>
            <li>We may provide material samples at our sole discretion. Sample availability, quantity, and pricing (if any) are determined on a case-by-case basis.</li>
            <li>Samples are provided in good faith for evaluation and testing purposes.</li>
            <li>By requesting samples, you agree to review and follow all safety instructions in our Material Safety Data Sheets (MSDS).</li>
            <li>You assume all responsibility for the safe handling, storage, and use of samples. Industrial CNT LLC is not liable for injuries, damages, or losses resulting from sample use.</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>All content, including text, images, videos, podcasts, and articles, is the property of Industrial CNT (Troll Hair) or its licensors. Unauthorized use is prohibited.</p>

          <h2>7. User Conduct</h2>
          <ul>
            <li>You agree not to engage in unlawful, harmful, or disruptive activities on the site.</li>
            <li>We reserve the right to suspend or terminate access to users who violate these terms.</li>
          </ul>

          <h2>8. Third-Party Links</h2>
          <p>Our website may include links to third-party sites, such as social media platforms. We are not responsible for their content or practices.</p>

          <h2>9. Limitation of Liability</h2>
          <p>Industrial CNT LLC (Troll Hair) is not liable for indirect, incidental, or consequential damages arising from the use of our website or products.</p>

          <h2>10. Indemnification</h2>
          <p>You agree to indemnify and hold harmless Industrial CNT LLC from any claims, damages, or expenses arising from your use of our website, products, or samples.</p>

          <h2>11. Dispute Resolution</h2>
          <p>Any disputes arising from these Terms shall first be addressed through good-faith negotiation. If unresolved, disputes will be settled in courts located in New York.</p>

          <h2>12. Governing Law</h2>
          <p>These Terms are governed by the laws of New York.</p>

          <h2>13. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of our site constitutes acceptance of the updated Terms.</p>
      </section>
    `
  })
}
