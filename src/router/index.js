import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuth } from "@/composables/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Routes Publiques ---
    { path: "/", name: "Home", component: HomeView },
    { path: "/nos-cartes", name: "cards", component: () => import("../views/CardsView.vue") },
    { path: "/a-propos", name: "about", component: () => import("../views/AboutView.vue") },
    { path: "/contact", name: "contact", component: () => import("../views/ContactView.vue") },
    { path: "/mentions-legales", name: "legalMentions", component: () => import("../views/LegalMentionsView.vue") },
    {
      path: "/conditions-generales",
      name: "termsAndConditions",
      component: () => import("../views/TermsAndConditionsView.vue"),
    },
    {
      path: "/politique-confidentialite",
      name: "privacyPolicy",
      component: () => import("../views/PrivacyPolicyView.vue"),
    },
    { path: "/verify-code", name: "Verification", component: () => import("../views/VerificationView.vue") },
    { path: "/reset-password", name: "ResetPassword", component: () => import("../views/ResetPasswordView.vue") },
    { path: "/entreprise/:username", name: "CompanyPublic", component: () => import("../views/CompanyPublicView.vue") },
    { path: "/selection-compte", name: "SelectAccount", component: () => import("../views/SelectAccountView.vue") },
    { path: "/finaliser-inscription", name: "FinalizeRegistration", component: () => import("../views/FinalizeRegistrationView.vue"), meta: { requiresAuth: true } },

    // --- Routes Protégées ---
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/mes-commandes",
      name: "Orders",
      component: () => import("../views/OrdersView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/parametres",
      name: "Settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/choisir-profil",
      name: "ProfileSelection",
      component: () => import("../views/ProfileSelectionView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/set-password",
      name: "EmployeeSetPassword",
      component: () => import("../views/EmployeeSetPasswordView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/mon-compte",
      name: "Account",
      component: () => import("../views/AccountView.vue"),
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Si une position sauvegardée existe (bouton retour), l'utiliser
    if (savedPosition) {
      return savedPosition;
    }
    // Si un hash existe dans l'URL (ancre), scroller vers cet élément
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 80, // Offset pour compenser le header fixe
      };
    }
    // Sinon, scroller en haut de la page
    return { top: 0 };
  },
});

// --- Garde de Navigation avec Session Hydration et Protection Profil ---
router.beforeEach(async (to, from, next) => {
  const { user, fetchUser } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const finalizeRoute = to.name === "FinalizeRegistration";
  const logoutRoute = to.name === "Home"; // Permettre la déconnexion
  
  // ✅ Détecter si c'est une redirection Google OAuth
  const isGoogleOAuthRedirect = to.query.google_oauth === '1' || to.query.google_oauth === 1;
  const isNewUser = to.query.new_user === '1' || to.query.new_user === 1;
  const oauthToken = to.query.token; // Token temporaire pour valider la session

  // 1. Si l'utilisateur est déjà chargé localement
  if (user.value) {
    // ✅ CRITIQUE: Si l'utilisateur accède à /finaliser-inscription mais que son profil est déjà complété,
    // rediriger immédiatement vers le Dashboard AVANT d'autoriser l'accès à la route
    if (finalizeRoute && user.value.is_profile_complete === true) {
      console.log("[Guard] FinalizeRegistration route detected, but profile already complete (user already loaded). Redirecting to Dashboard immediately.");
      return next({ name: "Dashboard" });
    }
    
    // ✅ STRICT CHECK: Vérifier si le profil est complet
    // Si is_profile_complete est false ET que la route n'est pas /finaliser-inscription
    // ET que ce n'est pas une déconnexion, FORCER la redirection
    if (user.value.is_profile_complete === false && !finalizeRoute && !logoutRoute) {
      console.log("[Guard] Profile incomplete. FORBIDDEN from accessing:", to.path);
      console.log("[Guard] Forcing redirect to /finaliser-inscription");
      return next({ name: "FinalizeRegistration" });
    }
    
    // ✅ STRICT CHECK: Bloquer spécifiquement l'accès au dashboard si profil incomplet
    if (to.name === "Dashboard" && user.value.is_profile_complete === false) {
      console.log("[Guard] FORBIDDEN: Cannot access Dashboard with incomplete profile");
      return next({ name: "FinalizeRegistration" });
    }
    
    console.log("[Guard] User already loaded. Allowing navigation.");
    return next();
  }

  // 2. Si la route nécessite une authentification, vérifier la session via l'API
  if (requiresAuth) {
    console.log("[Guard] Route requires auth. Checking session via API...");
    
    // ✅ EXCEPTION: Si c'est /finaliser-inscription avec un token Google OAuth,
    // NE PAS appeler fetchUser() - autoriser l'accès directement
    // Le composant FinalizeRegistrationView.vue gérera la validation du token et l'authentification
    if (finalizeRoute && isGoogleOAuthRedirect && oauthToken) {
      console.log("[Guard] FinalizeRegistration with Google OAuth token detected. Skipping fetchUser() - component will handle token validation and authentication.");
      return next();
    }
    
    // ✅ EXCEPTION: Si c'est /finaliser-inscription (même sans token visible),
    // vérifier d'abord si l'utilisateur est déjà chargé et si son profil est complété
    // Si oui, rediriger immédiatement vers le Dashboard AVANT de laisser accéder à la route
    if (finalizeRoute) {
      // Si l'utilisateur est déjà chargé et que son profil est complété, rediriger immédiatement
      if (user.value && user.value.is_profile_complete === true) {
        console.log("[Guard] FinalizeRegistration route detected, but profile already complete. Redirecting to Dashboard immediately.");
        return next({ name: "Dashboard" });
      }
      
      console.log("[Guard] FinalizeRegistration route detected. Allowing access - component will handle authentication.");
      return next();
    }
    
    try {
      // Essayer de récupérer l'utilisateur depuis l'API (session hydration)
      // _fetchUser() récupère maintenant automatiquement le token CSRF
      await fetchUser();
      
      // Après le fetch, vérifier si un utilisateur a été trouvé
      if (user.value) {
        // ✅ CRITIQUE: Si l'utilisateur accède à /finaliser-inscription mais que son profil est déjà complété,
        // rediriger immédiatement vers le Dashboard AVANT d'autoriser l'accès à la route
        if (finalizeRoute && user.value.is_profile_complete === true) {
          console.log("[Guard] FinalizeRegistration route detected, but profile already complete (after fetch). Redirecting to Dashboard immediately.");
          return next({ name: "Dashboard" });
        }
        
        // ✅ STRICT CHECK: Vérifier si le profil est complet après le fetch
        // Si is_profile_complete est false ET que la route n'est pas /finaliser-inscription
        // ET que ce n'est pas une déconnexion, FORCER la redirection
        if (user.value.is_profile_complete === false && !finalizeRoute && !logoutRoute) {
          console.log("[Guard] Profile incomplete after fetch. FORBIDDEN from accessing:", to.path);
          console.log("[Guard] Forcing redirect to /finaliser-inscription");
          return next({ name: "FinalizeRegistration" });
        }
        
        // ✅ STRICT CHECK: Bloquer spécifiquement l'accès au dashboard si profil incomplet
        if (to.name === "Dashboard" && user.value.is_profile_complete === false) {
          console.log("[Guard] FORBIDDEN: Cannot access Dashboard with incomplete profile");
          return next({ name: "FinalizeRegistration" });
        }
        
        console.log("[Guard] User found via API. Allowing navigation to:", to.path);
        return next();
      } else {
        // L'API a retourné null (pas d'utilisateur authentifié)
        // Si on est sur /finaliser-inscription, c'est peut-être une redirection Google
        // Dans ce cas, autoriser l'accès - le composant gérera la validation du token
        if (finalizeRoute) {
          console.log("[Guard] No user found, but on finalize route. Allowing access - component will handle authentication.");
          return next();
        }
        
        // Si on vient de SelectAccount ou qu'on redirige vers Dashboard,
        // réessayer plusieurs fois car la session peut prendre du temps à être accessible
        const isFromSelectAccount = from.name === "SelectAccount";
        const isRedirectingToDashboard = to.name === "Dashboard";
        
        if (isFromSelectAccount || isRedirectingToDashboard) {
          console.log("[Guard] No user found, but coming from SelectAccount or redirecting to Dashboard. Retrying...");
          const maxRetries = 5;
          const delay = 500;
          
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            await new Promise(resolve => setTimeout(resolve, delay));
            try {
              console.log(`[Guard] Retry attempt ${attempt}/${maxRetries} for user fetch...`);
              await fetchUser();
              if (user.value) {
                // ✅ Si on est sur /finaliser-inscription mais que le profil est déjà complété, rediriger vers Dashboard
                if (finalizeRoute && user.value.is_profile_complete === true) {
                  console.log(`[Guard] User found on retry attempt ${attempt}, but profile already complete. Redirecting to Dashboard.`);
                  return next({ name: "Dashboard" });
                }
                console.log(`[Guard] User found on retry attempt ${attempt}. Allowing navigation.`);
                return next();
              }
            } catch (retryError) {
              console.error(`[Guard] Retry attempt ${attempt} failed:`, retryError);
            }
          }
          
          // Si l'utilisateur n'est toujours pas trouvé après plusieurs tentatives,
          // mais qu'on vient de SelectAccount, la session devrait être établie
          // Autoriser l'accès quand même (le composant pourra gérer l'erreur)
          if (isFromSelectAccount) {
            console.warn("[Guard] User not found after retries, but coming from SelectAccount. Session should be established. Allowing access.");
            return next();
          }
        }
        
        console.log("[Guard] No user found via API. Redirecting to home.");
        return next({ name: "Home" });
      }
    } catch (error) {
      // Erreur lors du fetch (réseau, 401, 419, etc.)
      console.error("[Guard] Error fetching user from API:", error);
      
      // Si on est sur /finaliser-inscription et qu'on a une erreur 419 (CSRF) ou 401,
      // c'est peut-être une redirection Google. Réessayer plusieurs fois après un délai
      if (finalizeRoute && error.response && (error.response.status === 419 || error.response.status === 401)) {
        const maxRetries = isGoogleOAuthRedirect ? 5 : 2; // Plus de tentatives pour Google OAuth
        const delay = isGoogleOAuthRedirect ? 1000 : 1000;
        
        console.log(`[Guard] ${error.response.status} error on finalize route${isGoogleOAuthRedirect ? ' (Google OAuth redirect)' : ''}. Retrying up to ${maxRetries} times...`);
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          await new Promise(resolve => setTimeout(resolve, delay));
          try {
            console.log(`[Guard] Retry attempt ${attempt}/${maxRetries} after ${error.response.status}...`);
            await fetchUser();
            if (user.value) {
              console.log(`[Guard] User found on retry attempt ${attempt} after ${error.response.status}. Allowing navigation.`);
              return next();
            }
          } catch (retryError) {
            console.error(`[Guard] Retry attempt ${attempt} after ${error.response.status} failed:`, retryError);
            if (attempt === maxRetries) {
              // Si c'est une redirection Google OAuth et qu'on n'a toujours pas trouvé l'utilisateur
              // après plusieurs tentatives, c'est probablement un problème de session
              if (isGoogleOAuthRedirect) {
                console.error("[Guard] Google OAuth redirect: User not found after multiple retries. This may indicate a session issue.");
                // Ne pas rediriger vers Home immédiatement, laisser l'utilisateur sur la page
                // Le composant FinalizeRegistration pourra gérer l'erreur
                return next();
              }
            }
          }
        }
      }
      
      // ✅ EXCEPTION: Si on est sur /finaliser-inscription, NE JAMAIS rediriger vers Home
      // Le composant gérera l'authentification et les erreurs
      if (finalizeRoute) {
        console.log("[Guard] Error on finalize route. Allowing access - component will handle authentication and errors.");
        return next();
      }
      
      // Vérifier si c'est une erreur d'authentification (401/419)
      if (error.response && (error.response.status === 401 || error.response.status === 419)) {
        console.log("[Guard] Authentication error (401/419). Redirecting to home.");
        return next({ name: "Home" });
      }
      
      // Pour les autres erreurs (réseau, etc.), on peut soit bloquer soit autoriser
      // Ici, on bloque pour la sécurité si la route nécessite une auth
      console.log("[Guard] Network/other error. Redirecting to home for security.");
      return next({ name: "Home" });
    }
  }

  // 3. Si la route est publique, autoriser directement
  console.log("[Guard] Public route. Allowing navigation.");
  return next();
});

export default router;
