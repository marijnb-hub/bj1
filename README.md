# Blackjack Helper Vision 🎴

Een volledig offline desktop-applicatie voor blackjack kaartherkenning met klassieke beeldverwerkingstechnieken. Gebouwd met Electron.js en OpenCV voor snelle, lokale verwerking zonder internet of AI-afhankelijkheid.

## Features

✅ **Volledig Offline** - Geen internetverbinding nodig  
✅ **Klassieke Beeldverwerking** - Gebruikt OpenCV voor nauwkeurige kaartherkenning  
✅ **Template Matching** - Detecteert kaarten door vergelijking met lokale templates  
✅ **Kleurdetectie** - HSV-filtering voor schoppen (♠), harten (♥), klaveren (♣) en ruiten (♦)  
✅ **Contourdetectie** - Vindt automatisch kaarten in screenshots  
✅ **Strategisch Advies** - Geeft blackjack strategie-advies op basis van basis strategie  
✅ **Screen Capture** - Neemt automatisch screenshots van het speelscherm  

## Technische Stack

- **Electron.js** - Desktop applicatie framework
- **OpenCV (opencv4nodejs)** - Computer vision library
- **JavaScript/Node.js** - Programmeertaal
- **HTML/CSS** - User interface

## Project Structuur

```
/blackjack-helper-vision
├── /assets                    # Kaart templates en iconen
│   └── /templates            # Opgeslagen kaarttemplates voor matching
├── /src
│   ├── /processing           # OpenCV functies
│   │   ├── cardDetector.js  # Kaartdetectie logica
│   │   └── strategy.js      # Blackjack strategie calculator
│   ├── /ui                   # UI componenten
│   │   └── overlay.html     # Overlay window voor in-game advies
│   ├── main.js              # Electron entry point
│   └── renderer.js          # UI logica en beeldverwerking
├── index.html               # Hoofd UI
├── style.css               # UI styling
└── package.json            # Afhankelijkheden en configuratie
```

## Installatie

### Vereisten

- Node.js (v16 of hoger)
- npm or yarn
- OpenCV build tools (voor opencv4nodejs compilatie)

### Windows

```bash
# Installeer Windows Build Tools (als Administrator)
npm install --global --production windows-build-tools

# Installeer dependencies
npm install

# Start de applicatie
npm start
```

### macOS

```bash
# Installeer Homebrew (indien nog niet geïnstalleerd)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installeer OpenCV
brew install opencv

# Installeer dependencies
npm install

# Start de applicatie
npm start
```

### Linux (Ubuntu/Debian)

```bash
# Installeer build tools en OpenCV
sudo apt-get update
sudo apt-get install -y build-essential cmake git
sudo apt-get install -y libopencv-dev

# Installeer dependencies
npm install

# Start de applicatie
npm start
```

## Gebruik

1. **Start de applicatie**
   ```bash
   npm start
   ```

2. **Selecteer een scherm/venster**
   - Kies uit de dropdown het scherm of venster waar je blackjack speelt

3. **Voeg kaart templates toe** (eerste keer)
   - Plaats PNG-afbeeldingen van kaarten in `/assets/templates/`
   - Gebruik de naamconventie: `{rang}_{kleur}.png`
   - Bijvoorbeeld: `A_spades.png`, `K_hearts.png`, `10_clubs.png`

4. **Start Capture**
   - Klik op "Start Capture" om de kaartherkenning te activeren
   - De applicatie neemt automatisch screenshots en analyseert deze
   - Gedetecteerde kaarten en strategisch advies worden getoond

5. **Bekijk Advies**
   - De applicatie geeft real-time advies: Hit, Stand, Double of Split
   - Advies is gebaseerd op basis blackjack strategie

## Kaartdetectie Workflow

### 1. Screenshot Capture
```javascript
// Electron Desktop Capturer API
const sources = await desktopCapturer.getSources({
  types: ['screen', 'window']
});
```

### 2. Preprocessing
```javascript
// OpenCV image preprocessing
- Grayscale conversie
- Gaussian blur voor noise reductie
- Adaptive thresholding voor binaire image
```

### 3. Contourdetectie
```javascript
// Vind kaarten via contours
- RETR_EXTERNAL voor buitenste contours
- Filter op area en aspect ratio (kaarten zijn ~0.7)
```

### 4. Template Matching
```javascript
// Vergelijk met templates
- TM_CCOEFF_NORMED matching methode
- Confidence threshold: 0.7
- Best match wordt geselecteerd
```

### 5. Kleurdetectie
```javascript
// HSV-filtering voor suits
- Rood bereik: Harten & Ruiten
- Zwart bereik: Schoppen & Klaveren
```

## Blackjack Strategie

De applicatie gebruikt basis blackjack strategie:

### Hard Totals
- 8 of minder: Hit
- 9: Double op 3-6, anders Hit
- 10: Double op 2-9, anders Hit
- 11: Altijd Double
- 12: Stand op 4-6, anders Hit
- 13-16: Stand op 2-6, anders Hit
- 17 of meer: Stand

### Soft Totals (met Aas)
- Soft 13-14: Hit, Double op 5-6
- Soft 15-16: Hit, Double op 4-6
- Soft 17: Hit, Double op 3-6
- Soft 18: Stand op 2,7,8; Double op 3-6; Hit op 9-A
- Soft 19+: Stand

### Pairs
- Altijd Split: Aces en 8s
- Nooit Split: 5s en 10s
- Voorwaardelijk: Andere pairs op basis van dealer kaart

## Building

### Windows
```bash
npm run build:win
```

### macOS
```bash
npm run build:mac
```

### Linux
```bash
npm run build:linux
```

Output in de `/dist` directory.

## Troubleshooting

### OpenCV installatie mislukt

**Windows:**
```bash
npm install --global --production windows-build-tools
npm install opencv4nodejs --build-from-source
```

**macOS:**
```bash
brew install opencv
export OPENCV4NODEJS_DISABLE_AUTOBUILD=1
npm install opencv4nodejs
```

**Linux:**
```bash
sudo apt-get install libopencv-dev
npm install opencv4nodejs --build-from-source
```

### Kaarten worden niet gedetecteerd

1. Controleer of templates aanwezig zijn in `/assets/templates/`
2. Zorg voor goede belichting en contrast in het spel
3. Pas de confidence threshold aan in `cardDetector.js`
4. Voeg meer/betere templates toe

### Screen capture werkt niet

- Geef de applicatie screen recording permissies (macOS)
- Run als administrator (Windows)
- Check Electron versie compatibiliteit

## Development

### Project structuur uitbreiden

```bash
# Voeg nieuwe processing modules toe
src/processing/yourModule.js

# Voeg UI componenten toe
src/ui/yourComponent.html
```

### Debug mode

```bash
NODE_ENV=development npm start
```

Dit opent automatisch DevTools voor debugging.

## Licentie

MIT License

## Disclaimer

Deze tool is alleen voor educatieve doeleinden. Gebruik op eigen risico. Controleer de lokale wet- en regelgeving met betrekking tot het gebruik van hulpmiddelen bij kansspelen.

## Roadmap

- [ ] Verbeterde template matching met meerdere resoluties
- [ ] Support voor verschillende kaartdesigns
- [ ] Training mode voor template generatie
- [ ] Historische tracking van spellen
- [ ] Advanced statistieken en analytics
- [ ] Card counting support (optioneel)
- [ ] Multi-monitor support

## Contribueren

Bijdragen zijn welkom! Open een issue of pull request.

## Contact

Voor vragen of suggesties, open een issue op GitHub.