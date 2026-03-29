/**
 * index.js (preload)
 * Bridge IPC sécurisé via contextBridge
 */
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  tickets: {
    getAll:   (filters) => ipcRenderer.invoke('tickets:getAll', filters),
    getById:  (id)      => ipcRenderer.invoke('tickets:getById', id),
    create:   (data)    => ipcRenderer.invoke('tickets:create', data),
    update:   (id, data)=> ipcRenderer.invoke('tickets:update', id, data),
    delete:   (id)      => ipcRenderer.invoke('tickets:delete', id)
  }
})
