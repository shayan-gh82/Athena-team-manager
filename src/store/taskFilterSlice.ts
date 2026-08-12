import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TaskPriority } from '@/types'

export type PriorityFilter = 'all' | TaskPriority
export type SortOption = 'none' | 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title'

type TaskFilterState = {
  search: string
  priority: PriorityFilter
  columnId: string
  assigneeId: string
  dueDateFrom: string
  dueDateTo: string
  sortBy: SortOption
}

const initialState: TaskFilterState = {
  search: '', priority: 'all', columnId: 'all', assigneeId: 'all', dueDateFrom: '', dueDateTo: '', sortBy: 'none',
}

const taskFilterSlice = createSlice({
  name: 'taskFilter', initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => { state.search = action.payload },
    setPriority: (state, action: PayloadAction<PriorityFilter>) => { state.priority = action.payload },
    setColumnFilter: (state, action: PayloadAction<string>) => { state.columnId = action.payload },
    setAssigneeFilter: (state, action: PayloadAction<string>) => { state.assigneeId = action.payload },
    setDueDateFrom: (state, action: PayloadAction<string>) => { state.dueDateFrom = action.payload },
    setDueDateTo: (state, action: PayloadAction<string>) => { state.dueDateTo = action.payload },
    setSortBy: (state, action: PayloadAction<SortOption>) => { state.sortBy = action.payload },
    resetFilters: () => initialState,
  },
})

export const { setSearch, setPriority, setColumnFilter, setAssigneeFilter, setDueDateFrom, setDueDateTo, setSortBy, resetFilters } = taskFilterSlice.actions
export default taskFilterSlice.reducer
