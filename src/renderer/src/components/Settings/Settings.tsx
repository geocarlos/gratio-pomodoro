import React from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import type { Settings as SettingsType } from '@shared/types'
import styles from './Settings.module.css'

export function Settings(): React.JSX.Element {
  const { settings, update } = useSettingsStore()

  function set<K extends keyof SettingsType>(key: K, value: SettingsType[K]): void {
    update({ ...settings, [key]: value })
  }

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Timer Durations</h3>
        <div className={styles.row}>
          <label className={styles.label}>Focus (minutes)</label>
          <input
            type="number"
            className={styles.numberInput}
            value={settings.focusDuration}
            min={1}
            max={120}
            onChange={(e) => set('focusDuration', Number(e.target.value))}
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Short Break (minutes)</label>
          <input
            type="number"
            className={styles.numberInput}
            value={settings.shortBreakDuration}
            min={1}
            max={60}
            onChange={(e) => set('shortBreakDuration', Number(e.target.value))}
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Long Break (minutes)</label>
          <input
            type="number"
            className={styles.numberInput}
            value={settings.longBreakDuration}
            min={1}
            max={60}
            onChange={(e) => set('longBreakDuration', Number(e.target.value))}
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Sessions before long break</label>
          <input
            type="number"
            className={styles.numberInput}
            value={settings.sessionsBeforeLong}
            min={1}
            max={10}
            onChange={(e) => set('sessionsBeforeLong', Number(e.target.value))}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Sound</h3>
        <div className={styles.row}>
          <label className={styles.label}>Enable sounds</label>
          <input
            type="checkbox"
            className={styles.toggle}
            checked={settings.soundEnabled}
            onChange={(e) => set('soundEnabled', e.target.checked)}
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Volume</label>
          <input
            type="range"
            className={styles.slider}
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            disabled={!settings.soundEnabled}
            onChange={(e) => set('volume', Number(e.target.value))}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Window</h3>
        <div className={styles.row}>
          <label className={styles.label}>Always on top</label>
          <input
            type="checkbox"
            className={styles.toggle}
            checked={settings.alwaysOnTop}
            onChange={(e) => set('alwaysOnTop', e.target.checked)}
          />
        </div>
      </section>
    </div>
  )
}
