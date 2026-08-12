import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockColumns } from '@/data/mock'
import type { BoardColumn } from '@/types'
import { createId } from '@/utils/id'
import { addProject, removeProject } from './projectSlice'

type BoardState = { columns: BoardColumn[] }
const initialState: BoardState = { columns: mockColumns }

const defaultColumnSpecs = [
  { title: 'To Do', color: '#3B82F6', isCompletedColumn: false },
  { title: 'In Progress', color: '#8B5CF6', isCompletedColumn: false },
  { title: 'Review', color: '#F59E0B', isCompletedColumn: false },
  { title: 'Done', color: '#10B981', isCompletedColumn: true },
]

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addColumn: {
      reducer(state, action: PayloadAction<BoardColumn>) {
        state.columns.push(action.payload)
      },
      prepare(payload: { projectId: string; title: string; color?: string; isCompletedColumn?: boolean; order: number }) {
        return { payload: { id: createId(), ...payload, isCompletedColumn: payload.isCompletedColumn ?? false } }
      },
    },
    updateColumn(state, action: PayloadAction<{ id: string; changes: Partial<Pick<BoardColumn, 'title' | 'color' | 'order' | 'isCompletedColumn'>> }>) {
      const column = state.columns.find((c) => c.id === action.payload.id)
      if (column) Object.assign(column, action.payload.changes)
    },
    removeColumn(state, action: PayloadAction<string>) {
      state.columns = state.columns.filter((c) => c.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProject, (state, action) => {
        defaultColumnSpecs.forEach((spec, index) => {
          state.columns.push({ id: createId(), projectId: action.payload.id, order: index, ...spec })
        })
      })
      .addCase(removeProject, (state, action) => {
        state.columns = state.columns.filter((column) => column.projectId !== action.payload)
      })
  },
})

export const { addColumn, updateColumn, removeColumn } = boardSlice.actions
export default boardSlice.reducer
