// Popup script for Blackjack Helper

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle-overlay');
  const statusText = document.getElementById('status-text');

  // Handle toggle overlay button click
  toggleButton.addEventListener('click', async function() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to toggle overlay
      chrome.tabs.sendMessage(tab.id, { action: 'toggleOverlay' }, function(response) {
        if (chrome.runtime.lastError) {
          console.log('Could not connect to content script');
          statusText.textContent = 'Overlay not available on this page';
        } else {
          statusText.textContent = response?.visible ? 'Overlay visible' : 'Overlay hidden';
        }
      });
    } catch (error) {
      console.error('Error toggling overlay:', error);
    }
  });

  // Update status on popup open
  updateStatus();
});

function updateStatus() {
  const statusText = document.getElementById('status-text');
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      statusText.textContent = 'Ready';
    }
  });
}
