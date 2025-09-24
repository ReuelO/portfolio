document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year')
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }

  // Mobile menu toggle functionality
  const menuToggle = document.getElementById('menu-toggle')
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay')
  const closeMenu = document.getElementById('close-menu')
  const mobileNavLinks = document.querySelectorAll(
    '.mobile-nav a[data-close-menu]'
  )

  if (menuToggle && mobileMenuOverlay && closeMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenuOverlay.classList.add('active')
      document.body.classList.add('overflow-hidden') // Prevent body scroll
    })

    const hideMobileMenu = () => {
      mobileMenuOverlay.classList.remove('active')
      document.body.classList.remove('overflow-hidden') // Allow body scroll
    }

    closeMenu.addEventListener('click', hideMobileMenu)

    // Close menu when a link is clicked
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', hideMobileMenu)
    })
  }

  // Smooth scrolling for anchor links (CSS scroll-behavior does most, but JS can add fallback)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const targetId = this.getAttribute('href')
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Adjust scroll position to account for fixed header
        const headerOffset = document.querySelector('.main-header').offsetHeight
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementPosition - headerOffset - 20 // 20px extra padding

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    })
  })
})
