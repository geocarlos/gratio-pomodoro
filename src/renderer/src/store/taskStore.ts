import { create } from 'zustand'
import type { Task } from '@shared/types'

interface TaskStore {
  tasks: Task[]
  activeTaskId: string | null
  loaded: boolean
  load: () => Promise<void>
  addTask: (text: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  setActiveTask: (id: string | null) => void
  incrementPomodoros: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  activeTaskId: null,
  loaded: false,

  load: async () => {
    const tasks = await window.api.tasks.get()
    set({ tasks, loaded: true })
  },

  addTask: (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      pomodorosCompleted: 0
    }
    const tasks = [newTask, ...get().tasks]
    set({ tasks })
    window.api.tasks.save(tasks)
  },

  toggleTask: (id: string) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    set({ tasks })
    window.api.tasks.save(tasks)
  },

  deleteTask: (id: string) => {
    const tasks = get().tasks.filter((t) => t.id !== id)
    const activeTaskId = get().activeTaskId === id ? null : get().activeTaskId
    set({ tasks, activeTaskId })
    window.api.tasks.save(tasks)
  },

  setActiveTask: (id: string | null) => {
    set({ activeTaskId: id })
  },

  incrementPomodoros: (id: string) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 } : t
    )
    set({ tasks })
    window.api.tasks.save(tasks)
  }
}))
