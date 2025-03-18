import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../src/stores/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockApi } from '../../src/api/mockApi'

vi.mock('@/api/mockApi', () => ({
  mockApi: {
    login: vi.fn(),
  },
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default values', () => {
    const authStore = useAuthStore()
    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.authenticatedUserData).toBe(null)
    expect(authStore.error).toBe(null)
  })

  it('logs in successfully', async () => {
    const authStore = useAuthStore()
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' }
    const permissions = ['read', 'write']

    mockApi.login.mockResolvedValue({
      isSuccess: true,
      message: 'Login successful',
      user: userData,
      permissions,
    })

    await authStore.login('john@example.com', 'password')

    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.authenticatedUserData.user).toEqual(userData)
    expect(authStore.authenticatedUserData.permissions).toEqual(permissions)
    expect(authStore.error).toBe(null)
  })

  it('fails to log in with incorrect credentials', async () => {
    const authStore = useAuthStore()
    mockApi.login.mockResolvedValue({
      isSuccess: false,
      message: 'Invalid credentials',
      user: null,
      permissions: [],
    })

    await authStore.login('wrong@example.com', 'wrongpassword')

    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.authenticatedUserData).toBe(null)
    expect(authStore.error).toBe('Invalid credentials')
  })

  it('logs out successfully', async () => {
    const authStore = useAuthStore()
    const userData = { id: 1, name: 'John Doe', email: 'john@example.com' }
    const permissions = ['read', 'write']

    mockApi.login.mockResolvedValue({
      isSuccess: true,
      message: 'Login successful',
      user: userData,
      permissions,
    })

    await authStore.login('john@example.com', 'password')

    authStore.logout()

    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.authenticatedUserData).toBe(null)
  })
})
