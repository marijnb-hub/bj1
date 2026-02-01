// Content script for Blackjack Helper
// This script injects an overlay into the page to display blackjack advice

(function() {
  'use strict';

  // Check if overlay already exists to prevent duplicate injection
  if (document.getElementById('blackjack-helper-overlay')) {
    return;
  }

  // State management
  let playerCards = [];
  let dealerCard = '';

  // Create the overlay container
  const overlay = document.createElement('div');
  overlay.id = 'blackjack-helper-overlay';
  overlay.className = 'bj-helper-overlay';

  // Create the header
  const header = document.createElement('div');
  header.className = 'bj-helper-header';
  header.innerHTML = '<h3>Blackjack Helper</h3>';

  // Create the content area
  const content = document.createElement('div');
  content.className = 'bj-helper-content';
  content.innerHTML = `
    <div class="bj-helper-panel">
      <div class="bj-input-section">
        <label class="bj-label">Your Cards:</label>
        <div class="bj-card-input">
          <input type="text" id="bj-player-cards" placeholder="e.g., 10,7 or K,A" class="bj-input">
          <button id="bj-add-card" class="bj-btn-small">Add Card</button>
        </div>
        <div id="bj-player-display" class="bj-card-display"></div>
        
        <label class="bj-label">Dealer Card:</label>
        <input type="text" id="bj-dealer-card" placeholder="e.g., 7 or K" class="bj-input">
        
        <button id="bj-calculate" class="bj-btn-primary">Calculate</button>
        <button id="bj-clear" class="bj-btn-secondary">Clear</button>
      </div>
      
      <div id="bj-results" class="bj-results-section" style="display: none;">
        <div class="bj-recommendation">
          <h4>Recommendation:</h4>
          <p id="bj-action" class="bj-action-text"></p>
        </div>
        
        <div class="bj-hand-info">
          <h4>Hand Analysis:</h4>
          <p id="bj-hand-total"></p>
        </div>
        
        <div class="bj-odds">
          <h4>Odds:</h4>
          <div id="bj-odds-display"></div>
        </div>
        
        <div class="bj-ev">
          <h4>Expected Value:</h4>
          <div id="bj-ev-display"></div>
        </div>
      </div>
    </div>
  `;

  // Create a close button
  const closeButton = document.createElement('button');
  closeButton.className = 'bj-helper-close';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', function() {
    overlay.style.display = 'none';
  });

  // Assemble the overlay
  header.appendChild(closeButton);
  overlay.appendChild(header);
  overlay.appendChild(content);

  // Inject the overlay into the page
  document.body.appendChild(overlay);

  console.log('Blackjack Helper overlay injected successfully');

  // Initialize event listeners
  function initializeEventListeners() {
    const calculateBtn = document.getElementById('bj-calculate');
    const clearBtn = document.getElementById('bj-clear');
    const addCardBtn = document.getElementById('bj-add-card');
    const playerCardsInput = document.getElementById('bj-player-cards');
    const dealerCardInput = document.getElementById('bj-dealer-card');

    if (calculateBtn) {
      calculateBtn.addEventListener('click', calculateStrategy);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', clearInputs);
    }

    if (addCardBtn) {
      addCardBtn.addEventListener('click', addPlayerCard);
    }

    // Allow Enter key to calculate
    if (playerCardsInput) {
      playerCardsInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateStrategy();
      });
    }

    if (dealerCardInput) {
      dealerCardInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateStrategy();
      });
    }
  }

  // Parse card input
  function parseCards(input) {
    if (!input) return [];
    return input.split(',')
      .map(card => card.trim().toUpperCase())
      .filter(card => card.length > 0);
  }

  // Add card to player hand
  function addPlayerCard() {
    const input = document.getElementById('bj-player-cards');
    const display = document.getElementById('bj-player-display');
    const cards = parseCards(input.value);
    
    if (cards.length > 0) {
      playerCards = playerCards.concat(cards);
      input.value = '';
      updatePlayerDisplay();
    }
  }

  // Update player cards display
  function updatePlayerDisplay() {
    const display = document.getElementById('bj-player-display');
    if (playerCards.length > 0) {
      display.innerHTML = `<strong>Cards:</strong> ${playerCards.join(', ')}`;
      display.style.display = 'block';
    } else {
      display.style.display = 'none';
    }
  }

  // Calculate strategy and display results
  function calculateStrategy() {
    const playerCardsInput = document.getElementById('bj-player-cards');
    const dealerCardInput = document.getElementById('bj-dealer-card');
    const resultsSection = document.getElementById('bj-results');

    // Get cards from input or use stored cards
    const inputCards = parseCards(playerCardsInput.value);
    if (inputCards.length > 0) {
      playerCards = inputCards;
    }

    dealerCard = dealerCardInput.value.trim().toUpperCase();

    // Validate inputs
    if (playerCards.length === 0) {
      alert('Please enter your cards');
      return;
    }

    if (!dealerCard) {
      alert('Please enter dealer card');
      return;
    }

    // Calculate strategy
    const action = getBasicStrategy(playerCards, dealerCard);
    const odds = calculateOdds(playerCards, dealerCard);
    const ev = calculateExpectedValue(playerCards, dealerCard);
    const hand = evaluateHand(playerCards);

    // Display results
    const actionText = document.getElementById('bj-action');
    actionText.textContent = action.toUpperCase();
    actionText.className = 'bj-action-text bj-action-' + action;

    // Display hand info
    const handTotal = document.getElementById('bj-hand-total');
    let handInfo = `Total: ${hand.total}`;
    if (hand.isSoft) handInfo += ' (Soft)';
    if (hand.isPair) handInfo += ' (Pair)';
    handTotal.textContent = handInfo;

    // Display odds
    const oddsDisplay = document.getElementById('bj-odds-display');
    oddsDisplay.innerHTML = `
      <div class="bj-stat">
        <span class="bj-stat-label">Win:</span>
        <span class="bj-stat-value bj-stat-win">${odds.win}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Push:</span>
        <span class="bj-stat-value">${odds.push}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Loss:</span>
        <span class="bj-stat-value bj-stat-loss">${odds.loss}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Dealer Bust:</span>
        <span class="bj-stat-value bj-stat-win">${odds.dealerBust}</span>
      </div>
    `;

    // Display EV
    const evDisplay = document.getElementById('bj-ev-display');
    evDisplay.innerHTML = `
      <div class="bj-stat">
        <span class="bj-stat-label">Hit:</span>
        <span class="bj-stat-value">${ev.hit}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Stand:</span>
        <span class="bj-stat-value">${ev.stand}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Double:</span>
        <span class="bj-stat-value">${ev.double}</span>
      </div>
    `;

    // Show results
    resultsSection.style.display = 'block';
    updatePlayerDisplay();
  }

  // Clear all inputs
  function clearInputs() {
    document.getElementById('bj-player-cards').value = '';
    document.getElementById('bj-dealer-card').value = '';
    document.getElementById('bj-results').style.display = 'none';
    playerCards = [];
    dealerCard = '';
    updatePlayerDisplay();
  }

  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventListeners);
  } else {
    initializeEventListeners();
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleOverlay') {
      const overlay = document.getElementById('blackjack-helper-overlay');
      if (overlay) {
        const isVisible = overlay.style.display !== 'none';
        overlay.style.display = isVisible ? 'none' : 'block';
        sendResponse({ visible: !isVisible });
      } else {
        sendResponse({ visible: false });
      }
    }
    return true; // Keep the message channel open for async response
  });
})();
