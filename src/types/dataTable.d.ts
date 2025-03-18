import type { Role, Status } from './enums'

export type Headers = {
  label: string
  key: string
  sortable?: boolean
  searchable?: boolean
  width?: string
  class?: string | object | string[]
}

export type UsersFilters = {
  status?: Status
  role?: Role
  name?: string
  email?: string
}
