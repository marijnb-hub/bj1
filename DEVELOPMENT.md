# Development Guide - Blackjack Helper Desktop

## 🛠️ Development Setup

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Git

### Getting Started

1. **Clone and Install**
   ```bash
   git clone https://github.com/marijnb-hub/bj1.git
   cd bj1
   npm install
   ```

2. **Start Development**
   ```bash
   npm start
   ```

## 📂 Project Structure

```
/bj1
├── /assets              # Application icons and images
│   ├── icon.png        # Main app icon (512x512)
│   ├── icon.svg        # Vector icon source
│   └── icon-readme.txt # Icon creation guide
├── /src
│   ├── /ocr            # OCR module using Tesseract.js
│   │   └── cardRecognition.js
│   ├── /strategy       # Blackjack strategy logic
│   │   └── blackjackStrategy.js
│   ├── main.js         # Electron main process
│   └── renderer.js     # Renderer process (UI logic)
├── index.html          # Main UI template
├── style.css           # Application styles
├── package.json        # Node.js configuration
├── manifest.json       # Legacy browser extension manifest (not used)
└── README.md           # User documentation
```

## 🔧 Key Technologies

### Electron.js
- **Main Process** (`src/main.js`): Manages app lifecycle, native APIs
- **Renderer Process** (`src/renderer.js`): Handles UI interactions
- **IPC Communication**: Screen capture functionality

### Tesseract.js
- OCR engine for card recognition
- Processes uploaded images and screen captures
- Extracts card values and suits

### Blackjack Strategy
- Implements basic strategy for:
  - Hard hands (no ace or ace counted as 1)
  - Soft hands (ace counted as 11)
  - Pair splitting
- Returns optimal actions: Hit, Stand, Double, Split

## 🎯 Features

### 1. Manual Input Tab
- Select player cards (2 cards)
- Select dealer's visible card
- Get strategic advice based on basic strategy

### 2. OCR Scan Tab
- Upload screenshot/image
- Capture screen directly
- Automatic card detection
- Parse card values and suits

### 3. Strategy Table Tab
- Display full basic strategy tables
- Color-coded actions:
  - Red (H): Hit
  - Green (S): Stand
  - Yellow (D): Double
  - Blue (P): Split

## 🚀 Building for Production

### Build All Platforms
```bash
npm run build
```

### Platform-Specific Builds
```bash
npm run build:win    # Windows (NSIS installer)
npm run build:mac    # macOS (DMG)
npm run build:linux  # Linux (AppImage, DEB)
```

Build outputs are located in `dist/` directory.

## 🧪 Testing

### Strategy Module Test
```bash
node -e "const S = require('./src/strategy/blackjackStrategy'); const s = new S(); console.log(s.getAdvice(['K♠', 'A♥'], '10♠'));"
```

### Syntax Validation
```bash
node -c src/main.js
node -c src/renderer.js
node -c src/ocr/cardRecognition.js
node -c src/strategy/blackjackStrategy.js
```

## 📝 Development Notes

### Adding New Features

1. **New Strategy Rules**
   - Edit `src/strategy/blackjackStrategy.js`
   - Update the strategy tables (hardStrategy, softStrategy, pairStrategy)

2. **Improving OCR**
   - Modify `src/ocr/cardRecognition.js`
   - Adjust Tesseract.js configuration
   - Enhance card pattern recognition

3. **UI Changes**
   - HTML: `index.html`
   - CSS: `style.css`
   - JavaScript: `src/renderer.js`

### Electron Configuration

The app uses:
- `nodeIntegration: true` - Allows Node.js in renderer
- `contextIsolation: false` - Simplifies IPC
- For production, consider enabling security features

### Icon Guidelines

Icons should be:
- **Main Icon**: 512x512 PNG
- **Windows**: .ico format recommended
- **macOS**: .icns format recommended
- **Linux**: PNG works well

Use the provided SVG source (`assets/icon.svg`) as a starting point.

## 🐛 Common Issues

### Issue: Electron won't start
**Solution**: Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: OCR not working
**Solution**: Ensure image quality is good, cards are clearly visible

### Issue: Build fails
**Solution**: Check Electron and electron-builder versions
```bash
npm audit fix
```

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Blackjack Basic Strategy](https://wizardofodds.com/games/blackjack/strategy/calculator/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
