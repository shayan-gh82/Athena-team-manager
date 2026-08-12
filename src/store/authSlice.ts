import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  currentUserId: string | null
  rememberMe: boolean
}

const initialState: AuthState = { currentUserId: null, rememberMe: true }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<{ userId: string | null; rememberMe?: boolean }>) {
      state.currentUserId = action.payload.userId
      if (typeof action.payload.rememberMe === 'boolean') state.rememberMe = action.payload.rememberMe
    },
    logout(state) {
      state.currentUserId = null
      state.rememberMe = true
    },
  },
})

export const { setCurrentUser, logout } = authSlice.actions
export default authSlice.reducer
