import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/api";

export function useOrderManagement(user) {
  const route = useRoute();

  // ✅ PERF: cache mémoire des commandes (évite re-fetch à chaque navigation vers /parametres)
  const ORDERS_CACHE = (globalThis.__DIGICARD_ORDERS_CACHE__ ||= {
    value: null,
    ts: 0,
    inFlight: null,
  });
  const ORDERS_TTL_MS = 60_000; // 60s

  // Références liées à la gestion des commandes
  // Initialiser immédiatement depuis le cache si disponible
  const orders = ref(Array.isArray(ORDERS_CACHE.value) ? ORDERS_CACHE.value : []);
  const selectedOrderId = ref(null);
  const showOrderSelection = ref(false);
  // ⚠️ Ne pas considérer un cache "vide" comme fiable pour afficher "Aucune commande"
  // (sinon on peut flasher cet écran alors que l'API va répondre avec des commandes).
  const hasUsableFreshCache =
    Array.isArray(ORDERS_CACHE.value) && ORDERS_CACHE.value.length > 0 && Date.now() - ORDERS_CACHE.ts < ORDERS_TTL_MS;
  const isLoading = ref(!hasUsableFreshCache);
  const loadingError = ref("");

  // ✅ UX: éviter un état "creux" (ni liste, ni formulaire) quand on affiche depuis le cache
  const applySelectionLogic = () => {
    const availableOrders = (orders.value || []).filter((o) => o?.status !== "cancelled");
    const orderIdFromQuery = route.query.orderId;

    if (orderIdFromQuery) {
      selectedOrderId.value = parseInt(orderIdFromQuery);
      showOrderSelection.value = false;
      return;
    }

    if (availableOrders.length === 0) {
      selectedOrderId.value = null;
      showOrderSelection.value = true;
      return;
    }

    if (availableOrders.length === 1) {
      selectedOrderId.value = availableOrders[0].id;
      showOrderSelection.value = false;
      return;
    }

    selectedOrderId.value = null;
    showOrderSelection.value = true;
  };

  // Si on a déjà des commandes via cache, déterminer tout de suite quoi afficher
  if (Array.isArray(orders.value) && orders.value.length > 0) {
    applySelectionLogic();
  }

  // ✅ CORRECTION : Fonction utilitaire pour construire l'URL complète de l'avatar (gérer /api/storage/ et /storage/)
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

  // Logique de chargement des commandes
  const loadOrders = async (options = {}) => {
    const { preferCache = true, backgroundRefresh = true } = options;

    const now = Date.now();
    const hasFreshCache = Array.isArray(ORDERS_CACHE.value) && now - ORDERS_CACHE.ts < ORDERS_TTL_MS;
    const hasUsableCache = hasFreshCache && Array.isArray(ORDERS_CACHE.value) && ORDERS_CACHE.value.length > 0;

    // Si cache frais, afficher instantanément
    if (preferCache && hasUsableCache) {
      orders.value = ORDERS_CACHE.value;
      loadingError.value = "";
      isLoading.value = false;
      applySelectionLogic();

      // Optionnel: refresh silencieux
      if (!backgroundRefresh) {
        return orders.value;
      }
    }

    // Dédupliquer les appels concurrents
    if (ORDERS_CACHE.inFlight) {
      const v = await ORDERS_CACHE.inFlight;
      orders.value = Array.isArray(v) ? v : [];
      isLoading.value = false;
      applySelectionLogic();
      return orders.value;
    }

    // ✅ S'assurer que isLoading reste true pendant le chargement seulement si on n'a pas de cache frais
    if (!hasUsableCache) {
      isLoading.value = true;
    }
    try {
      try {
        // Réinitialiser le cookie CSRF avant de charger les commandes.
        // Important après des redirections externes (paiement) ou des PATCH qui peuvent invalider le token.
        await apiClient.get("/sanctum/csrf-cookie");
      } catch (e) {
        // Ne pas bloquer: le cookie peut déjà être présent.
        console.warn("useOrderManagement: Impossible de rafraîchir le cookie CSRF:", e);
      }

      ORDERS_CACHE.inFlight = (async () => {
        const response = await apiClient.get("/api/orders");
        const v = Array.isArray(response.data) ? response.data : [];
        ORDERS_CACHE.value = v;
        ORDERS_CACHE.ts = Date.now();
        return v;
      })();

      const v = await ORDERS_CACHE.inFlight;
      orders.value = Array.isArray(v) ? v : [];
      loadingError.value = "";
      applySelectionLogic();
      return orders.value;
    } catch (error) {
      // Si la session/CSRF vient d'expirer, tenter 1 retry après récupération CSRF.
      const status = error?.response?.status;
      if (status === 401 || status === 419) {
        try {
          await apiClient.get("/sanctum/csrf-cookie");
          const retry = await apiClient.get("/api/orders");
          const v = Array.isArray(retry.data) ? retry.data : [];
          ORDERS_CACHE.value = v;
          ORDERS_CACHE.ts = Date.now();
          orders.value = v;
          loadingError.value = "";
          applySelectionLogic();
          return orders.value;
        } catch (retryErr) {
          console.error("useOrderManagement: Retry /api/orders échoué:", retryErr);
        }
      }

      console.error("Erreur lors du chargement des commandes:", error);
      loadingError.value = "Erreur lors du chargement de vos commandes.";
      return [];
    } finally {
      ORDERS_CACHE.inFlight = null;
      isLoading.value = false;
    }
  };

  // Logique de sélection
  const selectOrder = (orderId) => {
    selectedOrderId.value = orderId;
    showOrderSelection.value = false;
  };

  const getSelectedOrder = () => {
    if (!selectedOrderId.value) return null;
    return orders.value.find((order) => order.id === selectedOrderId.value);
  };

  // Logique d'affichage (déplacée depuis SettingsView)
  const getCardQuantity = (order) => {
    if (order.employee_card_quantity !== undefined) {
      return order.employee_card_quantity;
    }
    return order.card_quantity || 0;
  };

  const isBusinessAdminInOrder = (order) => {
    return (
      user.value?.role === "business_admin" &&
      order.order_type === "business" &&
      order.employee_card_quantity !== undefined
    );
  };

  // Logique au montage (déplacée depuis SettingsView)
  onMounted(async () => {
    // ✅ CRITIQUE: S'assurer que isLoading est true dès le début pour afficher le skeleton
    loadingError.value = "";
    try {
      if (!user.value) {
        console.error("useOrderManagement: User is null on mount!");
        loadingError.value = "Impossible de charger les informations. Veuillez rafraîchir.";
        isLoading.value = false;
        return;
      }

      await loadOrders({ preferCache: true, backgroundRefresh: true });
      applySelectionLogic();
    } catch (error) {
      console.error("useOrderManagement: Error during onMounted:", error);
      loadingError.value = "Erreur lors du chargement de vos paramètres.";
    } finally {
      // ✅ PERF: si les commandes étaient déjà en cache, ne pas imposer de délai artificiel
      // (le skeleton de SettingsView est géré par isLoadingOrderData côté useCardSettings)
      if (!selectedOrderId.value) {
        isLoading.value = false;
      }
    }
  });

  // Recharger les commandes quand une commande est configurée ailleurs dans l'app
  window.addEventListener("order-configured", () => {
    loadOrders({ preferCache: false, backgroundRefresh: false });
  });

  // Retourner tout ce dont le composant a besoin
  return {
    orders,
    selectedOrderId,
    showOrderSelection,
    isLoading,
    loadingError,
    getAvatarUrl,
    loadOrders,
    selectOrder,
    getSelectedOrder,
    getCardQuantity,
    isBusinessAdminInOrder,
  };
}

