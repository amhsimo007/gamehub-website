// GameHub Main Application JavaScript

// Global Variables
let currentUser = null;
let games = [];
let favorites = [];
let currentLanguage = 'en';

// DOM Elements
const elements = {
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    userMenu: document.getElementById('userMenu'),
    userName: document.getElementById('userName'),
    userAvatar: document.getElementById('userAvatar'),
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    gameModal: document.getElementById('gameModal'),
    searchInput: document.getElementById('searchInput'),
    genreFilter: document.getElementById('genreFilter'),
    platformFilter: document.getElementById('platformFilter'),
    gamesGrid: document.getElementById('gamesGrid'),
    featuredGamesGrid: document.getElementById('featuredGamesGrid'),
    favoritesGrid: document.getElementById('favoritesGrid'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    languageSelect: document.getElementById('languageSelect'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data
    loadUserData();
    loadGamesData();
    loadFavorites();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI
    updateUI();
    renderFeaturedGames();
    renderGames();
    
    // Set language
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    console.log('GameHub initialized successfully');
}

function setupEventListeners() {
    // Navigation
    elements.hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Authentication
    elements.loginBtn?.addEventListener('click', () => showModal('loginModal'));
    elements.registerBtn?.addEventListener('click', () => showModal('registerModal'));
    elements.logoutBtn?.addEventListener('click', logout);
    
    // Modal Controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
    
    // Forms
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    
    // Search and Filter
    elements.searchInput?.addEventListener('input', debounce(handleSearch, 300));
    elements.genreFilter?.addEventListener('change', handleFilter);
    elements.platformFilter?.addEventListener('change', handleFilter);
    
    // Load More
    elements.loadMoreBtn?.addEventListener('click', loadMoreGames);
    
    // Language
    elements.languageSelect?.addEventListener('change', handleLanguageChange);
    
    // Auth Switch
    document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('loginModal');
        showModal('registerModal');
    });
    
    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('registerModal');
        showModal('loginModal');
    });
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
}

// User Management
function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function updateUI() {
    if (currentUser) {
        // Show user menu
        elements.userMenu.style.display = 'flex';
        elements.loginBtn.style.display = 'none';
        elements.registerBtn.style.display = 'none';
        
        // Update user info
        elements.userName.textContent = currentUser.name;
        elements.userAvatar.src = currentUser.avatar || 'images/default-avatar.png';
        
        // Update profile
        updateProfile();
    } else {
        // Show auth buttons
        elements.userMenu.style.display = 'none';
        elements.loginBtn.style.display = 'block';
        elements.registerBtn.style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    saveUserData();
    updateUI();
    showToast('Logged out successfully', 'success');
}

// Games Data Management
function loadGamesData() {
    // Sample games data - in a real app, this would come from an API
    games = [
        {
            id: 1,
            title: 'The Legend of Zelda: Tears of the Kingdom',
            genre: 'adventure',
            platform: 'nintendo',
            rating: 4.8,
            image: 'images/zelda.jpg',
            description: 'An epic adventure in the land of Hyrule.',
            releaseDate: '2023-05-12',
            developer: 'Nintendo',
            trailer: 'media/zelda-trailer.mp4'
        },
        {
            id: 2,
            title: 'Elden Ring',
            genre: 'rpg',
            platform: 'pc',
            rating: 4.9,
            image: 'images/elden-ring.jpg',
            description: 'A vast open-world action RPG.',
            releaseDate: '2022-02-25',
            developer: 'FromSoftware',
            trailer: 'media/elden-ring-trailer.mp4'
        },
        {
            id: 3,
            title: 'FIFA 24',
            genre: 'sports',
            platform: 'playstation',
            rating: 4.2,
            image: 'images/fifa24.jpg',
            description: 'The latest football simulation game.',
            releaseDate: '2023-09-29',
            developer: 'EA Sports',
            trailer: 'media/fifa24-trailer.mp4'
        },
        {
            id: 4,
            title: 'Call of Duty: Modern Warfare III',
            genre: 'action',
            platform: 'xbox',
            rating: 4.5,
            image: 'images/cod-mw3.jpg',
            description: 'Intense first-person shooter action.',
            releaseDate: '2023-11-10',
            developer: 'Infinity Ward',
            trailer: 'media/cod-mw3-trailer.mp4'
        },
        {
            id: 5,
            title: 'Candy Crush Saga',
            genre: 'puzzle',
            platform: 'mobile',
            rating: 4.1,
            image: 'images/candy-crush.jpg',
            description: 'Addictive match-3 puzzle game.',
            releaseDate: '2012-04-12',
            developer: 'King',
            trailer: 'media/candy-crush-trailer.mp4'
        },
        {
            id: 6,
            title: 'Civilization VI',
            genre: 'strategy',
            platform: 'pc',
            rating: 4.7,
            image: 'images/civ6.jpg',
            description: 'Build your empire through the ages.',
            releaseDate: '2016-10-21',
            developer: 'Firaxis Games',
            trailer: 'media/civ6-trailer.mp4'
        },
        {
            id: 7,
            title: 'Super Mario Bros. Wonder',
            genre: 'adventure',
            platform: 'nintendo',
            rating: 4.6,
            image: 'images/mario-wonder.jpg',
            description: 'Mario\'s latest magical adventure.',
            releaseDate: '2023-10-20',
            developer: 'Nintendo',
            trailer: 'media/mario-wonder-trailer.mp4'
        },
        {
            id: 8,
            title: 'Baldur\'s Gate 3',
            genre: 'rpg',
            platform: 'pc',
            rating: 4.9,
            image: 'images/bg3.jpg',
            description: 'Epic Dungeons & Dragons RPG.',
            releaseDate: '2023-08-03',
            developer: 'Larian Studios',
            trailer: 'media/bg3-trailer.mp4'
        }
    ];
}

function renderFeaturedGames() {
    const featuredGames = games.slice(0, 3);
    renderGamesList(featuredGames, elements.featuredGamesGrid);
}

function renderGames(gamesToRender = games) {
    renderGamesList(gamesToRender, elements.gamesGrid);
}

function renderGamesList(gamesList, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    gamesList.forEach(game => {
        const gameCard = createGameCard(game);
        container.appendChild(gameCard);
    });
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <img src="${game.image}" alt="${game.title}" onerror="this.src='images/default-game.jpg'">
        <div class="game-card-content">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="game-card-meta">
                <span class="game-genre">${game.genre}</span>
                <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}</span>
                </div>
                <button class="favorite-btn ${isFavorite(game.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${game.id})" 
                        title="${isFavorite(game.id) ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            showGameDetails(game);
        }
    });
    
    return card;
}

function showGameDetails(game) {
    const modalContent = document.getElementById('gameDetails');
    modalContent.innerHTML = `
        <div class="game-details">
            <div>
                <img src="${game.image}" alt="${game.title}" onerror="this.src='images/default-game.jpg'">
                ${game.trailer ? `
                    <video controls style="width: 100%; margin-top: 1rem; border-radius: 8px;">
                        <source src="${game.trailer}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                ` : ''}
            </div>
            <div class="game-info">
                <h2>${game.title}</h2>
                <p><strong>Genre:</strong> ${game.genre}</p>
                <p><strong>Platform:</strong> ${game.platform}</p>
                <p><strong>Rating:</strong> ${game.rating}/5</p>
                <p><strong>Developer:</strong> ${game.developer}</p>
                <p><strong>Release Date:</strong> ${new Date(game.releaseDate).toLocaleDateString()}</p>
                <p>${game.description}</p>
                <div class="game-actions">
                    <button class="btn btn-primary" onclick="toggleFavorite(${game.id})">
                        <i class="fas fa-heart"></i> 
                        ${isFavorite(game.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    <button class="btn btn-secondary" onclick="playGame(${game.id})">
                        <i class="fas fa-play"></i> Play Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal('gameModal');
}

// Search and Filter
function handleSearch() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.genre.toLowerCase().includes(searchTerm)
    );
    renderGames(filteredGames);
}

function handleFilter() {
    const genreFilter = elements.genreFilter.value;
    const platformFilter = elements.platformFilter.value;
    
    let filteredGames = games;
    
    if (genreFilter) {
        filteredGames = filteredGames.filter(game => game.genre === genreFilter);
    }
    
    if (platformFilter) {
        filteredGames = filteredGames.filter(game => game.platform === platformFilter);
    }
    
    renderGames(filteredGames);
}

function loadMoreGames() {
    // In a real app, this would load more games from an API
    showToast('More games coming soon!', 'info');
}

// Favorites Management
function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(gameId) {
    return favorites.includes(gameId);
}

function toggleFavorite(gameId) {
    if (!currentUser) {
        showToast('Please login to add favorites', 'warning');
        return;
    }
    
    const index = favorites.indexOf(gameId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Removed from favorites', 'success');
    } else {
        favorites.push(gameId);
        showToast('Added to favorites', 'success');
    }
    
    saveFavorites();
    renderGames();
    renderFeaturedGames();
    renderFavorites();
    
    // Update game modal if open
    const modal = document.getElementById('gameModal');
    if (modal.style.display === 'block') {
        const game = games.find(g => g.id === gameId);
        if (game) {
            showGameDetails(game);
        }
    }
}

function renderFavorites() {
    const favoriteGames = games.filter(game => favorites.includes(game.id));
    
    if (favoriteGames.length === 0) {
        elements.favoritesGrid.innerHTML = '';
        document.getElementById('noFavoritesMessage').style.display = 'block';
    } else {
        document.getElementById('noFavoritesMessage').style.display = 'none';
        renderGamesList(favoriteGames, elements.favoritesGrid);
    }
}

// Profile Management
function updateProfile() {
    if (!currentUser) return;
    
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileCountry = document.getElementById('profileCountry');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileCountry) profileCountry.textContent = currentUser.country || 'Not specified';
    if (profileAvatar) profileAvatar.src = currentUser.avatar || 'images/default-avatar.png';
    
    // Update stats
    const totalGamesPlayed = document.getElementById('totalGamesPlayed');
    const totalFavorites = document.getElementById('totalFavorites');
    const totalHours = document.getElementById('totalHours');
    
    if (totalGamesPlayed) totalGamesPlayed.textContent = currentUser.gamesPlayed || 0;
    if (totalFavorites) totalFavorites.textContent = favorites.length;
    if (totalHours) totalHours.textContent = currentUser.hoursPlayed || 0;
}

// Game Actions
function playGame(gameId) {
    if (!currentUser) {
        showToast('Please login to play games', 'warning');
        return;
    }
    
    const game = games.find(g => g.id === gameId);
    if (game) {
        // Update user stats
        currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
        currentUser.hoursPlayed = (currentUser.hoursPlayed || 0) + Math.floor(Math.random() * 5) + 1;
        saveUserData();
        updateProfile();
        
        showToast(`Playing ${game.title}!`, 'success');
        
        // In a real app, this would launch the game
        setTimeout(() => {
            showToast(`Thanks for playing ${game.title}!`, 'info');
        }, 3000);
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Mobile Menu
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.hamburger.classList.toggle('active');
}

// Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(26, 32, 44, 0.98)';
    } else {
        header.style.background = 'rgba(26, 32, 44, 0.95)';
    }
}

// Language Management
function handleLanguageChange() {
    const selectedLanguage = elements.languageSelect.value;
    setLanguage(selectedLanguage);
}

function setLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('language', language);
    elements.languageSelect.value = language;
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = translations[language]?.[key];
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = translations[language]?.[key];
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
}

// Utility Functions
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

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Position toast
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Audio Management
function playSound(soundFile) {
    const audio = new Audio(`audio/${soundFile}`);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// Initialize countries for registration
function populateCountries() {
    const countrySelect = document.getElementById('registerCountry');
    if (!countrySelect) return;
    
    const countries = [
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
        'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Russia', 'China', 'Japan',
        'South Korea', 'India', 'Brazil', 'Argentina', 'Mexico', 'Chile', 'Peru', 'Colombia',
        'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Turkey', 'Saudi Arabia', 'UAE',
        'Israel', 'New Zealand', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam', 'Philippines',
        'Indonesia', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar', 'Cambodia', 'Laos'
    ];
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Call this when the register modal is shown
document.getElementById('registerBtn')?.addEventListener('click', () => {
    setTimeout(populateCountries, 100);
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showToast('An error occurred. Please try again.', 'error');
});

// Performance Monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Application loaded in ${loadTime.toFixed(2)}ms`);
});

// Export functions for global access
window.toggleFavorite = toggleFavorite;
window.playGame = playGame;
window.showGameDetails = showGameDetails;
