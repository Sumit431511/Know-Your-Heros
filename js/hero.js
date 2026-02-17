// Hero detail page JavaScript
let heroData = null;

// Initialize the hero detail page
document.addEventListener('DOMContentLoaded', function() {
    loadHeroDetail();
});

// Load and display hero details
async function loadHeroDetail() {
    try {
        showLoading();
        
        // Get hero ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const heroId = urlParams.get('id');
        
        if (!heroId) {
            showError();
            return;
        }
        
        // Load heroes data
        const response = await fetch('data/heroes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const heroesData = await response.json();
        
        // Find the specific hero
        heroData = heroesData.find(hero => hero.id == heroId);
        
        if (!heroData) {
            showError();
            return;
        }
        
        // Display hero details
        displayHeroDetails(heroData);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading hero details:', error);
        showError();
        hideLoading();
    }
}

// Display hero details in organized sections
function displayHeroDetails(hero) {
    // Update page title
    document.title = `${hero.name} - Know Your Heroes`;
    
    // Hero image
    const heroImage = document.getElementById('heroImage');
    const heroImageSrc = hero.image && hero.image !== '' 
        ? `images/${hero.image}` 
        : 'https://images.pexels.com/photos/8828546/pexels-photo-8828546.jpeg?auto=compress&cs=tinysrgb&w=400&h=400';
    
    heroImage.src = heroImageSrc;
    heroImage.alt = hero.name;
    
    // Basic information
    document.getElementById('heroName').textContent = hero.name;
    document.getElementById('heroRank').textContent = `${hero.rank}, ${hero.regiment}`;
    
    // Award badge
    const awardElement = document.getElementById('heroAward');
    awardElement.innerHTML = `<i class="fas fa-medal me-1"></i>${hero.award}`;
    
    // Personal details
    document.getElementById('heroBirth').textContent = hero.dateOfBirth || 'Not available';
    document.getElementById('heroDeath').textContent = hero.dateOfDeath || 'Not available';
    document.getElementById('heroAge').textContent = hero.age || 'Not available';
    document.getElementById('heroHometown').textContent = hero.hometown || hero.state;
    document.getElementById('heroState').textContent = hero.state;
    document.getElementById('heroRegiment').textContent = hero.regiment;
    
    // War information
    document.getElementById('heroWar').textContent = hero.war;
    document.getElementById('heroBattleLocation').textContent = hero.battleLocation || 'Various locations';
    document.getElementById('heroYear').textContent = hero.year;
    
    // Biography
    document.getElementById('heroFullStory').textContent = hero.fullStory;
    
    // Additional information
    document.getElementById('heroFamily').textContent = hero.familyBackground || 'Information not available';
    document.getElementById('heroEducation').textContent = hero.education || 'Information not available';
    document.getElementById('heroMotto').textContent = hero.motto || 'Duty, Honor, Country';
    
    // Show the content
    document.getElementById('heroDetailContent').style.display = 'block';
}

// Show loading indicator
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('heroDetailContent').style.display = 'none';
}

// Hide loading indicator
function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

// Show error message
function showError() {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('heroDetailContent').style.display = 'none';
}