<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement de la page...</p>
    </div>
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center p-8">
      <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Page non trouvée</h2>
      <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
      <button
        @click="$router.push('/')"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>

  <PageTemplate v-else :pageData="pageData" />
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import apiClient from "@/api";
  import PageTemplate from "../components/PageTemplate.vue";

  const route = useRoute();
  const router = useRouter();

  const loading = ref(true);
  const error = ref(false);
  const errorMessage = ref("");
  const pageData = ref({});

  const loadCompanyPage = async () => {
    try {
      loading.value = true;
      error.value = false;

      const code = route.params.code;
      const username = route.params.username;

      let apiUrl;
      if (code) {
        apiUrl = `/api/e/${code}`;
      } else {
        const orderId = route.query.order;
        apiUrl = `/api/company/${username}`;
        if (orderId) apiUrl += `?order=${orderId}`;
      }

      const response = await apiClient.get(apiUrl);

      if (response.data && response.data.pageData) {
        pageData.value = response.data.pageData;
      } else {
        throw new Error("Données de page invalides");
      }
    } catch (err) {
      console.error("Erreur lors du chargement de la page entreprise:", err);
      error.value = true;

      if (err.response && err.response.status === 404) {
        const msg = err.response?.data?.message;
        errorMessage.value =
          typeof msg === "string" && msg.trim()
            ? msg
            : "Cette page d'entreprise n'existe pas ou n'est pas encore publiée.";
      } else {
        errorMessage.value = "Une erreur est survenue lors du chargement de la page.";
      }
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadCompanyPage();
  });

  watch(
    () => [route.params.code, route.params.username],
    () => {
      loadCompanyPage();
    },
  );
</script>

<style scoped>
  /* Styles personnalisés si nécessaire */
</style>
