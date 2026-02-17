// Global variables
let heroesData = [];
let filteredHeroes = [];

// DOM elements
const heroesGrid = document.getElementById('heroesGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const warFilter = document.getElementById('warFilter');
const stateFilter = document.getElementById('stateFilter');
const awardFilter = document.getElementById('awardFilter');
const clearFiltersBtn = document.getElementById('clearFilters');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Only load heroes if we're on the heroes page
    if (window.location.pathname.includes('heroes.html') || document.getElementById('heroesGrid')) {
        loadHeroes();
        setupEventListeners();
    }
});

// Load heroes data from JSON file
async function loadHeroes() {
    try {
        showLoading();
        const response = await fetch('data/heroes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        heroesData = await response.json();
        filteredHeroes = [...heroesData];
        
        populateFilters();
        displayHeroes(filteredHeroes);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading heroes data:', error);
        showError('Failed to load heroes data. Please try again later.');
        hideLoading();
    }
}

// Populate filter dropdowns
function populateFilters() {
    const wars = [...new Set(heroesData.map(hero => hero.war))].sort();
    const states = [...new Set(heroesData.map(hero => hero.state))].sort();
    const awards = [...new Set(heroesData.map(hero => hero.award))].sort();
    
    populateSelect(warFilter, wars);
    populateSelect(stateFilter, states);
    populateSelect(awardFilter, awards);
}

// Helper function to populate select elements
function populateSelect(selectElement, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// Display heroes in the grid
function displayHeroes(heroes) {
    if (!heroesGrid) return;
    
    if (heroes.length === 0) {
        heroesGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    heroesGrid.style.display = 'flex';
    noResults.style.display = 'none';
    
    heroesGrid.innerHTML = heroes.map(hero => createHeroCard(hero)).join('');
    
    // Add fade-in animation
    const cards = heroesGrid.querySelectorAll('.hero-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Create individual hero card HTML
function createHeroCard(hero) {
    const heroImage = hero.image && hero.image !== '' 
        ? `images/${hero.image}` 
        : 'https://images.pexels.com/photos/8828546/pexels-photo-8828546.jpeg?auto=compress&cs=tinysrgb&w=300&h=200';
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card hero-card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${heroImage}" alt="${hero.name}" class="hero-avatar me-3" 
                             style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid var(--saffron);">
                        <div>
                            <h5 class="card-title mb-0">${hero.name}</h5>
                            <small class="text-muted">${hero.year}</small>
                        </div>
                    </div>
                    
                    <div class="hero-info mb-3">
                        <p class="mb-2">
                            <i class="fas fa-map-marker-alt text-primary me-2"></i>
                            <strong>State:</strong> ${hero.state}
                        </p>
                        <p class="mb-2">
                            <i class="fas fa-shield-alt text-success me-2"></i>
                            <strong>War:</strong> ${hero.war}
                        </p>
                        <p class="mb-2">
                            <i class="fas fa-users text-info me-2"></i>
                            <strong>Regiment:</strong> ${hero.regiment}
                        </p>
                    </div>
                    
                    <div class="award-badge mb-3">
                        <i class="fas fa-medal me-1"></i>
                        ${hero.award}
                    </div>
                    
                    <p class="card-text text-muted">
                        ${hero.shortStory}
                    </p>
                    
                    <div class="d-grid mt-auto">
                        <a href="hero.html?id=${hero.id}" class="btn btn-primary">
                            <i class="fas fa-book-open me-2"></i>
                            Read Full Story
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterHeroes, 300));
    }
    
    if (warFilter) {
        warFilter.addEventListener('change', filterHeroes);
    }
    
    if (stateFilter) {
        stateFilter.addEventListener('change', filterHeroes);
    }
    
    if (awardFilter) {
        awardFilter.addEventListener('change', filterHeroes);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Filter heroes based on search and filter criteria
function filterHeroes() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const warValue = warFilter ? warFilter.value : '';
    const stateValue = stateFilter ? stateFilter.value : '';
    const awardValue = awardFilter ? awardFilter.value : '';
    
    filteredHeroes = heroesData.filter(hero => {
        const matchesSearch = searchTerm === '' || 
            hero.name.toLowerCase().includes(searchTerm) ||
            hero.shortStory.toLowerCase().includes(searchTerm) ||
            hero.fullStory.toLowerCase().includes(searchTerm);
        
        const matchesWar = warValue === '' || hero.war === warValue;
        const matchesState = stateValue === '' || hero.state === stateValue;
        const matchesAward = awardValue === '' || hero.award === awardValue;
        
        return matchesSearch && matchesWar && matchesState && matchesAward;
    });
    
    displayHeroes(filteredHeroes);
    updateResultsCount();
}

// Clear all filters
function clearAllFilters() {
    if (searchInput) searchInput.value = '';
    if (warFilter) warFilter.value = '';
    if (stateFilter) stateFilter.value = '';
    if (awardFilter) awardFilter.value = '';
    
    filteredHeroes = [...heroesData];
    displayHeroes(filteredHeroes);
    updateResultsCount();
}

// Update results count (if element exists)
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${filteredHeroes.length} of ${heroesData.length} heroes`;
    }
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show loading indicator
function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    if (heroesGrid) {
        heroesGrid.style.display = 'none';
    }
    if (noResults) {
        noResults.style.display = 'none';
    }
}

// Hide loading indicator
function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    if (heroesGrid) {
        heroesGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Error:</strong> ${message}
                </div>
            </div>
        `;
        heroesGrid.style.display = 'flex';
    }
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);