import moment from 'moment'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const debouncedValue = ref<T>(value.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(
    value,
    (newValue) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
    { immediate: true },
  )

  return debouncedValue
}

export function useFormatDate(date: string | Date, format: string) {
  return moment(date).format(format)
}

export function useHasPermission(permissions: string[] | string): boolean {
  const authenticatedUserData = useAuthStore().authenticatedUserData
  const userPermissions = authenticatedUserData.permissions

  if (typeof permissions === 'string') {
    return !!userPermissions.includes(permissions)
  }

  return permissions.some((permission) => userPermissions.includes(permission))
}

export function useFiltersToQueryParams(filters: Record<string, string>) {
  return (
    Object.entries(filters)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
  )
}
