// Popup script for Blackjack Helper

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle-overlay');
  const statusText = document.getElementById('status-text');

  // Handle toggle overlay button click
  toggleButton.addEventListener('click', async function() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if on a restricted page
      if (isRestrictedPage(tab.url)) {
        statusText.textContent = 'Not available on Chrome pages';
        return;
      }
      
      // Send message to content script to toggle overlay
      sendMessageWithRetry(tab.id, { action: 'toggleOverlay' }, 3, 500)
        .then(response => {
          if (response && response.visible !== undefined) {
            statusText.textContent = response.visible ? 'Overlay visible' : 'Overlay hidden';
          } else {
            statusText.textContent = 'Overlay not responding';
          }
        })
        .catch(error => {
          console.log('Could not connect to content script:', error);
          statusText.textContent = 'Overlay not available on this page. Try refreshing.';
        });
    } catch (error) {
      console.error('Error toggling overlay:', error);
      statusText.textContent = 'Error: ' + error.message;
    }
  });

  // Update status on popup open
  updateStatus();
});

/**
 * Check if URL is a restricted page where extensions can't run
 * @param {string} url - Page URL
 * @returns {boolean} - True if restricted
 */
function isRestrictedPage(url) {
  if (!url) return true;
  
  const restrictedPrefixes = [
    'chrome://',
    'chrome-extension://',
    'edge://',
    'about:',
    'view-source:',
    'data:',
    'file://'
  ];
  
  return restrictedPrefixes.some(prefix => url.startsWith(prefix));
}

/**
 * Send message with retry logic
 * @param {number} tabId - Tab ID
 * @param {object} message - Message to send
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} - Response from content script
 */
function sendMessageWithRetry(tabId, message, maxRetries = 3, delay = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attemptSend() {
      attempts++;
      
      chrome.tabs.sendMessage(tabId, message, function(response) {
        if (chrome.runtime.lastError) {
          console.log(`Attempt ${attempts}/${maxRetries} failed:`, chrome.runtime.lastError.message);
          
          if (attempts < maxRetries) {
            setTimeout(attemptSend, delay);
          } else {
            reject(new Error(chrome.runtime.lastError.message));
          }
        } else {
          resolve(response);
        }
      });
    }
    
    attemptSend();
  });
}

/**
 * Update status display
 */
function updateStatus() {
  const statusText = document.getElementById('status-text');
  
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    if (!tabs[0]) {
      statusText.textContent = 'No active tab';
      return;
    }
    
    const tab = tabs[0];
    
    // Check if on restricted page
    if (isRestrictedPage(tab.url)) {
      statusText.textContent = 'Not available on Chrome pages';
      return;
    }
    
    // Try to check overlay status without toggling
    statusText.textContent = 'Checking...';
    
    try {
      const response = await sendMessageWithRetry(tab.id, { action: 'getStatus' }, 2, 300);
      
      if (response && response.exists) {
        statusText.textContent = response.visible ? 'Overlay visible' : 'Overlay hidden';
      } else {
        statusText.textContent = 'Overlay loading...';
      }
    } catch (error) {
      console.log('Status check failed:', error);
      statusText.textContent = 'Refresh page to activate';
    }
  });
}
