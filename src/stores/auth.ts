import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import type { User } from '@/types/api'
import { mockApi } from '@/api/mockApi'
import { toast } from 'vue3-toastify'

type AuthenticatedUserData = {
  user: Omit<User, 'password'>
  permissions: string[]
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isAuthenticated = ref<boolean>(false)
  const user = ref<Omit<User, 'password'> | null>(null)
  const permissions = ref<string[] | null>(null)
  const error = ref<string | null>(null)
  const sessionTimeout = ref<number>(15 * 60 * 1000)
  const timeoutId = ref<number | undefined>(undefined)

  const login = async (email: string, password: string) => {
    try {
      const {
        isSuccess,
        message,
        user: loggedInUser,
        permissions: userPermissions,
      } = await mockApi.login(email, password)

      if (isSuccess) {
        user.value = loggedInUser
        permissions.value = userPermissions
        isAuthenticated.value = true
        error.value = null
        localStorage.setItem(
          'auth',
          JSON.stringify({
            user: user.value,
            isAuthenticated: isAuthenticated.value,
            permissions: permissions.value,
          }),
        )

        resetSessionTimeout()
      } else {
        user.value = null
        permissions.value = null
        isAuthenticated.value = false
        error.value = message
      }
    } catch (err: unknown) {
      user.value = null
      permissions.value = []
      isAuthenticated.value = false
      error.value = (err as Error).message
    }
  }

  const logout = () => {
    user.value = null
    permissions.value = []
    isAuthenticated.value = false
    error.value = null
    clearTimeout(timeoutId.value)
    timeoutId.value = undefined
    localStorage.removeItem('auth')
  }

  const resetSessionTimeout = () => {
    clearTimeout(timeoutId.value)
    timeoutId.value = setTimeout(() => {
      logout()
      router.push('/login').then(() => {
        toast('Session expired! You have been logged out.', {
          type: 'error',
        })
      })
    }, sessionTimeout.value)
  }

  const authenticatedUserData = computed<AuthenticatedUserData>(() => {
    const authData = localStorage.getItem('auth')
    return authData ? JSON.parse(authData) : null
  })

  return { isAuthenticated, authenticatedUserData, error, login, logout, resetSessionTimeout }
})
