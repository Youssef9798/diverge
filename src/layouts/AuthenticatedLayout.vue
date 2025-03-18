<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n';

import SideBar from '@/components/Layout/SideBar.vue';
import NavBar from '@/components/Layout/NavBar.vue';

const { locale } = useI18n({ useScope: 'global' });

const currentLocaleDir = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})
</script>

<template>
  <div :dir="currentLocaleDir" class="h-screen w-screen flex">
    <SideBar />
    <div class="flex-1 bg-gray-50 dark:bg-gray-700">
      <div class="flex flex-col h-full overflow-y-auto px-8">
        <div class="container mx-auto">
          <NavBar />
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
