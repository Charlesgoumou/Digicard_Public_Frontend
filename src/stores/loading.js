import { ref } from "vue";
import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const isHomePageLoading = ref(false);

  function setHomePageLoading(value) {
    isHomePageLoading.value = value;
  }

  return {
    isHomePageLoading,
    setHomePageLoading,
  };
});



