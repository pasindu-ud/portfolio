/* =====================================================
   NAVIGATION TOGGLE
   ===================================================== */

let currentCategoryFilter = 'all';
let currentSearchTerm = '';
let currentSortBy = 'date';

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

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

/* =====================================================
   FILTER BY CATEGORY
   ===================================================== */

function filterByCategory(category) {
    currentCategoryFilter = category;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });

    applyFiltersAndSort();
}

/* =====================================================
   SEARCH FUNCTIONALITY
   ===================================================== */

function searchUpdates(searchTerm) {
    currentSearchTerm = searchTerm.toLowerCase();
    applyFiltersAndSort();
}

/* =====================================================
   SORT FUNCTIONALITY
   ===================================================== */

function sortBy(sortType) {
    currentSortBy = sortType;

    // Update active sort button
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    applyFiltersAndSort();
}

/* =====================================================
   APPLY FILTERS AND SORT
   ===================================================== */

function applyFiltersAndSort() {
    const updateCards = Array.from(document.querySelectorAll('.update-card'));
    let visibleCards = [];

    // Filter cards
    updateCards.forEach(card => {
        const category = card.dataset.category;
        const searchText = card.dataset.searchText || '';

        const categoryMatch = currentCategoryFilter === 'all' || category === currentCategoryFilter;
        const searchMatch = currentSearchTerm === '' || searchText.includes(currentSearchTerm);

        if (categoryMatch && searchMatch) {
            card.classList.remove('hidden');
            visibleCards.push(card);
        } else {
            card.classList.add('hidden');
        }
    });

    // Sort visible cards
    visibleCards.sort((a, b) => {
        if (currentSortBy === 'date') {
            // Sort by date (newest first)
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return dateB - dateA;
        } else if (currentSortBy === 'engagement') {
            // Sort by engagement (most engaged first)
            const engA = parseInt(a.dataset.engagement) || 0;
            const engB = parseInt(b.dataset.engagement) || 0;
            return engB - engA;
        }
        return 0;
    });

    // Reorder cards in the DOM
    const grid = document.querySelector('.updates-grid');
    visibleCards.forEach(card => {
        grid.appendChild(card);
    });

    updateResultsCount(visibleCards.length);
}

/* =====================================================
   UPDATE RESULTS COUNT
   ===================================================== */

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (count === 0) {
        resultsCount.textContent = 'No updates found';
        resultsCount.style.color = 'var(--accent-gold)';
    } else if (count === 1) {
        resultsCount.textContent = 'Showing 1 update';
        resultsCount.style.color = 'var(--text-muted)';
    } else {
        resultsCount.textContent = `Showing ${count} updates`;
        resultsCount.style.color = 'var(--text-muted)';
    }
}

/* =====================================================
   CAROUSEL FUNCTIONALITY
   ===================================================== */

function moveSlide(button, direction) {
    const card = button.closest('.update-card');
    const carousel = card.querySelector('.media-carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');

    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    // Remove active class from current slide and dot
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    // Calculate new index
    currentIndex += direction;

    // Wrap around
    if (currentIndex >= slides.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    }

    // Add active class to new slide and dot
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');

    // Update carousel position
    const carouselInner = carousel.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function goToSlide(dot, index) {
    const carousel = dot.closest('.media-carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    if (currentIndex === index) return;

    // Remove active class from all
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Add active class to selected
    slides[index].classList.add('active');
    dots[index].classList.add('active');

    // Update carousel position
    const carouselInner = carousel.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${index * 100}%)`;
}

// Auto-play carousel (optional - uncomment to enable)
function autoPlayCarousels() {
    const carousels = document.querySelectorAll('.media-carousel');

    carousels.forEach(carousel => {
        setInterval(() => {
            const nextButton = carousel.querySelector('.carousel-btn.next');
            moveSlide(nextButton, 1);
        }, 5000); // Change slide every 5 seconds
    });
}

// Start auto-play when page loads
document.addEventListener('DOMContentLoaded', autoPlayCarousels);

/* =====================================================
   BACK TO TOP BUTTON
   ===================================================== */

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
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

document.querySelectorAll('.update-card').forEach(card => {
    observer.observe(card);
});

/* =====================================================
   KEYBOARD NAVIGATION FOR CAROUSEL
   ===================================================== */

document.addEventListener('keydown', (e) => {
    const activeCarousel = document.querySelector('.update-card:hover .media-carousel');
    if (!activeCarousel) return;

    if (e.key === 'ArrowLeft') {
        const prevButton = activeCarousel.querySelector('.carousel-btn.prev');
        moveSlide(prevButton, -1);
    } else if (e.key === 'ArrowRight') {
        const nextButton = activeCarousel.querySelector('.carousel-btn.next');
        moveSlide(nextButton, 1);
    }
});

/* =====================================================
   TOUCH SWIPE SUPPORT FOR CAROUSEL
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Hide carousel controls for single slide carousels
    document.querySelectorAll('.media-carousel').forEach(carousel => {
        const slideCount = parseInt(carousel.dataset.slides) || carousel.querySelectorAll('.carousel-slide').length;

        if (slideCount === 1) {
            // Hide navigation buttons and dots for single slide
            carousel.querySelectorAll('.carousel-btn').forEach(btn => {
                btn.style.display = 'none';
            });
            carousel.querySelectorAll('.carousel-dots').forEach(dots => {
                dots.style.display = 'none';
            });
        }
    });

    const carousels = document.querySelectorAll('.media-carousel');

    carousels.forEach(carousel => {
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(carousel);
        });

        function handleSwipe(carousel) {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - go to next
                    const nextButton = carousel.querySelector('.carousel-btn.next');
                    moveSlide(nextButton, 1);
                } else {
                    // Swipe right - go to previous
                    const prevButton = carousel.querySelector('.carousel-btn.prev');
                    moveSlide(prevButton, -1);
                }
            }
        }
    });

    // Apply initial sort
    applyFiltersAndSort();
});

// Update the footer with the current year
document.getElementById('footer-year').textContent = new Date().getFullYear().toString();
