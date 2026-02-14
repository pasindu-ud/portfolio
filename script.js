/* =====================================================
   NAVIGATION TOGGLE
   ===================================================== */

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    navLinks.classList.toggle('active');
    
    const spans = mobileMenu.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
});
