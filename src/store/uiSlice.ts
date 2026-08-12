import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'en' | 'fa'

type UiState = {
  theme: ThemeMode
  language: Language
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  taskDrawerId: string | null
}

const initialState: UiState = {
  theme: 'system',
  language: 'en',
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  taskDrawerId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => { state.theme = action.payload },
    setLanguage: (state, action: PayloadAction<Language>) => { state.language = action.payload },
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => { state.commandPaletteOpen = action.payload },
    openTaskDrawer: (state, action: PayloadAction<string>) => { state.taskDrawerId = action.payload },
    closeTaskDrawer: (state) => { state.taskDrawerId = null },
  },
})

export const { setTheme, setLanguage, toggleSidebar, setCommandPaletteOpen, openTaskDrawer, closeTaskDrawer } = uiSlice.actions
export default uiSlice.reducer
