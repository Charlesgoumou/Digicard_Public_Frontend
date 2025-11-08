<template>
  <div 
    id="app" 
    class="w-full overflow-x-hidden min-h-screen bg-slate-900"
  >
    <TheHeader v-if="shouldShowHeader" />

    <RouterView />

    <TheFooter v-if="shouldShowFooter" />

    <AuthModal />
    <OrderModal />
  </div>
</template>

<script setup>
  import { computed, watch, ref, onBeforeMount } from "vue";
  import { RouterView, useRoute } from "vue-router";
  import TheHeader from "@/components/layout/TheHeader.vue";
  import TheFooter from "@/components/layout/TheFooter.vue";
  import AuthModal from "@/components/auth/AuthModal.vue";
  import OrderModal from "@/components/layout/OrderModal.vue";
  import { useLoadingStore } from "@/stores/loading";
  import { useAuth } from "@/composables/useAuth";

  // Récupère l'information sur la route actuelle
  const route = useRoute();

  // Store de chargement
  const loadingStore = useLoadingStore();

  // Vérifie si l'utilisateur est connecté
  const { isLoggedIn } = useAuth();

  // Crée une propriété calculée qui vérifie si on est sur une route spéciale (Dashboard, CompanyPublic)
  const isDashboardRoute = computed(() => {
    return route.name === "Dashboard" || route.name === "CompanyPublic";
  });

  // Vérifie si on est sur une route utilisateur connecté où le footer doit être caché
  const isAuthenticatedUserRoute = computed(() => {
    if (!isLoggedIn.value) {
      return false;
    }
    // Routes où le footer doit être caché quand l'utilisateur est connecté
    // Note: Dashboard est déjà géré par isDashboardRoute
    return route.name === "Settings" ||
           route.name === "Orders" ||
           route.name === "Account" ||
           route.name === "ProfileSelection";
  });

  // Fonction helper pour vérifier si on est sur une page avec loader
  const isPageWithLoader = computed(() => {
    return route.name === "Home" || 
           route.name === "cards" || 
           route.name === "about" || 
           route.name === "contact" ||
           route.path === "/" ||
           route.path === "/nos-cartes" ||
           route.path === "/a-propos" ||
           route.path === "/contact";
  });

  // État local pour masquer le header/footer dès le début si on démarre sur une page avec loader
  const isPageLoading = ref(isPageWithLoader.value);

  // Propriété calculée pour déterminer si le header doit être affiché
  const shouldShowHeader = computed(() => {
    // Ne pas afficher sur les routes dashboard
    if (isDashboardRoute.value) {
      return false;
    }
    // Ne pas afficher si on est sur une page avec loader ET que le chargement est en cours
    if (isPageWithLoader.value && (isPageLoading.value || loadingStore.isHomePageLoading)) {
      return false;
    }
    // Afficher dans tous les autres cas
    return true;
  });

  // Propriété calculée pour déterminer si le footer doit être affiché
  const shouldShowFooter = computed(() => {
    // Ne pas afficher sur les routes dashboard
    if (isDashboardRoute.value) {
      return false;
    }
    // Ne pas afficher sur les routes utilisateur connecté (Dashboard, Settings, Orders, Account)
    if (isAuthenticatedUserRoute.value) {
      return false;
    }
    // Ne pas afficher si on est sur une page avec loader ET que le chargement est en cours
    if (isPageWithLoader.value && (isPageLoading.value || loadingStore.isHomePageLoading)) {
      return false;
    }
    // Afficher dans tous les autres cas
    return true;
  });

  // Initialiser le chargement AVANT le montage pour éviter l'affichage du header/footer
  onBeforeMount(() => {
    if (isPageWithLoader.value) {
      loadingStore.setHomePageLoading(true);
      isPageLoading.value = true;
    }
  });

  // Surveiller les changements de route pour gérer le chargement
  watch(
    () => route.name,
    (newRouteName) => {
      if (newRouteName === "Home" || newRouteName === "cards" || newRouteName === "about" || newRouteName === "contact") {
        loadingStore.setHomePageLoading(true);
        isPageLoading.value = true;
      } else {
        // Réinitialiser quand on quitte une page avec loader
        loadingStore.setHomePageLoading(false);
        isPageLoading.value = false;
      }
    }
  );

  // Surveiller le store pour afficher le header/footer quand le chargement est terminé
  watch(
    () => loadingStore.isHomePageLoading,
    (isLoading) => {
      if (!isLoading && isPageWithLoader.value) {
        // Quand le chargement est terminé, afficher le header/footer
        isPageLoading.value = false;
      }
    }
  );
</script>
