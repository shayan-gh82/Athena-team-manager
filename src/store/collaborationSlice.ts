import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  mockActivities, mockChecklist, mockComments, mockLabels, mockMilestones, mockSubtasks, mockTimeEntries,
} from '@/data/mock'
import type {
  Activity, Attachment, ChecklistItem, Comment, CustomFieldDefinition, CustomFieldValue, Label, Milestone, Subtask, TaskDependency, TimeEntry,
} from '@/types'
import { createId } from '@/utils/id'
import { removeProject } from './projectSlice'
import { removeTask } from './taskSlice'

type CollaborationState = {
  labels: Label[]
  checklistItems: ChecklistItem[]
  subtasks: Subtask[]
  comments: Comment[]
  activities: Activity[]
  dependencies: TaskDependency[]
  milestones: Milestone[]
  timeEntries: TimeEntry[]
  attachments: Attachment[]
  customFields: CustomFieldDefinition[]
  customFieldValues: CustomFieldValue[]
}

const initialState: CollaborationState = {
  labels: mockLabels,
  checklistItems: mockChecklist,
  subtasks: mockSubtasks,
  comments: mockComments,
  activities: mockActivities,
  dependencies: [],
  milestones: mockMilestones,
  timeEntries: mockTimeEntries,
  attachments: [],
  customFields: [],
  customFieldValues: [],
}

const collaborationSlice = createSlice({
  name: 'collaboration', initialState,
  reducers: {
    addLabel(state, action: PayloadAction<Omit<Label, 'id'>>) { state.labels.push({ id: createId(), ...action.payload }) },
    addChecklistItem(state, action: PayloadAction<{ taskId: string; title: string }>) {
      state.checklistItems.push({ id: createId(), taskId: action.payload.taskId, title: action.payload.title, completed: false, order: state.checklistItems.filter((x) => x.taskId === action.payload.taskId).length, createdAt: new Date().toISOString() })
    },
    toggleChecklistItem(state, action: PayloadAction<string>) {
      const item = state.checklistItems.find((x) => x.id === action.payload); if (item) item.completed = !item.completed
    },
    removeChecklistItem(state, action: PayloadAction<string>) { state.checklistItems = state.checklistItems.filter((x) => x.id !== action.payload) },
    addSubtask(state, action: PayloadAction<{ taskId: string; title: string; assigneeId?: string; dueDate?: string }>) {
      state.subtasks.push({ id: createId(), completed: false, createdAt: new Date().toISOString(), ...action.payload })
    },
    toggleSubtask(state, action: PayloadAction<string>) { const item = state.subtasks.find((x) => x.id === action.payload); if (item) item.completed = !item.completed },
    removeSubtask(state, action: PayloadAction<string>) { state.subtasks = state.subtasks.filter((x) => x.id !== action.payload) },
    addComment(state, action: PayloadAction<{ taskId: string; authorId: string; content: string; parentId?: string }>) {
      state.comments.push({ id: createId(), createdAt: new Date().toISOString(), ...action.payload })
    },
    removeComment(state, action: PayloadAction<string>) {
      const ids = new Set<string>([action.payload])
      let changed = true
      while (changed) {
        changed = false
        state.comments.forEach((comment) => {
          if (comment.parentId && ids.has(comment.parentId) && !ids.has(comment.id)) { ids.add(comment.id); changed = true }
        })
      }
      state.comments = state.comments.filter((comment) => !ids.has(comment.id))
    },
    addActivity(state, action: PayloadAction<Omit<Activity, 'id' | 'createdAt'>>) {
      state.activities.unshift({ id: createId(), createdAt: new Date().toISOString(), ...action.payload })
      state.activities = state.activities.slice(0, 250)
    },
    addDependency(state, action: PayloadAction<{ taskId: string; dependsOnTaskId: string }>) {
      if (!state.dependencies.some((x) => x.taskId === action.payload.taskId && x.dependsOnTaskId === action.payload.dependsOnTaskId)) {
        state.dependencies.push({ id: createId(), createdAt: new Date().toISOString(), ...action.payload })
      }
    },
    removeDependency(state, action: PayloadAction<string>) { state.dependencies = state.dependencies.filter((x) => x.id !== action.payload) },
    addMilestone(state, action: PayloadAction<{ projectId: string; title: string; dueDate: string }>) {
      state.milestones.push({ id: createId(), completed: false, createdAt: new Date().toISOString(), ...action.payload })
    },
    toggleMilestone(state, action: PayloadAction<string>) { const item = state.milestones.find((x) => x.id === action.payload); if (item) item.completed = !item.completed },
    addTimeEntry(state, action: PayloadAction<{ taskId: string; userId: string; minutes: number; note?: string }>) {
      state.timeEntries.unshift({ id: createId(), createdAt: new Date().toISOString(), ...action.payload })
    },
    addAttachment(state, action: PayloadAction<Omit<Attachment, 'id' | 'createdAt'>>) {
      state.attachments.push({ id: createId(), createdAt: new Date().toISOString(), ...action.payload })
    },
    removeAttachment(state, action: PayloadAction<string>) { state.attachments = state.attachments.filter((x) => x.id !== action.payload) },
    addCustomField(state, action: PayloadAction<Omit<CustomFieldDefinition, 'id'>>) { state.customFields.push({ id: createId(), ...action.payload }) },
    removeCustomField(state, action: PayloadAction<string>) {
      state.customFields = state.customFields.filter((field) => field.id !== action.payload)
      state.customFieldValues = state.customFieldValues.filter((value) => value.fieldId !== action.payload)
    },
    setCustomFieldValue(state, action: PayloadAction<{ taskId: string; fieldId: string; value: string }>) {
      const existing = state.customFieldValues.find((x) => x.taskId === action.payload.taskId && x.fieldId === action.payload.fieldId)
      if (existing) existing.value = action.payload.value
      else state.customFieldValues.push({ id: createId(), ...action.payload })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeProject, (state, action) => {
        const removedFieldIds = new Set(state.customFields.filter((x) => x.projectId === action.payload).map((x) => x.id))
        state.labels = state.labels.filter((x) => x.projectId !== action.payload)
        state.milestones = state.milestones.filter((x) => x.projectId !== action.payload)
        state.activities = state.activities.filter((x) => x.projectId !== action.payload)
        state.customFields = state.customFields.filter((x) => x.projectId !== action.payload)
        state.customFieldValues = state.customFieldValues.filter((x) => !removedFieldIds.has(x.fieldId))
      })
      .addCase(removeTask, (state, action) => {
        const id = action.payload
        state.checklistItems = state.checklistItems.filter((x) => x.taskId !== id)
        state.subtasks = state.subtasks.filter((x) => x.taskId !== id)
        state.comments = state.comments.filter((x) => x.taskId !== id)
        state.dependencies = state.dependencies.filter((x) => x.taskId !== id && x.dependsOnTaskId !== id)
        state.timeEntries = state.timeEntries.filter((x) => x.taskId !== id)
        state.attachments = state.attachments.filter((x) => x.taskId !== id)
        state.customFieldValues = state.customFieldValues.filter((x) => x.taskId !== id)
      })
  },
})

export const {
  addLabel, addChecklistItem, toggleChecklistItem, removeChecklistItem, addSubtask, toggleSubtask, removeSubtask,
  addComment, removeComment, addActivity, addDependency, removeDependency, addMilestone, toggleMilestone,
  addTimeEntry, addAttachment, removeAttachment, addCustomField, removeCustomField, setCustomFieldValue,
} = collaborationSlice.actions
export default collaborationSlice.reducer
