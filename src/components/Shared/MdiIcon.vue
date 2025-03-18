<script setup lang="ts">
import { computed } from 'vue';
import * as mdiIcons from '@mdi/js'

const props = defineProps<{
  icon: string,
  size: number,
  color: string,
}>();

const iconPath = computed(() => {
  try {
    return mdiIcons?.[`mdi${props.icon.charAt(0).toUpperCase() + props.icon.slice(1)}`] || "";
  } catch (error) {
    console.warn(`Icon "${props.icon}" not found`, error);
    return "";
  }
});
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" :fill="color" :color="color">
    <path :d="iconPath" />
  </svg>
</template>


<style scoped>
svg {
  transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
}

path {
  fill: currentColor;
}
</style>