// OCR module for card recognition using Tesseract.js
// This module handles image-based card detection with robust loading and fallback mechanisms

// Note: Tesseract.js will be loaded from CDN by injecting into page context
// This is necessary because Manifest V3 content scripts cannot load external scripts directly

// Multiple CDN sources for Tesseract.js (fallback if one fails)
const TESSERACT_CDN_SOURCES = [
  'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js',
  'https://unpkg.com/tesseract.js@4/dist/tesseract.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/4.1.1/tesseract.min.js'
];

let tesseractLoadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;

/**
 * Check if Tesseract is already loaded in page context
 * @returns {boolean} - True if Tesseract is available
 */
function isTesseractLoaded() {
  try {
    const script = document.createElement('script');
    script.textContent = 'window.__tesseractLoaded = typeof Tesseract !== "undefined";';
    document.documentElement.appendChild(script);
    script.remove();
    return window.__tesseractLoaded === true;
  } catch (e) {
    return false;
  }
}

/**
 * Test network connectivity
 * @returns {Promise<boolean>} - True if network is accessible
 */
async function testNetworkConnectivity() {
  try {
    // Try to fetch from a reliable endpoint
    const response = await fetch('https://cdn.jsdelivr.net/npm/tesseract.js@4/package.json', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    return true;
  } catch (error) {
    console.warn('Network connectivity test failed:', error);
    return false;
  }
}

/**
 * Load Tesseract.js from a specific CDN source
 * @param {string} cdnUrl - CDN URL to load from
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} - Resolves when loaded
 */
function loadTesseractFromCDN(cdnUrl, timeout = 15000) {
  return new Promise((resolve, reject) => {
    console.log(`Attempting to load Tesseract.js from: ${cdnUrl}`);
    
    const script = document.createElement('script');
    script.src = cdnUrl;
    script.crossOrigin = 'anonymous';
    
    const timeoutId = setTimeout(() => {
      script.remove();
      reject(new Error(`Timeout loading from ${cdnUrl}`));
    }, timeout);
    
    script.onload = () => {
      clearTimeout(timeoutId);
      console.log(`Tesseract.js loaded successfully from: ${cdnUrl}`);
      
      // Verify it's actually loaded
      setTimeout(() => {
        if (isTesseractLoaded()) {
          resolve();
        } else {
          reject(new Error('Tesseract loaded but not accessible in page context'));
        }
      }, 100);
    };
    
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      script.remove();
      console.error(`Failed to load from ${cdnUrl}:`, error);
      reject(new Error(`Failed to load from ${cdnUrl}`));
    };
    
    // Append to page's head (not extension context)
    (document.head || document.documentElement).appendChild(script);
  });
}

/**
 * Initialize OCR functionality with retry logic and multiple CDN sources
 * @returns {Promise} - Resolves when Tesseract is ready
 */
async function initializeOCR() {
  // Check if already loaded
  if (isTesseractLoaded()) {
    console.log('Tesseract.js already available');
    return Promise.resolve();
  }
  
  console.log('Initializing Tesseract.js...');
  
  // Test network connectivity first
  const hasNetwork = await testNetworkConnectivity();
  if (!hasNetwork) {
    throw new Error('Network connection issue detected. Please check your internet connection and try again.');
  }
  
  // Try loading from multiple CDN sources with retry logic
  let lastError = null;
  
  for (let attempt = 0; attempt < MAX_LOAD_ATTEMPTS; attempt++) {
    for (const cdnUrl of TESSERACT_CDN_SOURCES) {
      try {
        await loadTesseractFromCDN(cdnUrl, 15000);
        console.log(`Tesseract.js initialized successfully (attempt ${attempt + 1})`);
        tesseractLoadAttempts = 0; // Reset counter on success
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed for ${cdnUrl}:`, error.message);
        
        // Wait before retry (exponential backoff)
        if (attempt < MAX_LOAD_ATTEMPTS - 1) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
  }
  
  // All attempts failed
  tesseractLoadAttempts++;
  
  const errorMessage = `Failed to load Tesseract.js after ${MAX_LOAD_ATTEMPTS} attempts from ${TESSERACT_CDN_SOURCES.length} CDN sources.

Possible causes:
1. Network/Internet connection issues
2. Firewall or proxy blocking CDN access
3. Website's Content Security Policy blocking external scripts
4. CDN services temporarily unavailable

Troubleshooting:
- Check your internet connection
- Disable VPN/proxy temporarily
- Try on a different website
- Check browser console for detailed errors
- Ensure cdn.jsdelivr.net, unpkg.com, or cdnjs.cloudflare.com are accessible

Last error: ${lastError?.message || 'Unknown error'}`;
  
  throw new Error(errorMessage);
}

/**
 * Process an image and extract card values using page context
 * @param {string} imageData - Base64 image data or image URL
 * @returns {Promise<Array>} - Array of detected card values
 */
async function recognizeCards(imageData) {
  try {
    await initializeOCR();
    
    console.log('Starting OCR recognition...');
    
    // Execute OCR in page context and get results
    return new Promise((resolve, reject) => {
      const callbackId = 'ocr_callback_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      
      // Set up callback to receive results
      window[callbackId] = (result) => {
        delete window[callbackId];
        if (result.error) {
          reject(new Error(result.error));
        } else {
          console.log('OCR recognized text:', result.text);
          const cards = parseCardText(result.text);
          resolve(cards);
        }
      };
      
      // Safely escape imageData to prevent XSS
      const safeImageData = JSON.stringify(imageData);
      
      // Inject OCR execution into page context
      const script = document.createElement('script');
      script.textContent = `
        (async function() {
          try {
            if (typeof Tesseract === 'undefined') {
              window['${callbackId}']({ error: 'Tesseract not loaded' });
              return;
            }
            
            const imageData = ${safeImageData};
            
            const worker = await Tesseract.createWorker('eng', 1, {
              logger: m => console.log('Tesseract:', m),
              workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js',
              corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js',
            });
            
            await worker.setParameters({
              tessedit_char_whitelist: '23456789JQKA10',
            });
            
            const { data: { text } } = await worker.recognize(imageData);
            await worker.terminate();
            
            window['${callbackId}']({ text: text });
          } catch (error) {
            window['${callbackId}']({ error: error.message || 'OCR processing failed' });
          }
        })();
      `;
      
      (document.head || document.documentElement).appendChild(script);
      script.remove();
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (window[callbackId]) {
          delete window[callbackId];
          reject(new Error('OCR timeout - processing took too long'));
        }
      }, 30000);
    });
    
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
