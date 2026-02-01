# Blackjack Helper Browser Extension

A Google Chrome Web Extension that acts as a real-time assistant for online blackjack players.

## Features

This is the initial setup for the Blackjack Helper extension. The extension provides a foundation for future development with demonstration code for injecting a simple overlay into the page.

### Current Features
1. **Content Script**: 
   - Injects an overlay onto the active tab
   - Displays a placeholder panel where odds and blackjack advice will be displayed in the future
   - Toggleable visibility

2. **Overlay Design**:
   - Basic styled overlay with a modern look
   - Close button for hiding the overlay
   - Positioned in the top-right corner of the page

3. **Popup Interface**:
   - Extension popup accessible from the browser toolbar
   - Status indicator
   - Toggle overlay button
   - Feature list

4. **Manifest File Configuration**:
   - Configures the web extension for Chrome
   - Includes permissions to read and modify the active tab
   - Content scripts that inject into all URLs

## Project Structure

```plaintext
/blackjack-helper
|-- /assets       # Icons and static assets
|   |-- icon16.png  # Icon for the extension toolbar (16x16)
|   |-- icon48.png  # Icon for the extension toolbar (48x48)
|   |-- icon128.png # Icon for the extension toolbar (128x128)
|-- /scripts      # JavaScript files for the extension
|   |-- content.js  # Content script: injected into the browser page to manipulate DOM
|   |-- logic.js    # Future module for Blackjack strategy calculations
|-- /styles       # CSS files for the overlay in the game window
|   |-- overlay.css
|-- /popup        # Popup interface when clicking on the extension icon
|   |-- popup.html
|   |-- popup.js
|   |-- popup.css
|-- manifest.json # Metadata for the web extension
```

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the repository directory

## Usage

1. After installation, the extension icon will appear in the Chrome toolbar
2. Navigate to any webpage to see the overlay injected automatically
3. Click the extension icon to open the popup interface
4. Use the "Toggle Overlay" button to show/hide the overlay

## Next Steps

After this initial setup, the next steps include:
1. Implement card recognition using OCR (e.g., Tesseract.js)
2. Develop the basic blackjack strategy in the `logic.js` file and integrate it with `content.js`
3. Visualize odds and EV (Expected Value) based on the live game state
4. Add advanced features like learning game rules automatically from the platform

## Files Description

- **manifest.json**: Defines the extension's metadata, permissions, and configuration
- **content.js**: A script that injects an overlay on detected game tabs
- **logic.js**: Placeholder for future strategy logic with example functions
- **overlay.css**: Styling for the overlay with a modern dark theme
- **popup.html**, **popup.js**, **popup.css**: The popup interface for the extension

## Version

Current version: 1.0.0