import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockProjects } from '@/data/mock'
import type { Project, ProjectFormData } from '@/types'
import { createId } from '@/utils/id'
import { removeUser } from './usersSlice'

type ProjectState = { projects: Project[] }
const initialState: ProjectState = { projects: mockProjects }

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: {
      reducer(state, action: PayloadAction<Project>) {
        state.projects.push(action.payload)
      },
      prepare(payload: { data: ProjectFormData; ownerId: string }) {
        const now = new Date().toISOString()
        const memberIds = Array.from(new Set([payload.ownerId, ...payload.data.memberIds]))
        return {
          payload: {
            id: createId(),
            ...payload.data,
            ownerId: payload.ownerId,
            memberIds,
            isFavorite: false,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
          } satisfies Project,
        }
      },
    },
    updateProject(state, action: PayloadAction<{ id: string; data: ProjectFormData }>) {
      const project = state.projects.find((p) => p.id === action.payload.id)
      if (project) {
        const memberIds = Array.from(new Set([project.ownerId, ...action.payload.data.memberIds]))
        Object.assign(project, action.payload.data, { memberIds, updatedAt: new Date().toISOString() })
      }
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((project) => project.id !== action.payload)
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const project = state.projects.find((p) => p.id === action.payload)
      if (project) project.isFavorite = !project.isFavorite
    },
    toggleArchive(state, action: PayloadAction<string>) {
      const project = state.projects.find((p) => p.id === action.payload)
      if (project) {
        project.isArchived = !project.isArchived
        project.updatedAt = new Date().toISOString()
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeUser, (state, action) => {
      state.projects.forEach((project) => {
        project.memberIds = project.memberIds.filter((id) => id !== action.payload)
        if (project.ownerId === action.payload && project.memberIds[0]) project.ownerId = project.memberIds[0]
      })
    })
  },
})

export const { addProject, updateProject, removeProject, toggleFavorite, toggleArchive } = projectSlice.actions
export default projectSlice.reducer
