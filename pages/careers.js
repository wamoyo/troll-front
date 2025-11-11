// CSS: styles/pages/careers.css

import html from '@utils/html.js'
import standard from '@layouts/standard.js'
import pageSeo from '@components/page-seo.js'
import data from '@data/site.js'

// Front matter
var meta = {
  title: `Careers - ${data.site.name}`,
  description: 'Join our team and help craft Earth\'s strongest materials. We\'re looking for talented engineers and business people to join our rapidly growing startup.',
  url: 'https://trollhair.com/careers'
}

var jobs = [
  {
    id: 'manufacturing-operator',
    title: 'Front Line Manufacturing Operator',
    priority: 'Safely and efficiently operate production system',
    description: 'The Front Line Manufacturing Operator is fundamentally a safety first role. The job is to safely and efficiently operate the production system to produce our high strength materials and fulfill customer demand.',
    metrics: 'Consistency, attention to detail, production rate.'
  },
  {
    id: 'customer-success',
    title: 'Customer Success Manager',
    priority: 'Ensure our customers succeed with our products',
    description: 'The Customer Success Manager is responsible for helping our customers succeed in implementing our materials in their use cases. These will be injection molders, 3D printers, plastics makers, and other manufacturers serving the aerospace, automotive, and other industries. You\'ll need to support our customers over the phone/Zoom, with on site visits at their locations, possibly with CAD (SolidWorks), and more.',
    metrics: 'Success rate getting from samples to first purchases and repeat purchase rates.'
  },
  {
    id: 'brand-manager',
    title: 'Brand Manager',
    priority: 'Generate Inbound Leads',
    description: 'The Brand Manager must embody the mission of our company, be a passionate communicator, and the face of our brand. They must be more excited and enthusiastic about carbon nanotubes and high strength materials than anyone else on the team. They also have to be able to do the hard, detailed work of building an epic brand online and with relevant industry events and communities. They must have or quickly acquire the needed technical expertise.',
    metrics: 'Increasing monthly inbound leads with lowest cost per lead possible'
  },
  {
    id: 'sales-leader',
    title: 'Sales Team Leader',
    priority: 'Turn leads into closed deals.',
    description: 'The sales team leader is responsible for turning leads into closed deals, at first by doing sales themselves, and as we grow by hiring and managing a team of sales reps. This sales job requires technical expertise in the plastics industry (injection molding, 3D printing, extrusion, etc).',
    metrics: 'Rising closed deal rate, scale, and decreasing costs and time-to-close.'
  }
]

// Pure: returns complete careers page HTML
export default function page () {
  return standard({
    options: {
      currentPath: '/careers'
    },
    head: html`
      ${pageSeo(meta).head}
      <link rel="stylesheet" href="/styles/pages/careers.css">
    `,
    body: html`
      <section id="pg-careers">
        <div class="container-medium">
          <h1>Careers</h1>

          <section class="intro">
            <p><strong>Troll Hair</strong> is receiving tremendous demand from the marketplace for our high strength carbon nanotube based materials. We're a fully funded tech startup growing rapidly, and we're looking to recruit talented, hard working, competent engineers and business people.</p>
            <p class="tagline"><em>Join our team and help craft Earth's strongest materials!</em></p>
          </section>

          <section class="process">
            <ol>
              <li>View the open listings below.</li>
              <li>Contact Constantinos at <a href="mailto:costa@trollhair.com" target="_blank">costa@trollhair.com</a> or on <a href="https://linkedin.com/in/costamichailidis" target="_blank" rel="noopener">LinkedIn</a> with questions.</li>
              <li>Submit an application with the form below.</li>
            </ol>
          </section>

          <section class="philosophy">
            <p>At Troll Hair we are building our organization for massive scale and impact.</p>
            <p>As such, the job descriptions are extremely focused, each with a singular top priority and a few high level metrics of success.</p>
            <p>Every job contributes to growth, and we expect candidates to be hyper focused on driving growth through their roles.</p>
            <p>We are a team of extremely mission driven, passionate, material science and startup business nerds. We get really excited about the nitty gritty details. Make sure to tell us why you'd be a great fit for our team in your application. We aim to fill the company with extremely smart, capable individuals and mold them into an incredibly high performing team that will do nothing short of crafting literally the strongest materials on Earth and beyond. Be certain to tell us how you can contribute to that, what unique competence you bring to the team.</p>
            <p><strong>Alright, let's go!</strong></p>
            <p>Select the position you're interested in and complete the form below. And, please share this web page with friends and colleagues suited for the roles.</p>
            <p class="compensation"><em>Compensation is, of course, very competitive.</em></p>
          </section>
        </div>

        <div class="container-medium">
          <section class="job-listings">
            <h2>Apply For A Job</h2>

            <form class="job-application-form" action="/api/careers" method="post">
              <div class="form-group">
                <label for="job-select">Select a Job</label>
                <select id="job-select" name="job" required>
                  <option value="">Select a Job</option>
                  ${jobs.map(job => html`
                    <option value="${job.id}">${job.title}</option>
                  `).join('\n                  ')}
                </select>
              </div>

              <div id="job-descriptions">
                ${jobs.map(job => html`
                  <div class="job-description" data-job="${job.id}" style="display: none;">
                    <h3>${job.title}</h3>
                    <p class="job-priority"><strong>Top Priority »</strong> ${job.priority}</p>
                    <p class="job-detail">${job.description}</p>
                    <p class="job-metrics"><strong>Metrics of Success »</strong> ${job.metrics}</p>
                  </div>
                `).join('\n                ')}
              </div>

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Name" required>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" required>
              </div>

              <div class="form-group">
                <label for="linkedin">LinkedIn Or Website Link</label>
                <input type="url" id="linkedin" name="linkedin" placeholder="LinkedIn Or Website Link">
              </div>

              <div class="form-group">
                <label for="statement">Application Statement</label>
                <textarea id="statement" name="statement" rows="8" placeholder="Application Statement" required></textarea>
              </div>

              <button type="submit" class="submit-button">Submit Application</button>
            </form>
          </section>
        </div>
      </section>
    `,
    scripts: html`
      <script>
        // Show job description when job is selected
        var jobSelect = document.getElementById('job-select');
        var jobDescriptions = document.querySelectorAll('.job-description');

        jobSelect.addEventListener('change', function() {
          var selectedJob = this.value;

          jobDescriptions.forEach(function(desc) {
            if (desc.dataset.job === selectedJob) {
              desc.style.display = 'block';
            } else {
              desc.style.display = 'none';
            }
          });
        });
      </script>
    `
  })
}
