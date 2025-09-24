document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Close mobile nav when a link is clicked
  const navbarToggler = document.querySelector('.navbar-toggler')
  const navbarCollapse = document.getElementById('navbarNav')
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link')

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click() // Programmatically click the toggler to close the menu
      }
    })
  })

  // Optional: Add active class to navbar links on scroll (Bootstrap's scrollspy often handles this, but a custom script can fine-tune)
  const sections = document.querySelectorAll('section[id]') // Select all sections with an ID

  window.addEventListener('scroll', () => {
    let current = ''
    const scrollY = window.pageYOffset

    sections.forEach((section) => {
      const sectionTop =
        section.offsetTop - document.querySelector('.navbar').offsetHeight - 20 // Adjust for fixed navbar + a little buffer
      const sectionHeight = section.clientHeight

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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
})
