const { app, BrowserWindow, Menu, Tray, desktopCapturer, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 450,
    height: 700,
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'app', 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon128.png'),
    title: 'Blackjack Helper',
    backgroundColor: '#1e1e1e'
  });

  // Load the app
  mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Always on Top',
          type: 'checkbox',
          checked: false,
          click: (menuItem) => {
            if (mainWindow) {
              mainWindow.setAlwaysOnTop(menuItem.checked);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Blackjack Helper',
              message: 'Blackjack Helper v1.0.0',
              detail: 'A real-time assistant for online blackjack players.\n\nProvides optimal strategy recommendations, odds calculations, and expected value analysis.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle screen capture requests
ipcMain.handle('capture-screen', async (event, options) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: screen.getPrimaryDisplay().workAreaSize
    });

    if (sources.length > 0) {
      const source = sources[0];
      return source.thumbnail.toDataURL();
    }
    
    throw new Error('No screen sources found');
  } catch (error) {
    console.error('Screen capture error:', error);
    throw error;
  }
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
