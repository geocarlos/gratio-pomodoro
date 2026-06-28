import { ipcMain, BrowserWindow } from 'electron'
import { store } from './store'
import { sendNotification } from './notifications'
import { updateTrayMenu } from './tray'
import type { Settings, HistoryEntry, Task, TimerState } from '@shared/types'

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  ipcMain.handle('settings:get', () => store.get('settings'))
  ipcMain.handle('settings:set', (_e, settings: Settings) => {
    store.set('settings', settings)
    mainWindow.setAlwaysOnTop(settings.alwaysOnTop)
  })

  ipcMain.handle('history:get', () => store.get('history'))
  ipcMain.handle('history:save', (_e, entry: HistoryEntry) => {
    const history = store.get('history')
    store.set('history', [entry, ...history].slice(0, 500))
  })

  ipcMain.handle('tasks:get', () => store.get('tasks'))
  ipcMain.handle('tasks:save', (_e, tasks: Task[]) => {
    store.set('tasks', tasks)
  })

  ipcMain.on('notification:send', (_e, title: string, body: string) => {
    sendNotification(title, body)
  })

  ipcMain.on('tray:setState', (_e, state: TimerState) => {
    updateTrayMenu(mainWindow, state)
  })
}
