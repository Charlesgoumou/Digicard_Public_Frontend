<template>
  <div class="min-h-screen bg-slate-900 pt-20 sm:pt-32 text-white overflow-x-hidden">
    <!-- Bouton Retour -->
    <div class="container mx-auto px-4 py-12 max-w-full overflow-x-hidden">
      <div class="max-w-3xl mx-auto mb-6">
        <button
          @click="goToDashboard"
          type="button"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg
            class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">Retour au Dashboard</span>
        </button>
      </div>

      <h1 class="text-3xl sm:text-4xl font-bold text-center mb-8">Paramétrer votre Carte</h1>

      <!-- Sélection de commande (affichée en premier si aucune commande n'est sélectionnée) -->
      <div v-if="showOrderSelection">
        <!-- Indicateur de chargement -->
        <LoadingSpinner v-if="isLoading" :is-loading="isLoading" />
        <div v-else-if="loadingError" class="text-center text-red-400 py-10">{{ loadingError }}</div>

        <!-- Aucune commande -->
        <div
          v-else-if="orders.filter((o) => o.status !== 'cancelled').length === 0"
          class="max-w-2xl mx-auto"
        >
          <div class="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <!-- Message pour les employés -->
            <div v-if="user && user.role === 'employee'">
              <h2 class="text-xl font-semibold text-slate-300 mb-2">Aucune carte assignée</h2>
              <p class="text-slate-400 mb-4">
                Votre administrateur n'a pas encore créé de commande incluant votre carte.
              </p>
              <p class="text-sm text-slate-500">
                Contactez votre administrateur pour qu'il crée une commande et vous assigne des cartes.
              </p>
            </div>
            <!-- Message pour les autres utilisateurs -->
            <div v-else>
              <h2 class="text-xl font-semibold text-slate-300 mb-2">Aucune commande</h2>
              <p class="text-slate-400 mb-6">
                Vous devez d'abord commander des cartes avant de pouvoir les paramétrer.
              </p>
              <button
                @click="openOrderModal"
                class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Commander Ma Carte
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des commandes à sélectionner -->
        <div
          v-else
          class="max-w-4xl mx-auto"
        >
          <p class="text-slate-400 text-center mb-8">Sélectionnez la commande que vous souhaitez paramétrer</p>
          <div class="grid grid-cols-1 gap-6">
            <!-- Filtrer les commandes annulées -->
            <button
              v-for="order in orders.filter((o) => o.status !== 'cancelled')"
              :key="order.id"
              @click="selectOrder(order.id)"
              class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 hover:border-sky-500 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20 text-left group w-full"
            >
              <div class="flex items-start gap-3 sm:gap-4">
                <!-- Avatar de la commande -->
                <div class="flex-shrink-0">
                  <div
                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 bg-slate-700 flex items-center justify-center overflow-hidden"
                    :style="{ borderColor: order.profile_border_color || '#facc15' }"
                  >
                    <img
                      v-if="order.order_avatar_url"
                      :src="getAvatarUrl(order.order_avatar_url)"
                      class="w-full h-full object-cover"
                      alt="Avatar"
                    />
                    <svg v-else class="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Informations de la commande -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-3 gap-2">
                    <div class="flex-1 min-w-0">
                      <p class="text-xs sm:text-sm text-slate-400 truncate">Commande #{{ order.order_number }}</p>
                      <h3
                        class="text-lg sm:text-xl font-bold text-white group-hover:text-sky-400 transition-colors truncate"
                      >
                        {{ order.profile_name || user.name }}
                      </h3>
                      <p
                        v-if="order.profile_title"
                        class="text-xs sm:text-sm mt-1 truncate"
                        :style="{ color: order.profile_border_color || '#facc15' }"
                      >
                        {{ order.profile_title }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end gap-2 flex-shrink-0">
                      <span
                        class="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        :class="
                          order.order_type === 'business'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        "
                      >
                        {{ order.order_type === "business" ? "🏢 Entreprise" : "👤 Personnel" }}
                      </span>
                      <span
                        v-if="order.is_configured"
                        class="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-green-500/20 text-green-400 border border-green-500/30"
                      >
                        ✓ Configurée
                      </span>
                      <span
                        v-else
                        class="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      >
                        ⚠ Non paramétrée
                      </span>
                    </div>
                  </div>

                  <div
                    class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400"
                  >
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      <span class="whitespace-nowrap">
                        {{ getCardQuantity(order) }} carte{{ getCardQuantity(order) > 1 ? "s" : "" }}
                      </span>
                    </div>
                    <!-- Masquer le prix si c'est un business admin inclus dans une commande entreprise OU un employé -->
                    <div
                      v-if="!isBusinessAdminInOrder(order) && user?.role !== 'employee'"
                      class="flex items-center gap-1"
                    >
                      <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="truncate">{{ new Intl.NumberFormat("fr-FR").format(order.total_price) }} GNF</span>
                    </div>
                  </div>
                </div>

                <!-- Icône de navigation -->
                <div class="hidden sm:flex flex-shrink-0 self-center">
                  <svg
                    class="w-6 h-6 text-slate-600 group-hover:text-sky-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Contenu après sélection d'une commande -->
      <div v-else-if="selectedOrderId && !showOrderSelection">
        <!-- Sélecteur de commande (affiché en haut si une commande est déjà sélectionnée) -->
        <div v-if="orders.length > 1" class="max-w-4xl mx-auto mb-6">
          <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-sm text-slate-400">Commande sélectionnée:</span>
                <span class="text-white font-semibold"> #{{ getSelectedOrder()?.order_number || "Chargement..." }} </span>
              </div>
              <button
                @click="
                  showOrderSelection = true;
                  selectedOrderId = null;
                "
                class="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
              >
                🔄 Changer de commande
              </button>
            </div>
          </div>
        </div>

        <!-- Onglets pour business admin -->
        <div v-if="user && user.role === 'business_admin'" class="max-w-md mx-auto mb-8">
          <div class="flex gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
            <button
              @click="activeTab = 'card'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors',
                activeTab === 'card' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white',
              ]"
            >
              ⚙️ Ma Carte
            </button>
            <button
              @click="activeTab = 'services'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors',
                activeTab === 'services' ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white',
              ]"
            >
              🏢 Nos Services
            </button>
          </div>
        </div>

        <!-- Onglets pour particuliers -->
        <div v-if="user && user.role === 'individual'" class="max-w-md mx-auto mb-8">
          <div class="flex gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
            <button
              @click="activeTab = 'card'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors',
                activeTab === 'card' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white',
              ]"
            >
              ⚙️ Ma Carte
            </button>
            <button
              @click="activeTab = 'profile'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-semibold transition-colors',
                activeTab === 'profile' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white',
              ]"
            >
              👤 Mon Profil
            </button>
          </div>
        </div>

        <!-- Contenu de l'onglet "Nos Services" pour business admin -->
        <div v-if="user && user.role === 'business_admin' && activeTab === 'services'" class="max-w-4xl mx-auto">
          <CompanyServicesForm :order-id="selectedOrderId" />
        </div>

        <!-- Contenu de l'onglet "Mon Profil" pour particuliers -->
        <div v-if="user && user.role === 'individual' && activeTab === 'profile'" class="max-w-4xl mx-auto">
          <UserPortfolioForm />
        </div>

        <!-- Contenu de l'onglet "Ma Carte" (par défaut) -->
        <div v-if="activeTab === 'card'">
          <!-- Indicateur de chargement circulaire pour le chargement initial -->
          <LoadingSpinner v-if="isLoading" :is-loading="isLoading" />
          <div v-else-if="loadingError" class="text-center text-red-400 py-10">{{ loadingError }}</div>

          <!-- Formulaire de paramétrage -->
          <form
          v-else
          @submit.prevent="handleSaveSettings"
          class="relative max-w-3xl mx-auto space-y-10 pb-20 overflow-x-hidden"
        >
          <!-- Indicateur de chargement circulaire pendant la sauvegarde -->
          <div
            v-if="isSaving"
            class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          >
            <!-- Spinner de chargement ou icône de succès -->
            <div
              v-if="!showSuccessIcon"
              class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"
            ></div>
            <svg v-else class="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="mt-4 text-white font-medium">{{ savingMessage }}</p>
          </div>

          <!-- Indicateur de chargement pour les données de commande -->
          <div
            v-if="isLoadingOrderData"
            class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          >
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            <p class="mt-4 text-white font-medium">Chargement des données...</p>
          </div>

          <!-- ========== SECTION 1 : PROFIL PUBLIC & PERSONNALISATION ========== -->
          <fieldset class="border border-slate-700 rounded-lg px-3 sm:px-6 pt-8 pb-6 space-y-5 relative mt-5">
            <legend class="text-lg font-semibold text-sky-400 px-2 absolute -top-3 left-4 bg-slate-900">
              Profil Public & Personnalisation
            </legend>
            <ProfileSettingsForm
              :form="form"
              :username="user.username"
              :month-names="monthNames"
              :selected-order-id="selectedOrderId"
              :user="user"
              :order-avatar-preview="orderAvatarPreview"
              @add-phone="addPhone"
              @remove-phone="removePhone"
              @add-email="addEmail"
              @remove-email="removeEmail"
              @update:avatar="orderAvatarPreview = $event"
              @reload-order-data="handleReloadOrderData"
            />
          </fieldset>

          <!-- ========== SECTION 2 : RÉSEAUX SOCIAUX & LIENS ========== -->
          <fieldset class="border border-slate-700 rounded-lg px-3 sm:px-6 pt-8 pb-6 space-y-4 relative">
            <legend class="text-lg font-semibold text-sky-400 px-2 absolute -top-3 left-4 bg-slate-900">
              Réseaux Sociaux & Liens
            </legend>
            <SocialLinksForm :form="form" />
          </fieldset>

          <!-- ========== SECTION 3 : Choix du design de la carte ========== -->
          <fieldset class="border border-slate-700 rounded-lg px-3 sm:px-6 pt-8 pb-6 space-y-4 relative">
            <legend class="text-lg font-semibold text-sky-400 px-2 absolute -top-3 left-4 bg-slate-900">
              Choix du design de la carte
            </legend>
            <CardDesignSelector
              :form="form"
              :selected-design-type="selectedDesignType"
              :selected-design-number="selectedDesignNumber"
              :no-design-yet="noDesignYet"
              :custom-design-preview="customDesignPreview"
              :selected-order-id="selectedOrderId"
              :is-order-validated="isOrderValidated"
              :is-design-locked-by-admin="isDesignLockedByAdmin"
              @update:form="updateForm($event)"
              @update:selected-design-type="selectedDesignType = $event"
              @update:selected-design-number="selectedDesignNumber = $event"
              @update:no-design-yet="noDesignYet = $event"
              @update:custom-design-preview="customDesignPreview = $event"
              @update:save-error="saveError = $event"
              @update:save-success="saveSuccess = $event"
            />
          </fieldset>

          <!-- ========== BOUTON SAUVEGARDER ========== -->
          <div class="pt-4 sticky bottom-4">
            <button
              type="submit"
              :disabled="isSaving"
              class="w-full bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-sky-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              <svg
                v-if="isSaving"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isSaving ? "Sauvegarde..." : (user && user.role === 'individual' ? "Enregistrer" : "Enregistrer et quitter") }}
            </button>
            <p v-if="saveError" class="text-sm text-red-400 text-center mt-3 h-5">{{ saveError }}</p>
            <p v-if="saveSuccess" class="text-sm text-green-400 text-center mt-3 h-5">{{ saveSuccess }}</p>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import { useOrderModal } from "@/composables/useOrderModal";
  import { useCardSettings } from "@/composables/useCardSettings";
  import { useOrderManagement } from "@/composables/useOrderManagement";
  import CompanyServicesForm from "@/components/CompanyServicesForm.vue";
  import UserPortfolioForm from "@/components/UserPortfolioForm.vue";
  import ProfileSettingsForm from "@/components/Settings/ProfileSettingsForm.vue";
  import SocialLinksForm from "@/components/Settings/SocialLinksForm.vue";
  import CardDesignSelector from "@/components/Settings/CardDesignSelector.vue";
  import LoadingSpinner from "@/components/layout/LoadingSpinner.vue";

  // ========== GESTION DES ONGLETS ==========
  const activeTab = ref("card");

  // ========== ROUTER ET AUTH ==========
  const router = useRouter();
  const { user, updateUserLocally } = useAuth();
  const { openOrderModal } = useOrderModal();

  // ========== NOUVELLE GESTION DES COMMANDES (propre) ==========
  const {
    orders,
    selectedOrderId,
    showOrderSelection,
    isLoading,
    loadingError,
    getAvatarUrl,
    selectOrder,
    getSelectedOrder,
    getCardQuantity,
    isBusinessAdminInOrder,
  } = useOrderManagement(user);

  // ========== GESTION DE L'AVATAR DE COMMANDE ==========
  const orderAvatarPreview = ref(null);

  // ========== GESTION DU DESIGN (pour CardDesignSelector) ==========
  const customDesignPreview = ref(null);
  const selectedDesignType = ref(null);
  const selectedDesignNumber = ref(null);
  const noDesignYet = ref(false);

  // ========== FONCTIONS UTILITAIRES ==========
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  // ========== COMPOSABLE useCardSettings ==========
  const {
    form,
    isSaving,
    saveSuccess,
    saveError,
    savingMessage,
    showSuccessIcon,
    isLoadingOrderData,
    loadedOrderData,
    addPhone,
    removePhone,
    addEmail,
    removeEmail,
    handleSaveSettings: handleSaveSettingsWrapper,
    loadOrderData,
  } = useCardSettings(
    selectedOrderId,
    user,
    updateUserLocally,
    (url) => (orderAvatarPreview.value = url),
    ({ selectedDesignType: type, selectedDesignNumber: number, noDesignYet: noDesign }) => {
      selectedDesignType.value = type;
      selectedDesignNumber.value = number;
      noDesignYet.value = noDesign;
    },
    (url) => (customDesignPreview.value = url),
    getAvatarUrl,
    () => (isLoading.value = false),
  );

  // ✅ CORRECTION : Fonction pour recharger les données de la commande après un upload d'avatar
  const handleReloadOrderData = async () => {
    if (!selectedOrderId.value) return;
    
    try {
      console.log("SettingsView: Reloading order data after avatar upload...");
      await loadOrderData(selectedOrderId.value);
      console.log("SettingsView: Order data reloaded successfully after avatar upload");
    } catch (error) {
      console.error("SettingsView: Error reloading order data after avatar upload", error);
      // Ne pas afficher d'erreur à l'utilisateur, car l'avatar a déjà été mis à jour visuellement
    }
  };

  // 'isLoading' de useOrderManagement contrôle le spinner.
  // 'isLoadingOrderData' de useCardSettings contrôle le spinner.
  // Nous devons informer useCardSettings quand le chargement initial est terminé.
  onMounted(async () => {
    if (selectedOrderId.value) {
      try {
        await loadOrderData(selectedOrderId.value);
        console.log("SettingsView: Order data loaded after mount");
      } catch (error) {
        console.error("SettingsView: Error loading order data on mount", error);
      } finally {
        isLoading.value = false;
      }
    }
  });

  // Réinitialiser l'onglet actif à "Ma Carte" quand on change de commande
  watch(
    () => selectedOrderId.value,
    (newOrderId, oldOrderId) => {
      if (newOrderId && newOrderId !== oldOrderId) {
        activeTab.value = "card";
      }
    }
  );

  // Fonction pour mettre à jour le form de manière réactive
  const updateForm = (newFormData) => {
    console.log("SettingsView: updateForm called with", newFormData);
    Object.assign(form, newFormData);
    console.log("SettingsView: form updated", {
      card_design_type: form.card_design_type,
      card_design_number: form.card_design_number,
      card_design_custom_url: form.card_design_custom_url,
      no_design_yet: form.no_design_yet,
    });
  };

  // Vérifier si la commande sélectionnée est validée
  const isOrderValidated = computed(() => {
    if (!selectedOrderId.value) return false;
    const selectedOrder = getSelectedOrder();
    return selectedOrder?.status === "validated";
  });

  // Vérifier si le design est verrouillé par le business admin (pour les employés)
  // Utiliser loadedOrderData (chargé via /api/orders/{id}) en priorité, sinon getSelectedOrder() (chargé via /api/orders)
  const isDesignLockedByAdmin = computed(() => {
    if (!selectedOrderId.value || !user.value) {
      console.log("SettingsView: isDesignLockedByAdmin - no orderId or user", {
        selectedOrderId: selectedOrderId.value,
        hasUser: !!user.value,
      });
      return false;
    }
    
    // Utiliser loadedOrderData en priorité (données chargées via /api/orders/{id} avec toutes les infos)
    // Sinon utiliser getSelectedOrder() (données chargées via /api/orders)
    const selectedOrder = loadedOrderData.value || getSelectedOrder();
    
    console.log("SettingsView: isDesignLockedByAdmin - checking", {
      userRole: user.value.role,
      hasLoadedOrderData: !!loadedOrderData.value,
      hasSelectedOrder: !!getSelectedOrder(),
      orderId: selectedOrder?.id,
      orderType: selectedOrder?.order_type,
      hasEmployeeProfile: !!selectedOrder?.employee_profile,
      is_design_locked_by_admin: selectedOrder?.employee_profile?.is_design_locked_by_admin,
      employeeProfile: selectedOrder?.employee_profile,
    });
    
    // Vérifier si l'utilisateur est un employé et si le design est verrouillé par le business admin
    if (user.value.role === "employee" && selectedOrder?.employee_profile?.is_design_locked_by_admin) {
      console.log("SettingsView: isDesignLockedByAdmin - LOCKED");
      return true;
    }
    
    console.log("SettingsView: isDesignLockedByAdmin - NOT LOCKED");
    return false;
  });

  // Wrapper pour handleSaveSettings
  const handleSaveSettings = async () => {
    // Passer selectedDesignType et selectedDesignNumber pour s'assurer que les valeurs sont à jour
    await handleSaveSettingsWrapper(
      () => noDesignYet.value,
      selectedDesignType.value,
      selectedDesignNumber.value
    );
    
    // Après la sauvegarde de "Ma Carte", basculer vers l'onglet "Nos Services" pour les business_admin
    // pour qu'ils puissent paramétrer la section "Nos Services"
    if (user.value && user.value.role === 'business_admin') {
      // Attendre un peu pour que le message de succès s'affiche
      setTimeout(() => {
        activeTab.value = 'services';
        // Faire défiler vers le haut de la page pour voir les onglets
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    } else if (user.value && user.value.role === 'individual') {
      // Pour les particuliers, après la sauvegarde de "Ma Carte", basculer vers l'onglet "Mon Profil"
      setTimeout(() => {
        activeTab.value = 'profile';
        // Faire défiler vers le haut de la page pour voir les onglets
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  };

  // ========== GESTION DES COMMANDES (Simplifié) ==========
  const goToDashboard = () => {
    router.push({ name: "Dashboard" });
  };
</script>

<style scoped>
  /* Classe Input Field */
  .input-field {
    @apply mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out;
  }
  textarea.input-field {
    min-height: 80px;
  }

  /* Bouton sticky */
  .sticky {
    position: sticky;
    bottom: 1rem;
    z-index: 10;
  }

  /* Styles pour fieldset et legend (utilisés par les composants enfants) */
  fieldset {
    padding-top: 1rem;
    position: relative;
  }

  legend {
    position: absolute;
    top: 0;
    left: 1rem;
    transform: translateY(-50%);
    background-color: #0f172a; /* bg-slate-900 */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
  }
</style>
