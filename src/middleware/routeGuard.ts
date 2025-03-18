import { useAuthStore } from '@/stores/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function routeGuardMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()

  const isAuthenticated = authStore.authenticatedUserData?.isAuthenticated ?? false
  const userPermissions = authStore.authenticatedUserData?.permissions ?? []

  if (!isAuthenticated) {
    if (to.path === '/login') {
      return next()
    }
    return next('/login')
  }

  if (isAuthenticated) {
    authStore.resetSessionTimeout()
  }

  const requiredPermissions = (to.meta?.permissions as string[]) ?? []

  if (
    requiredPermissions.length === 0 ||
    requiredPermissions.some((permission) => userPermissions.includes(permission))
  ) {
    return next()
  }

  if (to.path !== '/401') {
    return next('/401')
  }

  return next()
}
