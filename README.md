# Flarum Swipe Gestures
англійської я не знаю, цей опис робив ші, тож якщо там якась дурня написана - вибачайте. якщо коротко то це розширення яке дозволяє свайпом повертатись на попередню сторінку або відкрити меню.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

A [Flarum](http://flarum.org) extension that adds intuitive swipe gestures for better mobile and desktop navigation.

## Features

### 🔄 Swipe to Close Dropdowns
- Swipe down on any dropdown menu to close it
- Works on both mobile and desktop
- Smooth animations with visual feedback
- Adaptive corner radius animation

### ↔️ Navigation Swipes
- **Swipe right**: Go back to the previous page
- **Swipe left** (on homepage): Navigate to "All Discussions"
- Page transition animations with 3D effects
- Smart detection to avoid conflicts with UI elements

### 🎨 Visual Indicators
- Swipe indicator bar at the top of dropdowns
- Adaptive opacity during drag
- Color support for light and dark themes
- Accessibility-friendly design

## Installation

1. Download this extension
2. Place it in your Flarum's `extensions` folder as `olleksi-swipe`
3. Enable it in the admin panel

**Or via Composer:**

```sh
composer require olleksi/flarum-swipe:"*"
php flarum cache:clear
```

## File Structure

```
olleksi-swipe/
├── composer.json
├── extend.php
├── LICENSE
├── README.md
└── resources/
    ├── swipe.js      # JavaScript logic
    └── swipe.css     # Styles
```

## How It Works

This extension is **super simple** - no compilation, no build process:
- Pure JavaScript (no frameworks needed)
- CSS file ready to use
- Just drop in and enable!

The extension automatically:
- Detects mobile vs desktop environments
- Adapts to screen sizes
- Respects user preferences (reduced motion, etc.)
- Avoids conflicts with scrollable areas

## Customization

### Adjusting Swipe Thresholds

Edit `resources/swipe.js` and change these values:

```javascript
const swipeRightThreshold = 200;  // Distance for back navigation
const swipeLeftThreshold = -140;  // Distance for forward navigation
const swipeIgnoreThreshold = 90;  // Minimum movement to register
```

### Styling

Override CSS in your theme:

```css
.swipe-indicator {
    background-color: #your-color;
    height: 5px;
    width: 50px;
}
```

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Swipes not working

1. Make sure JavaScript is enabled
2. Check browser console for errors
3. Clear Flarum cache: `php flarum cache:clear`
4. Verify the extension is enabled in admin panel

### Conflicts with other extensions

- Check for overlapping gesture zones
- Try disabling other extensions temporarily
- Check browser console for JavaScript errors

