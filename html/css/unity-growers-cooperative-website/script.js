document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Smooth scroll for nav links (Bootstrap's scrollspy handles active states, but this is for smooth scroll with offset)
  document.querySelectorAll('a.nav-link[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault() // Prevent default jump

      const targetId = this.getAttribute('href')
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight
        const offsetTop = targetElement.offsetTop - navbarHeight - 15 // Adjust for fixed navbar and some padding

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })
      }
    })
  })

  // Handle form submission (basic example - integrate with backend for real use)
  const contactForm = document.querySelector('#contact form')
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault() // Prevent default form submission

      // Basic validation
      const name = document.getElementById('contactName').value.trim()
      const email = document.getElementById('contactEmail').value.trim()
      const message = document.getElementById('contactMessage').value.trim()

      if (name === '' || email === '' || message === '') {
        alert('Please fill in all required fields.')
        return
      }

      // In a real application, you would send this data to a server
      console.log('Form Submitted!')
      console.log('Name:', name)
      console.log('Email:', email)
      console.log(
        'Subject:',
        document.getElementById('contactSubject').value.trim()
      )
      console.log('Message:', message)

      alert('Thank you for your message! We will get back to you soon.')
      contactForm.reset() // Clear the form
    })
  }

  // Initialize Bootstrap Carousel if not data-bs-ride="carousel" is used
  // const myCarousel = document.getElementById('storyCarousel')
  // if (myCarousel) {
  //     const carousel = new bootstrap.Carousel(myCarousel, {
  //         interval: 5000, // Slide every 5 seconds
  //         pause: 'hover' // Pause on hover
  //     });
  // }
})
