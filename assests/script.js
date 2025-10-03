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

  // Set the initial volume of the background music
  const audioElement = document.getElementById('background-music');
  audioElement.volume = 0.5; // Set the volume to 20% of the max volume (0.0 - 1.0)

  const customCursor = document.getElementById("custom-cursor");

document.addEventListener("mousemove", (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
});