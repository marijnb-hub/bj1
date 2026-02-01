# Blackjack Helper - Desktop App Snelstart Gids

## 🚀 Snel Aan De Slag

### Stap 1: Installeer Node.js
Download en installeer Node.js van https://nodejs.org
(Versie 16 of hoger)

### Stap 2: Installeer Dependencies
```bash
npm install
```

### Stap 3: Start De App
```bash
npm start
```

## 📦 Installers Maken

### Windows
```bash
npm run build:win
```
Output: `dist/Blackjack Helper Setup.exe`

### macOS
```bash
npm run build:mac
```
Output: `dist/Blackjack Helper.dmg`

### Linux
```bash
npm run build:linux
```
Output: `dist/Blackjack-Helper-x.x.x.AppImage`

## 💡 Gebruik

### Handmatige Invoer (Manual Input)
1. Voer je kaarten in (bijv. "K,7")
2. Voer dealer kaart in (bijv. "10")
3. Klik "Calculate"
4. Zie de aanbeveling + odds + EV

### OCR Kaart Detectie
1. Klik "OCR Recognition" tab
2. Klik "📸 Capture & Detect Cards"
3. App neemt schermafbeelding en detecteert kaarten
4. Klik "Use These Cards"

## 🎯 Features

✅ **Basis Strategie** - Optimale spel beslissingen
✅ **OCR Herkenning** - Automatische kaart detectie
✅ **Kansen Berekening** - Win/Push/Loss percentages
✅ **Expected Value** - EV voor elke actie
✅ **Hand Analyse** - Soft/hard totalen, paren

## ⚙️ Menu Opties

### File Menu
- **Always on Top** - Houd venster bovenop andere apps
- **Exit** - Sluit de app (Ctrl/Cmd+Q)

### View Menu
- **Reload** - Herlaad de app (Ctrl/Cmd+R)
- **Toggle Developer Tools** - Ontwikkel tools (Ctrl/Cmd+Shift+I)

### Help Menu
- **About** - Over Blackjack Helper

## 🔧 Troubleshooting

### App Start Niet
```bash
# Verwijder node_modules en herinstalleer
rm -rf node_modules
npm install
npm start
```

### OCR Werkt Niet
1. Controleer internet verbinding (Tesseract.js laadt vanaf CDN)
2. Gebruik "Manual Input" als fallback
3. Controleer console voor fouten (Ctrl/Cmd+Shift+I)

### Schermopname Faalt
- Geef de app toestemming voor schermopname (macOS/Linux)
- Gebruik een andere browser/app voor blackjack spel
- Probeer opnieuw

## 📝 Commando's Samenvatting

```bash
npm install           # Installeer dependencies
npm start            # Start desktop app
npm run build:win    # Build Windows installer
npm run build:mac    # Build macOS DMG
npm run build:linux  # Build Linux AppImage
npm run build        # Build alle platforms
```

## 🎮 Aanbevelingen

Het systeem geeft 4 mogelijke acties:
- **HIT** (Geel) - Neem nog een kaart
- **STAND** (Groen) - Blijf bij je huidige hand
- **DOUBLE** (Blauw) - Verdubbel inzet, neem één kaart
- **SPLIT** (Paars) - Splits paar in twee handen

## 📊 Statistieken

De app toont:
- **Hand Total** - Je totaal (+ soft/hard indicator)
- **Win%** - Kans om te winnen
- **Push%** - Kans op gelijkspel
- **Loss%** - Kans om te verliezen
- **Dealer Bust%** - Kans dat dealer bust
- **EV** - Expected Value voor elke actie

## ⌨️ Sneltoetsen

- `Enter` - Bereken strategie (in input velden)
- `Ctrl/Cmd + R` - Herlaad app
- `Ctrl/Cmd + Shift + I` - Developer tools
- `Ctrl/Cmd + Q` - Sluit app

## 🌟 Tips

1. **Always on Top** - Gebruik File → Always on Top om de app boven andere vensters te houden
2. **Klein Venster** - Resize het venster naar je wens (minimaal 400x600)
3. **Meerdere Kaarten** - Voeg meerdere kaarten toe met de "Add Card" knop
4. **OCR Nauwkeurigheid** - Zorg voor duidelijke kaarten in schermopname
5. **Manual Input** - Snelste manier voor berekeningen

## 🆘 Support

Problemen of vragen? 
- Open een issue op GitHub
- Check README-DESKTOP.md voor meer details
- Kijk in de browser console voor debug info

## 🎉 Geniet Van De App!

Veel succes aan de blackjack tafel! 🃏🎰

---

Gemaakt met Electron + JavaScript
Versie 1.0.0
