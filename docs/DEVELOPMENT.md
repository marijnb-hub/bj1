# Development Guide

This guide is for developers who want to contribute to or modify the Blackjack Helper Vision application.

## Project Overview

Blackjack Helper Vision is an Electron desktop application that uses OpenCV for computer vision to detect playing cards and provide strategic advice for blackjack games.

## Architecture

```
┌─────────────────┐
│   Electron      │
│   Main Process  │
│   (main.js)     │
└────────┬────────┘
         │
         │ IPC Communication
         │
┌────────▼────────┐
│   Renderer      │
│   Process       │
│  (renderer.js)  │
└────────┬────────┘
         │
         ├──► Screen Capture (desktopCapturer)
         │
         ├──► OpenCV Processing (cardDetector.js)
         │    │
         │    ├─► Template Matching
         │    ├─► Contour Detection
         │    └─► HSV Color Filtering
         │
         └──► Strategy Calculation (strategy.js)
              └─► Basic Blackjack Strategy
```

## Key Components

### 1. Main Process (`src/main.js`)
- Electron application entry point
- Creates main window and overlay windows
- Handles IPC communication
- Manages screen capture sources

### 2. Renderer Process (`src/renderer.js`)
- UI logic and event handling
- Coordinates between UI and processing modules
- Displays detection results and advice
- Manages capture loop

### 3. Card Detector (`src/processing/cardDetector.js`)
- OpenCV-based card detection
- Template matching algorithm
- Contour detection for card isolation
- HSV color filtering for suits
- Confidence scoring

### 4. Strategy Calculator (`src/processing/strategy.js`)
- Implements basic blackjack strategy
- Hard totals, soft totals, and pairs
- Calculates hand totals with Ace handling
- Returns optimal play recommendation

### 5. UI Components
- **Main Window** (`index.html`): Control panel and results display
- **Overlay Window** (`src/ui/overlay.html`): Transparent overlay for in-game advice
- **Styles** (`style.css`): All UI styling

## Development Setup

### Prerequisites

```bash
# Node.js v16+
node --version

# npm or yarn
npm --version

# Git
git --version
```

### Clone and Install

```bash
# Clone repository
git clone https://github.com/marijnb-hub/bj1.git
cd bj1

# Install dependencies
npm install

# Run in development mode
NODE_ENV=development npm start
```

### Development Mode Features

In development mode (NODE_ENV=development):
- DevTools automatically opens
- Hot reload on file changes (requires manual restart)
- Detailed console logging
- Error stack traces

## Code Style

### JavaScript
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Keep functions small and focused

### Example:
```javascript
/**
 * Detect cards in an image
 * @param {cv.Mat} image - Input image
 * @returns {Array} Detected cards
 */
detectCards(image) {
  // Implementation
}
```

## Testing

### Run Existing Tests

```bash
# Run strategy tests
npm test

# Run specific test file
node tests/strategy.test.js
```

### Writing Tests

Create test files in the `tests/` directory:

```javascript
// tests/myFeature.test.js
const MyFeature = require('../src/myFeature');

function test(description, actual, expected) {
  const passed = actual === expected;
  console.log(passed ? '✅' : '❌', description);
  return passed;
}

// Your tests here
test('Should do something', myFunction(), expectedResult);
```

## OpenCV Integration

### Loading OpenCV

```javascript
const cv = require('opencv4nodejs');
```

### Common Operations

```javascript
// Read image
const img = cv.imread('path/to/image.png');

// Convert to grayscale
const gray = img.bgrToGray();

// Apply threshold
const binary = gray.threshold(127, 255, cv.THRESH_BINARY);

// Find contours
const contours = binary.findContours(
  cv.RETR_EXTERNAL,
  cv.CHAIN_APPROX_SIMPLE
);

// Template matching
const matched = img.matchTemplate(template, cv.TM_CCOEFF_NORMED);

// Color filtering (HSV)
const hsv = img.cvtColor(cv.COLOR_BGR2HSV);
const mask = hsv.inRange(lowerBound, upperBound);
```

## Adding New Features

### 1. Add a New Processing Module

```bash
# Create new file
touch src/processing/myModule.js
```

```javascript
// src/processing/myModule.js
class MyModule {
  constructor() {
    // Initialize
  }

  process(input) {
    // Process logic
    return result;
  }
}

module.exports = MyModule;
```

### 2. Integrate with Renderer

```javascript
// src/renderer.js
const MyModule = require('./processing/myModule');
const myModule = new MyModule();

// Use in your code
const result = myModule.process(data);
```

### 3. Add UI Controls

```html
<!-- index.html -->
<div class="control-group">
  <label for="myControl">My Feature:</label>
  <input type="checkbox" id="myControl">
</div>
```

```javascript
// src/renderer.js
document.getElementById('myControl').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  // Handle change
});
```

## IPC Communication

### Main to Renderer

```javascript
// main.js
mainWindow.webContents.send('channel-name', data);

// renderer.js
ipcRenderer.on('channel-name', (event, data) => {
  // Handle data
});
```

### Renderer to Main

```javascript
// renderer.js
ipcRenderer.send('channel-name', data);

// main.js
ipcMain.on('channel-name', (event, data) => {
  // Handle data
});
```

### Async Request/Response

```javascript
// main.js
ipcMain.handle('get-something', async () => {
  const result = await getSomething();
  return result;
});

// renderer.js
const result = await ipcRenderer.invoke('get-something');
```

## Debugging

### Console Logging

```javascript
// Add debug logs
console.log('Debug info:', variable);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### DevTools

Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) to open DevTools.

### OpenCV Debugging

Display intermediate images:

```javascript
// Show image in window
cv.imshow('Debug Window', image);
cv.waitKey();

// Save image for inspection
cv.imwrite('/tmp/debug_image.png', image);
```

## Performance Optimization

### Image Processing

1. **Resize images** before processing:
```javascript
const resized = img.resize(640, 480);
```

2. **Process ROI (Region of Interest)** only:
```javascript
const roi = img.getRegion(new cv.Rect(x, y, width, height));
```

3. **Cache templates**:
```javascript
// Load once, use many times
this.templates = this.loadTemplates();
```

### Capture Loop

1. **Adjust capture interval** based on need:
```javascript
// Less frequent = better performance
setInterval(captureAndAnalyze, 2000); // Every 2 seconds
```

2. **Skip frames** if processing is slow:
```javascript
if (isProcessing) return; // Skip this frame
```

## Building for Distribution

### Development Build

```bash
npm run build
```

### Platform-Specific Builds

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

### Build Configuration

Edit `package.json` under the `build` section:

```json
"build": {
  "appId": "com.blackjack.helper.vision",
  "productName": "Blackjack Helper Vision",
  "files": [
    "src/**/*",
    "assets/**/*",
    "index.html",
    "style.css"
  ]
}
```

## Troubleshooting

### OpenCV Won't Compile

Try installing from source:
```bash
npm install opencv4nodejs --build-from-source
```

### Electron Window Not Opening

Check main process logs:
```bash
NODE_ENV=development npm start
```

### Screen Capture Not Working

Ensure permissions:
- **macOS**: System Preferences → Security & Privacy → Screen Recording
- **Windows**: Run as administrator if needed

## Contributing

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/doc-name` - Documentation updates

### Commit Messages

```
feat: Add new card detection algorithm
fix: Correct Ace value calculation
docs: Update installation instructions
refactor: Simplify template loading
test: Add tests for strategy calculator
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Update documentation
6. Submit pull request

## Useful Resources

### Electron
- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron API Demos](https://github.com/electron/electron-api-demos)

### OpenCV
- [OpenCV Documentation](https://docs.opencv.org/)
- [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs)

### Blackjack Strategy
- [Wizard of Odds - Blackjack](https://wizardofodds.com/games/blackjack/)
- [Basic Strategy Charts](https://www.blackjackapprenticeship.com/blackjack-strategy-charts/)

## FAQ

**Q: How do I add support for different card decks?**
A: Create new template sets in subdirectories of `assets/templates/` and add UI to switch between them.

**Q: Can I use this with other card games?**
A: Yes! The card detection is generic. You'd need to implement different strategy logic for other games.

**Q: How accurate is the detection?**
A: With good templates, accuracy can be >95%. It depends heavily on template quality and game consistency.

**Q: Can I run this on mobile?**
A: Not directly. Electron is for desktop. You'd need to port to React Native or similar for mobile.

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/marijnb-hub/bj1/issues)
- **Discussions**: [GitHub Discussions](https://github.com/marijnb-hub/bj1/discussions)

Happy coding! 🎴
