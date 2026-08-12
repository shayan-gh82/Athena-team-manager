import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TaskTemplate } from '@/types'
import { createId } from '@/utils/id'

const now = new Date().toISOString()
const builtIns: TaskTemplate[] = [
  { id: 'tpl-bug', name: 'Bug Report', title: 'Fix: ', description: 'Describe the issue, expected behavior, reproduction steps, and acceptance criteria.', priority: 'high', estimateMinutes: 120, recurrence: 'none', isBuiltIn: true, createdAt: now },
  { id: 'tpl-feature', name: 'Feature Development', title: 'Build ', description: 'Define the user outcome, implementation notes, acceptance criteria, and edge cases.', priority: 'medium', estimateMinutes: 240, recurrence: 'none', isBuiltIn: true, createdAt: now },
  { id: 'tpl-review', name: 'Design Review', title: 'Review ', description: 'Review the design for consistency, accessibility, responsiveness, and implementation readiness.', priority: 'medium', estimateMinutes: 90, recurrence: 'none', isBuiltIn: true, createdAt: now },
  { id: 'tpl-research', name: 'Research Task', title: 'Research ', description: 'Document the question, sources, findings, trade-offs, and recommended next step.', priority: 'low', estimateMinutes: 120, recurrence: 'none', isBuiltIn: true, createdAt: now },
]

type TaskTemplatesState = { templates: TaskTemplate[] }
const initialState: TaskTemplatesState = { templates: builtIns }

const taskTemplatesSlice = createSlice({
  name: 'taskTemplates',
  initialState,
  reducers: {
    addTaskTemplate: {
      reducer(state, action: PayloadAction<TaskTemplate>) { state.templates.push(action.payload) },
      prepare(payload: Omit<TaskTemplate, 'id' | 'isBuiltIn' | 'createdAt'>) {
        return { payload: { id: createId(), isBuiltIn: false, createdAt: new Date().toISOString(), ...payload } satisfies TaskTemplate }
      },
    },
    removeTaskTemplate(state, action: PayloadAction<string>) {
      state.templates = state.templates.filter((template) => template.isBuiltIn || template.id !== action.payload)
    },
  },
})

export const { addTaskTemplate, removeTaskTemplate } = taskTemplatesSlice.actions
export default taskTemplatesSlice.reducer
