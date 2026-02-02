const cv = require('opencv4nodejs');
const path = require('path');
const fs = require('fs');

class CardDetector {
  constructor() {
    this.templates = {};
    this.loadTemplates();
  }

  /**
   * Load card templates from assets directory
   */
  loadTemplates() {
    const templatesPath = path.join(__dirname, '../../assets/templates');
    
    if (!fs.existsSync(templatesPath)) {
      console.warn('Templates directory not found. Creating placeholder.');
      fs.mkdirSync(templatesPath, { recursive: true });
      return;
    }

    // Load templates for each card (A-K for each suit)
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

    suits.forEach(suit => {
      ranks.forEach(rank => {
        const templatePath = path.join(templatesPath, `${rank}_${suit}.png`);
        if (fs.existsSync(templatePath)) {
          try {
            this.templates[`${rank}_${suit}`] = cv.imread(templatePath);
          } catch (error) {
            console.error(`Failed to load template ${rank}_${suit}:`, error);
          }
        }
      });
    });

    console.log(`Loaded ${Object.keys(this.templates).length} card templates`);
  }

  /**
   * Detect cards in an image using template matching
   * @param {cv.Mat} image - Input image
   * @returns {Array} Detected cards with positions and confidence
   */
  detectCards(image) {
    const detectedCards = [];

    // Preprocess image
    const preprocessed = this.preprocessImage(image);

    // Find card contours
    const contours = this.findCardContours(preprocessed);

    // Match each contour region with templates
    contours.forEach((contour, index) => {
      const rect = contour.boundingRect();
      
      // Extract card region
      const cardRegion = image.getRegion(rect);
      
      // Match with templates
      const match = this.matchTemplate(cardRegion);
      
      if (match && match.confidence > 0.7) {
        detectedCards.push({
          card: match.card,
          position: rect,
          confidence: match.confidence,
          index: index
        });
      }
    });

    return detectedCards;
  }

  /**
   * Preprocess image for better card detection
   * @param {cv.Mat} image - Input image
   * @returns {cv.Mat} Preprocessed image
   */
  preprocessImage(image) {
    // Convert to grayscale
    let gray = image.bgrToGray();
    
    // Apply Gaussian blur to reduce noise
    gray = gray.gaussianBlur(new cv.Size(5, 5), 0);
    
    // Apply adaptive threshold
    const binary = gray.adaptiveThreshold(
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      11,
      2
    );

    return binary;
  }

  /**
   * Find card contours in preprocessed image
   * @param {cv.Mat} preprocessed - Preprocessed binary image
   * @returns {Array} Card contours
   */
  findCardContours(preprocessed) {
    const contours = preprocessed.findContours(
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    // Filter contours by area and aspect ratio (cards are rectangular)
    const cardContours = contours.filter(contour => {
      const area = contour.area;
      const rect = contour.boundingRect();
      const aspectRatio = rect.width / rect.height;
      
      // Typical playing card aspect ratio is around 0.7 (2.5:3.5)
      return area > 5000 && 
             aspectRatio > 0.5 && 
             aspectRatio < 0.9;
    });

    return cardContours;
  }

  /**
   * Match card region with templates
   * @param {cv.Mat} cardRegion - Extracted card region
   * @returns {Object} Best match result
   */
  matchTemplate(cardRegion) {
    let bestMatch = null;
    let highestConfidence = 0;

    // Resize card region to standard template size if needed
    const standardSize = new cv.Size(100, 140);
    const resizedCard = cardRegion.resize(standardSize.height, standardSize.width);

    // Try matching with each template
    Object.keys(this.templates).forEach(cardName => {
      const template = this.templates[cardName];
      
      try {
        // Ensure template is same size
        const resizedTemplate = template.resize(standardSize.height, standardSize.width);
        
        // Perform template matching
        const matched = resizedCard.matchTemplate(
          resizedTemplate,
          cv.TM_CCOEFF_NORMED
        );
        
        const minMax = matched.minMaxLoc();
        const confidence = minMax.maxVal;

        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = {
            card: cardName,
            confidence: confidence,
            position: minMax.maxLoc
          };
        }
      } catch (error) {
        console.error(`Error matching template ${cardName}:`, error);
      }
    });

    return bestMatch;
  }

  /**
   * Detect card suits using HSV color filtering
   * @param {cv.Mat} image - Input image
   * @returns {Object} Detected suits with positions
   */
  detectSuitsByColor(image) {
    const hsv = image.cvtColor(cv.COLOR_BGR2HSV);
    const suits = {};

    // Red range for hearts and diamonds
    const redLower1 = new cv.Vec3(0, 100, 100);
    const redUpper1 = new cv.Vec3(10, 255, 255);
    const redLower2 = new cv.Vec3(160, 100, 100);
    const redUpper2 = new cv.Vec3(180, 255, 255);

    const redMask1 = hsv.inRange(redLower1, redUpper1);
    const redMask2 = hsv.inRange(redLower2, redUpper2);
    const redMask = redMask1.bitwiseOr(redMask2);

    // Black range for spades and clubs
    const blackLower = new cv.Vec3(0, 0, 0);
    const blackUpper = new cv.Vec3(180, 255, 50);
    const blackMask = hsv.inRange(blackLower, blackUpper);

    suits.red = redMask;
    suits.black = blackMask;

    return suits;
  }

  /**
   * Get card value for blackjack calculations
   * @param {String} cardName - Card name (e.g., "A_spades")
   * @returns {Number} Card value
   */
  getCardValue(cardName) {
    const rank = cardName.split('_')[0];
    
    if (rank === 'A') return 11; // Ace (can also be 1)
    if (['J', 'Q', 'K'].includes(rank)) return 10; // Face cards
    return parseInt(rank); // Number cards
  }
}

module.exports = CardDetector;
