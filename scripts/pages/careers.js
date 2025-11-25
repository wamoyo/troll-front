// Careers form submission handling

import { BACKEND } from '/config.js'

var form = document.querySelector('.job-application-form')
var submitButton = form.querySelector('button[type="submit"]')

form.addEventListener('submit', async function (e) {
  e.preventDefault()

  // Clear any existing messages
  clearMessage()

  // Get form data
  var formData = new FormData(form)
  var data = {
    job: formData.get('job'),
    name: formData.get('name'),
    email: formData.get('email'),
    linkedin: formData.get('linkedin'),
    statement: formData.get('statement'),
    website: formData.get('website')
  }

  // Disable submit button
  submitButton.disabled = true
  submitButton.textContent = 'Submitting...'

  try {
    var response = await fetch(`${BACKEND}/careers/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    var result = await response.json()

    if (response.ok) {
      showMessage('success', 'Thank you for your application! We\'ll review it and get back to you soon.')
      form.reset()
      // Hide all job descriptions after form reset
      document.querySelectorAll('.job-description').forEach(function (desc) {
        desc.style.display = 'none'
      })
    } else {
      showMessage('error', result.error || 'Something went wrong. Please try again.')
    }
  } catch (error) {
    showMessage('error', 'Network error. Please check your connection and try again.')
  } finally {
    submitButton.disabled = false
    submitButton.textContent = 'Submit Application'
  }
})

function showMessage (type, text) {
  clearMessage()

  var message = document.createElement('div')
  message.className = `cp-form-message cp-form-message-${type}`
  message.textContent = text

  form.insertBefore(message, submitButton)
}

function clearMessage () {
  var existing = form.querySelector('.cp-form-message')
  if (existing) existing.remove()
}
