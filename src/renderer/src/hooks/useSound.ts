import { useRef, useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useSound(): {
  playFocusEnd: () => void
  playBreakEnd: () => void
} {
  const { settings } = useSettingsStore()
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const playBeep = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (!settings.soundEnabled) return
      const ctx = getCtx()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.value = frequency
      oscillator.type = type
      gainNode.gain.setValueAtTime(settings.volume * 0.5, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    },
    [settings.soundEnabled, settings.volume, getCtx]
  )

  const playFocusEnd = useCallback(() => {
    playBeep(880, 0.3)
    setTimeout(() => playBeep(1100, 0.4), 400)
    setTimeout(() => playBeep(1320, 0.5), 900)
  }, [playBeep])

  const playBreakEnd = useCallback(() => {
    playBeep(660, 0.3)
    setTimeout(() => playBeep(550, 0.4), 400)
  }, [playBeep])

  return { playFocusEnd, playBreakEnd }
}
