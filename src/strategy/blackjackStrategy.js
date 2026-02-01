class BlackjackStrategy {
  constructor() {
    // Basic strategy chart for hard hands
    this.hardStrategy = {
      // Player total: { dealer upcard: action }
      5: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      6: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      7: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      8: { 2: 'H', 3: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      9: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      10: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 'A': 'H' },
      11: { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'D', 'A': 'D' },
      12: { 2: 'H', 3: 'H', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      17: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
      18: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
      19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
      20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
      21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' }
    };

    // Soft hands (hands with Ace counted as 11)
    this.softStrategy = {
      13: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      14: { 2: 'H', 3: 'H', 4: 'H', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      15: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      16: { 2: 'H', 3: 'H', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      17: { 2: 'H', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      18: { 2: 'S', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'S', 8: 'S', 9: 'H', 10: 'H', 'A': 'H' },
      19: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
      20: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' },
      21: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' }
    };

    // Pair splitting strategy
    this.pairStrategy = {
      'A': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P', 'A': 'P' },
      '2': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      '3': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      '4': { 2: 'H', 3: 'H', 4: 'H', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      '5': { 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D', 8: 'D', 9: 'D', 10: 'H', 'A': 'H' },
      '6': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      '7': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'H', 9: 'H', 10: 'H', 'A': 'H' },
      '8': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P', 'A': 'P' },
      '9': { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'S', 8: 'P', 9: 'P', 10: 'S', 'A': 'S' },
      '10': { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', 7: 'S', 8: 'S', 9: 'S', 10: 'S', 'A': 'S' }
    };
  }

  getCardValue(card) {
    const rank = card.replace(/[♠♥♦♣]/g, '');
    if (rank === 'A') return 11;
    if (['K', 'Q', 'J'].includes(rank)) return 10;
    return parseInt(rank);
  }

  calculateHandValue(cards) {
    let total = 0;
    let aces = 0;

    for (const card of cards) {
      const value = this.getCardValue(card);
      total += value;
      if (card.startsWith('A')) aces++;
    }

    // Adjust for aces
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return { total, hasAce: aces > 0, softHand: aces > 0 && total <= 21 };
  }

  isPair(playerCards) {
    if (playerCards.length !== 2) return false;
    const rank1 = playerCards[0].replace(/[♠♥♦♣]/g, '');
    const rank2 = playerCards[1].replace(/[♠♥♦♣]/g, '');
    return rank1 === rank2;
  }

  getAdvice(playerCards, dealerCard) {
    if (!playerCards || playerCards.length === 0 || !dealerCard) {
      return { action: 'Invalid input', explanation: 'Please provide valid cards' };
    }

    const dealerRank = dealerCard.replace(/[♠♥♦♣]/g, '');
    const dealerValue = dealerRank === 'A' ? 'A' : this.getCardValue(dealerCard);

    // Check for pair
    if (this.isPair(playerCards)) {
      const pairRank = playerCards[0].replace(/[♠♥♦♣]/g, '');
      const action = this.pairStrategy[pairRank]?.[dealerValue] || 'H';
      return {
        action: this.translateAction(action),
        explanation: `Pair of ${pairRank}s vs dealer ${dealerRank}`,
        handType: 'pair'
      };
    }

    const handValue = this.calculateHandValue(playerCards);

    // Check for soft hand
    if (handValue.softHand) {
      const action = this.softStrategy[handValue.total]?.[dealerValue] || 'S';
      return {
        action: this.translateAction(action),
        explanation: `Soft ${handValue.total} vs dealer ${dealerRank}`,
        handType: 'soft'
      };
    }

    // Hard hand
    const action = this.hardStrategy[handValue.total]?.[dealerValue] || 'S';
    return {
      action: this.translateAction(action),
      explanation: `Hard ${handValue.total} vs dealer ${dealerRank}`,
      handType: 'hard'
    };
  }

  translateAction(action) {
    const actions = {
      'H': 'Hit (Kaart pakken)',
      'S': 'Stand (Blijven staan)',
      'D': 'Double (Verdubbelen)',
      'P': 'Split (Splitsen)'
    };
    return actions[action] || action;
  }
}

module.exports = BlackjackStrategy;
