<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
    <!-- Header -->
    <div class="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            🛍️ Marketplace
          </h1>
          <button
            @click="showCreateOfferModal = true"
            class="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            + Créer une offre
          </button>
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
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="container mx-auto px-4 py-8 flex-1">
      <!-- Chargement -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
      </div>

      <!-- Grille d'offres -->
      <div v-else-if="filteredOffers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="offer in filteredOffers"
          :key="offer.id"
          class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-sky-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <!-- Image de l'offre -->
          <div class="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800">
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
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 bg-sky-500/80 backdrop-blur-sm text-white text-xs font-semibold rounded">
                {{ offer.type === 'service' ? 'Service' : offer.type === 'product' ? 'Produit' : 'Offre' }}
              </span>
            </div>
            <!-- Bouton favoris -->
            <button
              @click="toggleFavorite(offer.id)"
              class="absolute top-2 left-2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
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
                  @click="viewOfferDetails(offer.id)"
                  class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                >
                  Voir détails
                </button>
                <button
                  v-if="!offer.is_seller"
                  @click="addToCart(offer.id)"
                  class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-2 px-2 sm:px-4 rounded-lg transition-all text-xs sm:text-sm font-medium shadow-lg"
                >
                  Acheter
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
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
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
        <div class="p-6">
          <!-- Image (cliquable pour ouvrir la galerie) -->
          <div class="mb-6">
            <div v-if="selectedOffer.image_url || (selectedOffer.images && selectedOffer.images.length > 0)" class="relative">
              <img
                :src="selectedOffer.image_url || (selectedOffer.images && selectedOffer.images.length > 0 ? selectedOffer.images[0].url : '')"
                :alt="selectedOffer.title"
                @click="openImageGallery(0)"
                class="w-full max-w-md mx-auto h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
              <div v-if="getTotalImageCount(selectedOffer) > 1" class="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {{ getTotalImageCount(selectedOffer) }} images
              </div>
            </div>
            <div v-else class="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
              <span class="text-8xl text-slate-500">{{ selectedOffer.type === 'service' ? '🔧' : selectedOffer.type === 'product' ? '📦' : '🎯' }}</span>
            </div>
          </div>

          <!-- Description dans un cadre -->
          <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold text-slate-300 mb-3">Description</h3>
            <p class="text-slate-300 leading-relaxed">{{ selectedOffer.description }}</p>
          </div>

          <!-- Informations dans un autre cadre -->
          <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
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
          <div v-if="selectedOffer.is_seller" class="mb-6 space-y-4">
            <!-- Dernier avis -->
            <div v-if="selectedOffer.latest_review" class="bg-slate-700/50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-slate-300">Dernier avis</h3>
                <button
                  @click="viewAllReviews(selectedOffer.id)"
                  class="text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Voir tous les avis →
                </button>
              </div>
              <div class="bg-slate-800/50 rounded-lg p-3">
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
            <div v-else class="bg-slate-700/50 rounded-lg p-4">
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
            <div v-if="selectedOffer.latest_message" class="bg-slate-700/50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-slate-300">Dernier message</h3>
                <button
                  @click="viewAllMessages(selectedOffer.id)"
                  class="text-sky-400 hover:text-sky-300 text-sm font-medium"
                >
                  Voir tous les messages →
                </button>
              </div>
              <div class="bg-slate-800/50 rounded-lg p-3">
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
            <div v-else class="bg-slate-700/50 rounded-lg p-4">
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
          <div v-if="!selectedOffer.is_seller" class="mb-6">
            <h3 class="text-lg font-semibold text-slate-300 mb-4">Avis ({{ selectedOffer.reviews?.length || 0 }})</h3>
            
            <!-- Formulaire d'avis (masqué pour le vendeur) -->
            <div class="bg-slate-700/50 rounded-lg p-4 mb-4">
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
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
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
              <div v-if="selectedImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                <div
                  v-for="(img, index) in selectedImages"
                  :key="index"
                  class="relative group"
                >
                  <img :src="img.preview" alt="Aperçu" class="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
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
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showContactSellerModal = false"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-6 border-b border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-2">Mode de paiement en cours de développement</h2>
          <p class="text-slate-400 text-sm">
            Le système de paiement n'est pas encore disponible. Contactez directement l'annonceur pour finaliser votre achat.
          </p>
        </div>

        <div class="p-6 space-y-4">
          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-yellow-400 font-semibold mb-1">Information importante</p>
                <p class="text-yellow-300 text-sm">
                  Vous pouvez contacter directement <strong>{{ contactSellerOffer.seller_name }}</strong> ou lui laisser un message ci-dessous.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Votre message à l'annonceur</label>
            <textarea
              v-model="contactMessage"
              rows="4"
              placeholder="Bonjour, je suis intéressé(e) par votre offre..."
              class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showContactSellerModal = false; contactMessage = ''; contactSellerOffer = null"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              @click="sendMessageToSeller"
              :disabled="!contactMessage.trim() || isSendingMessage"
              class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-all font-semibold"
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
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
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
          <div>
            <label class="block text-slate-300 font-medium mb-2">Ajouter des images (optionnel)</label>
            <div class="space-y-3">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleMultipleImageSelect"
                class="hidden"
                id="edit-offer-images-input"
              />
              <label
                for="edit-offer-images-input"
                class="flex-1 cursor-pointer bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg px-4 py-8 text-center hover:border-sky-500 transition-colors"
              >
                <div v-if="selectedImages.length === 0" class="space-y-2">
                  <svg class="w-12 h-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-slate-400 text-sm">Cliquez pour ajouter des images</p>
                </div>
                <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div v-for="(image, index) in selectedImages" :key="index" class="relative">
                    <img :src="image.preview" :alt="image.file.name" class="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      @click.stop="removeImage(index)"
                      class="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1 text-white text-xs"
                    >
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </label>
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
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
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
        <div class="flex-1 flex items-center justify-center h-full">
          <img
            :src="galleryImages[currentImageIndex].url || galleryImages[currentImageIndex]"
            :alt="`Image ${currentImageIndex + 1} de ${galleryImages.length}`"
            class="max-w-full max-h-full object-contain rounded-lg"
            @click="closeImageGallery"
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

    <!-- Modal de tous les messages -->
    <div
      v-if="showAllMessagesModal && selectedOffer"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      @click.self="showAllMessagesModal = false"
    >
      <div class="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Tous les messages</h2>
          <button
            @click="showAllMessagesModal = false"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div v-if="offerMessages.length > 0" class="space-y-4">
            <div
              v-for="message in offerMessages"
              :key="message.id"
              :class="[
                'rounded-lg p-4',
                message.sender_id === user?.id ? 'bg-sky-600/30 ml-auto max-w-[80%]' : 'bg-slate-700/50 mr-auto max-w-[80%]'
              ]"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <div class="font-semibold text-white">{{ message.sender_name }}</div>
                  <div class="text-xs text-slate-400 mt-1">À {{ message.receiver_name }}</div>
                </div>
                <span class="text-xs text-slate-500">{{ formatDate(message.created_at) }}</span>
              </div>
              <p class="text-slate-300 text-sm">{{ message.message }}</p>
              
              <!-- Bouton pour répondre (si on n'est pas l'expéditeur) -->
              <button
                v-if="message.sender_id !== user?.id"
                @click="replyToMessage(message)"
                class="mt-3 text-sky-400 hover:text-sky-300 text-sm font-medium"
              >
                Répondre →
              </button>
            </div>
          </div>
          <div v-else class="text-center py-12 text-slate-500">
            Aucun message pour le moment
          </div>

          <!-- Formulaire de réponse -->
          <div v-if="replyingToMessage" class="mt-6 bg-slate-700/50 rounded-lg p-4">
            <div class="mb-3">
              <label class="block text-slate-300 font-medium mb-2">Répondre à {{ replyingToMessage.sender_name }}</label>
              <textarea
                v-model="replyMessage"
                rows="3"
                placeholder="Votre réponse..."
                class="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              ></textarea>
            </div>
            <div class="flex gap-3">
              <button
                @click="cancelReply"
                class="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                @click="sendReply"
                :disabled="!replyMessage.trim() || isSendingReply"
                class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-all font-semibold"
              >
                {{ isSendingReply ? 'Envoi...' : 'Envoyer la réponse' }}
              </button>
            </div>
          </div>
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
    <footer class="bg-slate-800/50 border-t border-slate-700 mt-auto">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col items-center gap-3">
          <!-- Bouton Dashboard -->
          <button
            @click="goToDashboard"
            class="w-full max-w-xs bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>

          <!-- Bouton Mon Compte -->
          <button
            @click="goToAccount"
            class="w-full max-w-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg transition-all font-medium flex items-center justify-center gap-3 shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mon Compte
          </button>

          <!-- Bouton Se déconnecter -->
          <button
            @click="handleLogout"
            class="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import apiClient from '@/api';

const router = useRouter();
const { logout, user } = useAuth();

// États
const isLoading = ref(false);
const activeTab = ref('all');
const offers = ref([]);
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

// Computed - Les offres sont déjà filtrées côté backend
const filteredOffers = computed(() => {
  return offers.value;
});

// Méthodes
const loadOffers = async () => {
  isLoading.value = true;
  try {
    // Si on est sur l'onglet "Mes Messages", charger les messages
    if (activeTab.value === 'messages') {
      const response = await apiClient.get('/api/marketplace/messages');
      // Transformer les messages en format "offre" pour l'affichage
      offers.value = response.data.map(msg => ({
        id: msg.offer_id,
        title: msg.offer_title,
        description: `Message de ${msg.is_from_me ? msg.receiver_name : msg.sender_name}`,
        type: 'message',
        price: 0,
        currency: '',
        image_url: null,
        seller_name: msg.is_from_me ? msg.receiver_name : msg.sender_name,
        is_message: true,
        message_data: msg,
        created_at: msg.created_at,
      }));
    } else {
      // Envoyer le filtre actif au backend
      const filter = activeTab.value === 'all' ? 'all' : activeTab.value;
      const response = await apiClient.get('/api/marketplace/offers', {
        params: { filter }
      });
      offers.value = response.data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des offres:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement', 'error');
  } finally {
    isLoading.value = false;
  }
};

const viewOfferDetails = async (offerId) => {
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}`);
    selectedOffer.value = response.data;
    
    // Vérifier si l'utilisateur actuel est le vendeur
    if (user.value && selectedOffer.value) {
      selectedOffer.value.is_seller = selectedOffer.value.seller_id === user.value.id || selectedOffer.value.user_id === user.value.id;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des détails:', error);
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

// Galerie d'images
const showImageGallery = ref(false);
const galleryImages = ref([]);
const currentImageIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

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
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    showNotification(error.response?.data?.message || 'Erreur lors de l\'envoi du message', 'error');
  } finally {
    isSendingMessage.value = false;
  }
};

const handleImageSelect = (event) => {
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
      showNotification(`L'image ${file.name} est trop grande (max 5MB)`, 'warning');
    }
  });
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
    const formData = new FormData();
    formData.append('title', newOffer.value.title);
    formData.append('description', newOffer.value.description);
    formData.append('type', newOffer.value.type);
    formData.append('price', newOffer.value.price);
    formData.append('currency', newOffer.value.currency || 'EUR');
    
    // Ajouter toutes les images
    selectedImages.value.forEach((img, index) => {
      formData.append(`images[${index}]`, img.file);
    });
    
    const response = await apiClient.post('/api/marketplace/offers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    offers.value.unshift(response.data);
    resetCreateOfferForm();
    await loadOffers(); // Recharger les offres pour mettre à jour la liste
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre:', error);
    createError.value = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de la création de l\'offre';
  } finally {
    isCreatingOffer.value = false;
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
    selectedImages.value = [];
    showEditOfferModal.value = true;
    showCreateOfferModal.value = false;
    if (selectedOffer.value) {
      selectedOffer.value = null;
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error);
    showNotification('Erreur lors du chargement de l\'offre', 'error');
  }
};

const updateOffer = async () => {
  isCreatingOffer.value = true;
  createError.value = '';
  
  try {
    const formData = new FormData();
    formData.append('title', newOffer.value.title);
    formData.append('description', newOffer.value.description);
    formData.append('type', newOffer.value.type);
    formData.append('price', newOffer.value.price);
    formData.append('currency', newOffer.value.currency);
    
    if (selectedImages.value.length > 0) {
      selectedImages.value.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
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
    createError.value = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'offre';
  } finally {
    isCreatingOffer.value = false;
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
    showStatsModal.value = true;
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement des statistiques', 'error');
  }
};

const viewAllReviews = async (offerId) => {
  try {
    // Recharger les détails de l'offre pour avoir tous les avis
    await viewOfferDetails(offerId);
    showAllReviewsModal.value = true;
  } catch (error) {
    console.error('Erreur lors du chargement des avis:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement des avis', 'error');
  }
};

const viewAllMessages = async (offerId) => {
  try {
    const response = await apiClient.get(`/api/marketplace/offers/${offerId}/messages`);
    offerMessages.value = response.data;
    showAllMessagesModal.value = true;
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    showNotification(error.response?.data?.message || 'Erreur lors du chargement des messages', 'error');
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

// Support du swipe (touch)
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50; // Minimum distance pour déclencher le swipe
  const diff = touchStartX.value - touchEndX.value;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe vers la gauche = image suivante
      nextImage();
    } else {
      // Swipe vers la droite = image précédente
      previousImage();
    }
  }
};

// Fonction helper pour compter le total d'images
const getTotalImageCount = (offer) => {
  if (!offer) return 0;
  let count = 0;
  if (offer.image_url) count++;
  if (offer.images && offer.images.length > 0) {
    count += offer.images.length;
    // Si l'image principale est dans les images, ne pas la compter deux fois
    if (offer.image_url && offer.images.some(img => (img.url || img.image_url || img) === offer.image_url)) {
      count--;
    }
  }
  return count;
};

// Watcher pour recharger les offres quand l'onglet change
watch(activeTab, () => {
  loadOffers();
});

// Lifecycle
onMounted(() => {
  loadOffers();
  // Ajouter les écouteurs de clavier pour la galerie
  window.addEventListener('keydown', handleKeyPress);
});

// Nettoyer les écouteurs
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
