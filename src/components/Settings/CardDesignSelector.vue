<template>
  <div class="w-full space-y-4">
    <div
      v-if="isLocked"
      class="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span v-if="isDesignLockedByAdmin"
          >Cette section est verrouillée car le design est défini par le business admin. Le design choisi par le business admin sera utilisé pour votre carte.</span
        >
        <span v-else
          >Cette section est verrouillée car la commande a été validée. Vous ne pouvez plus modifier le design.</span
        >
      </div>
    </div>
    <div class="w-full pt-2 space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-white mb-2">Nos designs</h3>
        <p class="text-sm text-slate-400">
          Choisissez parmi nos 30 designs prêts à l'emploi. Utilisez les boutons de navigation pour voir plus de
          designs.
        </p>
      </div>

      <div class="w-full designs-swiper-container relative">
        <button
          type="button"
          class="designs-swiper-button-prev"
          @click="scrollDesignsLeft"
          :disabled="isLocked"
          aria-label="Défiler vers la gauche"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          class="designs-swiper-button-next"
          @click="scrollDesignsRight"
          :disabled="isLocked"
          aria-label="Défiler vers la droite"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="swiper designs-swiper">
          <div class="swiper-wrapper">
            <div v-for="i in 30" :key="i" class="swiper-slide" :data-design-number="i">
              <div class="design-card relative group h-full">
                <div
                  class="relative bg-slate-800 rounded-lg overflow-hidden border-2"
                  :class="
                    selectedDesignType === 'template' && selectedDesignNumber === i
                      ? 'border-sky-500'
                      : 'border-slate-700'
                  "
                >
                  <!-- ✅ MODIFICATION: Cadre carré 1080x1080 pour les images -->
                  <div
                    v-if="getDesignImageUrl(i) && !designImageErrors[i]"
                    class="relative w-full aspect-square flex items-center justify-center bg-slate-900/50 overflow-hidden"
                  >
                    <img
                      :src="getDesignImageUrl(i)"
                      :alt="`Design de carte ${i}`"
                      loading="lazy"
                      decoding="async"
                      :class="`w-full h-full object-contain ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`"
                      @click="!isLocked && viewDesignImage(i)"
                      @error="handleDesignImageError($event, i)"
                      @load="designImageErrors[i] = false"
                    />
                  </div>
                  <div
                    v-else
                    class="w-full aspect-square bg-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs p-2"
                  >
                    <div class="text-center">
                      <p class="font-semibold text-xs">Design {{ i }}</p>
                      <p class="text-xs mt-1">Image non disponible</p>
                    </div>
                  </div>

                  <div
                    class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center"
                  >
                    <button
                      type="button"
                      @click="viewDesignImage(i)"
                      :disabled="isLocked"
                      class="opacity-0 group-hover:opacity-100 transition-opacity bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      👁️ Voir
                    </button>
                  </div>

                  <div class="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                    <button
                      type="button"
                      @click="selectDesign(i)"
                      :disabled="localNoDesignYet || isLocked"
                      class="w-full bg-sky-500 hover:bg-sky-600 text-white py-1.5 px-3 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="
                        selectedDesignType === 'template' && selectedDesignNumber === i
                          ? 'bg-green-500 hover:bg-green-600'
                          : ''
                      "
                    >
                      {{
                        selectedDesignType === "template" && selectedDesignNumber === i ? "✓ Sélectionné" : "Choisir"
                      }}
                    </button>
                  </div>

                  <div
                    v-if="selectedDesignType === 'template' && selectedDesignNumber === i"
                    class="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs"
                  >
                    ✓
                  </div>
                </div>
                <p class="text-center text-xs text-slate-400 mt-1">Design {{ i }}</p>
              </div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-700"></div>

    <div class="w-full space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-white mb-2">Design personnalisé</h3>
        <p class="text-sm text-slate-400">
          Téléchargez votre propre design de carte. Dimensions requises : 54 x 86 mm. Formats acceptés : JPG, PNG, PDF,
          SVG, EDX.
        </p>
      </div>

      <div>
        <div
          class="border-2 border-dashed border-slate-700 rounded-lg p-4 sm:p-6 text-center"
          :class="customDesignFile ? 'border-sky-500' : ''"
        >
          <input
            ref="customDesignInput"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.svg,.eddx"
            @change="handleCustomDesignUpload"
            :disabled="localNoDesignYet || isLocked"
            class="hidden"
          />

          <div v-if="!customDesignFile && !customDesignPreview">
            <svg class="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="mt-2 text-sm text-slate-400">Cliquez pour télécharger ou glissez-déposez votre fichier</p>
            <p class="text-xs text-slate-500 mt-1">54 x 86 mm | JPG, PNG, PDF, SVG, EDX</p>
            <button
              type="button"
              @click="customDesignInput?.click()"
              :disabled="localNoDesignYet || isLocked"
              class="mt-4 bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sélectionner un fichier
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="relative inline-block">
              <img
                v-if="customDesignPreview && customDesignFile?.type?.startsWith('image/')"
                :src="customDesignPreview"
                alt="Aperçu du design personnalisé"
                class="max-w-full h-auto max-h-64 rounded-lg border-2 border-slate-700"
              />
              <div v-else class="bg-slate-800 p-8 rounded-lg border-2 border-slate-700">
                <svg class="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p class="mt-2 text-sm text-slate-400">{{ customDesignFile?.name }}</p>
              </div>
              <button
                type="button"
                @click="removeCustomDesign"
                :disabled="isLocked"
                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>
            <div class="flex items-center justify-center gap-4">
              <button
                type="button"
                @click="customDesignInput?.click()"
                :disabled="localNoDesignYet || isLocked"
                class="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Changer
              </button>
              <button
                type="button"
                @click="selectCustomDesign"
                :disabled="localNoDesignYet || isLocked"
                class="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="selectedDesignType === 'custom' ? 'bg-green-500 hover:bg-green-600' : ''"
              >
                {{ selectedDesignType === "custom" ? "✓ Sélectionné" : "Choisir ce design" }}
              </button>
            </div>
            <p v-if="customDesignFile" class="text-xs text-slate-500">
              Fichier : {{ customDesignFile.name }} ({{ formatFileSize(customDesignFile.size) }})
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <input
            v-model="localNoDesignYet"
            type="checkbox"
            id="no-design-yet"
            @change="handleNoDesignYetChange"
            :disabled="hasSelectedDesign || isLocked"
            class="mt-1 w-4 h-4 text-sky-500 bg-slate-800 border-slate-600 rounded focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            for="no-design-yet"
            class="text-sm text-slate-300 cursor-pointer"
            :class="{ 'opacity-50 cursor-not-allowed': hasSelectedDesign || isLocked }"
          >
            Je n'ai pas encore mon design
          </label>
        </div>
        <p v-if="localNoDesignYet" class="text-xs text-slate-400 italic">
          Vous pourrez télécharger votre design plus tard depuis votre dashboard.
        </p>
      </div>
    </div>
  </div>

  <div
    v-if="showDesignModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    @click="closeDesignModal"
  >
    <div class="relative max-w-4xl max-h-[90vh] p-4" @click.stop>
      <button
        type="button"
        @click="closeDesignModal"
        class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl z-10"
      >
        ×
      </button>
      <img
        :src="modalDesignImageUrl"
        alt="Design de carte en grand"
        class="max-w-full max-h-[90vh] object-contain rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick, watch } from "vue";
  import Swiper from "swiper";
  import { Navigation, Pagination } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/pagination";
  import "swiper/css/navigation";
  import apiClient from "@/api";
  import Cookies from "js-cookie";

  const props = defineProps({
    form: {
      type: Object,
      required: true,
    },
    selectedDesignType: {
      type: String,
      default: null,
    },
    selectedDesignNumber: {
      type: Number,
      default: null,
    },
    noDesignYet: {
      type: [Boolean, Number],
      default: false,
    },
    customDesignPreview: {
      type: String,
      default: null,
    },
    selectedOrderId: {
      type: Number,
      default: null,
    },
    isOrderValidated: {
      type: Boolean,
      default: false,
    },
    isDesignLockedByAdmin: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([
    "update:form",
    "update:selectedDesignType",
    "update:selectedDesignNumber",
    "update:noDesignYet",
    "update:customDesignPreview",
    "update:saveError",
    "update:saveSuccess",
  ]);

  // Références locales
  const designsSwiper = ref(null);
  const customDesignInput = ref(null);
  const customDesignFile = ref(null);
  const showDesignModal = ref(false);
  const modalDesignImageUrl = ref(null);
  const designImageErrors = ref({});

  // Normaliser noDesignYet (peut être Number 1/0 ou Boolean true/false)
  const normalizedNoDesignYet = computed(() => {
    const value = props.noDesignYet;
    if (typeof value === 'number') return value === 1;
    return Boolean(value);
  });

  // Référence locale synchronisée avec la valeur normalisée
  const localNoDesignYet = ref(normalizedNoDesignYet.value);

  // Computed pour vérifier si un design est sélectionné
  const hasSelectedDesign = computed(() => {
    return props.selectedDesignType === "template" || props.selectedDesignType === "custom";
  });

  // Un design est réellement défini seulement si l'utilisateur n'est PAS en mode "no_design_yet"
  // et s'il a choisi un template avec numéro OU un custom avec une URL enregistrée
  const isDesignDefined = computed(() => {
    if (normalizedNoDesignYet.value) return false;
    if (props.selectedDesignType === "template" && props.selectedDesignNumber) return true;
    if (props.selectedDesignType === "custom" && (props.form?.card_design_custom_url || props.customDesignPreview)) return true;
    return false;
  });

  // Verrouillage: 
  // 1. Si le design est verrouillé par le business admin (pour les employés)
  // 2. OU si la commande est validée ET qu'un design est bel et bien défini
  // Si la commande a été validée à tort avec "design en attente", on laisse l'édition ouverte
  const isLocked = computed(() => props.isDesignLockedByAdmin || (props.isOrderValidated && isDesignDefined.value));

  // Fonction pour gérer le changement de "Je n'ai pas encore mon design"
  const handleNoDesignYetChange = () => {
    if (localNoDesignYet.value) {
      // Si on coche "Je n'ai pas encore mon design", décocher tous les designs
      emit("update:selectedDesignType", null);
      emit("update:selectedDesignNumber", null);
      emit("update:form", {
        ...props.form,
        card_design_type: null,
        card_design_number: null,
        card_design_custom_url: null,
        no_design_yet: true,
      });
      // Réinitialiser le design personnalisé
      if (customDesignFile.value) {
        customDesignFile.value = null;
        emit("update:customDesignPreview", null);
        if (customDesignInput.value) {
          customDesignInput.value.value = "";
        }
      }
    } else {
      // Si on décoche "Je n'ai pas encore mon design", mettre à jour le form
      emit("update:form", {
        ...props.form,
        no_design_yet: false,
      });
    }
    emit("update:noDesignYet", localNoDesignYet.value);
  };

  // ✅ MODIFICATION: Import des images de design avec extension .jpg (1080x1080)
  // Utiliser eager: true mais les images seront optimisées par Vite lors du build
  const designImageModules = import.meta.glob("@/assets/images/cartes/carte*.jpg", { eager: true });

  // Créer un mapping des numéros de design vers les URLs
  const designImageMap = {};
  Object.keys(designImageModules).forEach((path) => {
    const match = path.match(/carte(\d+)\.jpg$/);
    if (match) {
      const number = parseInt(match[1]);
      designImageMap[number] = designImageModules[path].default;
    }
  });

  // Fonctions pour la gestion du design de la carte
  const getDesignImageUrl = (designNumber) => {
    if (designImageMap[designNumber]) {
      return designImageMap[designNumber];
    }
    return null;
  };

  const handleDesignImageError = (event, designNumber) => {
    if (designImageErrors.value[designNumber]) {
      return;
    }

    console.error(`Erreur de chargement du design ${designNumber}:`, event);
    designImageErrors.value[designNumber] = true;

    const img = event.target;
    img.onerror = null;

    img.src = `https://via.placeholder.com/300x400/1e293b/94a3b8?text=Design+${designNumber}`;
  };

  const viewDesignImage = (designNumber) => {
    modalDesignImageUrl.value = getDesignImageUrl(designNumber);
    if (modalDesignImageUrl.value) {
      showDesignModal.value = true;
    }
  };

  const closeDesignModal = () => {
    showDesignModal.value = false;
    modalDesignImageUrl.value = null;
  };

  const selectDesign = (designNumber) => {
    // Si "Je n'ai pas encore mon design" est coché, empêcher la sélection
    if (localNoDesignYet.value) {
      return;
    }

    // Si le design est déjà sélectionné, le désélectionner
    if (props.selectedDesignType === "template" && props.selectedDesignNumber === designNumber) {
      emit("update:selectedDesignType", null);
      emit("update:selectedDesignNumber", null);
      emit("update:form", {
        ...props.form,
        card_design_type: null,
        card_design_number: null,
        card_design_custom_url: null,
        no_design_yet: false,
      });
      return;
    }

    // Décocher automatiquement "Je n'ai pas encore mon design" quand un design est sélectionné
    localNoDesignYet.value = false;
    emit("update:noDesignYet", false);

    emit("update:selectedDesignType", "template");
    emit("update:selectedDesignNumber", designNumber);
    emit("update:form", {
      ...props.form,
      card_design_type: "template",
      card_design_number: designNumber,
      card_design_custom_url: null,
      no_design_yet: false,
    });

    // Réinitialiser le design personnalisé si sélectionné
    if (customDesignFile.value) {
      customDesignFile.value = null;
      emit("update:customDesignPreview", null);
    }
  };

  const handleCustomDesignUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Si "Je n'ai pas encore mon design" est coché, empêcher le téléchargement
    if (localNoDesignYet.value) {
      emit(
        "update:saveError",
        "Vous ne pouvez pas télécharger un design si vous avez coché 'Je n'ai pas encore mon design'.",
      );
      if (customDesignInput.value) {
        customDesignInput.value.value = "";
      }
      return;
    }

    // Validation du type de fichier
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "image/svg+xml",
      "application/vnd.adobe.edx",
    ];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".svg", ".eddx"];
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      emit("update:saveError", "Format de fichier non autorisé. Formats acceptés : JPG, PNG, PDF, SVG, EDX.");
      return;
    }

    // Validation de la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      emit("update:saveError", "Le fichier est trop volumineux. Taille maximale : 10 MB.");
      return;
    }

    customDesignFile.value = file;

    // Créer un aperçu pour les images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        emit("update:customDesignPreview", e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      emit("update:customDesignPreview", null);
    }
  };

  const removeCustomDesign = () => {
    customDesignFile.value = null;
    emit("update:customDesignPreview", null);
    if (props.selectedDesignType === "custom") {
      emit("update:selectedDesignType", null);
      emit("update:form", {
        ...props.form,
        card_design_type: null,
        card_design_custom_url: null,
      });
    }
    if (customDesignInput.value) {
      customDesignInput.value.value = "";
    }
  };

  const selectCustomDesign = async () => {
    // Si "Je n'ai pas encore mon design" est coché, empêcher la sélection
    if (localNoDesignYet.value) {
      emit(
        "update:saveError",
        "Vous ne pouvez pas sélectionner un design si vous avez coché 'Je n'ai pas encore mon design'.",
      );
      return;
    }

    // Si le design custom est déjà sélectionné, le désélectionner
    if (props.selectedDesignType === "custom") {
      emit("update:selectedDesignType", null);
      emit("update:selectedDesignNumber", null);
      emit("update:form", {
        ...props.form,
        card_design_type: null,
        card_design_number: null,
        card_design_custom_url: null,
        no_design_yet: false,
      });
      return;
    }

    if (!customDesignFile.value) {
      emit("update:saveError", "Veuillez d'abord télécharger un fichier.");
      return;
    }

    // Uploader le fichier vers le backend
    try {
      await apiClient.get("/sanctum/csrf-cookie");
      const csrfToken = Cookies.get("XSRF-TOKEN");
      if (csrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
      }

      const formData = new FormData();
      formData.append("custom_design", customDesignFile.value);

      if (props.selectedOrderId) {
        formData.append("order_id", props.selectedOrderId);
      }

      const response = await apiClient.post("/api/orders/upload-custom-design", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Décocher automatiquement "Je n'ai pas encore mon design" quand un design custom est sélectionné
      localNoDesignYet.value = false;
      emit("update:noDesignYet", false);

      // Enregistrer le design personnalisé
      emit("update:selectedDesignType", "custom");
      emit("update:selectedDesignNumber", null);
      emit("update:form", {
        ...props.form,
        card_design_type: "custom",
        card_design_number: null,
        card_design_custom_url: response.data.design_url,
        no_design_yet: false,
      });

      emit("update:saveSuccess", "Design personnalisé téléchargé avec succès !");
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    } catch (error) {
      console.error("Erreur lors du téléchargement du design personnalisé:", error);
      emit("update:saveError", error.response?.data?.message || "Erreur lors du téléchargement du design.");
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Fonctions pour le défilement des designs
  const scrollDesignsLeft = () => {
    if (designsSwiper.value) {
      designsSwiper.value.slidePrev();
    }
  };

  const scrollDesignsRight = () => {
    if (designsSwiper.value) {
      designsSwiper.value.slideNext();
    }
  };

  // Initialiser Swiper pour les designs
  const initDesignsSwiper = () => {
    nextTick(() => {
      const swiperEl = document.querySelector(".designs-swiper");
      if (swiperEl) {
        // Détruire l'instance existante si elle existe
        if (designsSwiper.value) {
          designsSwiper.value.destroy(true, true);
          designsSwiper.value = null;
        }

        designsSwiper.value = new Swiper(".designs-swiper", {
          modules: [Navigation, Pagination],
          slidesPerView: 2,
          spaceBetween: 12,
          width: null,
          watchOverflow: true,
          freeMode: false,
          centeredSlides: false,
          navigation: {
            nextEl: ".designs-swiper-button-next",
            prevEl: ".designs-swiper-button-prev",
          },
          pagination: {
            el: ".designs-swiper .swiper-pagination",
            clickable: true,
            dynamicBullets: false,
            type: "bullets",
          },
          touchEventsTarget: "container",
          grabCursor: true,
          touchRatio: 1,
          touchAngle: 45,
          preventOverflow: true,
          watchSlidesProgress: true,
          observer: true,
          observeParents: true,
          breakpoints: {
            320: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            1280: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
          },
        });

        // Forcer la mise à jour après initialisation
        nextTick(() => {
          if (designsSwiper.value) {
            designsSwiper.value.update();
            designsSwiper.value.updateSlides();
          }
        });
      }
    });
  };

  // Watcher pour synchroniser noDesignYet avec la valeur normalisée
  watch(
    normalizedNoDesignYet,
    (newValue) => {
      localNoDesignYet.value = newValue;
    },
  );

  // Watchers pour synchroniser les props avec l'état local
  watch(
    () => props.selectedDesignType,
    (newValue) => {
      console.log("CardDesignSelector: selectedDesignType prop changed to", newValue);
    },
  );

  watch(
    () => props.selectedDesignNumber,
    (newValue) => {
      console.log("CardDesignSelector: selectedDesignNumber prop changed to", newValue);
    },
  );

  watch(
    normalizedNoDesignYet,
    (newValue) => {
      console.log("CardDesignSelector: noDesignYet prop changed to", newValue);
    },
  );

  // Initialiser Swiper après le montage
  onMounted(() => {
    // Initialiser Swiper
    setTimeout(() => {
      initDesignsSwiper();
    }, 500);
  });
</script>

<style scoped>
  /* Styles pour le carrousel de designs */
  .designs-swiper-container {
    width: 100%;
    max-width: 700px;
    height: 380px;
    overflow: visible;
    position: relative;
    padding: 0;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .designs-swiper-container .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px 0;
    box-sizing: border-box;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .designs-swiper-container .swiper-wrapper {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    max-width: 100%;
    flex: 1;
    height: 100%;
  }

  .designs-swiper-container .swiper-slide {
    box-sizing: border-box;
    height: auto;
    width: calc((100% - 12px) / 2) !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    max-width: calc((100% - 12px) / 2) !important;
  }

  /* Media queries pour les slides - smartphones */
  @media (max-width: 640px) {
    .designs-swiper-container .swiper-slide {
      width: calc((100% - 12px) / 2) !important;
      max-width: calc((100% - 12px) / 2) !important;
    }
  }

  /* Media queries pour les slides - tablettes */
  @media (min-width: 641px) and (max-width: 768px) {
    .designs-swiper-container .swiper-slide {
      width: calc((100% - 10px) / 2) !important;
      max-width: calc((100% - 10px) / 2) !important;
    }
  }

  /* Media queries pour les slides - desktop */
  @media (min-width: 1024px) {
    .designs-swiper-container .swiper-slide {
      width: calc((100% - 14px) / 2) !important;
      max-width: calc((100% - 14px) / 2) !important;
    }
  }

  @media (min-width: 1280px) {
    .designs-swiper-container .swiper-slide {
      width: calc((100% - 16px) / 2) !important;
      max-width: calc((100% - 16px) / 2) !important;
    }
  }

  .design-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  .design-card > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  /* ✅ MODIFICATION: S'assurer que le conteneur de l'image maintient le ratio carré */
  .design-card > div > div:first-child {
    aspect-ratio: 1 / 1;
    width: 100%;
  }

  /* ✅ MODIFICATION: Images 1080x1080 avec ratio carré et object-contain */
  .design-card img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
  }

  /* Media queries pour smartphones */
  @media (max-width: 640px) {
    .design-card {
      padding: 0.25rem;
    }

    /* ✅ MODIFICATION: Images 1080x1080 - ratio carré maintenu */
    .design-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    .design-card .absolute.bottom-0 button {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }

    .design-card .absolute.top-1\.5.right-1\.5 {
      width: 5px;
      height: 5px;
      font-size: 0.625rem;
    }
  }

  .designs-swiper-button-prev,
  .designs-swiper-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    background: rgba(14, 165, 233, 0.95);
    border-radius: 50%;
    color: white;
    z-index: 20;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    outline: none;
    box-sizing: border-box;
    margin: 0;
  }

  .designs-swiper-button-prev:hover,
  .designs-swiper-button-next:hover {
    background: rgba(14, 165, 233, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .designs-swiper-button-prev:active,
  .designs-swiper-button-next:active {
    transform: translateY(-50%) scale(0.95);
  }

  .designs-swiper-button-prev {
    /* MODIFIÉ : Ajustement de la position après suppression du padding */
    left: 10px;
  }

  .designs-swiper-button-next {
    /* MODIFIÉ : Ajustement de la position après suppression du padding */
    right: 10px;
  }

  .designs-swiper-button-prev::after,
  .designs-swiper-button-next::after {
    display: none;
  }

  .designs-swiper-button-prev svg,
  .designs-swiper-button-next svg {
    width: 24px;
    height: 24px;
    stroke-width: 2.5;
  }

  /* Media queries pour tablettes - boutons de navigation */
  @media (max-width: 768px) {
    .designs-swiper-container {
      height: 320px;
      padding: 0 40px;
    }

    .designs-swiper-button-prev {
      left: -5px;
      width: 36px;
      height: 36px;
      z-index: 20;
    }

    .designs-swiper-button-next {
      right: -5px;
      width: 36px;
      height: 36px;
      z-index: 20;
    }

    .designs-swiper-button-prev svg,
    .designs-swiper-button-next svg {
      width: 20px;
      height: 20px;
    }

    .designs-swiper .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      margin: 0 4px;
    }

    .designs-swiper .swiper-pagination-bullet-active {
      width: 12px;
      height: 12px;
    }
  }

  /* Media queries pour smartphones - boutons de navigation */
  @media (max-width: 640px) {
    .designs-swiper-container {
      width: min(321px, calc(100vw - 70px));
      max-width: min(321px, calc(100vw - 70px));
      height: min(302px, calc(75vh - 20px));
      padding: 0;
      margin: 0 auto;
    }

    .designs-swiper-container .swiper {
      padding: 5px 0;
    }

    .designs-swiper-button-prev {
      left: -8px;
      width: 24px;
      height: 24px;
      z-index: 30;
    }

    .designs-swiper-button-next {
      right: -8px;
      width: 24px;
      height: 24px;
      z-index: 30;
    }

    .designs-swiper-button-prev svg,
    .designs-swiper-button-next svg {
      width: 14px;
      height: 14px;
    }

    .designs-swiper .swiper-pagination {
      margin-top: 0.75rem;
      padding: 0.25rem 0;
    }

    .designs-swiper .swiper-pagination-bullet {
      width: 8px;
      height: 8px;
      margin: 0 3px;
    }

    .designs-swiper .swiper-pagination-bullet-active {
      width: 10px;
      height: 10px;
    }
  }

  /* Très petits écrans (< 400px) */
  @media (max-width: 400px) {
    .designs-swiper-container {
      width: min(280px, calc(100vw - 50px));
      max-width: min(280px, calc(100vw - 50px));
      height: min(265px, calc(70vh - 20px));
    }

    /* ✅ MODIFICATION: Images 1080x1080 - ratio carré maintenu */
    .design-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    .designs-swiper-button-prev,
    .designs-swiper-button-next {
      width: 20px;
      height: 20px;
    }

    .designs-swiper-button-prev svg,
    .designs-swiper-button-next svg {
      width: 12px;
      height: 12px;
    }
  }

  /* Petits écrans (400px - 480px) */
  @media (min-width: 401px) and (max-width: 480px) {
    .designs-swiper-container {
      width: min(300px, calc(100vw - 60px));
      max-width: min(300px, calc(100vw - 60px));
      height: min(280px, calc(72vh - 20px));
    }

    /* ✅ MODIFICATION: Images 1080x1080 - ratio carré maintenu */
    .design-card img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }

  .designs-swiper .swiper-pagination {
    position: relative;
    margin-top: 1rem;
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    padding: 0.5rem 0;
    z-index: 10;
    overflow: hidden;
    height: auto;
  }

  .designs-swiper .swiper-pagination-bullet {
    background-color: #64748b;
    opacity: 0.7;
    width: 12px;
    height: 12px;
    margin: 0 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .designs-swiper .swiper-pagination-bullet:hover {
    opacity: 1;
    transform: scale(1.2);
  }

  .designs-swiper .swiper-pagination-bullet-active {
    background-color: #0ea5e9;
    opacity: 1;
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    .design-card {
      padding: 0.5rem;
    }
  }

  .designs-swiper-container .swiper-wrapper {
    box-sizing: border-box;
  }

  .designs-swiper-container .swiper-slide {
    box-sizing: border-box;
    flex-shrink: 0;
  }
</style>
