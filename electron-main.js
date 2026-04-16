import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { createServer } from './server.js'

let server

async function createWindow(port) {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    autoHideMenuBar: true
  })
  window.setMenuBarVisibility(false)
  window.removeMenu()
  await window.loadURL(`http://localhost:${port}`)
}

app.whenReady().then(async () => {
  process.env.TICKET_MANAGER_DB = join(app.getPath('userData'), 'tickets.db')
  const result = await createServer()
  server = result.server
  await createWindow(result.port)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  if (server) server.close()
})
