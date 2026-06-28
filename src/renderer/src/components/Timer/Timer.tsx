import React from 'react'
import type { useTimer } from '../../hooks/useTimer'
import { useTimerStore } from '../../store/timerStore'
import { useTaskStore } from '../../store/taskStore'
import styles from './Timer.module.css'
import type { TimerPhase } from '@shared/types'

type TimerControls = ReturnType<typeof useTimer>

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break'
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  focus: '#e74c3c',
  shortBreak: '#2ecc71',
  longBreak: '#3498db'
}

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function Timer({ phase, state, minutes, seconds, progress, sessionCount, toggle, reset, skip }: TimerControls): React.JSX.Element {
  const { totalSessionsToday } = useTimerStore()
  const { tasks, activeTaskId, setActiveTask } = useTaskStore()
  const activeTask = tasks.find((t) => t.id === activeTaskId)
  const color = PHASE_COLORS[phase]
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className={styles.container}>
      <div className={styles.phaseChip} style={{ background: color }}>
        {PHASE_LABELS[phase]}
      </div>

      <div className={styles.ring}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="var(--color-track)"
            strokeWidth="10"
          />
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className={styles.time}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className={styles.sessionInfo}>
        Session {sessionCount + 1} of 4 &middot; {totalSessionsToday} completed today
      </div>

      {activeTask && (
        <div className={styles.activeTask}>
          <span className={styles.activeTaskLabel}>Working on:</span>
          <span className={styles.activeTaskText}>{activeTask.text}</span>
          <button
            className={styles.clearTask}
            onClick={() => setActiveTask(null)}
            title="Clear active task"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.controls}>
        <button className={styles.btnSecondary} onClick={reset} title="Reset">
          ↺
        </button>
        <button
          className={styles.btnPrimary}
          style={{ background: color }}
          onClick={toggle}
        >
          {state === 'running' ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className={styles.btnSecondary} onClick={skip} title="Skip">
          ⏭
        </button>
      </div>
    </div>
  )
}
