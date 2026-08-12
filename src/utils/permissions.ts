import type { Project, User } from '@/types'

export function canAccessProject(user: User | undefined, project: Project | undefined): boolean {
  if (!user || !project) return false
  return user.role === 'manager' || project.memberIds.includes(user.id)
}
