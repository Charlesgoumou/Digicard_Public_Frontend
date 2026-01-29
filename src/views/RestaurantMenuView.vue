<template>
  <div class="min-h-screen bg-slate-900 pt-20 sm:pt-32 text-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Bouton Retour -->
      <div class="mb-6">
        <button
          @click="goToDashboard"
          type="button"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg
            class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">Retour au Dashboard</span>
        </button>
      </div>

      <!-- Skeleton Screen -->
      <div v-if="isLoading" class="max-w-4xl mx-auto">
        <div class="h-8 w-64 bg-slate-700 rounded mx-auto mb-8 animate-pulse"></div>
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
            <div class="h-6 w-48 bg-slate-700 rounded mb-4"></div>
            <div class="h-32 w-full bg-slate-700 rounded mb-4"></div>
            <div class="h-4 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Contenu du Menu -->
      <div v-else-if="menu" class="max-w-4xl mx-auto">
        <!-- En-tête -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">{{ portfolio?.hero_headline || portfolio?.name || 'Menu du jour' }}</h1>
          <p v-if="portfolio?.bio" class="text-slate-300 text-lg">{{ portfolio.bio }}</p>
        </div>

        <!-- Section Plats -->
        <div v-if="menu.dishes && menu.dishes.length > 0" class="mb-12">
          <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🍽️</span>
            <span>Nos Plats</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(dish, index) in menu.dishes"
              :key="index"
              :class="[
                'bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300',
                dish.available ? 'border-slate-700 hover:border-indigo-500' : 'border-red-500/50 opacity-60'
              ]"
            >
              <!-- Image du plat -->
              <div v-if="dish.image" class="mb-4">
                <img
                  :src="dish.image"
                  :alt="dish.name"
                  class="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div v-else class="mb-4 h-48 bg-slate-700 rounded-lg flex items-center justify-center">
                <span class="text-6xl">🍽️</span>
              </div>

              <!-- Informations du plat -->
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-white">{{ dish.name }}</h3>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    dish.available
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  ]"
                >
                  {{ dish.available ? 'Disponible' : 'Indisponible' }}
                </span>
              </div>

              <!-- Prix -->
              <div class="text-2xl font-bold text-indigo-400 mb-3">
                {{ formatPrice(dish.price) }}
              </div>

              <!-- Description -->
              <p v-if="dish.description" class="text-slate-300 mb-4">{{ dish.description }}</p>

              <!-- Accompagnements -->
              <div v-if="dish.hasSides && dish.sides && dish.sides.length > 0" class="mt-4">
                <p class="text-sm font-semibold text-slate-400 mb-2">Accompagnements :</p>
                <ul class="list-disc list-inside text-slate-300 text-sm space-y-1">
                  <li v-for="(side, sideIndex) in dish.sides" :key="sideIndex">{{ side }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Boissons -->
        <div v-if="menu.drinks && menu.drinks.length > 0" class="mb-12">
          <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
            <span>🥤</span>
            <span>Nos Boissons</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(drink, index) in menu.drinks"
              :key="index"
              :class="[
                'bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300',
                drink.available ? 'border-slate-700 hover:border-indigo-500' : 'border-red-500/50 opacity-60'
              ]"
            >
              <!-- Image de la boisson -->
              <div v-if="drink.image" class="mb-4">
                <img
                  :src="drink.image"
                  :alt="drink.name"
                  class="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div v-else class="mb-4 h-48 bg-slate-700 rounded-lg flex items-center justify-center">
                <span class="text-6xl">🥤</span>
              </div>

              <!-- Informations de la boisson -->
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-white">{{ drink.name }}</h3>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    drink.available
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  ]"
                >
                  {{ drink.available ? 'Disponible' : 'Indisponible' }}
                </span>
              </div>

              <!-- Prix -->
              <div class="text-2xl font-bold text-indigo-400">
                {{ formatPrice(drink.price) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Message si le menu est vide -->
        <div v-if="(!menu.dishes || menu.dishes.length === 0) && (!menu.drinks || menu.drinks.length === 0)" class="text-center py-12">
          <p class="text-slate-400 text-lg">Aucun plat ou boisson configuré pour le moment.</p>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="max-w-4xl mx-auto text-center py-12">
        <p class="text-red-400 text-lg">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import apiClient from "@/api";

  const router = useRouter();
  const { user } = useAuth();

  const menu = ref(null);
  const portfolio = ref(null);
  const isLoading = ref(true);
  const error = ref(null);

  const formatPrice = (price) => {
    if (!price || price === 0) return "Gratuit";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const goToDashboard = () => {
    router.push({ name: "Dashboard" });
  };

  const loadMenu = async () => {
    if (!user.value) {
      error.value = "Vous devez être connecté pour voir votre menu.";
      isLoading.value = false;
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      // Récupérer le portfolio
      const response = await apiClient.get("/api/user-portfolio");
      portfolio.value = response.data;

      // Vérifier que c'est un profil restaurant
      if (portfolio.value.profile_type !== "restaurant") {
        error.value = "Ce profil n'est pas un restaurant.";
        isLoading.value = false;
        return;
      }

      // Récupérer le menu
      if (portfolio.value.menu) {
        menu.value = portfolio.value.menu;
      } else {
        menu.value = { dishes: [], drinks: [] };
      }
    } catch (err) {
      console.error("Erreur lors du chargement du menu:", err);
      error.value = err.response?.data?.message || "Erreur lors du chargement du menu.";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    loadMenu();
  });
</script>

<style scoped>
  /* Styles personnalisés si nécessaire */
</style>
