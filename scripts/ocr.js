// OCR module for card recognition using Tesseract.js
// This module handles image-based card detection

// Note: Tesseract.js will be loaded from CDN in the content script

/**
 * Initialize OCR functionality
 * @returns {Promise} - Resolves when Tesseract is ready
 */
async function initializeOCR() {
  // Check if Tesseract is available
  if (typeof Tesseract === 'undefined') {
    console.log('Loading Tesseract.js from CDN...');
    return loadTesseractScript();
  }
  return Promise.resolve();
}

/**
 * Load Tesseract.js script dynamically
 * @returns {Promise} - Resolves when script is loaded
 */
function loadTesseractScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
    script.onload = () => {
      console.log('Tesseract.js loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Tesseract.js');
      reject(new Error('Failed to load Tesseract.js'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Process an image and extract card values
 * @param {string} imageData - Base64 image data or image URL
 * @returns {Promise<Array>} - Array of detected card values
 */
async function recognizeCards(imageData) {
  try {
    await initializeOCR();
    
    console.log('Starting OCR recognition...');
    const worker = await Tesseract.createWorker();
    
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '23456789JQKA10',
    });
    
    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();
    
    console.log('OCR recognized text:', text);
    
    // Parse recognized text to extract card values
    const cards = parseCardText(text);
    return cards;
    
  } catch (error) {
    console.error('OCR recognition error:', error);
    throw error;
  }
}

/**
 * Parse OCR text to extract card values
 * @param {string} text - Raw OCR text
 * @returns {Array} - Array of card values
 */
function parseCardText(text) {
  const cards = [];
  const cardPattern = /([2-9]|10|[JQKA])/gi;
  const matches = text.match(cardPattern);
  
  if (matches) {
    matches.forEach(match => {
      const card = match.toUpperCase();
      if (isValidCard(card)) {
        cards.push(card);
      }
    });
  }
  
  return cards;
}

/**
 * Validate if a string is a valid card value
 * @param {string} card - Card value to validate
 * @returns {boolean} - True if valid card
 */
function isValidCard(card) {
  const validCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return validCards.includes(card);
}

/**
 * Capture full screen screenshot
 * @returns {Promise<string>} - Base64 image data
 */
async function captureFullScreen() {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        { action: 'captureScreen' },
        response => {
          if (response && response.imageData) {
            resolve(response.imageData);
          } else if (response && response.error) {
            reject(new Error(response.error));
          } else {
            reject(new Error('Failed to capture screen'));
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Capture screenshot of specified area
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Width of area
 * @param {number} height - Height of area
 * @returns {Promise<string>} - Base64 image data
 */
async function captureArea(x, y, width, height) {
  return new Promise((resolve, reject) => {
    try {
      // Use chrome.tabs.captureVisibleTab for screenshot
      chrome.runtime.sendMessage(
        { action: 'captureScreen', x, y, width, height },
        response => {
          if (response && response.imageData) {
            resolve(response.imageData);
          } else {
            reject(new Error('Failed to capture screen'));
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Process file upload for card recognition
 * @param {File} file - Image file
 * @returns {Promise<Array>} - Array of recognized cards
 */
async function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const imageData = e.target.result;
        const cards = await recognizeCards(imageData);
        resolve(cards);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Enable screen region selection for OCR
 * @returns {Promise<Object>} - Selected region coordinates
 */
function selectScreenRegion() {
  return new Promise((resolve) => {
    // Create overlay for region selection
    const selectionOverlay = document.createElement('div');
    selectionOverlay.id = 'bj-ocr-selection';
    selectionOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999998;
      cursor: crosshair;
    `;
    
    const selectionBox = document.createElement('div');
    selectionBox.style.cssText = `
      position: absolute;
      border: 2px dashed #4CAF50;
      background: rgba(76, 175, 80, 0.2);
      display: none;
    `;
    selectionOverlay.appendChild(selectionBox);
    
    let startX, startY;
    
    selectionOverlay.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      selectionBox.style.left = startX + 'px';
      selectionBox.style.top = startY + 'px';
      selectionBox.style.display = 'block';
    });
    
    selectionOverlay.addEventListener('mousemove', (e) => {
      if (selectionBox.style.display === 'block') {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        selectionBox.style.width = Math.abs(width) + 'px';
        selectionBox.style.height = Math.abs(height) + 'px';
        selectionBox.style.left = (width < 0 ? e.clientX : startX) + 'px';
        selectionBox.style.top = (height < 0 ? e.clientY : startY) + 'px';
      }
    });
    
    selectionOverlay.addEventListener('mouseup', (e) => {
      const endX = e.clientX;
      const endY = e.clientY;
      
      const region = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY)
      };
      
      document.body.removeChild(selectionOverlay);
      resolve(region);
    });
    
    document.body.appendChild(selectionOverlay);
  });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeOCR,
    recognizeCards,
    processImageFile,
    selectScreenRegion,
    captureFullScreen,
    captureArea,
    isValidCard
  };
}
