const { ipcRenderer } = require('electron');

// Initialize when OpenCV is available
let CardDetector, BlackjackStrategy;
let detector, strategy;
let captureInterval;
let isCapturing = false;

// Try to load OpenCV modules
try {
  CardDetector = require('./processing/cardDetector');
  BlackjackStrategy = require('./processing/strategy');
  detector = new CardDetector();
  strategy = new BlackjackStrategy();
  console.log('OpenCV modules loaded successfully');
} catch (error) {
  console.warn('OpenCV not available. Running in demo mode:', error.message);
}

// UI Elements
let statusDiv, captureBtn, resultsDiv, adviceDiv, screenSelect;

document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  loadScreenSources();
});

function initializeUI() {
  statusDiv = document.getElementById('status');
  captureBtn = document.getElementById('captureBtn');
  resultsDiv = document.getElementById('results');
  adviceDiv = document.getElementById('advice');
  screenSelect = document.getElementById('screenSelect');

  if (captureBtn) {
    captureBtn.addEventListener('click', toggleCapture);
  }

  updateStatus('Ready to capture');
}

async function loadScreenSources() {
  try {
    const sources = await ipcRenderer.invoke('get-sources');
    
    if (screenSelect && sources.length > 0) {
      screenSelect.innerHTML = '';
      sources.forEach((source, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = source.name;
        screenSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading screen sources:', error);
    updateStatus('Error loading screen sources', 'error');
  }
}

function toggleCapture() {
  if (isCapturing) {
    stopCapture();
  } else {
    startCapture();
  }
}

function startCapture() {
  if (!detector) {
    updateStatus('OpenCV not available. Cannot capture.', 'error');
    showDemoResults();
    return;
  }

  isCapturing = true;
  captureBtn.textContent = 'Stop Capture';
  captureBtn.classList.add('active');
  updateStatus('Capturing and analyzing...');

  // Capture every 2 seconds
  captureInterval = setInterval(() => {
    captureAndAnalyze();
  }, 2000);

  // Initial capture
  captureAndAnalyze();
}

function stopCapture() {
  isCapturing = false;
  captureBtn.textContent = 'Start Capture';
  captureBtn.classList.remove('active');
  clearInterval(captureInterval);
  updateStatus('Capture stopped');
}

async function captureAndAnalyze() {
  try {
    const sources = await ipcRenderer.invoke('get-sources');
    const selectedIndex = screenSelect ? parseInt(screenSelect.value) : 0;
    
    if (!sources[selectedIndex]) {
      updateStatus('No screen source selected', 'error');
      return;
    }

    const source = sources[selectedIndex];
    
    // Get the thumbnail as base64
    const thumbnail = source.thumbnail.toDataURL();
    
    // Convert to OpenCV Mat and analyze
    analyzeImage(thumbnail);
    
  } catch (error) {
    console.error('Error capturing screen:', error);
    updateStatus('Error capturing screen', 'error');
  }
}

function analyzeImage(imageData) {
  if (!detector) {
    showDemoResults();
    return;
  }

  try {
    // In a real implementation, we would convert imageData to cv.Mat
    // For now, show demo results
    showDemoResults();
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    updateStatus('Error analyzing image', 'error');
  }
}

function showDemoResults() {
  // Demo: Simulate detected cards
  const playerCards = [
    { card: 'K_spades', value: 10, confidence: 0.95 },
    { card: '6_hearts', value: 6, confidence: 0.92 }
  ];
  
  const dealerCard = { card: '5_diamonds', value: 5, confidence: 0.94 };

  displayResults(playerCards, dealerCard);
  displayAdvice(playerCards, dealerCard);
}

function displayResults(playerCards, dealerCard) {
  if (!resultsDiv) return;

  const playerTotal = playerCards.reduce((sum, card) => sum + card.value, 0);
  
  let html = '<div class="detection-results">';
  html += '<h3>Detected Cards</h3>';
  
  html += '<div class="player-cards">';
  html += '<h4>Your Cards:</h4>';
  playerCards.forEach(card => {
    const [rank, suit] = card.card.split('_');
    html += `<div class="card-item">
      <span class="card-rank">${rank}</span>
      <span class="card-suit">${getSuitSymbol(suit)}</span>
      <span class="confidence">${(card.confidence * 100).toFixed(1)}%</span>
    </div>`;
  });
  html += `<div class="total">Total: ${playerTotal}</div>`;
  html += '</div>';

  html += '<div class="dealer-cards">';
  html += '<h4>Dealer Card:</h4>';
  const [rank, suit] = dealerCard.card.split('_');
  html += `<div class="card-item">
    <span class="card-rank">${rank}</span>
    <span class="card-suit">${getSuitSymbol(suit)}</span>
    <span class="confidence">${(dealerCard.confidence * 100).toFixed(1)}%</span>
  </div>`;
  html += '</div>';
  
  html += '</div>';
  
  resultsDiv.innerHTML = html;
}

function displayAdvice(playerCards, dealerCard) {
  if (!adviceDiv || !strategy) return;

  const playerValues = playerCards.map(card => card.value);
  const advice = strategy.getAdvice(playerValues, dealerCard.value);
  
  const total = strategy.calculateTotal(playerValues);
  
  let html = '<div class="strategy-advice">';
  html += '<h3>Strategy Advice</h3>';
  html += `<div class="hand-total">Hand Total: ${total}</div>`;
  html += `<div class="recommendation ${advice.toLowerCase()}">${advice}</div>`;
  html += '</div>';
  
  adviceDiv.innerHTML = html;
  updateStatus(`Advice: ${advice}`);
}

function getSuitSymbol(suit) {
  const symbols = {
    'spades': '♠',
    'hearts': '♥',
    'clubs': '♣',
    'diamonds': '♦'
  };
  return symbols[suit] || suit;
}

function updateStatus(message, type = 'info') {
  if (!statusDiv) return;
  
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    displayResults,
    displayAdvice,
    getSuitSymbol
  };
}
