export const STORAGE_KEY = 'aurora-team-manager:v3'
const LEGACY_KEYS = ['aurora-team-manager:v1', 'aurora-team-manager:v2']

export function loadPersistedState<T>(): T | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

export function savePersistedState(state: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Could not persist application state', error)
  }
}


export function replacePersistedState(state: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearPersistedState() {
  localStorage.removeItem(STORAGE_KEY)
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key))
}

export function isCompatibleBackup(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false
  const state = value as Record<string, unknown>
  const users = state.users as { users?: unknown } | undefined
  const project = state.project as { projects?: unknown } | undefined
  const task = state.task as { tasks?: unknown } | undefined
  const board = state.board as { columns?: unknown } | undefined
  const collaboration = state.collaboration as Record<string, unknown> | undefined
  const taskTemplates = state.taskTemplates as { templates?: unknown } | undefined

  return Boolean(
    users && Array.isArray(users.users)
    && project && Array.isArray(project.projects)
    && task && Array.isArray(task.tasks)
    && board && Array.isArray(board.columns)
    && collaboration
    && Array.isArray(collaboration.comments)
    && Array.isArray(collaboration.checklistItems)
    && Array.isArray(collaboration.subtasks)
    && Array.isArray(collaboration.customFields)
    && Array.isArray(collaboration.customFieldValues)
    && taskTemplates && Array.isArray(taskTemplates.templates)
    && state.auth && state.notifications && state.automation && state.ui
  )
}
