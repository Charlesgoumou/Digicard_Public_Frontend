<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div class="bg-slate-800 p-4 sm:p-6 rounded-lg max-w-lg w-full text-white mx-2 max-h-[95vh] overflow-y-auto">
      <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Rogner votre photo</h2>
      <div class="max-h-[50vh] sm:max-h-[60vh] overflow-hidden">
        <vue-cropper
          ref="cropper"
          :src="imageUrl"
          :aspect-ratio="1 / 1"
          alt="Source Image"
          :view-mode="1"
          drag-mode="move"
          :auto-crop-area="0.8"
          :background="false"
          :crop-box-resizable="true"
          :crop-box-movable="true"
        ></vue-cropper>
      </div>
      <div v-if="isUploading" class="mt-4 flex items-center justify-center gap-2 text-sky-400">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Téléchargement en cours...</span>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button @click="$emit('close')" :disabled="isUploading" class="px-4 py-2 bg-slate-600 rounded hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Annuler
        </button>
        <button @click="cropImage" :disabled="isUploading" class="px-4 py-2 bg-sky-500 rounded hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <svg v-if="isUploading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="isUploading">Téléchargement...</span>
          <span v-else>Enregistrer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import "cropperjs/dist/cropper.css";
  import VueCropper from "vue-cropperjs";

  // Define component props
  const props = defineProps({
    imageUrl: {
      type: String,
      required: true,
    },
    isUploading: {
      type: Boolean,
      default: false,
    },
  });

  // Define component events
  const emit = defineEmits(["close", "save"]);

  // Reference to the cropper instance
  const cropper = ref(null);

  // Function to crop the image and emit the result
  const cropImage = () => {
    if (!cropper.value) return;

    cropper.value
      .getCroppedCanvas({
        // Optional: specify cropped image dimensions for consistency
        // width: 256,
        // height: 256,
      })
      .toBlob((blob) => {
        if (blob) {
          emit("save", blob); // Emit the cropped image blob
        } else {
          console.error("Failed to create blob from canvas.");
          // Optionally emit an error event or show a message
        }
      }, "image/jpeg"); // Specify format (jpeg or png)
  };
</script>

<style>
  /* Optional: Customize Cropper.js appearance */
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%; /* Make the crop area circular */
  }
</style>
