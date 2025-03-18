<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { toast, type ToastContainerOptions } from 'vue3-toastify'

import { useAuthStore } from '@/stores/auth';

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const form = ref<{ email: string, password: string }>({
  email: '',
  password: ''
})

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(6) }
};

const v$ = useVuelidate(rules, form);

const login = async () => {
  const isValid = await v$.value.$validate()
  if (isValid) {
    const { email, password } = form.value
    await authStore.login(email, password)
    if (authStore.isAuthenticated && !authStore.error) {
      router.push('/').then(() => {
        toast('User logged in successfully', {
          type: 'success'
        } as ToastContainerOptions)
      })
    } else {
      toast(authStore.error || 'Something went wrong, User cannot be logged in', {
        type: 'error',
      } as ToastContainerOptions)
    }
  }
}
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div class="px-6 py-4">
        <div class="flex justify-center mx-auto text-2xl font-semibold">
          Diverge
        </div>

        <h3 class="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
          {{ t('messages.welcomeBack') }}
        </h3>

        <p class="mt-1 text-center text-gray-500 dark:text-gray-400">{{ t('pages.login.index') }}</p>

        <div class="w-full mt-4">
          <input v-model="form.email"
            class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
            type="email" :placeholder="t('inputs.email')" aria-label="Email Address" />
          <span v-if="v$.email.$error" class="text-red-500 text-sm">
            {{ v$.email.required.$invalid ? t('errors.required') : t('errors.invalidEmail') }}
          </span>
        </div>

        <div class="w-full mt-4">
          <input v-model="form.password"
            class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
            type="password" placeholder="*********" aria-label="Password" />
          <span v-if="v$.password.$error" class="text-red-500 text-sm">
            {{ v$.password.required.$invalid ? t('errors.required') : t('errors.minLength', { length: 6 }) }}
          </span>
        </div>

        <div class="flex items-center justify-center mt-4">
          <button @click="login"
            class="px-6 py-2 text-sm font-medium tracking-wide cursor-pointer text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
            {{ t('buttons.signIn') }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
        <span class="text-sm text-gray-600 dark:text-gray-200">{{ t('messages.dontHaveAnAccount') }}</span>

        <a class="mx-2 text-sm font-bold text-gray-500 dark:text-gray-400 pointer-events-none">{{ t('buttons.register')
        }} <span class="text-blue-400">({{ t('keywords.soon') }}!)</span></a>
      </div>
    </div>
  </div>
</template>