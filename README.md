# Blackjack Helper Browser Extension

A Google Chrome Web Extension that acts as a real-time assistant for online blackjack players.

**✨ Works on ALL websites - no restrictions!**

## Features

This extension provides a complete blackjack strategy assistant with OCR card recognition capabilities.

### Current Features
1. **Universal Compatibility**: 
   - 🌐 **Works on EVERY website** - HTTP, HTTPS, and local files
   - Automatic injection on all URLs
   - Smart error handling for sites with restrictions
   - Compatible with iframes and complex page structures
   
2. **Content Script**: 
   - Injects an interactive overlay onto the active tab
   - Displays real-time blackjack strategy recommendations
   - Toggleable visibility

2. **Basic Strategy Engine**:
   - Complete implementation of basic blackjack strategy
   - Handles pairs, soft hands, and hard hands
   - Provides optimal action recommendations (hit, stand, double, split)

3. **Automatic Screen Capture & OCR**:
   - 📸 One-click screen capture for automatic card detection
   - 🎯 Region selection to capture specific card areas
   - Automatic card recognition using Tesseract.js
   - No need to manually upload images
   - Real-time visual preview of captured area

4. **Odds and Expected Value Calculation**:
   - Real-time odds calculation for win/push/loss
   - Expected value (EV) for different actions
   - Dealer bust probability based on upcard

5. **Interactive Interface**:
   - Tab-based UI with Manual Input and OCR Recognition
   - Card input with validation
   - Visual indicators for recommendations
   - Comprehensive results display

6. **Overlay Design**:
   - Modern dark-themed overlay
   - Positioned in the top-right corner of the page
   - Scrollable content for extensive information
   - Close button and popup toggle

7. **Popup Interface**:
   - Extension popup accessible from the browser toolbar
   - Status indicator
   - Toggle overlay button
   - Feature list

8. **Manifest File Configuration**:
   - Manifest V3 compliant
   - Configured for Chrome extensions
   - Universal host permissions for ALL websites
   - Content scripts that inject into all URLs (HTTP, HTTPS, local files)
   - Works in iframes and all frame contexts
   - Optimized injection timing for maximum compatibility

## Project Structure

```plaintext
/blackjack-helper
|-- /assets       # Icons and static assets
|   |-- icon16.png  # Icon for the extension toolbar (16x16)
|   |-- icon48.png  # Icon for the extension toolbar (48x48)
|   |-- icon128.png # Icon for the extension toolbar (128x128)
|-- /scripts      # JavaScript files for the extension
|   |-- content.js  # Content script: injected into the browser page to manipulate DOM
|   |-- logic.js    # Blackjack strategy calculations and game logic
|   |-- ocr.js      # OCR module for card recognition using Tesseract.js
|-- /styles       # CSS files for the overlay in the game window
|   |-- overlay.css
|-- /popup        # Popup interface when clicking on the extension icon
|   |-- popup.html
|   |-- popup.js
|   |-- popup.css
|-- manifest.json # Metadata for the web extension
|-- test.html     # Test page for demonstration
```

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the repository directory

## Compatibility

**✅ This extension works on ALL websites without restrictions!**

### Supported Sites:
- ✅ HTTP websites
- ✅ HTTPS websites  
- ✅ Local files (file://)
- ✅ Any online blackjack site
- ✅ Casino websites
- ✅ Practice sites
- ✅ Works in iframes and complex page structures

### Technical Details:
- Uses Manifest V3 with `host_permissions` for universal access
- Content scripts configured with `run_at: "document_idle"` for optimal compatibility
- Supports `all_frames: true` to work in embedded content
- Smart error handling for sites with strict Content Security Policies
- Graceful fallback on restricted environments

The extension will automatically inject on every website you visit!

## Usage

1. After installation, the extension icon will appear in the Chrome toolbar
2. Navigate to any webpage to see the overlay injected automatically
3. Click the extension icon to open the popup interface
4. Use the "Toggle Overlay" button to show/hide the overlay

### Manual Input Mode
1. Enter your cards separated by commas (e.g., "K,7" or "10,A")
2. Enter the dealer's visible card
3. Click "Calculate" to get strategy recommendations
4. View the recommended action, odds, and expected values

### Automatic Card Detection Mode
1. Click on the "OCR Recognition" tab
2. Click "📸 Capture & Detect Cards" to automatically capture the entire screen
   - OR -
   Click "🎯 Select Region & Detect" to select a specific area with cards
3. The extension will automatically detect and recognize cards
4. Review detected cards and click "Use These Cards" to calculate strategy

**No image upload needed!** The extension automatically sees the cards on your screen.

### Strategy Recommendations
The extension provides recommendations based on basic blackjack strategy:
- **HIT**: Take another card
- **STAND**: Keep your current hand
- **DOUBLE**: Double your bet and take one more card
- **SPLIT**: Split pairs into two separate hands

## Next Steps

Future enhancements could include:
1. ~~Implement card recognition using OCR (e.g., Tesseract.js)~~ ✅ Completed
2. ~~Develop the basic blackjack strategy in the `logic.js` file and integrate it with `content.js`~~ ✅ Completed
3. ~~Visualize odds and EV (Expected Value) based on the live game state~~ ✅ Completed
4. Add card counting functionality
5. Implement automatic screen region selection for OCR
6. Add support for different blackjack rule variations
7. Integrate with specific online blackjack platforms
8. Add betting strategy recommendations

## Files Description

- **manifest.json**: Defines the extension's metadata, permissions, and configuration
- **content.js**: Main script that injects the interactive overlay and handles user interactions
- **logic.js**: Complete blackjack strategy engine with basic strategy, odds, and EV calculations
- **ocr.js**: OCR module using Tesseract.js for card recognition from images (loads from CDN in page context)
- **background.js**: Background service worker for screen capture functionality
- **overlay.css**: Comprehensive styling for the overlay with tabs, inputs, and results visualization
- **popup.html**, **popup.js**, **popup.css**: The popup interface for the extension
- **test.html**: Test page for demonstrating the extension

## Troubleshooting

### OCR Issues

**Problem**: "Failed to load Tesseract.js" error

**Solution**: 
The extension loads Tesseract.js from multiple CDN sources with automatic retry logic to ensure maximum reliability. The system tries:
1. jsDelivr CDN (cdn.jsdelivr.net)
2. unpkg CDN (unpkg.com)
3. Cloudflare CDN (cdnjs.cloudflare.com)

Each source is attempted up to 3 times with exponential backoff.

**If you still experience OCR loading issues:**

1. **Check Network Connection**: 
   - Ensure you have internet access
   - Test by opening https://cdn.jsdelivr.net in your browser
   
2. **Check Browser Console**: 
   - Open DevTools (F12) → Console tab
   - Look for detailed error messages with troubleshooting suggestions
   
3. **Firewall/Proxy Issues**: 
   - Disable VPN/proxy temporarily
   - Allowlist these CDNs: `cdn.jsdelivr.net`, `unpkg.com`, `cdnjs.cloudflare.com`
   
4. **Website CSP Restrictions**: 
   - Some websites have strict Content Security Policies
   - Try the extension on a different website (e.g., the included test.html)
   
5. **Wait for Loading**: 
   - First-time OCR use may take 5-10 seconds
   - The extension will automatically retry with different CDN sources
   - Watch the status messages for progress

**Technical Details**:
- Primary CDN: `https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js`
- Fallback CDNs: unpkg.com and cdnjs.cloudflare.com
- Automatic retry: 3 attempts per CDN source with exponential backoff
- Network pre-check before attempting load
- The extension uses page context injection to bypass Manifest V3 CSP restrictions
- Detailed error messages with specific troubleshooting steps

### Screen Capture Issues

If screen capture isn't working:
1. Ensure you've granted the extension the necessary permissions
2. Try refreshing the page after installing the extension
3. Check that you're on a supported protocol (HTTP/HTTPS)

## Version

Current version: 1.0.0

## Technology Stack

- **JavaScript**: Core functionality and game logic
- **Tesseract.js**: OCR for card recognition
- **Chrome Extension API**: Browser integration
- **CSS3**: Modern UI styling
- **HTML5**: Structure and layout