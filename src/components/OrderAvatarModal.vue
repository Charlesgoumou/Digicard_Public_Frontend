<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      @click.self="handleClose"
    >
      <div 
        class="bg-slate-800 p-4 sm:p-6 rounded-lg max-w-lg w-full text-white mx-2 max-h-[95vh] overflow-y-auto"
        @click.stop
      >
        <h2 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Rogner la photo de la commande</h2>
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
          <button 
            type="button" 
            @click="handleCloseClick"
            :disabled="isUploading"
            class="px-4 py-2 bg-slate-600 rounded hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button 
            type="button" 
            @click="handleCropClick"
            :disabled="isUploading"
            class="px-4 py-2 bg-sky-500 rounded hover:bg-sky-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
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
  </Teleport>
</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";
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

  // Debug: vérifier que le cropper est bien initialisé
  onMounted(async () => {
    await nextTick();
    console.log("OrderAvatarModal: Component mounted, cropper ref:", cropper.value);
  });

  // Function to handle close button click
  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    console.log("OrderAvatarModal: handleClose called");
    emit("close");
  };

  // Handler for close button with explicit event handling
  const handleCloseClick = (event) => {
    event?.stopPropagation();
    event?.preventDefault();
    console.log("OrderAvatarModal: handleCloseClick called");
    handleClose(event);
  };

  // Function to crop the image and emit the result
  const cropImage = () => {
    console.log("OrderAvatarModal: cropImage called");
    
    if (!cropper.value) {
      console.error("Cropper instance not found");
      return;
    }

    try {
      console.log("OrderAvatarModal: Getting cropped canvas...");
      const canvas = cropper.value.getCroppedCanvas({
        width: 400,
        height: 400,
      });
      
      if (!canvas) {
        console.error("Failed to get cropped canvas");
        return;
      }
      
      console.log("OrderAvatarModal: Converting canvas to blob...");
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("OrderAvatarModal: Blob created, emitting save event", blob.size, "bytes");
          emit("save", blob);
        } else {
          console.error("Failed to create blob from canvas.");
        }
      }, "image/jpeg", 0.95);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  // Handler for crop button with explicit event handling
  const handleCropClick = (event) => {
    event?.stopPropagation();
    event?.preventDefault();
    console.log("OrderAvatarModal: handleCropClick called");
    cropImage();
  };
</script>

<style>
  /* Make the crop area circular */
  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }
</style>
