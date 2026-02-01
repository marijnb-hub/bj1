const { ipcRenderer } = require('electron');
const OCRModule = require('./src/ocr/cardRecognition');
const BlackjackStrategy = require('./src/strategy/blackjackStrategy');

// Initialize modules
const ocrModule = new OCRModule();
const strategy = new BlackjackStrategy();

// Custom notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#2a5298'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;

    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab
    button.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load strategy tables when strategy tab is opened
    if (tabName === 'strategy') {
      loadStrategyTables();
    }
  });
});

// Manual Input - Get Advice
document.getElementById('get-advice-btn').addEventListener('click', () => {
  const playerCard1 = document.getElementById('player-card-1').value;
  const playerCard2 = document.getElementById('player-card-2').value;
  const dealerCard = document.getElementById('dealer-card').value;

  if (!playerCard1 || !playerCard2 || !dealerCard) {
    showNotification('Selecteer alstublieft alle kaarten', 'error');
    return;
  }

  const playerCards = [playerCard1, playerCard2];
  const advice = strategy.getAdvice(playerCards, dealerCard);

  // Display advice
  document.getElementById('advice-action').textContent = advice.action;
  document.getElementById('advice-explanation').textContent = advice.explanation;
  document.getElementById('advice-result').style.display = 'block';

  // Scroll to result
  document.getElementById('advice-result').scrollIntoView({ behavior: 'smooth' });
});

// OCR - Upload Image
document.getElementById('upload-btn').addEventListener('click', () => {
  document.getElementById('image-upload').click();
});

document.getElementById('image-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.getElementById('preview-img');
      img.src = event.target.result;
      document.getElementById('image-preview').style.display = 'block';
      document.getElementById('ocr-result').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// OCR - Capture Screen
document.getElementById('capture-btn').addEventListener('click', async () => {
  try {
    const sources = await ipcRenderer.invoke('get-sources');
    if (sources.length > 0) {
      // Use the first screen source
      const source = sources[0];
      const img = document.getElementById('preview-img');
      img.src = source.thumbnail.toDataURL();
      document.getElementById('image-preview').style.display = 'block';
      document.getElementById('ocr-result').style.display = 'none';
      showNotification('Schermopname succesvol', 'success');
    } else {
      showNotification('Geen schermen beschikbaar voor opname', 'error');
    }
  } catch (error) {
    console.error('Error capturing screen:', error);
    showNotification('Kon scherm niet vastleggen. Controleer de machtigingen.', 'error');
  }
});

// OCR - Analyze Cards
document.getElementById('analyze-btn').addEventListener('click', async () => {
  const img = document.getElementById('preview-img');
  if (!img.src) {
    showNotification('Upload eerst een afbeelding', 'error');
    return;
  }

  // Show loading
  document.getElementById('ocr-loading').style.display = 'block';
  document.getElementById('ocr-result').style.display = 'none';

  try {
    const cards = await ocrModule.recognizeCards(img.src);

    // Hide loading
    document.getElementById('ocr-loading').style.display = 'none';

    if (cards && cards.length > 0) {
      // Display detected cards
      const cardsContainer = document.getElementById('detected-cards');
      cardsContainer.innerHTML = '';
      cards.forEach(card => {
        const cardChip = document.createElement('div');
        cardChip.className = 'card-chip';
        cardChip.textContent = card;
        cardsContainer.appendChild(cardChip);
      });
      document.getElementById('ocr-result').style.display = 'block';
      showNotification(`${cards.length} kaart(en) gedetecteerd`, 'success');
    } else {
      showNotification('Geen kaarten gevonden. Probeer een duidelijkere afbeelding met zichtbare kaartsymbolen.', 'error');
    }
  } catch (error) {
    console.error('OCR error:', error);
    document.getElementById('ocr-loading').style.display = 'none';
    showNotification(`Kon afbeelding niet analyseren: ${error.message}. Zorg ervoor dat de afbeelding duidelijke kaartsymbolen bevat.`, 'error');
  }
});

// Load Strategy Tables
function loadStrategyTables() {
  // Only load if not already loaded
  if (document.querySelector('#hard-strategy-table table')) {
    return;
  }

  // Hard Strategy Table
  const hardTable = createStrategyTable(strategy.hardStrategy, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
  document.getElementById('hard-strategy-table').appendChild(hardTable);

  // Soft Strategy Table
  const softTable = createStrategyTable(strategy.softStrategy, [13, 14, 15, 16, 17, 18, 19, 20, 21]);
  document.getElementById('soft-strategy-table').appendChild(softTable);

  // Pair Strategy Table
  const pairTable = createStrategyTable(strategy.pairStrategy, ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'], true);
  document.getElementById('pair-strategy-table').appendChild(pairTable);
}

function createStrategyTable(strategyData, rows, isPair = false) {
  const table = document.createElement('table');
  const dealerCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'A'];

  // Header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const emptyTh = document.createElement('th');
  emptyTh.textContent = isPair ? 'Pair' : 'Hand';
  headerRow.appendChild(emptyTh);

  dealerCards.forEach(card => {
    const th = document.createElement('th');
    th.textContent = card;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body rows
  const tbody = document.createElement('tbody');
  rows.forEach(row => {
    const tr = document.createElement('tr');
    const rowHeader = document.createElement('th');
    rowHeader.textContent = isPair ? `${row}-${row}` : row;
    tr.appendChild(rowHeader);

    if (strategyData[row]) {
      dealerCards.forEach(dealerCard => {
        const td = document.createElement('td');
        const action = strategyData[row][dealerCard] || 'S';
        td.textContent = action;
        td.className = `action-${action}`;
        tr.appendChild(td);
      });
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Blackjack Helper Desktop loaded');
});
