/**
 * ticketController.js
 * Orchestration des handlers IPC pour les tickets
 */
import ticketService from '../services/ticketService'

const ALLOWED_ORIGINS = ['file://', 'http://localhost', 'https://localhost']

function isTrustedFrame(event) {
  const url = event.senderFrame?.url ?? ''
  return ALLOWED_ORIGINS.some(origin => url.startsWith(origin))
}

const DENIED = { success: false, error: 'Accès refusé.' }

const ticketController = {
  registerHandlers(ipcMain) {
    ipcMain.handle('tickets:getAll',  (e, filters) => isTrustedFrame(e) ? ticketService.getAll(filters)    : DENIED)
    ipcMain.handle('tickets:getById', (e, id)      => isTrustedFrame(e) ? ticketService.getById(id)        : DENIED)
    ipcMain.handle('tickets:create',  (e, data)    => isTrustedFrame(e) ? ticketService.create(data)       : DENIED)
    ipcMain.handle('tickets:update',  (e, id, data)=> isTrustedFrame(e) ? ticketService.update(id, data)   : DENIED)
    ipcMain.handle('tickets:delete',  (e, id)      => isTrustedFrame(e) ? ticketService.delete(id)         : DENIED)
  }
}

export default ticketController
