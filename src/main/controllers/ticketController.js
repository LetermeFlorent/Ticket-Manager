/**
 * ticketController.js
 * Orchestration des handlers IPC pour les tickets
 */
import ticketService from '../services/ticketService'

const ticketController = {
  registerHandlers(ipcMain) {
    ipcMain.handle('tickets:getAll',    (_e, filters) => ticketService.getAll(filters))
    ipcMain.handle('tickets:getById',   (_e, id)      => ticketService.getById(id))
    ipcMain.handle('tickets:create',    (_e, data)    => ticketService.create(data))
    ipcMain.handle('tickets:update',    (_e, id, data)=> ticketService.update(id, data))
    ipcMain.handle('tickets:delete',    (_e, id)      => ticketService.delete(id))
  }
}

export default ticketController
