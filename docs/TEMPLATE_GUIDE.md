# Template Creation Guide

This guide explains how to create card templates for the Blackjack Helper Vision tool.

## Why Templates Are Needed

The application uses **template matching** - a computer vision technique where it compares regions of the captured screen with pre-saved images (templates) of cards. The better your templates, the more accurate the detection.

## Quick Start

### Option 1: Screenshot from Your Game (Recommended)

1. **Play a few hands** of blackjack in your browser or app
2. **Take screenshots** when cards are clearly visible
3. **Crop individual cards** from the screenshots
4. **Save with the naming convention** below

### Option 2: Use Playing Card Images

1. Find or create images of playing cards
2. Ensure they match the visual style of your game
3. Crop to show just the card face
4. Save with the naming convention

## Naming Convention

Files must be named: `{rank}_{suit}.png`

### Valid Ranks:
- `A` - Ace
- `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10` - Number cards
- `J` - Jack
- `Q` - Queen
- `K` - King

### Valid Suits:
- `spades` - ♠ (black)
- `hearts` - ♥ (red)
- `clubs` - ♣ (black)
- `diamonds` - ♦ (red)

### Examples:
```
A_spades.png      # Ace of Spades
2_hearts.png      # 2 of Hearts
10_clubs.png      # 10 of Clubs
K_diamonds.png    # King of Diamonds
J_spades.png      # Jack of Spades
Q_hearts.png      # Queen of Hearts
```

## Template Requirements

### Image Specifications:
- **Format**: PNG (preferred) or JPG
- **Size**: Approximately 100x140 pixels (aspect ratio ~0.7)
- **Resolution**: Clear and sharp, not blurry
- **Background**: Should match your game's card background
- **Orientation**: Upright (not rotated)

### Quality Tips:
1. **Good Lighting**: Templates should have consistent lighting
2. **No Shadows**: Avoid shadows or glare on the cards
3. **Clear Symbols**: Rank and suit should be clearly visible
4. **Full Card**: Include the entire card face in the template
5. **Consistent Style**: All templates should be from the same card deck

## Step-by-Step: Creating Templates from Screenshots

### 1. Capture Screenshots

```bash
# Start your blackjack game
# Play until you can see different cards clearly
# Take screenshots (use your OS screenshot tool)
# Windows: Win + Shift + S
# macOS: Cmd + Shift + 4
# Linux: Usually Print Screen or Shift + Print Screen
```

### 2. Crop Individual Cards

Use any image editor:
- **Windows**: Paint, GIMP, or Photoshop
- **macOS**: Preview, GIMP, or Photoshop
- **Linux**: GIMP, Krita, or ImageMagick

**Steps:**
1. Open your screenshot
2. Use the crop/selection tool
3. Select just one card (include some border)
4. Crop and save as a new file
5. Resize to approximately 100x140 pixels if needed
6. Repeat for each unique card

### 3. Using Command Line Tools (Advanced)

If you have ImageMagick installed:

```bash
# Resize all images to standard size
mogrify -resize 100x140! *.png

# Convert JPG to PNG
mogrify -format png *.jpg

# Optimize PNG files
optipng *.png
```

### 4. Organize Templates

```
assets/templates/
├── A_spades.png
├── A_hearts.png
├── A_clubs.png
├── A_diamonds.png
├── 2_spades.png
├── 2_hearts.png
...
├── K_clubs.png
└── K_diamonds.png
```

## Testing Your Templates

1. **Place templates** in `/assets/templates/`
2. **Start the application**: `npm start`
3. **Select your game window**
4. **Click "Start Capture"**
5. **Check the detection results**

### Troubleshooting Detection Issues:

**Cards not being detected?**
- Ensure template filenames follow the exact naming convention
- Check that templates match your game's card style
- Verify templates are clear and not blurry
- Try adjusting the confidence threshold in `cardDetector.js`

**Low confidence scores (<70%)?**
- Create new templates with better quality
- Ensure consistent lighting between templates and game
- Make sure card size in game matches template aspect ratio

**Wrong cards detected?**
- Some cards may look similar (e.g., 6 and 9)
- Create multiple templates for problematic cards
- Ensure templates show clear distinguishing features

## Minimum Required Templates

You need **52 templates** total (13 ranks × 4 suits) for full functionality.

However, you can start with fewer for testing:
- **Minimum for testing**: 10-15 templates of commonly seen cards
- **Recommended**: All 52 templates for complete coverage

## Example: Quick Template Set

For quick testing, create templates for these common cards:
```
A_spades.png, A_hearts.png
2_spades.png, 2_hearts.png
5_spades.png, 5_hearts.png
6_spades.png, 6_hearts.png
7_spades.png, 7_hearts.png
8_spades.png, 8_hearts.png
9_spades.png, 9_hearts.png
10_spades.png, 10_hearts.png
J_spades.png, J_hearts.png
Q_spades.png, Q_hearts.png
K_spades.png, K_hearts.png
```

## Advanced: Multiple Card Styles

If your game uses different card styles or skins:

1. Create a subdirectory for each style:
```
assets/templates/
├── classic/
│   ├── A_spades.png
│   └── ...
└── modern/
    ├── A_spades.png
    └── ...
```

2. Modify `cardDetector.js` to load from the appropriate directory
3. Add a UI option to switch between template sets

## Tips for Best Results

1. **Consistency is Key**: All templates should be from the same moment/lighting
2. **Test Iteratively**: Start with a few cards, test, then add more
3. **Document Your Process**: Note which game/settings you used
4. **Version Control**: Keep templates in version control (they're small PNG files)
5. **Share Templates**: If you create good templates, share them with others!

## Need Help?

If you're having trouble creating templates:
1. Check the application logs for detection details
2. Try adjusting confidence threshold in the code
3. Ensure your game window is at a consistent size
4. Consider creating templates at different scales

## Example Workflow

```bash
# 1. Play blackjack and take screenshots
# Save to: ~/Downloads/blackjack_screenshots/

# 2. Crop cards (manually or with script)
# Save cropped cards with proper names

# 3. Copy to templates directory
cp ~/Downloads/cropped_cards/*.png /path/to/bj1/assets/templates/

# 4. Verify naming
cd /path/to/bj1/assets/templates
ls -1

# 5. Test
cd /path/to/bj1
npm start
```

That's it! With good templates, the application should accurately detect cards in your blackjack games.
