export interface Settings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLong: number
  soundEnabled: boolean
  volume: number
  alwaysOnTop: boolean
}

export interface HistoryEntry {
  id: string
  date: string
  phase: TimerPhase
  durationMinutes: number
  taskId?: string
  taskText?: string
}

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
  pomodorosCompleted: number
}

export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak'
export type TimerState = 'idle' | 'running' | 'paused'
