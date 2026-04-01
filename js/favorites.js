// GameHub Favorites Management JavaScript

// Favorites Data Management
let favoriteGames = [];
let favoriteCategories = {};
let favoriteStats = {
    totalGames: 0,
    totalPlaytime: 0,
    genres: {},
    platforms: {}
};

// Initialize Favorites
function initializeFavorites() {
    loadFavorites();
    updateFavoriteStats();
    setupFavoriteFilters();
    renderFavorites();
}

function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    } else {
        favorites = [];
    }
    
    // Load favorite games data
    favoriteGames = games.filter(game => favorites.includes(game.id));
    
    // Calculate categories and stats
    calculateFavoriteCategories();
    calculateFavoriteStats();
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites(); // Refresh the data
}

function calculateFavoriteCategories() {
    favoriteCategories = {};
    
    favoriteGames.forEach(game => {
        if (!favoriteCategories[game.genre]) {
            favoriteCategories[game.genre] = {
                name: gameCategories[game.genre]?.name || game.genre,
                icon: gameCategories[game.genre]?.icon || 'fa-gamepad',
                color: gameCategories[game.genre]?.color || '#6b7280',
                games: [],
                count: 0
            };
        }
        favoriteCategories[game.genre].games.push(game);
        favoriteCategories[game.genre].count++;
    });
}

function calculateFavoriteStats() {
    favoriteStats = {
        totalGames: favoriteGames.length,
        totalPlaytime: favoriteGames.reduce((total, game) => {
            return total + (currentUser?.gameStats?.[game.id]?.playtime || 0);
        }, 0),
        genres: {},
        platforms: {}
    };
    
    // Calculate genre distribution
    favoriteGames.forEach(game => {
        favoriteStats.genres[game.genre] = (favoriteStats.genres[game.genre] || 0) + 1;
        favoriteStats.platforms[game.platform] = (favoriteStats.platforms[game.platform] || 0) + 1;
    });
}

function setupFavoriteFilters() {
    const favoritesSection = document.getElementById('favorites');
    if (!favoritesSection) return;
    
    // Add filter controls if they don't exist
    const container = favoritesSection.querySelector('.container');
    if (container && !container.querySelector('.favorites-filters')) {
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'favorites-filters';
        filtersDiv.innerHTML = `
            <div class="filter-tabs">
                <button class="filter-tab active" data-filter="all">All Favorites</button>
                <button class="filter-tab" data-filter="recent">Recently Played</button>
                <button class="filter-tab" data-filter="most-played">Most Played</button>
            </div>
            <div class="filter-options">
                <select id="favoriteGenreFilter" class="filter-select">
                    <option value="">All Genres</option>
                </select>
                <select id="favoritePlatformFilter" class="filter-select">
                    <option value="">All Platforms</option>
                </select>
                <select id="favoriteSortFilter" class="filter-select">
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="playtime">Sort by Playtime</option>
                    <option value="date-added">Sort by Date Added</option>
                </select>
            </div>
        `;
        
        container.insertBefore(filtersDiv, container.querySelector('h2'));
        
        // Populate filter options
        populateFavoriteFilters();
        
        // Setup event listeners
        setupFavoriteFilterListeners();
    }
}

function populateFavoriteFilters() {
    const genreFilter = document.getElementById('favoriteGenreFilter');
    const platformFilter = document.getElementById('favoritePlatformFilter');
    
    if (genreFilter) {
        Object.entries(favoriteCategories).forEach(([key, category]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${category.name} (${category.count})`;
            genreFilter.appendChild(option);
        });
    }
    
    if (platformFilter) {
        Object.entries(favoriteStats.platforms).forEach(([key, count]) => {
            const platformInfo = platforms[key] || { name: key };
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${platformInfo.name} (${count})`;
            platformFilter.appendChild(option);
        });
    }
}

function setupFavoriteFilterListeners() {
    // Tab filtering
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterFavorites(this.dataset.filter);
        });
    });
    
    // Dropdown filtering
    const genreFilter = document.getElementById('favoriteGenreFilter');
    const platformFilter = document.getElementById('favoritePlatformFilter');
    const sortFilter = document.getElementById('favoriteSortFilter');
    
    if (genreFilter) genreFilter.addEventListener('change', applyFavoriteFilters);
    if (platformFilter) platformFilter.addEventListener('change', applyFavoriteFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFavoriteFilters);
}

function filterFavorites(filterType) {
    let filteredGames = [...favoriteGames];
    
    switch(filterType) {
        case 'recent':
            // Sort by recently played (mock data)
            filteredGames.sort((a, b) => {
                const aTime = currentUser?.gameStats?.[a.id]?.lastPlayed || 0;
                const bTime = currentUser?.gameStats?.[b.id]?.lastPlayed || 0;
                return bTime - aTime;
            });
            break;
        case 'most-played':
            // Sort by playtime
            filteredGames.sort((a, b) => {
                const aTime = currentUser?.gameStats?.[a.id]?.playtime || 0;
                const bTime = currentUser?.gameStats?.[b.id]?.playtime || 0;
                return bTime - aTime;
            });
            break;
        default:
            // All favorites - no additional filtering
            break;
    }
    
    renderFavoriteGames(filteredGames);
}

function applyFavoriteFilters() {
    const genreFilter = document.getElementById('favoriteGenreFilter').value;
    const platformFilter = document.getElementById('favoritePlatformFilter').value;
    const sortFilter = document.getElementById('favoriteSortFilter').value;
    
    let filteredGames = [...favoriteGames];
    
    // Apply genre filter
    if (genreFilter) {
        filteredGames = filteredGames.filter(game => game.genre === genreFilter);
    }
    
    // Apply platform filter
    if (platformFilter) {
        filteredGames = filteredGames.filter(game => game.platform === platformFilter);
    }
    
    // Apply sorting
    switch(sortFilter) {
        case 'title':
            filteredGames.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'rating':
            filteredGames.sort((a, b) => b.rating - a.rating);
            break;
        case 'playtime':
            filteredGames.sort((a, b) => {
                const aTime = currentUser?.gameStats?.[a.id]?.playtime || 0;
                const bTime = currentUser?.gameStats?.[b.id]?.playtime || 0;
                return bTime - aTime;
            });
            break;
        case 'date-added':
            // Sort by when added to favorites (mock data)
            filteredGames.sort((a, b) => a.id - b.id);
            break;
    }
    
    renderFavoriteGames(filteredGames);
}

function renderFavorites() {
    renderFavoriteGames(favoriteGames);
    updateFavoriteStats();
}

function renderFavoriteGames(gamesToRender) {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    
    if (!favoritesGrid) return;
    
    if (gamesToRender.length === 0) {
        favoritesGrid.innerHTML = '';
        if (noFavoritesMessage) {
            noFavoritesMessage.style.display = 'block';
        }
        return;
    }
    
    if (noFavoritesMessage) {
        noFavoritesMessage.style.display = 'none';
    }
    
    favoritesGrid.innerHTML = '';
    
    gamesToRender.forEach(game => {
        const gameCard = createFavoriteGameCard(game);
        favoritesGrid.appendChild(gameCard);
    });
}

function createFavoriteGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card favorite-card';
    
    const categoryInfo = gameCategories[game.genre] || { name: game.genre, color: '#6b7280' };
    const platformInfo = platforms[game.platform] || { name: game.platform, icon: 'fa-gamepad' };
    const playtime = currentUser?.gameStats?.[game.id]?.playtime || 0;
    const lastPlayed = currentUser?.gameStats?.[game.id]?.lastPlayed;
    
    card.innerHTML = `
        <div class="favorite-badge">
            <i class="fas fa-heart"></i>
        </div>
        <div class="game-card-image">
            <img src="${game.image}" alt="${game.title}" onerror="this.src='images/default-game.jpg'">
            <div class="game-card-overlay">
                <button class="btn btn-primary" onclick="playGame(${game.id})">
                    <i class="fas fa-play"></i> Play
                </button>
            </div>
        </div>
        <div class="game-card-content">
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="game-stats">
                ${playtime > 0 ? `
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <span>${formatPlaytime(playtime)}</span>
                    </div>
                ` : ''}
                ${lastPlayed ? `
                    <div class="stat-item">
                        <i class="fas fa-calendar"></i>
                        <span>Last played: ${formatDate(lastPlayed)}</span>
                    </div>
                ` : ''}
            </div>
            <div class="game-card-meta">
                <span class="game-genre" style="background-color: ${categoryInfo.color}">
                    <i class="fas ${categoryInfo.icon}"></i> ${categoryInfo.name}
                </span>
                <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}</span>
                </div>
            </div>
            <div class="favorite-actions">
                <button class="btn btn-sm btn-danger" onclick="removeFavorite(${game.id})" title="Remove from favorites">
                    <i class="fas fa-heart-broken"></i>
                </button>
                <button class="btn btn-sm btn-secondary" onclick="showGameDetails(${game.id})" title="View Details">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function removeFavorite(gameId) {
    const index = favorites.indexOf(gameId);
    if (index > -1) {
        favorites.splice(index, 1);
        saveFavorites();
        
        const game = games.find(g => g.id === gameId);
        showToast(`Removed "${game.title}" from favorites`, 'info');
        playSound('remove-favorite.mp3');
        
        // Update all game displays
        renderGames();
        renderFeaturedGames();
        renderFavorites();
    }
}

function updateFavoriteStats() {
    const totalGamesElement = document.getElementById('totalFavorites');
    if (totalGamesElement) {
        totalGamesElement.textContent = favoriteGames.length;
    }
    
    // Update profile stats
    updateProfile();
}

function createFavoriteCollections() {
    // Allow users to create custom collections of favorites
    const collections = JSON.parse(localStorage.getItem('favoriteCollections')) || {};
    
    // Add collection management UI
    const favoritesSection = document.getElementById('favorites');
    if (favoritesSection && !favoritesSection.querySelector('.collections-manager')) {
        const collectionsDiv = document.createElement('div');
        collectionsDiv.className = 'collections-manager';
        collectionsDiv.innerHTML = `
            <h3>My Collections</h3>
            <div class="collections-list">
                ${Object.entries(collections).map(([name, games]) => `
                    <div class="collection-item">
                        <h4>${name}</h4>
                        <span>${games.length} games</span>
                        <button class="btn btn-sm" onclick="viewCollection('${name}')">View</button>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" onclick="createNewCollection()">Create New Collection</button>
        `;
        
        favoritesSection.querySelector('.container').appendChild(collectionsDiv);
    }
}

function createNewCollection() {
    const name = prompt('Enter collection name:');
    if (!name) return;
    
    const collections = JSON.parse(localStorage.getItem('favoriteCollections')) || {};
    collections[name] = [];
    localStorage.setItem('favoriteCollections', JSON.stringify(collections));
    
    showToast(`Created collection: ${name}`, 'success');
    createFavoriteCollections();
}

function addToCollection(collectionName, gameId) {
    const collections = JSON.parse(localStorage.getItem('favoriteCollections')) || {};
    
    if (collections[collectionName]) {
        if (!collections[collectionName].includes(gameId)) {
            collections[collectionName].push(gameId);
            localStorage.setItem('favoriteCollections', JSON.stringify(collections));
            showToast(`Added to collection: ${collectionName}`, 'success');
        } else {
            showToast('Game already in this collection', 'info');
        }
    }
}

function viewCollection(collectionName) {
    const collections = JSON.parse(localStorage.getItem('favoriteCollections')) || {};
    const collectionGames = collections[collectionName] || [];
    const games = collectionGames.map(id => allGames.find(g => g.id === id)).filter(Boolean);
    
    // Show collection in modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'collectionModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${collectionName}</h2>
            <div class="games-grid">
                ${games.map(game => createGameCard(game).outerHTML).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Setup close handler
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function exportFavorites() {
    // Export favorites as JSON
    const exportData = {
        favorites: favorites,
        games: favoriteGames.map(game => ({
            id: game.id,
            title: game.title,
            genre: game.genre,
            platform: game.platform,
            rating: game.rating
        })),
        stats: favoriteStats,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gamehub-favorites-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Favorites exported successfully', 'success');
}

function importFavorites() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);
                
                if (importedData.favorites && Array.isArray(importedData.favorites)) {
                    // Merge with existing favorites
                    const newFavorites = [...new Set([...favorites, ...importedData.favorites])];
                    favorites = newFavorites;
                    saveFavorites();
                    
                    showToast(`Imported ${importedData.favorites.length} favorites`, 'success');
                    renderFavorites();
                } else {
                    showToast('Invalid favorites file format', 'error');
                }
            } catch (error) {
                showToast('Error importing favorites', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Utility functions
function formatPlaytime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    } else {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return `${days}d ${hours}h`;
    }
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Initialize favorites when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFavorites();
    
    // Add export/import buttons to favorites section
    const favoritesSection = document.getElementById('favorites');
    if (favoritesSection) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'favorites-actions';
        actionsDiv.innerHTML = `
            <button class="btn btn-secondary" onclick="exportFavorites()">
                <i class="fas fa-download"></i> Export Favorites
            </button>
            <button class="btn btn-secondary" onclick="importFavorites()">
                <i class="fas fa-upload"></i> Import Favorites
            </button>
        `;
        
        const container = favoritesSection.querySelector('.container');
        if (container) {
            container.appendChild(actionsDiv);
        }
    }
});

// Export functions
window.removeFavorite = removeFavorite;
window.exportFavorites = exportFavorites;
window.importFavorites = importFavorites;
window.viewCollection = viewCollection;
window.createNewCollection = createNewCollection;
window.addToCollection = addToCollection;
