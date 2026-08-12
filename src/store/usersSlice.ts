import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockUsers } from '@/data/mock'
import type { User, UserRole } from '@/types'
import { createId } from '@/utils/id'

type UsersState = { users: User[] }
const initialState: UsersState = { users: mockUsers }

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: {
      reducer(state, action: PayloadAction<User>) {
        state.users.push(action.payload)
      },
      prepare(payload: { name: string; email: string; passwordHash: string; role: UserRole }) {
        const now = new Date().toISOString()
        return {
          payload: {
            id: createId(),
            name: payload.name.trim(),
            email: payload.email.trim().toLowerCase(),
            passwordHash: payload.passwordHash,
            role: payload.role,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          } satisfies User,
        }
      },
    },
    updateUser(state, action: PayloadAction<{ id: string; changes: Partial<Pick<User, 'name' | 'role' | 'avatar' | 'isActive'>> }>) {
      const user = state.users.find((u) => u.id === action.payload.id)
      if (user) Object.assign(user, action.payload.changes, { updatedAt: new Date().toISOString() })
    },
    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
  },
})

export const { addUser, updateUser, removeUser } = usersSlice.actions
export default usersSlice.reducer
