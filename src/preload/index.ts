import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { Settings, HistoryEntry, Task, TimerState } from '@shared/types'

const api = {
  settings: {
    get: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
    set: (settings: Settings): Promise<void> => ipcRenderer.invoke('settings:set', settings)
  },
  history: {
    get: (): Promise<HistoryEntry[]> => ipcRenderer.invoke('history:get'),
    save: (entry: HistoryEntry): Promise<void> => ipcRenderer.invoke('history:save', entry)
  },
  tasks: {
    get: (): Promise<Task[]> => ipcRenderer.invoke('tasks:get'),
    save: (tasks: Task[]): Promise<void> => ipcRenderer.invoke('tasks:save', tasks)
  },
  notification: {
    send: (title: string, body: string): void =>
      ipcRenderer.send('notification:send', title, body)
  },
  tray: {
    setState: (state: TimerState): void => ipcRenderer.send('tray:setState', state),
    onToggle: (cb: () => void): (() => void) => {
      ipcRenderer.on('tray:toggle', cb)
      return () => ipcRenderer.removeListener('tray:toggle', cb)
    },
    onSkip: (cb: () => void): (() => void) => {
      ipcRenderer.on('tray:skip', cb)
      return () => ipcRenderer.removeListener('tray:skip', cb)
    },
    onReset: (cb: () => void): (() => void) => {
      ipcRenderer.on('tray:reset', cb)
      return () => ipcRenderer.removeListener('tray:reset', cb)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
