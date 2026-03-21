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
    { path: "/entreprise/:username", name: "CompanyPublic", component: () => import("../views/CompanyPublicView.vue"), beforeEnter: (to, _from, next) => { if (to.query.code) { next({ path: `/e/${to.query.code}`, query: {} }); return; } next(); } },
    { path: "/e/:code", name: "CompanyByCode", component: () => import("../views/CompanyPublicView.vue") },
    { path: "/selection-compte", name: "SelectAccount", component: () => import("../views/SelectAccountView.vue") },
    // ✅ NOUVEAU: Page publique de traitement du paiement (sas de reconnexion)
    // Cette route doit être PUBLIQUE pour permettre l'échange de token avant authentification
    { 
      path: "/payment/process", 
      name: "PaymentProcessing", 
      component: () => import("../views/PaymentProcessingView.vue"),
      meta: { requiresAuth: false } // ✅ CRUCIAL: Route publique, non bloquée par le Guard
    },
    // ✅ NOUVEAU: Page simple de confirmation de paiement (pour l'onglet de paiement)
    { 
      path: "/payment/close", 
      name: "PaymentClose", 
      component: () => import("../views/PaymentCloseView.vue"),
      meta: { 
        requiresAuth: false, // Route publique
        hideNavbar: true,    // ✅ Masquer le header
        hideFooter: true     // ✅ Masquer le footer
      }
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
      path: "/personnel",
      name: "Personnel",
      component: () => import("../views/PersonnelView.vue"),
      meta: { requiresAuth: true, hideNavbar: true, hideFooter: true },
    },
    {
      path: "/personnel/:serviceSlug",
      name: "PersonnelService",
      component: () => import("../views/PersonnelServiceEntryView.vue"),
      meta: { requiresAuth: true, hideNavbar: true, hideFooter: true },
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
      meta: { requiresAuth: true, hideNavbar: true, hideFooter: true },
    },
    {
      path: "/parametres",
      name: "Settings",
      component: () => import("../views/SettingsView.vue"),
      meta: { requiresAuth: true, hideNavbar: true },
    },
    {
      path: "/choisir-profil",
      name: "ProfileSelection",
      component: () => import("../views/ProfileSelectionView.vue"),
      meta: { requiresAuth: true, hideNavbar: true },
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
    {
      path: "/marketplace",
      name: "Marketplace",
      component: () => import("../views/MarketplaceView.vue"),
      meta: { 
        requiresAuth: true,
        hideNavbar: true,  // Masquer le header
        hideFooter: true   // Masquer le footer
      },
    },
    {
      path: "/menu-du-jour",
      name: "RestaurantMenu",
      component: () => import("../views/RestaurantMenuView.vue"),
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
  
  // ✅ CRITIQUE: Après un choix de compte, ne jamais afficher la landing (même si une nav vers "/" est déclenchée)
  if (from.name === "SelectAccount" && (to.name === "Home" || to.path === "/")) {
    console.log("[Guard] From SelectAccount toward Home. Redirecting to Dashboard (no landing).");
    return next({ name: "Dashboard" });
  }

  // ✅ CRITIQUE: Ne jamais afficher la landing (Home) si l'utilisateur est déjà authentifié
  const isNavigatingToHome = to.name === "Home" || to.path === "/";
  if (isNavigatingToHome) {
    if (user.value && user.value.is_profile_complete !== false) {
      console.log("[Guard] User authenticated on Home. Redirecting to Dashboard (no landing).");
      return next({ name: "Dashboard" });
    }
    if (!user.value) {
      try {
        await fetchUser();
        if (user.value && user.value.is_profile_complete !== false) {
          console.log("[Guard] User fetched on Home. Redirecting to Dashboard (no landing).");
          return next({ name: "Dashboard" });
        }
      } catch (e) {
        // Pas de session, on affiche la landing
      }
    }
  }

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

  // ✅ EXCEPTION: Navigation depuis SelectAccount vers une route protégée (ex: Dashboard)
  // L'utilisateur vient d'être défini par updateUserLocally juste avant router.push.
  // On autorise la navigation sans exiger user.value pour éviter un flash vers Home.
  const isFromSelectAccount = from.name === "SelectAccount";
  if (isFromSelectAccount && (to.name === "Dashboard" || to.name === "FinalizeRegistration" || to.name === "Settings" || to.name === "Orders" || to.name === "Account" || to.name === "ProfileSelection" || to.name === "Personnel" || to.name === "PersonnelService")) {
    console.log("[Guard] Navigation from SelectAccount to protected route. Allowing (user was just set).");
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

  // ✅ CAS DU REFRESH (F5) : L'utilisateur est null, on doit attendre fetchUser() avant de décider
  // ✅ CRITIQUE: Ne pas rediriger vers login avant d'avoir attendu la réponse du serveur
  // Même si fetchUser() met 500ms à répondre, on attend sans timeout arbitraire
  console.log("[Guard] User not loaded (refresh detected). Fetching user from API...");
  
  // ✅ 1. Si l'utilisateur n'est pas chargé en mémoire (cas du F5), attendre fetchUser()
  // IMPORTANT : Ne pas mettre de timeout arbitraire court ici, attendre la réponse
  if (!user.value) {
    try {
      console.log("[Guard] Awaiting fetchUser() to check session...");
      // On attend la réponse du serveur (avec le cookie session)
      // fetchUser() peut prendre du temps en production (latence réseau), mais on attend
      await fetchUser();
      console.log("[Guard] fetchUser() completed, user.value:", user.value ? "found" : "null");
    } catch (error) {
      console.error("[Guard] Echec récupération session:", error);
      // On continue, la vérification 'requiresAuth' plus bas décidera de la redirection
    }
  }
  
  // ✅ 2. Ensuite, on vérifie les droits normalement
  if (requiresAuth && !user.value) {
    const fromSelectAccount = from.name === "SelectAccount";
    if (fromSelectAccount) {
      console.log("[Guard] From SelectAccount without user yet. Allowing navigation (no redirect to Home).");
      return next();
    }
    const fromAuthFlow = from.name === "Verification" || from.name === "FinalizeRegistration";
    if (fromAuthFlow) {
      try {
        await fetchUser();
        if (user.value) {
          console.log("[Guard] User found after auth flow. Allowing navigation.");
          return next();
        }
      } catch (e) {}
    }
    console.log("[Guard] Route requires auth but user is null. Redirecting to Home.");
    return next({ name: "Home" });
  }
  
  // ✅ 3. Vérifier le profil si l'utilisateur est chargé
  if (user.value) {
    if (user.value.is_profile_complete === false && !finalizeRoute) {
      console.log("[Guard] Profile incomplete. Redirecting to /finaliser-inscription");
      return next({ name: "FinalizeRegistration" });
    }
    
    if (finalizeRoute && user.value.is_profile_complete === true) {
      console.log("[Guard] Profile already complete. Redirecting to Dashboard.");
      return next({ name: "Dashboard" });
    }
    
    console.log("[Guard] User authenticated. Allowing navigation.");
    return next();
  }
  
  // ✅ Si on arrive ici, c'est qu'il n'y a pas d'utilisateur et que la route n'est pas protégée
  // (mais normalement on ne devrait pas arriver ici car requiresAuth est vérifié plus haut)
  console.log("[Guard] Allowing navigation (route not protected).");
  return next();
});

export default router;
