const Tesseract = require('tesseract.js');

class OCRModule {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      this.worker = await Tesseract.createWorker('eng', 1, {
        logger: m => console.log(m)
      });
      this.isInitialized = true;
      console.log('OCR Worker initialized');
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      throw error;
    }
  }

  async recognizeCards(imageData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const { data: { text } } = await this.worker.recognize(imageData);
      return this.parseCards(text);
    } catch (error) {
      console.error('OCR recognition error:', error);
      return null;
    }
  }

  parseCards(text) {
    // Card patterns: 2-10, J, Q, K, A followed by suit symbols
    const cardPattern = /([2-9]|10|J|Q|K|A)(♠|♥|♦|♣|[SHDC])/gi;
    const matches = text.match(cardPattern);
    
    if (!matches) {
      return [];
    }

    return matches.map(card => {
      let normalized = card.toUpperCase();
      // Normalize suit symbols
      normalized = normalized.replace(/[SH♠]/, '♠')
                             .replace(/[H♥]/, '♥')
                             .replace(/[D♦]/, '♦')
                             .replace(/[C♣]/, '♣');
      return normalized;
    });
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.isInitialized = false;
      console.log('OCR Worker terminated');
    }
  }
}

module.exports = OCRModule;
