<template>
  <div class="min-h-screen bg-slate-900 pt-8 sm:pt-16 text-white flex items-center justify-center px-4">
    <div class="relative max-w-md w-full p-8 bg-slate-800 rounded-xl border border-slate-700">
      <!-- Indicateur de chargement -->
      <div
        v-if="isLoading || isSubmitting"
        class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        <p class="mt-4 text-white font-medium">
          {{ isLoading ? 'Chargement...' : 'Connexion en cours...' }}
        </p>
      </div>

      <!-- Réutiliser la même interface que AuthModal.vue pour la sélection de compte -->
      <div>
        <h2 class="text-2xl font-bold text-white text-center mb-4">Choisissez votre compte</h2>
        <p class="text-slate-300 text-center mb-6">
          Vous avez plusieurs comptes avec cet email. Veuillez sélectionner le type de compte que vous souhaitez
          utiliser.
        </p>

        <!-- Message d'erreur -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300 text-sm"
        >
          {{ errorMessage }}
        </div>

        <div class="space-y-3">
          <button
            v-for="account in availableAccounts"
            :key="account.id"
            @click="selectAccountAndLogin(account.id)"
            :disabled="isSubmitting"
            class="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-sky-500 rounded-lg p-4 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <svg
                    v-if="account.type === 'business'"
                    class="w-6 h-6 text-sky-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <svg v-else class="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="text-white font-semibold">
                    {{ account.type === "business" ? "Compte Entreprise" : (account.type === "employee" || account.role === "employee" ? "Compte Employé" : "Compte Particulier") }}
                  </span>
                </div>
                <p class="text-slate-400 text-sm mt-1">{{ account.name }}</p>
                <p v-if="account.company_name" class="text-slate-500 text-xs mt-0.5">{{ account.company_name }}</p>
              </div>
              <svg
                class="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <p class="text-center text-sm text-slate-400 mt-6">
          <button
            type="button"
            @click="goToHome"
            class="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none"
          >
            ← Retour à l'accueil
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "../api.js";
import { useAuth } from "../composables/useAuth";
import Cookies from "js-cookie";

const router = useRouter();
const route = useRoute();
const { user, fetchUser, updateUserLocally } = useAuth();

// Réutiliser les mêmes noms de variables que AuthModal.vue pour la cohérence
const availableAccounts = ref([]);
const isSubmitting = ref(false);
const isLoading = ref(true);
const errorMessage = ref("");
const selectionToken = ref(null); // Token pour récupérer les données depuis le cache

// Fonction helper pour récupérer et définir le header CSRF
const setCsrfHeader = async () => {
  try {
    // Récupérer le cookie CSRF depuis Sanctum
    await apiClient.get("/sanctum/csrf-cookie");
    // Définir le header CSRF
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation du cookie CSRF:", error);
  }
};

// Charger les comptes disponibles depuis l'API Google OAuth
const loadPendingAccounts = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    // ✅ CORRECTION: Récupérer le token depuis l'URL si présent
    selectionToken.value = route.query.token || null;
    if (selectionToken.value) {
      console.log("Token de sélection trouvé dans l'URL:", selectionToken.value.substring(0, 10) + "...");
    }

    // Récupérer le cookie CSRF avant l'appel API
    await setCsrfHeader();

    // ✅ CORRECTION: Inclure le token dans la requête si disponible
    const params = selectionToken.value ? { token: selectionToken.value } : {};
    const response = await apiClient.get("/api/google/pending-accounts", { params });
    
    if (response.data && Array.isArray(response.data.accounts)) {
      // Le format est déjà correct (correspond à AuthModal.vue)
      availableAccounts.value = response.data.accounts;
      console.log("Comptes chargés:", availableAccounts.value);
      
      // Si aucun compte n'est disponible, afficher un message
      if (availableAccounts.value.length === 0) {
        errorMessage.value = response.data.message || "Aucun compte en attente de sélection.";
        // Si la session est expirée, rediriger vers l'accueil après 3 secondes
        setTimeout(() => {
          router.push({ name: "Home" });
        }, 3000);
      } 
      // ✅ NOUVEAU: Si un seul compte est disponible, lancer la connexion automatiquement
      else if (availableAccounts.value.length === 1) {
        console.log("Un seul compte détecté, connexion automatique...");
        // Afficher un message de chargement
        isLoading.value = true;
        // Lancer la connexion automatiquement après un court délai pour que l'UI se mette à jour
        setTimeout(() => {
          selectAccountAndLogin(availableAccounts.value[0].id);
        }, 300);
      }
    } else {
      errorMessage.value = "Aucun compte en attente de sélection.";
      setTimeout(() => {
        router.push({ name: "Home" });
      }, 3000);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des comptes:", error);
    
    if (error.response?.status === 404 || error.response?.status === 200) {
      // Session expirée ou aucun compte disponible, rediriger vers l'accueil
      errorMessage.value = error.response?.data?.message || "Session expirée. Veuillez vous reconnecter avec Google.";
      setTimeout(() => {
        router.push({ name: "Home" });
      }, 3000);
    } else {
      errorMessage.value = error.response?.data?.message || "Erreur lors du chargement des comptes.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Réutiliser le même nom de fonction que AuthModal.vue pour la cohérence
// Mais adapter pour appeler l'API Google OAuth au lieu de handleLogin
const selectAccountAndLogin = async (accountId) => {
  try {
    isSubmitting.value = true;
    errorMessage.value = "";

    console.log("Sélection du compte:", accountId, "Type:", typeof accountId);

    // Récupérer le cookie CSRF avant l'appel API (CRITIQUE pour éviter l'erreur 419)
    await setCsrfHeader();

    // S'assurer que account_id est un nombre entier
    const accountIdInt = parseInt(accountId, 10);
    if (isNaN(accountIdInt)) {
      errorMessage.value = "ID de compte invalide.";
      isSubmitting.value = false;
      return;
    }

    console.log("Envoi de la requête à /api/google/select-account avec account_id:", accountIdInt);
    
    // ✅ CORRECTION: Inclure le token dans la requête si disponible
    const payload = {
      account_id: accountIdInt,
    };
    if (selectionToken.value) {
      payload.token = selectionToken.value;
    }
    
    const response = await apiClient.post("/api/google/select-account", payload);
    
    console.log("Réponse reçue:", response.data);

    if (response.data && response.data.user) {
      console.log("[SelectAccount] User data received, updating local state...");
      
      // Mettre à jour l'utilisateur localement avec les données retournées
      if (updateUserLocally) {
        updateUserLocally({
          ...response.data.user,
          is_profile_complete: response.data.user.is_profile_complete ?? true
        });
        console.log("[SelectAccount] User updated locally");
      }
      
      // Attendre un peu pour que la session soit bien établie
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Réessayer fetchUser() plusieurs fois pour s'assurer que la session est accessible
      let userFound = false;
      const maxRetries = 5;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[SelectAccount] Fetching user attempt ${attempt}/${maxRetries}...`);
          await fetchUser();
          if (user.value) {
            console.log(`[SelectAccount] User found on attempt ${attempt}`);
            userFound = true;
            break;
          }
        } catch (fetchError) {
          console.error(`[SelectAccount] Fetch user attempt ${attempt} failed:`, fetchError);
        }
        
        if (!user.value && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Si l'utilisateur n'est toujours pas trouvé mais que la réponse indique un succès,
      // on considère que la session est établie (le backend a connecté l'utilisateur)
      if (!userFound && response.data.user) {
        console.warn("[SelectAccount] User not found via fetchUser, but backend confirmed login. Session should be established.");
      }

      // Rediriger selon le profil
      const redirectTo = response.data.redirect_to || "/dashboard";
      console.log(`[SelectAccount] Redirecting to: ${redirectTo}`);
      router.push(redirectTo);
    } else {
      errorMessage.value = "Erreur lors de la sélection du compte.";
    }
  } catch (error) {
    console.error("Erreur lors de la sélection du compte:", error);
    console.error("Détails de l'erreur:", error.response?.data);
    
    // Afficher un message d'erreur plus détaillé
    if (error.response?.status === 419) {
      errorMessage.value = "Session expirée. Veuillez rafraîchir la page et réessayer.";
    } else if (error.response?.status === 404) {
      errorMessage.value = "Compte introuvable. Veuillez vous reconnecter avec Google.";
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = `Erreur lors de la sélection du compte: ${error.message || "Erreur inconnue"}`;
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Retour à l'accueil
const goToHome = () => {
  router.push({ name: "Home" });
};

// Charger les comptes au montage du composant
onMounted(() => {
  loadPendingAccounts();
});
</script>

<style scoped>
/* Masquer le header et le footer sur cette page */
:deep(.main-header),
:deep(.main-footer),
:deep(.navbar),
:deep(.sidebar) {
  display: none !important;
}
</style>

