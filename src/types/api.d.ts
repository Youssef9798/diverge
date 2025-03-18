import { Role, Status } from './enums'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  status: Status
  dateJoined: string
  password?: string
}

export type GetUsersParams = {
  page?: number
  limit?: number
  filter?: string
  sortBy?: keyof User
  sortOrder?: 'asc' | 'desc'
}

export type RolePermissions = {
  [Role.ADMIN]: [
    'view_dashboard',
    'view_users',
    'add_users',
    'view_user',
    'change_password',
    'edit_users',
    'delete_users',
    'give_permissions',
  ]
  [Role.MANAGER]: ['view_dashboard', 'view_users', 'view_user']
  [Role.VIEWER]: ['view_dashboard']
}
