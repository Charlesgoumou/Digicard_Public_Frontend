<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm"
    >
      <div class="relative">
        <!-- Bulle de chargement principale -->
        <div
          class="w-20 h-20 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 animate-pulse shadow-lg shadow-sky-500/50"
        ></div>
        <!-- Bulles secondaires animées -->
        <div
          class="absolute top-0 left-0 w-20 h-20 rounded-full bg-sky-400/50 animate-ping"
          style="animation-delay: 0s"
        ></div>
        <div
          class="absolute top-0 left-0 w-20 h-20 rounded-full bg-blue-400/30 animate-ping"
          style="animation-delay: 0.5s"
        ></div>
        <!-- Cercle rotatif -->
        <div
          class="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

