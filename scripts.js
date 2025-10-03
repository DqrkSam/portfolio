// Anti-copy protection
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  alert('Sorry, right-click is disabled for content protection!');
});

document.addEventListener('keydown', function(e) {
  // Prevent Ctrl+Shift+I (Chrome DevTools)
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
    e.preventDefault();
  }
  // Prevent Ctrl+U (View Source)
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault();
  }
  // Prevent Ctrl+S (Save)
  if (e.ctrlKey && e.keyCode === 83) {
    e.preventDefault();
  }
});

// Disable text selection
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
});

// Console warning
console.log('%c⚠️ Stop!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cThis is a protected website. All actions are being monitored.', 'color: red; font-size: 16px;');

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Loading overlay
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.style.opacity = '0';
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
  }, 500);
});

// Typed.js initialization
var typed = new Typed('#typed', {
  strings: ['Web Developer', 'UI Designer', 'Problem Solver'],
  typeSpeed: 70,
  backSpeed: 50,
  loop: true,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// All other existing JavaScript code... 