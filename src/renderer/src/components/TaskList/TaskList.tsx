import React, { useState } from 'react'
import { useTaskStore } from '../../store/taskStore'
import styles from './TaskList.module.css'

export function TaskList(): React.JSX.Element {
  const { tasks, activeTaskId, addTask, toggleTask, deleteTask, setActiveTask } = useTaskStore()
  const [input, setInput] = useState('')

  const handleAdd = (e: React.FormEvent): void => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    addTask(trimmed)
    setInput('')
  }

  const pending = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleAdd}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={200}
        />
        <button className={styles.addBtn} type="submit" disabled={!input.trim()}>
          Add
        </button>
      </form>

      {pending.length === 0 && done.length === 0 && (
        <p className={styles.empty}>No tasks yet. Add one above to get started.</p>
      )}

      <ul className={styles.list}>
        {pending.map((task) => (
          <li
            key={task.id}
            className={`${styles.item} ${activeTaskId === task.id ? styles.active : ''}`}
          >
            <input
              type="checkbox"
              checked={false}
              onChange={() => toggleTask(task.id)}
              className={styles.checkbox}
            />
            <span
              className={styles.text}
              onClick={() => setActiveTask(activeTaskId === task.id ? null : task.id)}
              title="Click to set as active task"
            >
              {task.text}
            </span>
            {task.pomodorosCompleted > 0 && (
              <span className={styles.pomodoros} title="Pomodoros completed">
                🍅 {task.pomodorosCompleted}
              </span>
            )}
            <button
              className={styles.deleteBtn}
              onClick={() => deleteTask(task.id)}
              title="Delete task"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {done.length > 0 && (
        <>
          <p className={styles.sectionLabel}>Completed ({done.length})</p>
          <ul className={styles.list}>
            {done.map((task) => (
              <li key={task.id} className={`${styles.item} ${styles.done}`}>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => toggleTask(task.id)}
                  className={styles.checkbox}
                />
                <span className={styles.text}>{task.text}</span>
                {task.pomodorosCompleted > 0 && (
                  <span className={styles.pomodoros}>🍅 {task.pomodorosCompleted}</span>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
