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

// --- Garde de Navigation Corrigée ---
// Drapeau pour éviter les appels multiples lors du chargement initial
let isInitialCheckDone = false;

router.beforeEach(async (to, from, next) => {
  const { user, fetchUser } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 1. Si l'utilisateur est déjà chargé localement (par login/verify)
  if (user.value) {
    // Si l'utilisateur est connecté, autoriser l'accès à toutes les pages
    console.log("[Guard] User already loaded. Allowing navigation.");
    isInitialCheckDone = true; // On considère la vérification initiale faite
    return next(); // Important: utiliser return pour sortir
  }

  // 2. Si l'utilisateur n'est pas chargé localement MAIS qu'on a déjà fait la vérification initiale
  if (isInitialCheckDone) {
    // Si on a déjà vérifié et que user est toujours null, et que la route est protégée
    if (requiresAuth) {
      console.log("[Guard] Initial check done, user is null. Redirecting home.");
      return next({ name: "Home" }); // Rediriger vers l'accueil
    } else {
      // Si la route n'est pas protégée, autoriser
      console.log("[Guard] Initial check done, user is null, route is public. Allowing.");
      return next();
    }
  }

  // 3. Si l'utilisateur n'est pas chargé ET la vérification initiale n'a PAS été faite (premier chargement/rechargement)
  if (!user.value && !isInitialCheckDone) {
    console.log("[Guard] Initial load, attempting fetchUser...");
    try {
      await fetchUser(); // Essaye de récupérer via cookie de session
      isInitialCheckDone = true; // Marque la vérification comme faite
      console.log("[Guard] Initial fetch complete. User:", user.value ? "Found" : "Not Found");
      // Après la tentative, on refait la vérification logique
      if (requiresAuth && !user.value) {
        console.log("[Guard] After initial fetch: Requires auth but user is null. Redirecting home.");
        return next({ name: "Home" });
      } else {
        console.log(
          `[Guard] After initial fetch: Allowing navigation (requiresAuth: ${requiresAuth}, userFound: ${!!user.value})`,
        );
        return next();
      }
    } catch (error) {
      console.error("[Guard] Error during initial fetchUser:", error);
      isInitialCheckDone = true; // Marque quand même comme fait, même en cas d'erreur
      user.value = null; // S'assurer que user est null
      // Si la route nécessitait une authentification, rediriger vers l'accueil
      if (requiresAuth) {
        console.log("[Guard] Initial fetch failed. Redirecting home.");
        return next({ name: "Home" });
      } else {
        // Si la route est publique, autoriser même si la récupération a échoué
        console.log("[Guard] Initial fetch failed, but route is public. Allowing.");
        return next();
      }
    }
  }

  // Fallback (ne devrait normalement pas être atteint avec la logique ci-dessus)
  console.warn("[Guard] Reached unexpected fallback. Allowing navigation.");
  next();
});

export default router;
