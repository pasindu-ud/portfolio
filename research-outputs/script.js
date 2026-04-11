/* =====================================================
   NAVIGATION TOGGLE
   ===================================================== */

let currentTypeFilter = 'all';
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
   FILTER BY TYPE
   ===================================================== */

function filterByType(type) {
    currentTypeFilter = type;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.type === type) {
            tab.classList.add('active');
        }
    });

    applyFiltersAndSort();
}

/* =====================================================
   SEARCH FUNCTIONALITY
   ===================================================== */

function searchResearch(searchTerm) {
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
    const researchItems = Array.from(document.querySelectorAll('.research-item'));
    let visibleItems = [];

    // Filter items
    researchItems.forEach(item => {
        const type = item.dataset.type;
        const searchText = item.dataset.searchText || '';

        // const typeMatch = currentTypeFilter === 'all' || type === currentTypeFilter;
        const types = (type || '').split(' ');
        const typeMatch = currentTypeFilter === 'all' || types.includes(currentTypeFilter);
        const searchMatch = currentSearchTerm === '' || searchText.includes(currentSearchTerm);

        if (typeMatch && searchMatch) {
            item.classList.remove('hidden');
            visibleItems.push(item);
        } else {
            item.classList.add('hidden');
        }
    });

    // Sort visible items
    visibleItems.sort((a, b) => {
        if (currentSortBy === 'date') {
            // Sort by year (newest first)
            const yearA = parseInt(a.dataset.year);
            const yearB = parseInt(b.dataset.year);
            if (yearB !== yearA) return yearB - yearA;

            // Same year → sort by month (newest first)
            const monthA = parseInt(a.dataset.month) || 0;
            const monthB = parseInt(b.dataset.month) || 0;
            return monthB - monthA;
        } else if (currentSortBy === 'title') {
            // Sort by title (A-Z)
            const titleA = a.querySelector('.research-title').textContent.toLowerCase();
            const titleB = b.querySelector('.research-title').textContent.toLowerCase();
            return titleA.localeCompare(titleB);
        } else if (currentSortBy === 'citations') {
            // Sort by citations (highest first)
            const citA = parseInt(a.dataset.citations) || 0;
            const citB = parseInt(b.dataset.citations) || 0;
            return citB - citA;
        }
        return 0;
    });

    // Reorder items in the DOM
    const grid = document.querySelector('.research-grid');
    visibleItems.forEach(item => {
        grid.appendChild(item);
    });

    updateResultsCount(visibleItems.length);
}

/* =====================================================
   UPDATE RESULTS COUNT
   ===================================================== */

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (count === 0) {
        resultsCount.textContent = 'No research outputs found';
        resultsCount.style.color = 'var(--accent-gold)';
    } else if (count === 1) {
        resultsCount.textContent = 'Showing 1 research output';
        resultsCount.style.color = 'var(--text-muted)';
    } else {
        resultsCount.textContent = `Showing ${count} research outputs`;
        resultsCount.style.color = 'var(--text-muted)';
    }
}

/* =====================================================
   CITATION FUNCTIONALITY
   ===================================================== */

function showCitation(button) {
    const researchItem = button.closest('.research-item');
    const citationBox = researchItem.querySelector('.citation-box');

    if (citationBox.style.display === 'none' || citationBox.style.display === '') {
        citationBox.style.display = 'block';
        button.querySelector('span:last-child').textContent = 'Hide Citation';
    } else {
        citationBox.style.display = 'none';
        button.querySelector('span:last-child').textContent = 'Cite';
    }
}

function switchCitation(tab, format) {
    const citationBox = tab.closest('.citation-box');

    // Update active tab
    citationBox.querySelectorAll('.citation-tab').forEach(t => {
        t.classList.remove('active');
    });
    tab.classList.add('active');

    // Show corresponding citation text
    citationBox.querySelectorAll('.citation-text').forEach(text => {
        text.classList.remove('active');
        if (text.classList.contains(format)) {
            text.classList.add('active');
        }
    });
}

function copyCitation(button) {
    const citationBox = button.closest('.citation-box');
    const activeCitation = citationBox.querySelector('.citation-text.active');
    const citationText = activeCitation.textContent;

    // Copy to clipboard
    navigator.clipboard.writeText(citationText).then(() => {
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.background = 'var(--accent-teal)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'var(--accent-gold)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy citation:', err);
        alert('Failed to copy citation. Please select and copy manually.');
    });
}

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

document.querySelectorAll('.research-item').forEach(item => {
    observer.observe(item);
});

/* =====================================================
   INITIALIZE ON PAGE LOAD
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Apply initial sort
    applyFiltersAndSort();
});

// Update the footer with the current year
document.getElementById('footer-year').textContent = new Date().getFullYear().toString();

/* =====================================================
   On page load, scroll to the anchored item and highlight it
   ===================================================== */
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        const el = document.querySelector(hash);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                el.style.transition = 'box-shadow 0.3s';
                el.style.boxShadow = '0 0 0 3px var(--accent, #e4a853)';
                setTimeout(() => el.style.boxShadow = '', 2000);
            }, 300);
        }
    }
});