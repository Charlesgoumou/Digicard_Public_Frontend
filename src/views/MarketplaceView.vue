<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col" @click="showMatchNotificationsModal = false">
    <!-- Header -->
    <div class="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            🛍️ Marketplace
          </h1>
          <div class="flex items-center gap-4">
            <!-- ✅ NOUVEAU : Icône de notification pour les suggestions de matching -->
            <div class="relative">
              <button
                @click.stop="showMatchNotificationsModal = !showMatchNotificationsModal"
                class="relative p-2 text-slate-300 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <!-- Badge pour les notifications non lues -->
                <span
                  v-if="matchNotificationsUnreadCount > 0"
                  class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ matchNotificationsUnreadCount > 9 ? '9+' : matchNotificationsUnreadCount }}
                </span>
              </button>
              
              <!-- Modal des notifications de matching -->
              <div
                v-if="showMatchNotificationsModal"
                class="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 max-h-96 overflow-y-auto"
                @click.stop
              >
                <div class="p-4 border-b border-slate-700 sticky top-0 bg-slate-800">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-white">Suggestions de matching</h3>
                    <button
                      @click="showMatchNotificationsModal = false"
                      class="text-slate-400 hover:text-white"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="matchNotifications.length > 0" class="divide-y divide-slate-700">
                  <div
                    v-for="notification in matchNotifications"
                    :key="notification.id"
                    @click="openOfferFromNotification(notification)"
                    :class="[
                      'p-4 cursor-pointer hover:bg-slate-700/50 transition-colors',
                      !notification.read_at ? 'bg-slate-700/30' : ''
                    ]"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-1">
                        <div class="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span class="text-white font-bold text-sm">{{ Math.round(notification.match_score) }}</span>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-white line-clamp-1">{{ notification.offer_title }}</p>
                        <p class="text-xs text-slate-400 mt-1">{{ notification.message }}</p>
                        <p class="text-xs text-slate-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-8 text-center text-slate-500">
                  <svg class="w-12 h-12 mx-auto mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p class="text-sm">Aucune suggestion pour le moment</p>
                </div>
              </div>
            </div>
            
            <button
              @click="showCreateOfferModal = true"
              class="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              + Créer une offre
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Onglets de navigation -->
    <div class="bg-slate-800/30 border-b border-slate-700">
      <div class="container mx-auto px-4">
        <div class="flex space-x-1 overflow-x-auto">
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-6 py-3 font-semibold transition-all whitespace-nowrap',
              activeTab === 'all'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-300'
            ]"
          >
            Toutes les offres
          </button>
          <button
            @click="activeTab = 'purchases'"
            :class="[
              'px-6 py-3 font-semibold transition-all whitespace-nowrap',
              activeTab === 'purchases'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-300'
            ]"
          >
            Mes Achats
          </button>
          <button
            @click="activeTab = 'sales'"
            :class="[
              'px-6 py-3 font-semibold transition-all whitespace-nowrap',
              activeTab === 'sales'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-300'
            ]"
          >
            Mes Ventes
          </button>
          <button
            @click="activeTab = 'favorites'"
            :class="[
              'px-6 py-3 font-semibold transition-all whitespace-nowrap',
              activeTab === 'favorites'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-300'
            ]"
          >
            Mes Favoris
          </button>
          <button
            @click="activeTab = 'messages'"
            :class="[
              'px-6 py-3 font-semibold transition-all whitespace-nowrap',
              activeTab === 'messages'
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-slate-400 hover:text-slate-300'
            ]"
          >
            Mes Messages
            <span v-if="totalUnreadMessages > 0" class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {{ totalUnreadMessages }}
            </span>
          </button>
          <button
            @click="goToDashboard"
            :class="[
              'px-6 py-3 font-semibold transition-all whitespace-nowrap',
              'text-slate-400 hover:text-slate-300'
            ]"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="bg-slate-800/30 border-b border-slate-700">
      <div class="container mx-auto px-4 py-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="onSearchInput"
            type="text"
            placeholder="Rechercher une offre, un service, un produit..."
            class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
          <svg
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8 flex-1">
      <!-- Skeleton Screen pour la grille d'offres -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <!-- Skeleton Card 1 -->
        <div class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 animate-pulse">
          <div class="h-48 bg-slate-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-3 w-full bg-slate-700 rounded"></div>
            <div class="h-3 w-2/3 bg-slate-700 rounded"></div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-6 w-20 bg-slate-700 rounded"></div>
              <div class="h-8 w-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <!-- Skeleton Card 2 -->
        <div class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 animate-pulse">
          <div class="h-48 bg-slate-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-3 w-full bg-slate-700 rounded"></div>
            <div class="h-3 w-2/3 bg-slate-700 rounded"></div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-6 w-20 bg-slate-700 rounded"></div>
              <div class="h-8 w-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <!-- Skeleton Card 3 -->
        <div class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 animate-pulse">
          <div class="h-48 bg-slate-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-3 w-full bg-slate-700 rounded"></div>
            <div class="h-3 w-2/3 bg-slate-700 rounded"></div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-6 w-20 bg-slate-700 rounded"></div>
              <div class="h-8 w-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <!-- Skeleton Card 4 -->
        <div class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 animate-pulse">
          <div class="h-48 bg-slate-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-3 w-full bg-slate-700 rounded"></div>
            <div class="h-3 w-2/3 bg-slate-700 rounded"></div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-6 w-20 bg-slate-700 rounded"></div>
              <div class="h-8 w-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
        <!-- Skeleton Card 5 -->
        <div class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 animate-pulse">
          <div class="h-48 bg-slate-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-3 w-full bg-slate-700 rounded"></div>
            <div class="h-3 w-2/3 bg-slate-700 rounded"></div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-6 w-20 bg-slate-700 rounded"></div>
              <div class="h-8 w-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grille d'offres -->
      <div v-else-if="filteredOffers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="offer in filteredOffers"
          :key="offer.id"
          class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-sky-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <!-- Image de l'offre -->
          <div class="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 cursor-pointer" @click="viewOfferDetails(offer.id)">
            <img
              v-if="offer.image_url"
              :src="offer.image_url"
              :alt="offer.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-6xl text-slate-500">{{ offer.type === 'service' ? '🔧' : offer.type === 'product' ? '📦' : '🎯' }}</span>
            </div>
            <!-- Badge type -->
            <div class="absolute top-2 right-2 z-10">
              <span class="px-2 py-1 bg-sky-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded">
                {{ offer.type === 'service' ? 'Service' : offer.type === 'product' ? 'Produit' : 'Offre' }}
              </span>
            </div>
            <!-- Bouton favoris -->
            <button
              @click.stop="toggleFavorite(offer.id)"
              class="absolute top-2 left-2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all z-10"
            >
              <svg
                :class="[
                  'w-5 h-5 transition-all',
                  offer.is_favorite ? 'text-red-500 fill-current' : 'text-white'
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <!-- Contenu de la carte -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">{{ offer.title }}</h3>
            <p class="text-sm text-slate-400 mb-3 line-clamp-2">{{ offer.description }}</p>
            
            <!-- ✅ NOUVEAU : Badge pour les messages non lus dans l'onglet Messages -->
            <div v-if="activeTab === 'messages' && offer.unread_count > 0" class="mb-2">
              <span class="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {{ offer.unread_count }} nouveau{{ offer.unread_count > 1 ? 'x' : '' }} message{{ offer.unread_count > 1 ? 's' : '' }}
              </span>
            </div>
            
            <!-- Prix et vendeur -->
            <div class="flex items-center justify-between mb-3 gap-4">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-sky-400">{{ formatPrice(offer.price) }}</span>
                <span v-if="offer.currency" class="text-sm text-slate-400">{{ offer.currency }}</span>
              </div>
              <div class="text-xs text-slate-400 text-right">
                Par {{ offer.seller_name }}
              </div>
            </div>

            <!-- Note moyenne -->
            <div v-if="Number(offer.average_rating) > 0" class="flex items-center gap-1 mb-3">
              <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-sm text-slate-300">{{ formatRating(offer.average_rating) }}</span>
              <span class="text-xs text-slate-500">({{ offer.reviews_count || 0 }})</span>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <!-- Première ligne : Voir détails et Acheter -->
              <div class="flex gap-2">
                <button
                  v-if="activeTab !== 'messages'"
                  @click="viewOfferDetails(offer.id)"
                  class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                >
                  Voir détails
                </button>
                <button
                  v-if="!offer.is_seller && activeTab !== 'messages'"
                  @click="addToCart(offer.id)"
                  class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-2 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm font-medium shadow-lg"
                >
                  Acheter
                </button>
                <!-- ✅ NOUVEAU : Bouton pour ouvrir la conversation dans l'onglet Messages -->
                <button
                  v-if="activeTab === 'messages'"
                  @click="openConversation(offer.id)"
                  class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-2 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm font-semibold shadow-lg"
                >
                  Ouvrir la conversation
                </button>
              </div>
              
              <!-- Deuxième ligne : Actions du vendeur (si applicable) -->
              <div v-if="offer.is_seller && activeTab === 'sales'" class="grid grid-cols-3 gap-2">
                <button
                  @click="editOffer(offer.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-1 sm:px-2 rounded-lg transition-all text-xs sm:text-sm font-medium truncate"
                  title="Modifier"
                >
                  <span class="hidden sm:inline">Modifier</span>
                  <span class="sm:hidden">✏️</span>
                </button>
                <button
                  @click="viewOfferStats(offer.id)"
                  class="bg-purple-600 hover:bg-purple-700 text-white py-2 px-1 sm:px-2 rounded-lg transition-all text-xs sm:text-sm font-medium truncate"
                  title="Statistiques"
                >
                  <span class="hidden sm:inline">Stats</span>
                  <span class="sm:hidden">📊</span>
                </button>
                <button
                  @click="deleteOffer(offer.id)"
                  class="bg-red-600 hover:bg-red-700 text-white py-2 px-1 sm:px-2 rounded-lg transition-all text-xs sm:text-sm font-medium truncate"
                  title="Supprimer"
                >
                  <span class="hidden sm:inline">Supprimer</span>
                  <span class="sm:hidden">🗑️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucune offre -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">🛍️</div>
        <h2 class="text-2xl font-bold text-slate-300 mb-2">Aucune offre disponible</h2>
        <p class="text-slate-400 mb-6">{{ getEmptyMessage() }}</p>
        <button
          v-if="activeTab === 'all'"
          @click="showCreateOfferModal = true"
          class="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
        >
          Créer la première offre
        </button>
      </div>
    </div>

    <!-- Modal de détails d'offre -->
    <div
      v-if="selectedOffer"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="selectedOffer = null"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header du modal -->
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between" style="z-index: 100; position: sticky;">
          <h2 class="text-2xl font-bold text-white">{{ selectedOffer.title }}</h2>
          <button
            @click="selectedOffer = null"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenu du modal -->
        <div class="p-6 relative">
          <!-- Image avec navigation (cliquable pour ouvrir la galerie) -->
          <div class="mb-6 relative" style="z-index: 1;">
            <div v-if="getAllOfferImages(selectedOffer).length > 0" class="relative">
              <!-- Conteneur de l'image avec boutons de navigation -->
              <div class="relative w-full max-w-md mx-auto">
                <img
                  :src="getAllOfferImages(selectedOffer)[detailModalImageIndex]"
                  :alt="`${selectedOffer.title} - Image ${detailModalImageIndex + 1}`"
                  @click="openImageGallery(detailModalImageIndex)"
                  class="w-full h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  style="position: relative; z-index: 1; display: block;"
                />
                
                <!-- Boutons de navigation (affichés seulement s'il y a plusieurs images) -->
                <div v-if="getAllOfferImages(selectedOffer).length > 1" class="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                  <!-- Bouton précédent -->
                  <button
                    @click.stop="previousDetailImage"
                    class="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all pointer-events-auto"
                    :disabled="getAllOfferImages(selectedOffer).length <= 1"
                    :class="{ 'opacity-50 cursor-not-allowed': getAllOfferImages(selectedOffer).length <= 1 }"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <!-- Bouton suivant -->
                  <button
                    @click.stop="nextDetailImage"
                    class="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all pointer-events-auto"
                    :disabled="getAllOfferImages(selectedOffer).length <= 1"
                    :class="{ 'opacity-50 cursor-not-allowed': getAllOfferImages(selectedOffer).length <= 1 }"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <!-- Indicateur d'image actuelle (affiché seulement s'il y a plusieurs images) -->
                <div v-if="getAllOfferImages(selectedOffer).length > 1" class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm" style="z-index: 2;">
                  {{ detailModalImageIndex + 1 }} / {{ getAllOfferImages(selectedOffer).length }}
                </div>
              </div>
            </div>
            <div v-else class="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center" style="position: relative; z-index: 1;">
              <span class="text-8xl text-slate-500">{{ selectedOffer.type === 'service' ? '🔧' : selectedOffer.type === 'product' ? '📦' : '🎯' }}</span>
            </div>
          </div>

          <!-- Description dans un cadre -->
          <div class="bg-slate-700 rounded-lg p-4 mb-6" style="z-index: 10; background-color: rgb(51 65 85); position: relative; isolation: isolate; transform: translateZ(0);">
            <h3 class="text-lg font-semibold text-slate-300 mb-3">Description</h3>
            <p class="text-slate-300 leading-relaxed">{{ selectedOffer.description }}</p>
          </div>

          <!-- Informations dans un autre cadre -->
          <div class="bg-slate-700 rounded-lg p-4 mb-6" style="z-index: 10; background-color: rgb(51 65 85); position: relative; isolation: isolate; transform: translateZ(0);">
            <h3 class="text-lg font-semibold text-slate-300 mb-3">Informations</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-slate-400">Prix:</span>
                <span class="text-xl font-bold text-sky-400">{{ formatPrice(selectedOffer.price) }} {{ selectedOffer.currency || '' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-400">Vendeur:</span>
                <span class="text-slate-300 font-medium">{{ selectedOffer.seller_name }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-400">Type:</span>
                <span class="text-slate-300">{{ selectedOffer.type === 'service' ? 'Service' : selectedOffer.type === 'product' ? 'Produit' : 'Offre' }}</span>
              </div>
            </div>
          </div>

          <!-- Section pour le vendeur : Dernier avis et dernier message -->
          <div v-if="selectedOffer.is_seller" class="mb-6 space-y-4 relative" style="z-index: 10;">
            <!-- Dernier avis -->
            <div v-if="selectedOffer.latest_review" class="bg-slate-700 rounded-lg p-4 relative" style="z-index: 10; background-color: rgb(51 65 85);">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-slate-300">Dernier avis</h3>
                <button
                  @click="viewAllReviews(selectedOffer.id)"
                  class="text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Voir tous les avis →
                </button>
              </div>
              <div class="bg-slate-800 rounded-lg p-3" style="background-color: rgb(30 41 55);">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="font-semibold text-white">{{ selectedOffer.latest_review.user_name }}</div>
                    <div class="flex items-center gap-1 mt-1">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'w-4 h-4',
                          star <= selectedOffer.latest_review.rating ? 'text-yellow-400 fill-current' : 'text-slate-500'
                        ]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <span class="text-xs text-slate-500">{{ formatDate(selectedOffer.latest_review.created_at) }}</span>
                </div>
                <p class="text-slate-300 text-sm">{{ selectedOffer.latest_review.comment }}</p>
              </div>
            </div>
            <div v-else class="bg-slate-700 rounded-lg p-4" style="background-color: rgb(51 65 85); z-index: 10; position: relative;">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-slate-300">Dernier avis</h3>
                <button
                  @click="viewAllReviews(selectedOffer.id)"
                  class="text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Voir tous les avis →
                </button>
              </div>
              <p class="text-slate-400 text-sm mt-2">Aucun avis pour le moment</p>
            </div>

            <!-- Dernier message -->
            <div v-if="selectedOffer.latest_message" class="bg-slate-700 rounded-lg p-4" style="background-color: rgb(51 65 85); z-index: 10; position: relative;">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-slate-300">Dernier message</h3>
                <button
                  @click="viewAllMessages(selectedOffer.id)"
                  class="text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Voir tous les messages →
                </button>
              </div>
              <div class="bg-slate-800 rounded-lg p-3" style="background-color: rgb(30 41 55);">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="font-semibold text-white">{{ selectedOffer.latest_message.sender_name }}</div>
                    <div class="text-xs text-slate-400 mt-1">À propos de cette offre</div>
                  </div>
                  <span class="text-xs text-slate-500">{{ formatDate(selectedOffer.latest_message.created_at) }}</span>
                </div>
                <p class="text-slate-300 text-sm">{{ selectedOffer.latest_message.message }}</p>
              </div>
            </div>
            <div v-else class="bg-slate-700 rounded-lg p-4" style="background-color: rgb(51 65 85); z-index: 10; position: relative;">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-slate-300">Dernier message</h3>
                <button
                  @click="viewAllMessages(selectedOffer.id)"
                  class="text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Voir tous les messages →
                </button>
              </div>
              <p class="text-slate-400 text-sm mt-2">Aucun message pour le moment</p>
            </div>
          </div>

          <!-- Section Avis (pour les non-vendeurs) -->
          <div v-if="!selectedOffer.is_seller" class="mb-6 relative" style="z-index: 10;">
            <h3 class="text-lg font-semibold text-slate-300 mb-4">Avis ({{ selectedOffer.reviews?.length || 0 }})</h3>
            
            <!-- Formulaire d'avis (masqué pour le vendeur) -->
            <div class="bg-slate-700 rounded-lg p-4 mb-4" style="background-color: rgb(51 65 85);">
              <textarea
                v-model="newReview.comment"
                rows="3"
                placeholder="Laissez un commentaire..."
                class="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-3"
              ></textarea>
              <div class="flex items-center gap-2 mb-3">
                <span class="text-slate-400 text-sm">Note:</span>
                <div class="flex gap-1">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="newReview.rating = star"
                    :class="[
                      'w-6 h-6 transition-all',
                      star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-slate-500'
                    ]"
                  >
                    <svg viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="submitReview(selectedOffer.id)"
                :disabled="!newReview.comment.trim() || !newReview.rating || newReview.rating < 1 || newReview.rating > 5 || isSubmittingReview"
                class="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {{ isSubmittingReview ? 'Envoi...' : 'Publier l\'avis' }}
              </button>
            </div>

            <!-- Liste des avis -->
            <div v-if="selectedOffer.reviews && selectedOffer.reviews.length > 0" class="space-y-4">
              <div
                v-for="review in selectedOffer.reviews"
                :key="review.id"
                class="bg-slate-700 rounded-lg p-4"
                style="background-color: rgb(51 65 85);"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="font-semibold text-white">{{ review.user_name }}</div>
                    <div class="flex items-center gap-1 mt-1">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        :class="[
                          'w-4 h-4',
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-500'
                        ]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <span class="text-xs text-slate-500">{{ formatDate(review.created_at) }}</span>
                </div>
                <p class="text-slate-300 text-sm">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-slate-500">
              Aucun avis pour le moment
            </div>
          </div>

          <!-- Actions : Acheter et Favoris -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              v-if="!selectedOffer.is_seller"
              @click="addToCart(selectedOffer.id)"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3 px-4 sm:px-6 rounded-lg transition-all font-semibold shadow-lg text-center text-sm sm:text-base"
            >
              Acheter
            </button>
            <div v-if="selectedOffer.is_seller" class="flex flex-col sm:flex-row gap-2 flex-1">
              <button
                @click="editOffer(selectedOffer.id)"
                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-all font-semibold text-sm sm:text-base"
              >
                Modifier
              </button>
              <button
                @click="viewOfferStats(selectedOffer.id)"
                class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-all font-semibold text-sm sm:text-base"
              >
                Statistiques
              </button>
              <button
                @click="viewAllReviews(selectedOffer.id)"
                class="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-all font-semibold text-sm sm:text-base"
              >
                Avis
              </button>
              <button
                @click="viewAllMessages(selectedOffer.id)"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-all font-semibold text-sm sm:text-base"
              >
                Messages
              </button>
              <button
                @click="deleteOffer(selectedOffer.id)"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 sm:px-6 rounded-lg transition-all font-semibold text-sm sm:text-base"
              >
                Supprimer
              </button>
            </div>
            <button
              v-if="!selectedOffer.is_seller"
              @click="toggleFavorite(selectedOffer.id)"
              :class="[
                'px-4 sm:px-6 py-3 rounded-lg transition-all font-semibold text-sm sm:text-base',
                selectedOffer.is_favorite
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              ]"
            >
              {{ selectedOffer.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création d'offre -->
    <div
      v-if="showCreateOfferModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="showCreateOfferModal = false"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-100" style="z-index: 100;">
          <h2 class="text-2xl font-bold text-white">Créer une offre</h2>
          <button
            @click="showCreateOfferModal = false"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="createOffer" class="p-6 space-y-4" enctype="multipart/form-data">
          <!-- Upload d'images multiples -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Images de l'offre</label>
            <div class="space-y-3">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageSelect"
                multiple
                class="hidden"
                id="offer-image-input"
              />
              <label
                for="offer-image-input"
                class="block cursor-pointer bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg px-4 py-8 text-center hover:border-sky-500 transition-colors"
              >
                <svg class="w-12 h-12 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-slate-400 text-sm">Cliquez pour téléverser des images</p>
                <p class="text-slate-500 text-xs">JPG, PNG, GIF, WEBP (max 5MB par image)</p>
              </label>
              
              <!-- Aperçu des images sélectionnées -->
              <div v-if="selectedImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 relative" style="z-index: 10; isolation: isolate;">
                <div
                  v-for="(img, index) in selectedImages"
                  :key="index"
                  class="relative group"
                  style="z-index: 10;"
                >
                  <img :src="img.preview" alt="Aperçu" class="w-full h-32 object-cover rounded-lg" style="position: relative; z-index: 1;" />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2" style="z-index: 2;">
                    <button
                      type="button"
                      @click="openCropModal(index)"
                      class="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-2 transition-colors"
                      title="Rogner l'image"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                      title="Supprimer l'image"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Titre *</label>
            <input
              v-model="newOffer.title"
              type="text"
              required
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Titre de votre offre"
            />
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Description *</label>
            <textarea
              v-model="newOffer.description"
              rows="4"
              required
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Description détaillée de votre offre"
            ></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-300 font-medium mb-2">Type *</label>
              <select
                v-model="newOffer.type"
                required
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Sélectionner</option>
                <option value="offer">Offre</option>
                <option value="product">Produit</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-2">Prix *</label>
              <input
                v-model.number="newOffer.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Devise</label>
            <select
              v-model="newOffer.currency"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="XOF">XOF (FCFA)</option>
              <option value="GNF">GNF (GNF)</option>
            </select>
          </div>

          <div v-if="createError" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
            {{ createError }}
          </div>

          <div class="flex gap-4">
          <button
            type="button"
            @click="resetCreateOfferForm"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Annuler
          </button>
            <button
              type="submit"
              :disabled="isCreatingOffer"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg"
            >
              {{ isCreatingOffer ? 'Création...' : 'Créer l\'offre' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de contact avec l'annonceur -->
    <div
      v-if="showContactSellerModal && contactSellerOffer"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      @click.self="showContactSellerModal = false"
    >
      <div class="bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full my-auto max-h-[95vh] overflow-y-auto">
        <div class="p-4 sm:p-6 border-b border-slate-700">
          <h2 class="text-lg sm:text-2xl font-bold text-white mb-2">Mode de paiement en cours de développement</h2>
          <p class="text-slate-400 text-xs sm:text-sm">
            Le système de paiement n'est pas encore disponible. Contactez directement l'annonceur pour finaliser votre achat.
          </p>
        </div>

        <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
            <div class="flex items-start gap-2 sm:gap-3">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-yellow-400 font-semibold mb-1 text-sm sm:text-base">Information importante</p>
                <p class="text-yellow-300 text-xs sm:text-sm">
                  Vous pouvez contacter directement <strong class="break-words">{{ contactSellerOffer.seller_name }}</strong> ou lui laisser un message ci-dessous.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2 text-sm sm:text-base">Votre message à l'annonceur</label>
            <textarea
              v-model="contactMessage"
              rows="4"
              placeholder="Bonjour, je suis intéressé(e) par votre offre..."
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            ></textarea>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              @click="showContactSellerModal = false; contactMessage = ''; contactSellerOffer = null"
              class="w-full sm:flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 sm:py-2 px-4 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              @click="sendMessageToSeller"
              :disabled="!contactMessage.trim() || isSendingMessage"
              class="w-full sm:flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 sm:py-2 px-4 rounded-lg transition-all font-semibold text-sm sm:text-base"
            >
              {{ isSendingMessage ? 'Envoi...' : 'Envoyer le message' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition d'offre -->
    <div
      v-if="showEditOfferModal && editingOffer"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="showEditOfferModal = false; editingOffer = null"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between z-100" style="z-index: 100;">
          <h2 class="text-2xl font-bold text-white">Modifier l'offre</h2>
          <button
            @click="showEditOfferModal = false; editingOffer = null"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="updateOffer" class="p-6 space-y-4" enctype="multipart/form-data">
          <!-- Upload d'images multiples -->
          <div style="position: relative; z-index: 1;">
            <label class="block text-slate-300 font-medium mb-3">Images de l'offre</label>
            
            <!-- Zone d'upload principale -->
            <div class="space-y-4" style="position: relative; z-index: 1;">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleMultipleImageSelect"
                class="hidden"
                id="edit-offer-images-input"
              />
              
              <!-- Affichage des images existantes et nouvelles -->
              <div v-if="selectedImages.length > 0" class="space-y-4">
                <!-- Grille des images -->
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <div 
                    v-for="(image, index) in selectedImages" 
                    :key="index" 
                    class="relative group"
                    :class="image.isExisting ? 'cursor-pointer' : ''"
                    @click="image.isExisting && $refs.imageInput.click()"
                  >
                    <!-- Conteneur de l'image -->
                    <div class="relative overflow-hidden rounded-lg border-2 transition-all duration-200"
                         :class="image.isExisting 
                           ? 'border-blue-500/50 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20' 
                           : 'border-slate-600 hover:border-slate-500'">
                      <img 
                        :src="image.preview" 
                        :alt="image.file?.name || 'Image existante'" 
                        class="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      
                      <!-- Overlay pour les images existantes -->
                      <div v-if="image.isExisting" class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div class="bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Remplacer
                        </div>
                      </div>
                      
                      <!-- Badge pour les images existantes -->
                      <div v-if="image.isExisting" class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        Existant
                      </div>
                      
                      <!-- Bouton de suppression -->
                      <button
                        type="button"
                        @click.stop="removeImage(index)"
                        class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                        :title="image.isExisting ? 'Supprimer cette image' : 'Retirer cette image'"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Bouton pour ajouter plus d'images -->
                <div class="flex justify-center">
                  <button
                    type="button"
                    @click="$refs.imageInput.click()"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-600 hover:border-sky-500"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter d'autres images
                  </button>
                </div>
              </div>
              
              <!-- Zone d'upload vide (quand aucune image) -->
              <label
                v-else
                for="edit-offer-images-input"
                class="flex flex-col items-center justify-center cursor-pointer bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg px-6 py-12 text-center hover:border-sky-500 hover:bg-slate-700 transition-all duration-200"
              >
                <svg class="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-slate-300 font-medium mb-1">Cliquez pour ajouter des images</p>
                <p class="text-slate-400 text-xs">Formats acceptés : JPG, PNG, GIF, WEBP (max 5MB par image)</p>
              </label>
            </div>
          </div>

          <div style="position: relative; z-index: 10; background-color: rgb(51 65 85);">
            <label class="block text-slate-300 font-medium mb-2">Titre *</label>
            <input
              v-model="newOffer.title"
              type="text"
              required
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Titre de votre offre"
            />
          </div>

          <div style="position: relative; z-index: 10; background-color: rgb(51 65 85);">
            <label class="block text-slate-300 font-medium mb-2">Description *</label>
            <textarea
              v-model="newOffer.description"
              rows="4"
              required
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Description détaillée de votre offre"
            ></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-4" style="position: relative; z-index: 10; background-color: rgb(51 65 85);">
            <div>
              <label class="block text-slate-300 font-medium mb-2">Type *</label>
              <select
                v-model="newOffer.type"
                required
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Sélectionner</option>
                <option value="offer">Offre</option>
                <option value="product">Produit</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-2">Prix *</label>
              <input
                v-model.number="newOffer.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div style="position: relative; z-index: 10; background-color: rgb(51 65 85);">
            <label class="block text-slate-300 font-medium mb-2">Devise</label>
            <select
              v-model="newOffer.currency"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="XOF">XOF (FCFA)</option>
              <option value="GNF">GNF (GNF)</option>
            </select>
          </div>

          <div v-if="createError" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm" style="position: relative; z-index: 10;">
            {{ createError }}
          </div>

          <div class="flex gap-4" style="position: relative; z-index: 10;">
            <button
              type="button"
              @click="showEditOfferModal = false; editingOffer = null; resetCreateOfferForm()"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isCreatingOffer"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg"
            >
              {{ isCreatingOffer ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de statistiques -->
    <div
      v-if="showStatsModal && offerStats"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showStatsModal = false; offerStats = null"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
        <div class="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Statistiques de l'offre</h2>
          <button
            @click="showStatsModal = false; offerStats = null"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="text-slate-400 text-sm mb-1">Favoris</div>
              <div class="text-3xl font-bold text-sky-400">{{ offerStats.total_favorites }}</div>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="text-slate-400 text-sm mb-1">Avis</div>
              <div class="text-3xl font-bold text-yellow-400">{{ offerStats.total_reviews }}</div>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="text-slate-400 text-sm mb-1">Note moyenne</div>
              <div class="text-3xl font-bold text-purple-400">{{ formatRating(offerStats.average_rating) }}</div>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="text-slate-400 text-sm mb-1">Achats</div>
              <div class="text-3xl font-bold text-green-400">{{ offerStats.total_purchases }}</div>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="text-slate-400 text-sm mb-1">Messages</div>
              <div class="text-3xl font-bold text-indigo-400">{{ offerStats.total_messages }}</div>
            </div>
            <div class="bg-slate-700/50 rounded-lg p-4">
              <div class="text-slate-400 text-sm mb-1">Revenus</div>
              <div class="text-3xl font-bold text-emerald-400">{{ formatPrice(offerStats.revenue) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Système de notifications toast -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <transition-group name="toast" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'min-w-[300px] max-w-md rounded-lg shadow-xl p-4 flex items-start gap-3',
            notification.type === 'success' ? 'bg-green-600' : 
            notification.type === 'error' ? 'bg-red-600' : 
            notification.type === 'warning' ? 'bg-yellow-600' : 
            'bg-blue-600'
          ]"
        >
          <div class="flex-1">
            <p class="text-white font-medium">{{ notification.message }}</p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Modal de galerie d'images -->
    <div
      v-if="showImageGallery && galleryImages.length > 0"
      class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="closeImageGallery"
    >
      <div class="relative w-full h-full flex items-center justify-center max-w-7xl max-h-[90vh]">
        <!-- Bouton précédent -->
        <button
          v-if="galleryImages.length > 1"
          @click="previousImage"
          class="absolute left-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Image principale -->
        <div 
          class="flex-1 flex items-center justify-center h-full"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
          @touchmove.prevent
        >
          <img
            :src="galleryImages[currentImageIndex].url || galleryImages[currentImageIndex]"
            :alt="`Image ${currentImageIndex + 1} de ${galleryImages.length}`"
            class="max-w-full max-h-full object-contain rounded-lg select-none"
            @click="closeImageGallery"
            draggable="false"
          />
        </div>

        <!-- Bouton suivant -->
        <button
          v-if="galleryImages.length > 1"
          @click="nextImage"
          class="absolute right-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Bouton fermer -->
        <button
          @click="closeImageGallery"
          class="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Indicateur d'images (miniatures en bas) -->
        <div v-if="galleryImages.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
          <button
            v-for="(img, index) in galleryImages"
            :key="index"
            @click="currentImageIndex = index"
            :class="[
              'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0',
              currentImageIndex === index ? 'border-sky-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
            ]"
          >
            <img
              :src="img.url || img"
              :alt="`Miniature ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>

        <!-- Compteur d'images -->
        <div v-if="galleryImages.length > 1" class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
          {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
        </div>
      </div>
    </div>

    <!-- Modal de tous les avis -->
    <div
      v-if="showAllReviewsModal && selectedOffer"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="showAllReviewsModal = false"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Tous les avis ({{ selectedOffer.reviews?.length || 0 }})</h2>
          <button
            @click="showAllReviewsModal = false"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div v-if="selectedOffer.reviews && selectedOffer.reviews.length > 0" class="space-y-4">
            <div
              v-for="review in selectedOffer.reviews"
              :key="review.id"
              class="bg-slate-700/50 rounded-lg p-4"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <div class="font-semibold text-white">{{ review.user_name }}</div>
                  <div class="flex items-center gap-1 mt-1">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      :class="[
                        'w-4 h-4',
                        star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-500'
                      ]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <span class="text-xs text-slate-500">{{ formatDate(review.created_at) }}</span>
              </div>
              <p class="text-slate-300 text-sm">{{ review.comment }}</p>
            </div>
          </div>
          <div v-else class="text-center py-12 text-slate-500">
            Aucun avis pour le moment
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ AMÉLIORATION : Modal de conversation avec historique complet -->
    <div
      v-if="showAllMessagesModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
      @click.self="closeConversationModal"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
        <!-- Header avec informations de l'annonce -->
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 sm:p-6 flex items-center justify-between z-10">
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold text-white truncate">Conversation</h2>
            <div class="mt-1">
              <p v-if="conversationOffer" class="text-sm text-slate-300 font-medium truncate">{{ conversationOffer.title }}</p>
              <p v-if="conversationOtherUser" class="text-xs text-slate-400 mt-1">
                Avec {{ conversationOtherUser.name }}
              </p>
            </div>
          </div>
          <button
            @click="closeConversationModal"
            class="ml-4 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Zone de messages avec scroll -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/50">
          <div v-if="offerMessages.length > 0">
            <div
              v-for="message in offerMessages"
              :key="message.id"
              :class="[
                'flex',
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'rounded-2xl px-4 py-3 max-w-[75%] sm:max-w-[65%]',
                  message.sender_id === user?.id 
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white' 
                    : 'bg-slate-700 text-slate-100'
                ]"
              >
                <!-- En-tête du message -->
                <div class="flex items-center gap-2 mb-1">
                  <span :class="[
                    'text-xs font-semibold',
                    message.sender_id === user?.id ? 'text-white/90' : 'text-slate-300'
                  ]">
                    {{ message.sender_id === user?.id ? 'Vous' : message.sender_name }}
                  </span>
                  <span :class="[
                    'text-xs',
                    message.sender_id === user?.id ? 'text-white/70' : 'text-slate-400'
                  ]">
                    {{ formatMessageTime(message.created_at) }}
                  </span>
                </div>
                
                <!-- Contenu du message -->
                <p :class="[
                  'text-sm whitespace-pre-wrap break-words',
                  message.sender_id === user?.id ? 'text-white' : 'text-slate-200'
                ]">
                  {{ message.message }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center text-slate-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="text-lg font-medium">Aucun message pour le moment</p>
              <p class="text-sm mt-2">Commencez la conversation en envoyant un message ci-dessous</p>
            </div>
          </div>
        </div>

        <!-- Zone de saisie de message (toujours visible en bas) -->
        <div class="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4 sm:p-6">
          <div class="flex gap-3">
            <textarea
              v-model="newMessageText"
              @keydown.enter.exact.prevent="sendNewMessage"
              @keydown.enter.shift.exact="newMessageText += '\n'"
              rows="2"
              placeholder="Tapez votre message..."
              class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            ></textarea>
            <button
              @click="sendNewMessage"
              :disabled="!newMessageText.trim() || isSendingMessage"
              class="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all font-semibold flex-shrink-0"
            >
              <svg v-if="!isSendingMessage" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          <p class="text-xs text-slate-500 mt-2 text-center">Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="handleCancel"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-6 border-b border-slate-700">
          <h3 class="text-xl font-bold text-white">Confirmation</h3>
        </div>
        <div class="p-6">
          <p class="text-slate-300 mb-6">{{ confirmMessage }}</p>
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer avec navigation -->
  </div>

  <!-- Modal de rognage d'image -->
  <div
    v-if="showCropModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="closeCropModal"
  >
    <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Rogner l'image</h2>
        <button
          @click="closeCropModal"
          class="text-slate-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <div v-if="imageToCrop" class="space-y-4">
          <div class="bg-slate-900 rounded-lg p-4">
            <Cropper
              ref="cropper"
              class="marketplace-cropper"
              :src="imageToCrop.preview"
              :stencil-props="{ 
                aspectRatio: 1,
                movable: true,
                resizable: true
              }"
              :default-boundaries="{
                type: 'fit'
              }"
              :default-size="{
                width: (minWidth, maxWidth) => Math.min(minWidth, maxWidth),
                height: (minHeight, maxHeight) => Math.min(minHeight, maxHeight)
              }"
              :resize-image="{ 
                touch: true, 
                wheel: { ratio: 0.1 }, 
                adjustStencil: false 
              }"
              :move-image="{ touch: true, mouse: true }"
              :canvas="{ 
                width: 1200, 
                height: 1200, 
                imageSmoothingEnabled: true, 
                imageSmoothingQuality: 'high' 
              }"
            />
          </div>

          <div class="space-y-4">
            <p class="text-slate-400 text-sm text-center">
              Molette ou pinch pour zoomer · Glisser pour déplacer · Cadre carré 1:1 (avatars/logos)
            </p>

            <!-- Boutons d'action -->
            <div class="flex gap-4">
              <button
                type="button"
                @click="closeCropModal"
                class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="button"
                @click="applyCrop"
                class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg"
              >
                Appliquer le rognage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import apiClient from '@/api';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import Cookies from 'js-cookie';

const router = useRouter();
const { logout, user } = useAuth();

// États
const isLoading = ref(false);
const activeTab = ref('all');
const offers = ref([]);
const searchQuery = ref('');
const searchTimeout = ref(null);
const selectedOffer = ref(null);
const showCreateOfferModal = ref(false);
const isCreatingOffer = ref(false);
const createError = ref('');
const isSubmittingReview = ref(false);
const newReview = ref({ comment: '', rating: 0 });

const newOffer = ref({
  title: '',
  description: '',
  type: '',
  price: 0,
  currency: 'EUR',
  image_url: ''
});

const imageInput = ref(null);
const selectedImages = ref([]);
const showCropModal = ref(false);
const imageToCrop = ref(null);
const cropImageIndex = ref(-1);
const cropper = ref(null);

// Computed - Les offres sont déjà filtrées côté backend
const filteredOffers = computed(() => {
  return offers.value;
});

// Méthodes
const loadOffers = async () => {
  isLoading.value = true;
  try {
    // ✅ AMÉLIORATION : Si on est sur l'onglet "Mes Messages", charger les conversations groupées
    if (activeTab.value === 'messages') {
      const response = await apiClient.get('/api/marketplace/messages');
      // Transformer les conversations en format "offre" pour l'affichage
      offers.value = response.data.map(conv => ({
        id: conv.offer_id,
        title: conv.offer_title,
        description: conv.last_message,
        type: 'message',
        price: 0,
        currency: '',
        image_url: conv.offer_image_url,
        seller_name: conv.other_user_name,
        is_message: true,
        message_data: conv,
        unread_count: conv.unread_count,
        last_message_created_at: conv.last_message_created_at,
        created_at: conv.last_message_created_at,
      }));
    } else {
      // Envoyer le filtre actif et la recherche au backend
      const filter = activeTab.value === 'all' ? 'all' : activeTab.value;
      const params = { filter };
      if (searchQuery.value.trim()) {
        params.search = searchQuery.value.trim();
      }
      const response = await apiClient.get('/api/marketplace/offers', { params });
      offers.value = response.data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des offres:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Recherche en temps réel (dès la première lettre)
const onSearchInput = () => {
  // Annuler le timeout précédent
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  // Débounce : attendre 300ms après la dernière frappe avant de rechercher
  searchTimeout.value = setTimeout(() => {
    loadOffers();
  }, 300);
};

// Effacer la recherche
const clearSearch = () => {
  searchQuery.value = '';
  loadOffers();
};

const viewOfferDetails = async (offerId) => {
  // Réinitialiser l'index de l'image
  detailModalImageIndex.value = 0;
  
  // Afficher immédiatement le modal avec les données déjà disponibles pour une réactivité instantanée
  const existingOffer = offers.value.find(o => o.id === offerId);
  if (existingOffer) {
    // Créer une copie des données existantes pour afficher immédiatement
    selectedOffer.value = { ...existingOffer };
    
    // Vérifier si l'utilisateur actuel est le vendeur
    if (user.value && selectedOffer.value) {
      selectedOffer.value.is_seller = selectedOffer.value.seller_id === user.value.id || selectedOffer.value.user_id === user.value.id;
    }
  }
  
  // Charger les détails complets en arrière-plan et mettre à jour le modal
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}`);
    // Mettre à jour avec les données complètes
    selectedOffer.value = response.data;
    
    // Vérifier si l'utilisateur actuel est le vendeur
    if (user.value && selectedOffer.value) {
      selectedOffer.value.is_seller = selectedOffer.value.seller_id === user.value.id || selectedOffer.value.user_id === user.value.id;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des détails:', error);
    // Si l'erreur survient et qu'on n'avait pas de données existantes, fermer le modal
    if (!existingOffer) {
      selectedOffer.value = null;
      showNotification('Erreur lors du chargement des détails de l\'offre', 'error');
    }
  }
};

const toggleFavorite = async (offerId) => {
  try {
    await apiClient.post(`/api/marketplace/offers/${offerId}/toggle-favorite`);
    // Mettre à jour l'état local
    const offer = offers.value.find(o => o.id === offerId);
    if (offer) {
      offer.is_favorite = !offer.is_favorite;
    }
    if (selectedOffer.value && selectedOffer.value.id === offerId) {
      selectedOffer.value.is_favorite = !selectedOffer.value.is_favorite;
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
  }
};

const showContactSellerModal = ref(false);
const contactSellerOffer = ref(null);
const contactMessage = ref('');
const isSendingMessage = ref(false);
const showEditOfferModal = ref(false);
const editingOffer = ref(null);
const showStatsModal = ref(false);
const offerStats = ref(null);
const isDeletingOffer = ref(false);
const showAllReviewsModal = ref(false);
const showAllMessagesModal = ref(false);
const offerMessages = ref([]);
const replyingToMessage = ref(null);
const replyMessage = ref('');
const isSendingReply = ref(false);
// ✅ FIX: badge + polling pour "Mes Messages"
const totalUnreadMessages = ref(0);
const messagesPollingInterval = ref(null);
const conversationOffer = ref(null);
const conversationOtherUser = ref(null);
const newMessageText = ref('');
const messagesContainer = ref(null);
const showMatchNotificationsModal = ref(false);
const matchNotifications = ref([]);
const matchNotificationsUnreadCount = ref(0);
const matchNotificationsPollingInterval = ref(null);

// Galerie d'images
const showImageGallery = ref(false);
const galleryImages = ref([]);
const currentImageIndex = ref(0);
// Index de l'image actuelle dans la modal de détails
const detailModalImageIndex = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchEndX = ref(0);
const touchEndY = ref(0);

// Système de notifications
const notifications = ref([]);
let notificationIdCounter = 0;

const showNotification = (message, type = 'info') => {
  const id = ++notificationIdCounter;
  notifications.value.push({ id, message, type });
  
  // Supprimer automatiquement après 5 secondes
  setTimeout(() => {
    removeNotification(id);
  }, 5000);
};

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// Système de confirmation
const showConfirmModal = ref(false);
const confirmMessage = ref('');
const confirmCallback = ref(null);

const confirmAction = (message, callback) => {
  confirmMessage.value = message;
  confirmCallback.value = callback;
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  if (confirmCallback.value) {
    confirmCallback.value();
  }
  showConfirmModal.value = false;
  confirmMessage.value = '';
  confirmCallback.value = null;
};

const handleCancel = () => {
  showConfirmModal.value = false;
  confirmMessage.value = '';
  confirmCallback.value = null;
};

const addToCart = async (offerId) => {
  // Trouver l'offre pour afficher le modal de contact
  const offer = offers.value.find(o => o.id === offerId) || selectedOffer.value;
  if (offer) {
    contactSellerOffer.value = offer;
    showContactSellerModal.value = true;
  }
};

const sendMessageToSeller = async () => {
  if (!contactMessage.value.trim() || !contactSellerOffer.value) return;
  
  isSendingMessage.value = true;
  try {
    await apiClient.post('/api/marketplace/send-message', {
      offer_id: contactSellerOffer.value.id,
      seller_id: contactSellerOffer.value.seller_id || contactSellerOffer.value.user_id,
      message: contactMessage.value
    });
    
    showNotification('Message envoyé à l\'annonceur avec succès !', 'success');
    contactMessage.value = '';
    showContactSellerModal.value = false;
    contactSellerOffer.value = null;
    
    // ✅ NOUVEAU : Recharger les conversations si on est sur l'onglet messages
    if (activeTab.value === 'messages') {
      await loadOffers();
    }
    
    // ✅ NOUVEAU : Recharger le nombre de messages non lus
    await loadUnreadMessagesCount();
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    showNotification(error.response?.data?.message || 'Erreur lors de l\'envoi du message', 'error');
  } finally {
    isSendingMessage.value = false;
  }
};

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file, fileIndex) => {
    if (file && file.size <= 5 * 1024 * 1024) { // Max 5MB
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          file: file,
          preview: e.target.result,
          name: file.name,
          originalFile: file
        };
        selectedImages.value.push(imageData);
        // Ouvrir le modal de rognage pour cette image
        openCropModal(selectedImages.value.length - 1);
      };
      reader.readAsDataURL(file);
    } else {
      showNotification(`L'image ${file.name} est trop grande (max 5MB)`, 'warning');
    }
  });
};

const openCropModal = (index) => {
  if (index >= 0 && index < selectedImages.value.length) {
    cropImageIndex.value = index;
    imageToCrop.value = { ...selectedImages.value[index] };
    showCropModal.value = true;
  }
};

const closeCropModal = () => {
  showCropModal.value = false;
  imageToCrop.value = null;
  cropImageIndex.value = -1;
};

const applyCrop = () => {
  if (!cropper.value || cropImageIndex.value < 0) return;

  try {
    const result = cropper.value.getResult();
    const canvas = result.canvas;

    if (!canvas) {
      showNotification('Erreur lors du rognage de l\'image', 'error');
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        showNotification('Erreur lors de la conversion de l\'image', 'error');
        return;
      }

      const croppedFile = new File([blob], selectedImages.value[cropImageIndex.value].name, {
        type: blob.type || 'image/jpeg',
        lastModified: Date.now()
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const originalFile = selectedImages.value[cropImageIndex.value].originalFile || selectedImages.value[cropImageIndex.value].file;
        selectedImages.value[cropImageIndex.value] = {
          file: originalFile,
          croppedFile,
          preview: e.target.result,
          croppedPreview: e.target.result,
          name: originalFile.name,
          originalFile
        };
        showNotification('Image rognée avec succès', 'success');
        closeCropModal();
      };
      reader.readAsDataURL(croppedFile);
    }, 'image/jpeg', 0.9);
  } catch (error) {
    console.error('Erreur lors du rognage:', error);
    showNotification('Erreur lors du rognage de l\'image', 'error');
  }
};

const removeImage = (index) => {
  selectedImages.value.splice(index, 1);
};

const handleMultipleImageSelect = (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach(file => {
    if (file && file.size <= 5 * 1024 * 1024) { // Max 5MB
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    } else {
      showNotification('Le fichier ' + file.name + ' est trop volumineux. Taille maximale: 5MB', 'warning');
    }
  });
};

const createOffer = async () => {
  if (!newOffer.value.title || !newOffer.value.description || !newOffer.value.type || !newOffer.value.price) {
    createError.value = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }
  
  if (selectedImages.value.length === 0) {
    createError.value = 'Veuillez téléverser au moins une image.';
    return;
  }
  
  isCreatingOffer.value = true;
  createError.value = '';
  
  try {
    // ✅ CRITIQUE: Récupérer le cookie CSRF avant la requête
    try {
      await apiClient.get('/sanctum/csrf-cookie');
    } catch (csrfError) {
      console.warn('Erreur lors de la récupération du cookie CSRF:', csrfError);
    }
    
    // ✅ CRITIQUE: Mettre à jour le header CSRF
    const setCsrfHeader = () => {
      const xsrfToken = Cookies.get('XSRF-TOKEN');
      if (xsrfToken) {
        apiClient.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      } else {
        console.warn('Cookie XSRF-TOKEN non trouvé.');
        delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
      }
    };
    setCsrfHeader();
    
    const formData = new FormData();
    formData.append('title', newOffer.value.title);
    formData.append('description', newOffer.value.description);
    formData.append('type', newOffer.value.type);
    formData.append('price', newOffer.value.price);
    formData.append('currency', newOffer.value.currency || 'EUR');
    
    // ✅ CORRECTION : Ajouter toutes les images avec validation
    selectedImages.value.forEach((img, index) => {
      // Priorité : originalFile > file > croppedFile
      let imageToSend = img.originalFile || img.file || img.croppedFile;
      
      // ✅ CORRECTION : S'assurer que c'est un File object valide
      if (!imageToSend) {
        console.error(`Image ${index} n'est pas disponible:`, img);
        createError.value = `L'image ${index + 1} n'est pas valide. Veuillez la retéléverser.`;
        throw new Error(`Image ${index} invalide`);
      }
      
      // Si c'est un Blob, le convertir en File
      if (imageToSend instanceof Blob && !(imageToSend instanceof File)) {
        imageToSend = new File([imageToSend], img.name || `image-${index}.jpg`, {
          type: imageToSend.type || 'image/jpeg',
          lastModified: Date.now()
        });
      }
      
      // Vérifier que c'est bien un File
      if (!(imageToSend instanceof File)) {
        console.error(`Image ${index} n'est pas un File object:`, imageToSend);
        createError.value = `L'image ${index + 1} n'est pas un fichier valide. Veuillez la retéléverser.`;
        throw new Error(`Image ${index} n'est pas un File`);
      }
      
      // ✅ CORRECTION : Utiliser la syntaxe Laravel pour les tableaux (images[] ou images.0)
      formData.append('images[]', imageToSend);
    });
    
    const response = await apiClient.post('/api/marketplace/offers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    offers.value.unshift(response.data);
    resetCreateOfferForm();
    await loadOffers(); // Recharger les offres pour mettre à jour la liste
    showNotification('Offre créée avec succès !', 'success');
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre:', error);
    if (error.response?.status === 419) {
      createError.value = 'Session expirée. Veuillez rafraîchir la page et réessayer.';
      showNotification('Session expirée. Veuillez rafraîchir la page.', 'error');
    } else {
      createError.value = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de la création de l\'offre';
    }
  } finally {
    isCreatingOffer.value = false;
    // Nettoyer le header CSRF après la requête
    delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
  }
};

const submitReview = async (offerId) => {
  if (!newReview.value.comment.trim() || !newReview.value.rating || newReview.value.rating < 1 || newReview.value.rating > 5) {
    showNotification('Veuillez remplir le commentaire et sélectionner une note entre 1 et 5 étoiles.', 'warning');
    return;
  }
  
  isSubmittingReview.value = true;
  try {
    await apiClient.post(`/api/marketplace/offers/${offerId}/reviews`, {
      comment: newReview.value.comment,
      rating: newReview.value.rating
    });
    
    // Recharger les détails de l'offre pour afficher le nouvel avis
    await viewOfferDetails(offerId);
    
    // Réinitialiser le formulaire
    newReview.value = { comment: '', rating: 0 };
    showNotification('Votre avis a été publié avec succès !', 'success');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'avis:', error);
    showNotification(error.response?.data?.message || 'Erreur lors de la publication de l\'avis. Veuillez réessayer.', 'error');
  } finally {
    isSubmittingReview.value = false;
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const formatRating = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0.0';
  return n.toFixed(1);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getEmptyMessage = () => {
  if (activeTab.value === 'purchases') return 'Vous n\'avez effectué aucun achat pour le moment.';
  if (activeTab.value === 'sales') return 'Vous n\'avez créé aucune offre pour le moment.';
  if (activeTab.value === 'favorites') return 'Vous n\'avez ajouté aucun favori pour le moment.';
  if (activeTab.value === 'messages') return 'Vous n\'avez aucun message pour le moment.';
  return 'Aucune offre disponible pour le moment.';
};

const resetCreateOfferForm = () => {
  showCreateOfferModal.value = false;
  showEditOfferModal.value = false;
  editingOffer.value = null;
  newOffer.value = {
    title: '',
    description: '',
    type: '',
    price: 0,
    currency: 'EUR',
    image_url: ''
  };
  selectedImages.value = [];
  createError.value = '';
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

// Navigation
const goToDashboard = () => {
  router.push({ name: 'Dashboard' });
};

const goToAccount = () => {
  router.push({ name: 'Account' });
};

const handleLogout = async () => {
  confirmAction('Êtes-vous sûr de vouloir vous déconnecter ?', async () => {
    await logout();
    router.push({ name: 'Home' });
  });
};

// Fonctions de gestion des offres
const editOffer = async (offerId) => {
  // Afficher immédiatement le modal avec les données déjà disponibles
  const existingOffer = offers.value.find(o => o.id === offerId) || selectedOffer.value;
  if (existingOffer) {
    editingOffer.value = { ...existingOffer };
    newOffer.value = {
      title: existingOffer.title,
      description: existingOffer.description,
      type: existingOffer.type,
      price: existingOffer.price,
      currency: existingOffer.currency || 'EUR',
      image_url: existingOffer.image_url
    };
    selectedImages.value = [];
    showEditOfferModal.value = true;
    showCreateOfferModal.value = false;
    if (selectedOffer.value) {
      selectedOffer.value = null;
    }
  }
  
  // Charger les données complètes en arrière-plan
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}`);
    editingOffer.value = response.data;
    newOffer.value = {
      title: editingOffer.value.title,
      description: editingOffer.value.description,
      type: editingOffer.value.type,
      price: editingOffer.value.price,
      currency: editingOffer.value.currency || 'EUR',
      image_url: editingOffer.value.image_url
    };
    // ✅ Charger les images existantes (images multiples + image principale)
    selectedImages.value = [];
    
    // Ajouter l'image principale si elle existe
    if (editingOffer.value.image_url) {
      selectedImages.value.push({
        file: null,
        preview: editingOffer.value.image_url,
        name: 'image',
        originalFile: null,
        isExisting: true,
        existingUrl: editingOffer.value.image_url
      });
    }
    
    // Ajouter les autres images si disponibles
    if (editingOffer.value.images && editingOffer.value.images.length > 0) {
      editingOffer.value.images.forEach(img => {
        const imageUrl = img.url || img.image_url || img;
        // Éviter les doublons avec l'image principale
        if (imageUrl !== editingOffer.value.image_url) {
          selectedImages.value.push({
            file: null,
            preview: imageUrl,
            name: 'image',
            originalFile: null,
            isExisting: true,
            existingUrl: imageUrl
          });
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error);
    // Si l'erreur survient et qu'on n'avait pas de données existantes, fermer le modal
    if (!existingOffer) {
      showEditOfferModal.value = false;
      editingOffer.value = null;
      showNotification('Erreur lors du chargement de l\'offre', 'error');
    } else {
      // Si on avait des données existantes, juste afficher une notification
      showNotification('Erreur lors du chargement des détails complets de l\'offre', 'error');
    }
  }
};

const updateOffer = async () => {
  isCreatingOffer.value = true;
  createError.value = '';
  
  try {
    // ✅ CRITIQUE: Récupérer le cookie CSRF avant la requête
    try {
      await apiClient.get('/sanctum/csrf-cookie');
    } catch (csrfError) {
      console.warn('Erreur lors de la récupération du cookie CSRF:', csrfError);
    }
    
    // ✅ CRITIQUE: Mettre à jour le header CSRF
    const setCsrfHeader = () => {
      const xsrfToken = Cookies.get('XSRF-TOKEN');
      if (xsrfToken) {
        apiClient.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
      } else {
        console.warn('Cookie XSRF-TOKEN non trouvé.');
        delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
      }
    };
    setCsrfHeader();
    
    const formData = new FormData();
    formData.append('title', newOffer.value.title);
    formData.append('description', newOffer.value.description);
    formData.append('type', newOffer.value.type);
    formData.append('price', newOffer.value.price);
    formData.append('currency', newOffer.value.currency);
    
      // ✅ CORRECTION : Envoyer uniquement les nouvelles images avec validation
      if (selectedImages.value.length > 0) {
        let newImageIndex = 0;
        selectedImages.value.forEach((image) => {
          // Envoyer uniquement les images qui ont un fichier (nouvelles images ou images remplacées)
          let imageToSend = image.originalFile || image.file || image.croppedFile;
          
          if (imageToSend) {
            // Si c'est un Blob, le convertir en File
            if (imageToSend instanceof Blob && !(imageToSend instanceof File)) {
              imageToSend = new File([imageToSend], image.name || `image-${newImageIndex}.jpg`, {
                type: imageToSend.type || 'image/jpeg',
                lastModified: Date.now()
              });
            }
            
            // Vérifier que c'est bien un File
            if (imageToSend instanceof File) {
              formData.append('images[]', imageToSend);
              newImageIndex++;
            }
          }
          // Les images existantes (isExisting: true sans file) ne sont pas envoyées
        // Elles restent sur le serveur
      });
    }
    
    const response = await apiClient.put(`/api/marketplace/offers/${editingOffer.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Mettre à jour l'offre dans la liste
    const index = offers.value.findIndex(o => o.id === editingOffer.value.id);
    if (index !== -1) {
      offers.value[index] = response.data;
    }
    
    resetCreateOfferForm();
    showEditOfferModal.value = false;
    editingOffer.value = null;
    showNotification('Offre mise à jour avec succès !', 'success');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre:', error);
    if (error.response?.status === 419) {
      createError.value = 'Session expirée. Veuillez rafraîchir la page et réessayer.';
      showNotification('Session expirée. Veuillez rafraîchir la page.', 'error');
    } else {
      createError.value = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'offre';
    }
  } finally {
    isCreatingOffer.value = false;
    // Nettoyer le header CSRF après la requête
    delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
  }
};

const deleteOffer = async (offerId) => {
  confirmAction('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.', async () => {
    isDeletingOffer.value = true;
    try {
      await apiClient.delete(`/api/marketplace/offers/${offerId}`);
      
      // Retirer l'offre de la liste
      offers.value = offers.value.filter(o => o.id !== offerId);
      
      if (selectedOffer.value && selectedOffer.value.id === offerId) {
        selectedOffer.value = null;
      }
      
      showNotification('Offre supprimée avec succès !', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showNotification(error.response?.data?.message || 'Erreur lors de la suppression de l\'offre', 'error');
    } finally {
      isDeletingOffer.value = false;
    }
  });
};

const viewOfferStats = async (offerId) => {
  // Afficher immédiatement le modal avec des valeurs par défaut (0)
  offerStats.value = {
    total_views: 0,
    total_favorites: 0,
    total_reviews: 0,
    average_rating: 0,
    total_purchases: 0,
    total_messages: 0,
    revenue: 0,
  };
  showStatsModal.value = true;
  
  // Charger les statistiques réelles en arrière-plan
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}/stats`);
    const raw = response.data || {};
    // Normaliser les types (MySQL renvoie souvent des strings pour avg/sum)
    offerStats.value = {
      total_views: Number(raw.total_views || 0),
      total_favorites: Number(raw.total_favorites || 0),
      total_reviews: Number(raw.total_reviews || 0),
      average_rating: Number(raw.average_rating || 0),
      total_purchases: Number(raw.total_purchases || 0),
      total_messages: Number(raw.total_messages || 0),
      revenue: Number(raw.revenue || 0),
    };
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement des statistiques', 'error');
    // Fermer le modal si l'erreur survient
    showStatsModal.value = false;
    offerStats.value = null;
  }
};

const viewAllReviews = async (offerId) => {
  // Afficher immédiatement le modal avec les données déjà disponibles
  const existingOffer = offers.value.find(o => o.id === offerId) || selectedOffer.value;
  if (existingOffer) {
    // Si l'offre n'est pas déjà dans selectedOffer, l'ajouter temporairement
    if (!selectedOffer.value || selectedOffer.value.id !== offerId) {
      selectedOffer.value = { ...existingOffer };
      // Si l'offre a déjà des avis, les utiliser
      if (existingOffer.reviews && existingOffer.reviews.length > 0) {
        selectedOffer.value.reviews = existingOffer.reviews;
      }
    }
  }
  
  // Afficher le modal immédiatement
  showAllReviewsModal.value = true;
  
  // Charger les détails complets en arrière-plan pour avoir tous les avis
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}`);
    if (response.data && response.data.reviews && selectedOffer.value) {
      selectedOffer.value.reviews = response.data.reviews;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des avis:', error);
    // Ne pas fermer le modal, juste afficher une notification
    showNotification(error.response?.data?.message || 'Erreur lors du chargement des avis', 'error');
  }
};

// ✅ NOUVEAU : Ouvrir la conversation depuis l'onglet Messages
const openConversation = async (offerId) => {
  await viewAllMessages(offerId);
};

const viewAllMessages = async (offerId) => {
  // Afficher immédiatement le modal avec une liste vide
  offerMessages.value = [];
  newMessageText.value = '';
  showAllMessagesModal.value = true;
  
  // S'assurer que selectedOffer est défini
  const existingOffer = offers.value.find(o => o.id === offerId) || selectedOffer.value;
  if (existingOffer && (!selectedOffer.value || selectedOffer.value.id !== offerId)) {
    selectedOffer.value = { ...existingOffer };
  }
  
  // Charger les détails de l'offre
  try {
    const offerResponse = await apiClient.get(`/api/marketplace/offers/${offerId}`);
    conversationOffer.value = offerResponse.data;
    
    // Déterminer l'autre utilisateur
    if (offerResponse.data && user.value) {
      const offer = offerResponse.data;
      if (offer.user_id === user.value.id) {
        // Si on est le vendeur, l'autre utilisateur sera déterminé depuis les messages
        conversationOtherUser.value = null;
      } else {
        // Si on est l'acheteur, l'autre utilisateur est le vendeur
        conversationOtherUser.value = {
          id: offer.user_id,
          name: offer.seller_name || 'Vendeur'
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error);
  }
  
  // Charger les messages en arrière-plan
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}/messages`);
    offerMessages.value = response.data || [];
    
    // Déterminer l'autre utilisateur depuis les messages si pas encore défini
    if (!conversationOtherUser.value && offerMessages.value.length > 0 && user.value) {
      const firstMessage = offerMessages.value[0];
      if (firstMessage.sender_id === user.value.id) {
        conversationOtherUser.value = {
          id: firstMessage.receiver_id,
          name: firstMessage.receiver_name
        };
      } else {
        conversationOtherUser.value = {
          id: firstMessage.sender_id,
          name: firstMessage.sender_name
        };
      }
    }
    
    // ✅ NOUVEAU : Scroller vers le bas pour voir les derniers messages
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    // ✅ NOUVEAU : Recharger le nombre de messages non lus après ouverture
    await loadUnreadMessagesCount();
    
    // ✅ NOUVEAU : Recharger les conversations si on est sur l'onglet messages
    if (activeTab.value === 'messages') {
      await loadOffers();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement des messages', 'error');
    // Ne pas fermer le modal, juste afficher une notification
  }
};

// ✅ NOUVEAU : Fermer la modal de conversation
const closeConversationModal = () => {
  showAllMessagesModal.value = false;
  offerMessages.value = [];
  newMessageText.value = '';
  conversationOffer.value = null;
  conversationOtherUser.value = null;
  replyingToMessage.value = null;
  replyMessage.value = '';
};

// ✅ NOUVEAU : Scroller vers le bas de la zone de messages
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }, 50);
  }
};

// ✅ NOUVEAU : Envoyer un nouveau message depuis la modal de conversation
const sendNewMessage = async () => {
  if (!newMessageText.value.trim() || !conversationOffer.value) return;
  
  isSendingMessage.value = true;
  try {
    // Si c'est le premier message, utiliser sendMessage, sinon replyToMessage
    if (offerMessages.value.length === 0) {
      // Premier message
      await apiClient.post('/api/marketplace/send-message', {
        offer_id: conversationOffer.value.id,
        seller_id: conversationOffer.value.seller_id || conversationOffer.value.user_id,
        message: newMessageText.value
      });
    } else {
      // Répondre au dernier message
      const lastMessage = offerMessages.value[offerMessages.value.length - 1];
      await apiClient.post(`/api/marketplace/messages/${lastMessage.id}/reply`, {
        message: newMessageText.value
      });
    }
    
    // Recharger les messages pour avoir l'historique complet
    await viewAllMessages(conversationOffer.value.id);
    
    // Vider le champ de saisie
    newMessageText.value = '';
    
    // ✅ NOUVEAU : Scroller vers le bas après l'envoi
    setTimeout(() => {
      scrollToBottom();
    }, 200);
    
    showNotification('Message envoyé avec succès !', 'success');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    showNotification(error.response?.data?.message || 'Erreur lors de l\'envoi du message', 'error');
  } finally {
    isSendingMessage.value = false;
  }
};

// ✅ NOUVEAU : Formater l'heure du message (aujourd'hui, hier, ou date complète)
const formatMessageTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;
  
  if (messageDate.getTime() === today.getTime()) {
    return `Aujourd'hui à ${time}`;
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return `Hier à ${time}`;
  } else {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} à ${time}`;
  }
};

const replyToMessage = (message) => {
  replyingToMessage.value = message;
  replyMessage.value = '';
};

const cancelReply = () => {
  replyingToMessage.value = null;
  replyMessage.value = '';
};

const sendReply = async () => {
  if (!replyMessage.value.trim() || !replyingToMessage.value) return;
  
  isSendingReply.value = true;
  try {
    const response = await apiClient.post(`/api/marketplace/messages/${replyingToMessage.value.id}/reply`, {
      message: replyMessage.value
    });
    
    // Ajouter la réponse à la liste des messages
    offerMessages.value.push(response.data.data);
    
    showNotification('Réponse envoyée avec succès !', 'success');
    replyingToMessage.value = null;
    replyMessage.value = '';
    
    // Recharger les messages pour mettre à jour
    if (selectedOffer.value) {
      await viewAllMessages(selectedOffer.value.id);
    }
    
    // Recharger le nombre de messages non lus
    await loadUnreadMessagesCount();
    
    // Recharger les conversations si on est sur l'onglet messages
    if (activeTab.value === 'messages') {
      await loadOffers();
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    showNotification(error.response?.data?.message || 'Erreur lors de l\'envoi de la réponse', 'error');
  } finally {
    isSendingReply.value = false;
  }
};

// Fonctions pour la galerie d'images
const openImageGallery = (startIndex = 0) => {
  if (!selectedOffer.value) return;
  
  // Construire la liste des images
  galleryImages.value = [];
  const imageUrls = new Set(); // Pour éviter les doublons
  
  // Ajouter toutes les images disponibles
  if (selectedOffer.value.images && selectedOffer.value.images.length > 0) {
    // Si on a des images dans le tableau images, les utiliser
    selectedOffer.value.images.forEach(img => {
      const url = img.url || img.image_url || img;
      if (url && !imageUrls.has(url)) {
        galleryImages.value.push(url);
        imageUrls.add(url);
      }
    });
  }
  
  // Ajouter l'image principale si elle n'est pas déjà dans la liste
  if (selectedOffer.value.image_url && !imageUrls.has(selectedOffer.value.image_url)) {
    galleryImages.value.unshift(selectedOffer.value.image_url); // Mettre en premier
    imageUrls.add(selectedOffer.value.image_url);
  }
  
  // Si on n'a aucune image, utiliser l'image principale si elle existe
  if (galleryImages.value.length === 0 && selectedOffer.value.image_url) {
    galleryImages.value.push(selectedOffer.value.image_url);
  }
  
  if (galleryImages.value.length > 0) {
    currentImageIndex.value = Math.min(startIndex, galleryImages.value.length - 1);
    showImageGallery.value = true;
  }
};

const closeImageGallery = () => {
  showImageGallery.value = false;
  galleryImages.value = [];
  currentImageIndex.value = 0;
};

const nextImage = () => {
  if (currentImageIndex.value < galleryImages.value.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0; // Retour au début
  }
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = galleryImages.value.length - 1; // Aller à la fin
  }
};

// Gestion du swipe tactile pour mobile
const handleTouchStart = (event) => {
  if (!showImageGallery.value) return;
  if (event.touches && event.touches.length > 0) {
    touchStartX.value = event.touches[0].clientX;
    touchStartY.value = event.touches[0].clientY;
  }
};

const handleTouchEnd = (event) => {
  if (!showImageGallery.value) return;
  if (!event.changedTouches || event.changedTouches.length === 0) return;
  
  touchEndX.value = event.changedTouches[0].clientX;
  touchEndY.value = event.changedTouches[0].clientY;
  
  // Calculer la distance et la direction du swipe
  const deltaX = touchStartX.value - touchEndX.value;
  const deltaY = touchStartY.value - touchEndY.value;
  
  // Seuil minimum pour considérer un swipe (50px)
  const minSwipeDistance = 50;
  
  // Vérifier si c'est un swipe horizontal (plus horizontal que vertical)
  // Ratio de 2:1 pour favoriser les swipes horizontaux
  if (Math.abs(deltaX) > Math.abs(deltaY) * 2 && Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // Swipe vers la gauche = image suivante
      nextImage();
    } else {
      // Swipe vers la droite = image précédente
      previousImage();
    }
  }
};

// Navigation au clavier
const handleKeyPress = (event) => {
  if (!showImageGallery.value) return;
  
  if (event.key === 'ArrowLeft') {
    previousImage();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'Escape') {
    closeImageGallery();
  }
};


// Fonction helper pour obtenir toutes les images d'une offre (sans doublons)
const getAllOfferImages = (offer) => {
  if (!offer) return [];
  
  const imageUrls = [];
  const seenUrls = new Set();
  
  // Ajouter l'image principale en premier si elle existe
  if (offer.image_url && !seenUrls.has(offer.image_url)) {
    imageUrls.push(offer.image_url);
    seenUrls.add(offer.image_url);
  }
  
  // Ajouter les autres images
  if (offer.images && offer.images.length > 0) {
    offer.images.forEach(img => {
      const url = img.url || img.image_url || img;
      if (url && !seenUrls.has(url)) {
        imageUrls.push(url);
        seenUrls.add(url);
      }
    });
  }
  
  return imageUrls;
};

// Fonction helper pour compter le total d'images
const getTotalImageCount = (offer) => {
  return getAllOfferImages(offer).length;
};

// Navigation dans la modal de détails
const nextDetailImage = () => {
  if (!selectedOffer.value) return;
  const images = getAllOfferImages(selectedOffer.value);
  if (images.length > 0) {
    detailModalImageIndex.value = (detailModalImageIndex.value + 1) % images.length;
  }
};

const previousDetailImage = () => {
  if (!selectedOffer.value) return;
  const images = getAllOfferImages(selectedOffer.value);
  if (images.length > 0) {
    detailModalImageIndex.value = detailModalImageIndex.value === 0 
      ? images.length - 1 
      : detailModalImageIndex.value - 1;
  }
};

// Watcher pour recharger les offres quand l'onglet change
watch(activeTab, () => {
  // Réinitialiser la recherche lors du changement d'onglet
  searchQuery.value = '';
  loadOffers();
});

// Nettoyer le timeout lors du démontage
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});

// ✅ NOUVEAU : Charger les notifications de matching
const loadMatchNotifications = async () => {
  try {
    const response = await apiClient.get('/api/marketplace/match-notifications');
    matchNotifications.value = response.data.notifications || [];
    matchNotificationsUnreadCount.value = response.data.unread_count || 0;
  } catch (error) {
    console.error('Erreur lors du chargement des notifications de matching:', error);
  }
};

// ✅ FIX: Charger le nombre de messages non lus
const loadUnreadMessagesCount = async () => {
  try {
    const response = await apiClient.get('/api/marketplace/messages/unread-count');
    totalUnreadMessages.value = response.data?.unread_count || 0;
  } catch (error) {
    console.error('Erreur lors du chargement du nombre de messages non lus:', error);
  }
};

// ✅ FIX: Polling messages (conversations + badge)
const startMessagesPolling = () => {
  if (messagesPollingInterval.value) {
    clearInterval(messagesPollingInterval.value);
  }
  messagesPollingInterval.value = setInterval(async () => {
    await loadUnreadMessagesCount();
    if (activeTab.value === 'messages') {
      await loadOffers();
    }
    // si la modal conversation est ouverte, recharger l'historique
    if (showAllMessagesModal.value && conversationOffer.value?.id) {
      await viewAllMessages(conversationOffer.value.id);
    }
  }, 30000);
};

const stopMessagesPolling = () => {
  if (messagesPollingInterval.value) {
    clearInterval(messagesPollingInterval.value);
    messagesPollingInterval.value = null;
  }
};

const startMatchNotificationsPolling = () => {
  if (matchNotificationsPollingInterval.value) {
    clearInterval(matchNotificationsPollingInterval.value);
  }
  matchNotificationsPollingInterval.value = setInterval(() => {
    loadMatchNotifications();
  }, 30000);
};

const stopMatchNotificationsPolling = () => {
  if (matchNotificationsPollingInterval.value) {
    clearInterval(matchNotificationsPollingInterval.value);
    matchNotificationsPollingInterval.value = null;
  }
};

// ✅ NOUVEAU : Ouvrir une offre depuis une notification
const openOfferFromNotification = async (notification) => {
  if (notification.offer_id) {
    // Marquer la notification comme lue
    try {
      await apiClient.post(`/api/marketplace/notifications/${notification.id}/read`);
      // Recharger les notifications
      await loadMatchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
    
    // Ouvrir l'offre
    await viewOfferDetails(notification.offer_id);
    showMatchNotificationsModal.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadOffers();
  loadUnreadMessagesCount();
  loadMatchNotifications();
  startMessagesPolling();
  // Ajouter les écouteurs de clavier pour la galerie
  window.addEventListener('keydown', handleKeyPress);
  startMatchNotificationsPolling();
});

// Nettoyer les écouteurs
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  stopMessagesPolling();
  stopMatchNotificationsPolling();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Zone de crop vue-advanced-cropper (avatars/logos 1:1) */
.marketplace-cropper {
  height: 400px;
  width: 100%;
  background: #0f172a;
}

/* Animations pour les notifications toast */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
