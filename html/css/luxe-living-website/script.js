document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle')
  const mainNav = document.getElementById('main-nav')
  const navLinks = mainNav.querySelectorAll('.nav-list a')

  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active')
    navToggle.classList.toggle('active') // Optional: for animating the hamburger icon
  })

  // Close mobile nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active')
        navToggle.classList.remove('active')
      }
    })
  })

  // Smooth scrolling for anchor links with offset
  // The `html { scroll-behavior: smooth; }` in CSS provides basic smooth scrolling.
  // This JS is for handling a fixed header offset for anchor links.
  const header = document.querySelector('.main-header')
  const headerHeight = header.offsetHeight // Get dynamic header height

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault() // Prevent default jump behavior

      const targetId = this.getAttribute('href')
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight - 20 // Subtract header height + a little padding

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    })
  })

  // Optional: Add active class to nav links on scroll (more advanced for pure CSS)
  const sections = document.querySelectorAll('section[id]')
  const navListLinks = document.querySelectorAll('.main-nav .nav-list a')

  const setActiveNavLink = () => {
    const scrollY = window.pageYOffset

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight
      const sectionTop = current.offsetTop - headerHeight - 30 // Adjust for header and a buffer
      const sectionId = current.getAttribute('id')

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navListLinks.forEach((link) => {
          link.classList.remove('active')
          if (link.getAttribute('href').includes(sectionId)) {
            link.classList.add('active')
          }
        })
      }
    })
  }

  window.addEventListener('scroll', setActiveNavLink)
  // Call on load to set initial active state
  setActiveNavLink()
})
