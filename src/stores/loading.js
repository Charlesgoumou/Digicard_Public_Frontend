import { ref } from "vue";
import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const isHomePageLoading = ref(false);
  /** true une fois DashboardView monté — permet de masquer l’overlay skeleton pendant le lazy-load */
  const dashboardViewMounted = ref(false);

  function setHomePageLoading(value) {
    isHomePageLoading.value = value;
  }

  function setDashboardViewMounted(value) {
    dashboardViewMounted.value = value;
  }

  return {
    isHomePageLoading,
    setHomePageLoading,
    dashboardViewMounted,
    setDashboardViewMounted,
  };
});



