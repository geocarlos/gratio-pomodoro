import React, { useEffect } from 'react'
import { Timer } from './components/Timer/Timer'
import { TaskList } from './components/TaskList/TaskList'
import { History } from './components/History/History'
import { Settings } from './components/Settings/Settings'
import { useSettingsStore } from './store/settingsStore'
import { useTaskStore } from './store/taskStore'
import { useTimer } from './hooks/useTimer'
import styles from './App.module.css'

type Tab = 'timer' | 'tasks' | 'history' | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'timer', label: 'Timer', icon: '⏱' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'history', label: 'History', icon: '📋' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
]

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState<Tab>('timer')
  const { load: loadSettings } = useSettingsStore()
  const { load: loadTasks } = useTaskStore()
  const timer = useTimer()

  useEffect(() => {
    loadSettings()
    loadTasks()
  }, [])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>🍅 Gratio Pomodoro</h1>
      </header>
      <main className={styles.main}>
        {activeTab === 'timer' && <Timer {...timer} />}
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'history' && <History />}
        {activeTab === 'settings' && <Settings />}
      </main>
      <nav className={styles.nav}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.navBtn} ${activeTab === tab.id ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.navIcon}>{tab.icon}</span>
            <span className={styles.navLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
