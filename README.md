# Blackjack Helper Desktop

Een cross-platform desktop applicatie voor blackjack strategieadvies met OCR kaartherkenning.

## 🎯 Functionaliteiten

- **Handmatige Kaart Invoer**: Selecteer kaarten via dropdown menu's
- **OCR Kaartherkenning**: Upload screenshots of gebruik schermopname om kaarten automatisch te detecteren
- **Strategieadvies**: Krijg optimale blackjack beslissingen gebaseerd op standaard basic strategy
- **Strategietabellen**: Bekijk volledige basic strategy charts voor hard hands, soft hands, en pairs
- **Cross-platform**: Werkt op Windows, macOS en Linux

## 🚀 Installatie

### Vereisten

- Node.js (v16 of hoger)
- npm of yarn

### Stappen

1. Clone de repository:
```bash
git clone https://github.com/marijnb-hub/bj1.git
cd bj1
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de applicatie:
```bash
npm start
```

## 🏗️ Bouwen voor Productie

### Alle platforms
```bash
npm run build
```

### Specifieke platforms
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

De gebouwde applicaties worden opgeslagen in de `dist/` directory.

## 📁 Project Structuur

```
/blackjack-helper-desktop
├── /assets              # Icons en afbeeldingen
├── /src
│   ├── /ocr            # Tesseract.js kaartherkenning
│   │   └── cardRecognition.js
│   ├── /strategy       # Blackjack strategie logica
│   │   └── blackjackStrategy.js
│   ├── main.js         # Electron app entry point
│   └── renderer.js     # Interface interacties
├── index.html          # Hoofd UI
├── style.css           # CSS styling
├── package.json        # Project configuratie
└── README.md
```

## 🎮 Gebruik

### Handmatige Invoer Tab
1. Selecteer uw twee kaarten
2. Selecteer de zichtbare kaart van de dealer
3. Klik op "Krijg Advies" voor strategisch advies

### OCR Scan Tab
1. Upload een screenshot of gebruik schermopname
2. Klik op "Analyseer Kaarten"
3. De applicatie herkent automatisch kaarten in de afbeelding

### Strategie Tabel Tab
Bekijk volledige basic strategy charts voor:
- Hard totals (geen Aas of Aas telt als 1)
- Soft totals (Aas telt als 11)
- Pair splitting (twee gelijke kaarten)

## 🛠️ Technologieën

- **Electron.js**: Cross-platform desktop framework
- **Tesseract.js**: OCR engine voor kaartherkenning
- **Node.js**: Backend logica
- **HTML/CSS/JavaScript**: Interface en interacties

## 📝 Blackjack Strategie

De applicatie gebruikt standaard basic strategy:
- **H** = Hit (Kaart pakken)
- **S** = Stand (Blijven staan)
- **D** = Double (Verdubbelen)
- **P** = Split (Splitsen)

## ⚠️ Disclaimer

Deze applicatie is uitsluitend bedoeld voor educatieve doeleinden. Gebruik op eigen risico bij gokactiviteiten.

## 📄 Licentie

MIT License

## 🤝 Bijdragen

Bijdragen zijn welkom! Open een issue of pull request.