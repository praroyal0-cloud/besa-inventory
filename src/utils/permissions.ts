export type AppRole = 'Admin' | 'Manager' | 'Developer' | 'Viewer'

export type PermissionKey =
  | 'view_dashboard'
  | 'view_users'
  | 'manage_users'
  | 'view_roles'
  | 'manage_roles'
  | 'view_tasks'
  | 'manage_tasks'
  | 'view_settings'
  | 'manage_settings'

export const rolePermissions: Record<AppRole, PermissionKey[]> = {
  Admin: [
    'view_dashboard',
    'view_users',
    'manage_users',
    'view_roles',
    'manage_roles',
    'view_tasks',
    'manage_tasks',
    'view_settings',
    'manage_settings',
  ],
  Manager: [
    'view_dashboard',
    'view_users',
    'manage_users',
    'view_roles',
    'view_tasks',
    'manage_tasks',
    'view_settings',
    'manage_settings',
  ],
  Developer: [
    'view_dashboard',
    'view_tasks',
    'manage_tasks',
    'view_settings',
    'manage_settings',
  ],
  Viewer: ['view_dashboard'],
}

export const availableRoles: AppRole[] = ['Admin', 'Manager', 'Developer', 'Viewer']

export const getCurrentUserRole = (): AppRole => {
  if (typeof window === 'undefined') return 'Admin'
  const role = window.localStorage.getItem('currentUserRole') as AppRole | null
  return role && rolePermissions[role] ? role : 'Admin'
}

export const setCurrentUserRole = (role: AppRole) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('currentUserRole', role)
  }
}

export const hasPermission = (permission: PermissionKey, role: AppRole = getCurrentUserRole()) => {
  return rolePermissions[role]?.includes(permission) ?? false
}
