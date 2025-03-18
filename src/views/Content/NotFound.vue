<script setup lang="ts">
import MdiIcon from '@/components/Shared/MdiIcon.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <section class="bg-white dark:bg-gray-900 w-full">
    <div class="container flex items-center min-h-screen px-6 py-12 mx-auto">
      <div>
        <p class="text-sm font-medium text-blue-500 dark:text-blue-400">{{ t('pages.notFound.index') }}</p>
        <h1 class="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">{{ t('messages.cantFindPage')
        }}</h1>
        <p class="mt-4 text-gray-500 dark:text-gray-400">{{ t('messages.pageIsNotExist') }}</p>

        <div class="flex items-center mt-6 gap-x-3">
          <button
            class="flex items-center cursor-pointer justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
            <MdiIcon icon="arrowLeftThin" :size="20" color="currentColor" @click="router.back()" />

            <span>{{ t('buttons.goBack') }}</span>
          </button>

          <RouterLink to="/"
            class="w-1/2 px-5 py-2 text-sm tracking-wide cursor-pointer text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
            {{ t('buttons.takeMeHome') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>