document.addEventListener('DOMContentLoaded', () => {
  /**
   * Define Global Variables
   */
  const navbarList = document.getElementById('navbar__list');
  const sections = document.querySelectorAll('section');
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.textContent = 'Top';
  scrollToTopBtn.classList.add('scroll-to-top');
  document.body.appendChild(scrollToTopBtn);

  let isScrolling;
  let prevScrollPos = window.pageYOffset;

  /**
   * End Global Variables
   * Start Helper Functions
   */

  /**
   * Create a navigation item for each section.
   * @param {HTMLElement} section - The section element.
   * @returns {HTMLElement} navItem - The created navigation item.
   */
  const createNavItem = (section) => {
    const navItem = document.createElement('li');
    const anchor = document.createElement('a');

    anchor.textContent = section.getAttribute('data-nav');
    anchor.href = `#${section.id}`;
    anchor.classList.add('menu__link');

    navItem.appendChild(anchor);
    return navItem;
  };

  /**
   * End Helper Functions
   * Begin Main Functions
   */

  /**
   * Build the navigation menu.
   */
  const buildNav = () => {
    const fragment = document.createDocumentFragment();
    sections.forEach(section => {
      const navItem = createNavItem(section);
      fragment.appendChild(navItem);
    });
    navbarList.appendChild(fragment);
  };

  /**
   * Smooth scroll to section on navigation link click.
   * @param {Event} event - The click event.
   */
  const scrollToSection = (event) => {
    event.preventDefault();
    if (event.target.tagName === 'A') {
      const targetSection = document.querySelector(event.target.getAttribute('href'));
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Add 'active' class to section when near top of viewport.
   */
  const makeActive = () => {
    sections.forEach(section => {
      const box = section.getBoundingClientRect();
      if (box.top <= 150 && box.bottom >= 150) {
        section.classList.add('active-class');
        document.querySelector(`a[href="#${section.id}"]`).classList.add('active');
        console.log(`Added active class to ${section.id}`);
      } else {
        section.classList.remove('active-class');
        document.querySelector(`a[href="#${section.id}"]`).classList.remove('active');
        console.log(`Removed active class from ${section.id}`);
      }
    });
  };

  /**
   * Debounce function to limit the rate at which a function can fire.
   */
  const debounce = (func, wait) => {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  /**
   * Handle scroll events.
   */
  const handleScroll = debounce(() => {
    // Show or hide navbar based on scroll direction
    const currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      document.querySelector('.navbar__menu').classList.remove('navbar__hidden');
    } else {
      document.querySelector('.navbar__menu').classList.add('navbar__hidden');
    }
    prevScrollPos = currentScrollPos;

    // Show or hide the scroll-to-top button based on scroll position
    if (window.pageYOffset > window.innerHeight) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }

    // Clear timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      document.querySelector('.navbar__menu').classList.add('navbar__hidden');
    }, 2000);

    makeActive();
  }, 100); // Adjust the debounce wait time as needed

  /**
   * Scroll to the top of the page.
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Toggle section content visibility on header click.
   * @param {Event} event - The click event.
   */
  const toggleSection = (event) => {
    if (event.target.classList.contains('section__header')) {
      const sectionContent = event.target.nextElementSibling;
      sectionContent.style.display = sectionContent.style.display === 'none' ? 'block' : 'none';
    }
  };

  /**
   * End Main Functions
   * Begin Events
   */

  // Build menu
  buildNav();

  // Scroll to section on link click
  navbarList.addEventListener('click', scrollToSection);

  // Set sections as active
  window.addEventListener('scroll', handleScroll);

  // Scroll to top on button click
  scrollToTopBtn.addEventListener('click', scrollToTop);

  // Toggle section content visibility on header click
  sections.forEach(section => {
    const header = section.querySelector('h2');
    header.classList.add('section__header');
    header.addEventListener('click', toggleSection);
  });

  // Initial activation of sections in view
  makeActive();
});
