<template>
  <div class="min-h-screen bg-slate-900 pt-8 sm:pt-16 text-white flex items-center justify-center px-4">
    <!-- ✅ Masquer complètement le contenu si le profil est déjà complété -->
    <!-- La redirection sera gérée par le router guard et les vérifications dans onMounted -->
    <div v-if="user && user.is_profile_complete === true" class="flex flex-col items-center justify-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      <p class="mt-4 text-white font-medium">Redirection vers le tableau de bord...</p>
    </div>
    <div v-else class="relative max-w-md w-full p-8 bg-slate-800 rounded-xl border border-slate-700">
      <!-- Indicateur de chargement -->
      <div
        v-if="isSubmitting"
        class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        <p class="mt-4 text-white font-medium">Finalisation en cours...</p>
      </div>

      <h1 class="text-3xl font-bold mb-2 text-center">Finaliser votre inscription</h1>
      <p class="text-slate-400 mb-6 text-center">
        <span v-if="isEmployeeInvited">
          Complétez votre profil d'employé pour accéder à votre tableau de bord
        </span>
        <span v-else>
          Complétez votre profil pour accéder à votre tableau de bord
        </span>
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Nom (lecture seule) -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Nom</label>
          <input
            type="text"
            :value="user?.name || ''"
            disabled
            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
          />
        </div>

        <!-- Email (lecture seule) -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input
            type="email"
            :value="user?.email || ''"
            disabled
            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
          />
        </div>

        <!-- Type de compte (Radio buttons) -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-3">Type de compte *</label>
          <div class="space-y-3">
            <!-- Option Employé (affichée uniquement si l'utilisateur est un employé invité) -->
            <label 
              v-if="isEmployeeInvited"
              class="flex items-center p-4 bg-slate-700 border border-sky-500 rounded-lg opacity-80"
            >
              <input
                type="radio"
                v-model="formData.account_type"
                value="employee"
                class="w-4 h-4 text-sky-500 focus:ring-sky-500 focus:ring-2"
                checked
                disabled
              />
              <span class="ml-3 text-slate-200">
                👤 Employé
                <span class="text-xs text-slate-400 ml-2">(Compte invité par votre entreprise)</span>
              </span>
            </label>

            <!-- Options Particulier et Entreprise (masquées si c'est un employé) -->
            <template v-if="!isEmployeeInvited">
              <label 
                class="flex items-center p-4 bg-slate-700 border rounded-lg transition-colors"
                :class="{
                  'border-slate-600 cursor-pointer hover:bg-slate-600': (availableAccountTypes.individual || suggestedAccountType === 'individual') && !isSubmitting && suggestedAccountType !== 'company',
                  'border-sky-500 bg-slate-800/50': suggestedAccountType === 'individual',
                  'border-red-600/50 bg-slate-800/50 cursor-not-allowed opacity-60': (!availableAccountTypes.individual && suggestedAccountType !== 'individual') || isSubmitting || suggestedAccountType === 'company'
                }"
              >
                <input
                  type="radio"
                  v-model="formData.account_type"
                  value="individual"
                  class="w-4 h-4 text-sky-500 focus:ring-sky-500 focus:ring-2"
                  :disabled="isSubmitting || (!availableAccountTypes.individual && suggestedAccountType !== 'individual') || suggestedAccountType === 'company'"
                  :checked="suggestedAccountType === 'individual' || (formData.account_type === 'individual' && !suggestedAccountType)"
                />
                <span class="ml-3" :class="(availableAccountTypes.individual || suggestedAccountType === 'individual') && suggestedAccountType !== 'company' ? 'text-slate-200' : 'text-slate-400'">
                  Particulier
                  <span v-if="!availableAccountTypes.individual && suggestedAccountType !== 'individual'" class="text-xs text-red-400 ml-2">(Déjà créé)</span>
                  <span v-else-if="suggestedAccountType === 'individual'" class="text-xs text-sky-400 ml-2">(Sélectionné - Inscription classique)</span>
                  <span v-else-if="suggestedAccountType === 'company'" class="text-xs text-red-400 ml-2">(Verrouillé - Entreprise requis)</span>
                </span>
              </label>
              <label 
                class="flex items-center p-4 bg-slate-700 border rounded-lg transition-colors"
                :class="{
                  'border-slate-600 cursor-pointer hover:bg-slate-600': (availableAccountTypes.company || suggestedAccountType === 'company') && !isSubmitting && suggestedAccountType !== 'individual',
                  'border-sky-500 bg-slate-800/50': suggestedAccountType === 'company',
                  'border-red-600/50 bg-slate-800/50 cursor-not-allowed opacity-60': (!availableAccountTypes.company && suggestedAccountType !== 'company') || isSubmitting || suggestedAccountType === 'individual'
                }"
              >
                <input
                  type="radio"
                  v-model="formData.account_type"
                  value="company"
                  class="w-4 h-4 text-sky-500 focus:ring-sky-500 focus:ring-2"
                  :disabled="isSubmitting || (!availableAccountTypes.company && suggestedAccountType !== 'company') || suggestedAccountType === 'individual'"
                  :checked="suggestedAccountType === 'company' || (formData.account_type === 'company' && !suggestedAccountType)"
                />
                <span class="ml-3" :class="(availableAccountTypes.company || suggestedAccountType === 'company') && suggestedAccountType !== 'individual' ? 'text-slate-200' : 'text-slate-400'">
                  Entreprise
                  <span v-if="!availableAccountTypes.company && suggestedAccountType !== 'company'" class="text-xs text-red-400 ml-2">(Déjà créé)</span>
                  <span v-else-if="suggestedAccountType === 'company'" class="text-xs text-sky-400 ml-2">(Sélectionné - Inscription classique)</span>
                  <span v-else-if="suggestedAccountType === 'individual'" class="text-xs text-red-400 ml-2">(Verrouillé - Particulier requis)</span>
                </span>
              </label>
            </template>
          </div>
        </div>

        <!-- Téléphone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-slate-300 mb-2">
            Téléphone *
          </label>
          <input
            id="phone"
            type="tel"
            v-model="formData.phone"
            placeholder="+224XXXXXXXXX"
            pattern="^\+224[0-9]{9}$"
            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            :disabled="isSubmitting"
            required
          />
          <p class="mt-1 text-xs text-slate-400">
            Format requis: +224 suivi de 9 chiffres (ex: +224612345678)
          </p>
        </div>

        <!-- Nom de l'entreprise (conditionnel - masqué pour les employés) -->
        <div v-if="formData.account_type === 'company' && !isEmployeeInvited">
          <label for="company_name" class="block text-sm font-medium text-slate-300 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            id="company_name"
            type="text"
            v-model="formData.company_name"
            placeholder="Nom de votre entreprise"
            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            :disabled="isSubmitting"
            :required="formData.account_type === 'company'"
          />
        </div>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? "Finalisation..." : "Finaliser l'inscription" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import apiClient from "@/api";
import Cookies from "js-cookie";

const router = useRouter();
const route = useRoute();
const { user, fetchUser, updateUserLocally } = useAuth();

const formData = ref({
  phone: "",
  account_type: null,
  company_name: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");

// Détecter si l'utilisateur est un employé invité
const isEmployeeInvited = computed(() => {
  return user.value && user.value.role === 'employee';
});

// Types de comptes disponibles/restreints
const availableAccountTypes = ref({
  individual: true, // Par défaut, tous les types sont disponibles
  company: true,
});
const hasExistingIndividual = ref(false);
const hasExistingCompany = ref(false);
const suggestedAccountType = ref(null); // ✅ Type de compte suggéré (verrouillé) depuis Google OAuth

// Validation du formulaire
const isFormValid = computed(() => {
  // Pour les employés, seul le téléphone est requis
  if (isEmployeeInvited.value) {
    if (!formData.value.phone || formData.value.account_type !== 'employee') {
      return false;
    }
    // Vérifier le format du téléphone
    const phoneRegex = /^\+224[0-9]{9}$/;
    return phoneRegex.test(formData.value.phone);
  }
  
  // Pour les autres types de comptes
  if (!formData.value.phone || !formData.value.account_type) {
    return false;
  }
  
  // Vérifier que le type de compte sélectionné est disponible
  if (formData.value.account_type === "individual" && !availableAccountTypes.value.individual) {
    return false;
  }
  if (formData.value.account_type === "company" && !availableAccountTypes.value.company) {
    return false;
  }
  
  // Vérifier le format du téléphone
  const phoneRegex = /^\+224[0-9]{9}$/;
  if (!phoneRegex.test(formData.value.phone)) {
    return false;
  }
  // Si c'est une entreprise, le nom est requis
  if (formData.value.account_type === "company" && !formData.value.company_name?.trim()) {
    return false;
  }
  return true;
});

// Charger les données utilisateur au montage
onMounted(async () => {
  console.log("[FinalizeRegistration] ===== COMPONENT MOUNTED ===== ");
  console.log("[FinalizeRegistration] Component mounted. Starting authentication process...");
  console.log("[FinalizeRegistration] Current route:", {
    path: route.path,
    query: route.query,
    fullPath: route.fullPath
  });
  
  try {
    // ✅ PRIORITÉ: Si un token Google OAuth est présent dans l'URL, le valider d'abord
    const oauthToken = route.query.token;
    const isGoogleOAuth = route.query.google_oauth === '1';
    let tokenValidated = false;
    
    // ✅ MODIFICATION: Charger les types de comptes existants UNIQUEMENT si ce n'est PAS une connexion Google OAuth
    // Pour Google OAuth, les informations seront fournies par validateToken avec la sélection intelligente
    if (!isGoogleOAuth) {
      // ✅ MODIFICATION: Vérifier d'abord si l'utilisateur vient d'une inscription classique
      // Si oui, prioriser le type choisi lors de l'inscription et ignorer les restrictions
      const isClassicRegistration = user.value && user.value.account_type && !user.value.google_id;
      
      if (isClassicRegistration) {
        // L'utilisateur vient d'une inscription classique : verrouiller sur le type choisi
        suggestedAccountType.value = user.value.account_type;
        formData.value.account_type = user.value.account_type;
        // Forcer les types disponibles pour permettre le type choisi même si un compte existe déjà
        availableAccountTypes.value = {
          individual: true,
          company: true,
        };
        console.log("[FinalizeRegistration] Classic registration detected - account type locked to:", user.value.account_type);
      } else {
        // Pour les inscriptions Google OAuth, utiliser la logique de sélection intelligente
        try {
          const csrfToken = Cookies.get("XSRF-TOKEN");
          if (csrfToken) {
            apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
          }
          
          const accountTypesResponse = await apiClient.get("/api/existing-account-types");
          if (accountTypesResponse.data) {
            availableAccountTypes.value = accountTypesResponse.data.available_types || {
              individual: true,
              company: true,
            };
            hasExistingIndividual.value = accountTypesResponse.data.has_individual || false;
            hasExistingCompany.value = accountTypesResponse.data.has_company || false;
            
            console.log("[FinalizeRegistration] Existing account types loaded:", {
              has_individual: hasExistingIndividual.value,
              has_company: hasExistingCompany.value,
              available: availableAccountTypes.value
            });
            
            // Si un seul type est disponible, le pré-sélectionner automatiquement
            if (!availableAccountTypes.value.individual && availableAccountTypes.value.company) {
              formData.value.account_type = "company";
              console.log("[FinalizeRegistration] Auto-selected 'company' (only available type)");
            } else if (availableAccountTypes.value.individual && !availableAccountTypes.value.company) {
              formData.value.account_type = "individual";
              console.log("[FinalizeRegistration] Auto-selected 'individual' (only available type)");
            }
          }
        } catch (accountTypesError) {
          console.warn("[FinalizeRegistration] Failed to load existing account types, allowing all types:", accountTypesError);
          // En cas d'erreur, on permet tous les types par défaut
        }
      }
    }
    
    console.log("[FinalizeRegistration] URL params:", {
      hasToken: !!oauthToken,
      isGoogleOAuth: isGoogleOAuth,
      tokenPrefix: oauthToken ? oauthToken.substring(0, 10) + '...' : 'none'
    });
    
    // ✅ CRITIQUE: Si c'est une redirection Google OAuth, définir un flag global
    // pour éviter toute redirection vers Home
    if (isGoogleOAuth) {
      console.log("[FinalizeRegistration] Google OAuth redirect detected. Will NOT redirect to Home under any circumstances.");
    }
    
    if (oauthToken && isGoogleOAuth) {
      console.log("[FinalizeRegistration] Google OAuth token detected, validating...");
      
      // Fonction helper pour récupérer et définir le header CSRF (comme dans SelectAccountView.vue)
      const setCsrfHeader = async () => {
        try {
          // Récupérer le cookie CSRF depuis Sanctum
          await apiClient.get("/sanctum/csrf-cookie");
          // Attendre un peu pour que le cookie soit bien disponible
          await new Promise(resolve => setTimeout(resolve, 200));
          // Définir le header CSRF explicitement
          const csrfToken = Cookies.get("XSRF-TOKEN");
          if (csrfToken) {
            apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
            console.log("[FinalizeRegistration] CSRF token set in header");
          } else {
            console.warn("[FinalizeRegistration] CSRF token not found in cookies");
          }
        } catch (error) {
          console.error("[FinalizeRegistration] Error setting CSRF header:", error);
        }
      };
      
      // Réessayer jusqu'à 5 fois en cas d'erreur 419 (CSRF)
      const maxRetries = 5;
      const delay = 1000;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[FinalizeRegistration] Token validation attempt ${attempt}/${maxRetries}...`);
          
          // Récupérer et définir le token CSRF explicitement
          await setCsrfHeader();
          
          // Valider le token et connecter l'utilisateur
          const response = await apiClient.post('/api/google/validate-token', {
            token: oauthToken
          });
          
          console.log("[FinalizeRegistration] Token validated successfully", response.data);
          tokenValidated = true;
          
          // ✅ MODIFICATION: Utiliser les informations de sélection intelligente retournées par le backend
          // Mettre à jour availableAccountTypes selon les comptes existants
          if (response.data.has_individual !== undefined || response.data.has_business !== undefined) {
            hasExistingIndividual.value = response.data.has_individual || false;
            hasExistingCompany.value = response.data.has_business || false;
            availableAccountTypes.value = {
              individual: !hasExistingIndividual.value, // Disponible si pas déjà créé
              company: !hasExistingCompany.value, // Disponible si pas déjà créé
            };
            
            console.log("[FinalizeRegistration] Account types updated from validateToken:", {
              has_individual: hasExistingIndividual.value,
              has_company: hasExistingCompany.value,
              available: availableAccountTypes.value
            });
          }
          
          // ✅ MODIFICATION: Utiliser suggested_account_type pour verrouiller le type de compte
          if (response.data.suggested_account_type) {
            suggestedAccountType.value = response.data.suggested_account_type;
            formData.value.account_type = response.data.suggested_account_type;
            console.log("[FinalizeRegistration] Account type locked to:", response.data.suggested_account_type);
          } else if (response.data.account_type) {
            // Fallback: utiliser account_type si suggested_account_type n'est pas fourni
            formData.value.account_type = response.data.account_type;
            console.log("[FinalizeRegistration] Account type pre-filled:", response.data.account_type);
          }
          
          // Si un seul type est disponible, le pré-sélectionner automatiquement
          if (!formData.value.account_type) {
            if (!availableAccountTypes.value.individual && availableAccountTypes.value.company) {
              formData.value.account_type = "company";
              console.log("[FinalizeRegistration] Auto-selected 'company' (only available type)");
            } else if (availableAccountTypes.value.individual && !availableAccountTypes.value.company) {
              formData.value.account_type = "individual";
              console.log("[FinalizeRegistration] Auto-selected 'individual' (only available type)");
            }
          }
          
          // Attendre un peu pour que la session soit bien établie
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Nettoyer le token de l'URL (construire l'URL manuellement)
          if (window.history && window.history.replaceState) {
            const newQuery = { ...route.query };
            delete newQuery.token;
            delete newQuery.google_oauth;
            
            // Construire l'URL manuellement
            const queryString = Object.keys(newQuery).length > 0 
              ? '?' + new URLSearchParams(newQuery).toString()
              : '';
            const newUrl = route.path + queryString;
            
            window.history.replaceState({}, '', newUrl);
            console.log("[FinalizeRegistration] URL cleaned:", newUrl);
          }
          
          // ✅ CRITIQUE: Si la réponse contient les données utilisateur, les utiliser directement
          // pour mettre à jour l'état de l'utilisateur immédiatement
          if (response.data && response.data.user) {
            console.log("[FinalizeRegistration] User data received from validate-token, updating user state");
            
            // Mettre à jour l'utilisateur dans le composable useAuth
            // On construit un objet utilisateur minimal pour éviter l'erreur "User not found"
            const userData = {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              is_profile_complete: response.data.user.is_profile_complete || false,
              account_type: response.data.account_type || null,
              // Les autres champs seront récupérés par fetchUser() en arrière-plan
            };
            
            // Mettre à jour l'utilisateur via updateUserLocally (qui gère readonly)
            if (updateUserLocally) {
              updateUserLocally(userData);
              console.log("[FinalizeRegistration] User state updated via updateUserLocally", userData);
              // Vérifier que user.value a été mis à jour
              if (user.value) {
                console.log("[FinalizeRegistration] User value confirmed after updateUserLocally:", user.value);
              } else {
                console.warn("[FinalizeRegistration] User value is still null after updateUserLocally");
              }
            } else {
              console.error("[FinalizeRegistration] updateUserLocally is not available");
            }
            
            // Pré-remplir le formulaire avec les données reçues
            if (response.data.account_type) {
              formData.value.account_type = response.data.account_type;
            }
          }
          
          // Sortir de la boucle si la validation réussit
          break;
        } catch (tokenError) {
          console.error(`[FinalizeRegistration] Token validation attempt ${attempt} failed:`, tokenError);
          
          // Si c'est une erreur 419 (CSRF) et qu'on n'est pas à la dernière tentative, réessayer
          if (tokenError.response && tokenError.response.status === 419 && attempt < maxRetries) {
            console.log(`[FinalizeRegistration] 419 error on attempt ${attempt}, retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          // Si c'est une autre erreur ou la dernière tentative, arrêter
          if (attempt === maxRetries) {
            console.error("[FinalizeRegistration] All token validation attempts failed");
          }
        }
      }
    }
    
    // Récupérer l'utilisateur depuis l'API (après validation du token si applicable)
    // Si le token a été validé avec succès, on a déjà les données utilisateur
    // On essaie quand même fetchUser() pour obtenir toutes les données complètes
    if (tokenValidated) {
      // Si user.value est déjà défini (depuis validate-token), on n'affiche pas d'erreur
      // On essaie quand même fetchUser() en arrière-plan pour obtenir toutes les données
      if (user.value) {
        console.log("[FinalizeRegistration] User already set from validate-token, fetching complete data in background...");
        // Appeler fetchUser() en arrière-plan sans attendre (non-bloquant)
        fetchUser().then(() => {
          console.log("[FinalizeRegistration] Complete user data fetched successfully");
        }).catch((error) => {
          console.warn("[FinalizeRegistration] Failed to fetch complete user data, but user is already set:", error);
        });
      } else {
        // Si user.value n'est pas défini, essayer fetchUser() plusieurs fois
        console.log("[FinalizeRegistration] User not set from validate-token, trying fetchUser()...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const maxFetchRetries = 3;
        for (let attempt = 1; attempt <= maxFetchRetries; attempt++) {
          try {
            console.log(`[FinalizeRegistration] Fetching user attempt ${attempt}/${maxFetchRetries}...`);
            await fetchUser();
            if (user.value) {
              console.log(`[FinalizeRegistration] User found on fetch attempt ${attempt}`);
              break;
            }
          } catch (fetchError) {
            console.error(`[FinalizeRegistration] Fetch user attempt ${attempt} failed:`, fetchError);
          }
          
          if (!user.value && attempt < maxFetchRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } else {
      // Si le token n'a pas été validé, essayer de récupérer l'utilisateur normalement
      try {
        await fetchUser();
      } catch (fetchError) {
        console.error("[FinalizeRegistration] Error fetching user:", fetchError);
      }
    }
    
    // Si l'utilisateur n'est toujours pas connecté après toutes les tentatives
    // MAIS si le token a été validé, on considère que l'utilisateur est connecté
    // même si fetchUser() a échoué (la session est établie côté backend)
    if (!user.value && !tokenValidated) {
      // Si c'est une redirection Google OAuth, NE PAS rediriger vers Home
      if (isGoogleOAuth) {
        console.error("[FinalizeRegistration] User not found after Google OAuth redirect and token validation failed. This may be a session issue.");
        errorMessage.value = "Impossible de récupérer votre session. Veuillez réessayer de vous connecter avec Google ou rafraîchir la page.";
        return;
      }
      
      // Si ce n'est pas une redirection Google OAuth, rediriger vers l'accueil
      console.error("[FinalizeRegistration] User not authenticated after all attempts. Redirecting to home.");
      router.push({ name: "Home" });
      return;
    }
    
    // Si le token a été validé mais user.value est toujours null,
    // c'est que updateUserLocally n'a pas fonctionné ou que les données n'ont pas été reçues
    // Dans ce cas, on ne doit pas afficher d'erreur car la session est établie
    if (tokenValidated && !user.value) {
      console.warn("[FinalizeRegistration] Token validated but user.value is still null. Session is established, form can be used.");
      // Ne pas afficher d'erreur - la session est établie, l'utilisateur peut utiliser le formulaire
    }
    
    // Si le token a été validé, on considère que l'utilisateur est connecté
    // même si fetchUser() n'a pas encore réussi (la session est établie)
    if (tokenValidated) {
      console.log("[FinalizeRegistration] Token validated successfully. User session is established.");
      if (!user.value) {
        console.log("[FinalizeRegistration] fetchUser() not yet successful, but session is established. Allowing form access.");
        // Ne pas afficher d'erreur - l'utilisateur peut utiliser le formulaire
        // fetchUser() continuera en arrière-plan
        // Réessayer fetchUser() une dernière fois après un délai
        setTimeout(async () => {
          try {
            await fetchUser();
            if (user.value) {
              console.log("[FinalizeRegistration] User fetched successfully in background");
              // ✅ Vérifier si le profil est déjà complété après le fetch
              if (user.value.is_profile_complete === true) {
                console.log("[FinalizeRegistration] Profile already complete (after background fetch). Redirecting to Dashboard.");
                router.push({ name: "Dashboard" });
              }
            }
          } catch (error) {
            console.warn("[FinalizeRegistration] Background fetchUser() failed, but user can still use the form:", error);
          }
        }, 2000);
      }
    }
    
    // ✅ Pré-remplir le formulaire avec les données utilisateur si disponibles
    // Vérifier que user.value existe avant d'accéder à ses propriétés
    if (user.value) {
      console.log("[FinalizeRegistration] User authenticated successfully:", {
        userId: user.value.id,
        email: user.value.email,
        role: user.value.role,
        isProfileComplete: user.value.is_profile_complete
      });
      
      // ✅ CRITIQUE: Si le profil est déjà complet, rediriger vers le Dashboard
      // L'utilisateur n'a pas besoin de finaliser son inscription s'il l'a déjà fait
      if (user.value.is_profile_complete === true) {
        console.log("[FinalizeRegistration] Profile already complete. Redirecting to Dashboard.");
        router.push({ name: "Dashboard" });
        return; // Sortir de la fonction pour éviter de pré-remplir le formulaire
      }
      
      // ✅ Si l'utilisateur est un employé invité, précochier automatiquement 'employee'
      if (user.value.role === 'employee') {
        formData.value.account_type = 'employee';
        console.log("[FinalizeRegistration] Employee invited - account_type set to 'employee'");
      } else if (user.value.account_type && !formData.value.account_type) {
        formData.value.account_type = user.value.account_type;
        console.log("[FinalizeRegistration] Account type loaded from user:", user.value.account_type);
        // Le verrouillage sera géré par le watch() défini plus bas
      }
      
      if (user.value.phone) {
        formData.value.phone = user.value.phone;
      }
      if (user.value.company_name) {
        formData.value.company_name = user.value.company_name;
      }
    } else {
      console.log("[FinalizeRegistration] User not yet loaded, but form can still be used");
      // Si le token a été validé, on peut quand même utiliser le formulaire
      // Les données seront récupérées en arrière-plan
      // ATTENTION: Il faudra aussi vérifier is_profile_complete une fois que l'utilisateur sera chargé
    }
    
    // ✅ MODIFICATION: Watch pour détecter quand l'utilisateur est chargé et verrouiller le type de compte si nécessaire
    // Cela s'applique même si l'utilisateur est chargé après onMounted (via fetchUser en arrière-plan)
    watch(user, (newUser) => {
      if (newUser && newUser.account_type && !newUser.google_id && !suggestedAccountType.value) {
        // L'utilisateur vient d'une inscription classique (pas Google OAuth)
        suggestedAccountType.value = newUser.account_type;
        formData.value.account_type = newUser.account_type;
        console.log("[FinalizeRegistration] Classic registration detected via watch - account type locked to:", newUser.account_type);
      }
    }, { immediate: true });
  } catch (error) {
    console.error("[FinalizeRegistration] Error during component mount:", error);
    
    // Si c'est une redirection Google OAuth, NE PAS rediriger vers Home
    // Afficher un message d'erreur à la place
    const isGoogleOAuth = route.query.google_oauth === '1';
    if (isGoogleOAuth) {
      console.error("[FinalizeRegistration] Error during Google OAuth flow. Will NOT redirect to Home - showing error message instead");
      errorMessage.value = "Une erreur est survenue lors de la connexion. Veuillez réessayer de vous connecter avec Google ou rafraîchir la page.";
      // Ne pas rediriger - laisser l'utilisateur sur la page avec le message d'erreur
      return;
    }
    
    // Si ce n'est pas une redirection Google OAuth, rediriger vers l'accueil
    console.error("[FinalizeRegistration] Error during component mount. Redirecting to home.");
    router.push({ name: "Home" });
  }
});

// ✅ MODIFICATION: Watch pour détecter quand l'utilisateur est chargé et verrouiller le type de compte si nécessaire
// Cela s'applique même si l'utilisateur est chargé après onMounted (via fetchUser en arrière-plan)
watch(user, (newUser) => {
  if (newUser && newUser.account_type && !newUser.google_id && !suggestedAccountType.value) {
    // L'utilisateur vient d'une inscription classique (pas Google OAuth)
    // ✅ MODIFICATION: Prioriser le type choisi lors de l'inscription classique
    // et forcer les types disponibles pour permettre le type choisi même si un compte existe déjà
    suggestedAccountType.value = newUser.account_type;
    formData.value.account_type = newUser.account_type;
    availableAccountTypes.value = {
      individual: true,
      company: true,
    };
    console.log("[FinalizeRegistration] Classic registration detected via watch - account type locked to:", newUser.account_type);
  }
}, { immediate: true });

// ✅ Watcher pour surveiller si le profil devient complété
// (par exemple si l'utilisateur est chargé en arrière-plan)
watch(
  () => user.value?.is_profile_complete,
  (isComplete) => {
    if (isComplete === true && user.value) {
      console.log("[FinalizeRegistration] Profile completed detected via watcher. Redirecting to Dashboard.");
      router.push({ name: "Dashboard" });
    }
  },
  { immediate: false } // Ne pas exécuter immédiatement, seulement sur changement
);

// Soumission du formulaire
const handleSubmit = async () => {
  if (!isFormValid.value) {
    // Vérifier spécifiquement si un type non disponible a été sélectionné
    if (formData.value.account_type === "individual" && !availableAccountTypes.value.individual) {
      errorMessage.value = "Vous avez déjà un compte Particulier. Veuillez choisir un autre type de compte.";
      return;
    }
    if (formData.value.account_type === "company" && !availableAccountTypes.value.company) {
      errorMessage.value = "Vous avez déjà un compte Entreprise. Veuillez choisir un autre type de compte.";
      return;
    }
    errorMessage.value = "Veuillez remplir tous les champs requis correctement.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    // Ajouter l'en-tête CSRF
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }

    // Préparer les données
    const payload = {
      phone: formData.value.phone,
      account_type: formData.value.account_type,
    };

    // Ajouter le nom de l'entreprise si c'est une entreprise
    if (formData.value.account_type === "company") {
      payload.company_name = formData.value.company_name;
    }

    // Appeler l'API
    const response = await apiClient.post("/api/complete-profile", payload);

    console.log("[FinalizeRegistration] Profile completion response:", response.data);

    // Mettre à jour l'utilisateur localement avec les données retournées
    if (response.data.user) {
      // Mettre à jour l'utilisateur avec les données retournées
      if (updateUserLocally) {
        updateUserLocally({
          ...response.data.user,
          is_profile_complete: true // S'assurer que le flag est à true
        });
        console.log("[FinalizeRegistration] User updated locally with complete profile");
      }
      
      // Rafraîchir les données utilisateur depuis l'API pour avoir toutes les données
      try {
        await fetchUser();
        console.log("[FinalizeRegistration] User data refreshed from API");
      } catch (fetchError) {
        console.warn("[FinalizeRegistration] Failed to refresh user data, but profile is complete:", fetchError);
      }
    }

    // Attendre un peu pour que la session soit bien mise à jour
    await new Promise(resolve => setTimeout(resolve, 500));

    // Rediriger vers le dashboard
    console.log("[FinalizeRegistration] Redirecting to dashboard...");
    router.push({ name: "Dashboard" });
  } catch (error) {
    console.error("Erreur lors de la finalisation du profil:", error);
    errorMessage.value =
      error.response?.data?.message ||
      "Une erreur est survenue lors de la finalisation. Veuillez réessayer.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Cacher tous les éléments de navigation pour forcer l'utilisateur à compléter le formulaire */
:deep(header),
:deep(nav),
:deep(.navbar),
:deep(.sidebar),
:deep(footer),
:deep(.footer) {
  display: none !important;
}
</style>

