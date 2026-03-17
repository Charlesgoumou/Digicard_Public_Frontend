<template>
  <div
    :class="[
      'min-h-screen bg-slate-900 text-white',
      route?.meta?.hideNavbar ? 'pt-6 sm:pt-8' : 'pt-20 sm:pt-32',
    ]"
  >
    <div :class="['container mx-auto px-4', route?.meta?.hideNavbar ? 'py-6 sm:py-8' : 'py-12']">
      <div class="max-w-6xl mx-auto mb-6 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-2xl sm:text-3xl font-bold">Choisir un profil</h1>
          <p class="text-slate-400 text-sm">Sélectionnez le profil public que vous souhaitez ouvrir.</p>
        </div>
        <button
          @click="goToDashboard"
          type="button"
          class="bg-slate-800 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          Retour
        </button>
      </div>

      <!-- Skeleton Screen pour la liste des profils -->
      <div v-if="isLoading" class="max-w-4xl mx-auto">
        <div class="h-5 w-80 bg-slate-700 rounded mx-auto mb-8 animate-pulse"></div>
        <div class="grid grid-cols-1 gap-6">
          <!-- Skeleton Card 1 -->
          <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 animate-pulse">
            <div class="flex items-start gap-3 sm:gap-4">
              <!-- Skeleton Avatar -->
              <div class="flex-shrink-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 border-4 border-slate-600"></div>
              </div>
              <!-- Skeleton Informations -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3 gap-2">
                  <div class="flex-1 min-w-0 space-y-2">
                    <div class="h-3 w-24 bg-slate-700 rounded"></div>
                    <div class="h-5 w-40 bg-slate-700 rounded"></div>
                    <div class="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="h-6 w-20 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div class="h-4 w-24 bg-slate-700 rounded"></div>
                  <div class="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              </div>
              <!-- Skeleton Icône -->
              <div class="hidden sm:flex flex-shrink-0 self-center">
                <div class="w-6 h-6 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
          <!-- Skeleton Card 2 -->
          <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 animate-pulse">
            <div class="flex items-start gap-3 sm:gap-4">
              <!-- Skeleton Avatar -->
              <div class="flex-shrink-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 border-4 border-slate-600"></div>
              </div>
              <!-- Skeleton Informations -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3 gap-2">
                  <div class="flex-1 min-w-0 space-y-2">
                    <div class="h-3 w-24 bg-slate-700 rounded"></div>
                    <div class="h-5 w-40 bg-slate-700 rounded"></div>
                    <div class="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="h-6 w-20 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div class="h-4 w-24 bg-slate-700 rounded"></div>
                  <div class="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              </div>
              <!-- Skeleton Icône -->
              <div class="hidden sm:flex flex-shrink-0 self-center">
                <div class="w-6 h-6 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
          <!-- Skeleton Card 3 -->
          <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 animate-pulse">
            <div class="flex items-start gap-3 sm:gap-4">
              <!-- Skeleton Avatar -->
              <div class="flex-shrink-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 border-4 border-slate-600"></div>
              </div>
              <!-- Skeleton Informations -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3 gap-2">
                  <div class="flex-1 min-w-0 space-y-2">
                    <div class="h-3 w-24 bg-slate-700 rounded"></div>
                    <div class="h-5 w-40 bg-slate-700 rounded"></div>
                    <div class="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="h-6 w-20 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div class="h-4 w-24 bg-slate-700 rounded"></div>
                  <div class="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              </div>
              <!-- Skeleton Icône -->
              <div class="hidden sm:flex flex-shrink-0 self-center">
                <div class="w-6 h-6 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
          <!-- Skeleton Card 4 -->
          <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 animate-pulse">
            <div class="flex items-start gap-3 sm:gap-4">
              <!-- Skeleton Avatar -->
              <div class="flex-shrink-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 border-4 border-slate-600"></div>
              </div>
              <!-- Skeleton Informations -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3 gap-2">
                  <div class="flex-1 min-w-0 space-y-2">
                    <div class="h-3 w-24 bg-slate-700 rounded"></div>
                    <div class="h-5 w-40 bg-slate-700 rounded"></div>
                    <div class="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="h-6 w-20 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div class="h-4 w-24 bg-slate-700 rounded"></div>
                  <div class="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              </div>
              <!-- Skeleton Icône -->
              <div class="hidden sm:flex flex-shrink-0 self-center">
                <div class="w-6 h-6 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="loadingError" class="text-center text-red-400 py-10">
        <p>{{ loadingError }}</p>
      </div>

      <!-- Aucune commande configurée -->
      <div v-else-if="configuredOrders.length === 0" class="max-w-2xl mx-auto">
        <div class="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
          <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 class="text-xl font-semibold text-slate-300 mb-2">Aucun profil configuré</h2>
          <p class="text-slate-400 mb-6">
            Vous devez d'abord paramétrer au moins une commande pour afficher votre profil.
          </p>
          <button
            @click="goToSettings"
            class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Paramétrer ma carte
          </button>
        </div>
      </div>

      <!-- Liste des profils/commandes -->
      <div v-else class="max-w-4xl mx-auto">
        <p class="text-slate-400 text-center mb-8">
          Sélectionnez la commande dont vous souhaitez afficher le profil public
        </p>
        <div class="grid grid-cols-1 gap-6">
          <button
            v-for="order in configuredOrders"
            :key="order.id"
            @click="viewProfile(order)"
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
                    v-if="order.order_avatar_url && !avatarLoadError[order.id]"
                    :src="getAvatarUrl(order.order_avatar_url)"
                    :data-order-id="order.id"
                    class="w-full h-full object-cover"
                    alt="Avatar"
                    @error="handleAvatarError"
                    @load="handleAvatarLoad"
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
                    <!-- Badge pour indiquer si c'est un employé -->
                    <span
                      v-if="order.is_employee_order"
                      class="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-green-500/20 text-green-400 border border-green-500/30"
                    >
                      👤 Employé
                    </span>
                    <!-- Badge pour le type de commande -->
                    <span
                      v-else
                      class="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                      :class="
                        order.order_type === 'business' && order.employee_card_quantity !== undefined
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : order.order_type === 'business'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      "
                    >
                      {{
                        order.order_type === "business" && order.employee_card_quantity !== undefined
                          ? "💼 Ma Carte Pro"
                          : order.order_type === "business"
                            ? "🏢 Entreprise"
                            : "👤 Personnel"
                      }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
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
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="truncate">Configurée le {{ formatDate(order.updated_at) }}</span>
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
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import apiClient from "@/api";
  import LoadingSpinner from "@/components/layout/LoadingSpinner.vue";

  const router = useRouter();
  const route = useRoute();
  const { user } = useAuth();

  const orders = ref([]);
  const isLoading = ref(true);
  const loadingError = ref("");

  // ✅ CORRECTION : Gérer les erreurs de chargement d'avatar
  const avatarLoadError = ref({});

  const handleAvatarError = (event) => {
    const orderId = event.target.dataset.orderId;
    if (orderId) {
      avatarLoadError.value[orderId] = true;
      console.error("Erreur de chargement de l'avatar pour la commande:", orderId, event.target.src);
    }
    event.target.style.display = "none";
  };

  const handleAvatarLoad = (event) => {
    const orderId = event.target.dataset.orderId;
    if (orderId) {
      avatarLoadError.value[orderId] = false;
    }
  };

  // Filtrer uniquement les commandes configurées
  const configuredOrders = computed(() => {
    return orders.value.filter((order) => {
      // Pour les employés, vérifier employee_is_configured
      if (user.value?.role === "employee") {
        return order.employee_is_configured === true || order.is_configured === true;
      }
      // Pour les business admin
      if (user.value?.role === "business_admin") {
        // ✅ NOUVEAU: Exclure les commandes d'employés (ne montrer que le profil du business admin)
        // Les profils des employés sont déjà visibles dans le Tableau de bord
        if (order.is_employee_order) {
          return false; // ✅ Ne pas afficher les profils d'employés
        }
        // ✅ CORRECTION : Pour les business admin inclus dans une commande business,
        // vérifier employee_is_configured (retourné par le backend quand l'admin est inclus)
        // Le backend retourne employee_card_quantity et employee_is_configured pour les commandes où l'admin est inclus
        const isAdminIncluded = "employee_card_quantity" in order || "employee_is_configured" in order;
        if (isAdminIncluded) {
          // Si l'admin est inclus dans la commande, vérifier employee_is_configured
          return order.employee_is_configured === true || order.is_configured === true;
        }
        // Pour les commandes personnelles ou commandes business où l'admin n'est pas inclus,
        // vérifier is_configured
        return order.is_configured === true;
      }
      // Pour les autres, vérifier is_configured
      return order.is_configured === true;
    });
  });

  // Retour au dashboard
  const goToDashboard = () => {
    router.push({ name: "Dashboard" });
  };

  // Aller aux paramètres
  const goToSettings = () => {
    router.push({ name: "Settings" });
  };

  // ✅ CORRECTION : Construire l'URL complète pour l'avatar (gérer /api/storage/ et /storage/)
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

    // Si c'est déjà une URL complète (http:// ou https://), l'utiliser directement
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
      return avatarUrl;
    }

    // Si c'est un chemin relatif (commence par /api/storage/ ou /storage/), ajouter le backend URL
    if (avatarUrl.startsWith("/api/storage/") || avatarUrl.startsWith("/storage/")) {
      return backendUrl + avatarUrl;
    }

    // Sinon, c'est probablement un chemin relatif, ajouter le backend URL
    return backendUrl + "/" + avatarUrl.replace(/^\//, "");
  };

  // Obtenir le nombre de cartes (spécifique à l'employé ou business admin inclus)
  const getCardQuantity = (order) => {
    // Si c'est une commande d'employé (affichée par le business admin), utiliser employee_card_quantity
    if (order.is_employee_order && order.employee_card_quantity !== undefined) {
      return order.employee_card_quantity;
    }
    // Si l'utilisateur est un employé OU un business_admin inclus et que employee_card_quantity existe, l'utiliser
    if (
      (user.value?.role === "employee" || user.value?.role === "business_admin") &&
      order.employee_card_quantity !== undefined
    ) {
      return order.employee_card_quantity;
    }
    // Sinon, utiliser card_quantity (pour commandes personnelles)
    return order.card_quantity || 0;
  };

  // Fonction utilitaire pour obtenir le token d'accès d'une commande
  const getOrderAccessToken = (order) => {
    if (!order) return null;

    // Chercher le token dans différentes propriétés possibles
    if (order.access_token) return order.access_token;
    if (order.profile_token) return order.profile_token;
    if (order.public_token) return order.public_token;
    if (order.token) return order.token;

    return null;
  };

  const getOrderShortCode = (order) => {
    if (!order) return null;
    if (order.short_code) return order.short_code;
    if (order.shortCode) return order.shortCode;
    return null;
  };

  // Afficher le profil d'une commande (business, employés, particuliers : même nomenclature /p/{code})
  const viewProfile = (order) => {
    // Username : employee_username (commande d'employé), profile_username, employee_profile?.username, ou user.value?.username
    const username =
      order.employee_username || order.profile_username || order.employee_profile?.username || user.value?.username;

    if (username) {
      const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

      // ✅ Préférer l'URL courte /p/{short_code} pour tous les types de comptes (employés inclus)
      const shortCode = getOrderShortCode(order);
      if (shortCode) {
        const profileUrl = `${backendUrl}/p/${shortCode}`;
        window.open(profileUrl, "_blank");
        return;
      }

      // Essayer d'obtenir le token d'accès (sécurisé)
      const accessToken = getOrderAccessToken(order);
      const orderId = order.original_order_id || order.id;

      let profileUrl;
      if (accessToken) {
        // Utiliser le token sécurisé
        profileUrl = `${backendUrl}/profil/${username}?token=${accessToken}`;
      } else if (orderId) {
        // Fallback pour les anciennes commandes sans token (comportement attendu)
        // Les anciennes commandes utilisent ?order= jusqu'à ce que le backend génère un token
        profileUrl = `${backendUrl}/profil/${username}?order=${orderId}`;
      } else {
        // Si pas de token ni d'orderId, retourner juste le profil sans paramètre
        profileUrl = `${backendUrl}/profil/${username}`;
      }

      window.open(profileUrl, "_blank");
    } else {
      console.error("ProfileSelectionView: Username non trouvé pour la commande", order);
      alert("Impossible d'afficher le profil : username non trouvé.");
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Charger les commandes
  const loadOrders = async () => {
    isLoading.value = true;
    loadingError.value = "";

    try {
      // Charger les commandes de l'utilisateur
      let response;
      try {
        response = await apiClient.get("/api/orders");
      } catch (err) {
        const status = err?.response?.status;
        // 401/419 arrivent parfois juste après une configuration/paiement → refresh CSRF puis retry
        if (status === 401 || status === 419) {
          await apiClient.get("/sanctum/csrf-cookie");
          response = await apiClient.get("/api/orders");
        } else {
          throw err;
        }
      }
      let allOrders = Array.isArray(response.data) ? response.data : [];

      // ✅ DEBUG : Logger les commandes pour vérifier les données
      console.log("ProfileSelectionView - Commandes chargées:", allOrders);
      console.log("ProfileSelectionView - User:", user.value);
      if (allOrders.length > 0) {
        console.log("ProfileSelectionView - Première commande:", {
          id: allOrders[0].id,
          order_number: allOrders[0].order_number,
          profile_name: allOrders[0].profile_name,
          profile_title: allOrders[0].profile_title,
          order_avatar_url: allOrders[0].order_avatar_url,
          profile_border_color: allOrders[0].profile_border_color,
          is_configured: allOrders[0].is_configured,
          employee_is_configured: allOrders[0].employee_is_configured,
        });
      }

      // Si c'est un business admin, charger aussi les commandes de ses employés
      if (user.value?.role === "business_admin") {
        try {
          // Récupérer la liste des employés
          const employeesResponse = await apiClient.get("/api/employees");
          const employees = employeesResponse.data;

          // Filtrer les commandes business du business admin
          const businessOrders = allOrders.filter((order) => order.order_type === "business");

          // Créer un Set pour suivre les employés déjà ajoutés (éviter les doublons)
          const addedEmployees = new Set();

          // Pour chaque employé, vérifier s'il a des commandes configurées
          for (const employee of employees) {
            for (const order of businessOrders) {
              if (order.order_employees && Array.isArray(order.order_employees)) {
                const employeeOrder = order.order_employees.find(
                  (oe) => oe.employee_id === employee.id && oe.is_configured,
                );

                if (employeeOrder && !addedEmployees.has(employee.id)) {
                  // Marquer cet employé comme ajouté
                  addedEmployees.add(employee.id);

                  // Créer une entrée pour cette commande d'employé
                  // UTILISER LES DONNÉES DE PROFIL INDIVIDUELLES DEPUIS order_employees
                  allOrders.push({
                    ...order,
                    // Utiliser un ID unique pour éviter les conflits
                    id: `employee-${employee.id}-order-${order.id}`,
                    original_order_id: order.id,
                    // Marquer comme commande d'employé
                    is_employee_order: true,
                    employee_id: employee.id,
                    employee_name: employee.name,
                    employee_username: employee.username || `employee-${employee.id}`,
                    employee_card_quantity: employeeOrder.card_quantity,
                    employee_is_configured: employeeOrder.is_configured,
                    // IMPORTANT : Utiliser les données de profil individuelles de l'employé
                    profile_name: employeeOrder.profile_name || employee.name,
                    profile_title: employeeOrder.profile_title,
                    profile_border_color: employeeOrder.profile_border_color || "#facc15",
                    order_avatar_url: employeeOrder.employee_avatar_url, // Avatar unique de l'employé
                  });

                  // Sortir de la boucle des commandes pour cet employé
                  break;
                }
              }
            }
          }

          // Filtrer pour ne garder que les profils pertinents
          // Dans "Afficher mon Profil", le business admin voit :
          // - Ses commandes personnelles/individuelles (s'il en a)
          // - Sa propre carte s'il s'est inclus dans une commande business (identifiable par employee_card_quantity)
          // - Les profils de ses employés configurés
          // MAIS PAS les commandes business non configurées par lui
          allOrders = allOrders.filter((order) => {
            // Garder les commandes d'employés
            if (order.is_employee_order) return true;
            // ✅ CORRECTION : Garder les commandes personnelles ET individuelles
            if (order.order_type === "personal" || order.order_type === "individual") return true;
            // ✅ CORRECTION : Garder les commandes business où le business admin s'est inclus
            // (identifiable par la présence de employee_card_quantity - retourné par l'API)
            if (order.order_type === "business" && order.employee_card_quantity !== undefined) {
              return true;
            }
            // NE PAS afficher les autres commandes business
            if (order.order_type === "business") {
              return false;
            }
            return true;
          });
        } catch (error) {
          console.error("Erreur lors du chargement des employés:", error);
        }
      }

      orders.value = allOrders;

      // 🔍 DEBUG : Afficher les données des commandes pour vérifier
      console.log("📊 Commandes chargées:", allOrders);
      console.log("👤 Utilisateur:", user.value);
      console.log("✅ Commandes configurées (computed):", configuredOrders.value);

      // 🔍 DEBUG : Pour les business admin, vérifier les commandes business
      if (user.value?.role === "business_admin") {
        const businessOrdersWithAdmin = allOrders.filter(
          (order) =>
            order.order_type === "business" &&
            (order.employee_card_quantity !== undefined || order.employee_is_configured !== undefined),
        );
        console.log("💼 Commandes business avec admin inclus:", businessOrdersWithAdmin);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      loadingError.value = "Impossible de charger vos commandes. Veuillez réessayer.";
    } finally {
      isLoading.value = false;
    }
  };

  const onOrderConfigured = () => {
    loadOrders();
  };

  onMounted(() => {
    loadOrders();
    window.addEventListener("order-configured", onOrderConfigured);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("order-configured", onOrderConfigured);
  });
</script>
