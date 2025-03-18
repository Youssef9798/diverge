<script setup lang="ts">
import MdiIcon from '../MdiIcon.vue';
import { useI18n } from 'vue-i18n'
import { computed } from 'vue';

const { t } = useI18n();

const currentPage = defineModel({ default: 1 });

const props = defineProps<{
  perPage?: number;
  totalRecords?: number;
}>();


const emit = defineEmits<{
  (e: 'previous', page: number): void
  (e: 'next', page: number): void
  (e: 'current-page', page: number): void
}>()

const perPage = computed(() => props.perPage || 10);
const totalPages = computed(() => Math.ceil((props.totalRecords || 0) / perPage.value));

const pages = computed(() => {
  if (totalPages.value <= 1) return [];
  if (totalPages.value <= 5) return Array.from({ length: totalPages.value }, (_, i) => i + 1);

  const pagesArr = [1, 2, 3, '...', totalPages.value - 2, totalPages.value - 1, totalPages.value];
  return pagesArr;
});

const showPagination = computed(() => totalPages.value > 1);

const goToPrevious = () => {
  const page = currentPage.value - 1;
  emit('previous', page);
}

const goToNext = () => {
  const page = currentPage.value + 1;
  emit('next', page)
}

const goToPage = (page: number) => {
  currentPage.value = page
  emit('current-page', page)
}
</script>

<template>
  <div v-if="showPagination" class="flex items-center justify-between">
    <a v-if="currentPage > 1" @click="goToPrevious"
      class="flex items-center cursor-pointer px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
      <MdiIcon icon="arrowLeftThin" :size="20" color="currentColor" />
      <span>{{ t('buttons.previous') }}</span>
    </a>
    <span v-else class="px-5 py-2 text-sm text-gray-400 dark:text-gray-500">{{ t('buttons.previous') }}</span>

    <div class="items-center hidden md:flex gap-x-3">
      <template v-for="(page, index) in pages" :key="index">
        <a v-if="typeof page === 'number'" @click="goToPage(page)"
          :class="['px-2 py-1 text-sm rounded-md', page === currentPage ? 'text-blue-500 bg-blue-100/60 dark:bg-gray-800 pointer-events-none' : 'text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 cursor-pointer']">
          {{ page }}
        </a>
        <span v-else class="px-2 py-1 text-sm text-gray-500">{{ page }}</span>
      </template>
    </div>

    <a v-if="currentPage < totalPages" @click="goToNext"
      class="flex items-center cursor-pointer px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
      <span>{{ t('buttons.next') }}</span>
      <MdiIcon icon="arrowRightThin" :size="20" color="currentColor" />
    </a>
    <span v-else class="px-5 py-2 text-sm text-gray-400 dark:text-gray-500">{{ t('buttons.next') }}</span>
  </div>
</template>