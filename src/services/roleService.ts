import { BaseService } from './baseService'

export type Role = {
  id: number
  name: string
  description: string
  users: number
  createdAt: string
}

const roleSeed: Role[] = [
  { id: 1, name: 'Admin', description: 'Full system access', users: 21, createdAt: '2026-01-01' },
  { id: 2, name: 'Manager', description: 'Manage team and tasks', users: 12, createdAt: '2026-01-05' },
  { id: 3, name: 'User', description: 'Standard user access', users: 56, createdAt: '2026-01-10' },
  { id: 4, name: 'Auditor', description: 'Read only access', users: 15, createdAt: '2026-01-15' },
]

export const roleService = new BaseService<Role>('roles', roleSeed)
