# Quick Start Guide

Get started with Blackjack Helper Vision in 5 minutes!

## Prerequisites

Before you begin, make sure you have:
- **Node.js** v16 or higher ([Download here](https://nodejs.org/))
- A blackjack game to play (browser-based or desktop app)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/marijnb-hub/bj1.git
cd bj1
```

### Step 2: Install Dependencies

```bash
npm install
```

**Note**: OpenCV installation may take 5-10 minutes as it compiles native modules.

#### If Installation Fails

**Windows:**
```bash
npm install --global --production windows-build-tools
npm install
```

**macOS:**
```bash
brew install opencv
npm install
```

**Linux:**
```bash
sudo apt-get install build-essential libopencv-dev
npm install
```

## First Run (Demo Mode)

Even without card templates, you can run the app in demo mode:

```bash
npm start
```

You should see the main window open with:
- Control panel at the top
- Results display in the middle
- Usage instructions at the bottom

Click **"Start Capture"** to see demo results showing sample card detection and strategy advice.

## Adding Card Templates (For Real Detection)

To detect actual cards, you need to add card templates:

### Quick Method: Use Sample Templates

If you have sample templates (PNG images of cards):

1. Place them in `assets/templates/` directory
2. Name them like: `A_spades.png`, `K_hearts.png`, `10_clubs.png`
3. Restart the app

### Create Your Own Templates

1. **Play your blackjack game**
2. **Take screenshots** of the game with cards visible
3. **Crop individual cards** from the screenshots
4. **Save as PNG files** with naming: `{rank}_{suit}.png`
   - Example: `A_spades.png`, `7_hearts.png`, `K_diamonds.png`
5. **Copy to** `assets/templates/` directory

See [Template Guide](docs/TEMPLATE_GUIDE.md) for detailed instructions.

## Using the Application

### 1. Start the Application

```bash
npm start
```

### 2. Select Your Game Window

In the dropdown menu, select the window or screen where your blackjack game is running.

### 3. Start Detection

Click the **"Start Capture"** button. The app will:
- Capture screenshots every 2 seconds
- Detect cards using OpenCV
- Display detected cards and confidence scores
- Show strategy advice (Hit, Stand, Double, or Split)

### 4. View Results

- **Left panel**: Shows detected player cards and dealer card
- **Right panel**: Shows recommended strategy action
- **Status bar**: Shows current operation status

### 5. Stop Detection

Click **"Stop Capture"** when you're done playing.

## Understanding the Advice

The app provides four types of recommendations:

- **HIT** (Blue) - Take another card
- **STAND** (Red) - Keep your current hand
- **DOUBLE** (Orange) - Double your bet and take one more card
- **SPLIT** (Purple) - Split your pair into two hands

All recommendations follow basic blackjack strategy, which minimizes the house edge.

## Troubleshooting

### "OpenCV not available" Error

The app will run in demo mode. To fix:
1. Ensure you have build tools installed
2. Try: `npm install opencv4nodejs --build-from-source`
3. See [README](README.md#troubleshooting) for platform-specific fixes

### No Cards Detected

**Possible causes:**
- No templates in `assets/templates/` directory
- Templates don't match your game's card style
- Cards too small or blurry in the game

**Solutions:**
- Add or improve templates (see [Template Guide](docs/TEMPLATE_GUIDE.md))
- Increase game window size
- Ensure good contrast and lighting

### Low Confidence Scores

If confidence is below 70%, cards may not be detected:
- Create better quality templates
- Ensure templates match your game exactly
- Adjust confidence threshold in code (see [Development Guide](docs/DEVELOPMENT.md))

### Screen Capture Permission Denied

**macOS:** Go to System Preferences → Security & Privacy → Screen Recording → Allow the app

**Windows:** Run the app as Administrator

## Testing

Run the included tests to verify the strategy calculator:

```bash
npm test
```

You should see all tests pass:
```
🎉 All tests passed!
```

## Next Steps

Now that you have the app running:

1. **Create templates** for your specific blackjack game
2. **Test detection** with a few hands
3. **Adjust confidence** threshold if needed
4. **Play responsibly** - this is an educational tool

## Getting Help

- **Documentation**: Check [README.md](README.md) for full documentation
- **Template Guide**: See [docs/TEMPLATE_GUIDE.md](docs/TEMPLATE_GUIDE.md)
- **Development**: See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Issues**: Open a [GitHub Issue](https://github.com/marijnb-hub/bj1/issues)

## Tips for Best Results

1. **Use consistent window size** - Keep your game window at the same size
2. **Good lighting** - Ensure cards are well-lit and not in shadow
3. **Clear visibility** - Make sure cards are not overlapping or partially hidden
4. **Update templates** - If game updates change card appearance, update templates
5. **Test first** - Always test detection before relying on advice

## Building Executable

To create a distributable app:

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

The built app will be in the `dist/` directory.

## Important Notes

- This tool is for **educational purposes only**
- Always check local laws regarding gambling assistance tools
- Practice responsible gaming
- The app works completely **offline** - no data is sent anywhere

## Enjoy!

You're now ready to use Blackjack Helper Vision! Remember:
- Good templates = accurate detection
- Basic strategy reduces house edge
- Play responsibly

Happy gaming! 🎴
