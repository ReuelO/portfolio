document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Handle contact form submission (basic client-side example)
  const contactForm = document.getElementById('contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault() // Prevent default form submission

      // Basic validation
      const name = document.getElementById('name').value.trim()
      const email = document.getElementById('email').value.trim()
      const subject = document.getElementById('subject').value.trim()
      const message = document.getElementById('message').value.trim()

      if (name === '' || email === '' || subject === '' || message === '') {
        alert('Please fill in all required fields.')
        return
      }

      // In a real application, you would send this data to a server
      console.log('Form Submitted!')
      console.log('Name:', name)
      console.log('Email:', email)
      console.log('Phone:', document.getElementById('phone').value.trim())
      console.log('Subject:', subject)
      console.log('Message:', message)

      alert('Thank you for your inquiry! We will get back to you soon.')
      contactForm.reset() // Clear the form
    })
  }

  // Intersection Observer for scroll animations (reusing pattern from previous tasks)
  const animatedElements = document.querySelectorAll('.animate__animated')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          // Optional: stop observing once visible
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  )

  animatedElements.forEach((element) => {
    observer.observe(element)
  })
})
