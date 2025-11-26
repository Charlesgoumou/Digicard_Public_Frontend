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
  import { computed, watch, ref, onBeforeMount, onMounted, onUnmounted } from "vue";
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
  const { isLoggedIn, logout } = useAuth();

  // Crée une propriété calculée qui vérifie si on est sur une route spéciale (Dashboard, CompanyPublic, FinalizeRegistration, SelectAccount, PaymentProcessing)
  const isDashboardRoute = computed(() => {
    return route.name === "Dashboard" || route.name === "CompanyPublic" || route.name === "FinalizeRegistration" || route.name === "SelectAccount" || route.name === "PaymentProcessing";
  });

  // Vérifie si on est sur une route utilisateur connecté où le footer doit être caché
  const isAuthenticatedUserRoute = computed(() => {
    if (!isLoggedIn.value) {
      return false;
    }
    // Routes où le footer doit être caché quand l'utilisateur est connecté
    // Note: Dashboard et FinalizeRegistration sont déjà gérés par isDashboardRoute
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

  // ✅ NOUVEAU : Déconnexion automatique après 2 heures d'inactivité
  const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
  const CHECK_INTERVAL = 60 * 1000; // Vérifier toutes les minutes
  let lastActivityTime = ref(Date.now());
  let inactivityCheckInterval = null;

  // Fonction pour mettre à jour le temps de dernière activité
  const updateLastActivity = () => {
    if (isLoggedIn.value) {
      lastActivityTime.value = Date.now();
      // Sauvegarder dans localStorage pour persister entre les rechargements de page
      localStorage.setItem('lastActivityTime', lastActivityTime.value.toString());
    }
  };

  // Événements utilisateur qui indiquent une activité
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  // Ajouter les écouteurs d'événements pour détecter l'activité
  const setupActivityTracking = () => {
    activityEvents.forEach(event => {
      document.addEventListener(event, updateLastActivity, { passive: true });
    });
  };

  // Retirer les écouteurs d'événements
  const removeActivityTracking = () => {
    activityEvents.forEach(event => {
      document.removeEventListener(event, updateLastActivity);
    });
  };

  // Fonction pour vérifier l'inactivité et déconnecter si nécessaire
  const checkInactivity = () => {
    if (!isLoggedIn.value) {
      return;
    }

    // Récupérer le temps de dernière activité depuis localStorage si disponible
    const savedLastActivity = localStorage.getItem('lastActivityTime');
    if (savedLastActivity) {
      lastActivityTime.value = parseInt(savedLastActivity, 10);
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime.value;

    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
      // 2 heures d'inactivité détectées, déconnecter l'utilisateur
      console.log('Déconnexion automatique après 2 heures d\'inactivité');
      
      // Afficher un message à l'utilisateur avant de le déconnecter
      alert('Vous avez été déconnecté automatiquement après 2 heures d\'inactivité pour des raisons de sécurité.');
      
      // Déconnecter l'utilisateur
      logout();
      
      // Nettoyer le localStorage
      localStorage.removeItem('lastActivityTime');
    }
  };

  // ✅ NOUVEAU : Fonction pour vérifier l'inactivité quand la page redevient visible
  const handleVisibilityChange = () => {
    if (!isLoggedIn.value) {
      return;
    }

    // Si la page redevient visible
    if (!document.hidden) {
      // Récupérer le temps de dernière activité depuis localStorage
      const savedLastActivity = localStorage.getItem('lastActivityTime');
      if (savedLastActivity) {
        const savedTime = parseInt(savedLastActivity, 10);
        const now = Date.now();
        const timeSinceLastActivity = now - savedTime;

        // Si 2 heures ou plus se sont écoulées depuis la dernière activité
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          console.log('Déconnexion automatique : retour après 2 heures d\'inactivité');
          
          // Afficher un message à l'utilisateur
          alert('Votre session a expiré après 2 heures d\'inactivité. Veuillez vous reconnecter.');
          
          // Déconnecter l'utilisateur
          logout();
          
          // Nettoyer le localStorage
          localStorage.removeItem('lastActivityTime');
        } else {
          // Si moins de 2 heures, mettre à jour le temps de dernière activité
          // car l'utilisateur revient sur la page
          lastActivityTime.value = Date.now();
          localStorage.setItem('lastActivityTime', lastActivityTime.value.toString());
        }
      }
    } else {
      // Si la page devient cachée (navigateur minimisé), sauvegarder le temps actuel
      if (isLoggedIn.value) {
        lastActivityTime.value = Date.now();
        localStorage.setItem('lastActivityTime', lastActivityTime.value.toString());
      }
    }
  };

  // Initialiser le suivi d'activité et la vérification d'inactivité
  onMounted(() => {
    // Récupérer le temps de dernière activité depuis localStorage si disponible
    const savedLastActivity = localStorage.getItem('lastActivityTime');
    if (savedLastActivity) {
      lastActivityTime.value = parseInt(savedLastActivity, 10);
      
      // ✅ NOUVEAU : Vérifier immédiatement si 2 heures se sont écoulées au chargement de la page
      if (isLoggedIn.value) {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityTime.value;
        
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          console.log('Déconnexion automatique : session expirée au chargement de la page');
          alert('Votre session a expiré après 2 heures d\'inactivité. Veuillez vous reconnecter.');
          logout();
          localStorage.removeItem('lastActivityTime');
          return; // Ne pas continuer l'initialisation si l'utilisateur est déconnecté
        }
      }
    } else if (isLoggedIn.value) {
      // Si l'utilisateur est connecté mais qu'il n'y a pas de temps sauvegardé, initialiser avec maintenant
      lastActivityTime.value = Date.now();
      localStorage.setItem('lastActivityTime', lastActivityTime.value.toString());
    }

    // Configurer le suivi d'activité
    setupActivityTracking();

    // Démarrer la vérification périodique de l'inactivité
    inactivityCheckInterval = setInterval(checkInactivity, CHECK_INTERVAL);

    // ✅ NOUVEAU : Ajouter l'écouteur pour détecter quand la page redevient visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  // Nettoyer les écouteurs et l'intervalle lors du démontage
  onUnmounted(() => {
    removeActivityTracking();
    if (inactivityCheckInterval) {
      clearInterval(inactivityCheckInterval);
    }
    // ✅ NOUVEAU : Retirer l'écouteur de visibilité
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  // Surveiller les changements de statut de connexion
  watch(isLoggedIn, (newValue) => {
    if (newValue) {
      // Utilisateur connecté : initialiser le suivi d'activité
      lastActivityTime.value = Date.now();
      localStorage.setItem('lastActivityTime', lastActivityTime.value.toString());
      setupActivityTracking();
      
      // Démarrer la vérification si elle n'est pas déjà active
      if (!inactivityCheckInterval) {
        inactivityCheckInterval = setInterval(checkInactivity, CHECK_INTERVAL);
      }
      
      // ✅ NOUVEAU: Nettoyer les anciens cookies de session APRÈS que l'utilisateur soit connecté
      // Cela évite de supprimer le cookie de session actif au rechargement
      // Désactivé temporairement pour éviter les erreurs - sera réactivé si nécessaire
      // setTimeout(() => {
      //   try {
      //     const allCookies = document.cookie.split(';').filter(c => c.trim());
      //     if (allCookies.length > 10) {
      //       // Nettoyage des cookies désactivé pour éviter les problèmes
      //     }
      //   } catch (error) {
      //     console.error('[App.vue] Erreur lors du nettoyage des cookies:', error);
      //   }
      // }, 2000);
    } else {
      // Utilisateur déconnecté : nettoyer
      removeActivityTracking();
      localStorage.removeItem('lastActivityTime');
      if (inactivityCheckInterval) {
        clearInterval(inactivityCheckInterval);
        inactivityCheckInterval = null;
      }
    }
  });
</script>
