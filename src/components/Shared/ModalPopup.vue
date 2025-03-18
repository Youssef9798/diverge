<script setup lang="ts">
const showModal = defineModel()
</script>

<template>
  <Teleport to="body">
    <div v-if="showModal" @click.self="showModal = false"
      class="w-screen h-screen fixed bg-black/20 z-9999 inset-0 flex items-center justify-center">
      <Transition enter-active-class="scale-in-center" leave-active-class="scale-out-center">
        <div v-if="showModal"
          class="overflow-y-auto bg-white pa-4 dark:bg-gray-900 w-full lg:max-w-sm max-w-xs shadow rounded-xl p-4 min-h-40">
          <slot></slot>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.scale-in-center {
  -webkit-animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

@-webkit-keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scale-in-center {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }
}


.scale-out-center {
  -webkit-animation: scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
  animation: scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@-webkit-keyframes scale-out-center {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }
}

@keyframes scale-out-center {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 1;
  }
}
</style>