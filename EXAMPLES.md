# Blackjack Helper Desktop - Usage Examples

## Quick Start

### Running the Application
```bash
npm start
```

## Features Walkthrough

### 1. Manual Card Input

**Scenario**: You're playing blackjack and have been dealt 10♠ and 6♥, dealer shows 9♠

**Steps**:
1. Open the app (it opens on the "Handmatige Invoer" tab by default)
2. Select your first card: `10♠`
3. Select your second card: `6♥`
4. Select dealer's card: `9♠`
5. Click "Krijg Advies"

**Expected Result**: 
- Action: "Hit (Kaart pakken)"
- Explanation: "Hard 16 vs dealer 9"

### 2. Using the Strategy Tables

**Scenario**: You want to study basic strategy

**Steps**:
1. Click the "Strategie Tabel" tab
2. Browse through three strategy tables:
   - **Hard Totals**: When you don't have an Ace or your Ace counts as 1
   - **Soft Totals**: When you have an Ace counting as 11
   - **Pair Splitting**: When you have two cards of the same value

**Legend**:
- 🔴 H (Hit) = Take another card
- 🟢 S (Stand) = Keep your current hand
- 🟡 D (Double) = Double your bet and take one more card
- 🔵 P (Split) = Split your pair into two hands

### 3. OCR Card Recognition

**Scenario**: You want to scan cards from a screenshot

**Steps**:
1. Click the "OCR Scan" tab
2. Click "Upload Afbeelding" to upload a screenshot
   - OR -
   Click "Schermopname" to capture your screen
3. Once the image appears, click "Analyseer Kaarten"
4. The app will detect and display the cards found

**Note**: For best results:
- Ensure cards are clearly visible
- Good lighting/contrast
- Cards should be in standard format (e.g., "A♠", "K♥")

## Common Scenarios

### Scenario 1: Pair of Aces
**Your hand**: A♠, A♥  
**Dealer shows**: 6♠  
**Advice**: "Split (Splitsen)" - Always split Aces

### Scenario 2: Soft 18
**Your hand**: A♠, 7♥  
**Dealer shows**: 9♠  
**Advice**: "Hit (Kaart pakken)" - Hit soft 18 vs dealer 9 or 10

### Scenario 3: Hard 11
**Your hand**: 5♠, 6♥  
**Dealer shows**: 9♠  
**Advice**: "Double (Verdubbelen)" - Always double on 11

### Scenario 4: Hard 17
**Your hand**: 10♠, 7♥  
**Dealer shows**: A♠  
**Advice**: "Stand (Blijven staan)" - Stand on all 17s

### Scenario 5: Pair of 8s
**Your hand**: 8♠, 8♥  
**Dealer shows**: 10♠  
**Advice**: "Split (Splitsen)" - Always split 8s

## Strategy Tips

### Basic Strategy Principles

1. **Hard Hands**:
   - Always stand on 17 or higher
   - Hit until you reach at least 17 when dealer shows 7 or higher
   - Be more conservative when dealer shows 4-6 (likely to bust)

2. **Soft Hands**:
   - You can be more aggressive with soft hands (can't bust on one hit)
   - Double down opportunities are more common
   - Soft 19-21: Always stand

3. **Pairs**:
   - Always split Aces and 8s
   - Never split 5s and 10s
   - Other pairs depend on dealer's card

4. **Doubling Down**:
   - Best on 10 or 11
   - Consider dealer's weak cards (4-6)
   - Don't double when dealer shows strong cards (9, 10, A)

## Keyboard Shortcuts

Currently, the app uses mouse/click interactions. Future versions may include:
- Tab navigation between fields
- Enter to submit
- Arrow keys for selection

## Troubleshooting

### Cards not being detected in OCR?
- Ensure the image has good contrast
- Cards should be clear and not overlapping
- Try uploading a different screenshot

### Wrong advice given?
- Double-check your card selections
- Verify you selected the correct dealer card
- Remember: This is basic strategy (not card counting)

### App won't start?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

## Advanced Usage

### Testing Different Scenarios

You can quickly test different scenarios by:
1. Selecting different card combinations
2. Comparing advice against the strategy tables
3. Learning the patterns for different dealer upcards

### Learning Basic Strategy

Use the Strategy Tables tab to:
1. Study one table at a time (hard, soft, pairs)
2. Quiz yourself: cover the table and try to recall the action
3. Practice with the Manual Input tab to verify your knowledge

## Credits

Basic strategy based on mathematical analysis of blackjack probability. This is the optimal strategy for standard blackjack rules (dealer stands on soft 17, double after split allowed, etc.).

## Disclaimer

This tool is for educational purposes only. Gambling involves risk. Please gamble responsibly.
