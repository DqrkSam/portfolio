        // JavaScript to toggle the menu and hamburger animation
        function toggleMenu() {
            const navLinks = document.getElementById('nav-links');
            const hamburger = document.querySelector('.hamburger');
            navLinks.classList.toggle('show');
            hamburger.classList.toggle('open');
        }

        // JavaScript function to show the selected section and highlight the active link
        function showSection(section, element) {
    const sections = document.querySelectorAll('.content-section');
    const profileImage = document.querySelector('.profile-image');
    const nameLocation = document.querySelector('.name-location');

    // Hide all sections
    sections.forEach(function (sec) {
        sec.style.display = 'none';
    });

    // Hide the profile image and name/location when not in home section
    if (section !== 'home') {
        profileImage.classList.add('hidden');
        nameLocation.classList.add('hidden');
    } else {
        profileImage.classList.remove('hidden');
        nameLocation.classList.remove('hidden');
    }

    // Show the clicked section
    const activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // Remove active class from all navigation links and add it to the clicked link
    const navLinks = document.querySelectorAll('#nav-links a');
    navLinks.forEach(function (link) {
        link.classList.remove('active');
    });
    element.classList.add('active');
}

// Ensure the home section is displayed initially
window.onload = function () {
    showSection('home', document.querySelector('#nav-links a'));
};

    // Open the Popup
function openPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex'; // Display the popup
}

// Close the Popup
function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Hide the popup
}