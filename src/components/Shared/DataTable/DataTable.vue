<script setup lang="ts" generic="T">
import { useI18n } from 'vue-i18n'

import type { Headers } from '@/types/dataTable'

import { getRecordProperty } from '@/composables/dataTable.composables'

import TablePagination from './TablePagination.vue';
import TableSearch from './TableSearch.vue';
import TableFilters from './TableFilters.vue';
import MdiIcon from '../MdiIcon.vue';

const { t } = useI18n();

const currentPage = defineModel('current-page', { default: 1 });
const search = defineModel('search', { default: '' });

defineProps<{
  label: string;
  options: {
    totalRecords?: number;
    perPage?: number;
    sortOrder?: 'asc' | 'desc'
  }
  headers: Headers[];
  records: Record<string, unknown>[];
  loading?: boolean;
  emptyStateText?: string;
}>();

const emit = defineEmits<{
  (e: 'sort-by', column: string): void
  (e: 'pagination-previous', page: number): void
  (e: 'pagination-next', page: number): void
  (e: 'pagination-page', page: number): void
}>()

const columnSort = (column: string) => {
  emit('sort-by', column)
}

const goToPrevious = (page: number) => {
  emit('pagination-previous', page);
}

const goToNext = (page: number) => {
  emit('pagination-previous', page)
}

const goToPage = (page: number) => {
  emit('pagination-page', page)
}
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="font-semibold text-4xl">{{ label }}</h1>
    <div class="flex items-center mt-4 gap-x-3 justify-end">
      <slot name="actions"></slot>

      <TableSearch v-model="search" />

      <TableFilters>
        <slot name="filters"></slot>
      </TableFilters>
    </div>
  </div>
  <div class="flex flex-col">
    <div class="flex flex-col mt-6 mb-6">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th v-for="(header, index) in headers" :key="`${header.label}-${index}`" scope="col"
                    class="py-3.5 px-4 text-sm font-normal text-start text-gray-500 dark:text-gray-400"
                    :class="header.class" :data-sortable="!!header.sortable" :data-searchable="!!header.searchable"
                    :style="{ width: header.width || 'auto' }">
                    <slot :name="`header.${header.key}`" :header="header">
                      <div class="flex items-center gap-x-3" :class="{ 'cursor-pointer': header.sortable }"
                        @click="columnSort(header.key)">
                        <span>{{ header.label }}</span>
                        <MdiIcon v-if="header.sortable" icon="sort" :size="20" color="text-gray-500" />
                      </div>
                    </slot>
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                <template v-if="records?.length > 0 && !loading">
                  <tr v-for="(record, index) in records" :key="`item-tr-${index}`"
                    class="border-b last:border-b-0 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <td v-for="header in headers" :key="`item-td-${header.key}`"
                      class="px-4 py-4 text-sm font-medium whitespace-nowrap" :class="header.class">
                      <slot :name="`record.${header.key}`" :item="record">
                        <div>
                          <h2 class="font-medium text-gray-800 dark:text-white ">
                            {{ getRecordProperty(record, header.key) }}
                          </h2>
                        </div>
                      </slot>
                    </td>
                  </tr>
                </template>
                <template v-else-if="records?.length === 0 && !loading">
                  <tr>
                    <td :colspan="headers.length" class="px-4 py-4 text-sm font-medium whitespace-nowrap text-center">
                      <slot name="empty-state">
                        {{ emptyStateText || t('messages.noDataAvailable') }}
                      </slot>
                    </td>
                  </tr>
                </template>
                <template v-if="loading">
                  <tr v-for="n in options.perPage" :key="`skeleton-${n}`"
                    class="py-6 px-4 border-b last:border-b-0 border-gray-200">
                    <td v-for="header in headers" :key="`loading-td-${header.key}`" :class="header.class">
                      <div class="animate-pulse py-4 px-4">
                        <p class="w-24 h-3 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <TablePagination v-if="!loading" v-model="currentPage" :current-page="currentPage"
      :total-records="options.totalRecords" :per-page="options.perPage" @previous="goToPrevious" @next="goToNext"
      @current-page="goToPage"
      class="sticky bottom-0 bg-gray-50 py-4 border-t border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
  </div>
</template>

<style scoped>
:deep(.datatable-bottom) {
  display: none;
}

:deep(td.datatable-empty) {
  padding-inline: 1rem;
  padding-block: 1rem;
  font-size: 0.875rem;
  line-height: 1.4286;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
}
</style>