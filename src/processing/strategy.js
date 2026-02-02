/**
 * Blackjack strategy calculator
 * Provides optimal playing decisions based on player hand and dealer card
 */
class BlackjackStrategy {
  constructor() {
    // Basic strategy chart
    this.hardTotals = this.initHardTotals();
    this.softTotals = this.initSoftTotals();
    this.pairs = this.initPairs();
  }

  /**
   * Get the best action for a given situation
   * @param {Array} playerCards - Array of player card values
   * @param {Number} dealerCard - Dealer's visible card value
   * @returns {String} Recommended action (Hit, Stand, Double, Split)
   */
  getAdvice(playerCards, dealerCard) {
    if (playerCards.length < 2) {
      return 'Need at least 2 cards';
    }

    // Check for pairs
    if (playerCards.length === 2 && playerCards[0] === playerCards[1]) {
      return this.getPairAdvice(playerCards[0], dealerCard);
    }

    // Check for soft hand (Ace counted as 11)
    const hasAce = playerCards.includes(11);
    const total = this.calculateTotal(playerCards);

    if (hasAce && total <= 21) {
      return this.getSoftAdvice(total, dealerCard);
    }

    // Hard hand
    return this.getHardAdvice(total, dealerCard);
  }

  /**
   * Calculate hand total with Ace handling
   * @param {Array} cards - Array of card values
   * @returns {Number} Hand total
   */
  calculateTotal(cards) {
    let total = cards.reduce((sum, card) => sum + card, 0);
    let aces = cards.filter(card => card === 11).length;

    // Adjust for Aces if total is over 21
    while (total > 21 && aces > 0) {
      total -= 10; // Convert Ace from 11 to 1
      aces--;
    }

    return total;
  }

  /**
   * Get advice for hard totals (no Ace or Ace counted as 1)
   */
  getHardAdvice(total, dealerCard) {
    if (total >= 17) return 'Stand';
    if (total <= 8) return 'Hit';

    const key = `${total}-${dealerCard}`;
    return this.hardTotals[key] || 'Hit';
  }

  /**
   * Get advice for soft totals (Ace counted as 11)
   */
  getSoftAdvice(total, dealerCard) {
    if (total >= 19) return 'Stand';
    
    const key = `${total}-${dealerCard}`;
    return this.softTotals[key] || 'Hit';
  }

  /**
   * Get advice for pairs
   */
  getPairAdvice(pairValue, dealerCard) {
    const key = `${pairValue}-${dealerCard}`;
    return this.pairs[key] || 'Hit';
  }

  /**
   * Initialize hard totals strategy chart
   */
  initHardTotals() {
    const chart = {};
    
    // Total 9: Double on 3-6, otherwise Hit
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`9-${dealer}`] = (dealer >= 3 && dealer <= 6) ? 'Double' : 'Hit';
    }

    // Total 10: Double on 2-9, otherwise Hit
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`10-${dealer}`] = (dealer >= 2 && dealer <= 9) ? 'Double' : 'Hit';
    }

    // Total 11: Always Double
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`11-${dealer}`] = 'Double';
    }

    // Total 12: Stand on 4-6, otherwise Hit
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`12-${dealer}`] = (dealer >= 4 && dealer <= 6) ? 'Stand' : 'Hit';
    }

    // Total 13-16: Stand on 2-6, otherwise Hit
    for (let total = 13; total <= 16; total++) {
      for (let dealer = 2; dealer <= 11; dealer++) {
        chart[`${total}-${dealer}`] = (dealer >= 2 && dealer <= 6) ? 'Stand' : 'Hit';
      }
    }

    return chart;
  }

  /**
   * Initialize soft totals strategy chart
   */
  initSoftTotals() {
    const chart = {};

    // Soft 13-14: Hit on all, Double on 5-6
    for (let total = 13; total <= 14; total++) {
      for (let dealer = 2; dealer <= 11; dealer++) {
        chart[`${total}-${dealer}`] = (dealer >= 5 && dealer <= 6) ? 'Double' : 'Hit';
      }
    }

    // Soft 15-16: Hit on all, Double on 4-6
    for (let total = 15; total <= 16; total++) {
      for (let dealer = 2; dealer <= 11; dealer++) {
        chart[`${total}-${dealer}`] = (dealer >= 4 && dealer <= 6) ? 'Double' : 'Hit';
      }
    }

    // Soft 17: Hit on all, Double on 3-6
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`17-${dealer}`] = (dealer >= 3 && dealer <= 6) ? 'Double' : 'Hit';
    }

    // Soft 18: Stand on 2,7,8, Double on 3-6, Hit on 9-A
    for (let dealer = 2; dealer <= 11; dealer++) {
      if (dealer === 2 || dealer === 7 || dealer === 8) {
        chart[`18-${dealer}`] = 'Stand';
      } else if (dealer >= 3 && dealer <= 6) {
        chart[`18-${dealer}`] = 'Double';
      } else {
        chart[`18-${dealer}`] = 'Hit';
      }
    }

    return chart;
  }

  /**
   * Initialize pairs strategy chart
   */
  initPairs() {
    const chart = {};

    // Always split Aces and 8s
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`11-${dealer}`] = 'Split'; // Aces
      chart[`8-${dealer}`] = 'Split';
    }

    // Never split 5s and 10s
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`5-${dealer}`] = 'Double'; // Treat as 10
      chart[`10-${dealer}`] = 'Stand';
    }

    // Conditional splits for other pairs
    // 2s, 3s, 7s: Split on 2-7
    for (let pair of [2, 3, 7]) {
      for (let dealer = 2; dealer <= 11; dealer++) {
        chart[`${pair}-${dealer}`] = (dealer >= 2 && dealer <= 7) ? 'Split' : 'Hit';
      }
    }

    // 4s: Split on 5-6
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`4-${dealer}`] = (dealer >= 5 && dealer <= 6) ? 'Split' : 'Hit';
    }

    // 6s: Split on 2-6
    for (let dealer = 2; dealer <= 11; dealer++) {
      chart[`6-${dealer}`] = (dealer >= 2 && dealer <= 6) ? 'Split' : 'Hit';
    }

    // 9s: Split on 2-9 except 7
    for (let dealer = 2; dealer <= 11; dealer++) {
      if (dealer === 7 || dealer === 10 || dealer === 11) {
        chart[`9-${dealer}`] = 'Stand';
      } else {
        chart[`9-${dealer}`] = 'Split';
      }
    }

    return chart;
  }
}

module.exports = BlackjackStrategy;
