// Content script for Blackjack Helper
// This script injects an overlay into the page to display blackjack advice

(function() {
  'use strict';

  // Check if overlay already exists to prevent duplicate injection
  if (document.getElementById('blackjack-helper-overlay')) {
    return;
  }

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
      <p class="bj-helper-status">Ready to assist</p>
      <p class="bj-helper-info">Placeholder for odds and advice</p>
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
    }
    return true; // Keep the message channel open for async response
  });
})();
