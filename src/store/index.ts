import { combineReducers, configureStore } from '@reduxjs/toolkit'
import auth from './authSlice'
import users from './usersSlice'
import project from './projectSlice'
import task from './taskSlice'
import board from './boardSlice'
import taskFilter from './taskFilterSlice'
import collaboration from './collaborationSlice'
import notifications from './notificationsSlice'
import automation from './automationSlice'
import ui from './uiSlice'
import taskTemplates from './taskTemplatesSlice'
import { loadPersistedState, savePersistedState } from '@/utils/storage'

const rootReducer = combineReducers({ auth, users, project, task, board, taskFilter, collaboration, notifications, automation, taskTemplates, ui })
export type RootState = ReturnType<typeof rootReducer>

const persisted = loadPersistedState<RootState>()
const preloadedState = persisted
  ? { ...persisted, ui: { ...persisted.ui, language: persisted.ui?.language ?? 'en' } }
  : undefined
export const store = configureStore({ reducer: rootReducer, preloadedState })

let saveTimer: number | undefined
store.subscribe(() => {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    const state = store.getState()
    savePersistedState({ ...state, auth: state.auth.rememberMe ? state.auth : { ...state.auth, currentUserId: null }, taskFilter: undefined })
  }, 120)
})

export type AppDispatch = typeof store.dispatch
