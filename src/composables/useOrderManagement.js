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

  // Fonction utilitaire (déplacée depuis SettingsView)
  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
    if (avatarUrl.startsWith("/storage/")) {
      return backendUrl + avatarUrl;
    } else if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
      return avatarUrl;
    } else {
      return backendUrl + "/" + avatarUrl.replace(/^\//, "");
    }
  };

  // Logique de chargement des commandes
  const loadOrders = async () => {
    try {
      const response = await apiClient.get("/orders");
      orders.value = response.data;
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
      // Si on doit charger les données de la carte, on le laisse en chargement
      // C'est le composable useCardSettings qui s'en chargera
      if (showOrderSelection.value) {
        isLoading.value = false;
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

