// GameHub Authentication JavaScript

// User Database (in a real app, this would be on a server)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate input
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = user;
        saveUserData();
        updateUI();
        hideModal('loginModal');
        showToast(`Welcome back, ${user.name}!`, 'success');
        playSound('login-success.mp3');
        
        // Reset form
        document.getElementById('loginForm').reset();
    } else {
        // Login failed
        showToast('Invalid email or password', 'error');
        playSound('error.mp3');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const country = document.getElementById('registerCountry').value;
    
    // Validate input
    if (name.trim().length < 2) {
        showToast('Name must be at least 2 characters', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!country) {
        showToast('Please select your country', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showToast('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase(),
        password: password, // In a real app, this would be hashed
        country: country,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        hoursPlayed: 0,
        achievements: []
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    saveUserData();
    updateUI();
    hideModal('registerModal');
    showToast(`Welcome to GameHub, ${newUser.name}!`, 'success');
    playSound('register-success.mp3');
    
    // Reset form
    document.getElementById('registerForm').reset();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Profile Management
function editProfile() {
    if (!currentUser) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editProfileModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="editName">Full Name</label>
                    <input type="text" id="editName" value="${currentUser.name}" required>
                </div>
                <div class="form-group">
                    <label for="editCountry">Country</label>
                    <select id="editCountry" required>
                        <option value="">Select your country</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editAvatar">Avatar URL (optional)</label>
                    <input type="url" id="editAvatar" value="${currentUser.avatar || ''}" placeholder="Enter avatar URL">
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" class="btn btn-secondary" onclick="hideModal('editProfileModal')">Cancel</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Populate countries
    populateCountriesForEdit();
    
    // Set current country
    if (currentUser.country) {
        document.getElementById('editCountry').value = currentUser.country;
    }
    
    // Setup event listeners
    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('editProfileForm').addEventListener('submit', saveProfileChanges);
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function populateCountriesForEdit() {
    const countrySelect = document.getElementById('editCountry');
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

function saveProfileChanges(e) {
    e.preventDefault();
    
    const name = document.getElementById('editName').value;
    const country = document.getElementById('editCountry').value;
    const avatar = document.getElementById('editAvatar').value;
    
    // Validate input
    if (name.trim().length < 2) {
        showToast('Name must be at least 2 characters', 'error');
        return;
    }
    
    if (!country) {
        showToast('Please select your country', 'error');
        return;
    }
    
    // Update user
    currentUser.name = name.trim();
    currentUser.country = country;
    
    if (avatar && validateUrl(avatar)) {
        currentUser.avatar = avatar;
    } else if (!avatar) {
        // Generate new avatar with updated name
        currentUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;
    }
    
    // Update users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Save current user
    saveUserData();
    updateUI();
    
    // Close modal
    const modal = document.getElementById('editProfileModal');
    document.body.removeChild(modal);
    document.body.style.overflow = 'auto';
    
    showToast('Profile updated successfully!', 'success');
    playSound('success.mp3');
}

function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Password Reset (for future implementation)
function requestPasswordReset() {
    const email = prompt('Enter your email address for password reset:');
    
    if (!email) return;
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email);
    
    if (user) {
        // In a real app, this would send an email
        showToast(`Password reset instructions sent to ${email}`, 'success');
        console.log(`Password reset requested for: ${email}`);
    } else {
        showToast('Email not found in our system', 'error');
    }
}

// Account Deletion
function deleteAccount() {
    if (!currentUser) return;
    
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (!confirmed) return;
    
    const secondConfirmation = confirm('This will permanently delete all your data. Are you absolutely sure?');
    
    if (!secondConfirmation) return;
    
    // Remove user from users array
    users = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Remove user's favorites
    favorites = [];
    saveFavorites();
    
    // Logout
    currentUser = null;
    saveUserData();
    updateUI();
    
    showToast('Your account has been deleted', 'info');
    playSound('logout.mp3');
}

// Session Management
function checkSession() {
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (lastActivity && currentUser) {
        const inactiveTime = Date.now() - parseInt(lastActivity);
        
        if (inactiveTime > sessionTimeout) {
            // Session expired
            logout();
            showToast('Session expired. Please login again.', 'warning');
        }
    }
    
    // Update last activity
    if (currentUser) {
        localStorage.setItem('lastActivity', Date.now().toString());
    }
}

// Activity tracking
function trackActivity() {
    if (currentUser) {
        localStorage.setItem('lastActivity', Date.now().toString());
    }
}

// Security Functions
function hashPassword(password) {
    // In a real app, use a proper hashing library like bcrypt
    // This is just for demonstration
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

function validatePassword(password) {
    // Password strength validation
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    if (!hasLowerCase || !hasUpperCase) {
        return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
    }
    
    if (!hasNumbers) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    
    if (!hasSpecialChar) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true, message: 'Password is strong' };
}

// Social Login (placeholder for future implementation)
function loginWithProvider(provider) {
    showToast(`${provider} login coming soon!`, 'info');
    console.log(`Login with ${provider} requested`);
}

// Export functions
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.editProfile = editProfile;
window.deleteAccount = deleteAccount;
window.requestPasswordReset = requestPasswordReset;

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check session periodically
    setInterval(checkSession, 60000); // Check every minute
    
    // Track user activity
    document.addEventListener('click', trackActivity);
    document.addEventListener('keypress', trackActivity);
    document.addEventListener('scroll', trackActivity);
    
    // Setup edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', editProfile);
    }
    
    // Setup social login buttons (if they exist)
    const googleLoginBtn = document.getElementById('googleLogin');
    const facebookLoginBtn = document.getElementById('facebookLogin');
    const twitterLoginBtn = document.getElementById('twitterLogin');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => loginWithProvider('Google'));
    }
    
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', () => loginWithProvider('Facebook'));
    }
    
    if (twitterLoginBtn) {
        twitterLoginBtn.addEventListener('click', () => loginWithProvider('Twitter'));
    }
});
