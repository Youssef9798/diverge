<script setup lang="ts">
import DropdownMenu from '../DropdownMenu.vue';
import MdiIcon from '../MdiIcon.vue';
</script>

<template>
  <DropdownMenu>
    <template #activator="{ toggle }">
      <button @click="toggle"
        class="relative z-10 block p-2 shrink-0 cursor-pointer transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
        <MdiIcon icon="filterOutline" :size="20" color="white" />
      </button>
    </template>
    <slot></slot>
  </DropdownMenu>
</template>