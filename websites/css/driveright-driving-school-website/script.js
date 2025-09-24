document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Optional: Add active class to navbar links on scroll for highlighting
  // Bootstrap's scrollspy often handles this, but a custom script can fine-tune
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link')
  const sections = document.querySelectorAll('section')

  window.addEventListener('scroll', () => {
    let current = ''
    sections.forEach((section) => {
      const sectionTop =
        section.offsetTop - document.querySelector('.navbar').offsetHeight // Adjust for fixed navbar
      const sectionHeight = section.clientHeight
      if (
        pageYOffset >= sectionTop &&
        pageYOffset < sectionTop + sectionHeight
      ) {
        current = section.getAttribute('id')
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove('active')
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active')
      }
    })
  })

  // Close mobile nav when a link is clicked
  const navbarToggler = document.querySelector('.navbar-toggler')
  const navbarCollapse = document.getElementById('navbarNav')

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click() // Programmatically click the toggler to close the menu
      }
    })
  })
})
