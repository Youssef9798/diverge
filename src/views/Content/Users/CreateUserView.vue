<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify'

import { mockApi } from '@/api/mockApi';

import type { User } from '@/types/api';
import { Role, Status } from '@/types/enums';
import UserForm from '@/components/Users/UserForm.vue';

const { t } = useI18n();
const router = useRouter()

const form = ref<Omit<User, 'id' | 'dateJoined'>>({
  name: '',
  email: '',
  role: Role.VIEWER,
  password: '',
  status: Status.PENDING
})

const userFormRef = ref()

const createUser = async () => {
  const isValid = await userFormRef.value?.v$.$validate()
  if (isValid) {
    const { isSuccess, message, newUser } = await mockApi.createUser(form.value)
    if (isSuccess) {
      router.push('/users').then(() => {
        toast(`User ${newUser?.name} Created Successfully`, {
          type: 'success'
        })
      })
    } else {
      toast(message, {
        type: 'error'
      })
    }
  }
}
</script>

<template>
  <section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-8">
    <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">{{ t('pages.users.create') }}</h2>
    <UserForm v-model="form" ref="userFormRef" can-edit />

    <div class="flex justify-end mt-6 gap-4">
      <RouterLink to="/users"
        class="px-6 py-2 font-medium tracking-wide cursor-pointer text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300 transform bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
        {{
          t('buttons.cancel') }}</RouterLink>
      <button @click="createUser"
        class="px-8 py-2.5 leading-5 cursor-pointer text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">{{
          t('buttons.save') }}</button>
    </div>
  </section>
</template>