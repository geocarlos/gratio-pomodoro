import Store from 'electron-store'
import type { Settings, HistoryEntry, Task } from '@shared/types'

interface StoreSchema {
  settings: Settings
  history: HistoryEntry[]
  tasks: Task[]
}

const defaults: StoreSchema = {
  settings: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLong: 4,
    soundEnabled: true,
    volume: 0.7,
    alwaysOnTop: false
  },
  history: [],
  tasks: []
}

export const store = new Store<StoreSchema>({ defaults })
