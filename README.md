# GameHub - Ultimate Gaming Destination

A complete, modern video games website where users can register their country with their personal account, select games, and add them to their favorites. Built with HTML, CSS, and JavaScript with full multimedia support.

## Features

### 🎮 Core Features
- **User Registration & Authentication**: Complete login/registration system with country selection
- **Game Catalog**: Browse and search through a comprehensive collection of games
- **Favorites System**: Add games to personal favorites with collections management
- **User Profiles**: Track gaming stats, achievements, and personal information
- **Multi-language Support**: Available in 6 languages (English, Spanish, French, German, Chinese, Japanese)

### 🎨 Design & UX
- **Modern UI**: Clean, responsive design with gradient effects and smooth animations
- **Mobile Responsive**: Fully optimized for all device sizes
- **Dark Mode Support**: Automatic theme detection
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 🎬 Multimedia Support
- **Game Trailers**: Embedded video players for game previews
- **Screenshots**: Image galleries for each game
- **Audio Feedback**: Sound effects for user interactions
- **Hero Video**: Background video for immersive landing experience

### 🔍 Advanced Features
- **Search & Filtering**: Real-time search with genre and platform filters
- **Sorting Options**: Sort by title, rating, release date, or price
- **Collections**: Create custom game collections
- **Export/Import**: Backup and restore favorites
- **Session Management**: Secure user sessions with timeout

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables, Animations
- **Storage**: LocalStorage for data persistence
- **Multimedia**: HTML5 Video, Audio API
- **Icons**: Font Awesome 6.0
- **Responsive**: Mobile-first design approach

## File Structure

```
video-games-website/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main stylesheet
│   └── responsive.css      # Responsive design
├── js/
│   ├── app.js              # Main application logic
│   ├── auth.js             # Authentication system
│   ├── games.js            # Games management
│   ├── favorites.js        # Favorites functionality
│   └── translations.js     # Multi-language support
├── images/                 # Game images and assets
├── media/                  # Videos and trailers
├── audio/                  # Sound effects
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone or Download** the project files
2. **Open in Browser**: Simply open `index.html` in your web browser
3. **Optional Local Server**: For development, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Quick Start

1. **Register an Account**: Click "Register" and create your profile
2. **Select Your Country**: Choose from 50+ supported countries
3. **Browse Games**: Explore the game catalog with search and filters
4. **Add Favorites**: Click the heart icon to save games
5. **Create Collections**: Organize favorites into custom collections
6. **Switch Languages**: Use the language selector in the navigation

## Features in Detail

### User System
- **Registration**: Email, password, name, and country selection
- **Authentication**: Secure login with session management
- **Profiles**: Personal stats, avatar, and gaming history
- **Data Persistence**: All data saved locally

### Game Management
- **Catalog**: 10+ sample games with detailed information
- **Search**: Real-time search across titles, descriptions, and tags
- **Filters**: Genre and platform filtering
- **Sorting**: Multiple sorting options
- **Details**: Comprehensive game information with media

### Favorites System
- **Add/Remove**: Toggle favorite status with heart icon
- **Collections**: Create custom game collections
- **Stats**: Track playtime and last played dates
- **Export/Import**: Backup favorites as JSON

### Multimedia
- **Trailers**: Embedded video players for game previews
- **Screenshots**: Image galleries for each game
- **Audio**: Sound effects for interactions
- **Hero Video**: Immersive background video

### Multi-language Support
- **Languages**: English, Spanish, French, German, Chinese, Japanese
- **Auto-detect**: Browser language detection
- **Dynamic Translation**: Real-time content updates
- **RTL Support**: Ready for right-to-left languages

## Sample Data

The website includes sample data for:
- **10 Games**: Various genres and platforms
- **User Stats**: Mock gaming statistics
- **Media**: Placeholder images and videos
- **Translations**: Complete translation sets

## Customization

### Adding New Games
```javascript
// Add to js/games.js
{
    id: 11,
    title: 'New Game',
    genre: 'action',
    platform: 'pc',
    rating: 4.5,
    image: 'images/new-game.jpg',
    description: 'Game description',
    // ... other properties
}
```

### Adding New Languages
```javascript
// Add to js/translations.js
translations['pt'] = {
    'nav.home': 'Início',
    'nav.games': 'Jogos',
    // ... add all translations
};
```

### Custom Styling
```css
/* Modify css/styles.css */
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* ... other custom colors */
}
```

## Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+

## Performance Features

- **Lazy Loading**: Images and videos load as needed
- **Debounced Search**: Optimized search performance
- **Local Storage**: Fast data access
- **Minified Assets**: Optimized CSS and JavaScript
- **Caching**: Browser caching for static assets

## Security Features

- **Input Validation**: Form validation and sanitization
- **Session Management**: Secure user sessions
- **Data Encryption**: Password hashing (demo version)
- **XSS Prevention**: Safe DOM manipulation

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Good color contrast ratios
- **Focus States**: Clear focus indicators
- **Reduced Motion**: Respects user preferences

## Future Enhancements

- **Backend Integration**: Connect to real database
- **Social Features**: Friends and sharing
- **Achievements**: Gaming achievements system
- **Reviews**: User reviews and ratings
- **News**: Gaming news and updates
- **Store**: Game purchase integration

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Credits

- **Design**: Modern web design principles
- **Icons**: Font Awesome 6.0
- **Images**: Placeholder images from various sources
- **Videos**: Sample gaming trailers
- **Audio**: Free sound effects

---

**GameHub** - Your ultimate gaming destination! 🎮✨
