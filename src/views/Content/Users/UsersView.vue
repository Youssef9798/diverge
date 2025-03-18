<script setup lang="ts">
import { ref, watch, onBeforeMount, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify'

import { mockApi } from '@/api/mockApi';

import type { Headers, UsersFilters } from '@/types/dataTable';
import type { GetUsersParams, User } from '@/types/api';

import { useDebounce, useFormatDate, useHasPermission, useFiltersToQueryParams } from '@/composables/helpers.composables'
import { useAuthStore } from '@/stores/auth';

import DataTable from '@/components/Shared/DataTable/DataTable.vue';
import MdiIcon from '@/components/Shared/MdiIcon.vue';
import DropdownMenu from '@/components/Shared/DropdownMenu.vue';
import ModalPopup from '@/components/Shared/ModalPopup.vue';
import { Role, Status } from '@/types/enums';

const { t } = useI18n();
const authStore = useAuthStore()
const router = useRouter()

const headers = computed<Headers[]>(() => [
  {
    key: 'name',
    label: t('pages.users.table.name'),
    sortable: true,
    searchable: true
  },
  {
    key: 'email',
    label: t('pages.users.table.email'),
    sortable: false,
    searchable: true
  },
  {
    key: 'dateJoined',
    label: t('pages.users.table.dateJoined'),
    sortable: true,
    searchable: false
  },
  {
    key: 'role',
    label: t('pages.users.table.role'),
    sortable: true,
    searchable: false
  },
  {
    key: 'status',
    label: t('pages.users.table.status'),
    sortable: true,
    searchable: false
  },
  {
    key: 'actions',
    label: t('pages.users.table.actions'),
    sortable: false,
    searchable: false,
    class: '!text-end flex items-center justify-center'
  }
])

const users = ref<Omit<User, 'password'>[]>([])
const search = ref<string>('');
const filters = ref<UsersFilters>({
  status: undefined,
  role: undefined,
  email: undefined,
  name: undefined
})
const loading = ref<boolean>(false)
const totalRecords = ref(20);

const pageOptions = ref<GetUsersParams>({
  page: 1,
  limit: 15,
  sortBy: 'name',
  sortOrder: 'asc'
})

const statusTag = computed(() => {
  return function (status: string) {
    switch (status) {
      case 'active':
        return 'bg-green-100/60 text-green-500 dark:bg-green-500 dark:text-green-50'
      case 'inactive':
        return 'bg-red-100/60 text-red-500 dark:bg-red-500 dark:text-red-50'
      case 'pending':
        return 'bg-yellow-100/60 text-yellow-500 dark:bg-yellow-500 dark:text-yellow-50'
      default:
        break;
    }
  }
})

watch(useDebounce(search), () => {
  if (search.value) {
    filters.value.name = search.value
    filters.value.email = search.value

  } else {
    filters.value.name = ''
    filters.value.email = ''
  }
})

watch(() => filters.value, async () => {

  pageOptions.value.filter = useFiltersToQueryParams(filters.value)
  console.log(pageOptions.value.filter);

  await getUsers()
}, {
  deep: true
})

const getUsers = async () => {
  loading.value = true
  const { isSuccess, message, total, users: fetchedUsers } = await mockApi.getUsers(pageOptions.value)
  loading.value = false

  if (isSuccess) {
    users.value = fetchedUsers || []
    totalRecords.value = total
  } else {
    toast(message, {
      type: 'error'
    })
  }
}

const sortUsers = (key: string) => {
  pageOptions.value.sortOrder = pageOptions.value.sortOrder === 'asc' ? 'desc' : 'asc'
  pageOptions.value.sortBy = key as keyof User
  getUsers()
}

const goToPage = (page: number) => {
  pageOptions.value.page = page

  getUsers()
}

const editUser = (item: User) => {
  router.push(`/users/${item.id}`)
};

const deleteModal = ref(false)
const selectedUserId = ref<number | null>(null)

const showDeleteModal = async (userId: number) => {
  deleteModal.value = true;
  selectedUserId.value = userId
};

const deleteUser = async () => {
  if (selectedUserId.value) {
    deleteModal.value = false
    loading.value = true
    const { isSuccess, message } = await mockApi.deleteUser(selectedUserId.value)

    if (isSuccess) {
      toast("User deleted successfully", {
        type: 'success'
      })
      await getUsers()
    } else {
      toast(message || 'Something went wrong', {
        type: 'error'
      })
    }

  }
};

const resetFilters = () => {
  filters.value.role = undefined
  filters.value.status = undefined
}

onBeforeMount(async () => {
  await getUsers()
})
</script>

<template>
  <div class="flex flex-col mt-6">
    <DataTable v-model:search="search" v-model:current-page="pageOptions.page" :label="t('pages.users.index')"
      :headers="headers" :records="users" :loading="loading"
      :options="{ perPage: pageOptions.limit, sortOrder: pageOptions.sortOrder, totalRecords: totalRecords }"
      @sort-by="sortUsers" @pagination-previous="goToPage" @pagination-next="goToPage" @pagination-page="goToPage">
      <template #actions>
        <RouterLink v-if="useHasPermission('add_users')" to="/users/create"
          class="flex items-center justify-center cursor-pointer w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
          <MdiIcon icon="account" color="text-gray-400" :size="20" />

          <span>{{ t('buttons.addUser') }}</span>
        </RouterLink>
      </template>

      <template #filters>
        <div class="grid grid-cols-1 gap-6 min-w-[350px] p-6">
          <div class="flex items-center gap-2 w-full">
            <p>{{ t('pages.users.table.status') }}</p>
            <select v-model="filters.status"
              class="capitalize pb-3 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
              <option v-for="status in Status" :key="status" :value="status" class="capitalize">{{ status }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2 w-full">
            <p>{{ t('pages.users.table.role') }}</p>
            <select v-model="filters.role"
              class="capitalize pb-3 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring">
              <option v-for="role in Role" :key="role" :value="role" class="capitalize">{{ role }}</option>
            </select>
          </div>
        </div>
        <button @click="resetFilters"
          class="px-8 py-2.5 leading-5 mx-7 my-4 cursor-pointer text-white transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">{{
            t('buttons.clear') }}</button>
      </template>

      <template #[`record.status`]="{ item }">
        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 status-tag"
          :class="statusTag(item.status as string)">
          <span class="h-1.5 w-1.5 rounded-full bg-[currentColor]"></span>

          <h2 class="text-sm font-normal text capitalize">{{ item.status }}</h2>
        </div>
      </template>
      <template #[`record.dateJoined`]="{ item }">
        <div>
          {{ useFormatDate(item.dateJoined as string, 'YYYY-MM-DD') }}
        </div>
      </template>
      <template #[`record.actions`]="{ item }">
        <div class="flex items-center justify-center">
          <DropdownMenu v-if="useHasPermission(['delete_users', 'edit_users', 'view_user'])">
            <a v-if="useHasPermission('delete_users') && authStore.authenticatedUserData.user.id !== item.id"
              class="flex items-center py-2 px-4 border-b border-gray-200 text-red-400 hover:bg-gray-100 transition dark:border-gray-700 dark:bg-gray-600 cursor-pointer"
              @click="showDeleteModal(item.id as number)">{{ t('buttons.delete') }}</a>
            <a v-if="useHasPermission(['edit_users', 'view_user'])"
              class="flex items-center py-2 px-4 text-gray-500 hover:bg-gray-100 transition dark:text-gray-400 dark:bg-gray-600 cursor-pointer"
              @click="editUser(item as unknown as User)">
              {{ useHasPermission('edit_users') ? t('buttons.edit') : t('buttons.view') }}
            </a>
          </DropdownMenu>
          <span v-else>-</span>
        </div>
      </template>
    </DataTable>
  </div>

  <ModalPopup v-model="deleteModal">
    <div class="flex w-full h-full flex-col gap-2 py-4 px-6">
      <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 self-center">
        <MdiIcon icon="trashCan" :size="25" color="currentColor" />
      </div>
      <p class="font-semibold self-center text-red-500 text-xl">{{ t('modals.deleteUser.index') }}</p>
      <I18nT tag="span" class="font-medium mt-2" keypath="modals.deleteUser.message">
        <span class="text-red-500">
          {{ selectedUserId }}
        </span>
      </I18nT>
      <div class="flex items-center gap-4 mt-4">
        <button @click="deleteModal = false"
          class="px-6 py-2 flex-1 font-medium tracking-wide cursor-pointer text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300 transform bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
          {{ t('buttons.cancel') }}
        </button>
        <button @click="deleteUser"
          class="px-6 py-2 flex-1 font-medium tracking-wide cursor-pointer text-white capitalize transition-colors duration-300 transform bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80">
          {{ t('buttons.delete') }}
        </button>
      </div>
    </div>
  </ModalPopup>
</template>