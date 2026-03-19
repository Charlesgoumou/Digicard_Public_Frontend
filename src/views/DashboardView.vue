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
          :class="
            showAppointmentsCard
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'
          "
        >
          <!-- Skeleton Card 1 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 2 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 3 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 4 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 5 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 6 (si appointments enabled) -->
          <div
            v-if="showAppointmentsCard"
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
          :class="
            showAppointmentsCard
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'
          "
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
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">{{
              isRestaurantProfile ? "🍽️" : "👀"
            }}</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">
              {{ isRestaurantProfile ? "Menu du jour" : "Afficher mon Profil" }}
            </h2>
            <p class="text-xs text-slate-400">
              {{ isRestaurantProfile ? "Consultez votre menu" : "Voyez votre profil." }}
            </p>
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
            v-if="showAppointmentsCard"
            @click="showAppointmentsModal = true"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📅</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Rendez-vous</h2>
            <p class="text-xs text-slate-400 mb-1">Gérez vos rendez-vous.</p>
            <span
              v-if="appointmentsCount > 0"
              class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30"
            >
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
            <span
              v-if="newContactsCount > 0"
              class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30"
            >
              {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? "x" : "" }}
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
        </div>
        <!-- Fin de la grille individual -->
      </div>
      <!-- Fin du v-if individual -->

      <div v-else-if="user?.role === 'business_admin'">
        <div v-if="!isDashboardReady" class="h-12 w-80 max-w-full bg-slate-700 rounded animate-pulse mx-auto mb-12" />
        <h1 v-else class="text-4xl font-bold text-center mb-12">Espace Entreprise</h1>

        <!-- Skeleton Screen pour les cartes du dashboard business_admin -->
        <div
          v-if="!isDashboardReady"
          class="grid gap-4 md:gap-5 mb-16"
          :class="
            showDashboardCard
              ? showAppointmentsCard
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 max-w-8xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto'
              : showAppointmentsCard
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto'
          "
        >
          <!-- Skeleton Card 1 (Tableau de bord si showDashboardCard) -->
          <div
            v-if="showDashboardCard"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 2 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 3 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 4 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 5 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 6 (si appointments enabled) -->
          <div
            v-if="showAppointmentsCard"
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 7 (Marketplace) -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
        </div>

        <div
          v-else
          class="grid gap-4 md:gap-5 mb-16"
          :class="
            showDashboardCard
              ? showAppointmentsCard
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 max-w-8xl mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto'
              : showAppointmentsCard
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto'
          "
        >
          <button
            v-if="showDashboardCard"
            @click="router.push({ name: 'Personnel' })"
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
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">{{
              isRestaurantProfile ? "🍽️" : "👀"
            }}</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">
              {{ isRestaurantProfile ? "Menu du jour" : "Afficher mon Profil" }}
            </h2>
            <p class="text-xs text-slate-400">
              {{ isRestaurantProfile ? "Consultez votre menu" : "Voyez votre profil." }}
            </p>
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
            v-if="showAppointmentsCard"
            @click="showAppointmentsModal = true"
            class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
          >
            <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📅</span>
            <h2 class="text-sm font-semibold text-white mb-0.5">Mes Rendez-vous</h2>
            <p class="text-xs text-slate-400 mb-1">Gérez vos rendez-vous.</p>
            <span
              v-if="appointmentsCount > 0"
              class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30"
            >
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
            <span
              v-if="newContactsCount > 0"
              class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30"
            >
              {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? "x" : "" }}
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

        <!-- La gestion du personnel est maintenant sur /personnel -->
      </div>
      <!-- Fin du v-else-if business_admin -->

      <div v-else-if="user?.role === 'employee'" class="flex flex-col items-center w-full">
        <div v-if="!isDashboardReady" class="h-12 w-96 max-w-full bg-slate-700 rounded animate-pulse mb-4" />
        <h1 v-else class="text-4xl font-bold text-center mb-4">Bienvenue, {{ user.name }} !</h1>

        <!-- Skeleton Screen pour les cartes employé -->
        <div
          v-if="!isDashboardReady"
          class="grid gap-4 md:gap-5 w-full max-w-4xl"
          :class="
            showAppointmentsCard
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'
          "
        >
          <!-- Skeleton Card 1 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 2 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 3 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 4 -->
          <div
            class="bg-slate-800 rounded-lg px-4 py-3 min-h-[120px] flex flex-col items-center justify-center border border-slate-700 animate-pulse"
          >
            <div class="w-12 h-12 bg-slate-700 rounded-full mb-3"></div>
            <div class="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div class="h-3 w-32 bg-slate-700 rounded"></div>
          </div>
          <!-- Skeleton Card 5 (si appointments enabled) -->
          <div
            v-if="showAppointmentsCard"
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
            :class="
              showAppointmentsCard
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl'
            "
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
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">{{
                isRestaurantProfile ? "🍽️" : "👀"
              }}</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">
                {{ isRestaurantProfile ? "Menu du jour" : "Afficher mon Profil" }}
              </h2>
              <p class="text-xs text-slate-400">
                {{ isRestaurantProfile ? "Consultez votre menu" : "Voyez votre profil." }}
              </p>
            </button>
            <!-- Carte "Mes Rendez-vous" pour les employés -->
            <button
              v-if="showAppointmentsCard"
              @click="showAppointmentsModal = true"
              class="bg-slate-800 rounded-lg px-4 py-3 text-center hover:bg-slate-700/50 transition-colors group flex flex-col items-center justify-center shadow-lg border border-slate-700 hover:border-sky-500 hover:-translate-y-1 duration-300 min-h-[120px]"
            >
              <span class="text-3xl mb-1.5 block group-hover:scale-110 transition-transform duration-300">📅</span>
              <h2 class="text-sm font-semibold text-white mb-0.5">Mes Rendez-vous</h2>
              <p class="text-xs text-slate-400 mb-1">Gérez vos rendez-vous.</p>
              <span
                v-if="appointmentsCount > 0"
                class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30"
              >
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
              <span
                v-if="newContactsCount > 0"
                class="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30"
              >
                {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? "x" : "" }}
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
      <div
        class="w-full max-w-4xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span class="text-3xl">📅</span>
            Mes Rendez-vous
          </h2>
          <button @click="showAppointmentsModal = false" class="text-slate-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <MyAppointments :orderId="appointmentsOrderId" :showHeader="false" />
        </div>
      </div>
    </div>

    <!-- Modale "Mes Contacts" -->
    <div
      v-if="showContactsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showContactsModal = false"
    >
      <div
        class="w-full max-w-4xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span class="text-3xl">📇</span>
            Mes Contacts
          </h2>
          <button @click="showContactsModal = false" class="text-slate-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <MyContacts :showHeader="false" @update:newCount="newContactsCount = $event" />
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
  // Pour les Particuliers : toujours "Afficher mon Profil". "Menu du jour" uniquement pour business_admin/employé avec profil restaurant.
  const isRestaurantProfile = computed(
    () => user.value?.role !== "individual" && userPortfolio.value?.profile_type === "restaurant",
  );

  const loadUserPortfolio = async () => {
    try {
      const response = await apiClient.get("/api/user-portfolio");
      userPortfolio.value = response.data;
    } catch (error) {
      console.error("Erreur lors du chargement du portfolio:", error);
      userPortfolio.value = null;
    }
  };

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
  const hasBusinessOrder = ref(false);
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
  const hasAppointments = ref(false);
  const appointmentsCount = ref(0);
  const isCheckingAppointments = ref(false); // Pour éviter les appels multiples simultanés

  // --- Variables pour les contacts ---
  const showContactsModal = ref(false);
  const newContactsCount = ref(0);

  // ✅ PERF: Cache mémoire (persiste entre navigations /dashboard dans la SPA)
  // Objectif: ré-afficher instantanément les valeurs déjà connues (puis rafraîchir en arrière-plan).
  const DASH_CACHE = (globalThis.__DIGICARD_DASH_CACHE__ ||= {
    dashboardCards: { value: null, ts: 0, inFlight: null },
    contactsCount: { value: null, ts: 0, inFlight: null },
    appointmentsCount: { value: null, ts: 0, inFlight: null, key: "" },
  });
  const DASH_TTL_MS = 60_000; // 60s
  const hasFreshDashboardCardsCache =
    !!DASH_CACHE.dashboardCards.value && Date.now() - DASH_CACHE.dashboardCards.ts < DASH_TTL_MS;

  // Charger le compteur de contacts
  const loadContactsCount = async () => {
    try {
      const now = Date.now();
      if (DASH_CACHE.contactsCount.value !== null && now - DASH_CACHE.contactsCount.ts < DASH_TTL_MS) {
        newContactsCount.value = DASH_CACHE.contactsCount.value;
        return;
      }
      if (DASH_CACHE.contactsCount.inFlight) {
        const v = await DASH_CACHE.contactsCount.inFlight;
        newContactsCount.value = v ?? 0;
        return;
      }

      DASH_CACHE.contactsCount.inFlight = (async () => {
        const response = await apiClient.get("/api/shared-contacts");
        const v = response.data?.new_count || 0;
        DASH_CACHE.contactsCount.value = v;
        DASH_CACHE.contactsCount.ts = Date.now();
        return v;
      })();
      newContactsCount.value = await DASH_CACHE.contactsCount.inFlight;
    } catch (error) {
      console.error("Erreur lors du chargement du compteur de contacts:", error);
      newContactsCount.value = 0;
    } finally {
      DASH_CACHE.contactsCount.inFlight = null;
    }
  };
  const showAppointmentsModal = ref(false); // Pour afficher la modale des rendez-vous
  const appointmentsOrderId = ref(null); // OrderId utilisé pour charger les rendez-vous (peut différer de selectedOrderId)
  const isLoadingDashboard = ref(true); // État de chargement global du dashboard
  // ✅ PERF: Le dashboard doit s'afficher dès que les cartes (feature flags) sont connues.
  // Le reste (commandes, compteurs, etc.) se charge en arrière-plan pour éviter une page "bloquée".
  // ⚡️ UX: si on a déjà les feature flags en cache, ne jamais reflasher le skeleton.
  const isDashboardReady = ref(hasFreshDashboardCardsCache);

  // --- Cartes du dashboard (Option A : calcul côté serveur pour éviter le flash) ---
  const dashboardCards = ref(hasFreshDashboardCardsCache ? DASH_CACHE.dashboardCards.value : null);
  const loadDashboardCards = async () => {
    try {
      const now = Date.now();
      if (DASH_CACHE.dashboardCards.value && now - DASH_CACHE.dashboardCards.ts < DASH_TTL_MS) {
        dashboardCards.value = DASH_CACHE.dashboardCards.value;
        return;
      }
      if (DASH_CACHE.dashboardCards.inFlight) {
        dashboardCards.value = await DASH_CACHE.dashboardCards.inFlight;
        return;
      }

      DASH_CACHE.dashboardCards.inFlight = (async () => {
        const response = await apiClient.get("/api/dashboard/cards");
        const v = response.data?.dashboard_cards || {};
        DASH_CACHE.dashboardCards.value = v;
        DASH_CACHE.dashboardCards.ts = Date.now();
        return v;
      })();
      dashboardCards.value = await DASH_CACHE.dashboardCards.inFlight;
    } catch (error) {
      console.error("Erreur lors du chargement des cartes du dashboard:", error);
      dashboardCards.value = {};
    } finally {
      DASH_CACHE.dashboardCards.inFlight = null;
    }
  };
  const showAppointmentsCard = computed(() => dashboardCards.value?.mes_rendez_vous ?? false);
  const showDashboardCard = computed(() => dashboardCards.value?.tableau_de_bord ?? false);

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
    if (user.value?.role === "employee" && employeeOrders.value.length > 0) {
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
  watch(
    userAvatarUrl,
    (url) => {
      avatarImageLoaded.value = !url;
    },
    { immediate: true },
  );

  // ✅ PERF: éviter une computed avec effets de bord (ça déclenche des re-renders en cascade).
  // On calcule une URL d'avatar "source of truth" et on met à jour la ref via un watch.
  const avatarSourceUrl = computed(() => {
    if (user.value?.role === "employee") {
      const employeeAvatar = employeeOrders.value?.[0]?.employee_avatar_url;
      return employeeAvatar ? getUserAvatarUrl(employeeAvatar) : null;
    }
    return user.value?.avatar_url ? getUserAvatarUrl(user.value.avatar_url) : null;
  });

  watch(
    avatarSourceUrl,
    (newUrl) => {
      if (newUrl !== userAvatarUrl.value) {
        userAvatarUrl.value = newUrl;
      }
    },
    { immediate: true },
  );

  // ✅ Supprimé: logs et watchers redondants sur l'avatar (coût CPU + re-renders).

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

  // ✅ PERF: Ne plus scanner toutes les commandes + /appointment-settings par commande.
  // La visibilité de la carte RDV vient de /api/dashboard/cards.
  // Ici on ne fait que définir le filtre (employee uniquement).
  const checkAppointmentsEnabled = async () => {
    if (user.value?.role === "employee") {
      appointmentsOrderId.value = employeeOrders.value?.[0]?.id || null;
    } else {
      appointmentsOrderId.value = null;
    }
  };

  // --- Fonction pour charger le nombre de rendez-vous (en arrière-plan) ---
  const loadAppointmentsCount = async () => {
    try {
      // ✅ PERF: si la carte n'est pas activée, ne pas charger
      if (!showAppointmentsCard.value) {
        appointmentsCount.value = 0;
        return;
      }

      const params = {};
      if (appointmentsOrderId.value) {
        params.order_id = appointmentsOrderId.value;
      }

      const key = JSON.stringify(params);
      const now = Date.now();
      if (
        DASH_CACHE.appointmentsCount.value !== null &&
        DASH_CACHE.appointmentsCount.key === key &&
        now - DASH_CACHE.appointmentsCount.ts < DASH_TTL_MS
      ) {
        appointmentsCount.value = DASH_CACHE.appointmentsCount.value;
        return;
      }
      if (DASH_CACHE.appointmentsCount.inFlight && DASH_CACHE.appointmentsCount.key === key) {
        appointmentsCount.value = await DASH_CACHE.appointmentsCount.inFlight;
        return;
      }

      DASH_CACHE.appointmentsCount.key = key;
      DASH_CACHE.appointmentsCount.inFlight = (async () => {
        const appointmentsResponse = await apiClient.get("/api/appointments", { params });
        const appointments = appointmentsResponse.data?.appointments || [];
        const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed");
        const v = confirmedAppointments.length;
        DASH_CACHE.appointmentsCount.value = v;
        DASH_CACHE.appointmentsCount.ts = Date.now();
        return v;
      })();
      appointmentsCount.value = await DASH_CACHE.appointmentsCount.inFlight;
    } catch (error) {
      console.error("❌ Erreur lors du chargement du nombre de rendez-vous:", error);
      appointmentsCount.value = 0;
    } finally {
      DASH_CACHE.appointmentsCount.inFlight = null;
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
    if (user.value?.role === "employee") {
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

    // (logs supprimés pour performance)

    // Écouter l'événement de mise à jour de l'avatar employé
    window.addEventListener("employee-avatar-updated", handleEmployeeAvatarUpdate);

    // Charger le portfolio pour vérifier le type de profil
    if (user.value?.role === "individual") {
      loadUserPortfolio();
    }

    // Charger les cartes du dashboard EN PREMIER (feature flags),
    // puis charger le reste en arrière-plan sans bloquer l'affichage.
    if (user.value?.role === "business_admin") {
      isLoadingBusinessOrders.value = true;

      (async () => {
        try {
          await loadDashboardCards();
          // ✅ Afficher le dashboard immédiatement après les cartes
          isDashboardReady.value = true;

          // Définir le filtre RDV (employee uniquement) sans appels coûteux
          checkAppointmentsEnabled();

          // ✅ Arrière-plan (ne pas await pour ne pas bloquer le rendu)
          checkBusinessOrders(false).finally(() => {
            isLoadingBusinessOrders.value = false;
          });
          Promise.all([loadContactsCount(), loadAppointmentsCount()]).catch(() => {});
        } finally {
          // Si loadDashboardCards a échoué, on affiche quand même (dashboardCards = {})
          isDashboardReady.value = true;
        }
      })();
    } else if (user.value?.role === "employee") {
      isLoadingEmployeeOrder.value = true;

      (async () => {
        try {
          await loadDashboardCards();
          // ✅ Afficher le dashboard immédiatement après les cartes
          isDashboardReady.value = true;

          // Définir le filtre RDV (employee uniquement) sans appels coûteux
          checkAppointmentsEnabled();

          // ✅ Arrière-plan
          loadEmployeeOrder().finally(() => {
            isLoadingEmployeeOrder.value = false;
          });
          Promise.all([loadContactsCount(), loadAppointmentsCount()]).catch(() => {});
        } finally {
          isDashboardReady.value = true;
        }
      })();
    } else {
      isLoadingDashboard.value = true;

      (async () => {
        try {
          await loadDashboardCards();
          // ✅ Afficher le dashboard immédiatement après les cartes
          isDashboardReady.value = true;

          // Définir le filtre RDV (employee uniquement) sans appels coûteux
          checkAppointmentsEnabled();

          // ✅ Arrière-plan
          Promise.all([loadContactsCount(), loadAppointmentsCount()]).catch(() => {});
        } finally {
          isLoadingDashboard.value = false;
          isDashboardReady.value = true;
        }
      })();
    }

    // ✅ PERF: IntersectionObserver supprimé (section /personnel déplacée)
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
        const separator = fullAvatarUrl.includes("?") ? "&" : "?";
        fullAvatarUrl = fullAvatarUrl + separator + "t=" + Date.now();

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
  const goToSettings = () => {
    // Navigation directe sans spinner : la page "Paramétrer votre Carte" affiche tout de suite son skeleton.
    router.push({ name: "Settings" });
  };
  const viewPublicProfile = () => {
    // Si c'est un profil restaurant, rediriger vers le menu
    if (isRestaurantProfile.value) {
      router.push({ name: "RestaurantMenu" });
      return;
    }
    // ✅ Comptes employés (même nomenclature que particuliers) : si une seule commande avec short_code, ouvrir directement /p/{code}
    if (user.value?.role === "employee" && employeeOrders.value.length === 1) {
      const order = employeeOrders.value[0];
      const shortCode = getOrderShortCode(order);
      if (shortCode) {
        const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
        window.open(`${backendUrl}/p/${shortCode}`, "_blank");
        return;
      }
    }
    // Sinon, rediriger vers la page de sélection de profil
    router.push({ name: "ProfileSelection" });
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

  // Fonction utilitaire pour obtenir le short_code d'une commande
  const getOrderShortCode = (order) => {
    if (!order) return null;
    if (order.short_code) return order.short_code;
    if (order.shortCode) return order.shortCode;
    return null;
  };

  // Obtenir l'URL du profil d'un employé (nomenclature courte /p/{code} comme pour particuliers et business)
  const getEmployeeProfileUrl = (employee) => {
    if (!employee?.username) return "";

    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

    const order = businessOrders.value.find((o) => o.id === selectedOrderId.value);

    // ✅ Préférer l'URL courte /p/{short_code} pour tous les comptes (employés inclus)
    const shortCode = order ? getOrderShortCode(order) : null;
    if (shortCode) {
      return `${backendUrl}/p/${shortCode}`;
    }

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

  // (Gestion du personnel déplacée sur /personnel)

  // --- Input field class definition (shared) ---
  const inputFieldClass =
    "block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  // --- Watch pour charger les données selon le rôle (quand l'utilisateur change APRÈS le montage) ---
  // NOTE: Le chargement initial est géré par onMounted, ce watcher ne gère que les changements ultérieurs
  watch(user, (newUser, oldUser) => {
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
  });

  // Watcher pour re-vérifier les rendez-vous quand la commande sélectionnée change (pour business_admin)
  watch(selectedOrderId, async (newOrderId, oldOrderId) => {
    if (user.value?.role === "business_admin" && newOrderId !== oldOrderId) {
      // ✅ PERF: plus de re-check coûteux (la visibilité vient de /api/dashboard/cards).
      // On garde seulement la logique de filtre (employee uniquement) - ici ça restera null.
      checkAppointmentsEnabled();
      loadAppointmentsCount();
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

  // (IntersectionObserver supprimé)

  onUnmounted(() => {
    // Nettoyer l'événement de mise à jour de l'avatar employé
    window.removeEventListener("employee-avatar-updated", handleEmployeeAvatarUpdate);
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
