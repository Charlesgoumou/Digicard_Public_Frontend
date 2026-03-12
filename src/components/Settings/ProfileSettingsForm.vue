<template>
  <div class="space-y-4 pt-2 min-w-0">
    <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-4 md:p-6 min-w-0 overflow-hidden">
      <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div class="relative">
          <div
            class="w-32 h-32 rounded-full border-4 border-slate-600 bg-slate-700 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="orderAvatarPreview && !avatarLoadError"
              :src="orderAvatarPreview"
              class="w-full h-full object-cover"
              alt="Avatar de la commande"
              @error="handleAvatarImageError"
              @load="handleAvatarImageLoad"
            />
            <svg v-else class="w-16 h-16 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
        <div class="flex-1 space-y-3">
          <p class="text-sm text-slate-400">
            Choisissez une photo spécifique pour cette commande ou utilisez votre photo de profil.
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              @click.stop.prevent="triggerOrderAvatarUpload"
              :disabled="isUploadingAvatar"
              class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isUploadingAvatar" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isUploadingAvatar">Téléchargement...</span>
              <span v-else>📷 Télécharger une photo</span>
            </button>
            <button
              type="button"
              @click.stop.prevent="useProfileAvatarForOrder"
              :disabled="!user.avatar_url || isUploadingAvatar"
              class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isUploadingAvatar" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isUploadingAvatar">Téléchargement...</span>
              <span v-else>👤 Utiliser ma photo de profil</span>
            </button>
          </div>
          <input ref="orderAvatarInput" type="file" accept="image/*" class="hidden" @change.stop="handleOrderAvatarUpload" :disabled="isUploadingAvatar" />
          <div v-if="isUploadingAvatar" class="flex items-center gap-2 text-sky-400 text-sm">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Téléchargement de la photo en cours...</span>
          </div>
          <p v-if="avatarUploadMessage && !isUploadingAvatar" :class="avatarUploadError ? 'text-red-400' : 'text-green-400'" class="text-sm">
            {{ avatarUploadMessage }}
          </p>
        </div>
      </div>
    </div>

    <OrderAvatarModal
      v-if="isOrderAvatarCropperOpen"
      :imageUrl="selectedOrderImageUrl"
      :isUploading="isUploadingAvatar"
      @close="handleOrderAvatarModalClose"
      @save="handleOrderAvatarCropped"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
      <div class="min-w-0">
        <label for="name" class="block text-sm font-medium text-slate-300 mb-1">Nom Complet *</label>
        <input
          v-model.trim="form.name"
          type="text"
          id="name"
          required
          class="input-field w-full"
          placeholder="Votre nom complet"
        />
      </div>
      <div class="min-w-0">
        <label for="title" class="block text-sm font-medium text-slate-300 mb-1">Titre / Poste</label>
        <input
          v-model.trim="form.title"
          type="text"
          id="title"
          class="input-field w-full"
          placeholder="Ex: Développeur Web"
        />
        <p class="text-xs text-slate-500 mt-1">Sera affiché après votre nom, séparé par une virgule</p>
      </div>
    </div>

    <div class="min-w-0 w-full">
      <label class="block text-sm font-medium text-slate-300 mb-1">Nom d'utilisateur (URL Publique)</label>
      <div
        role="button"
        tabindex="0"
        :aria-label="copyFeedback ? 'URL copiée' : 'Cliquer pour copier l\'URL du profil'"
        :title="copyFeedback ? 'URL copiée !' : 'Cliquer pour copier l\'URL'"
        class="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg px-2 sm:px-4 py-3 w-full max-w-full overflow-hidden cursor-pointer select-none transition-colors hover:bg-slate-700/50 hover:border-slate-600 active:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        @click="copyPublicUrl"
        @keydown.enter.prevent="copyPublicUrl"
        @keydown.space.prevent="copyPublicUrl"
      >
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-1.5 sm:mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <span
          class="text-slate-400 text-[10px] sm:text-xs md:text-sm mr-1 sm:mr-2 whitespace-nowrap flex-shrink-0 hidden sm:inline"
          >{{ publicUrlPrefix }}</span
        >
        <span class="text-slate-400 text-[10px] sm:text-xs mr-1 sm:mr-2 whitespace-nowrap flex-shrink-0 sm:hidden"
          >arccenciel.com/...</span
        >
        <span class="text-white font-medium text-xs sm:text-sm truncate min-w-0 flex-1 overflow-hidden">{{
          publicUrlValue
        }}</span>
        <svg
          v-if="!copyFeedback"
          class="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 ml-1 sm:ml-2 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span v-else class="text-green-400 text-xs sm:text-sm ml-1 sm:ml-2 flex-shrink-0">✓ Copié</span>
      </div>
      <p class="text-xs text-slate-500 mt-1">
        🔒 Ce nom d'utilisateur a été généré automatiquement et ne peut pas être modifié. Cliquez sur le champ pour copier l'URL.
      </p>
    </div>

    <div class="pt-4 border-t border-slate-700/50 min-w-0">
      <p class="text-sm font-medium text-slate-300 mb-4">🎨 Personnalisation des Couleurs</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-0">
        <div>
          <label for="profile_border_color" class="block text-xs font-medium text-slate-400 mb-2">
            Bordure Photo
          </label>
          <div class="flex items-center gap-2 min-w-0">
            <input
              v-model="form.profile_border_color"
              type="color"
              id="profile_border_color"
              class="w-12 h-10 rounded cursor-pointer border-2 border-slate-600 flex-shrink-0"
            />
            <input
              v-model="form.profile_border_color"
              type="text"
              class="input-field flex-1 font-mono text-sm min-w-0"
              placeholder="#facc15"
            />
          </div>
        </div>
        <div>
          <label for="save_contact_button_color" class="block text-xs font-medium text-slate-400 mb-2">
            Bouton "Enregistrer Contact"
          </label>
          <div class="flex items-center gap-2 min-w-0">
            <input
              v-model="form.save_contact_button_color"
              type="color"
              id="save_contact_button_color"
              class="w-12 h-10 rounded cursor-pointer border-2 border-slate-600 flex-shrink-0"
            />
            <input
              v-model="form.save_contact_button_color"
              type="text"
              class="input-field flex-1 font-mono text-sm min-w-0"
              placeholder="#ca8a04"
            />
          </div>
        </div>
        <div>
          <label for="services_button_color" class="block text-xs font-medium text-slate-400 mb-2">
            Bouton "Découvrir Services"
          </label>
          <div class="flex items-center gap-2 min-w-0">
            <input
              v-model="form.services_button_color"
              type="color"
              id="services_button_color"
              class="w-12 h-10 rounded cursor-pointer border-2 border-slate-600 flex-shrink-0"
            />
            <input
              v-model="form.services_button_color"
              type="text"
              class="input-field flex-1 font-mono text-sm min-w-0"
              placeholder="#0ea5e9"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="pt-4 border-t border-slate-700/50">
      <label class="block text-sm font-medium text-slate-300 mb-2">Numéros de Téléphone</label>
      <div v-for="(phone, index) in form.phone_numbers" :key="`phone-${index}`" class="flex items-center gap-2 mb-2">
        <input
          v-model.trim="form.phone_numbers[index]"
          type="tel"
          class="input-field flex-1"
          :placeholder="`Numéro ${index + 1}`"
        />
        <button
          v-if="form.phone_numbers.length > 1"
          @click="$emit('removePhone', index)"
          type="button"
          class="px-3 py-2 bg-red-600/50 hover:bg-red-500/50 text-white rounded-lg transition-colors"
          title="Supprimer"
        >
          ✕
        </button>
      </div>
      <button
        @click="$emit('addPhone')"
        type="button"
        class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
      >
        + Ajouter un autre numéro
      </button>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-2">Adresses Email</label>
      <div v-for="(email, index) in form.emails" :key="`email-${index}`" class="flex items-center gap-2 mb-2">
        <input
          v-model.trim="form.emails[index]"
          type="email"
          class="input-field flex-1"
          :placeholder="index === 0 ? 'Email principal (inscription)' : `Email ${index + 1}`"
        />
        <button
          v-if="form.emails.length > 1"
          @click="$emit('removeEmail', index)"
          type="button"
          class="px-3 py-2 bg-red-600/50 hover:bg-red-500/50 text-white rounded-lg transition-colors"
          title="Supprimer"
        >
          ✕
        </button>
      </div>
      <button
        @click="$emit('addEmail')"
        type="button"
        class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
      >
        + Ajouter un autre email
      </button>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-2">Date Importante (Anniversaire)</label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="birth_day" class="block text-xs font-medium text-slate-400 mb-1">Jour</label>
          <select v-model.number="form.birth_day" id="birth_day" class="input-field">
            <option :value="null">-- Jour --</option>
            <option v-for="day in 31" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
        <div>
          <label for="birth_month" class="block text-xs font-medium text-slate-400 mb-1">Mois</label>
          <select v-model.number="form.birth_month" id="birth_month" class="input-field">
            <option :value="null">-- Mois --</option>
            <option v-for="(monthName, idx) in monthNames" :key="idx" :value="idx + 1">{{ monthName }}</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <label for="website_url" class="block text-sm font-medium text-slate-300 mb-1">Site Web</label>
      <input
        v-model.trim="form.website_url"
        type="url"
        id="website_url"
        class="input-field"
        placeholder="https://votresite.com"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-300 mb-2">Adresse Complète</label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="address_neighborhood" class="block text-xs font-medium text-slate-400 mb-1">Quartier</label>
          <input
            v-model.trim="form.address_neighborhood"
            type="text"
            id="address_neighborhood"
            class="input-field"
            placeholder="Ex: Hamdallaye"
          />
        </div>
        <div>
          <label for="address_commune" class="block text-xs font-medium text-slate-400 mb-1">Commune</label>
          <input
            v-model.trim="form.address_commune"
            type="text"
            id="address_commune"
            class="input-field"
            placeholder="Ex: Ratoma"
          />
        </div>
        <div>
          <label for="address_city" class="block text-xs font-medium text-slate-400 mb-1">Ville</label>
          <input
            v-model.trim="form.address_city"
            type="text"
            id="address_city"
            class="input-field"
            placeholder="Ex: Conakry"
          />
        </div>
        <div>
          <label for="address_country" class="block text-xs font-medium text-slate-400 mb-1">Pays</label>
          <input
            v-model.trim="form.address_country"
            type="text"
            id="address_country"
            class="input-field"
            placeholder="Ex: Guinée"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import apiClient from "@/api";
  import Cookies from "js-cookie";
  import OrderAvatarModal from "@/components/OrderAvatarModal.vue";

  const props = defineProps({
    form: {
      type: Object,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    publicShortCode: {
      type: String,
      default: null,
    },
    monthNames: {
      type: Array,
      required: true,
    },
    selectedOrderId: {
      type: [Number, String],
      default: null,
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    orderAvatarPreview: {
      type: String,
      default: null,
    },
  });

  const publicUrlPrefix = computed(() => (props.publicShortCode ? "arccenciel.com/p/" : "arccenciel.com/profil/"));
  const publicUrlValue = computed(() => (props.publicShortCode ? props.publicShortCode : props.username));

  // URL complète du profil public (pour copie dans le presse-papiers)
  const fullPublicUrl = computed(() => {
    const base = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
    const baseClean = base.replace(/\/$/, "");
    if (props.publicShortCode) {
      return `${baseClean}/p/${props.publicShortCode}`;
    }
    return `${baseClean}/profil/${props.username}`;
  });

  const copyFeedback = ref("");
  let copyFeedbackTimer = null;
  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullPublicUrl.value);
      copyFeedback.value = "Copié !";
      if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
      copyFeedbackTimer = setTimeout(() => {
        copyFeedback.value = "";
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      copyFeedback.value = "Erreur";
      if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
      copyFeedbackTimer = setTimeout(() => {
        copyFeedback.value = "";
      }, 2000);
    }
  };

  const emit = defineEmits(["addPhone", "removePhone", "addEmail", "removeEmail", "update:avatar", "reload-order-data"]);

  // ========== GESTION DE L'AVATAR DE COMMANDE ==========
  const orderAvatarInput = ref(null);
  const avatarUploadMessage = ref("");
  const avatarUploadError = ref(false);
  const avatarLoadError = ref(false);
  const isUploadingAvatar = ref(false);
  const isOrderAvatarCropperOpen = ref(false);
  const selectedOrderImageUrl = ref(null);

  // ========== FONCTIONS DE GESTION DE L'AVATAR ==========
  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    } else {
      console.warn("Cookie XSRF-TOKEN non trouvé pour la sauvegarde.");
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const triggerOrderAvatarUpload = () => {
    orderAvatarInput.value?.click();
  };

  const handleOrderAvatarUpload = (event) => {
    // Empêcher la propagation de l'événement pour éviter toute soumission du formulaire
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const file = event?.target?.files?.[0];
    if (!file) return;

    avatarUploadMessage.value = "";
    avatarUploadError.value = false;

    const reader = new FileReader();
    reader.onload = (e) => {
      selectedOrderImageUrl.value = e.target.result;
      isOrderAvatarCropperOpen.value = true;
    };
    reader.onerror = () => {
      console.error("Error reading file");
      avatarUploadMessage.value = "Erreur lors de la lecture du fichier.";
      avatarUploadError.value = true;
    };
    reader.readAsDataURL(file);

    // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
    if (orderAvatarInput.value) orderAvatarInput.value.value = "";
  };

  // Fonction pour gérer la fermeture du modal de recadrage
  const handleOrderAvatarModalClose = () => {
    console.log("ProfileSettingsForm: handleOrderAvatarModalClose called");
    isOrderAvatarCropperOpen.value = false;
    selectedOrderImageUrl.value = null;
    // Réinitialiser l'input file pour permettre de sélectionner le même fichier à nouveau
    if (orderAvatarInput.value) {
      orderAvatarInput.value.value = "";
    }
  };

  const handleOrderAvatarCropped = async (blob) => {
    console.log("ProfileSettingsForm: handleOrderAvatarCropped called", blob ? `blob size: ${blob.size} bytes` : "no blob");
    
    if (!blob) {
      console.error("No blob provided to handleOrderAvatarCropped");
      return;
    }

    // ✅ CORRECTION : Ne PAS fermer le modal immédiatement - le laisser ouvert pour afficher l'indicateur de chargement
    // Le modal se fermera automatiquement après l'upload réussi
    avatarUploadMessage.value = "";
    avatarUploadError.value = false;
    avatarLoadError.value = false;
    isUploadingAvatar.value = true;
    
    let uploadSuccess = false;
    
    try {
      setCsrfHeader();
      const formData = new FormData();
      formData.append("avatar", blob, "order-avatar.jpg");
      
      // Upload de la photo - NE PAS rediriger ou fermer le formulaire après
      const response = await apiClient.post(`/api/orders/${props.selectedOrderId}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
      const avatarUrl = response.data.avatar_url;
      console.log("ProfileSettingsForm: Avatar URL reçue du backend:", avatarUrl);
      
      let fullAvatarUrl;
      // ✅ CORRECTION : Gérer les deux formats (/storage/ et /api/storage/)
      if (avatarUrl.startsWith("/api/storage/") || avatarUrl.startsWith("/storage/")) {
        fullAvatarUrl = backendUrl + avatarUrl;
      } else if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
        fullAvatarUrl = avatarUrl;
      } else {
        fullAvatarUrl = backendUrl + "/" + avatarUrl.replace(/^\//, "");
      }
      
      // ✅ CORRECTION: Ajouter un timestamp pour forcer le rechargement de l'image après upload
      // Cela évite que le navigateur affiche l'ancienne image en cache
      const separator = fullAvatarUrl.includes('?') ? '&' : '?';
      fullAvatarUrl = fullAvatarUrl + separator + 't=' + Date.now();
      
      console.log("ProfileSettingsForm: Avatar URL complète construite:", fullAvatarUrl);
      
      // ✅ CORRECTION: Réinitialiser l'erreur de chargement pour permettre l'affichage de la nouvelle image
      avatarLoadError.value = false;
      
      emit("update:avatar", fullAvatarUrl);
      
      // ✅ CORRECTION : Pour les business admin, recharger les données de la commande
      // pour s'assurer que employee_avatar_url est bien chargé depuis le backend
      emit("reload-order-data");
      
      // Afficher un message de succès (mais ne pas rediriger)
      avatarUploadMessage.value = "Photo téléchargée avec succès !";
      avatarUploadError.value = false;
      uploadSuccess = true;
      
      // Réinitialiser l'input file pour permettre de sélectionner le même fichier à nouveau
      if (orderAvatarInput.value) {
        orderAvatarInput.value.value = "";
      }
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        avatarUploadMessage.value = "";
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors du téléchargement de la photo:", error);
      avatarUploadMessage.value = error.response?.data?.message || "Erreur lors du téléchargement.";
      avatarUploadError.value = true;
      uploadSuccess = false;
      
      // Ne pas fermer le modal en cas d'erreur pour que l'utilisateur puisse réessayer
      // L'utilisateur peut fermer le modal manuellement s'il le souhaite
      
      // Réinitialiser l'input file même en cas d'erreur
      if (orderAvatarInput.value) {
        orderAvatarInput.value.value = "";
      }
    } finally {
      isUploadingAvatar.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
      
      // ✅ CORRECTION : Fermer le modal seulement après que l'upload soit terminé avec succès
      // Attendre un court délai pour que l'utilisateur voie que l'upload est terminé
      if (uploadSuccess) {
        setTimeout(() => {
          isOrderAvatarCropperOpen.value = false;
          selectedOrderImageUrl.value = null;
        }, 800);
      }
    }
  };

  const useProfileAvatarForOrder = async () => {
    if (!props.user.avatar_url) {
      avatarUploadMessage.value = "Vous devez d'abord télécharger une photo de profil.";
      avatarUploadError.value = true;
      return;
    }
    avatarUploadMessage.value = "";
    avatarUploadError.value = false;
    avatarLoadError.value = false;
    isUploadingAvatar.value = true;
    
    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
    const profileAvatarUrlRaw = props.user.avatar_url;
    let profileAvatarUrl;
    if (profileAvatarUrlRaw.startsWith("/storage/")) {
      profileAvatarUrl = backendUrl + profileAvatarUrlRaw;
    } else if (profileAvatarUrlRaw.startsWith("http://") || profileAvatarUrlRaw.startsWith("https://")) {
      profileAvatarUrl = profileAvatarUrlRaw;
    } else {
      profileAvatarUrl = backendUrl + "/" + profileAvatarUrlRaw.replace(/^\//, "");
    }
    
    // ✅ OPTIMISATION CACHE: Ne pas ajouter de timestamp - le navigateur utilisera ETag/Last-Modified
    emit("update:avatar", profileAvatarUrl);
    
    try {
      setCsrfHeader();
      const response = await apiClient.post(`/api/orders/${props.selectedOrderId}/use-profile-avatar`);
      const returnedAvatarUrlRaw = response.data.avatar_url;
      let returnedAvatarUrl;
      if (returnedAvatarUrlRaw.startsWith("/storage/")) {
        returnedAvatarUrl = backendUrl + returnedAvatarUrlRaw;
      } else if (returnedAvatarUrlRaw.startsWith("http://") || returnedAvatarUrlRaw.startsWith("https://")) {
        returnedAvatarUrl = returnedAvatarUrlRaw;
      } else {
        returnedAvatarUrl = backendUrl + "/" + returnedAvatarUrlRaw.replace(/^\//, "");
      }
      
      // ✅ OPTIMISATION CACHE: Ne pas ajouter de timestamp - le navigateur utilisera ETag/Last-Modified
      emit("update:avatar", returnedAvatarUrl);
      
      // ✅ CORRECTION : Recharger les données de la commande après avoir utilisé la photo de profil
      emit("reload-order-data");
      
      // Afficher un message de succès (mais ne pas rediriger)
      avatarUploadMessage.value = "Photo de profil utilisée avec succès !";
      avatarUploadError.value = false;
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        avatarUploadMessage.value = "";
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'utilisation de la photo de profil:", error);
      avatarUploadMessage.value = error.response?.data?.message || "Erreur lors de l'opération.";
      avatarUploadError.value = true;
    } finally {
      isUploadingAvatar.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const handleAvatarImageError = () => {
    console.error("Erreur de chargement de l'avatar de la commande:", props.orderAvatarPreview);
    // ✅ CORRECTION : Ne pas masquer l'erreur immédiatement, laisser l'utilisateur voir qu'il y a un problème
    // Mais essayer de charger l'avatar utilisateur comme fallback si disponible
    if (props.user.avatar_url && !props.orderAvatarPreview?.includes(props.user.avatar_url)) {
      const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
      const userAvatarUrl = props.user.avatar_url;
      let fallbackAvatarUrl;
      if (userAvatarUrl.startsWith("/storage/")) {
        fallbackAvatarUrl = backendUrl + userAvatarUrl;
      } else if (userAvatarUrl.startsWith("http://") || userAvatarUrl.startsWith("https://")) {
        fallbackAvatarUrl = userAvatarUrl;
      } else {
        fallbackAvatarUrl = backendUrl + "/" + userAvatarUrl.replace(/^\//, "");
      }
      // ✅ OPTIMISATION CACHE: Ne pas ajouter de timestamp - le navigateur utilisera ETag/Last-Modified
      // Essayer une seule fois avec l'avatar utilisateur
      if (!avatarLoadError.value) {
        emit("update:avatar", fallbackAvatarUrl);
      } else {
        // Si ça échoue aussi, marquer l'erreur
        avatarLoadError.value = true;
      }
    } else {
      // Marquer l'erreur pour afficher l'icône par défaut
      avatarLoadError.value = true;
    }
  };

  const handleAvatarImageLoad = () => {
    avatarLoadError.value = false;
  };
</script>

<style scoped>
  .input-field {
    @apply mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out;
  }

  input[type="color"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 0.375rem;
  }
  input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: 0.375rem;
  }
</style>
