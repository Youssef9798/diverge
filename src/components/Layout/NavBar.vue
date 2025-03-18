<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { toast, type ToastContainerOptions } from 'vue3-toastify'

import { useAuthStore } from '@/stores/auth';

import DropdownMenu from '@/components/Shared/DropdownMenu.vue';
import MdiIcon from '@/components/Shared/MdiIcon.vue';


const { locale, t } = useI18n({ useScope: 'global' })
const router = useRouter()
const authStore = useAuthStore()

const options = [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: 'عربي',
    value: 'ar'
  }
];

const currentLocale = ref<string | undefined>(options.find(x => x.value === locale.value)?.value);

const userName = computed(() => {
  return authStore?.authenticatedUserData?.user?.name
})

const swtichLocale = (lang: string) => {
  locale.value = lang
  currentLocale.value = lang
}

const isDark = ref(localStorage.getItem("theme") === "dark");

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  }
});

const logout = async () => {
  authStore.logout()
  router.push('/login').then(() => {
    toast('User logged out successfully', {
      type: 'success'
    } as ToastContainerOptions)
  })
}
</script>

<template>
  <div
    class="flex w-full items-center sticky top-0 justify-end bg-gray-50 z-99 py-4 border-b border-gray-300 dark:border-gray-500 dark:bg-gray-700 gap-x-4">
    <button @click="toggleDarkMode"
      class="cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 w-8 h-8 flex items-center justify-center">
      <MdiIcon icon="brightness4" :class="isDark ? 'transition-all -scale-x-100' : 'transition-all scale-x-100'"
        :size="20" color="currentColor" />
    </button>
    <DropdownMenu close-on-click-content>
      <template #activator="{ toggle }">
        <button @click="toggle"
          class="relative z-10 block p-2 shrink-0 cursor-pointer transition-colors duration-300 transform text-gray-500 bg-transparent rounded-lg hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80 dark:text-gray-50 dark:hover:bg-gray-600">
          <MdiIcon icon="earth" :size="20" color="currentColor" />
        </button>
      </template>

      <a v-for="option in options" :key="option.value"
        class="flex items-center py-2 px-4 border-b last:border-b-0 border-gray-200 text-gray-500 hover:bg-gray-100 transition dark:border-gray-700 dark:bg-gray-600 dark:hover:bg-gray-800 dark:text-gray-50 cursor-pointer"
        @click="swtichLocale(option.value)"
        :class="{ '!bg-blue-50 font-medium rounded !text-blue-400 dark:!bg-blue-800 dark:!text-white': currentLocale === option.value }">{{
          option.label
        }}</a>
    </DropdownMenu>

    <DropdownMenu>
      <template #activator="{ toggle }">
        <div @click="toggle" class="flex items-center gap-x-2 text-gray-500 dark:text-gray-50">
          <p class="font-medium text-truncate capitalize max-w-40">{{ userName }}</p>
          <MdiIcon icon="chevronDown" :size="22" color="currentColor" class="mt-1" />
          <div class="w-10 h-10 overflow-hidden border-2 border-gray-400 rounded-full">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
              class="object-cover w-full h-full" alt="avatar" />
          </div>
        </div>
      </template>

      <a class="flex items-center py-2 px-4 gap-x-2 border-b last:border-b-0 border-gray-200 text-gray-500 hover:bg-gray-100 transition dark:border-gray-700 dark:bg-gray-600 dark:hover:bg-gray-800 dark:text-gray-50 cursor-pointer rounded"
        @click="logout">
        <MdiIcon icon="logout" :size="20" color="currentColor" />
        {{ t('buttons.logout') }}
      </a>
    </DropdownMenu>

  </div>
</template>