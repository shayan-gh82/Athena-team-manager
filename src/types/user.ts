export type UserRole = 'manager' | 'member'

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
