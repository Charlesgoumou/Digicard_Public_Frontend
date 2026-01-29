<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <!-- ✅ OPTIMISATION: Afficher le contenu immédiatement même si user n'est pas encore chargé -->
    <!-- L'avatar sera affiché dès que user.value.avatar_url est disponible -->
    <div
      class="w-full h-64 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center"
    >
      <div class="text-center relative">
        <!-- Skeleton header (avatar + nom + société) quand user non chargé -->
        <template v-if="!user">
          <div class="w-40 h-40 mx-auto rounded-full border-4 border-slate-700 bg-slate-700 animate-pulse" />
          <div class="mt-4 h-9 w-56 bg-slate-700 rounded animate-pulse mx-auto" />
          <div class="mt-2 h-6 w-36 bg-slate-700 rounded animate-pulse mx-auto" />
        </template>
        <template v-else>
          <div
            @click="openFileInput"
            class="relative w-40 h-40 mx-auto rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center cursor-pointer group overflow-hidden"
          >
            <img
              v-if="userAvatarUrl"
              :src="userAvatarUrl"
              :key="userAvatarUrl"
              class="w-full h-full object-cover"
              alt="Avatar actuel"
              @load="avatarImageLoaded = true"
              @error="handleAvatarError"
            />
            <svg v-else class="w-20 h-20 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <!-- Skeleton overlay sur la photo pendant le chargement de l'image -->
            <div
              v-if="userAvatarUrl && !avatarImageLoaded"
              class="absolute inset-0 rounded-full bg-slate-700 animate-pulse"
              aria-hidden="true"
            />
            <div
              class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <!-- Skeleton nom / société tant que le dashboard n'est pas prêt -->
          <div v-if="!isDashboardReady" class="mt-4 space-y-2">
            <div class="h-9 w-56 bg-slate-700 rounded animate-pulse mx-auto" />
            <div class="h-6 w-36 bg-slate-700 rounded animate-pulse mx-auto" />
          </div>
          <template v-else>
            <h1 class="mt-4 text-3xl font-bold tracking-tight">{{ user.name }}</h1>
            <p v-if="user.company_name" class="text-lg text-slate-400">{{ user.company_name }}</p>
          </template>
        </template>
      </div>
    </div>
    <!-- ✅ SUPPRIMÉ: Le skeleton loader bloquant - le contenu s'affiche maintenant immédiatement -->

    <!-- ✅ OPTIMISATION: Afficher le contenu immédiatement, même si user n'est pas encore chargé -->
    <div class="container mx-auto px-4 py-12">
      <!-- Skeleton titre + cartes quand user non chargé -->
      <div v-if="!user" class="max-w-4xl mx-auto">
        <div class="h-10 w-72 bg-slate-700 rounded animate-pulse mx-auto mb-12" />
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3" />
            <div class="h-4 w-24 bg-slate-700 rounded mb-2" />
            <div class="h-3 w-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>

      <div v-else-if="user?.role === 'individual'">
        <div v-if="!isDashboardReady" class="h-12 w-96 max-w-full bg-slate-700 rounded animate-pulse mx-auto mb-12" />
        <h1 v-else class="text-4xl font-bold text-center mb-12">Bienvenue, {{ user?.name || "Chargement..." }} !</h1>
        
        <!-- Skeleton Screen pour les cartes du dashboard -->
        <div 
          v-if="!isDashboardReady"
          class="grid gap-4 md:gap-5 max-w-4xl mx-auto"
          :class="hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'"
        >
          <!-- Skeleton Card 1 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 2 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 3 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 4 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 5 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 6 (si appointments enabled) -->
          <div 
            v-if="hasAppointmentsEnabled"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>
        
        <div 
          v-else
          class="grid gap-4 md:gap-5 max-w-4xl mx-auto"
          :class="hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'"
        >
          <button
            @click="goToSettings"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">⚙️</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Paramétrer ma Carte</h2>
            <p class="text-xs text-slate-400">Configurez votre profil.</p>
          </button>
          <button
            @click="viewPublicProfile"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">{{ isRestaurantProfile ? '🍽️' : '👀' }}</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">{{ isRestaurantProfile ? 'Menu du jour' : 'Afficher mon Profil' }}</h2>
            <p class="text-xs text-slate-400">{{ isRestaurantProfile ? 'Consultez votre menu' : 'Voyez votre profil.' }}</p>
          </button>
          <button
            @click="goToOrders"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">🛒</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Commandes</h2>
            <p class="text-xs text-slate-400">Consultez historique.</p>
          </button>
          <!-- Carte "Mes Rendez-vous" -->
          <button
            v-if="hasAppointmentsEnabled"
            @click="showAppointmentsModal = true"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📅</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Rendez-vous</h2>
            <p class="text-xs text-slate-400 mb-1">Gérez vos rendez-vous.</p>
            <span v-if="appointmentsCount > 0" class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30">
              {{ appointmentsCount }} rendez-vous
            </span>
          </button>
          <!-- Carte "Mes Contacts" -->
          <button
            @click="showContactsModal = true"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📇</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Contacts</h2>
            <p class="text-xs text-slate-400 mb-1">Contacts reçus.</p>
            <span v-if="newContactsCount > 0" class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30">
              {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? 'x' : '' }}
            </span>
          </button>
          <!-- Carte "Marketplace" -->
          <button
            @click="goToMarketplace"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">🛍️</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Marketplace</h2>
            <p class="text-xs text-slate-400">Acheter et Vendre</p>
          </button>
        </div> <!-- Fin de la grille individual -->
      </div> <!-- Fin du v-if individual -->

      <div v-else-if="user?.role === 'business_admin'">
        <div v-if="!isDashboardReady" class="h-12 w-80 max-w-full bg-slate-700 rounded animate-pulse mx-auto mb-12" />
        <h1 v-else class="text-4xl font-bold text-center mb-12">Espace Entreprise</h1>
        
        <!-- Skeleton Screen pour les cartes du dashboard business_admin -->
        <div
          v-if="!isDashboardReady"
          class="grid gap-4 md:gap-5 mb-16"
          :class="hasBusinessOrder 
            ? (hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 max-w-8xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto')
            : (hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto')"
        >
          <!-- Skeleton Card 1 (Tableau de bord si hasBusinessOrder) -->
          <div 
            v-if="hasBusinessOrder"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 2 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 3 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 4 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 5 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 6 (si appointments enabled) -->
          <div 
            v-if="hasAppointmentsEnabled"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 7 (Marketplace) -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>
        
        <div
          v-else
          class="grid gap-4 md:gap-5 mb-16"
          :class="hasBusinessOrder 
            ? (hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 max-w-8xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto')
            : (hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto')"
        >
          <button
            v-if="hasBusinessOrder"
            @click="scrollToEmployeeSection"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📊</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Tableau de bord</h2>
            <p class="text-xs text-slate-400">Gérez votre personnel.</p>
          </button>
          <button
            @click="goToSettings"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">⚙️</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Paramétrer ma Carte</h2>
            <p class="text-xs text-slate-400">Configurez votre profil.</p>
          </button>
          <button
            @click="viewPublicProfile"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">{{ isRestaurantProfile ? '🍽️' : '👀' }}</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">{{ isRestaurantProfile ? 'Menu du jour' : 'Afficher mon Profil' }}</h2>
            <p class="text-xs text-slate-400">{{ isRestaurantProfile ? 'Consultez votre menu' : 'Voyez votre profil.' }}</p>
          </button>
          <button
            @click="goToOrders"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">🛒</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Commandes</h2>
            <p class="text-xs text-slate-400">Consultez historique.</p>
          </button>
          <!-- Carte "Mes Rendez-vous" pour les business_admin -->
          <button
            v-if="hasAppointmentsEnabled"
            @click="showAppointmentsModal = true"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📅</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Rendez-vous</h2>
            <p class="text-xs text-slate-400 mb-1">Gérez vos rendez-vous.</p>
            <span v-if="appointmentsCount > 0" class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30">
              {{ appointmentsCount }} RDV
            </span>
          </button>
          <!-- Carte "Mes Contacts" pour les business_admin -->
          <button
            @click="showContactsModal = true"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📇</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Contacts</h2>
            <p class="text-xs text-slate-400 mb-1">Contacts reçus.</p>
            <span v-if="newContactsCount > 0" class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30">
              {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? 'x' : '' }}
            </span>
          </button>
          <!-- Carte "Marketplace" pour les business_admin -->
          <button
            @click="goToMarketplace"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">🛍️</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Marketplace</h2>
            <p class="text-xs text-slate-400">Acheter et Vendre</p>
          </button>
        </div>

        <!-- Skeleton Screen pour la section "Gérer le Personnel" -->
        <div
          v-if="!isDashboardReady && hasBusinessOrder"
          id="employee-section"
          class="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700 scroll-mt-24 animate-pulse"
        >
          <!-- Skeleton Titre -->
          <div class="h-8 w-48 bg-slate-700 rounded mb-6"></div>
          
          <!-- Skeleton Sélecteur de commande -->
          <div class="mb-6">
            <div class="h-5 w-40 bg-slate-700 rounded mb-3"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="h-24 bg-slate-700/50 rounded-xl border border-slate-600"></div>
              <div class="h-24 bg-slate-700/50 rounded-xl border border-slate-600"></div>
            </div>
          </div>
          
          <!-- Skeleton Liste des slots (3 éléments) -->
          <div class="space-y-4">
            <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                  <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                  <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
            <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                  <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                  <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
            <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                  <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                  <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- ✅ Masquer la section "Tableau de bord" jusqu'à ce que le chargement soit terminé -->
        <div
          v-else-if="isDashboardReady && hasBusinessOrder"
          id="employee-section"
          class="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700 scroll-mt-24"
        >
          <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Gérer le Personnel</h2>

          <!-- ✅ NOUVEAU: Sélecteur de commande avec design attrayant -->
          <div v-if="businessOrders.length > 1" class="mb-6">
            <label class="block text-sm font-medium text-slate-300 mb-3">Sélectionner une commande :</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                v-for="order in businessOrders"
                :key="order.id"
                @click="selectBusinessOrder(order.id)"
                :class="[
                  'p-4 rounded-xl border-2 transition-all duration-300 text-left',
                  selectedOrderId === order.id
                    ? 'bg-sky-500/20 border-sky-500 shadow-lg shadow-sky-500/30'
                    : 'bg-slate-700/50 border-slate-600 hover:border-sky-400 hover:bg-slate-700',
                ]"
              >
                <div class="flex items-start gap-3">
                  <!-- Icône de commande -->
                  <div
                    :class="[
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedOrderId === order.id ? 'bg-sky-500' : 'bg-slate-600',
                    ]"
                  >
                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <!-- Informations de la commande -->
                  <div class="flex-1 min-w-0">
                    <p
                      :class="[
                        'font-semibold text-sm truncate',
                        selectedOrderId === order.id ? 'text-sky-400' : 'text-white',
                      ]"
                    >
                      Commande #{{ order.order_number }}
                    </p>
                    <div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {{ order.total_employees }} pers.
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                        {{ order.card_quantity }} carte{{ order.card_quantity > 1 ? "s" : "" }}
                      </span>
                    </div>
                  </div>
                  <!-- Icône de sélection -->
                  <div v-if="selectedOrderId === order.id" class="flex-shrink-0">
                    <svg class="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Skeleton Loader pour les slots -->
          <div v-if="isLoadingSlots" class="space-y-4 animate-pulse">
            <!-- Skeleton Slot 1 -->
            <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                  <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                  <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-28 bg-slate-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
            <!-- Skeleton Slot 2 -->
            <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                  <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                  <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-28 bg-slate-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
            <!-- Skeleton Slot 3 -->
            <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                  <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                  <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                  <div class="h-5 sm:h-6 w-24 sm:w-28 bg-slate-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
            <p class="text-center text-slate-400 text-xs sm:text-sm mt-4">Chargement du personnel...</p>
          </div>

          <!-- Liste des slots -->
          <div v-else-if="currentOrderSlots.length > 0" class="space-y-4">
            <div
              v-for="slot in currentOrderSlots"
              :key="slot.slot_number"
              class="bg-slate-700/30 rounded-lg border border-slate-600 p-3 sm:p-4 transition-all hover:border-slate-500"
            >
              <!-- Slot non assigné -->
              <div v-if="!slot.is_assigned" class="space-y-3">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span
                      class="px-2 sm:px-3 py-1 bg-slate-600 text-slate-200 rounded-full text-xs sm:text-sm font-semibold border border-slate-500 whitespace-nowrap"
                    >
                      Personnel {{ slot.display_number }}
                    </span>
                    <span
                      class="px-2 sm:px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30 whitespace-nowrap"
                    >
                      {{ slot.cards_quantity }} carte{{ slot.cards_quantity > 1 ? "s" : "" }}
                    </span>
                    <span
                      class="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-500/30 whitespace-nowrap"
                    >
                      ⏳ Non assigné
                    </span>
                  </div>
                </div>

                <form @submit.prevent="assignSlot(slot)" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    v-model.trim="slot.temp_name"
                    type="text"
                    placeholder="Nom complet"
                    required
                    class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <input
                    v-model.trim="slot.temp_email"
                    type="email"
                    placeholder="Email"
                    required
                    class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <button
                    type="submit"
                    :disabled="slot.isAssigning"
                    class="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <svg v-if="slot.isAssigning" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{ slot.isAssigning ? "Assignation..." : "✓ Assigner" }}
                  </button>
                </form>

                <p v-if="slot.feedback" :class="slot.isError ? 'text-red-400' : 'text-green-400'" class="text-sm mt-2">
                  {{ slot.feedback }}
                </p>
              </div>

              <!-- Slot assigné -->
              <div
                v-else
                @click="openEmployeeModal(slot)"
                class="cursor-pointer hover:bg-slate-700/50 transition-colors rounded-lg p-2 -m-2"
              >
                <div class="flex items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span
                        class="px-2 sm:px-3 py-1 bg-slate-600 text-slate-200 rounded-full text-xs sm:text-sm font-semibold border border-slate-500 whitespace-nowrap"
                      >
                        Personnel {{ slot.display_number }}
                      </span>
                      <strong class="text-white font-semibold text-base sm:text-lg break-words">{{
                        slot.employee_name
                      }}</strong>
                      <span
                        class="px-2 sm:px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30 whitespace-nowrap"
                      >
                        {{ slot.cards_quantity }} carte{{ slot.cards_quantity > 1 ? "s" : "" }}
                      </span>
                      <span
                        :class="
                          slot.is_configured
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        "
                        class="px-2 sm:px-3 py-1 rounded-full text-xs border whitespace-nowrap"
                      >
                        {{ slot.is_configured ? "✓ Configuré" : "⏳ Non configuré" }}
                      </span>
                    </div>
                    <p class="text-slate-400 text-xs sm:text-sm break-words">{{ slot.employee_email }}</p>
                  </div>
                  <svg
                    class="w-5 h-5 text-slate-400 flex-shrink-0 mt-1 sm:mt-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <p v-else class="text-slate-400 italic text-center py-8">Aucun personnel dans cette commande.</p>
        </div>

        <!-- Modal de Gestion d'Employé -->
        <div
          v-if="showEmployeeModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="closeEmployeeModal"
        >
          <div class="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow-2xl border border-slate-700">
            <!-- Modal de confirmation de suppression -->
            <div v-if="showDeleteConfirmation" class="space-y-6">
              <div class="text-center">
                <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full">
                  <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Confirmer la suppression</h3>
                <p class="text-slate-300 mb-2">Voulez-vous supprimer ce personnel ?</p>
                <p v-if="selectedEmployee" class="font-semibold text-white text-lg">{{ selectedEmployee.name }}</p>
              </div>

              <div class="flex gap-3">
                <button
                  @click="cancelDelete"
                  :disabled="isProcessing"
                  class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  NON
                </button>
                <button
                  @click="confirmDelete"
                  :disabled="isProcessing"
                  class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg v-if="isProcessing" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{{ isProcessing ? "Suppression..." : "OUI" }}</span>
                </button>
              </div>
            </div>

            <!-- Menu principal de gestion -->
            <div v-else-if="selectedEmployee">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">Gérer le Personnel</h3>
                <button @click="closeEmployeeModal" class="text-slate-400 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="space-y-6">
                <!-- Informations de l'employé -->
                <div class="bg-slate-700/30 rounded-lg p-4">
                  <p class="text-white font-semibold text-lg">{{ selectedEmployee.name }}</p>
                  <p class="text-slate-400 text-sm">{{ selectedEmployee.email }}</p>
                  <div class="flex items-center gap-3 mt-3">
                    <span
                      :class="selectedEmployee.email_verified_at ? 'text-green-400' : 'text-yellow-400'"
                      class="text-xs"
                    >
                      {{ selectedEmployee.email_verified_at ? "✓ Vérifié" : "⏳ En attente de vérification" }}
                    </span>
                    <div
                      v-if="selectedEmployee.total_cards > 0"
                      class="flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/30"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      <span class="text-sm font-semibold"
                        >{{ selectedEmployee.total_cards }} carte{{ selectedEmployee.total_cards > 1 ? "s" : "" }}</span
                      >
                    </div>
                    <div v-else class="px-3 py-1 bg-slate-600/30 text-slate-400 rounded-full text-xs">
                      Aucune carte assignée
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="space-y-3">
                  <!-- Afficher le profil (seulement si configuré) -->
                  <a
                    v-if="selectedEmployee.is_configured && selectedEmployee.username"
                    :href="getEmployeeProfileUrl(selectedEmployee)"
                    target="_blank"
                    class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Afficher le Profil</span>
                  </a>

                  <!-- Retirer une carte (seulement si non configuré) -->
                  <button
                    v-if="!selectedEmployee.is_configured"
                    @click="removeCardFromEmployee"
                    :disabled="isProcessing"
                    class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                    <span>Retirer une Carte</span>
                  </button>

                  <!-- Message si l'employé a configuré -->
                  <div
                    v-if="selectedEmployee.is_configured"
                    class="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-medium py-3 px-4 rounded-lg flex items-center gap-2"
                  >
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span class="text-sm"
                      >Impossible de retirer des cartes car l'employé a déjà configuré sa carte.</span
                    >
                  </div>

                  <!-- Supprimer l'employé -->
                  <button
                    @click="deleteEmployee"
                    :disabled="isProcessing"
                    class="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <!-- Icône de chargement (spinner) quand isProcessing est true -->
                    <svg v-if="isProcessing" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <!-- Icône de poubelle quand isProcessing est false -->
                    <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>{{ isProcessing ? "Suppression..." : "Supprimer l'Employé" }}</span>
                  </button>
                </div>

                <!-- Message de retour -->
                <p
                  v-if="employeeModalFeedback"
                  :class="employeeModalError ? 'text-red-400' : 'text-green-400'"
                  class="text-sm text-center"
                >
                  {{ employeeModalFeedback }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="user?.role === 'employee'">
        <div v-if="!isDashboardReady" class="h-12 w-96 max-w-full bg-slate-700 rounded animate-pulse mx-auto mb-4" />
        <h1 v-else class="text-4xl font-bold text-center mb-4">Bienvenue, {{ user.name }} !</h1>

        <!-- Skeleton Screen pour les cartes employé -->
        <div 
          v-if="!isDashboardReady"
          class="grid gap-4 md:gap-5 max-w-4xl mx-auto"
          :class="hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'"
        >
          <!-- Skeleton Card 1 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 2 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 3 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 4 -->
          <div class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 5 (si appointments enabled) -->
          <div 
            v-if="hasAppointmentsEnabled"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>
        
        <template v-else>
          <!-- ✅ NOUVEAU: Badge avec le total de toutes les cartes assignées -->
          <div v-if="employeeOrders.length > 0" class="text-center mb-12">
            <div class="inline-flex items-center gap-3 px-5 py-3 bg-slate-800/80 border border-slate-700 rounded-xl">
              <!-- Total des cartes assignées -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <span class="text-sky-400 font-semibold">
                  {{ getEmployeeTotalCards() }} carte{{ getEmployeeTotalCards() > 1 ? "s" : "" }} assignée{{
                    getEmployeeTotalCards() > 1 ? "s" : ""
                  }}
                </span>
              </div>

              <!-- Séparateur vertical -->
              <div class="h-6 w-px bg-slate-600"></div>

              <!-- Statut de configuration -->
              <div
                v-if="areAllCardsConfigured()"
                class="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
              >
                <svg class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-green-400 font-semibold text-sm">Configurées</span>
              </div>
              <div
                v-else
                class="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full"
              >
                <svg class="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-yellow-400 font-semibold text-sm">
                  {{ getEmployeeCardsToConfig() }} à configurer
                </span>
              </div>
            </div>
          </div>

          <!-- Message si aucune commande -->
          <div v-else class="text-center mb-12">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full"
            >
              <svg class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span class="text-yellow-400 font-semibold text-sm">Aucune carte assignée</span>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div 
            class="grid gap-4 md:gap-5 max-w-3xl mx-auto"
            :class="hasAppointmentsEnabled ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl'"
          >
            <button
              @click="goToSettings"
              class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
            >
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">⚙️</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">Paramétrer ma Carte</h2>
              <p class="text-xs text-slate-400">Configurez votre profil.</p>
            </button>
            <button
              @click="viewPublicProfile"
              class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
            >
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">{{ isRestaurantProfile ? '🍽️' : '👀' }}</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">{{ isRestaurantProfile ? 'Menu du jour' : 'Afficher mon Profil' }}</h2>
              <p class="text-xs text-slate-400">{{ isRestaurantProfile ? 'Consultez votre menu' : 'Voyez votre profil.' }}</p>
            </button>
            <!-- Carte "Mes Rendez-vous" pour les employés -->
            <button
              v-if="hasAppointmentsEnabled"
              @click="showAppointmentsModal = true"
              class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
            >
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📅</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">Mes Rendez-vous</h2>
              <p class="text-xs text-slate-400 mb-1">Gérez vos rendez-vous.</p>
              <span v-if="appointmentsCount > 0" class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30">
                {{ appointmentsCount }} RDV
              </span>
            </button>
            <!-- Carte "Mes Contacts" pour les employés -->
            <button
              @click="showContactsModal = true"
              class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
            >
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📇</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">Mes Contacts</h2>
              <p class="text-xs text-slate-400 mb-1">Contacts reçus.</p>
              <span v-if="newContactsCount > 0" class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30">
                {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? 'x' : '' }}
              </span>
            </button>
            <!-- Carte "Marketplace" pour les employés -->
            <button
              @click="goToMarketplace"
              class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
            >
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">🛍️</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">Marketplace</h2>
              <p class="text-xs text-slate-400">Découvrez nos services.</p>
            </button>
          </div>
        </template>
      </div>

      <div v-else-if="user?.role">
        <p class="text-center text-red-400">Erreur : Rôle utilisateur inconnu ({{ user.role }}).</p>
      </div>

      <div v-if="user?.name" class="mt-12 text-center space-y-4">
        <button
          @click="goToHome"
          class="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          🏠 Accueil
        </button>
        <br />
        <button
          @click="goToAccount"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          👤 Mon Compte
        </button>
        <br />
        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
    <ProfilePictureModal
      v-if="isCropperOpen"
      :imageUrl="selectedImageUrl"
      :isUploading="isUploadingAvatar"
      @close="isCropperOpen = false"
      @save="handleImageSave"
    />

    <!-- Modale "Mes Rendez-vous" -->
    <div
      v-if="showAppointmentsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showAppointmentsModal = false"
    >
      <div class="w-full max-w-4xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span class="text-3xl">📅</span>
            Mes Rendez-vous
          </h2>
          <button
            @click="showAppointmentsModal = false"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
            <MyAppointments 
              :orderId="appointmentsOrderId" 
              :showHeader="false"
            />
        </div>
      </div>
    </div>

    <!-- Modale "Mes Contacts" -->
    <div
      v-if="showContactsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showContactsModal = false"
    >
      <div class="w-full max-w-4xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span class="text-3xl">📇</span>
            Mes Contacts
          </h2>
          <button
            @click="showContactsModal = false"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
            <MyContacts 
              :showHeader="false"
              @update:newCount="newContactsCount = $event"
            />
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner :is-loading="isNavigatingToSettings" />
</template>

<script setup>
  import { ref, watch, reactive, onMounted, onUnmounted, nextTick, computed } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import { useLoadingStore } from "@/stores/loading";
  import apiClient from "@/api";
  import ProfilePictureModal from "@/components/ProfilePictureModal.vue";
  import LoadingSpinner from "@/components/layout/LoadingSpinner.vue";
  import MyAppointments from "@/components/dashboard/MyAppointments.vue";
  import MyContacts from "@/components/dashboard/MyContacts.vue";
  import Cookies from "js-cookie";

  const router = useRouter();
  const route = useRoute();
  const loadingStore = useLoadingStore();
  const { user, logout, fetchUser, updateUserAvatar } = useAuth();

  // Portfolio pour vérifier le type de profil
  const userPortfolio = ref(null);
  const isRestaurantProfile = computed(() => userPortfolio.value?.profile_type === 'restaurant');

  const isCropperOpen = ref(false);
  const selectedImageUrl = ref(null);
  const isUploadingAvatar = ref(false);
  let initialUserFetchAttempted = false;

  const employees = ref([]);
  const newEmployee = reactive({ name: "", email: "" });
  const isAddingEmployee = ref(false);
  const employeeFeedback = ref("");
  const isEmployeeError = ref(false);
  const isLoadingEmployees = ref(false);
  const isRemovingEmployee = ref(null);
  // ✅ OPTIMISATION: Initialiser à true pour business_admin pour affichage instantané (affichage optimiste)
  // La vérification en arrière-plan mettra à jour cette valeur si nécessaire
  // Pour les autres rôles, on garde false par défaut
  const hasBusinessOrder = ref(user.value?.role === 'business_admin' ? true : false);
  const isLoadingBusinessOrders = ref(false); // ✅ Variable d'état pour le chargement des commandes business

  // --- Variables pour le système de slots ---
  const businessOrders = ref([]);
  const selectedOrderId = ref(null);
  const currentOrderSlots = ref([]);
  const isLoadingSlots = ref(false);
  const slotsLoaded = ref(false); // Track si les slots ont déjà été chargés

  // --- Variables pour le dashboard employé ---
  const employeeOrder = ref(null);
  const employeeOrders = ref([]); // ✅ NOUVEAU: Toutes les commandes de l'employé
  const isLoadingEmployeeOrder = ref(false); // ✅ Variable d'état pour le chargement de la commande employé

  // --- Variables pour le modal de gestion d'employé ---
  const showEmployeeModal = ref(false);
  const selectedEmployee = ref(null);
  const isProcessing = ref(false);
  const employeeModalFeedback = ref("");
  const employeeModalError = ref(false);
  const showDeleteConfirmation = ref(false);
  const isNavigatingToSettings = ref(false);

  // --- Variables pour les rendez-vous ---
  // ✅ OPTIMISATION: Initialiser à true pour affichage instantané (affichage optimiste)
  // La vérification en arrière-plan mettra à jour cette valeur si nécessaire
  const hasAppointmentsEnabled = ref(true);
  const hasAppointments = ref(false);
  const appointmentsCount = ref(0);
  const isCheckingAppointments = ref(false); // Pour éviter les appels multiples simultanés

  // --- Variables pour les contacts ---
  const showContactsModal = ref(false);
  const newContactsCount = ref(0);

  // Charger le compteur de contacts
  const loadContactsCount = async () => {
    try {
      const response = await apiClient.get('/api/shared-contacts');
      newContactsCount.value = response.data?.new_count || 0;
    } catch (error) {
      console.error('Erreur lors du chargement du compteur de contacts:', error);
    }
  };
  const showAppointmentsModal = ref(false); // Pour afficher la modale des rendez-vous
  const appointmentsOrderId = ref(null); // OrderId utilisé pour charger les rendez-vous (peut différer de selectedOrderId)
  const isLoadingDashboard = ref(true); // État de chargement global du dashboard
  const isDashboardReady = ref(false); // Dashboard prêt à afficher (TOUT est chargé)

  // --- Helper to set CSRF header ---
  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    } else {
      console.warn("Cookie XSRF-TOKEN non trouvé.");
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // ✅ CORRECTION : Fonction helper pour construire l'URL complète de l'avatar utilisateur
  // Cette fonction gère les URLs déjà complètes (depuis useAuth) et les chemins relatifs
  const getUserAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

    // Si c'est déjà une URL complète (http:// ou https://), l'utiliser directement
    // useAuth.js construit déjà l'URL complète, donc on peut la retourner telle quelle
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

  // ✅ OPTIMISATION: Initialisation synchrone de l'avatar pour affichage immédiat (0ms de délai)
  // Utiliser user.value?.avatar_url directement depuis le composable useAuth
  // Cela garantit que l'avatar s'affiche dès le premier rendu, sans attendre fetchUser()
  // ✅ CRITIQUE: Initialiser avec la valeur actuelle de user.value si disponible
  const getInitialAvatarUrl = () => {
    // Pour les employés, vérifier d'abord employeeOrders
    if (user.value?.role === 'employee' && employeeOrders.value.length > 0) {
      const employeeOrder = employeeOrders.value[0];
      if (employeeOrder?.employee_avatar_url) {
        return getUserAvatarUrl(employeeOrder.employee_avatar_url);
      }
    }
    // Pour les autres rôles, utiliser l'avatar utilisateur
    if (user.value?.avatar_url) {
      return getUserAvatarUrl(user.value.avatar_url);
    }
    return null;
  };
  const userAvatarUrl = ref(getInitialAvatarUrl());
  const avatarImageLoaded = ref(false);

  // Réinitialiser le skeleton photo quand l'URL change (nouvelle image à charger)
  watch(userAvatarUrl, (url) => {
    avatarImageLoaded.value = !url;
  }, { immediate: true });

  // ✅ Computed réactif pour mettre à jour l'avatar quand user.value.avatar_url change
  // Pour les employés, utiliser employee_avatar_url de leur commande
  const userAvatarUrlComputed = computed(() => {
    // Pour les employés, prioriser l'avatar de la commande
    if (user.value?.role === 'employee' && employeeOrders.value.length > 0) {
      const employeeOrder = employeeOrders.value[0];
      if (employeeOrder?.employee_avatar_url) {
        const url = getUserAvatarUrl(employeeOrder.employee_avatar_url);
        console.log("[Dashboard] userAvatarUrlComputed (employee) - URL construite:", {
          original: employeeOrder.employee_avatar_url,
          constructed: url,
          current: userAvatarUrl.value
        });
        // Mettre à jour la ref pour que l'image se recharge si l'URL change
        if (url !== userAvatarUrl.value) {
          console.log("[Dashboard] Mise à jour userAvatarUrl (employee):", url);
          userAvatarUrl.value = url;
        }
        return url;
      }
    }
    
    // Pour les autres rôles, utiliser l'avatar utilisateur
    if (user.value?.avatar_url) {
      const url = getUserAvatarUrl(user.value.avatar_url);
      console.log("[Dashboard] userAvatarUrlComputed - URL construite:", {
        original: user.value.avatar_url,
        constructed: url,
        current: userAvatarUrl.value
      });
      // Mettre à jour la ref pour que l'image se recharge si l'URL change
      if (url !== userAvatarUrl.value) {
        console.log("[Dashboard] Mise à jour userAvatarUrl:", url);
        userAvatarUrl.value = url;
      }
      return url;
    }
    console.log("[Dashboard] userAvatarUrlComputed - Pas d'avatar URL");
    return null;
  });

  // ✅ Utiliser la ref pour l'affichage immédiat, le computed pour la réactivité
  // La ref est mise à jour par le computed, mais elle a une valeur initiale synchrone
  watch(
    userAvatarUrlComputed,
    (newUrl) => {
      if (newUrl && newUrl !== userAvatarUrl.value) {
        userAvatarUrl.value = newUrl;
        console.log("[Dashboard] userAvatarUrl mis à jour depuis computed:", newUrl);
      }
    },
    { immediate: true },
  );
  
  // ✅ CRITIQUE: Initialiser l'avatar immédiatement si user.value est déjà disponible
  // Cela garantit que l'avatar s'affiche dès le premier rendu, même avant les watchers
  // Utiliser nextTick pour s'assurer que le DOM est prêt
  nextTick(() => {
    if (user.value && !userAvatarUrl.value) {
      const initialUrl = getInitialAvatarUrl();
      if (initialUrl) {
        userAvatarUrl.value = initialUrl;
        console.log("[Dashboard] Avatar initialisé immédiatement (nextTick):", initialUrl);
      }
    }
  });

  // ✅ CORRECTION : Watcher pour forcer la mise à jour de l'avatar quand user change
  // Cela garantit que l'avatar s'affiche immédiatement après une connexion
  watch(
    () => user.value?.avatar_url,
    (newAvatarUrl, oldAvatarUrl) => {
      // Ne pas mettre à jour si c'est un employé (l'avatar vient de la commande)
      if (user.value?.role === 'employee') {
        return;
      }
      
      if (newAvatarUrl && newAvatarUrl !== oldAvatarUrl) {
        console.log("[Dashboard] Avatar URL changed:", {
          old: oldAvatarUrl,
          new: newAvatarUrl,
          constructed: getUserAvatarUrl(newAvatarUrl),
        });
        // Mettre à jour directement la ref pour forcer le re-render
        const newUrl = getUserAvatarUrl(newAvatarUrl);
        if (newUrl) {
          userAvatarUrl.value = newUrl;
          console.log("[Dashboard] userAvatarUrl ref mise à jour:", newUrl);
        }
        // Le computed se mettra à jour automatiquement, mais on force un re-render
        nextTick(() => {
          console.log("[Dashboard] Avatar should be updated in DOM");
        });
      } else if (!newAvatarUrl) {
        // Si l'avatar est supprimé, réinitialiser la ref
        userAvatarUrl.value = null;
      }
    },
    { immediate: true },
  );
  
  // ✅ NOUVEAU : Watcher pour l'avatar des employés
  watch(
    () => employeeOrders.value[0]?.employee_avatar_url,
    (newAvatarUrl, oldAvatarUrl) => {
      if (user.value?.role !== 'employee') {
        return;
      }
      
      if (newAvatarUrl && newAvatarUrl !== oldAvatarUrl) {
        console.log("[Dashboard] Employee Avatar URL changed:", {
          old: oldAvatarUrl,
          new: newAvatarUrl,
          constructed: getUserAvatarUrl(newAvatarUrl),
        });
        // Mettre à jour directement la ref pour forcer le re-render
        const newUrl = getUserAvatarUrl(newAvatarUrl);
        if (newUrl) {
          userAvatarUrl.value = newUrl;
          console.log("[Dashboard] Employee userAvatarUrl ref mise à jour:", newUrl);
        }
        // Le computed se mettra à jour automatiquement, mais on force un re-render
        nextTick(() => {
          console.log("[Dashboard] Employee Avatar should be updated in DOM");
        });
      } else if (!newAvatarUrl) {
        // Si l'avatar est supprimé, réinitialiser la ref
        userAvatarUrl.value = null;
      }
    },
    { immediate: true, deep: true },
  );

  // ✅ CORRECTION : Gérer les erreurs de chargement d'avatar
  const handleAvatarError = (event) => {
    console.error("Erreur de chargement de l'avatar:", event.target.src);
    event.target.style.display = "none";
    avatarImageLoaded.value = true;
  };

  // --- Function to check if user has business orders and load them ---
  const checkBusinessOrders = async (manageSpinner = true) => {
    if (user.value?.role !== "business_admin") {
      if (manageSpinner) {
        isLoadingBusinessOrders.value = false;
      }
      return;
    }
    try {
      // Ne gérer le spinner que si demandé (évite les doubles spinners)
      if (manageSpinner) {
        isLoadingBusinessOrders.value = true;
      }
      
      // ✅ OPTIMISATION : Ne pas ajouter de timestamp pour permettre le cache du navigateur
      // Le backend retourne déjà les données optimisées pour les business_admin
      const response = await apiClient.get(`/api/orders`);
      const orders = response.data;
      businessOrders.value = orders.filter((order) => order.order_type === "business");
      hasBusinessOrder.value = businessOrders.value.length > 0;

      // Sélectionner la première commande et charger les slots automatiquement
      if (hasBusinessOrder.value) {
        selectedOrderId.value = businessOrders.value[0].id;
        // ✅ OPTIMISATION : Charger les slots immédiatement sans délai supplémentaire
        // Les données sont déjà optimisées côté backend
        await nextTick();
        if (!slotsLoaded.value && selectedOrderId.value) {
          loadOrderSlots();
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes business:", error);
      hasBusinessOrder.value = false; // En cas d'erreur, considérer qu'il n'y a pas de commande business
    } finally {
      // Ne désactiver le spinner que si on l'a activé
      if (manageSpinner) {
        isLoadingBusinessOrders.value = false;
      }
    }
  };

  // ✅ NOUVEAU: Gérer le changement de commande sélectionnée
  const onOrderChange = async () => {
    console.log("Commande sélectionnée changée", {
      selectedOrderId: selectedOrderId.value,
    });

    // Forcer le rechargement en réinitialisant le cache
    slotsLoaded.value = false;
    currentOrderSlots.value = [];

    // Recharger les slots de la nouvelle commande
    await loadOrderSlots();

    // Recharger les rendez-vous pour la nouvelle commande
    checkAppointmentsEnabled();
  };

  // ✅ NOUVEAU: Fonction pour sélectionner une commande business (avec les boutons)
  const selectBusinessOrder = async (orderId) => {
    selectedOrderId.value = orderId;
    await onOrderChange();
  };
  // --- Charger les slots d'une commande spécifique ---
  const loadOrderSlots = async () => {
    if (!selectedOrderId.value) return;

    // ✅ OPTIMISATION : Éviter de recharger si les slots sont déjà chargés pour cette commande
    if (slotsLoaded.value && currentOrderSlots.value.length > 0) {
      return;
    }

    slotsLoaded.value = false; // Réinitialiser l'état pour permettre un nouveau chargement
    isLoadingSlots.value = true;
    try {
      // ✅ OPTIMISATION : Ne pas ajouter de timestamp pour permettre le cache du navigateur
      // Le backend retourne déjà les données optimisées
      const response = await apiClient.get(`/api/orders/${selectedOrderId.value}`);
      const order = response.data;

      // Filtrer les slots pour exclure le business admin s'il s'est inclus ET les slots supprimés
      let slotsToDisplay = order.employee_slots || [];

      // Créer un Map pour accéder rapidement aux données order_employees par employee_id
      const orderEmployeesMap = new Map();
      if (order.order_employees && Array.isArray(order.order_employees)) {
        order.order_employees.forEach((oe) => {
          if (oe.employee_id) {
            orderEmployeesMap.set(oe.employee_id, oe);
          }
        });
      }

      // Filtrer et convertir :
      // 1. Exclure les slots du business admin connecté
      // 2. ✅ NOUVEAU: Garder les slots libérés (is_assigned=false mais cards_quantity > 0) pour permettre la réassignation
      // 3. Convertir les slots avec employés supprimés en slots non assignés
      slotsToDisplay = slotsToDisplay
        .filter((slot) => {
          // Exclure si c'est le business admin
          if (slot.employee_id === user.value.id) {
            return false;
          }
          // ✅ NOUVEAU: Garder les slots libérés qui ont encore des cartes (pour réassignation)
          // Un slot libéré a is_assigned=false mais cards_quantity > 0
          const hasCards = (slot.cards_quantity ?? 0) > 0;
          if (slot.is_assigned === false && hasCards) {
            // Garder ce slot - il est disponible pour réassignation
            return true;
          }
          // Exclure si le slot est marqué comme supprimé ET n'a pas de cartes
          if (slot.is_assigned === false && !hasCards) {
            return false;
          }
          return true;
        })
        .map((slot) => {
          // Vérifier le nombre de cartes
          const orderEmployee = slot.employee_id ? orderEmployeesMap.get(slot.employee_id) : null;
          const actualCardQuantity = orderEmployee?.card_quantity ?? slot.cards_quantity ?? 0;

          // ✅ NOUVEAU: Si le slot n'est pas assigné (libéré après suppression d'un employé),
          // le présenter comme un slot disponible pour assignation
          if (!slot.employee_id || slot.is_assigned === false) {
            const originalCardsQuantity = slot.cards_quantity && slot.cards_quantity > 0 ? slot.cards_quantity : 1;
            return {
              ...slot,
              employee_id: null,
              employee_name: null,
              employee_email: null,
              employee_username: null,
              is_assigned: false,
              is_configured: false,
              cards_quantity: originalCardsQuantity,
            };
          }

          // Si le slot est assigné à un employé qui n'existe plus ou qui a 0 cartes,
          // convertir le slot en slot non assigné pour permettre l'assignation d'un nouvel employé
          const isAssigned = slot.employee_id && slot.is_assigned !== false;
          const isEmployeeDeleted = isAssigned && !orderEmployee;
          const hasNoCards = isAssigned && actualCardQuantity <= 0;

          if (isEmployeeDeleted || hasNoCards) {
            const originalCardsQuantity = slot.cards_quantity && slot.cards_quantity > 0 ? slot.cards_quantity : 1;

            return {
              ...slot,
              employee_id: null,
              employee_name: null,
              employee_email: null,
              employee_username: null,
              is_assigned: false,
              is_configured: false,
              cards_quantity: originalCardsQuantity,
            };
          }

          return slot;
        });

      // Préparer les slots avec des champs temporaires pour les formulaires
      // et ajuster les numéros pour qu'ils commencent par 1
      // IMPORTANT: Utiliser card_quantity depuis order_employees si disponible, sinon cards_quantity depuis employee_slots
      currentOrderSlots.value = slotsToDisplay.map((slot, index) => {
        // Chercher l'entrée order_employee correspondante pour obtenir le vrai nombre de cartes
        const orderEmployee = slot.employee_id ? orderEmployeesMap.get(slot.employee_id) : null;
        const actualCardQuantity = orderEmployee?.card_quantity ?? slot.cards_quantity ?? 0;

        return {
          ...slot,
          display_number: index + 1, // Numéro d'affichage commence à 1
          temp_name: "",
          temp_email: "",
          isAssigning: false,
          feedback: "",
          isError: false,
          // ✅ Utiliser le nombre de cartes depuis order_employees (source de vérité)
          actual_card_quantity: actualCardQuantity,
          // Garder cards_quantity pour compatibilité mais utiliser actual_card_quantity pour l'affichage
          cards_quantity: actualCardQuantity,
        };
      });

      slotsLoaded.value = true; // Marquer les slots comme chargés
    } catch (error) {
      console.error("Error loading order slots:", error);
      currentOrderSlots.value = [];
    } finally {
      isLoadingSlots.value = false;
    }
  };

  // --- Assigner un employé à un slot ---
  const assignSlot = async (slot) => {
    if (!slot.temp_name || !slot.temp_email) {
      slot.feedback = "Veuillez remplir tous les champs.";
      slot.isError = true;
      return;
    }

    slot.isAssigning = true;
    slot.feedback = "";
    slot.isError = false;

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.post(`/api/orders/${selectedOrderId.value}/slots/${slot.slot_number}/assign`, {
        employee_name: slot.temp_name,
        employee_email: slot.temp_email,
      });

      slot.feedback = response.data.message || "Employé assigné avec succès !";
      slot.isError = false;

      // ✅ CORRECTION: Forcer le rechargement immédiat en réinitialisant le cache
      slotsLoaded.value = false;
      await loadOrderSlots();

      // Recharger aussi les commandes pour mettre à jour les compteurs
      await checkBusinessOrders();
    } catch (error) {
      console.error("Error assigning slot:", error);
      slot.feedback = error.response?.data?.message || "Erreur lors de l'assignation.";
      slot.isError = true;
    } finally {
      slot.isAssigning = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const loadEmployeeOrder = async () => {
    if (user.value?.role !== "employee") {
      isLoadingEmployeeOrder.value = false;
      return;
    }

    try {
      isLoadingEmployeeOrder.value = true;
      // Récupérer toutes les commandes de l'employé
      const response = await apiClient.get("/api/orders");
      const orders = response.data;

      if (orders && orders.length > 0) {
        // ✅ NOUVEAU: Stocker toutes les commandes
        employeeOrders.value = orders;
        // Garder la première pour compatibilité
        employeeOrder.value = orders[0];
      } else {
        employeeOrders.value = [];
        employeeOrder.value = null;
      }
    } catch (error) {
      console.error("Error loading employee order:", error);
      employeeOrders.value = [];
      employeeOrder.value = null;
    } finally {
      isLoadingEmployeeOrder.value = false;
    }
  };

  // ✅ NOUVEAU: Calculer le total de toutes les cartes assignées à l'employé
  const getEmployeeTotalCards = () => {
    if (employeeOrders.value.length === 0) return 0;

    return employeeOrders.value.reduce((total, order) => {
      const cardQty =
        order.employee_card_quantity !== undefined ? order.employee_card_quantity : order.card_quantity || 0;
      return total + cardQty;
    }, 0);
  };

  // ✅ NOUVEAU: Calculer le nombre de cartes à configurer
  const getEmployeeCardsToConfig = () => {
    if (employeeOrders.value.length === 0) return 0;

    return employeeOrders.value.reduce((total, order) => {
      // Ne compter que les commandes non configurées
      const isConfigured = order.employee_is_configured || order.is_configured;
      if (!isConfigured) {
        const cardQty =
          order.employee_card_quantity !== undefined ? order.employee_card_quantity : order.card_quantity || 0;
        return total + cardQty;
      }
      return total;
    }, 0);
  };

  // ✅ NOUVEAU: Vérifier si toutes les cartes sont configurées
  const areAllCardsConfigured = () => {
    if (employeeOrders.value.length === 0) return false;

    return employeeOrders.value.every((order) => order.employee_is_configured || order.is_configured);
  };

  // --- Obtenir le nombre de cartes de l'employé (pour compatibilité) ---
  const getEmployeeCardQuantity = () => {
    if (!employeeOrder.value) return 0;
    // Utiliser employee_card_quantity si disponible, sinon card_quantity
    return employeeOrder.value.employee_card_quantity !== undefined
      ? employeeOrder.value.employee_card_quantity
      : employeeOrder.value.card_quantity || 0;
  };

  // --- Function to load employees ---
  const loadEmployees = async () => {
    if (user.value?.role !== "business_admin") return;
    isLoadingEmployees.value = true;
    employeeFeedback.value = "";
    isEmployeeError.value = false;
    try {
      const response = await apiClient.get("/api/employees");
      employees.value = response.data;
    } catch (error) {
      console.error("Error loading employees:", error.response?.data || error);
      if (error.code === "ERR_NETWORK" || error.message.includes("CORS")) {
        employeeFeedback.value = "Erreur Réseau/CORS.";
      } else {
        employeeFeedback.value = "Impossible de charger les employés.";
      }
      isEmployeeError.value = true;
    } finally {
      isLoadingEmployees.value = false;
    }
  };

  // --- Watcher ---
  watch(
    user,
    (newUser, oldUser) => {
      if (!newUser && !initialUserFetchAttempted) {
        initialUserFetchAttempted = true;
        // ✅ CORRECTION: Appeler fetchUser() immédiatement au montage pour charger l'avatar
        fetchUser().catch(() => {
          router.push({ name: "home" });
        });
      } else if (newUser?.role === "business_admin" && oldUser?.role !== "business_admin") {
        checkBusinessOrders();
        loadEmployees();
      } else if (!newUser || (newUser && newUser.role !== "business_admin")) {
        employees.value = [];
      }
    },
    { immediate: true },
  );

  // --- Fonction pour vérifier rapidement si la prise de rendez-vous est activée ---
  // Cette fonction est rapide et permet d'afficher la carte immédiatement
  const checkAppointmentsEnabled = async () => {
    if (!user.value) {
      return;
    }

    // Ne pas gérer isCheckingAppointments ici si appelé depuis onMounted (business_admin)
    // car onMounted le gère manuellement pour éviter les conflits de spinner
    const manageCheckingFlag = !isCheckingAppointments.value;
    
    if (manageCheckingFlag) {
      isCheckingAppointments.value = true;
      
      // Activer le bon spinner selon le rôle
      if (user.value.role === 'business_admin') {
        isLoadingBusinessOrders.value = true;
      } else {
        isLoadingDashboard.value = true;
      }
    }

    try {
      let hasEnabledSettings = false;
      let orderIdToCheck = null;

      console.log('[Dashboard] 🔍 Début checkAppointmentsEnabled (rapide)', {
        userRole: user.value.role,
        selectedOrderId: selectedOrderId.value,
      });

      // Pour tous les utilisateurs, vérifier toutes les commandes
      try {
        const ordersResponse = await apiClient.get('/api/orders');
        const orders = ordersResponse.data || [];
        console.log('[Dashboard] 📦 Toutes les commandes:', orders.length);
        
        // Pour tous les utilisateurs, vérifier toutes les commandes
        const ordersToCheck = orders;
        
        // Vérifier si au moins une commande a la prise de rendez-vous activée
        for (const order of ordersToCheck) {
          try {
            const settingsResponse = await apiClient.get(`/api/appointment-settings?order_id=${order.id}`);
            const settings = settingsResponse.data?.settings;
            
            if (settings?.is_enabled === true) {
              hasEnabledSettings = true;
              console.log(`[Dashboard] ✅ Prise de rendez-vous activée pour commande ${order.id} (${order.order_number})`);
              
              // Pour business_admin, utiliser la commande sélectionnée si elle a des settings
              // Sinon, utiliser la première commande avec settings activés
              if (user.value.role === 'business_admin') {
                if (selectedOrderId.value === order.id) {
                  orderIdToCheck = order.id;
                  break; // Priorité à la commande sélectionnée
                } else if (!orderIdToCheck) {
                  orderIdToCheck = order.id; // Première commande avec settings activés
                }
              }
              
              // Pour individual, on a trouvé au moins une commande activée, c'est suffisant
              if (user.value.role === 'individual') {
                break;
              }
              
              // Pour employee, utiliser la première commande avec settings activés
              if (user.value.role === 'employee' && !orderIdToCheck) {
                orderIdToCheck = order.id;
              }
            }
          } catch (error) {
            console.error(`[Dashboard] ❌ Erreur pour commande ${order.id}:`, error.response?.status);
            continue;
          }
        }
        
        // Pour business_admin, si une commande est sélectionnée, l'utiliser pour filtrer les rendez-vous
        if (user.value.role === 'business_admin' && selectedOrderId.value && !orderIdToCheck) {
          orderIdToCheck = selectedOrderId.value;
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des commandes:', error);
        hasEnabledSettings = false;
      }

      // Stocker l'orderId utilisé pour charger les rendez-vous
      // Pour les utilisateurs individuels et business_admin, ne pas filtrer par order_id (afficher TOUS les rendez-vous)
      // Pour les employés, filtrer par la commande
      if (user.value.role === 'individual' || user.value.role === 'business_admin') {
        appointmentsOrderId.value = null; // Pas de filtre pour individual et business_admin (afficher tous les rendez-vous)
      } else {
        appointmentsOrderId.value = orderIdToCheck; // Filtrer par commande pour employee uniquement
      }

      // La carte s'affiche si la prise de rendez-vous est activée
      // (même s'il n'y a pas encore de rendez-vous pris)
      hasAppointmentsEnabled.value = hasEnabledSettings;

      console.log('[Dashboard] ✅ checkAppointmentsEnabled result:', {
        hasEnabledSettings,
        hasAppointmentsEnabled: hasAppointmentsEnabled.value,
        orderIdToCheck,
        appointmentsOrderId: appointmentsOrderId.value,
        userRole: user.value.role,
      });
      
      // Log supplémentaire pour débogage
      if (hasEnabledSettings) {
        console.log('[Dashboard] ✅✅✅ CARTE MES RENDEZ-VOUS DEVRAIT S\'AFFICHER !');
      } else {
        console.log('[Dashboard] ❌❌❌ CARTE MES RENDEZ-VOUS NE S\'AFFICHERA PAS - hasEnabledSettings est false');
      }

      // Le chargement des compteurs est maintenant géré dans onMounted pour tous les rôles
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des rendez-vous:', error);
      hasAppointmentsEnabled.value = false;
    } finally {
      // Ne désactiver le flag et le spinner que si on les a activés nous-mêmes
      if (manageCheckingFlag) {
        isCheckingAppointments.value = false;
        
        // Désactiver le bon spinner selon le rôle
        if (user.value?.role === 'business_admin') {
          isLoadingBusinessOrders.value = false;
        } else {
          isLoadingDashboard.value = false;
        }
      }
    }
  };

  // --- Fonction pour charger le nombre de rendez-vous (en arrière-plan) ---
  const loadAppointmentsCount = async () => {
    try {
      const params = {};
      if (appointmentsOrderId.value) {
        params.order_id = appointmentsOrderId.value;
      }

      console.log('[Dashboard] 📅 Chargement du nombre de rendez-vous avec params:', params);
      const appointmentsResponse = await apiClient.get('/api/appointments', { params });
      const appointments = appointmentsResponse.data?.appointments || [];
      
      // Ne compter que les rendez-vous confirmés (pas les annulés)
      const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');
      appointmentsCount.value = confirmedAppointments.length;
      
      console.log('[Dashboard] 📅 Nombre de rendez-vous chargés:', {
        total: appointments.length,
        confirmed: confirmedAppointments.length,
        appointments: confirmedAppointments.map(a => ({
          id: a.id,
          order_id: a.order_id,
          visitor_name: a.visitor_name,
          start_time: a.start_time,
        })),
      });
    } catch (error) {
      console.error('❌ Erreur lors du chargement du nombre de rendez-vous:', error);
      appointmentsCount.value = 0;
    }
  };

  // --- Fonction pour charger et vérifier les rendez-vous (ancienne fonction, gardée pour compatibilité) ---
  const checkAppointments = async () => {
    // Utiliser la nouvelle fonction optimisée
    await checkAppointmentsEnabled();
  };

  // ✅ OPTIMISATION: Le Router Guard a déjà appelé fetchUser() avant d'arriver ici
  // L'avatar est initialisé de manière synchrone avec user.value?.avatar_url
  // Plus besoin d'appeler fetchUser() au montage, l'avatar s'affiche immédiatement
  // ✅ NOUVEAU : Handler pour l'événement de mise à jour de l'avatar employé
  const handleEmployeeAvatarUpdate = async () => {
    if (user.value?.role === 'employee') {
      console.log("[Dashboard] Employee avatar updated, reloading employee order...");
      await loadEmployeeOrder();
    }
  };
  
  onMounted(async () => {
    loadingStore.setDashboardViewMounted(true);
    // ✅ CRITIQUE: Initialiser l'avatar immédiatement au montage si disponible
    // Cela garantit que l'avatar s'affiche dès le premier rendu
    if (user.value && !userAvatarUrl.value) {
      const initialUrl = getInitialAvatarUrl();
      if (initialUrl) {
        userAvatarUrl.value = initialUrl;
        console.log("[Dashboard] Avatar initialisé dans onMounted:", initialUrl);
      }
    }
    
    console.log("[Dashboard] onMounted - user.value:", {
      hasUser: !!user.value,
      hasAvatar: !!user.value?.avatar_url,
      avatarUrl: user.value?.avatar_url,
      userAvatarUrl: userAvatarUrl.value,
    });
    
    // Écouter l'événement de mise à jour de l'avatar employé
    window.addEventListener('employee-avatar-updated', handleEmployeeAvatarUpdate);

    // ✅ OPTIMISATION: Afficher le dashboard immédiatement avec un état de chargement
    // Les données se chargeront en arrière-plan
    isDashboardReady.value = true;

    // Charger le portfolio pour vérifier le type de profil
    if (user.value?.role === 'individual') {
      loadUserPortfolio();
    }

    // ✅ OPTIMISATION: Initialiser hasBusinessOrder à true pour business_admin pour affichage instantané
    // La vérification en arrière-plan mettra à jour cette valeur si nécessaire
    if (user.value?.role === "business_admin") {
      hasBusinessOrder.value = true;
    }

    // Charger les données en arrière-plan
    if (user.value?.role === "business_admin") {
      // ✅ Activer le spinner une seule fois pour toute la séquence
      isLoadingBusinessOrders.value = true;
      
      // Charger les données en arrière-plan (ne pas bloquer l'affichage)
      (async () => {
        try {
          // Vérifier les settings EN PREMIER (sans gérer le spinner, on le fait manuellement)
          isCheckingAppointments.value = true;
          await checkAppointmentsEnabled();
          
          // Puis charger les commandes business (sans gérer le spinner, on le fait ici)
          await checkBusinessOrders(false); // false = ne pas gérer le spinner
          
          // ✅ NOUVEAU: Charger les compteurs AVANT d'afficher le dashboard
          console.log('[Dashboard] 📊 Chargement des compteurs pour business_admin...');
          await Promise.all([
            loadContactsCount(),
            loadAppointmentsCount()
          ]);
          console.log('[Dashboard] ✅ Compteurs chargés:', {
            contactsCount: newContactsCount.value,
            appointmentsCount: appointmentsCount.value,
          });
        } finally {
          // Désactiver le spinner à la fin de toute la séquence
          isLoadingBusinessOrders.value = false;
          isCheckingAppointments.value = false;
          
          console.log('[Dashboard] ✅ Chargement terminé pour business_admin:', {
            isLoadingBusinessOrders: isLoadingBusinessOrders.value,
            hasAppointmentsEnabled: hasAppointmentsEnabled.value,
            hasBusinessOrder: hasBusinessOrder.value,
            isDashboardReady: isDashboardReady.value,
            newContactsCount: newContactsCount.value,
            appointmentsCount: appointmentsCount.value,
          });
        }
      })();
    } else if (user.value?.role === "employee") {
      // Pour les employés, charger les commandes et vérifier les settings
      isLoadingEmployeeOrder.value = true;
      isCheckingAppointments.value = true;
      
      // Charger les données en arrière-plan
      (async () => {
        try {
          await loadEmployeeOrder();
          await checkAppointmentsEnabled();
          
          // Charger les compteurs pour les employés
          console.log('[Dashboard] 📊 Chargement des compteurs pour employee...');
          await Promise.all([
            loadContactsCount(),
            loadAppointmentsCount()
          ]);
          console.log('[Dashboard] ✅ Compteurs chargés pour employee:', {
            contactsCount: newContactsCount.value,
            appointmentsCount: appointmentsCount.value,
          });
        } finally {
          isLoadingEmployeeOrder.value = false;
          isCheckingAppointments.value = false;
          
          console.log('[Dashboard] ✅ Chargement terminé pour employee:', {
            hasAppointmentsEnabled: hasAppointmentsEnabled.value,
            isDashboardReady: isDashboardReady.value,
          });
        }
      })();
    } else {
      // Pour les autres rôles (individual), vérifier directement les settings
      isLoadingDashboard.value = true;
      isCheckingAppointments.value = true;
      
      // Charger les données en arrière-plan
      (async () => {
        try {
          await checkAppointmentsEnabled();
          
          // Charger les compteurs pour les utilisateurs individuels
          console.log('[Dashboard] 📊 Chargement des compteurs pour individual...');
          await Promise.all([
            loadContactsCount(),
            loadAppointmentsCount()
          ]);
          console.log('[Dashboard] ✅ Compteurs chargés pour individual:', {
            contactsCount: newContactsCount.value,
            appointmentsCount: appointmentsCount.value,
          });
        } finally {
          isLoadingDashboard.value = false;
          isCheckingAppointments.value = false;
          
          console.log('[Dashboard] ✅ Chargement terminé pour individual:', {
            hasAppointmentsEnabled: hasAppointmentsEnabled.value,
            isDashboardReady: isDashboardReady.value,
          });
        }
      })();
    }

    // Créer un observer pour détecter quand la section "Gérer le Personnel" devient visible
    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si la section est visible ET que les slots ne sont pas encore chargés
          if (entry.isIntersecting && !slotsLoaded.value && hasBusinessOrder.value) {
            loadOrderSlots();
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "50px", // Charger 50px avant que la section soit visible
        threshold: 0.1, // Se déclenche quand 10% de la section est visible
      },
    );

    // Observer la section après un court délai pour s'assurer qu'elle existe
    setTimeout(() => {
      const section = document.getElementById("employee-section");
      if (section && sectionObserver) {
        sectionObserver.observe(section);
      }
    }, 200);
  });

  // Recharger le compteur de rendez-vous quand le modal se ferme (après une annulation possible)
  watch(showAppointmentsModal, (isOpen) => {
    if (!isOpen) {
      // Le modal vient de se fermer, recharger le compteur
      loadAppointmentsCount();
    }
  });

  // --- Business Admin Functions ---
  const addEmployee = async () => {
    isAddingEmployee.value = true;
    employeeFeedback.value = "";
    isEmployeeError.value = false;
    try {
      setCsrfHeader();
      const response = await apiClient.post("/api/employees", newEmployee);
      employees.value.push(response.data);
      newEmployee.name = "";
      newEmployee.email = "";
      employeeFeedback.value = "Employé ajouté ! Email envoyé.";
      setTimeout(() => (employeeFeedback.value = ""), 5000);
    } catch (error) {
      employeeFeedback.value = error.response?.data?.message || "Erreur ajout.";
      if (error.response?.data?.errors?.email) {
        employeeFeedback.value = error.response.data.errors.email[0];
      }
      isEmployeeError.value = true;
    } finally {
      isAddingEmployee.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };
  const confirmRemoveEmployee = async (employeeId, employeeName) => {
    if (isRemovingEmployee.value) return;
    if (window.confirm(`Supprimer "${employeeName}" ?`)) {
      isRemovingEmployee.value = employeeId;
      employeeFeedback.value = "";
      isEmployeeError.value = false;
      try {
        setCsrfHeader();
        const response = await apiClient.delete(`/api/employees/${employeeId}`);

        // ✅ NOUVEAU: Retirer l'employé de la liste des employés
        employees.value = employees.value.filter((emp) => emp.id !== employeeId);

        // ✅ NOUVEAU: Forcer le rechargement des slots en réinitialisant l'état
        slotsLoaded.value = false;

        // ✅ NOUVEAU: Recharger les slots pour que le slot libéré apparaisse comme disponible
        await loadOrderSlots();

        // ✅ NOUVEAU: Recharger les commandes business pour mettre à jour l'affichage
        await checkBusinessOrders();

        employeeFeedback.value =
          response.data?.message ||
          "Employé supprimé. Le slot est maintenant disponible pour assigner un nouvel employé.";
      } catch (error) {
        console.error("Error removing employee:", error.response?.data || error);
        employeeFeedback.value = error.response?.data?.message || "Erreur suppression.";
        isEmployeeError.value = true;
      } finally {
        isRemovingEmployee.value = null;
        delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
        setTimeout(() => (employeeFeedback.value = ""), 5000);
      }
    }
  };

  // --- Fonctions pour le modal de gestion d'employé (slots) ---
  const openEmployeeModal = async (slot) => {
    // Afficher immédiatement le modal avec les données du slot disponibles
    let actualCardQuantity = slot.cards_quantity || 0;
    
    // Adapter le slot pour qu'il ressemble à un employé pour la modal
    selectedEmployee.value = {
      id: slot.employee_id,
      name: slot.employee_name,
      email: slot.employee_email,
      username: slot.employee_username, // Ajouter le username pour le lien du profil
      total_cards: actualCardQuantity, // Utiliser la valeur du slot pour l'affichage immédiat
      email_verified_at: slot.is_configured ? new Date() : null, // Simuler la vérification
      is_configured: slot.is_configured,
      slot_number: slot.slot_number,
    };
    showEmployeeModal.value = true;
    employeeModalFeedback.value = "";
    employeeModalError.value = false;

    // Charger les données complètes en arrière-plan pour obtenir le vrai nombre de cartes
    try {
      if (selectedOrderId.value && slot.employee_id) {
        const timestamp = new Date().getTime();
        const response = await apiClient.get(`/api/orders/${selectedOrderId.value}?_t=${timestamp}`);
        const order = response.data;

        // Chercher l'entrée order_employee correspondante pour obtenir le vrai nombre de cartes
        if (order.order_employees && Array.isArray(order.order_employees)) {
          const orderEmployee = order.order_employees.find((oe) => oe.employee_id === slot.employee_id);
          if (orderEmployee && orderEmployee.card_quantity !== undefined) {
            actualCardQuantity = orderEmployee.card_quantity;
            // Mettre à jour le nombre de cartes dans le modal
            if (selectedEmployee.value) {
              selectedEmployee.value.total_cards = actualCardQuantity;
            }
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données order_employees:", error);
      // En cas d'erreur, on garde les données du slot déjà affichées
    }
  };

  const closeEmployeeModal = () => {
    showEmployeeModal.value = false;
    showDeleteConfirmation.value = false;
    selectedEmployee.value = null;
    employeeModalFeedback.value = "";
    employeeModalError.value = false;
  };

  const addCardToEmployee = async () => {
    if (isProcessing.value || !selectedEmployee.value) return;

    isProcessing.value = true;
    employeeModalFeedback.value = "";
    employeeModalError.value = false;

    try {
      setCsrfHeader();
      const response = await apiClient.post(`/api/employees/${selectedEmployee.value.id}/add-card`);

      // Mettre à jour l'affichage dans la modal
      selectedEmployee.value.total_cards =
        response.data.card_quantity || response.data.order_employee?.card_quantity || 0;

      employeeModalFeedback.value = response.data.message || "Carte ajoutée avec succès !";
      employeeModalError.value = false;

      // Recharger les slots pour mettre à jour l'affichage dans la liste
      await loadOrderSlots();

      // Recharger les commandes pour mettre à jour l'affichage global
      await checkBusinessOrders();

      // Émettre un événement pour notifier les autres composants (OrdersView, AdminOrderList, etc.)
      if (response.data.order) {
        window.dispatchEvent(
          new CustomEvent("order-updated", {
            detail: {
              orderId: response.data.order.id,
              order: response.data.order,
              orderEmployee: response.data.order_employee,
            },
          }),
        );
      }

      // Fermer le modal après 2 secondes
      setTimeout(() => {
        closeEmployeeModal();
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'ajout de carte:", error);
      employeeModalFeedback.value = error.response?.data?.message || "Erreur lors de l'ajout de la carte.";
      employeeModalError.value = true;
    } finally {
      isProcessing.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const removeCardFromEmployee = async () => {
    if (isProcessing.value || !selectedEmployee.value) return;

    // RESTRICTION : Ne pas retirer de carte si l'employé a configuré
    if (selectedEmployee.value.is_configured) {
      employeeModalFeedback.value = "Impossible de retirer une carte. Cet employé a déjà configuré sa carte.";
      employeeModalError.value = true;
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir retirer une carte à cet employé ?")) {
      return;
    }

    isProcessing.value = true;
    employeeModalFeedback.value = "";
    employeeModalError.value = false;

    try {
      setCsrfHeader();
      const response = await apiClient.post(`/api/employees/${selectedEmployee.value.id}/remove-card`);

      // Recharger les slots
      await loadOrderSlots();

      // Mettre à jour l'affichage dans la modal
      selectedEmployee.value.total_cards = response.data.card_quantity;

      employeeModalFeedback.value = response.data.message || "Carte retirée avec succès !";
      employeeModalError.value = false;

      // Fermer le modal après 2 secondes
      setTimeout(() => {
        closeEmployeeModal();
      }, 2000);
    } catch (error) {
      console.error("Erreur lors du retrait de carte:", error);
      employeeModalFeedback.value = error.response?.data?.message || "Erreur lors du retrait de la carte.";
      employeeModalError.value = true;
    } finally {
      isProcessing.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const deleteEmployee = () => {
    if (isProcessing.value || !selectedEmployee.value) return;
    // Afficher le modal de confirmation
    showDeleteConfirmation.value = true;
  };

  const confirmDelete = async () => {
    if (isProcessing.value || !selectedEmployee.value) return;

    isProcessing.value = true;
    employeeModalFeedback.value = "";
    employeeModalError.value = false;
    showDeleteConfirmation.value = false; // Fermer le modal de confirmation

    try {
      setCsrfHeader();
      const deletedEmployeeId = selectedEmployee.value.id;

      // ✅ NOUVEAU: Envoyer l'order_id pour retirer l'employé seulement de cette commande
      const response = await apiClient.delete(`/api/employees/${deletedEmployeeId}`, {
        data: { order_id: selectedOrderId.value },
      });

      // ✅ Vérifier si le compte a été supprimé ou juste retiré de la commande
      const accountDeleted = response.data.account_deleted;

      if (accountDeleted) {
        // Retirer l'employé de la liste car son compte est supprimé
        employees.value = employees.value.filter((emp) => emp.id !== deletedEmployeeId);
      }

      // Afficher le message du backend
      employeeModalFeedback.value =
        response.data.message ||
        "Personnel retiré avec succès ! Le slot est maintenant disponible pour assigner un nouvel employé.";
      employeeModalError.value = false;

      // ✅ Forcer le rechargement des slots en réinitialisant l'état
      slotsLoaded.value = false;

      // Recharger immédiatement les slots et les commandes
      await loadOrderSlots();
      await checkBusinessOrders();

      // Attendre 2.5 secondes pour que l'utilisateur puisse lire le message avant de fermer
      setTimeout(() => {
        closeEmployeeModal();
      }, 2500);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      employeeModalFeedback.value = error.response?.data?.message || "Erreur lors de la suppression.";
      employeeModalError.value = true;
    } finally {
      isProcessing.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const cancelDelete = () => {
    // Fermer le modal de confirmation et revenir au menu principal
    showDeleteConfirmation.value = false;
    employeeModalFeedback.value = "";
    employeeModalError.value = false;
  };

  // --- Avatar/Logout Functions ---
  const openFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/gif";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert("Le fichier est trop volumineux (max 2MB).");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          selectedImageUrl.value = event.target.result;
          isCropperOpen.value = true;
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("Erreur lecture fichier.");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  const handleImageSave = async (croppedImageBlob) => {
    const formData = new FormData();
    formData.append("avatar", croppedImageBlob, "avatar.jpg");
    isUploadingAvatar.value = true;

    let uploadSuccess = false;

    try {
      if (!apiClient) {
        console.error("apiClient n'est pas initialisé !");
        return;
      }
      setCsrfHeader();
      const response = await apiClient.post("/api/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (user.value && response.data.avatar_url) {
        // ✅ CORRECTION : Construire l'URL complète avec le backend URL
        const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
        let fullAvatarUrl;

        // Gérer les deux formats (/api/storage/ et /storage/)
        if (response.data.avatar_url.startsWith("/api/storage/") || response.data.avatar_url.startsWith("/storage/")) {
          fullAvatarUrl = backendUrl + response.data.avatar_url;
        } else if (response.data.avatar_url.startsWith("http://") || response.data.avatar_url.startsWith("https://")) {
          fullAvatarUrl = response.data.avatar_url;
        } else {
          fullAvatarUrl = backendUrl + "/" + response.data.avatar_url.replace(/^\//, "");
        }

        // ✅ CORRECTION: Ajouter un timestamp pour forcer le rechargement de l'image après upload
        // Cela évite que le navigateur affiche l'ancienne image en cache
        const separator = fullAvatarUrl.includes('?') ? '&' : '?';
        fullAvatarUrl = fullAvatarUrl + separator + 't=' + Date.now();
        
        console.log("[Dashboard] Avatar URL complète après upload:", fullAvatarUrl);
        updateUserAvatar(fullAvatarUrl);
      }
      console.log("Avatar mis à jour:", response.data.avatar_url);
      uploadSuccess = true;
    } catch (error) {
      console.error("Erreur upload avatar:", error.response?.data || error);
      alert("Erreur mise à jour avatar.");
      uploadSuccess = false;
    } finally {
      isUploadingAvatar.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];

      // ✅ CORRECTION : Fermer le modal seulement après que l'upload soit terminé
      // Attendre un court délai pour que l'utilisateur voie que l'upload est terminé
      if (uploadSuccess) {
        setTimeout(() => {
          isCropperOpen.value = false;
        }, 800);
      }
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  // --- Dashboard Navigation ---
  const goToAccount = () => {
    router.push({ name: "Account" });
  };

  const goToHome = () => {
    router.push({ name: "Home" });
  };
  const goToSettings = async () => {
    // Afficher la bulle immédiatement
    isNavigatingToSettings.value = true;
    // Attendre que le DOM soit mis à jour pour afficher la bulle
    await nextTick();
    // Petite pause pour s'assurer que la bulle est visible avant la navigation
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Naviguer vers Settings
    router.push({ name: "Settings" });
  };
  const viewPublicProfile = () => {
    // Si c'est un profil restaurant, rediriger vers le menu
    if (isRestaurantProfile.value) {
      router.push({ name: "RestaurantMenu" });
    } else {
      // Sinon, rediriger vers la page de sélection de profil
      router.push({ name: "ProfileSelection" });
    }
  };
  const goToOrders = () => {
    router.push({ name: "Orders" });
  };
  const goToMarketplace = () => {
    // Rediriger vers la page Marketplace
    router.push({ name: "Marketplace" });
  };

  // Fonction utilitaire pour obtenir le token d'accès d'une commande
  const getOrderAccessToken = (order) => {
    if (!order) return null;

    // Chercher le token dans différentes propriétés possibles
    if (order.access_token) return order.access_token;
    if (order.profile_token) return order.profile_token;
    if (order.public_token) return order.public_token;
    if (order.token) return order.token;

    return null;
  };

  // Obtenir l'URL du profil d'un employé avec le token sécurisé
  const getEmployeeProfileUrl = (employee) => {
    if (!employee?.username) return "";

    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

    // Trouver la commande correspondante pour obtenir le token
    const order = businessOrders.value.find((o) => o.id === selectedOrderId.value);

    // Essayer d'obtenir le token d'accès (sécurisé)
    const accessToken = order ? getOrderAccessToken(order) : null;

    if (accessToken) {
      // Utiliser le token sécurisé
      return `${backendUrl}/profil/${employee.username}?token=${accessToken}`;
    } else if (selectedOrderId.value) {
      // Fallback pour les anciennes commandes sans token (comportement attendu)
      // Les anciennes commandes utilisent ?order= jusqu'à ce que le backend génère un token
      return `${backendUrl}/profil/${employee.username}?order=${selectedOrderId.value}`;
    }

    // Si pas de token ni d'orderId, retourner juste le profil sans paramètre
    return `${backendUrl}/profil/${employee.username}`;
  };

  const scrollToEmployeeSection = async () => {
    // ✅ OPTIMISATION : Charger les slots à la demande (lazy loading)
    if (!slotsLoaded.value && hasBusinessOrder.value) {
      await loadOrderSlots();
    }

    const section = document.getElementById("employee-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- Input field class definition (shared) ---
  const inputFieldClass =
    "block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  // --- Watch pour charger les données selon le rôle (quand l'utilisateur change APRÈS le montage) ---
  // NOTE: Le chargement initial est géré par onMounted, ce watcher ne gère que les changements ultérieurs
  watch(
    user,
    (newUser, oldUser) => {
      // Ne rien faire si c'est le premier chargement (géré par onMounted)
      if (!oldUser) {
        return;
      }
      
      // ✅ Réinitialiser la variable de chargement si le rôle change
      if (oldUser.role !== newUser?.role) {
        isLoadingBusinessOrders.value = false;
        hasBusinessOrder.value = false;
        businessOrders.value = [];
        isLoadingEmployeeOrder.value = false;
        employeeOrder.value = null;
      }

      if (newUser) {
        if (newUser.role === "business_admin") {
          checkBusinessOrders().then(() => {
            // Vérifier rapidement les settings (affiche la carte immédiatement)
            // Le chargement des rendez-vous se fait en arrière-plan
            if (!isCheckingAppointments.value) {
              checkAppointmentsEnabled();
            }
          });
        } else if (newUser.role === "employee") {
          loadEmployeeOrder();
        } else {
          // Si ce n'est pas un business_admin ou employé, s'assurer que les variables sont à false
          isLoadingBusinessOrders.value = false;
          isLoadingEmployeeOrder.value = false;
          // Vérifier rapidement les settings (affiche la carte immédiatement)
          // Le chargement des rendez-vous se fait en arrière-plan
          if (!isCheckingAppointments.value) {
            checkAppointmentsEnabled();
          }
        }
      }
    },
  );

  // Watcher pour re-vérifier les rendez-vous quand la commande sélectionnée change (pour business_admin)
  watch(selectedOrderId, async (newOrderId, oldOrderId) => {
    if (user.value?.role === 'business_admin' && newOrderId !== oldOrderId && !isCheckingAppointments.value) {
      console.log('[Dashboard] selectedOrderId changed, re-checking appointments.');
      checkAppointmentsEnabled();
    }
  });

  // --- Watch pour masquer la bulle quand on arrive sur Settings ---
  watch(
    () => route.name,
    (newRouteName) => {
      if (newRouteName === "Settings" && isNavigatingToSettings.value) {
        // Masquer la bulle après un court délai pour permettre à la page de se charger
        setTimeout(() => {
          isNavigatingToSettings.value = false;
        }, 500);
      } else if (newRouteName !== "Settings" && isNavigatingToSettings.value) {
        // Si on quitte Settings sans y être arrivé, masquer la bulle aussi
        isNavigatingToSettings.value = false;
      }
    },
  );

  // --- ✅ OPTIMISATION : Intersection Observer pour lazy loading des slots ---
  let sectionObserver = null;

  onUnmounted(() => {
    loadingStore.setDashboardViewMounted(false);
    // Nettoyer l'observer quand le composant est détruit
    if (sectionObserver) {
      sectionObserver.disconnect();
    }
    // Nettoyer l'événement de mise à jour de l'avatar employé
    window.removeEventListener('employee-avatar-updated', handleEmployeeAvatarUpdate);
  });
</script>

<style scoped>
  /* Définition de la classe input-field ici */
  .input-field {
    @apply mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150 ease-in-out;
  }
  button:disabled {
    cursor: not-allowed;
  }

  /* Animations de transition fluide */
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
  .fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  /* Ajout des styles globaux de DashboardView ici pour éviter @apply */
  .bg-slate-800 {
    background-color: rgba(30, 41, 59, 0.8);
  }
  .hover\:bg-slate-700\/50:hover {
    background-color: rgba(51, 65, 85, 0.7);
  }
</style>
