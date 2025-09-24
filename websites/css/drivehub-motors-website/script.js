document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Mobile menu toggle functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button')
  const closeMobileMenuButton = document.getElementById('close-mobile-menu')
  const mobileMenu = document.getElementById('mobile-menu')
  const mobileNavLinks = mobileMenu.querySelectorAll('a')

  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden')
    mobileMenu.classList.add('flex') // Ensure it's flex for centering
  })

  closeMobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.add('hidden')
    mobileMenu.classList.remove('flex')
  })

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileMenu.classList.contains('hidden')) {
        // Check if menu is open
        mobileMenu.classList.add('hidden')
        mobileMenu.classList.remove('flex')
      }
    })
  })

  // Optional: Smooth scroll for navigation links, with offset for fixed header
  // Tailwind's `scroll-smooth` utility on the `<html>` element handles basic smooth scrolling.
  // This part is more for advanced control or adding an active state.
  const headerHeight = document.querySelector('header').offsetHeight // Get dynamic header height

  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const targetId = this.getAttribute('href')
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight - 20 // Subtract header height + some padding

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })

        // Remove active class from all nav links
        document
          .querySelectorAll('nav a')
          .forEach((link) => link.classList.remove('text-white', 'font-bold'))
        // Add active class to clicked link
        this.classList.add('text-white', 'font-bold')
      }
    })
  })

  // Highlight active nav link on scroll (Optional, Tailwind handles this with `scroll-spy` in frameworks, but manual for CDN)
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('nav a')

  const handleScrollSpy = () => {
    const scrollY = window.pageYOffset
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight
      const sectionTop = current.offsetTop - headerHeight - 30 // Adjusted for header and some buffer
      const sectionId = current.getAttribute('id')

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('text-white', 'font-bold')
          link.classList.add('text-gray-300') // Reset to default grey
          if (link.getAttribute('href').includes(sectionId)) {
            link.classList.add('text-white', 'font-bold')
            link.classList.remove('text-gray-300')
          }
        })
      }
    })
  }

  window.addEventListener('scroll', handleScrollSpy)
  // Call on load to set initial active state
  handleScrollSpy()
})
