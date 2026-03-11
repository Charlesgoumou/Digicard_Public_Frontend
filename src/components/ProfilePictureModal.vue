<template>
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Rogner votre photo</h2>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-white transition-colors"
          :disabled="isUploading"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <div v-if="imageUrl" class="space-y-4">
          <div class="avatar-crop-container bg-slate-900 rounded-lg p-4">
            <Cropper
              ref="cropperRef"
              class="avatar-cropper"
              :src="imageUrl"
              :stencil-props="{ aspectRatio: 1 }"
              :resize-image="{ touch: true, wheel: { ratio: 0.1 }, adjustStencil: false }"
              :move-image="{ touch: true, mouse: true }"
              :canvas="{ width: 1200, height: 1200, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' }"
            />
          </div>

          <p class="text-slate-400 text-sm text-center">
            Molette ou pinch pour zoomer · Glisser pour déplacer · Cadre carré 1:1 (photo de profil)
          </p>

          <div v-if="isUploading" class="flex items-center justify-center gap-2 text-sky-400">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Téléchargement en cours...</span>
          </div>

          <div class="flex gap-4">
            <button
              type="button"
              @click="$emit('close')"
              :disabled="isUploading"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="button"
              @click="cropAndEmit"
              :disabled="isUploading"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const cropperRef = ref(null);

const cropAndEmit = () => {
  if (!cropperRef.value) return;

  try {
    const result = cropperRef.value.getResult();
    const canvas = result.canvas;

    if (!canvas) {
      console.error("ProfilePictureModal: no canvas from cropper");
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          emit("save", blob);
        } else {
          console.error("ProfilePictureModal: failed to create blob");
        }
      },
      "image/jpeg",
      0.92
    );
  } catch (error) {
    console.error("ProfilePictureModal: crop error", error);
  }
};
</script>

<style scoped>
.avatar-crop-container {
  min-height: 280px;
  height: min(55vh, 420px);
}

@media (min-width: 640px) {
  .avatar-crop-container {
    min-height: 320px;
    height: min(60vh, 480px);
  }
}

.avatar-cropper {
  height: 100%;
  width: 100%;
  background: #0f172a;
}
</style>
