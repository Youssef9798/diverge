import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserForm from '../../../src/components/Users/UserForm.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '../../../src/stores/auth'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key }),
}))

vi.mock('@vuelidate/core', () => ({
  useVuelidate: () => ({
    name: { $error: false, required: { $invalid: false } },
    email: { $error: false, required: { $invalid: false }, email: { $invalid: false } },
    password: { $error: false, required: { $invalid: false }, minLength: { $invalid: false } },
    role: { $error: false, required: { $invalid: false } },
  }),
}))

describe('UserForm.vue', () => {
  let authStore

  beforeEach(async () => {
    createTestingPinia({ createSpy: vi.fn })
    authStore = useAuthStore()

    await authStore.login('emily.johnson@example.com', '123456')
  })

  it('renders form fields correctly', () => {
    const wrapper = mount(UserForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
      props: {
        canEdit: true,
        profileMode: true,
        userId: 1,
      },
    })

    expect(wrapper.find('input#username').exists()).toBe(true)
    expect(wrapper.find('input#emailAddress').exists()).toBe(true)
    expect(wrapper.find('select#role').exists()).toBe(true)
  })

  it('validates required fields', async () => {
    const wrapper = mount(UserForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
      props: { canEdit: true },
    })

    await wrapper.find('input#username').setValue('')
    await wrapper.find('input#emailAddress').setValue('invalid-email')
    await wrapper.find('select#role').setValue('')
    await wrapper.vm.v$.$validate()

    expect(wrapper.vm.v$.name.$error).toBe(true)
    expect(wrapper.vm.v$.email.$error).toBe(true)
    expect(wrapper.vm.v$.role.$error).toBe(true)
  })

  it('disables fields when canEdit is false', () => {
    const wrapper = mount(UserForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
      props: { canEdit: false },
    })

    expect(wrapper.find('input#username').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input#emailAddress').attributes('disabled')).toBeDefined()
    expect(wrapper.find('select#role').attributes('disabled')).toBeDefined()
  })

  it('renders password field based on permission', () => {
    vi.mock('@/composables/helpers.composables', () => ({
      useHasPermission: (perm) => perm === 'change_password',
    }))

    const wrapper = mount(UserForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
      props: { canEdit: true },
    })

    expect(wrapper.find('input#password').exists()).toBe(true)
  })

  it('hides password field when permission is missing', () => {
    vi.mock('@/composables/helpers.composables', () => ({
      useHasPermission: () => false,
    }))

    const wrapper = mount(UserForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
      props: { canEdit: true },
    })

    expect(wrapper.find('input#password').exists()).toBe(false)
  })
})
