<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onKeyStroke } from '@vueuse/core'

import MdiIcon from '../MdiIcon.vue';

const { t } = useI18n();

const query = defineModel();

defineProps<{
  disabled?: boolean;
}>();

const searchInput = ref();

onKeyStroke(["k"], (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    searchInput.value.focus();
  }
});
</script>

<template>
  <div class="relative flex items-center mt-4 md:mt-0">
    <span class="absolute start-2">
      <MdiIcon icon="magnify" :size="20" color="text-gray-400" />
    </span>

    <input ref="searchInput" v-model="query" type="text" :placeholder="t('inputs.searchPlaceholder')"
      :disabled="disabled"
      class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40">
  </div>
</template>