function toggleMenu() {
    const nav = document.querySelector(".nav");
    const hamburger = document.querySelector(".hamburger");
  
    nav.classList.toggle("active");
    hamburger.classList.toggle("active");
  }
  
  // Close nav when clicking outside of it
  document.addEventListener('click', function (e) {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
  
    const isClickInsideNav = nav.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
  
    // If nav is open and click is outside both nav and hamburger
    if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnHamburger) {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });