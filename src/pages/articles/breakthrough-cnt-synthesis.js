// CSS: src/styles/layouts/article.css

import html from '@utils/html.js'
import article from '@layouts/article.js'

// Front matter
var meta = {
  title: 'Breakthrough in CNT Synthesis Achieves 99.9% Purity',
  date: '2025-10-15',
  author: 'Dr. Sarah Chen',
  description: 'Our new CVD process has achieved unprecedented purity levels, opening doors for next-generation applications in quantum computing and advanced electronics.',
  url: 'https://trollhair.com/articles/breakthrough-cnt-synthesis'
}

// Pure: returns complete article page
export default function page () {
  return article(meta, {
    body: html`
      <p class="lead">After two years of intensive research, our team has achieved a major breakthrough in carbon nanotube synthesis. By optimizing the chemical vapor deposition (CVD) process with novel catalyst configurations, we've consistently achieved 99.9% purity—the highest in the industry.</p>
      <h2>Why Purity Matters</h2>
      <p>Carbon nanotube purity directly impacts performance in advanced applications. Even trace impurities can disrupt quantum coherence in quantum computing components, introduce noise in ultra-sensitive sensors, and reduce conductivity in next-generation transistors.</p>
      <p>Our 99.9% purity standard means that our CNT materials can now be used in applications that were previously impossible, including:</p>
      <ul>
        <li><strong>Quantum computing components</strong> - Where quantum coherence is critical</li>
        <li><strong>Ultra-sensitive sensors</strong> - For detecting individual molecules or particles</li>
        <li><strong>Next-generation transistors</strong> - Enabling faster, more efficient electronics</li>
        <li><strong>Medical devices</strong> - Where biocompatibility and precision are essential</li>
      </ul>
      <h2>The Key Innovation</h2>
      <p>The breakthrough came from controlling catalyst particle size distribution at the nanometer scale, combined with precisely timed gas flow modulation during the growth phase.</p>
      <p>Traditional CVD processes use static catalyst particles and continuous gas flow. Our innovation introduces dynamic catalyst sizing and pulsed gas delivery, allowing us to control CNT growth with unprecedented precision.</p>
      <h3>The Process</h3>
      <ol>
        <li><strong>Catalyst Preparation</strong> - Nanoscale iron particles are deposited on silicon substrates using atomic layer deposition</li>
        <li><strong>Growth Phase</strong> - Carbon-containing gas (methane) is introduced in carefully timed pulses at 850°C</li>
        <li><strong>Purification</strong> - Post-growth oxidation removes remaining catalyst particles and amorphous carbon</li>
      </ol>
      <h2>Real-World Impact</h2>
      <p>This advancement is already enabling partnerships with leading technology companies in quantum computing and aerospace. One partner reported a 40% improvement in qubit coherence time using our purified CNTs as interconnects.</p>
      <p>We're now working to scale this process for mass production while maintaining the same purity standards. Initial production runs are scheduled for early 2026.</p>
      <h2>What's Next</h2>
      <p>Our research team is exploring additional applications for ultra-pure CNTs, including:</p>
      <ul>
        <li>Transparent conductive films for next-generation displays</li>
        <li>High-efficiency solar cells with CNT-based charge separation layers</li>
        <li>Neural interfaces for medical devices</li>
        <li>Space-rated electronics for satellite systems</li>
      </ul>
      <p>If you're working on applications that require ultra-high purity CNT materials, we'd love to hear from you. <a href="/contact">Contact us</a> to request samples or discuss your project requirements.</p>
    `
  })
}
