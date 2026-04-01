// GameHub Games Management JavaScript

// Extended Games Database
let allGames = [];
let displayedGames = [];
let gamesPerPage = 8;
let currentPage = 1;
let isLoading = false;

// Game Categories and Filters
const gameCategories = {
    action: { name: 'Action', icon: 'fa-fist-raised', color: '#ef4444' },
    adventure: { name: 'Adventure', icon: 'fa-compass', color: '#10b981' },
    rpg: { name: 'RPG', icon: 'fa-dragon', color: '#8b5cf6' },
    strategy: { name: 'Strategy', icon: 'fa-chess', color: '#3b82f6' },
    sports: { name: 'Sports', icon: 'fa-football-ball', color: '#f59e0b' },
    puzzle: { name: 'Puzzle', icon: 'fa-puzzle-piece', color: '#ec4899' },
    simulation: { name: 'Simulation', icon: 'fa-globe', color: '#14b8a6' },
    racing: { name: 'Racing', icon: 'fa-car', color: '#f97316' }
};

const platforms = {
    pc: { name: 'PC', icon: 'fa-desktop' },
    playstation: { name: 'PlayStation', icon: 'fa-gamepad' },
    xbox: { name: 'Xbox', icon: 'fa-xbox' },
    nintendo: { name: 'Nintendo', icon: 'fa-cube' },
    mobile: { name: 'Mobile', icon: 'fa-mobile-alt' }
};

// Initialize Games
function initializeGames() {
    loadExtendedGamesData();
    setupGameFilters();
    setupGameSearch();
    setupSorting();
}

function loadExtendedGamesData() {
    // Extended games database with more detailed information
    allGames = [
        {
            id: 1,
            title: 'The Legend of Zelda: Tears of the Kingdom',
            genre: 'adventure',
            platform: 'nintendo',
            rating: 4.8,
            image: 'images/zelda.jpg',
            description: 'An epic adventure in the land of Hyrule with new abilities and vast exploration.',
            longDescription: 'Embark on an expansive adventure in the world of Hyrule. Discover new abilities, solve puzzles, and explore floating islands in this groundbreaking sequel to Breath of the Wild.',
            releaseDate: '2023-05-12',
            developer: 'Nintendo',
            publisher: 'Nintendo',
            trailer: 'media/zelda-trailer.mp4',
            screenshots: ['images/zelda-1.jpg', 'images/zelda-2.jpg', 'images/zelda-3.jpg'],
            features: ['Open World', 'Puzzle Solving', 'Combat', 'Exploration'],
            price: 69.99,
            tags: ['fantasy', 'open-world', 'nintendo-exclusive'],
            players: 'Single Player',
            ageRating: 'E10+',
            size: '16GB',
            languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese']
        },
        {
            id: 2,
            title: 'Elden Ring',
            genre: 'rpg',
            platform: 'pc',
            rating: 4.9,
            image: 'images/elden-ring.jpg',
            description: 'A vast open-world action RPG from FromSoftware.',
            longDescription: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
            releaseDate: '2022-02-25',
            developer: 'FromSoftware',
            publisher: 'Bandai Namco',
            trailer: 'media/elden-ring-trailer.mp4',
            screenshots: ['images/elden-ring-1.jpg', 'images/elden-ring-2.jpg'],
            features: ['Open World', 'Souls-like Combat', 'Character Customization', 'Multiplayer'],
            price: 59.99,
            tags: ['dark-fantasy', 'challenging', 'multiplayer'],
            players: 'Single Player, Multiplayer',
            ageRating: 'M',
            size: '60GB',
            languages: ['English', 'French', 'Italian', 'German', 'Spanish', 'Japanese', 'Korean']
        },
        {
            id: 3,
            title: 'FIFA 24',
            genre: 'sports',
            platform: 'playstation',
            rating: 4.2,
            image: 'images/fifa24.jpg',
            description: 'The latest football simulation game with enhanced graphics.',
            longDescription: 'Experience the next generation of football gaming with FIFA 24, featuring advanced physics, realistic player movements, and updated team rosters.',
            releaseDate: '2023-09-29',
            developer: 'EA Sports',
            publisher: 'EA',
            trailer: 'media/fifa24-trailer.mp4',
            screenshots: ['images/fifa24-1.jpg', 'images/fifa24-2.jpg'],
            features: ['Realistic Graphics', 'Ultimate Team', 'Career Mode', 'Online Multiplayer'],
            price: 69.99,
            tags: ['football', 'simulation', 'sports'],
            players: 'Single Player, Multiplayer',
            ageRating: 'E',
            size: '50GB',
            languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese']
        },
        {
            id: 4,
            title: 'Call of Duty: Modern Warfare III',
            genre: 'action',
            platform: 'xbox',
            rating: 4.5,
            image: 'images/cod-mw3.jpg',
            description: 'Intense first-person shooter action with multiplayer.',
            longDescription: 'The direct sequel to the record-breaking Call of Duty: Modern Warfare II, featuring new campaigns, multiplayer maps, and zombie modes.',
            releaseDate: '2023-11-10',
            developer: 'Infinity Ward',
            publisher: 'Activision',
            trailer: 'media/cod-mw3-trailer.mp4',
            screenshots: ['images/cod-mw3-1.jpg', 'images/cod-mw3-2.jpg'],
            features: ['Campaign', 'Multiplayer', 'Zombies', 'Warzone Integration'],
            price: 69.99,
            tags: ['fps', 'military', 'multiplayer'],
            players: 'Single Player, Multiplayer',
            ageRating: 'M',
            size: '100GB',
            languages: ['English', 'French', 'Italian', 'German', 'Spanish', 'Russian']
        },
        {
            id: 5,
            title: 'Candy Crush Saga',
            genre: 'puzzle',
            platform: 'mobile',
            rating: 4.1,
            image: 'images/candy-crush.jpg',
            description: 'Addictive match-3 puzzle game with thousands of levels.',
            longDescription: 'Switch and match your way through hundreds of levels in this delicious puzzle adventure. The sweetest game just keeps getting sweeter!',
            releaseDate: '2012-04-12',
            developer: 'King',
            publisher: 'King',
            trailer: 'media/candy-crush-trailer.mp4',
            screenshots: ['images/candy-crush-1.jpg', 'images/candy-crush-2.jpg'],
            features: ['Match-3 Gameplay', 'Power-ups', 'Social Features', 'Daily Challenges'],
            price: 0,
            tags: ['casual', 'mobile', 'free-to-play'],
            players: 'Single Player',
            ageRating: 'E',
            size: '200MB',
            languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese']
        },
        {
            id: 6,
            title: 'Civilization VI',
            genre: 'strategy',
            platform: 'pc',
            rating: 4.7,
            image: 'images/civ6.jpg',
            description: 'Build your empire through the ages in this turn-based strategy.',
            longDescription: 'Lead your civilization from the Stone Age to the Information Age. Wage war, conduct diplomacy, advance your culture, and go head-to-head with history\'s greatest leaders.',
            releaseDate: '2016-10-21',
            developer: 'Firaxis Games',
            publisher: '2K Games',
            trailer: 'media/civ6-trailer.mp4',
            screenshots: ['images/civ6-1.jpg', 'images/civ6-2.jpg'],
            features: ['Turn-based Strategy', 'Empire Building', 'Diplomacy', 'Multiplayer'],
            price: 59.99,
            tags: ['strategy', 'empire-building', 'historical'],
            players: 'Single Player, Multiplayer',
            ageRating: 'E10+',
            size: '15GB',
            languages: ['English', 'French', 'Italian', 'German', 'Spanish', 'Japanese', 'Korean', 'Chinese']
        },
        {
            id: 7,
            title: 'Super Mario Bros. Wonder',
            genre: 'adventure',
            platform: 'nintendo',
            rating: 4.6,
            image: 'images/mario-wonder.jpg',
            description: 'Mario\'s latest magical adventure with new power-ups.',
            longDescription: 'Join Mario and friends on a whimsical journey through the Flower Kingdom. Experience new gameplay mechanics and stunning visuals in this 2D platformer.',
            releaseDate: '2023-10-20',
            developer: 'Nintendo',
            publisher: 'Nintendo',
            trailer: 'media/mario-wonder-trailer.mp4',
            screenshots: ['images/mario-wonder-1.jpg', 'images/mario-wonder-2.jpg'],
            features: ['2D Platforming', 'Multiplayer', 'Power-ups', 'Creative Levels'],
            price: 59.99,
            tags: ['platformer', 'family-friendly', 'nintendo-exclusive'],
            players: 'Single Player, Multiplayer (up to 4)',
            ageRating: 'E',
            size: '8GB',
            languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese']
        },
        {
            id: 8,
            title: 'Baldur\'s Gate 3',
            genre: 'rpg',
            platform: 'pc',
            rating: 4.9,
            image: 'images/bg3.jpg',
            description: 'Epic Dungeons & Dragons RPG with incredible storytelling.',
            longDescription: 'Gather your party and venture forth into a story of adventure and intrigue in a world where your choices matter and dice rolls determine your fate.',
            releaseDate: '2023-08-03',
            developer: 'Larian Studios',
            publisher: 'Larian Studios',
            trailer: 'media/bg3-trailer.mp4',
            screenshots: ['images/bg3-1.jpg', 'images/bg3-2.jpg'],
            features: ['Turn-based Combat', 'Story Rich', 'Character Customization', 'Multiplayer'],
            price: 59.99,
            tags: ['d&d', 'story-rich', 'turn-based'],
            players: 'Single Player, Multiplayer (up to 4)',
            ageRating: 'M',
            size: '150GB',
            languages: ['English', 'French', 'Italian', 'German', 'Spanish', 'Polish', 'Russian', 'Chinese']
        },
        {
            id: 9,
            title: 'Forza Horizon 5',
            genre: 'racing',
            platform: 'xbox',
            rating: 4.7,
            image: 'images/forza-horizon5.jpg',
            description: 'Open-world racing game set in beautiful Mexico.',
            longDescription: 'Explore the vibrant open world of Mexico with hundreds of cars. Experience the greatest racing festival in the world with stunning graphics and dynamic weather.',
            releaseDate: '2021-11-09',
            developer: 'Playground Games',
            publisher: 'Xbox Game Studios',
            trailer: 'media/forza-horizon5-trailer.mp4',
            screenshots: ['images/forza-horizon5-1.jpg', 'images/forza-horizon5-2.jpg'],
            features: ['Open World Racing', 'Car Customization', 'Multiplayer', 'Dynamic Weather'],
            price: 59.99,
            tags: ['racing', 'open-world', 'simulation'],
            players: 'Single Player, Multiplayer',
            ageRating: 'E',
            size: '100GB',
            languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Portuguese']
        },
        {
            id: 10,
            title: 'The Sims 4',
            genre: 'simulation',
            platform: 'pc',
            rating: 4.3,
            image: 'images/sims4.jpg',
            description: 'Create and control people in a virtual world.',
            longDescription: 'Create unique Sims, build their dream homes, and explore their vibrant neighborhoods. Live out their stories and shape their destinies.',
            releaseDate: '2014-09-02',
            developer: 'Maxis',
            publisher: 'Electronic Arts',
            trailer: 'media/sims4-trailer.mp4',
            screenshots: ['images/sims4-1.jpg', 'images/sims4-2.jpg'],
            features: ['Life Simulation', 'Build Mode', 'Create-a-Sim', 'Expansion Packs'],
            price: 19.99,
            tags: ['simulation', 'life-sim', 'creative'],
            players: 'Single Player',
            ageRating: 'T',
            size: '25GB',
            languages: ['English', 'French', 'Italian', 'German', 'Spanish', 'Polish', 'Russian', 'Chinese']
        }
    ];
    
    // Update the global games array
    games = [...allGames];
    displayedGames = games.slice(0, gamesPerPage);
}

function setupGameFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const platformFilter = document.getElementById('platformFilter');
    
    // Populate genre filter
    if (genreFilter) {
        Object.entries(gameCategories).forEach(([key, category]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = category.name;
            genreFilter.appendChild(option);
        });
    }
    
    // Populate platform filter
    if (platformFilter) {
        Object.entries(platforms).forEach(([key, platform]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = platform.name;
            platformFilter.appendChild(option);
        });
    }
}

function setupGameSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(performSearch, 300));
}

function setupSorting() {
    // Add sorting dropdown if it doesn't exist
    const filterOptions = document.querySelector('.filter-options');
    if (filterOptions && !document.getElementById('sortFilter')) {
        const sortFilter = document.createElement('select');
        sortFilter.id = 'sortFilter';
        sortFilter.className = 'filter-select';
        sortFilter.innerHTML = `
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
            <option value="releaseDate">Sort by Release Date</option>
            <option value="price">Sort by Price</option>
        `;
        sortFilter.addEventListener('change', handleSort);
        filterOptions.appendChild(sortFilter);
    }
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value;
    const platformFilter = document.getElementById('platformFilter').value;
    
    let filteredGames = allGames;
    
    // Apply search filter
    if (searchTerm) {
        filteredGames = filteredGames.filter(game => 
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm) ||
            game.developer.toLowerCase().includes(searchTerm) ||
            game.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply genre filter
    if (genreFilter) {
        filteredGames = filteredGames.filter(game => game.genre === genreFilter);
    }
    
    // Apply platform filter
    if (platformFilter) {
        filteredGames = filteredGames.filter(game => game.platform === platformFilter);
    }
    
    // Update displayed games
    games = filteredGames;
    currentPage = 1;
    displayedGames = games.slice(0, gamesPerPage);
    renderGames();
    
    // Show results count
    showSearchResults(filteredGames.length, searchTerm);
}

function handleSort() {
    const sortBy = document.getElementById('sortFilter').value;
    
    switch(sortBy) {
        case 'title':
            games.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'rating':
            games.sort((a, b) => b.rating - a.rating);
            break;
        case 'releaseDate':
            games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            break;
        case 'price':
            games.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
    }
    
    renderGames();
}

function showSearchResults(count, searchTerm) {
    const resultsMessage = document.createElement('div');
    resultsMessage.className = 'search-results';
    resultsMessage.innerHTML = `
        <p>Found ${count} games ${searchTerm ? `for "${searchTerm}"` : ''}</p>
    `;
    
    const existingMessage = document.querySelector('.search-results');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const searchFilterBar = document.querySelector('.search-filter-bar');
    if (searchFilterBar) {
        searchFilterBar.insertAdjacentElement('afterend', resultsMessage);
    }
}

function loadMoreGames() {
    if (isLoading) return;
    
    isLoading = true;
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<span class="loading"></span> Loading...';
        loadMoreBtn.disabled = true;
    }
    
    // Simulate loading delay
    setTimeout(() => {
        currentPage++;
        const startIndex = (currentPage - 1) * gamesPerPage;
        const endIndex = startIndex + gamesPerPage;
        const newGames = games.slice(startIndex, endIndex);
        
        if (newGames.length > 0) {
            newGames.forEach(game => {
                const gameCard = createGameCard(game);
                elements.gamesGrid.appendChild(gameCard);
            });
        }
        
        // Hide load more button if all games are displayed
        if (endIndex >= games.length) {
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        } else {
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = 'Load More Games';
                loadMoreBtn.disabled = false;
            }
        }
        
        isLoading = false;
    }, 1000);
}

function createAdvancedGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card advanced';
    
    const categoryInfo = gameCategories[game.genre] || { name: game.genre, color: '#6b7280' };
    const platformInfo = platforms[game.platform] || { name: game.platform, icon: 'fa-gamepad' };
    
    card.innerHTML = `
        <div class="game-card-image">
            <img src="${game.image}" alt="${game.title}" onerror="this.src='images/default-game.jpg'">
            <div class="game-card-overlay">
                <button class="btn btn-primary quick-play" onclick="playGame(${game.id})">
                    <i class="fas fa-play"></i> Quick Play
                </button>
            </div>
        </div>
        <div class="game-card-content">
            <div class="game-card-header">
                <h3>${game.title}</h3>
                <span class="game-price">${game.price ? '$' + game.price : 'Free'}</span>
            </div>
            <p class="game-description">${game.description}</p>
            <div class="game-card-meta">
                <span class="game-genre" style="background-color: ${categoryInfo.color}">
                    <i class="fas ${categoryInfo.icon}"></i> ${categoryInfo.name}
                </span>
                <span class="game-platform">
                    <i class="fab ${platformInfo.icon}"></i> ${platformInfo.name}
                </span>
                <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}</span>
                </div>
            </div>
            <div class="game-card-actions">
                <button class="favorite-btn ${isFavorite(game.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(${game.id})" 
                        title="${isFavorite(game.id) ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="details-btn" onclick="showGameDetails(${game.id})" title="View Details">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function showGameDetails(gameId) {
    const game = allGames.find(g => g.id === gameId);
    if (!game) return;
    
    const categoryInfo = gameCategories[game.genre] || { name: game.genre, color: '#6b7280' };
    const platformInfo = platforms[game.platform] || { name: game.platform, icon: 'fa-gamepad' };
    
    const modalContent = document.getElementById('gameDetails');
    modalContent.innerHTML = `
        <div class="game-details">
            <div class="game-media">
                <img src="${game.image}" alt="${game.title}" onerror="this.src='images/default-game.jpg'">
                ${game.trailer ? `
                    <video controls style="width: 100%; margin-top: 1rem; border-radius: 8px;">
                        <source src="${game.trailer}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                ` : ''}
                ${game.screenshots ? `
                    <div class="game-screenshots">
                        <h4>Screenshots</h4>
                        <div class="screenshots-grid">
                            ${game.screenshots.map(screenshot => `
                                <img src="${screenshot}" alt="Screenshot" onerror="this.src='images/default-game.jpg'">
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="game-info">
                <h2>${game.title}</h2>
                <div class="game-badges">
                    <span class="badge genre-badge" style="background-color: ${categoryInfo.color}">
                        <i class="fas ${categoryInfo.icon}"></i> ${categoryInfo.name}
                    </span>
                    <span class="badge platform-badge">
                        <i class="fab ${platformInfo.icon}"></i> ${platformInfo.name}
                    </span>
                    <span class="badge rating-badge">
                        <i class="fas fa-star"></i> ${game.rating}/5
                    </span>
                </div>
                <div class="game-details-grid">
                    <div class="detail-item">
                        <strong>Developer:</strong> ${game.developer}
                    </div>
                    <div class="detail-item">
                        <strong>Publisher:</strong> ${game.publisher || game.developer}
                    </div>
                    <div class="detail-item">
                        <strong>Release Date:</strong> ${new Date(game.releaseDate).toLocaleDateString()}
                    </div>
                    <div class="detail-item">
                        <strong>Players:</strong> ${game.players}
                    </div>
                    <div class="detail-item">
                        <strong>Age Rating:</strong> ${game.ageRating}
                    </div>
                    <div class="detail-item">
                        <strong>Size:</strong> ${game.size}
                    </div>
                </div>
                <p class="game-long-description">${game.longDescription || game.description}</p>
                ${game.features ? `
                    <div class="game-features">
                        <h4>Features</h4>
                        <div class="features-list">
                            ${game.features.map(feature => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${game.languages ? `
                    <div class="game-languages">
                        <h4>Languages</h4>
                        <div class="languages-list">
                            ${game.languages.map(lang => `
                                <span class="language-tag">${lang}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${game.tags ? `
                    <div class="game-tags">
                        <h4>Tags</h4>
                        <div class="tags-list">
                            ${game.tags.map(tag => `
                                <span class="tag">#${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                <div class="game-actions">
                    <button class="btn btn-primary" onclick="toggleFavorite(${game.id})">
                        <i class="fas fa-heart"></i> 
                        ${isFavorite(game.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    <button class="btn btn-secondary" onclick="playGame(${game.id})">
                        <i class="fas fa-play"></i> Play Now
                    </button>
                    ${game.price ? `
                        <button class="btn btn-success" onclick="purchaseGame(${game.id})">
                            <i class="fas fa-shopping-cart"></i> Purchase - $${game.price}
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    showModal('gameModal');
}

function purchaseGame(gameId) {
    if (!currentUser) {
        showToast('Please login to purchase games', 'warning');
        return;
    }
    
    const game = allGames.find(g => g.id === gameId);
    if (game && game.price) {
        showToast(`Processing purchase of ${game.title} for $${game.price}...`, 'info');
        
        // Simulate purchase process
        setTimeout(() => {
            showToast(`Successfully purchased ${game.title}!`, 'success');
            playSound('purchase.mp3');
            
            // Add to user's purchased games
            if (!currentUser.purchasedGames) {
                currentUser.purchasedGames = [];
            }
            currentUser.purchasedGames.push(gameId);
            saveUserData();
        }, 2000);
    }
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeGames();
});

// Export functions
window.showGameDetails = showGameDetails;
window.purchaseGame = purchaseGame;
