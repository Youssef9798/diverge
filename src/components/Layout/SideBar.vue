<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth';

import MdiIcon from '../Shared/MdiIcon.vue';
import links from '@/data/sidebarLinks';

const { t } = useI18n()
const authStore = useAuthStore()
const allowedLinks = computed(() => {
  return links.filter(el => el.permissions.some(permission => authStore.authenticatedUserData.permissions.includes(permission))).map(el => {
    const children = el.children.filter(child => child.permissions.every(permission => authStore.authenticatedUserData.permissions.includes(permission)))
    return {
      ...el,
      children
    }
  })
})
</script>

<template>
  <aside
    class="flex flex-col w-64 h-screen flex-shrink-0 px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
    <RouterLink class="font-semibold text-2xl" to="/">
      Diverge
    </RouterLink>

    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav class="-mx-3 space-y-6 ">
        <div class="space-y-3" v-for="link in allowedLinks" :key="link.category">
          <label class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">
            {{ link.category ? t(link.category) : '' }}
          </label>
          <RouterLink v-for="child in link.children" :key="child.name" :to="child.path"
            class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
            <MdiIcon :icon="child.icon" :size="20" color="text-gray-400" />

            <span class="mx-2 text-sm font-medium">{{ child.name ? t(child.name) : '' }}</span>
          </RouterLink>
        </div>
      </nav>
    </div>
  </aside>
</template>