// Blackjack Helper Desktop App
// Main application logic

(function() {
  'use strict';

  // State management
  let playerCards = [];
  let dealerCard = '';
  let detectedPlayerCards = [];
  let detectedDealerCard = '';

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initializeApp);

  function initializeApp() {
    console.log('Initializing Blackjack Helper Desktop App...');
    
    // Initialize event listeners
    initializeEventListeners();
    initializeTabSwitching();
    
    console.log('Blackjack Helper initialized successfully');
  }

  function initializeEventListeners() {
    const calculateBtn = document.getElementById('bj-calculate');
    const clearBtn = document.getElementById('bj-clear');
    const addCardBtn = document.getElementById('bj-add-card');
    const playerCardsInput = document.getElementById('bj-player-cards');
    const dealerCardInput = document.getElementById('bj-dealer-card');
    
    // OCR buttons
    const captureScreenBtn = document.getElementById('bj-capture-screen');
    const useDetectedBtn = document.getElementById('bj-use-detected');

    if (calculateBtn) {
      calculateBtn.addEventListener('click', calculateStrategy);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', clearInputs);
    }

    if (addCardBtn) {
      addCardBtn.addEventListener('click', addCard);
    }

    if (captureScreenBtn) {
      captureScreenBtn.addEventListener('click', captureAndDetect);
    }
    
    if (useDetectedBtn) {
      useDetectedBtn.addEventListener('click', useDetectedCards);
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

  function initializeTabSwitching() {
    const manualTab = document.getElementById('bj-tab-manual');
    const ocrTab = document.getElementById('bj-tab-ocr');
    const manualPanel = document.getElementById('bj-manual-panel');
    const ocrPanel = document.getElementById('bj-ocr-panel');

    if (manualTab) {
      manualTab.addEventListener('click', function() {
        manualTab.classList.add('active');
        ocrTab.classList.remove('active');
        manualPanel.classList.add('active');
        ocrPanel.classList.remove('active');
      });
    }

    if (ocrTab) {
      ocrTab.addEventListener('click', function() {
        ocrTab.classList.add('active');
        manualTab.classList.remove('active');
        ocrPanel.classList.add('active');
        manualPanel.classList.remove('active');
      });
    }
  }

  // Parse card input
  function parseCards(input) {
    if (!input) return [];
    return input.split(',').map(c => c.trim().toUpperCase()).filter(c => c);
  }

  // Add card to player's hand
  function addCard() {
    const input = document.getElementById('bj-player-cards');
    const cardValue = input.value.trim().toUpperCase();
    
    if (cardValue) {
      playerCards.push(cardValue);
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
        <span class="bj-stat-value">${(odds.win * 100).toFixed(1)}%</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Push:</span>
        <span class="bj-stat-value">${(odds.push * 100).toFixed(1)}%</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Lose:</span>
        <span class="bj-stat-value">${(odds.loss * 100).toFixed(1)}%</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Dealer Bust:</span>
        <span class="bj-stat-value">${(odds.dealerBust * 100).toFixed(1)}%</span>
      </div>
    `;

    // Display expected value
    const evDisplay = document.getElementById('bj-ev-display');
    evDisplay.innerHTML = `
      <div class="bj-stat">
        <span class="bj-stat-label">Hit EV:</span>
        <span class="bj-stat-value ${ev.hit >= 0 ? 'positive' : 'negative'}">${ev.hit > 0 ? '+' : ''}${ev.hit.toFixed(3)}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Stand EV:</span>
        <span class="bj-stat-value ${ev.stand >= 0 ? 'positive' : 'negative'}">${ev.stand > 0 ? '+' : ''}${ev.stand.toFixed(3)}</span>
      </div>
      <div class="bj-stat">
        <span class="bj-stat-label">Double EV:</span>
        <span class="bj-stat-value ${ev.double >= 0 ? 'positive' : 'negative'}">${ev.double > 0 ? '+' : ''}${ev.double.toFixed(3)}</span>
      </div>
    `;

    // Show results section
    resultsSection.style.display = 'block';
  }

  // Clear all inputs
  function clearInputs() {
    document.getElementById('bj-player-cards').value = '';
    document.getElementById('bj-dealer-card').value = '';
    playerCards = [];
    dealerCard = '';
    updatePlayerDisplay();
    document.getElementById('bj-results').style.display = 'none';
  }

  // OCR Functions
  async function captureAndDetect() {
    const statusDiv = document.getElementById('bj-ocr-status');
    const previewDiv = document.getElementById('bj-ocr-preview');
    const resultsDiv = document.getElementById('bj-ocr-results');
    const detectedCardsDiv = document.getElementById('bj-detected-cards');
    
    try {
      // Show loading status
      statusDiv.innerHTML = '<p class="bj-loading">📸 Capturing screen and detecting cards... This may take a moment.</p>';
      previewDiv.innerHTML = '';
      resultsDiv.style.display = 'none';
      
      // Capture the screen using Electron API
      const imageData = await window.electronAPI.captureScreen();
      
      // Show image preview
      const img = document.createElement('img');
      img.src = imageData;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '4px';
      previewDiv.appendChild(img);
      
      // Process with OCR
      const cards = await recognizeCards(imageData);
      
      if (cards.length === 0) {
        statusDiv.innerHTML = '<p class="bj-error">No cards detected. Make sure cards are visible on the screen.</p>';
        return;
      }
      
      // Card assignment logic: assumes first N-1 cards are player cards,
      // and the last card is the dealer's upcard (for images with 3+ cards)
      // For 1-2 cards, all are treated as player cards
      if (cards.length >= 2) {
        detectedPlayerCards = cards.slice(0, -1);
        detectedDealerCard = cards[cards.length - 1];
      } else {
        detectedPlayerCards = cards;
        detectedDealerCard = '';
      }
      
      // Display results
      statusDiv.innerHTML = '<p class="bj-success">✅ Cards detected successfully!</p>';
      detectedCardsDiv.innerHTML = `
        <strong>Player:</strong> ${detectedPlayerCards.join(', ')}<br>
        ${detectedDealerCard ? '<strong>Dealer:</strong> ' + detectedDealerCard : ''}
      `;
      resultsDiv.style.display = 'block';
      
    } catch (error) {
      console.error('Screen capture error:', error);
      
      // Check if this is an OCR loading error
      if (error.isOCRLoadError) {
        statusDiv.innerHTML = `
          <div class="bj-error">
            <p><strong>❌ OCR Library Unavailable</strong></p>
            <p>Unable to load the card recognition library. This might be due to network issues.</p>
            <p><strong>💡 Solution:</strong> Use the <a href="#" id="bj-switch-to-manual" style="color: #4CAF50; text-decoration: underline;">Manual Input</a> tab to enter cards directly.</p>
            <details style="margin-top: 10px;">
              <summary style="cursor: pointer; color: #888;">Technical Details</summary>
              <pre style="font-size: 11px; margin-top: 5px; white-space: pre-wrap;">${error.technicalDetails || 'See console for more information.'}</pre>
            </details>
          </div>
        `;
        
        // Add click handler for manual switch link
        const switchLink = document.getElementById('bj-switch-to-manual');
        if (switchLink) {
          switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            const manualTab = document.getElementById('bj-tab-manual');
            if (manualTab) manualTab.click();
          });
        }
      } else {
        // Other errors (screen capture, etc.)
        statusDiv.innerHTML = `<p class="bj-error">Error: ${error.message}</p>`;
      }
    }
  }

  function useDetectedCards() {
    playerCards = [...detectedPlayerCards];
    dealerCard = detectedDealerCard;
    
    // Switch to manual tab and show results
    document.getElementById('bj-tab-manual').click();
    
    // Update inputs
    document.getElementById('bj-player-cards').value = '';
    document.getElementById('bj-dealer-card').value = dealerCard;
    
    // Update display
    updatePlayerDisplay();
    
    // Calculate automatically
    calculateStrategy();
  }

})();
