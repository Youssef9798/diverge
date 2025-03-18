import { Role, Status } from '@/types/enums'
import type { GetUsersParams, User, RolePermissions } from '@/types/api'

import { Users } from '../data/users'

const MOCK_LATENCY_RANGE = [300, 800]

const generateLatency = () =>
  new Promise((resolve) =>
    setTimeout(
      resolve,
      Math.random() * (MOCK_LATENCY_RANGE[1] - MOCK_LATENCY_RANGE[0]) + MOCK_LATENCY_RANGE[0],
    ),
  )

const mockUsers: User[] = Users

const roles: Role[] = [Role.ADMIN, Role.MANAGER, Role.VIEWER]

const rolePermissions: RolePermissions = {
  [Role.ADMIN]: [
    'view_dashboard',
    'view_users',
    'add_users',
    'view_user',
    'change_password',
    'edit_users',
    'delete_users',
    'give_permissions',
  ],
  [Role.MANAGER]: ['view_dashboard', 'view_users', 'view_user'],
  [Role.VIEWER]: ['view_dashboard'],
}

export const mockApi = {
  simulatedError: false,

  async login(
    email: string,
    password: string,
  ): Promise<{
    isSuccess: boolean
    message: string
    user: Omit<User, 'password'>
    permissions: string[]
  }> {
    await generateLatency()

    if (this.simulatedError) {
      this.simulatedError = false
      throw {
        isSuccess: false,
        message: 'Something went wrong',
        user: null,
        permissions: null,
      }
    }

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) throw { isSuccess: false, message: 'User Not Found', user: null, permissions: null }

    if (user.status === Status.INACTIVE)
      throw { isSuccess: false, message: 'User is not active', user: null, permissions: null }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return {
      isSuccess: true,
      message: 'User logged successfully',
      user: { ...userWithoutPassword },
      permissions: rolePermissions[user.role],
    }
  },

  async getUsers({
    page = 1,
    limit = 20,
    filter,
    sortBy = 'name',
    sortOrder = 'asc',
  }: GetUsersParams = {}): Promise<{
    isSuccess: boolean
    message: string
    users: Omit<User, 'password'>[] | null
    total: number
  }> {
    await generateLatency()

    if (this.simulatedError) {
      this.simulatedError = false
      throw {
        isSuccess: false,
        message: 'Users is not fetched, something went wrong',
        users: null,
        total: 0,
      }
    }

    let users = [...mockUsers]

    if (filter) {
      const filterParams = new URLSearchParams(filter)

      users = users.filter((user: User) =>
        Array.from(filterParams.entries()).every(([key, value]) => {
          const userValue = user[key as keyof User]
          if (typeof userValue === 'string') {
            return userValue.toLowerCase().includes(value.toLowerCase())
          } else {
            return userValue === (value as unknown)
          }
        }),
      )
    }

    users.sort((a, b) => {
      const valueA = a?.[sortBy] ?? ''
      const valueB = b?.[sortBy] ?? ''

      return (sortOrder === 'asc' ? valueA > valueB : valueA < valueB) ? 1 : -1
    })

    const start = (page - 1) * limit
    const end = start + limit

    return { isSuccess: true, message: '', users: users.slice(start, end), total: users.length }
  },

  async getUser(
    id: number,
  ): Promise<{ isSuccess: boolean; message: string; user: Omit<User, 'password'> | null }> {
    await generateLatency()

    if (this.simulatedError) {
      this.simulatedError = false
      throw { isSuccess: false, message: 'User is not fetched, something went wrong', user: null }
    }

    const user = mockUsers.find((u) => u.id === Number(id))

    if (!user) throw { isSuccess: false, message: 'User Not Found', user: null }

    return { isSuccess: true, message: '', user }
  },

  async createUser(
    user: Omit<User, 'id' | 'dateJoined' | 'status'>,
  ): Promise<{ isSuccess: boolean; message: string; newUser: Omit<User, 'password'> | null }> {
    await generateLatency()

    if (this.simulatedError) {
      this.simulatedError = false
      throw {
        isSuccess: false,
        message: 'User is not created, something went wrong',
        newUser: null,
      }
    }

    const newUser = {
      id: mockUsers[mockUsers.length - 1].id + 1,
      dateJoined: new Date().toISOString(),
      status: Status.PENDING,
      ...user,
    }

    mockUsers.push(newUser)

    return { isSuccess: true, message: 'User Created Successfully', newUser }
  },

  async updateUser(
    id: number,
    data: Omit<User, 'id' | 'dateJoined' | 'password'>,
  ): Promise<{ isSuccess: boolean; message: string; user: Omit<User, 'password'> | null }> {
    await generateLatency()

    if (this.simulatedError) {
      this.simulatedError = false
      throw { isSuccess: false, message: 'User is not updated, something went wrong', user: null }
    }

    const userIndex = mockUsers.findIndex((u) => u.id === Number(id))

    if (userIndex === -1) throw { isSuccess: false, message: 'User Not Found', user: null }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data }

    return { isSuccess: true, message: 'User Updated Successfully', user: mockUsers[userIndex] }
  },

  async deleteUser(id: number): Promise<{ isSuccess: boolean; message: string }> {
    await generateLatency()

    if (this.simulatedError) {
      this.simulatedError = false
      throw { isSuccess: false, message: 'User is not updated, something went wrong', user: null }
    }

    const userIndex = mockUsers.findIndex((u) => u.id === Number(id))

    if (userIndex === -1) throw { isSuccess: false, message: 'User Not Found' }

    mockUsers.splice(userIndex, 1)

    return { isSuccess: true, message: 'User Deleted Successfully' }
  },

  async getRoles() {
    await generateLatency()
    return roles
  },
}
