import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/api";

export function useOrderManagement(user) {
  const route = useRoute();

  // Références liées à la gestion des commandes
  const orders = ref([]);
  const selectedOrderId = ref(null);
  const showOrderSelection = ref(false);
  const isLoading = ref(true);
  const loadingError = ref("");

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
  const loadOrders = async () => {
    // ✅ S'assurer que isLoading reste true pendant le chargement
    isLoading.value = true;
    try {
      const response = await apiClient.get("/api/orders");
      // S'assurer que response.data est un tableau
      orders.value = Array.isArray(response.data) ? response.data : [];
      return orders.value;
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      loadingError.value = "Erreur lors du chargement de vos commandes.";
      return [];
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
    isLoading.value = true;
    loadingError.value = "";
    try {
      if (!user.value) {
        console.error("useOrderManagement: User is null on mount!");
        loadingError.value = "Impossible de charger les informations. Veuillez rafraîchir.";
        isLoading.value = false;
        return;
      }

      await loadOrders();
      const availableOrders = orders.value.filter((o) => o.status !== "cancelled");
      const orderIdFromQuery = route.query.orderId;

      if (orderIdFromQuery) {
        selectedOrderId.value = parseInt(orderIdFromQuery);
        showOrderSelection.value = false;
      } else if (availableOrders.length === 0) {
        showOrderSelection.value = true;
      } else if (availableOrders.length === 1) {
        selectedOrderId.value = availableOrders[0].id;
        showOrderSelection.value = false;
      } else {
        showOrderSelection.value = true;
      }
    } catch (error) {
      console.error("useOrderManagement: Error during onMounted:", error);
      loadingError.value = "Erreur lors du chargement de vos paramètres.";
    } finally {
      // ✅ CRITIQUE: Ne mettre isLoading à false que si on affiche la sélection de commande
      // Cela garantit que le skeleton s'affiche pendant le chargement
      if (showOrderSelection.value) {
        // Délai minimum pour que le skeleton "Paramétrer votre Carte" soit visible
        setTimeout(() => {
          isLoading.value = false;
        }, 350);
      } else {
        // Si une commande est sélectionnée, isLoading reste true pour le skeleton du formulaire
        // Il sera géré par useCardSettings
      }
    }
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

