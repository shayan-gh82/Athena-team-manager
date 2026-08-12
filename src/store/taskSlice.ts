import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockTasks } from '@/data/mock'
import type { Task, TaskFormData } from '@/types'
import { createId } from '@/utils/id'
import { removeProject } from './projectSlice'
import { removeUser } from './usersSlice'

type TaskState = { tasks: Task[] }
const initialState: TaskState = { tasks: mockTasks }

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        state.tasks.push(action.payload)
      },
      prepare(payload: { projectId: string; data: TaskFormData; createdBy: string; order?: number }) {
        const now = new Date().toISOString()
        return {
          payload: {
            id: createId(),
            projectId: payload.projectId,
            ...payload.data,
            order: payload.order ?? 0,
            isArchived: false,
            createdBy: payload.createdBy,
            createdAt: now,
            updatedAt: now,
          } satisfies Task,
        }
      },
    },
    updateTask(state, action: PayloadAction<{ id: string; data: Partial<TaskFormData> }>) {
      const task = state.tasks.find((item) => item.id === action.payload.id)
      if (task) Object.assign(task, action.payload.data, { updatedAt: new Date().toISOString() })
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    moveTask(state, action: PayloadAction<{ taskId: string; columnId: string; order: number }>) {
      const task = state.tasks.find((item) => item.id === action.payload.taskId)
      if (task) {
        task.columnId = action.payload.columnId
        task.order = action.payload.order
        task.updatedAt = new Date().toISOString()
      }
    },
    toggleTaskArchive(state, action: PayloadAction<string>) {
      const task = state.tasks.find((item) => item.id === action.payload)
      if (task) task.isArchived = !task.isArchived
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeProject, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.projectId !== action.payload)
      })
      .addCase(removeUser, (state, action) => {
        state.tasks.forEach((task) => { if (task.assigneeId === action.payload) task.assigneeId = undefined })
      })
  },
})

export const { addTask, updateTask, removeTask, moveTask, toggleTaskArchive } = taskSlice.actions
export default taskSlice.reducer
