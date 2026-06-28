import { ElectronAPI } from '@electron-toolkit/preload'
import type { Settings, HistoryEntry, Task, TimerState } from '../shared/types'

export interface PomodoroAPI {
  settings: {
    get: () => Promise<Settings>
    set: (settings: Settings) => Promise<void>
  }
  history: {
    get: () => Promise<HistoryEntry[]>
    save: (entry: HistoryEntry) => Promise<void>
  }
  tasks: {
    get: () => Promise<Task[]>
    save: (tasks: Task[]) => Promise<void>
  }
  notification: {
    send: (title: string, body: string) => void
  }
  tray: {
    setState: (state: TimerState) => void
    onToggle: (cb: () => void) => () => void
    onSkip: (cb: () => void) => () => void
    onReset: (cb: () => void) => () => void
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: PomodoroAPI
  }
}
