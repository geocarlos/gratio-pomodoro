import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '../store/timerStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTaskStore } from '../store/taskStore'
import { useSound } from './useSound'
import type { TimerPhase, Settings } from '@shared/types'

function getPhaseDuration(phase: TimerPhase, settings: Settings): number {
  switch (phase) {
    case 'focus':
      return settings.focusDuration * 60
    case 'shortBreak':
      return settings.shortBreakDuration * 60
    case 'longBreak':
      return settings.longBreakDuration * 60
  }
}

export function useTimer(): {
  phase: TimerPhase
  state: 'idle' | 'running' | 'paused'
  minutes: number
  seconds: number
  progress: number
  sessionCount: number
  toggle: () => void
  reset: () => void
  skip: () => void
} {
  const {
    phase,
    state,
    secondsLeft,
    sessionCount,
    setPhase,
    setState,
    setSecondsLeft,
    setSessionCount,
    incrementTodaySessions
  } = useTimerStore()
  const { settings } = useSettingsStore()
  const { tasks, activeTaskId, incrementPomodoros } = useTaskStore()
  const { playFocusEnd, playBreakEnd } = useSound()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Refs so interval callback always reads latest values
  const phaseRef = useRef(phase)
  const stateRef = useRef(state)
  const secondsRef = useRef(secondsLeft)
  const settingsRef = useRef(settings)
  const sessionCountRef = useRef(sessionCount)
  const activeTaskIdRef = useRef(activeTaskId)
  const tasksRef = useRef(tasks)
  const playFocusEndRef = useRef(playFocusEnd)
  const playBreakEndRef = useRef(playBreakEnd)

  phaseRef.current = phase
  stateRef.current = state
  secondsRef.current = secondsLeft
  settingsRef.current = settings
  sessionCountRef.current = sessionCount
  activeTaskIdRef.current = activeTaskId
  tasksRef.current = tasks
  playFocusEndRef.current = playFocusEnd
  playBreakEndRef.current = playBreakEnd

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const advancePhase = useCallback(() => {
    const currentPhase = phaseRef.current
    const s = settingsRef.current

    if (currentPhase === 'focus') {
      playFocusEndRef.current()
      window.api.notification.send('Focus session complete!', 'Time for a break.')

      if (activeTaskIdRef.current) {
        incrementPomodoros(activeTaskIdRef.current)
      }
      incrementTodaySessions()

      const newCount = sessionCountRef.current + 1
      setSessionCount(newCount)

      const activeTask = activeTaskIdRef.current
        ? tasksRef.current.find((t) => t.id === activeTaskIdRef.current)
        : undefined
      window.api.history.save({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        phase: 'focus',
        durationMinutes: s.focusDuration,
        taskId: activeTask?.id,
        taskText: activeTask?.text
      })

      const nextPhase: TimerPhase =
        newCount >= s.sessionsBeforeLong ? 'longBreak' : 'shortBreak'

      if (nextPhase === 'longBreak') setSessionCount(0)

      setPhase(nextPhase)
      setSecondsLeft(getPhaseDuration(nextPhase, s))
      setState('idle')
      window.api.tray.setState('idle')
    } else {
      playBreakEndRef.current()
      window.api.notification.send('Break over!', 'Ready to focus again?')

      window.api.history.save({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        phase: currentPhase,
        durationMinutes:
          currentPhase === 'longBreak' ? s.longBreakDuration : s.shortBreakDuration
      })

      setPhase('focus')
      setSecondsLeft(getPhaseDuration('focus', s))
      setState('idle')
      window.api.tray.setState('idle')
    }
  }, [
    setPhase,
    setState,
    setSecondsLeft,
    setSessionCount,
    incrementTodaySessions,
    incrementPomodoros
  ])

  const start = useCallback(() => {
    if (stateRef.current === 'running') return
    setState('running')
    window.api.tray.setState('running')
    intervalRef.current = setInterval(() => {
      const next = secondsRef.current - 1
      if (next <= 0) {
        clearTimer()
        advancePhase()
      } else {
        setSecondsLeft(next)
      }
    }, 1000)
  }, [clearTimer, advancePhase, setState, setSecondsLeft])

  const pause = useCallback(() => {
    clearTimer()
    setState('paused')
    window.api.tray.setState('paused')
  }, [clearTimer, setState])

  const toggle = useCallback(() => {
    if (stateRef.current === 'running') {
      pause()
    } else {
      start()
    }
  }, [start, pause])

  const reset = useCallback(() => {
    clearTimer()
    setState('idle')
    setSecondsLeft(getPhaseDuration(phaseRef.current, settingsRef.current))
    window.api.tray.setState('idle')
  }, [clearTimer, setState, setSecondsLeft])

  const skip = useCallback(() => {
    clearTimer()
    advancePhase()
  }, [clearTimer, advancePhase])

  // Listen for tray commands
  useEffect(() => {
    const unsubToggle = window.api.tray.onToggle(toggle)
    const unsubSkip = window.api.tray.onSkip(skip)
    const unsubReset = window.api.tray.onReset(reset)
    return () => {
      unsubToggle()
      unsubSkip()
      unsubReset()
    }
  }, [toggle, skip, reset])

  // Sync secondsLeft when settings change and timer is idle
  useEffect(() => {
    if (stateRef.current === 'idle') {
      setSecondsLeft(getPhaseDuration(phaseRef.current, settings))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const totalSeconds = getPhaseDuration(phase, settings)
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return { phase, state, minutes, seconds, progress, sessionCount, toggle, reset, skip }
}
