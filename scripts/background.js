// Background service worker for screen capture
// Handles screenshot capture requests from content script
// Works universally across all websites

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreen') {
    // Capture the visible tab - works on all sites with proper permissions
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (imageData) => {
      if (chrome.runtime.lastError) {
        console.error('Blackjack Helper: Capture error:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ imageData: imageData });
      }
    });
    return true; // Keep message channel open for async response
  }
});

// Log when service worker is activated
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Blackjack Helper: Extension installed/updated', details.reason);
  if (details.reason === 'install') {
    console.log('Blackjack Helper: First installation - extension will work on all websites');
  }
});

console.log('Blackjack Helper: Background service worker initialized and ready for all sites');
