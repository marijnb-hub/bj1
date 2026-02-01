# Blackjack Helper - Desktop Application

A real-time desktop assistant for online blackjack players. Get optimal strategy recommendations, odds calculations, and expected value analysis.

## Features

✅ **Complete Basic Strategy** - Optimal play recommendations for every situation
✅ **OCR Card Recognition** - Automatic card detection from screenshots (using Tesseract.js)
✅ **Real-time Odds Calculator** - Win/Push/Loss/Dealer Bust probabilities
✅ **Expected Value Analysis** - EV for Hit, Stand, and Double actions
✅ **Hand Analysis** - Automatic detection of soft hands and pairs
✅ **Manual Input Mode** - Direct card entry for quick calculations
✅ **Cross-Platform** - Works on Windows, Mac, and Linux

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/marijnb-hub/bj1.git
   cd bj1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```

### Building Installers

Build platform-specific installers:

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux

# For all platforms
npm run build
```

Built installers will be in the `dist/` directory.

## Usage

### Manual Input Mode

1. Enter your cards (e.g., "K,7" or "10,A")
2. Enter dealer's upcard (e.g., "7" or "K")
3. Click "Calculate" to get recommendations

### OCR Card Recognition Mode

1. Click "OCR Recognition" tab
2. Click "📸 Capture & Detect Cards"
3. The app will capture your screen and detect cards automatically
4. Review detected cards and click "Use These Cards"

## Strategy Recommendations

The app provides optimal actions based on basic blackjack strategy:

- **HIT** - Take another card
- **STAND** - Keep your current hand
- **DOUBLE** - Double your bet and take one card
- **SPLIT** - Split pairs into two hands

## Technology Stack

- **Electron** - Cross-platform desktop framework
- **JavaScript** - Core functionality and game logic
- **Tesseract.js** - OCR for card recognition
- **HTML5/CSS3** - Modern UI

## Project Structure

```
bj1/
├── app/                 # Desktop app renderer process
│   ├── index.html      # Main window HTML
│   ├── app.js          # Application logic
│   └── preload.js      # Electron preload script
├── main.js             # Electron main process
├── scripts/            # Core logic modules
│   ├── logic.js        # Blackjack strategy calculations
│   └── ocr.js          # OCR functionality
├── styles/             # CSS stylesheets
│   └── app.css         # Desktop app styles
├── assets/             # Icons and images
└── package.json        # Project configuration

# Extension files (legacy)
├── manifest.json       # Chrome extension manifest
├── popup/              # Extension popup
└── scripts/
    ├── content.js      # Extension content script
    └── background.js   # Extension background script
```

## Desktop vs Extension

This repository now contains both:
- **Desktop Application** (new) - Standalone Electron app
- **Browser Extension** (original) - Chrome extension

To use the desktop app, follow the instructions above.
To use the browser extension, load the extension folder in Chrome.

## Development

```bash
# Start in development mode
npm start

# Enable dev tools (uncomment in main.js)
# mainWindow.webContents.openDevTools();
```

## Keyboard Shortcuts

- `Ctrl/Cmd + R` - Reload the app
- `Ctrl/Cmd + Shift + I` - Toggle Developer Tools
- `Ctrl/Cmd + Q` - Quit the app

## Features in Detail

### Always on Top
Use File → Always on Top to keep the window above other applications.

### Screen Capture
The app can capture your entire screen to detect cards automatically using OCR.

### Odds Calculation
See probabilities for:
- Win percentage
- Push (tie) percentage
- Loss percentage
- Dealer bust percentage

### Expected Value
Compare EV for different actions:
- Hit EV
- Stand EV
- Double EV

## Troubleshooting

### OCR Not Working

If card recognition fails:
1. Check your internet connection (Tesseract.js loads from CDN)
2. Try using Manual Input mode as a fallback
3. Ensure cards are clearly visible in the screenshot
4. Check the console for detailed error messages

### App Won't Start

1. Make sure Node.js is installed: `node --version`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Try running with: `npm start`

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.
