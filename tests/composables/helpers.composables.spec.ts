import { ref } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  useDebounce,
  useFormatDate,
  useHasPermission,
  useFiltersToQueryParams,
} from '../../src/composables/helpers.composables'
import { setActivePinia, createPinia } from 'pinia'
import moment from 'moment'

// Mock useAuthStore
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    authenticatedUserData: {
      permissions: ['read', 'write', 'delete'],
    },
  })),
}))

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const value = ref('initial')
    const debouncedValue = useDebounce(value, 300)

    expect(debouncedValue.value).toBe('initial')
    value.value = 'updated'
    await new Promise((resolve) => setTimeout(resolve, 350))
    expect(debouncedValue.value).toBe('updated')
  })
})

describe('useFormatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-03-18')
    const format = 'YYYY-MM-DD'
    expect(useFormatDate(date, format)).toBe(moment(date).format(format))
  })
})

describe('useHasPermission', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return true if user has the required permission (string)', () => {
    expect(useHasPermission('read')).toBe(true)
  })

  it('should return false if user lacks the required permission (string)', () => {
    expect(useHasPermission('admin')).toBe(false)
  })

  it('should return true if user has at least one of the required permissions (array)', () => {
    expect(useHasPermission(['admin', 'write'])).toBe(true)
  })

  it('should return false if user lacks all required permissions (array)', () => {
    expect(useHasPermission(['admin', 'superuser'])).toBe(false)
  })
})

describe('useFiltersToQueryParams', () => {
  it('should convert filters object to query string', () => {
    const filters = { search: 'test', category: 'books' }
    expect(useFiltersToQueryParams(filters)).toBe('search=test&category=books')
  })

  it('should ignore empty filter values', () => {
    const filters = { search: 'test', category: '' }
    expect(useFiltersToQueryParams(filters)).toBe('search=test')
  })
})
