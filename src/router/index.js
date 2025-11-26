import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuth } from "@/composables/useAuth";
import apiClient from "@/api";

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
    // ✅ NOUVEAU: Page publique de traitement du paiement (sas de reconnexion)
    // Cette route doit être PUBLIQUE pour permettre l'échange de token avant authentification
    { 
      path: "/payment/process", 
      name: "PaymentProcessing", 
      component: () => import("../views/PaymentProcessingView.vue"),
      meta: { requiresAuth: false } // ✅ CRUCIAL: Route publique, non bloquée par le Guard
    },
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
      component: () => {
        return import("../views/OrdersView.vue").catch((error) => {
          console.error("Erreur lors du chargement dynamique de OrdersView:", error);
          // En cas d'erreur de chargement dynamique, réessayer avec un rechargement complet
          if (error.message && error.message.includes("Failed to fetch dynamically imported module")) {
            console.warn("Tentative de rechargement de la page pour résoudre l'erreur de chargement...");
            // Utiliser window.location pour forcer un rechargement complet
            setTimeout(() => {
              window.location.href = "/mes-commandes";
            }, 100);
          }
          // Retourner null pour éviter de bloquer la navigation
          return null;
        });
      },
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
  
  // ✅ Détecter les cas spéciaux
  const finalizeRoute = to.name === "FinalizeRegistration";
  const isGoogleOAuthRedirect = to.query.google_oauth === '1' || to.query.google_oauth === 1;
  const oauthToken = to.query.token;
  const isPaymentReturn = to.query.payment === 'success' && (to.query.order_id || to.query.additional_payment_id);
  const ordersRoute = to.name === "Orders";

  // ✅ Si la route est publique, on laisse passer tout de suite
  if (!requiresAuth) {
    console.log("[Guard] Route publique. Allowing navigation.");
    return next();
  }

  // ✅ EXCEPTION: Si c'est /finaliser-inscription avec un token Google OAuth,
  // autoriser l'accès directement - le composant gérera la validation
  if (finalizeRoute && isGoogleOAuthRedirect && oauthToken) {
    console.log("[Guard] FinalizeRegistration with Google OAuth token detected. Allowing access.");
    return next();
  }
  
  // ✅ EXCEPTION: Si c'est un retour de paiement réussi sur /mes-commandes,
  // autoriser l'accès - le composant gérera la récupération de la session
  // ✅ CRITIQUE: Vérifier aussi si on vient de PaymentProcessing (après échange de token)
  const isFromPaymentProcessing = from.name === "PaymentProcessing";
  if (ordersRoute && (isPaymentReturn || isFromPaymentProcessing)) {
    console.log("[Guard] Payment return detected on Orders route. Allowing access.", {
      isPaymentReturn,
      isFromPaymentProcessing,
      hasUser: !!user.value
    });
    // Si l'utilisateur est déjà chargé, laisser passer directement
    if (user.value) {
      return next();
    }
    // Sinon, essayer de le récupérer rapidement
    try {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        console.log("[Guard] User fetched successfully after payment return");
        return next();
      }
    } catch (error) {
      console.warn("[Guard] Error fetching user after payment return, but allowing access anyway", error);
    }
    // Autoriser l'accès même si on n'a pas pu récupérer l'utilisateur
    // Le composant OrdersView gérera la récupération
    return next();
  }
  
  // ✅ EXCEPTION: Si c'est /finaliser-inscription (même sans token visible),
  // autoriser l'accès - le composant gérera l'authentification
  if (finalizeRoute) {
    console.log("[Guard] FinalizeRegistration route detected. Allowing access.");
    return next();
  }

  // ✅ Si l'utilisateur est déjà chargé, vérifier le profil puis laisser passer
  if (user.value) {
    // ✅ CRITIQUE: Si l'utilisateur accède à /finaliser-inscription mais que son profil est déjà complété,
    // rediriger immédiatement vers le Dashboard AVANT d'autoriser l'accès à la route
    if (finalizeRoute && user.value.is_profile_complete === true) {
      console.log("[Guard] FinalizeRegistration route detected, but profile already complete (user already loaded). Redirecting to Dashboard immediately.");
      return next({ name: "Dashboard" });
    }
    
    // ✅ STRICT CHECK: Vérifier si le profil est complet
    // Si is_profile_complete est false ET que la route n'est pas /finaliser-inscription, FORCER la redirection
    if (user.value.is_profile_complete === false && !finalizeRoute) {
      console.log("[Guard] Profile incomplete. Redirecting to /finaliser-inscription");
      return next({ name: "FinalizeRegistration" });
    }
    
    // ✅ STRICT CHECK: Si l'utilisateur accède à /finaliser-inscription mais que son profil est déjà complété,
    // rediriger vers le Dashboard
    if (finalizeRoute && user.value.is_profile_complete === true) {
      console.log("[Guard] Profile already complete. Redirecting to Dashboard.");
      return next({ name: "Dashboard" });
    }
    
    console.log("[Guard] User already loaded. Allowing navigation.");
    return next();
  }

  // ✅ CAS DU REFRESH : L'utilisateur est null, on tente de le récupérer
  console.log("[Guard] User not loaded (refresh detected). Fetching user from API...");
  
  // ✅ Détecter si on vient de SelectAccount (après authentification Google)
  const isFromSelectAccount = from.name === "SelectAccount";
  
  // ✅ SIMPLIFICATION: Si requiresAuth est true et !user.value, on doit toujours entrer dans la boucle de retry
  // Supprimer la logique complexe de shouldRetry
  if (!requiresAuth || user.value) {
    // Si la route n'est pas protégée ou si l'utilisateur est déjà là, on ne devrait pas arriver ici
    // Mais par sécurité, on laisse passer
    console.log("[Guard] Route not protected or user already loaded. Allowing navigation.");
    return next();
  }
  
  // ✅ CRITIQUE: Boucle de retry simplifiée avec délais stricts pour éviter la boucle infinie
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // ✅ 1. PAUSE DE SÉCURITÉ (Anti-boucle & Initialisation Cookie)
    // ✅ CORRECTION: Augmenter le délai initial à 1000ms pour laisser le temps à la session de se restaurer
    // 1000ms avant la première tentative (pour le F5), 1500ms entre les suivantes
    const delay = attempt === 1 ? 1000 : 1500;
    console.log(`[Guard] Tentative ${attempt}/${maxRetries}, attente de ${delay}ms avant de récupérer l'utilisateur...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      // ✅ 2. On tente de récupérer l'utilisateur
      console.log(`[Guard] Tentative ${attempt}/${maxRetries}: Appel de fetchUser()...`);
      await fetchUser();
      
      // ✅ 3. Si succès immédiat, on laisse passer
      if (user.value) {
        console.log(`[Guard] Utilisateur trouvé à la tentative ${attempt}:`, user.value.email);
        // ✅ Vérifier le profil après le fetch
        if (user.value.is_profile_complete === false && !finalizeRoute) {
          console.log("[Guard] Profile incomplete after fetch. Redirecting to /finaliser-inscription");
          return next({ name: "FinalizeRegistration" });
        }
        
        if (finalizeRoute && user.value.is_profile_complete === true) {
          console.log("[Guard] Profile already complete after fetch. Redirecting to Dashboard.");
          return next({ name: "Dashboard" });
        }
        
        console.log(`[Guard] User found on attempt ${attempt}. Navigation allowed.`);
        return next();
      }
      
      // Si l'utilisateur n'est pas trouvé, on continue la boucle
      console.warn(`[Guard] Attempt ${attempt}/${maxRetries} failed: User not found. Retrying...`);
    } catch (error) {
      console.warn(`[Guard] Attempt ${attempt}/${maxRetries} failed:`, error.message || error);
      // On ne fait rien ici, la boucle va continuer après le délai du prochain tour
    }
  }
  
  // ✅ Si on sort de la boucle, c'est un échec définitif
  // ✅ EXCEPTION: Si on vient de SelectAccount, la session devrait être établie
  if (isFromSelectAccount) {
    console.warn("[Guard] Session check failed after all retries, but coming from SelectAccount. Session should be established. Allowing access.");
    return next();
  }
  
  console.log("[Guard] Session check failed after all retries. Redirecting to Login.");
  return next({ name: "Home" }); // Redirection vers Home (page de login)
});

export default router;
