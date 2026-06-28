import { create } from 'zustand'
import type { TimerPhase, TimerState } from '@shared/types'

interface TimerStore {
  phase: TimerPhase
  state: TimerState
  secondsLeft: number
  sessionCount: number
  totalSessionsToday: number
  setPhase: (phase: TimerPhase) => void
  setState: (state: TimerState) => void
  setSecondsLeft: (s: number) => void
  setSessionCount: (n: number) => void
  incrementTodaySessions: () => void
}

export const useTimerStore = create<TimerStore>((set) => ({
  phase: 'focus',
  state: 'idle',
  secondsLeft: 25 * 60,
  sessionCount: 0,
  totalSessionsToday: 0,
  setPhase: (phase) => set({ phase }),
  setState: (state) => set({ state }),
  setSecondsLeft: (secondsLeft) => set({ secondsLeft }),
  setSessionCount: (sessionCount) => set({ sessionCount }),
  incrementTodaySessions: () =>
    set((s) => ({ totalSessionsToday: s.totalSessionsToday + 1 }))
}))
