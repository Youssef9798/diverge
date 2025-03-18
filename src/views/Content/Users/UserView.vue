<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify'

import { mockApi } from '@/api/mockApi';
import { useHasPermission } from '@/composables/helpers.composables';

import type { User } from '@/types/api';
import { Role, Status } from '@/types/enums';

import UserForm from '@/components/Users/UserForm.vue';

const { t } = useI18n();
const router = useRouter()
const route = useRoute();

const form = ref<Omit<User, 'id' | 'dateJoined'>>({
  name: '',
  email: '',
  role: Role.VIEWER,
  password: '',
  status: Status.ACTIVE
})

const userFormRef = ref()
const loading = ref(false)

const canEdit = computed(() => {
  return useHasPermission('edit_users')
})

const userId = computed(() => {
  return route.params.id ? Number(route.params.id) : null
})

const getUser = async () => {
  loading.value = true

  if (userId.value) {
    const { isSuccess, message, user } = await mockApi.getUser(userId.value)
    if (isSuccess && user) {
      form.value.email = user.email
      form.value.name = user.name
      form.value.status = user.status
      form.value.role = user.role
    } else {
      router.push('/users').then(() => {
        toast(message || 'User is not exist', {
          type: 'error'
        })
      })
    }
  }

  loading.value = false
}

const updateUser = async () => {
  const isValid = await userFormRef.value?.v$.$validate()

  if (isValid && userId.value) {
    const { isSuccess, message } = await mockApi.updateUser(userId.value, form.value)
    if (isSuccess) {
      router.push('/users').then(() => {
        toast(`User Updated Successfully`, {
          type: 'success'
        })
      })
    } else {
      toast(message || 'Something went wrong while updating the user', {
        type: 'error'
      })
    }
  }
}

onMounted(async () => {
  await getUser()
})
</script>

<template>
  <section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-8">
    <I18nT tag="h2" class="text-lg font-semibold text-gray-700 capitalize dark:text-white" keypath="pages.users.show">
      <span class="text-blue-500">
        {{ form.name }}
      </span>
    </I18nT>
    <div v-if="loading" class="w-full h-full flex">
      <div class="w-full max-w-md mx-auto animate-pulse p-9">
        <h1 class="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600"></h1>

        <p class="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
        <p class="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
        <p class="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
        <p class="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
      </div>
    </div>
    <UserForm v-else v-model="form" ref="userFormRef" :can-edit="canEdit" profile-mode :user-id="userId" />

    <div class="flex justify-end mt-6 gap-4">
      <RouterLink to="/users"
        class="px-6 py-2 font-medium tracking-wide cursor-pointer text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300 transform bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
        {{
          t('buttons.cancel') }}</RouterLink>
      <button v-if="useHasPermission('edit_users')" @click="updateUser"
        class="px-8 py-2.5 leading-5 cursor-pointer text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">{{
          t('buttons.save') }}</button>
    </div>
  </section>
</template>