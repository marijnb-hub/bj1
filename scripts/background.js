// Background service worker for screen capture
// Handles screenshot capture requests from content script

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreen') {
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (imageData) => {
      if (chrome.runtime.lastError) {
        console.error('Capture error:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ imageData: imageData });
      }
    });
    return true; // Keep message channel open for async response
  }
});

console.log('Blackjack Helper background service worker initialized');
