<script lang="ts" setup>
import { computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';

import type { User } from '@/types/api';
import { Role, Status } from '@/types/enums';
import { useHasPermission } from '@/composables/helpers.composables';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const form = defineModel<Omit<User, 'id' | 'dateJoined'>>({
  default: {
    name: '',
    email: '',
    role: Role.VIEWER,
    password: '',
    status: Status.ACTIVE
  }
})

const props = defineProps<{
  canEdit?: boolean;
  profileMode?: boolean;
  userId?: number | null
}>()

const { t } = useI18n();

const rules = computed(() => {

  if (!useHasPermission('change_password') || props.profileMode) {
    return {
      name: { required },
      email: { required, email },
      role: { required }
    }
  } else {
    return {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      role: { required }
    }
  }
});

const isNotSameAuthenticatedUser = computed(() => {
  return authStore.authenticatedUserData?.user?.id !== props.userId
})

const v$ = useVuelidate(rules, form as unknown as { name: string, email: string, password: string, role: '' });

defineExpose({
  v$
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
    <div>
      <label class="text-gray-700 dark:text-gray-200" for="username">{{ t('inputs.userName') }}</label>
      <input id="username" v-model="form.name" :disabled="!canEdit" type="text" autocomplete="off"
        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
      <span v-if="v$.name.$error" class="text-red-500 text-sm">{{ t('errors.required') }}</span>
    </div>

    <div>
      <label class="text-gray-700 dark:text-gray-200" for="emailAddress">{{ t('inputs.email') }}</label>
      <input v-model="form.email" id="emailAddress" :disabled="!canEdit" type="email" autocomplete="off"
        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
      <span v-if="v$.email.$error" class="text-red-500 text-sm">
        {{ v$.email.required.$invalid ? t('errors.required') : t('errors.invalidEmail') }}
      </span>
    </div>

    <div v-if="useHasPermission('change_password')">
      <label class="text-gray-700 dark:text-gray-200" for="password">{{ t('inputs.password') }}</label>
      <input v-model="form.password" id="password" :disabled="!canEdit" type="password" autocomplete="new-password"
        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
      <span v-if="v$.password?.$error" class="text-red-500 text-sm">
        {{ v$.password?.required.$invalid ? t('errors.required') : t('errors.minLength', { length: 6 }) }}
      </span>
    </div>

    <div v-if="profileMode && isNotSameAuthenticatedUser">
      <label class="text-gray-700 dark:text-gray-200" for="status">{{ t('inputs.status') }}</label>
      <select id="status" v-model="form.status" :disabled="!canEdit"
        class="capitalize pb-3 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
        <option v-for="status in Status" :key="status" :value="status" class="capitalize">{{ status }}</option>
      </select>
    </div>

    <div v-if="useHasPermission('give_permissions') && isNotSameAuthenticatedUser">
      <label class="text-gray-700 dark:text-gray-200" for="role">{{ t('inputs.role') }}</label>
      <select id="role" v-model="form.role" :disabled="!canEdit"
        class="capitalize pb-3 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
        <option v-for="role in Role" :key="role" :value="role" class="capitalize">{{ role }}</option>
      </select>
      <span v-if="v$.role.$error" class="text-red-500 text-sm">
        {{ t('errors.required') }}
      </span>
    </div>
  </div>
</template>