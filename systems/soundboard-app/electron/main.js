const { app, BrowserWindow } = require('electron');
const path = require('path');

// Use Vite dev server only when explicitly requested (start:dev). Otherwise load built dist.
const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development' || process.env.USE_VITE_DEV === '1');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL('http://127.0.0.1:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
