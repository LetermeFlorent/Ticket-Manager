/**
 * index.js
 * Point d'entrée Electron — création de la fenêtre principale
 */
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { initDatabase } from './database'
import ticketController from './controllers/ticketController'

const isProd = !process.env['ELECTRON_RENDERER_URL']

if (process.env.PORTABLE_EXECUTABLE_DIR) {
  app.setPath('userData', join(process.env.PORTABLE_EXECUTABLE_DIR, 'data'))
}

function createWindow() {
  Menu.setApplicationMenu(null)

  const win = new BrowserWindow({
    width: 960,
    height: 680,
    minWidth: 700,
    minHeight: 500,
    title: 'Ticket Manager',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !isProd,
      allowRunningInsecureContent: false,
      webSecurity: true
    }
  })

  // Bloque toute navigation vers une URL externe
  win.webContents.on('will-navigate', (event, url) => {
    const allowed = ['file://', 'http://localhost', 'https://localhost']
    if (!allowed.some(origin => url.startsWith(origin))) {
      event.preventDefault()
    }
  })

  // Bloque l'ouverture de nouvelles fenêtres (liens, window.open)
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  if (!isProd) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  await initDatabase()
  ticketController.registerHandlers(ipcMain)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
