<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import MdiIcon from './MdiIcon.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  closeOnClickContent?: boolean;
}>()

const { locale } = useI18n()

const elementRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const position = ref({ top: 0, left: 0, width: 0, right: 0 });

const updatePosition = () => {
  if (elementRef.value) {
    const rect = elementRef.value.getBoundingClientRect();

    position.value = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX,
      width: rect.width,
    };

    if (dropdownRef.value) {
      const dropdownWidth = dropdownRef.value.offsetWidth;
      position.value.left -= dropdownWidth;
    }

    if (dropdownRef.value) {
      const dropdownWidth = dropdownRef.value.offsetWidth;
      position.value.right -= dropdownWidth;
    }
  }

};

const dropdownPosition = computed(() => {
  if (locale.value === 'ar') {
    return `${position.value.right + (dropdownRef.value?.offsetWidth || 0) - position.value.width}px`
  } else {
    return `${position.value.right}px`
  }
})

const isOpen = ref(false);

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    updatePosition();
  }
};

const handleClickOutside = (event: Event) => {
  if (
    isOpen.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    elementRef.value &&
    !elementRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

const handleOnClickContent = () => {
  if (
    props.closeOnClickContent
  ) {
    isOpen.value = false;
  }
};
</script>

<template>
  <div ref="elementRef" class="relative cursor-pointer">
    <slot name="activator" :toggle="toggleDropdown">
      <button @click="toggleDropdown"
        class="px-1 py-1 text-gray-500 transition-colors duration-200 cursor-pointer rounded-lg dark:text-gray-300 hover:bg-gray-100">
        <MdiIcon icon="dotsVertical" :size="20" color="currentColor" />
      </button>
    </slot>
    <Teleport to="body">
      <Transition name="dropdown">
        <div v-if="isOpen" ref="dropdownRef" @click="handleOnClickContent" v-click-away="handleClickOutside"
          class="absolute min-w-[180px] bg-white dark:bg-gray-700 shadow rounded-lg flex flex-col z-99 border border-gray-300 dark:border-gray-800 overflow-hidden"
          :style="{ top: `${position.top + 5}px`, left: dropdownPosition }">
          <slot></slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>