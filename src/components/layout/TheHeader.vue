<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 w-full">
    <div class="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between h-16 sm:h-20 gap-2">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-1.5 sm:gap-2 text-white font-bold text-base sm:text-xl lg:text-2xl flex-shrink-0"
        >
          <img src="@/assets/images/logo.png" alt="Logo Carte Digitale" class="h-7 sm:h-8 w-auto flex-shrink-0" />
          <span class="hidden sm:inline">Carte Digitale</span>
          <span class="sm:hidden text-sm">DC</span>
        </RouterLink>

        <!-- Navigation Desktop (masquée jusqu'à lg) -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2 flex-shrink">
          <RouterLink
            to="/"
            class="px-2 xl:px-4 py-2 text-sm xl:text-base text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >Accueil</RouterLink
          >
          <RouterLink
            to="/nos-cartes"
            class="px-2 xl:px-4 py-2 text-sm xl:text-base text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >Nos Cartes</RouterLink
          >
          <RouterLink
            to="/a-propos"
            class="px-2 xl:px-4 py-2 text-sm xl:text-base text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >À Propos</RouterLink
          >
          <RouterLink
            to="/contact"
            class="px-2 xl:px-4 py-2 text-sm xl:text-base text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >Contact</RouterLink
          >
        </nav>

        <!-- Boutons Desktop (à partir de md, mais très compacts) -->
        <div class="hidden md:flex items-center gap-1.5 lg:gap-3 flex-shrink-0">
          <template v-if="!isLoggedIn">
            <button
              @click="openAuthModal"
              class="text-[11px] lg:text-sm font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap px-1 lg:px-2"
            >
              Connexion
            </button>
            <button
              @click="openOrderModal"
              class="text-[10px] lg:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-full px-2.5 lg:px-5 py-1.5 lg:py-2.5 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/30 whitespace-nowrap"
            >
              <span class="hidden xl:inline">Commander ma carte</span>
              <span class="xl:hidden">Commander</span>
            </button>
          </template>

          <template v-else>
            <div class="relative">
              <button
                @click="isAccountMenuOpen = !isAccountMenuOpen"
                class="text-[11px] lg:text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center whitespace-nowrap gap-0.5"
              >
                <span class="hidden xl:inline">Mon Compte</span>
                <span class="xl:hidden">Compte</span>
                <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <transition name="fade">
                <div
                  v-if="isAccountMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 border border-slate-700 z-50"
                >
                  <RouterLink
                    to="/dashboard"
                    @click="isAccountMenuOpen = false"
                    class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >Tableau de bord</RouterLink
                  >
                  <RouterLink
                    v-if="user && user.role !== 'employee'"
                    to="/mes-commandes"
                    @click="isAccountMenuOpen = false"
                    class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >Mes commandes</RouterLink
                  >
                  <RouterLink
                    to="/parametres"
                    @click="isAccountMenuOpen = false"
                    class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >Paramètres</RouterLink
                  >
                  <RouterLink
                    to="/mon-compte"
                    @click="isAccountMenuOpen = false"
                    class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >Mon Compte</RouterLink
                  >
                </div>
              </transition>
            </div>
            <button
              @click="handleLogout"
              class="text-[11px] lg:text-sm font-semibold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap"
            >
              <span class="hidden xl:inline">Se Déconnecter</span>
              <span class="xl:hidden">Déco</span>
            </button>
          </template>
        </div>

        <!-- Menu hamburger (visible sur mobile et tablette) -->
        <div class="md:hidden lg:hidden flex-shrink-0">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-300 hover:text-white p-1">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu mobile -->
    <transition name="slide-fade">
      <div v-if="isMobileMenuOpen" class="md:hidden bg-slate-900 border-t border-slate-800">
        <nav class="flex flex-col items-center p-4 space-y-2">
          <RouterLink
            to="/"
            @click="isMobileMenuOpen = false"
            class="block w-full text-center py-2 text-slate-300 hover:text-white"
            >Accueil</RouterLink
          >
          <RouterLink
            to="/nos-cartes"
            @click="isMobileMenuOpen = false"
            class="block w-full text-center py-2 text-slate-300 hover:text-white"
            >Nos Cartes</RouterLink
          >
          <RouterLink
            to="/a-propos"
            @click="isMobileMenuOpen = false"
            class="block w-full text-center py-2 text-slate-300 hover:text-white"
            >À Propos</RouterLink
          >
          <RouterLink
            to="/contact"
            @click="isMobileMenuOpen = false"
            class="block w-full text-center py-2 text-slate-300 hover:text-white"
            >Contact</RouterLink
          >
        </nav>
        <div class="p-4 space-y-4 border-t border-slate-800">
          <template v-if="!isLoggedIn">
            <button
              @click="openOrderModalAndCloseMenu"
              class="block w-full text-center text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-full px-5 py-2.5 font-semibold"
            >
              Commander ma carte
            </button>
            <button @click="openAuthModalAndCloseMenu" class="block w-full text-center text-slate-300">
              Se Connecter
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/dashboard"
              @click="isMobileMenuOpen = false"
              class="block w-full text-center py-2 text-slate-300 hover:text-white"
              >Tableau de bord</RouterLink
            >
            <RouterLink
              v-if="user && user.role !== 'employee'"
              to="/mes-commandes"
              @click="isMobileMenuOpen = false"
              class="block w-full text-center py-2 text-slate-300 hover:text-white"
              >Mes commandes</RouterLink
            >
            <RouterLink
              to="/parametres"
              @click="isMobileMenuOpen = false"
              class="block w-full text-center py-2 text-slate-300 hover:text-white"
              >Paramètres</RouterLink
            >
            <RouterLink
              to="/mon-compte"
              @click="isMobileMenuOpen = false"
              class="block w-full text-center py-2 text-slate-300 hover:text-white"
              >Mon Compte</RouterLink
            >
            <button
              @click="handleLogoutAndCloseMenu"
              class="block w-full text-center py-2 text-red-400 hover:text-red-300"
            >
              Se Déconnecter
            </button>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import { useOrderModal } from "@/composables/useOrderModal";

  // Récupère l'état de connexion et la fonction logout
  const { isLoggedIn, user, logout, openAuthModal } = useAuth();
  const { openOrderModal } = useOrderModal();

  const isMobileMenuOpen = ref(false);
  const isAccountMenuOpen = ref(false); // Pour le menu déroulant desktop

  const openAuthModalAndCloseMenu = () => {
    openAuthModal();
    isMobileMenuOpen.value = false;
  };

  const openOrderModalAndCloseMenu = () => {
    openOrderModal();
    isMobileMenuOpen.value = false;
  };

  // Gère la déconnexion
  const handleLogout = () => {
    isAccountMenuOpen.value = false; // Ferme le menu déroulant si ouvert
    logout();
  };

  // Gère la déconnexion depuis le menu mobile
  const handleLogoutAndCloseMenu = () => {
    logout();
    isMobileMenuOpen.value = false;
  };
</script>

<style scoped>
  /* Styles pour la transition fade (utilisée pour le menu déroulant) */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease-out;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Styles pour slide-fade (menu mobile) */
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }

  /* Soulignement pour les liens nav (optionnel, déjà présent) */
  .group:hover .scale-x-0 {
    transform: scaleX(1);
  }
  .group .scale-x-0 {
    transform-origin: left;
  }
</style>
