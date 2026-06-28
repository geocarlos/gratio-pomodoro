import { Tray, Menu, BrowserWindow, app } from 'electron'
import type { TimerState } from '@shared/types'

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow, iconPath: string): void {
  tray = new Tray(iconPath)
  tray.setToolTip('Gratio Pomodoro')
  tray.on('double-click', () => {
    mainWindow.show()
    mainWindow.focus()
  })
  updateTrayMenu(mainWindow, 'idle')
}

export function updateTrayMenu(mainWindow: BrowserWindow, state: TimerState): void {
  if (!tray) return
  const contextMenu = Menu.buildFromTemplate([
    {
      label: state === 'running' ? 'Pause' : 'Start',
      click: () => mainWindow.webContents.send('tray:toggle')
    },
    {
      label: 'Skip',
      click: () => mainWindow.webContents.send('tray:skip')
    },
    {
      label: 'Reset',
      click: () => mainWindow.webContents.send('tray:reset')
    },
    { type: 'separator' },
    {
      label: 'Show Window',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ])
  tray.setContextMenu(contextMenu)
}
