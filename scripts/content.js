// Content script for Blackjack Helper
// This script injects an overlay into the page to display blackjack advice
// Works on all websites with proper error handling

(function() {
  'use strict';

  // Early exit if we're in an incompatible context
  if (!document.body) {
    console.log('Blackjack Helper: Document body not available yet, waiting...');
    // Wait for DOM to be ready with better handling
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeExtension);
    } else {
      // Use MutationObserver to watch for body element
      const observer = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          initializeExtension();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      // Fallback timeout after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        if (document.body) {
          initializeExtension();
        }
      }, 5000);
    }
    return;
  }

  initializeExtension();

  function initializeExtension() {
    try {
      // Check if we're in a valid context
      if (!document.body) {
        console.log('Blackjack Helper: Body still not available, skipping injection');
        return;
      }

      // Check if overlay already exists to prevent duplicate injection
      if (document.getElementById('blackjack-helper-overlay')) {
        console.log('Blackjack Helper: Overlay already exists, skipping injection');
        return;
      }

      // Skip if we're in an iframe (not the top-level window)
      // This saves resources by not injecting into embedded frames
      if (window !== window.top) {
        console.log('Blackjack Helper: In iframe, skipping injection to save resources');
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
      <div class="bj-tabs">
        <button id="bj-tab-manual" class="bj-tab active">Manual Input</button>
        <button id="bj-tab-ocr" class="bj-tab">OCR Recognition</button>
      </div>
      
      <div id="bj-manual-panel" class="bj-tab-panel active">
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
      </div>
      
      <div id="bj-ocr-panel" class="bj-tab-panel">
        <div class="bj-input-section">
          <label class="bj-label">Automatic Card Detection:</label>
          <p class="bj-info-text">Click the button below to automatically detect cards from the screen.</p>
          
          <button id="bj-capture-screen" class="bj-btn-primary" style="width: 100%; margin-bottom: 10px;">
            📸 Capture & Detect Cards
          </button>
          
          <button id="bj-select-region" class="bj-btn-secondary" style="width: 100%;">
            🎯 Select Region & Detect
          </button>
          
          <div id="bj-ocr-status" class="bj-ocr-status"></div>
          <div id="bj-ocr-preview" class="bj-ocr-preview"></div>
          
          <div id="bj-ocr-results" class="bj-ocr-results" style="display: none;">
            <label class="bj-label">Detected Cards:</label>
            <div id="bj-detected-cards" class="bj-card-display"></div>
            <button id="bj-use-detected" class="bj-btn-primary" style="width: 100%;">Use These Cards</button>
          </div>
        </div>
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
    
    // Tab switching
    const manualTab = document.getElementById('bj-tab-manual');
    const ocrTab = document.getElementById('bj-tab-ocr');
    const manualPanel = document.getElementById('bj-manual-panel');
    const ocrPanel = document.getElementById('bj-ocr-panel');
    
    // OCR elements
    const captureScreenBtn = document.getElementById('bj-capture-screen');
    const selectRegionBtn = document.getElementById('bj-select-region');
    const useDetectedBtn = document.getElementById('bj-use-detected');

    if (calculateBtn) {
      calculateBtn.addEventListener('click', calculateStrategy);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', clearInputs);
    }

    if (addCardBtn) {
      addCardBtn.addEventListener('click', addPlayerCard);
    }
    
    // Tab switching
    if (manualTab && ocrTab) {
      manualTab.addEventListener('click', () => {
        manualTab.classList.add('active');
        ocrTab.classList.remove('active');
        manualPanel.classList.add('active');
        ocrPanel.classList.remove('active');
      });
      
      ocrTab.addEventListener('click', () => {
        ocrTab.classList.add('active');
        manualTab.classList.remove('active');
        ocrPanel.classList.add('active');
        manualPanel.classList.remove('active');
      });
    }
    
    // OCR functionality
    if (captureScreenBtn) {
      captureScreenBtn.addEventListener('click', captureAndDetect);
    }
    
    if (selectRegionBtn) {
      selectRegionBtn.addEventListener('click', selectRegionAndDetect);
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
  
  // OCR Functions
  let detectedPlayerCards = [];
  let detectedDealerCard = '';
  
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
      
      // Capture the screen
      const imageData = await captureFullScreen();
      
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
      statusDiv.innerHTML = `<p class="bj-error">Error: ${error.message}</p>`;
    }
  }
  
  async function selectRegionAndDetect() {
    const statusDiv = document.getElementById('bj-ocr-status');
    const previewDiv = document.getElementById('bj-ocr-preview');
    const resultsDiv = document.getElementById('bj-ocr-results');
    const detectedCardsDiv = document.getElementById('bj-detected-cards');
    
    try {
      // Show instruction
      statusDiv.innerHTML = '<p class="bj-loading">🎯 Click and drag to select the card region...</p>';
      previewDiv.innerHTML = '';
      resultsDiv.style.display = 'none';
      
      // Let user select region
      const region = await selectScreenRegion();
      
      if (region.width < 10 || region.height < 10) {
        statusDiv.innerHTML = '<p class="bj-error">Selected region too small. Please try again.</p>';
        return;
      }
      
      // Show loading status
      statusDiv.innerHTML = '<p class="bj-loading">📸 Capturing selected region and detecting cards...</p>';
      
      // Capture the selected region
      const imageData = await captureFullScreen();
      
      // Create a canvas to crop the selected region
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageData;
      });
      
      // Crop to selected region
      canvas.width = region.width;
      canvas.height = region.height;
      ctx.drawImage(img, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
      const croppedImageData = canvas.toDataURL('image/png');
      
      // Show preview
      const previewImg = document.createElement('img');
      previewImg.src = croppedImageData;
      previewImg.style.maxWidth = '100%';
      previewImg.style.borderRadius = '4px';
      previewDiv.appendChild(previewImg);
      
      // Process with OCR
      const cards = await recognizeCards(croppedImageData);
      
      if (cards.length === 0) {
        statusDiv.innerHTML = '<p class="bj-error">No cards detected in selected region. Try a different area.</p>';
        return;
      }
      
      // Card assignment logic
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
      console.error('Region selection error:', error);
      statusDiv.innerHTML = `<p class="bj-error">Error: ${error.message}</p>`;
    }
  }
  
  function useDetectedCards() {
    playerCards = [...detectedPlayerCards];
    dealerCard = detectedDealerCard;
    
    // Switch to manual tab and show results
    document.getElementById('bj-tab-manual').click();
    
    // Update inputs
    document.getElementById('bj-player-cards').value = '';
    document.getElementById('bj-dealer-card').value = detectedDealerCard;
    
    // Calculate immediately
    calculateStrategy();
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
    } else if (request.action === 'getStatus') {
      // Check if overlay exists and get its current state without modifying it
      const overlay = document.getElementById('blackjack-helper-overlay');
      if (overlay) {
        const isVisible = overlay.style.display !== 'none';
        sendResponse({ exists: true, visible: isVisible });
      } else {
        sendResponse({ exists: false, visible: false });
      }
    }
    return true; // Keep the message channel open for async response
  });

    } catch (error) {
      console.error('Blackjack Helper: Error initializing extension:', error);
      // Don't throw - fail gracefully on sites with restrictions
    }
  }
})();
