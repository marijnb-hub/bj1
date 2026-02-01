// Logic module for Blackjack strategy calculations
// This file contains the core blackjack strategy logic

/**
 * Get the numeric value of a card
 * @param {string} card - Card value (A, 2-10, J, Q, K)
 * @returns {number} - Numeric value of the card
 */
function getCardValue(card) {
  if (card === 'A') return 11;
  if (['J', 'Q', 'K'].includes(card)) return 10;
  return parseInt(card);
}

/**
 * Calculate hand total and determine if it's soft (contains usable Ace)
 * @param {Array} cards - Array of card values
 * @returns {Object} - {total: number, isSoft: boolean, isPair: boolean}
 */
function evaluateHand(cards) {
  if (!cards || cards.length === 0) {
    return { total: 0, isSoft: false, isPair: false };
  }

  let total = 0;
  let aces = 0;

  // Calculate initial total
  for (let card of cards) {
    const value = getCardValue(card);
    total += value;
    if (card === 'A') aces++;
  }

  // Adjust for aces (make them worth 1 instead of 11 if busting)
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  const isSoft = aces > 0 && total <= 21;
  const isPair = cards.length === 2 && cards[0] === cards[1];

  return { total, isSoft, isPair };
}

/**
 * Basic strategy for blackjack
 * Based on standard basic strategy chart
 * @param {Array} playerCards - Array of player's cards
 * @param {string} dealerCard - Dealer's visible card
 * @returns {string} - Recommended action (hit, stand, double, split)
 */
function getBasicStrategy(playerCards, dealerCard) {
  const hand = evaluateHand(playerCards);
  const dealerValue = getCardValue(dealerCard);

  // Handle pairs
  if (hand.isPair) {
    const pairCard = playerCards[0];
    
    // Always split Aces and 8s
    if (pairCard === 'A' || pairCard === '8') return 'split';
    
    // Never split 5s and 10s
    if (pairCard === '5' || getCardValue(pairCard) === 10) {
      // Fall through to regular strategy
    } else if (pairCard === '9') {
      // Split 9s except against 7, 10, or Ace
      if (dealerValue !== 7 && dealerValue !== 10 && dealerCard !== 'A') return 'split';
    } else if (pairCard === '7') {
      // Split 7s against 2-7
      if (dealerValue >= 2 && dealerValue <= 7) return 'split';
    } else if (pairCard === '6') {
      // Split 6s against 2-6
      if (dealerValue >= 2 && dealerValue <= 6) return 'split';
    } else if (pairCard === '4') {
      // Split 4s against 5-6
      if (dealerValue === 5 || dealerValue === 6) return 'split';
    } else if (pairCard === '2' || pairCard === '3') {
      // Split 2s and 3s against 2-7
      if (dealerValue >= 2 && dealerValue <= 7) return 'split';
    }
  }

  // Handle soft hands (hands with Ace counted as 11)
  if (hand.isSoft && hand.total <= 21) {
    if (hand.total >= 19) return 'stand';
    if (hand.total === 18) {
      if (dealerValue >= 9 || dealerCard === 'A') return 'hit';
      if (dealerValue >= 3 && dealerValue <= 6) return 'double';
      return 'stand';
    }
    // Soft 17 or less
    if (dealerValue >= 4 && dealerValue <= 6) return 'double';
    return 'hit';
  }

  // Handle hard hands
  if (hand.total >= 17) return 'stand';
  if (hand.total >= 13) {
    // Stand on 13-16 against dealer 2-6
    if (dealerValue >= 2 && dealerValue <= 6) return 'stand';
    return 'hit';
  }
  if (hand.total === 12) {
    // Stand on 12 against dealer 4-6
    if (dealerValue >= 4 && dealerValue <= 6) return 'stand';
    return 'hit';
  }
  if (hand.total === 11) {
    return 'double';
  }
  if (hand.total === 10) {
    // Double against 2-9
    if (dealerValue >= 2 && dealerValue <= 9) return 'double';
    return 'hit';
  }
  if (hand.total === 9) {
    // Double against 3-6
    if (dealerValue >= 3 && dealerValue <= 6) return 'double';
    return 'hit';
  }

  // Hit on 8 or less
  return 'hit';
}

/**
 * Calculate expected value for different actions
 * Simplified calculation based on basic probabilities
 * @param {Array} playerCards - Array of player's cards
 * @param {string} dealerCard - Dealer's visible card
 * @returns {Object} - Expected value for each action
 */
function calculateExpectedValue(playerCards, dealerCard) {
  const hand = evaluateHand(playerCards);
  const dealerValue = getCardValue(dealerCard);
  
  // Simplified EV calculations (in real implementation, would use detailed simulations)
  const baseWinProb = 0.5;
  const dealerBustProb = dealerValue >= 2 && dealerValue <= 6 ? 0.42 : 
                        dealerValue >= 7 && dealerValue <= 9 ? 0.26 : 0.17;
  
  let evHit = 0;
  let evStand = 0;
  let evDouble = 0;
  
  // Calculate EV for standing
  if (hand.total <= 21) {
    const playerWinProb = dealerBustProb + (hand.total >= 17 ? 0.2 : 0.1);
    evStand = playerWinProb - (1 - playerWinProb);
  } else {
    evStand = -1; // Busted
  }
  
  // Calculate EV for hitting (simplified)
  // Bust probability based on current total: (total - 11) / 13
  // where 11 is the minimum total to potentially bust on next card,
  // and 13 is the number of different card ranks (A-K)
  const bustProb = hand.total >= 12 ? (hand.total - 11) / 13 : 0;
  evHit = (1 - bustProb) * 0.1 - bustProb;
  
  // Double has similar EV to hit but with double stake
  evDouble = evHit * 1.8;
  
  return {
    hit: evHit.toFixed(3),
    stand: evStand.toFixed(3),
    double: evDouble.toFixed(3)
  };
}

/**
 * Calculate odds for the current hand
 * @param {Array} playerCards - Array of player's cards
 * @param {string} dealerCard - Dealer's visible card
 * @returns {Object} - Odds for different outcomes
 */
function calculateOdds(playerCards, dealerCard) {
  const hand = evaluateHand(playerCards);
  const dealerValue = getCardValue(dealerCard);
  
  // Dealer bust probabilities based on upcard
  const dealerBustProb = {
    2: 0.35, 3: 0.37, 4: 0.40, 5: 0.42, 6: 0.42,
    7: 0.26, 8: 0.24, 9: 0.23, 10: 0.21, 'A': 0.17
  };
  
  const bustProb = dealerBustProb[dealerCard] || dealerBustProb[dealerValue] || 0.23;
  
  // Player win probability (simplified)
  let winProb = 0.42;
  if (hand.total >= 17 && hand.total <= 21) {
    winProb = 0.45 + (bustProb * 0.5);
  } else if (hand.total <= 11) {
    winProb = 0.50;
  } else if (hand.total >= 12 && hand.total <= 16) {
    winProb = 0.35 + (bustProb * 0.3);
  }
  
  // Ensure probabilities sum to ~1
  const pushProb = 0.08;
  const lossProb = 1 - winProb - pushProb;
  
  return {
    win: (winProb * 100).toFixed(1) + '%',
    push: (pushProb * 100).toFixed(1) + '%',
    loss: (lossProb * 100).toFixed(1) + '%',
    dealerBust: (bustProb * 100).toFixed(1) + '%'
  };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getBasicStrategy,
    calculateExpectedValue,
    calculateOdds,
    evaluateHand,
    getCardValue
  };
}
