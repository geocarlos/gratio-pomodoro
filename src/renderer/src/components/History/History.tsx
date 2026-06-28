import React, { useEffect, useState } from 'react'
import styles from './History.module.css'
import type { HistoryEntry } from '@shared/types'

const PHASE_LABELS: Record<string, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break'
}

const PHASE_COLORS: Record<string, string> = {
  focus: '#e74c3c',
  shortBreak: '#2ecc71',
  longBreak: '#3498db'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function History(): React.JSX.Element {
  const [entries, setEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    window.api.history.get().then(setEntries)
  }, [])

  const today = new Date().toDateString()
  const todayEntries = entries.filter((e) => new Date(e.date).toDateString() === today)
  const focusToday = todayEntries.filter((e) => e.phase === 'focus')
  const totalMinutesToday = focusToday.reduce((sum, e) => sum + e.durationMinutes, 0)
  const allTimeFocus = entries.filter((e) => e.phase === 'focus').length

  return (
    <div className={styles.container}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{focusToday.length}</span>
          <span className={styles.statLabel}>Focus sessions today</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalMinutesToday}m</span>
          <span className={styles.statLabel}>Focus time today</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{allTimeFocus}</span>
          <span className={styles.statLabel}>All-time sessions</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>
          No sessions recorded yet. Complete a focus session to see history here.
        </p>
      ) : (
        <ul className={styles.list}>
          {entries.slice(0, 50).map((entry) => (
            <li key={entry.id} className={styles.entry}>
              <span
                className={styles.phaseDot}
                style={{ background: PHASE_COLORS[entry.phase] }}
              />
              <div className={styles.entryInfo}>
                <span className={styles.entryPhase}>{PHASE_LABELS[entry.phase]}</span>
                {entry.taskText && (
                  <span className={styles.entryTask}>{entry.taskText}</span>
                )}
              </div>
              <div className={styles.entryRight}>
                <span className={styles.entryDuration}>{entry.durationMinutes}m</span>
                <span className={styles.entryDate}>{formatDate(entry.date)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
