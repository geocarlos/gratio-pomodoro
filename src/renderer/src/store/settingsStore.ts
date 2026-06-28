import { create } from 'zustand'
import type { Settings } from '@shared/types'

const defaultSettings: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLong: 4,
  soundEnabled: true,
  volume: 0.7,
  alwaysOnTop: false
}

interface SettingsStore {
  settings: Settings
  loaded: boolean
  load: () => Promise<void>
  update: (settings: Settings) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  loaded: false,
  load: async () => {
    const settings = await window.api.settings.get()
    set({ settings, loaded: true })
  },
  update: async (settings: Settings) => {
    set({ settings })
    await window.api.settings.set(settings)
  }
}))
