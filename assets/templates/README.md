# Card Templates

This directory should contain card template images for OpenCV template matching.

## Structure

Create PNG images for each card in the format: `{rank}_{suit}.png`

### Ranks:
- A (Ace)
- 2, 3, 4, 5, 6, 7, 8, 9, 10
- J (Jack)
- Q (Queen)
- K (King)

### Suits:
- spades
- hearts
- clubs
- diamonds

### Examples:
- `A_spades.png` - Ace of Spades
- `K_hearts.png` - King of Hearts
- `10_clubs.png` - 10 of Clubs
- `7_diamonds.png` - 7 of Diamonds

## Template Creation

1. Take screenshots of cards from your blackjack game
2. Crop individual cards to roughly 100x140 pixels
3. Save with the naming convention above
4. Ensure good lighting and clear visibility of rank and suit

## Total Cards Needed

52 templates (13 ranks × 4 suits)
