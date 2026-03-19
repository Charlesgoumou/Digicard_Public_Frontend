<template>
  <div
    :class="[
      'min-h-screen bg-slate-900 text-white',
      route?.meta?.hideNavbar ? 'pt-6 sm:pt-8' : 'pt-20 sm:pt-32',
    ]"
  >
    <div :class="['container mx-auto px-4', route?.meta?.hideNavbar ? 'py-6 sm:py-8' : 'py-12']">
      <div class="max-w-6xl mx-auto mb-6 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-2xl sm:text-3xl font-bold">Mes Commandes</h1>
          <p class="text-slate-400 text-sm">Consultez et gérez vos commandes.</p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- Bouton Commander Une Nouvelle Carte (visible pour particuliers et business admin uniquement) -->
          <button
            v-if="user && user.role !== 'employee'"
            @click="openOrderModal"
            class="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/30 flex items-center gap-2 whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Commander Une Nouvelle Carte
          </button>
          <button
            @click="goToDashboard"
            type="button"
            class="bg-slate-800 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>

      <!-- Skeleton Screen pour la liste des commandes -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Skeleton Card 1 -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-2">
              <div class="h-4 w-20 bg-slate-700 rounded"></div>
              <div class="h-6 w-32 bg-slate-700 rounded"></div>
            </div>
            <div class="h-6 w-24 bg-slate-700 rounded-full"></div>
          </div>
          <div class="space-y-3 mb-4">
            <div class="h-4 w-full bg-slate-700 rounded"></div>
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-4 w-1/2 bg-slate-700 rounded"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
          </div>
        </div>
        <!-- Skeleton Card 2 -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-2">
              <div class="h-4 w-20 bg-slate-700 rounded"></div>
              <div class="h-6 w-32 bg-slate-700 rounded"></div>
            </div>
            <div class="h-6 w-24 bg-slate-700 rounded-full"></div>
          </div>
          <div class="space-y-3 mb-4">
            <div class="h-4 w-full bg-slate-700 rounded"></div>
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-4 w-1/2 bg-slate-700 rounded"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
          </div>
        </div>
        <!-- Skeleton Card 3 -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-2">
              <div class="h-4 w-20 bg-slate-700 rounded"></div>
              <div class="h-6 w-32 bg-slate-700 rounded"></div>
            </div>
            <div class="h-6 w-24 bg-slate-700 rounded-full"></div>
          </div>
          <div class="space-y-3 mb-4">
            <div class="h-4 w-full bg-slate-700 rounded"></div>
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-4 w-1/2 bg-slate-700 rounded"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
          </div>
        </div>
        <!-- Skeleton Card 4 -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
          <div class="flex justify-between items-start mb-4">
            <div class="space-y-2">
              <div class="h-4 w-20 bg-slate-700 rounded"></div>
              <div class="h-6 w-32 bg-slate-700 rounded"></div>
            </div>
            <div class="h-6 w-24 bg-slate-700 rounded-full"></div>
          </div>
          <div class="space-y-3 mb-4">
            <div class="h-4 w-full bg-slate-700 rounded"></div>
            <div class="h-4 w-3/4 bg-slate-700 rounded"></div>
            <div class="h-4 w-1/2 bg-slate-700 rounded"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
            <div class="h-10 flex-1 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="loadingError" class="text-center text-red-400 py-10">
        <p>{{ loadingError }}</p>
      </div>

      <!-- Aucune commande -->
      <div v-else-if="orders.length === 0" class="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
        <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 class="text-xl font-semibold text-slate-300 mb-2">Aucune commande pour le moment</h2>
        <p class="text-slate-400 mb-6">Commencez par commander vos cartes de visite digitales.</p>
        <button
          @click="openOrderModal"
          class="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/30"
        >
          Commander Une Nouvelle Carte
        </button>
      </div>

      <!-- Liste des commandes -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="order in orders"
          :key="`${order.id}-${pricingVersion}`"
          class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-sky-500 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20"
        >
          <!-- En-tête de la commande -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-sm text-slate-400">Commande</p>
              <p class="text-lg font-bold text-white">#{{ order.order_number }}</p>
            </div>
            <span :class="getStatusClass(order)" class="px-3 py-1 rounded-full text-xs font-semibold">
              {{ getStatusText(order) }}
            </span>
          </div>

          <!-- Détails de la commande -->
          <div class="space-y-3 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">Type</span>
              <span class="text-white font-semibold">{{
                order.order_type === "business" ? "🏢 Entreprise" : "👤 Personnel"
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">Nombre de cartes</span>
              <span class="text-white font-semibold">{{ getCardQuantity(order) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">Prix total</span>
              <span class="text-white font-semibold">{{ formatPrice(getCorrectTotalPrice(order)) }} GNF</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">Design</span>
              <span class="text-white font-semibold">{{ getDesignLabel(order) }}</span>
            </div>
            <div class="border-t border-slate-700 pt-3">
              <p class="text-slate-400 text-xs mb-1">Abonnement Annuel</p>
              <p class="text-white font-semibold">{{ formatPrice(order.annual_subscription) }} GNF/an</p>
              <p class="text-slate-500 text-xs mt-1">à compter du {{ formatDate(order.subscription_start_date) }}</p>
            </div>
          </div>

          <!-- Liste des employés (pour les commandes business) -->
          <div
            v-if="order.order_type === 'business' && order.order_employees && order.order_employees.length > 0"
            class="mb-4"
          >
            <div class="border-t border-slate-700 pt-3">
              <p class="text-slate-400 text-xs mb-2 font-semibold">Employés ({{ order.order_employees.length }})</p>
              <div class="space-y-2 max-h-40 overflow-y-auto">
                <div
                  v-for="emp in order.order_employees"
                  :key="emp.id"
                  class="flex items-center justify-between bg-slate-700/50 rounded px-2 py-1.5 text-xs"
                >
                  <div class="flex-1">
                    <p class="text-white font-medium">{{ emp.employee_name }}</p>
                    <p class="text-slate-400 text-[10px]">{{ emp.card_quantity }} carte(s)</p>
                  </div>
                  <span v-if="emp.is_configured" class="text-green-400 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Vérifié
                  </span>
                  <span v-else class="text-yellow-400 text-[10px]">Non vérifié</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Statut de configuration -->
          <div class="mb-4" v-if="!order.is_configured">
            <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-400 text-sm">
              ⚠️ Cette commande n'est pas encore paramétrée
            </div>
          </div>

          <!-- Date de la commande -->
          <p class="text-slate-500 text-xs mb-4">Commandé le {{ formatDateTime(order.created_at) }}</p>

          <!-- Boutons d'action -->
          <div class="space-y-2">
            <!-- Bouton Paramétrer -->
            <button
              v-if="!order.is_configured && order.status !== 'cancelled'"
              @click="configureOrder(order)"
              class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Paramétrer cette commande
            </button>
            <div v-else class="flex items-center justify-center gap-2 text-green-400 text-sm py-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Commande paramétrée</span>
            </div>

            <!-- Bouton Valider la Commande - Visible tant que la commande n'est pas validée -->
            <button
              v-if="order.status !== 'validated' && order.status !== 'cancelled'"
              @click="openValidateModal(order)"
              :disabled="(isProcessing && validatingOrderId === order.id) || !hasDesignDefined(order)"
              class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isProcessing && validatingOrderId === order.id"
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isProcessing && validatingOrderId === order.id ? "Redirection vers le paiement..." : "Payer et Valider" }}
            </button>
            <!-- Message d'avertissement si le design n'est pas défini -->
            <div
              v-if="order.status !== 'validated' && order.status !== 'cancelled' && !hasDesignDefined(order)"
              class="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs text-center"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Vous devez définir un design avant de valider la commande</span>
              </div>
            </div>

            <!-- Message de confirmation pour les commandes validées -->
            <div v-if="order.status === 'validated' && hasDesignDefined(order)" class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
              <div class="flex items-center justify-center gap-2 text-green-400 text-sm mb-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="font-semibold">Commande validée</span>
              </div>
              <p class="text-xs text-slate-400">Vous avez reçu un email de confirmation</p>
            </div>

            <!-- Bouton Ajouter plus de Cartes - Visible pour les commandes validées des particuliers et business -->
            <button
              v-if="order.status === 'validated' && hasDesignDefined(order) && ((order.order_type === 'personal' || order.order_type === 'individual') || (order.order_type === 'business' || order.order_type === 'entreprise'))"
              @click="openAddCardsModal(order)"
              class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-3"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter plus de Cartes
            </button>

            <!-- ✅ NOUVEAU: Section détaillée des cartes supplémentaires payées -->
            <div
              v-if="order.status === 'validated' && order.paid_additional_payments && order.paid_additional_payments.length > 0"
              class="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg"
            >
              <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cartes Supplémentaires Payées
              </h3>
              
              <div class="space-y-3">
                <div
                  v-for="(payment, index) in order.paid_additional_payments"
                  :key="payment.id || index"
                  class="p-3 bg-slate-900/50 rounded-lg border border-slate-600"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="text-slate-400 text-xs">Paiement #{{ index + 1 }}</p>
                      <p class="text-white font-semibold text-sm">{{ payment.quantity }} carte(s) supplémentaire(s)</p>
                    </div>
                    <span class="text-green-400 text-xs font-semibold">Payé</span>
                  </div>
                  
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                      <span class="text-slate-400">Prix unitaire:</span>
                      <span class="text-white">{{ formatPrice(payment.unit_price || 0) }} GNF</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">Montant total:</span>
                      <span class="text-white font-semibold">{{ formatPrice(payment.total_price || 0) }} GNF</span>
                    </div>
                    <div v-if="payment.paid_at" class="flex justify-between">
                      <span class="text-slate-400">Date de paiement:</span>
                      <span class="text-white">{{ formatDate(payment.paid_at) }}</span>
                    </div>
                  </div>
                  
                  <!-- Détails de la distribution pour les commandes business -->
                  <div
                    v-if="order.order_type === 'business' && payment.distribution"
                    class="mt-2 pt-2 border-t border-slate-700"
                  >
                    <p class="text-slate-400 text-xs mb-1">Répartition:</p>
                    <div class="space-y-1 text-xs">
                      <div
                        v-if="payment.distribution.admin && parseInt(payment.distribution.admin) > 0"
                        class="flex justify-between"
                      >
                        <span class="text-slate-400">Vous:</span>
                        <span class="text-white">{{ payment.distribution.admin }} carte(s)</span>
                      </div>
                      <div
                        v-for="(qty, empId) in payment.distribution.employees"
                        :key="empId"
                        v-if="parseInt(qty) > 0"
                        class="flex justify-between"
                      >
                        <span class="text-slate-400">
                          {{ getEmployeeName(order, empId) || `Employé #${empId}` }}:
                        </span>
                        <span class="text-white">{{ qty }} carte(s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Résumé total -->
              <div class="mt-3 pt-3 border-t border-slate-700">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 text-sm">Total cartes supplémentaires:</span>
                  <span class="text-white font-semibold">{{ order.additional_cards_count || 0 }}</span>
                </div>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-slate-400 text-sm">Montant total payé:</span>
                  <span class="text-white font-semibold">{{ formatPrice(order.additional_cards_total_price || 0) }} GNF</span>
                </div>
              </div>
            </div>

            <!-- Bouton Annuler la Commande - Non visible pour les commandes validées -->
            <button
              v-if="order.status !== 'validated' && order.status !== 'cancelled'"
              @click="openCancelModal(order)"
              class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Annuler la Commande
            </button>
            <div v-if="order.status === 'cancelled'" class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center text-red-400 text-sm">
              Cette commande a été annulée. Aucune action n'est possible.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmation d'Annulation -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeCancelModal"
    >
      <div class="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
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
        <h3 class="text-xl font-bold text-white text-center mb-3">Annuler la Commande</h3>
        <p class="text-slate-300 text-center mb-6">
          Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible et la commande sera
          définitivement supprimée.
        </p>
        <div class="flex gap-3">
          <button
            @click="closeCancelModal"
            :disabled="isProcessing"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Non
          </button>
          <button
            @click="confirmCancel"
            :disabled="isProcessing"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span v-if="!isProcessing">Oui, Annuler</span>
            <span v-else>
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter des cartes supplémentaires -->
    <div
      v-if="showAddCardsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
      @click.self="closeAddCardsModal"
    >
      <div class="bg-slate-800 rounded-xl p-4 sm:p-6 max-w-2xl w-full border border-slate-700 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-sky-500/20 rounded-full">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-white text-center mb-2 sm:mb-3 px-2">Ajouter des Cartes Supplémentaires</h3>
        <p class="text-slate-300 text-center mb-4 sm:mb-6 text-xs sm:text-sm px-2">
          Le même design sera retenu pour les cartes ajoutées. L'abonnement initial s'applique à toutes les cartes.
        </p>

        <!-- Pour les commandes business : distribution des cartes -->
        <div v-if="isBusinessOrder && selectedOrder" class="mb-4 sm:mb-6">
          <div class="mb-3 sm:mb-4">
            <label class="block text-slate-300 text-xs sm:text-sm font-medium mb-2">
              Nombre total de cartes à ajouter
            </label>
            <input
              v-model.number="additionalCardsQuantity"
              type="number"
              min="1"
              max="100"
              @input="updateBusinessDistribution"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              placeholder="Ex: 1, 2, 3..."
            />
          </div>

          <!-- Distribution pour le business admin (s'il est inclus) -->
          <div v-if="businessAdminInOrder" class="mb-3 sm:mb-4 p-3 sm:p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <span class="text-slate-300 text-xs sm:text-sm font-medium break-words">Pour vous ({{ businessAdminName }})</span>
                <span v-if="businessAdminCurrentCards > 0" class="text-slate-400 text-xs whitespace-nowrap">
                  ({{ businessAdminCurrentCards }} carte(s) actuelle(s))
                </span>
              </div>
              <input
                :value="businessDistribution.admin || 0"
                type="number"
                min="0"
                :max="additionalCardsQuantity"
                @input="(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value) || 0;
                  businessDistribution.admin = Math.max(0, Math.min(value, additionalCardsQuantity));
                  updateBusinessDistribution();
                }"
                @blur="(e) => {
                  if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                    businessDistribution.admin = 0;
                    updateBusinessDistribution();
                  }
                }"
                placeholder="0"
                class="w-20 bg-slate-600 border border-slate-500 rounded-lg py-1.5 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>
          </div>

          <!-- Distribution pour les employés -->
          <div v-if="orderEmployees && orderEmployees.length > 0" class="mb-3 sm:mb-4">
            <h4 class="text-slate-300 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Pour vos employés ({{ orderEmployees.length }})</h4>
            <div class="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
              <div
                v-for="employee in orderEmployees"
                :key="employee.id || employee.employee_id"
                class="p-2 sm:p-3 bg-slate-700/30 rounded-lg border border-slate-600"
              >
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
                    <span class="text-slate-300 text-xs sm:text-sm break-words">
                      {{ employee.employee_name || employee.employee?.name || employee.name || `Employé #${employee.employee_id || employee.id}` }}
                    </span>
                    <span v-if="(employee.card_quantity || 0) > 0" class="text-slate-400 text-xs whitespace-nowrap">
                      ({{ employee.card_quantity }} carte(s) actuelle(s))
                    </span>
                  </div>
                  <input
                    :value="businessDistribution.employees[employee.employee_id || employee.id] || 0"
                    type="number"
                    min="0"
                    :max="additionalCardsQuantity"
                    @input="(e) => { 
                      const empId = employee.employee_id || employee.id; 
                      const value = e.target.value === '' ? 0 : Number(e.target.value) || 0;
                      businessDistribution.employees[empId] = Math.max(0, Math.min(value, additionalCardsQuantity)); 
                      updateBusinessDistribution(); 
                    }"
                    @blur="(e) => {
                      const empId = employee.employee_id || employee.id;
                      if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                        businessDistribution.employees[empId] = 0;
                        updateBusinessDistribution();
                      }
                    }"
                    placeholder="0"
                    class="w-20 bg-slate-600 border border-slate-500 rounded-lg py-1.5 px-3 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Message si aucun employé n'est trouvé -->
          <div v-else-if="isBusinessOrder && orderEmployees.length === 0" class="mb-3 sm:mb-4 p-2 sm:p-3 bg-slate-700/30 rounded-lg border border-slate-600 text-slate-400 text-xs sm:text-sm">
            Aucun employé trouvé pour cette commande.
          </div>

          <!-- Avertissement si la distribution ne correspond pas -->
          <div v-if="businessDistributionTotal !== additionalCardsQuantity && additionalCardsQuantity > 0 && businessDistributionTotal > 0" class="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-xs sm:text-sm">
            ⚠️ La distribution ({{ businessDistributionTotal }}) ne correspond pas au total ({{ additionalCardsQuantity }}). Veuillez ajuster la répartition.
          </div>
          
          <!-- Message d'aide pour distribuer les cartes -->
          <div v-if="businessDistributionTotal === 0 && additionalCardsQuantity > 0 && (businessAdminInOrder || (orderEmployees && orderEmployees.length > 0))" class="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-xs sm:text-sm">
            💡 Veuillez répartir les {{ additionalCardsQuantity }} carte(s) entre vous-même{{ businessAdminInOrder ? '' : ' (si inclus)' }} et vos employés ci-dessus.
          </div>
          
          <!-- Message si aucun employé n'est disponible -->
          <div v-if="businessDistributionTotal === 0 && additionalCardsQuantity > 0 && !businessAdminInOrder && (!orderEmployees || orderEmployees.length === 0)" class="mb-3 sm:mb-4 p-2 sm:p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-xs sm:text-sm">
            ⚠️ Aucun employé trouvé pour cette commande. Si vous êtes inclus dans la commande, vous pouvez ajouter toutes les cartes pour vous-même.
          </div>
        </div>

        <!-- Pour les commandes particulières : simple input -->
        <div v-else class="mb-3 sm:mb-4">
          <label class="block text-slate-300 text-xs sm:text-sm font-medium mb-2">
            Nombre de cartes à ajouter
          </label>
          <input
            v-model.number="additionalCardsQuantity"
            type="number"
            min="1"
            max="100"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Ex: 1, 2, 3..."
          />
        </div>

        <div v-if="additionalCardsQuantity > 0 && additionalCardPrice" class="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-700/50 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-slate-300 text-xs sm:text-sm">Prix unitaire</span>
            <span class="text-white font-semibold text-xs sm:text-sm">{{ formatPrice(additionalCardPrice) }} GNF</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-300 text-xs sm:text-sm font-medium">Prix total</span>
            <span class="text-white font-bold text-sm sm:text-lg">{{ formatPrice(Math.round(additionalCardsQuantity * additionalCardPrice)) }} GNF</span>
          </div>
        </div>

        <div v-if="addCardsError" class="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs sm:text-sm text-center">
          {{ addCardsError }}
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="closeAddCardsModal"
            :disabled="isAddingCards"
            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            Annuler
          </button>
          <button
            @click="confirmAddCards"
            :disabled="isAddingCards || !additionalCardsQuantity || additionalCardsQuantity < 1 || !additionalCardPrice || (isBusinessOrder && (businessDistributionTotal === 0 || businessDistributionTotal !== additionalCardsQuantity))"
            class="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            :title="!additionalCardPrice ? 'Chargement du prix en cours...' : (isBusinessOrder && businessDistributionTotal !== additionalCardsQuantity ? 'Veuillez répartir correctement les cartes avant de confirmer' : '')"
          >
            <span v-if="!isAddingCards">Confirmer</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Ajout en cours...
            </span>
          </button>
        </div>
        
        <!-- ✅ NOUVEAU: Section des détails du paiement -->
        <div v-if="showPaymentDetails && pendingAdditionalPayment" class="mt-4 sm:mt-6 p-4 sm:p-6 bg-slate-800/50 border border-slate-600 rounded-lg">
          <div class="mb-4">
            <h4 class="text-lg sm:text-xl font-bold text-white mb-3">Détails de la commande supplémentaire</h4>
            <div class="space-y-2 text-sm sm:text-base">
              <div class="flex justify-between text-slate-300">
                <span>Nombre de cartes :</span>
                <span class="text-white font-semibold">{{ pendingAdditionalPayment.quantity }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Prix unitaire :</span>
                <span class="text-white font-semibold">{{ formatPrice(pendingAdditionalPayment.unit_price) }} GNF</span>
              </div>
              <div class="flex justify-between text-slate-300 border-t border-slate-600 pt-2 mt-2">
                <span class="font-semibold">Montant total :</span>
                <span class="text-white font-bold text-lg">{{ formatPrice(pendingAdditionalPayment.total_price) }} GNF</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              data-payment-button="additional-cards"
              @click="handlePayment"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              Payer {{ formatPrice(pendingAdditionalPayment.total_price) }} GNF
            </button>
            <button
              @click="cancelPayment"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay de chargement global pendant la validation -->
    <div
      v-if="isProcessing && validatingOrderId"
      class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
        <p class="text-white font-medium text-lg">Validation de votre commande...</p>
      </div>
    </div>

    <!-- Modal de Validation de Commande -->
    <div
      v-if="showValidateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
      @click.self="closeValidateModal"
    >
      <div class="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full">
          <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white text-center mb-3">🎉 Félicitations !</h3>
        <p class="text-slate-300 text-center mb-4">
          Votre commande a été validée avec succès ! Vous recevrez un email résumant votre commande et les conditions
          générales d'utilisation.
        </p>
        <div class="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 mb-6">
          <p class="text-sky-300 text-center text-sm">
            <strong>📦 Livraison :</strong> Votre commande sera livrée dans un délai de <strong>48h</strong>, 
            la livraison est <strong>gratuite</strong> partout à Conakry.
          </p>
        </div>
        <button
          @click="closeValidateModal"
          class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>

    <!-- ✅ NOUVEAU: Modal d'attente pour le paiement -->

    <!-- ✅ NOUVEAU: Modal de Félicitation pour les Cartes Supplémentaires -->
    <div
      v-if="showAdditionalCardsSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
      @click.self="closeAdditionalCardsSuccessModal"
    >
      <div class="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full">
          <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white text-center mb-3">🎉 Paiement Réussi !</h3>
        <p class="text-slate-300 text-center mb-4">
          Vos cartes supplémentaires ont été ajoutées avec succès à votre commande !
        </p>
        <div v-if="additionalCardsSuccessData" class="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 mb-6">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Nombre de cartes ajoutées:</span>
              <span class="text-white font-semibold">{{ additionalCardsSuccessData.quantity }} carte(s)</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Montant payé:</span>
              <span class="text-white font-semibold">{{ formatPrice(additionalCardsSuccessData.total_price) }} GNF</span>
            </div>
            <div v-if="additionalCardsSuccessData.order_number" class="flex justify-between items-center">
              <span class="text-slate-400">Commande:</span>
              <span class="text-white font-semibold">#{{ additionalCardsSuccessData.order_number }}</span>
            </div>
          </div>
        </div>
        <p class="text-slate-400 text-center text-sm mb-6">
          Les cartes supplémentaires ont été ajoutées à votre commande et seront livrées avec votre commande principale.
        </p>
        <button
          @click="closeAdditionalCardsSuccessModal"
          class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onActivated, onBeforeUnmount, nextTick, watch } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import apiClient from "@/api";
  import { useAuth } from "@/composables/useAuth";
  import { useOrderModal } from "@/composables/useOrderModal";
  import Cookies from "js-cookie";

  const router = useRouter();
  const route = useRoute();
  const { user, fetchUser, updateUserLocally } = useAuth();
  const { openOrderModal } = useOrderModal();

  // ✅ PERF: cache mémoire des commandes (mutualisé avec /parametres et /choisir-profil)
  const ORDERS_CACHE = (globalThis.__DIGICARD_ORDERS_CACHE__ ||= { value: null, ts: 0, inFlight: null });
  const ORDERS_TTL_MS = 60_000; // 60s

  const orders = ref(Array.isArray(ORDERS_CACHE.value) ? ORDERS_CACHE.value : []);
  const isLoading = ref(!(Array.isArray(ORDERS_CACHE.value) && Date.now() - ORDERS_CACHE.ts < ORDERS_TTL_MS));
  const loadingError = ref("");
  
  // ✅ CORRECTION: Flag pour éviter les réessais multiples simultanés
  const isRetryingLoad = ref(false);
  const loadRetryCount = ref(0);
  const maxLoadRetries = 3; // Maximum 3 réessais
  const isLoadingOrders = ref(false); // Flag pour éviter les appels multiples simultanés
  
  // Prix dynamiques chargés depuis l'API
  const BASE_PRICE = ref(200000); // Prix par défaut (sera remplacé par l'API)
  const EXTRA_PRICE = ref(60000); // Prix par défaut (sera remplacé par l'API)
  const pricingVersion = ref(0); // Clé de version pour forcer le re-render quand les prix changent

  // États des modals
  const showCancelModal = ref(false);
  const showValidateModal = ref(false);
  const showAdditionalCardsSuccessModal = ref(false);
  const additionalCardsSuccessData = ref(null);
  const showAddCardsModal = ref(false);
  // ✅ NOUVEAU: Polling pour le paiement (sans modal d'attente)
  const paymentPollingInterval = ref(null);
  const currentPollingOrderId = ref(null);
  const currentPollingAdditionalPaymentId = ref(null);
  const selectedOrder = ref(null);
  const isProcessing = ref(false);
  const validatingOrderId = ref(null); // ID de la commande en cours de validation
  const isAddingCards = ref(false);
  const additionalCardsQuantity = ref(1);
  const additionalCardPrice = ref(null);
  const addCardsError = ref("");
  
  // ✅ NOUVEAU: Variables pour le paiement des cartes supplémentaires
  const showPaymentDetails = ref(false);
  const pendingAdditionalPayment = ref(null);
  
  // Pour les commandes business : distribution des cartes
  const isBusinessOrder = ref(false);
  const businessAdminInOrder = ref(false);
  const businessAdminName = ref("");
  const businessAdminCurrentCards = ref(0);
  const orderEmployees = ref([]);
  const businessDistribution = ref({
    admin: 0,
    employees: {},
  });

  // Fonction pour retourner au Dashboard
  const goToDashboard = () => {
    router.push({ name: "Dashboard" });
  };

  // Charger les prix depuis l'API
  const loadPricing = async () => {
    try {
      const res = await apiClient.get('/api/settings/pricing');
      const pricing = res.data?.pricing || res.data || {};
      
      if (pricing.card_price !== undefined && pricing.card_price !== null) {
        BASE_PRICE.value = Number(pricing.card_price);
      }
      if (pricing.additional_card_price !== undefined && pricing.additional_card_price !== null) {
        EXTRA_PRICE.value = Number(pricing.additional_card_price);
      }
      
      console.log('Prix chargés depuis l\'API dans OrdersView:', {
        BASE_PRICE: BASE_PRICE.value,
        EXTRA_PRICE: EXTRA_PRICE.value,
      });
      
      // Incrémenter la version pour forcer le re-render
      pricingVersion.value++;
    } catch (e) {
      console.warn('Impossible de charger la tarification depuis l\'API. Utilisation des valeurs par défaut.', e);
    }
  };

  // Charger les commandes
  const loadOrders = async (options = {}) => {
    const { preferCache = true, backgroundRefresh = true } = options;

    const now = Date.now();
    const hasFreshCache = Array.isArray(ORDERS_CACHE.value) && now - ORDERS_CACHE.ts < ORDERS_TTL_MS;

    // Affichage instantané depuis le cache si dispo (évite skeleton à chaque navigation)
    if (preferCache && hasFreshCache) {
      orders.value = ORDERS_CACHE.value;
      loadingError.value = "";
      isLoading.value = false;

      if (!backgroundRefresh) {
        return;
      }
      // On continue en arrière-plan pour rafraîchir silencieusement
    }

    // ✅ CORRECTION: Éviter les appels multiples simultanés
    if (isLoadingOrders.value) {
      console.log("OrdersView: Un chargement est déjà en cours, annulation de l'appel...");
      return;
    }
    
    if (isRetryingLoad.value) {
      console.log("OrdersView: Un réessai est déjà en cours, annulation de l'appel...");
      return;
    }
    
    isLoadingOrders.value = true;
    if (!(preferCache && hasFreshCache)) {
      isLoading.value = true;
    }
    loadingError.value = "";

    try {
      console.log("OrdersView: Début du chargement des commandes...");

      // Dédupliquer aussi au niveau global (si une autre page a déjà lancé /api/orders)
      if (ORDERS_CACHE.inFlight) {
        const v = await ORDERS_CACHE.inFlight;
        const arr = Array.isArray(v) ? v : [];
        orders.value = arr;
        ORDERS_CACHE.value = arr;
        ORDERS_CACHE.ts = Date.now();
        return;
      }
      
      // ✅ CRITIQUE: Récupérer le cookie CSRF avant de charger les commandes
      // Cela garantit que la session est bien établie après une redirection depuis un service externe
      // Pour les retours de paiement, faire plusieurs tentatives car la session peut prendre du temps
      const isPaymentReturn = route.query.payment === 'success' && (route.query.order_id || route.query.additional_payment_id);
      const maxCsrfRetries = isPaymentReturn ? 3 : 1;
      const csrfRetryDelay = 300;
      
      for (let csrfAttempt = 1; csrfAttempt <= maxCsrfRetries; csrfAttempt++) {
        try {
          await apiClient.get("/sanctum/csrf-cookie");
          // Attendre un peu pour que le cookie soit bien défini
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Mettre à jour le header CSRF
          const csrfToken = Cookies.get("XSRF-TOKEN");
          if (csrfToken) {
            apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
            console.log(`OrdersView: Cookie CSRF récupéré (tentative ${csrfAttempt}/${maxCsrfRetries})`);
            break; // Cookie récupéré, sortir de la boucle
          } else if (csrfAttempt < maxCsrfRetries) {
            console.log(`OrdersView: Cookie CSRF non trouvé, nouvelle tentative dans ${csrfRetryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, csrfRetryDelay));
          }
        } catch (csrfError) {
          console.warn(`OrdersView: Erreur lors de la tentative ${csrfAttempt} de récupération du cookie CSRF:`, csrfError);
          if (csrfAttempt < maxCsrfRetries) {
            await new Promise(resolve => setTimeout(resolve, csrfRetryDelay));
          } else {
            console.warn("OrdersView: Cookie CSRF non récupéré après toutes les tentatives, continuation...");
            // Continuer quand même, le cookie peut déjà être présent
          }
        }
      }
      
      // Charger les prix avant de charger les commandes
      await loadPricing();

      // ✅ OPTIMISATION : Ne pas ajouter de timestamp pour permettre le cache du navigateur
      // Le backend retourne déjà les données optimisées
      console.log("OrdersView: Appel API pour charger les commandes...");
      ORDERS_CACHE.inFlight = apiClient.get(`/api/orders`);
      const response = await ORDERS_CACHE.inFlight;
      
      console.log("OrdersView: Commandes reçues du backend", {
        count: Array.isArray(response.data) ? response.data.length : 0,
        data: response.data
      });
      
      const allOrders = Array.isArray(response.data) ? response.data : [];
      orders.value = allOrders;
      ORDERS_CACHE.value = allOrders;
      ORDERS_CACHE.ts = Date.now();
      
      // ✅ CORRECTION: Réinitialiser le compteur de réessais en cas de succès
      loadRetryCount.value = 0;
      isRetryingLoad.value = false;
      isLoadingOrders.value = false;
      
      console.log("OrdersView: Commandes chargées avec succès", {
        count: orders.value.length,
        orders: orders.value.map(o => ({ id: o.id, order_number: o.order_number, status: o.status }))
      });
    } catch (error) {
      console.error("OrdersView: Erreur lors du chargement des commandes:", error);
      
      // ✅ CORRECTION: Pour les retours de paiement, ne pas afficher d'erreur immédiatement
      // La session peut être récupérée en arrière-plan
      const isPaymentReturn = route.query.payment === 'success' && (route.query.order_id || route.query.additional_payment_id);
      
      // Si c'est un retour de paiement et une erreur 401/419, réessayer après un délai
      // Mais seulement si on n'est pas déjà en train de réessayer et qu'on n'a pas dépassé le maximum
      if (isPaymentReturn && error.response && (error.response.status === 401 || error.response.status === 419)) {
        if (!isRetryingLoad.value && loadRetryCount.value < maxLoadRetries) {
          loadRetryCount.value++;
          isRetryingLoad.value = true;
          console.warn(`OrdersView: Erreur 401/419 lors du chargement des commandes (retour de paiement). Réessai ${loadRetryCount.value}/${maxLoadRetries} en cours...`);
          
          // Réessayer après 1 seconde
          setTimeout(async () => {
            try {
              // Réessayer de récupérer la session avant de charger les commandes
              try {
                await fetchUser();
                // Récupérer le cookie CSRF à nouveau
                await apiClient.get("/sanctum/csrf-cookie");
                await new Promise(resolve => setTimeout(resolve, 200));
                const csrfToken = Cookies.get("XSRF-TOKEN");
                if (csrfToken) {
                  apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
                }
              } catch (sessionError) {
                console.warn("OrdersView: Erreur lors de la récupération de la session pour le réessai:", sessionError);
              }
              
              // ✅ CORRECTION: Réinitialiser le flag avant d'appeler loadOrders pour permettre l'appel
              isRetryingLoad.value = false;
              await loadOrders();
            } catch (retryError) {
              console.error("OrdersView: Erreur lors du réessai de chargement des commandes:", retryError);
              isRetryingLoad.value = false;
              
              // Si on a atteint le maximum de réessais, afficher l'erreur
              if (loadRetryCount.value >= maxLoadRetries) {
                loadingError.value = "Impossible de charger vos commandes. Veuillez rafraîchir la page ou vous reconnecter.";
              } else {
                // Si ce n'est pas le dernier essai, ne pas définir d'erreur pour permettre un autre réessai
                console.warn(`OrdersView: Réessai ${loadRetryCount.value}/${maxLoadRetries} échoué, mais d'autres tentatives peuvent être faites.`);
              }
            }
          }, 1000);
          return; // Sortir sans définir d'erreur
        } else if (loadRetryCount.value >= maxLoadRetries) {
          console.error("OrdersView: Maximum de réessais atteint. Arrêt des tentatives.");
          loadingError.value = "Impossible de charger vos commandes après plusieurs tentatives. Veuillez rafraîchir la page ou vous reconnecter.";
        }
      }
      
      console.error("OrdersView: Détails de l'erreur:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      loadingError.value = error.response?.data?.message || "Impossible de charger vos commandes. Veuillez réessayer.";
      // S'assurer que orders est toujours un tableau même en cas d'erreur
      orders.value = [];
      
      // ✅ CORRECTION: Si ce n'est pas un retour de paiement ou qu'on a atteint le maximum de réessais,
      // réinitialiser le flag pour permettre de nouveaux appels
      const isPaymentReturnInError = route.query.payment === 'success' && (route.query.order_id || route.query.additional_payment_id);
      if (!isPaymentReturnInError || loadRetryCount.value >= maxLoadRetries) {
        isRetryingLoad.value = false;
        isLoadingOrders.value = false;
      }
    } finally {
      isLoading.value = false;
      ORDERS_CACHE.inFlight = null;
      // ✅ CORRECTION: Réinitialiser le flag seulement si ce n'est pas un réessai en cours
      if (!isRetryingLoad.value) {
        isLoadingOrders.value = false;
      }
      console.log("OrdersView: Fin du chargement des commandes", {
        isLoading: isLoading.value,
        hasError: !!loadingError.value,
        ordersCount: orders.value.length
      });
    }
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  // Fonction pour formater la date (JJ/MM/AAAA) ou date et heure si disponible
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    // Si l'heure est disponible (pas minuit), l'afficher
    if (hours !== '00' || minutes !== '00') {
      return `${day}/${month}/${year} à ${hours}:${minutes}`;
    }
    return `${day}/${month}/${year}`;
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  // ✅ NOUVEAU: Fonction pour obtenir le nom d'un employé à partir de son ID
  const getEmployeeName = (order, employeeId) => {
    if (!order || !employeeId) return null;
    
    // Chercher dans order_employees
    if (order.order_employees && Array.isArray(order.order_employees)) {
      const employee = order.order_employees.find(emp => 
        emp.employee_id === parseInt(employeeId) || 
        emp.id === parseInt(employeeId) ||
        String(emp.employee_id) === String(employeeId)
      );
      if (employee) {
        return employee.employee_name || employee.name || null;
      }
    }
    
    return null;
  };

  // Obtenir le nombre de cartes (spécifique à l'employé si applicable)
  const getCardQuantity = (order) => {
    // Si l'utilisateur est un employé et que employee_card_quantity existe, l'utiliser
    if (user.value?.role === "employee" && order.employee_card_quantity !== undefined) {
      return order.employee_card_quantity;
    }

    // ✅ Pour toutes les autres commandes (business et personal), utiliser card_quantity
    // qui est déjà calculé et mis à jour correctement par le backend
    return order.card_quantity || 0;
  };

  // Recalculer le prix total pour les commandes entreprises avec les prix chargés depuis l'API
  // IMPORTANT: Les commandes validées conservent leur prix d'origine (pas de recalcul)
  const getCorrectTotalPrice = (order) => {
    // Si la commande est validée, utiliser le prix enregistré (pas de recalcul)
    const isOrderValidated = order.status === 'validated' || order.status === 'validé' || order.status === 'valide';
    if (isOrderValidated) {
      // Pour les commandes validées, utiliser le prix enregistré dans la commande
      // Cela garantit que le prix ne change pas même si les prix sont modifiés par le super admin
      return order.total_price || 0;
    }
    
    // Pour les commandes non validées, recalculer avec les prix actuels de l'API
    if (order.order_type === "business" || order.order_type === "entreprise") {
      // Utiliser les prix chargés depuis l'API (dynamiques)
      const basePrice = BASE_PRICE.value;
      const extraPrice = EXTRA_PRICE.value;
      
      let calculatedPrice = 0;
      let calculationMethod = '';
      
      // Si on a les employee_slots ou order_employees, utiliser ces données
      if (order.employee_slots && order.employee_slots.length > 0) {
        // Calculer avec les slots d'employés
        calculatedPrice = order.employee_slots.reduce((total, slot) => {
          const quantity = Number(slot.cards_quantity) || 1;
          return total + basePrice + (quantity - 1) * extraPrice;
        }, 0);
        calculationMethod = 'employee_slots';
      } else if (order.order_employees && order.order_employees.length > 0) {
        // Calculer avec les employés de la commande
        calculatedPrice = order.order_employees.reduce((total, emp) => {
          const quantity = Number(emp.card_quantity) || Number(emp.cards_quantity) || 1;
          return total + basePrice + (quantity - 1) * extraPrice;
        }, 0);
        calculationMethod = 'order_employees';
      } else if (order.total_employees && order.cards_per_employee) {
        // Mode uniforme : même nombre de cartes pour tous
        const quantity = Number(order.cards_per_employee) || 1;
        const pricePerPerson = basePrice + (quantity - 1) * extraPrice;
        calculatedPrice = order.total_employees * pricePerPerson;
        calculationMethod = 'uniform_mode';
      } else if (order.card_quantity && order.total_employees) {
        // Fallback : calculer avec le nombre total de cartes et le nombre de personnes
        const cardsPerPerson = Math.floor(order.card_quantity / order.total_employees);
        const pricePerPerson = basePrice + (cardsPerPerson - 1) * extraPrice;
        calculatedPrice = order.total_employees * pricePerPerson;
        calculationMethod = 'fallback_calculation';
      } else if (order.card_quantity || order.quantity) {
        // Cas simple : calculer directement avec le nombre total de cartes
        const quantity = Number(order.card_quantity || order.quantity) || 0;
        if (quantity > 0) {
          calculatedPrice = basePrice + (quantity - 1) * extraPrice;
          calculationMethod = 'simple_card_quantity';
        }
      }
      
      // Log pour debug
      if (calculatedPrice > 0) {
        console.log(`Prix recalculé pour commande business #${order.id} (${calculationMethod}):`, {
          orderId: order.id,
          orderType: order.order_type,
          status: order.status,
          total_employees: order.total_employees,
          cards_per_employee: order.cards_per_employee,
          card_quantity: order.card_quantity,
          quantity: order.quantity,
          prixBackend: order.total_price,
          prixRecalculé: calculatedPrice,
          BASE_PRICE_utilisé: basePrice,
          EXTRA_PRICE_utilisé: extraPrice,
          méthode: calculationMethod,
        });
        return calculatedPrice;
      }
    }
    
    // Pour les commandes particulières/individuelles non validées, recalculer avec les prix actuels
    if (
      !isOrderValidated &&
      (order.order_type === "personal" || order.order_type === "individual" || order.order_type === "particulier")
    ) {
      const quantity = order.card_quantity || order.quantity || 0;
      if (quantity > 0) {
        const calculatedPrice = BASE_PRICE.value + (quantity - 1) * EXTRA_PRICE.value;
        console.log(`Prix recalculé pour commande personnelle #${order.id}:`, {
          orderId: order.id,
          orderType: order.order_type,
          status: order.status,
          quantity: quantity,
          prixBackend: order.total_price,
          prixRecalculé: calculatedPrice,
          BASE_PRICE_utilisé: BASE_PRICE.value,
          EXTRA_PRICE_utilisé: EXTRA_PRICE.value,
        });
        return calculatedPrice;
      }
    }
    
    // Pour les autres cas, utiliser le prix du backend
    return order.total_price || 0;
  };

  // Obtenir les données de design d'une commande
  const getDesignData = (order) => {
    // Pour les employés, vérifier d'abord dans employee_profile
    if (user.value?.role === "employee" && order.employee_profile) {
      return {
        card_design_type: order.employee_profile.card_design_type,
        card_design_number: order.employee_profile.card_design_number,
        card_design_custom_url: order.employee_profile.card_design_custom_url,
        no_design_yet: order.employee_profile.no_design_yet,
      };
    }
    
    // Pour les business admins inclus dans une commande entreprise, vérifier dans employee_profile
    // car ils sont traités comme des "employés" de leur propre commande (via OrderEmployee)
    // Utiliser plusieurs indicateurs pour détecter si le business admin est inclus :
    // 1. employee_profile existe (le plus fiable)
    // 2. order_employees contient un employé avec employee_id = user.id
    // 3. employee_card_quantity existe (fallback)
    const isBusinessAdminInOrder = 
      user.value?.role === "business_admin" && 
      order.order_type === "business" &&
      (
        order.employee_profile !== undefined ||
        (order.order_employees && order.order_employees.some(emp => emp.employee_id === user.value.id)) ||
        order.employee_card_quantity !== undefined
      );
    
    console.log("OrdersView: getDesignData for order", {
      orderId: order.id,
      orderType: order.order_type,
      userRole: user.value?.role,
      hasEmployeeProfile: !!order.employee_profile,
      hasOrderEmployees: !!order.order_employees,
      orderEmployeesCount: order.order_employees?.length || 0,
      employeeCardQuantity: order.employee_card_quantity,
      isBusinessAdminInOrder,
      employeeProfileDesign: order.employee_profile ? {
        card_design_type: order.employee_profile.card_design_type,
        card_design_number: order.employee_profile.card_design_number,
        no_design_yet: order.employee_profile.no_design_yet,
      } : null,
      orderDesign: {
        card_design_type: order.card_design_type,
        card_design_number: order.card_design_number,
        no_design_yet: order.no_design_yet,
      },
    });
    
    if (isBusinessAdminInOrder && order.employee_profile) {
      console.log("OrdersView: Using employee_profile design data for business admin", {
        card_design_type: order.employee_profile.card_design_type,
        card_design_number: order.employee_profile.card_design_number,
        card_design_custom_url: order.employee_profile.card_design_custom_url,
        no_design_yet: order.employee_profile.no_design_yet,
      });
      return {
        card_design_type: order.employee_profile.card_design_type,
        card_design_number: order.employee_profile.card_design_number,
        card_design_custom_url: order.employee_profile.card_design_custom_url,
        no_design_yet: order.employee_profile.no_design_yet,
      };
    }
    
    // Pour les autres utilisateurs, utiliser les données de la commande
    // Le backend copie aussi les données de design au niveau racine pour le business admin inclus
    console.log("OrdersView: Using order-level design data", {
      card_design_type: order.card_design_type,
      card_design_number: order.card_design_number,
      card_design_custom_url: order.card_design_custom_url,
      no_design_yet: order.no_design_yet,
    });
    return {
      card_design_type: order.card_design_type,
      card_design_number: order.card_design_number,
      card_design_custom_url: order.card_design_custom_url,
      no_design_yet: order.no_design_yet,
    };
  };

  // Vérifier si un design est défini pour une commande
  const hasDesignDefined = (order) => {
    const designData = getDesignData(order);

    // Si "Je n'ai pas encore mon design" est coché, la validation est impossible
    if (designData?.no_design_yet) {
      return false;
    }

    // Si un design template est sélectionné
    if (designData?.card_design_type === "template" && designData?.card_design_number) {
      return true;
    }

    // Si un design personnalisé est sélectionné
    if (designData?.card_design_type === "custom" && designData?.card_design_custom_url) {
      return true;
    }

    // Aucun design défini
    return false;
  };

  // Obtenir le label du design choisi
  const getDesignLabel = (order) => {
    const designData = getDesignData(order);

    // Si "Je n'ai pas encore mon design" est coché
    if (designData?.no_design_yet) {
      return "Design en attente";
    }

    // Si un design template est sélectionné
    if (designData?.card_design_type === "template" && designData?.card_design_number) {
      return `Design${designData.card_design_number}`;
    }

    // Si un design personnalisé est sélectionné
    if (designData?.card_design_type === "custom") {
      return "Design Personnel";
    }

    // Si aucun design n'est défini
    return "Non défini";
  };

  // Obtenir la classe CSS du statut
  const getStatusClass = (order) => {
    const classes = {
      pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      awaiting: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      validated: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      configured: "bg-green-500/20 text-green-400 border border-green-500/30",
      completed: "bg-green-500/20 text-green-400 border border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
    };
    if (!hasDesignDefined(order)) return classes.awaiting;
    return classes[order?.status] || classes.pending;
  };

  // Obtenir le texte du statut
  const getStatusText = (order) => {
    if (!hasDesignDefined(order)) return "En attente design";
    const texts = {
      pending: "En attente",
      validated: "Validée",
      configured: "Paramétrée",
      completed: "Terminée",
      cancelled: "Annulée",
    };
    return texts[order?.status] || "Inconnu";
  };

  // Configurer une commande (rediriger vers la page de paramétrage)
  const configureOrder = (order) => {
    router.push({ name: "Settings", query: { orderId: order.id } });
  };

  // Ouvrir le modal d'annulation
  const openCancelModal = (order) => {
    selectedOrder.value = order;
    showCancelModal.value = true;
  };

  // Fermer le modal d'annulation
  const closeCancelModal = () => {
    if (!isProcessing.value) {
      showCancelModal.value = false;
      selectedOrder.value = null;
    }
  };

  // Confirmer l'annulation de la commande
  const confirmCancel = async () => {
    if (!selectedOrder.value || isProcessing.value) return;

    isProcessing.value = true;

    try {
      // Définir le header CSRF
      const csrfToken = Cookies.get("XSRF-TOKEN");
      if (csrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
      }

      await apiClient.delete(`/api/orders/${selectedOrder.value.id}`);

      // Retirer la commande de la liste
      orders.value = orders.value.filter((o) => o.id !== selectedOrder.value.id);

      // Fermer le modal
      showCancelModal.value = false;
      selectedOrder.value = null;
    } catch (error) {
      console.error("Erreur lors de l'annulation de la commande:", error);
      alert(error.response?.data?.message || "Erreur lors de l'annulation de la commande.");
    } finally {
      isProcessing.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Ouvrir le modal de validation
  const openValidateModal = async (order) => {
    if (isProcessing.value) return;

    // Vérifier si un design est défini avant de permettre la validation
    if (!hasDesignDefined(order)) {
      alert("Vous devez définir un design pour la carte avant de pouvoir valider la commande.\n\nVeuillez aller dans 'Paramétrer ma carte' pour sélectionner un design (template ou personnalisé). L'option 'Je n'ai pas encore mon design' empêche la validation.");
      return;
    }

    isProcessing.value = true;
    validatingOrderId.value = order.id;

    try {
      // Définir le header CSRF
      const csrfToken = Cookies.get("XSRF-TOKEN");
      if (csrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
      }

      const response = await apiClient.post(`/api/orders/${order.id}/validate`);

      // ✅ MODIFICATION: Vérifier si la réponse contient un lien de paiement
      if (response.data.payment_url) {
        // Ouvrir le paiement dans un nouvel onglet
        console.log('Ouverture du paiement dans un nouvel onglet:', response.data.payment_url);
        window.open(response.data.payment_url, '_blank');
        
        // Démarrer le polling en arrière-plan (sans modal d'attente)
        currentPollingOrderId.value = order.id;
        currentPollingAdditionalPaymentId.value = null;
        startPaymentPolling(order.id, null);
        
        return; // Sortir de la fonction
      }

      // Si pas de lien de paiement (ancien comportement pour compatibilité)
      // Mettre à jour la commande dans la liste
      const index = orders.value.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        orders.value[index] = { ...orders.value[index], ...response.data.order };
      }

      // Émettre un événement pour notifier qu'une commande a été validée
      // Cela permettra au Dashboard du super admin de se mettre à jour automatiquement
      window.dispatchEvent(new CustomEvent('order-validated', {
        detail: { order: response.data.order }
      }));

      // Afficher le modal de succès
      showValidateModal.value = true;

      // Attendre que Vue ait rendu le modal avant de désactiver le chargement
      await nextTick();
      // Petit délai supplémentaire pour s'assurer que le modal est bien visible
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Erreur lors de la validation de la commande:", error);
      alert(error.response?.data?.message || "Erreur lors de la validation de la commande.");
    } finally {
      isProcessing.value = false;
      validatingOrderId.value = null;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Fermer le modal de validation
  const closeValidateModal = () => {
    showValidateModal.value = false;
    // Recharger les commandes pour obtenir les données à jour
    loadOrders();
  };

  // ✅ NOUVEAU: Fermer le modal de félicitation pour les cartes supplémentaires
  const closeAdditionalCardsSuccessModal = () => {
    showAdditionalCardsSuccessModal.value = false;
    additionalCardsSuccessData.value = null;
    // Recharger les commandes pour obtenir les données à jour
    loadOrders();
  };

  // Ouvrir le modal pour ajouter des cartes supplémentaires
  const openAddCardsModal = async (order) => {
    selectedOrder.value = order;
    additionalCardsQuantity.value = 1;
    addCardsError.value = "";
    
    // Vérifier si c'est une commande business
    isBusinessOrder.value = order.order_type === 'business' || order.order_type === 'entreprise';
    
    // Afficher immédiatement le modal avec les données disponibles de l'ordre
    if (isBusinessOrder.value && order.order_employees && Array.isArray(order.order_employees)) {
      // Utiliser les données déjà disponibles dans l'ordre
      let allEmployees = order.order_employees;
      
      // Séparer le business admin des autres employés
      const adminEmployee = allEmployees.find(emp => {
        const empId = emp.employee_id || emp.id;
        const isSameUser = empId === user.value.id;
        const isBusinessAdmin = emp.employee && emp.employee.role === 'business_admin';
        return isSameUser || (isSameUser && isBusinessAdmin);
      });
      
      const otherEmployees = allEmployees.filter(emp => {
        const empId = emp.employee_id || emp.id;
        const isNotAdmin = empId !== user.value.id;
        const isNotBusinessAdminRole = !emp.employee || emp.employee.role !== 'business_admin';
        return isNotAdmin && isNotBusinessAdminRole;
      });
      
      businessAdminInOrder.value = !!adminEmployee;
      if (adminEmployee) {
        businessAdminName.value = adminEmployee.employee_name || adminEmployee.employee?.name || user.value.name || "Vous";
        businessAdminCurrentCards.value = adminEmployee.card_quantity || 0;
      }
      
      orderEmployees.value = otherEmployees.map(emp => ({
        id: emp.employee_id || emp.id,
        name: emp.employee_name || emp.employee?.name || 'Employé',
        current_cards: emp.card_quantity || 0,
        additional_cards: 0
      }));
      
      // Initialiser la distribution avec les données disponibles
      businessDistribution.value = {
        admin: 0,
        employees: {},
      };
      otherEmployees.forEach(emp => {
        const empId = emp.employee_id || emp.id;
        businessDistribution.value.employees[empId] = 0;
      });
    }
    
    // Afficher le modal immédiatement
    showAddCardsModal.value = true;
    
    // Charger les données complètes en arrière-plan pour les commandes business
    if (isBusinessOrder.value) {
      try {
        const response = await apiClient.get(`/api/orders/${order.id}`);
        const orderData = response.data;
        
        console.log("OrdersView: openAddCardsModal - Réponse API complète", {
          orderId: order.id,
          orderDataKeys: Object.keys(orderData),
          hasOrderEmployees: !!orderData.order_employees,
          orderEmployeesType: Array.isArray(orderData.order_employees) ? 'array' : typeof orderData.order_employees,
          orderEmployeesLength: Array.isArray(orderData.order_employees) ? orderData.order_employees.length : 0,
          orderEmployeesData: orderData.order_employees,
          orderFromList: order.order_employees ? {
            type: Array.isArray(order.order_employees) ? 'array' : typeof order.order_employees,
            length: Array.isArray(order.order_employees) ? order.order_employees.length : 0,
            data: order.order_employees
          } : null,
        });
        
        // Récupérer tous les order_employees (y compris le business admin s'il est inclus)
        // Essayer plusieurs sources possibles pour les données
        let allEmployees = [];
        
        if (orderData.order_employees && Array.isArray(orderData.order_employees)) {
          allEmployees = orderData.order_employees;
        } else if (order.order_employees && Array.isArray(order.order_employees)) {
          allEmployees = order.order_employees;
        } else if (orderData.orderEmployees && Array.isArray(orderData.orderEmployees)) {
          allEmployees = orderData.orderEmployees;
        }
        
        console.log("OrdersView: openAddCardsModal - allEmployees récupérés", {
          totalCount: allEmployees.length,
          employees: allEmployees.map(e => ({
            id: e.id,
            employee_id: e.employee_id,
            employee_name: e.employee_name,
            employee: e.employee ? { id: e.employee.id, name: e.employee.name, role: e.employee.role } : null,
            card_quantity: e.card_quantity,
          }))
        });
        
        // Séparer le business admin des autres employés
        // IMPORTANT: Pour identifier le business admin, on compare employee_id avec user.id
        // Mais il faut aussi vérifier le rôle de l'employé si la relation employee est chargée
        const adminEmployee = allEmployees.find(emp => {
          const empId = emp.employee_id || emp.id;
          const isSameUser = empId === user.value.id;
          // Vérifier aussi si l'employé a le rôle business_admin (si la relation employee est chargée)
          const isBusinessAdmin = emp.employee && emp.employee.role === 'business_admin';
          return isSameUser || (isSameUser && isBusinessAdmin);
        });
        
        // Filtrer les autres employés : exclure le business admin ET les employés avec role === 'business_admin'
        const otherEmployees = allEmployees.filter(emp => {
          const empId = emp.employee_id || emp.id;
          const isNotAdmin = empId !== user.value.id;
          const isNotBusinessAdminRole = !emp.employee || emp.employee.role !== 'business_admin';
          return isNotAdmin && isNotBusinessAdminRole;
        });
        
        // Définir si le business admin est inclus
        businessAdminInOrder.value = !!adminEmployee;
        
        if (adminEmployee) {
          businessAdminName.value = adminEmployee.employee_name || adminEmployee.employee?.name || user.value.name || "Vous";
          businessAdminCurrentCards.value = adminEmployee.card_quantity || 0;
        }
        
        // Stocker uniquement les vrais employés (exclure le business admin)
        orderEmployees.value = otherEmployees;
        
        // Initialiser la distribution
        businessDistribution.value = {
          admin: 0,
          employees: {},
        };
        
        // Initialiser les quantités pour chaque employé (exclure le business admin de cette liste)
        otherEmployees.forEach(emp => {
          const empId = emp.employee_id || emp.id;
          businessDistribution.value.employees[empId] = 0;
        });
        
        console.log("OrdersView: openAddCardsModal - Employés chargés et filtrés", {
          totalEmployees: allEmployees.length,
          adminIncluded: businessAdminInOrder.value,
          adminName: businessAdminName.value,
          adminCurrentCards: businessAdminCurrentCards.value,
          otherEmployeesCount: otherEmployees.length,
          employeesList: otherEmployees.map(e => ({
            id: e.id,
            employee_id: e.employee_id || e.id,
            name: e.employee_name || e.employee?.name || `Employé #${e.employee_id || e.id}`,
            currentCards: e.card_quantity || 0,
            role: e.employee?.role
          })),
          distributionEmployees: Object.keys(businessDistribution.value.employees)
        });
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
        console.error("Stack trace:", error.stack);
        // Fallback: utiliser les données de la commande directement
        const allEmployees = order.order_employees || [];
        const adminEmployee = allEmployees.find(emp => (emp.employee_id || emp.id) === user.value.id);
        const otherEmployees = allEmployees.filter(emp => {
          const empId = emp.employee_id || emp.id;
          const isNotAdmin = empId !== user.value.id;
          const isNotBusinessAdminRole = !emp.employee || emp.employee.role !== 'business_admin';
          return isNotAdmin && isNotBusinessAdminRole;
        });
        
        businessAdminInOrder.value = !!adminEmployee;
        if (adminEmployee) {
          businessAdminName.value = adminEmployee.employee_name || adminEmployee.employee?.name || user.value.name || "Vous";
          businessAdminCurrentCards.value = adminEmployee.card_quantity || 0;
        }
        
        orderEmployees.value = otherEmployees;
        businessDistribution.value = {
          admin: 0,
          employees: {},
        };
        otherEmployees.forEach(emp => {
          const empId = emp.employee_id || emp.id;
          businessDistribution.value.employees[empId] = 0;
        });
      }
    }

    // Charger le prix d'une carte supplémentaire depuis les settings du super admin
    // IMPORTANT: Le prix doit toujours être celui défini par le super admin
    try {
      // Utiliser un timestamp pour éviter le cache
      const timestamp = new Date().getTime();
      const response = await apiClient.get(`/api/settings/pricing?t=${timestamp}`);
      
      console.log("OrdersView: openAddCardsModal - Réponse complète de l'API pricing", {
        fullResponse: response.data,
        pricing: response.data?.pricing,
        additional_card_price: response.data?.pricing?.additional_card_price,
      });
      
      const pricing = response.data?.pricing || response.data;
      
      if (pricing && pricing.additional_card_price !== undefined && pricing.additional_card_price !== null) {
        const priceFromAdmin = Number(pricing.additional_card_price);
        console.log("OrdersView: openAddCardsModal - Prix récupéré depuis l'API", {
          rawValue: pricing.additional_card_price,
          convertedValue: priceFromAdmin,
          isValid: priceFromAdmin > 0,
        });
        
        if (priceFromAdmin > 0) {
          additionalCardPrice.value = priceFromAdmin;
          console.log("✅ Prix de la carte supplémentaire chargé depuis les settings du super admin:", priceFromAdmin, "GNF");
        } else {
          console.error("❌ Prix de la carte supplémentaire invalide (<= 0):", priceFromAdmin);
          throw new Error(`Prix invalide reçu depuis l'API: ${priceFromAdmin}`);
        }
      } else {
        console.error("❌ Prix non trouvé dans la réponse de l'API", {
          pricing: pricing,
          hasAdditionalCardPrice: pricing?.additional_card_price !== undefined,
        });
        throw new Error("Prix non trouvé dans la réponse de l'API");
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement du prix depuis les settings du super admin:", error);
      // Ne pas utiliser de valeur par défaut codée en dur
      // Afficher un message d'erreur à l'utilisateur
      addCardsError.value = "Impossible de charger le prix des cartes supplémentaires depuis les paramètres du super admin. Veuillez réessayer ou contacter le support.";
      additionalCardPrice.value = null;
    }
  };

  // ✅ NOUVEAU: Fonction de polling pour vérifier le statut du paiement
  const startPaymentPolling = (orderId, additionalPaymentId = null) => {
    // Arrêter le polling précédent s'il existe
    if (paymentPollingInterval.value) {
      clearInterval(paymentPollingInterval.value);
      paymentPollingInterval.value = null;
    }
    
    // ✅ NOUVEAU: Limite de temps pour le polling (5 minutes = 300000ms)
    const POLLING_MAX_DURATION = 5 * 60 * 1000; // 5 minutes
    const pollingStartTime = Date.now();
    let pollingAttempts = 0;
    const MAX_ATTEMPTS = 100; // Maximum 100 tentatives (environ 5 minutes à 3 secondes par tentative)
    
    console.log('[Payment Polling] 🚀 Démarrage du polling pour vérifier le paiement...', { 
      orderId, 
      additionalPaymentId,
      timestamp: new Date().toISOString(),
      maxDuration: POLLING_MAX_DURATION / 1000 + ' secondes'
    });
    
    // ✅ Vérification immédiate au démarrage (pas besoin d'attendre 3 secondes)
    // Cela permet de détecter rapidement si le paiement est déjà validé
    const checkImmediately = async () => {
      try {
        let response = null;
        if (additionalPaymentId) {
          response = await apiClient.get(`/api/additional-payments/${additionalPaymentId}/check-status`);
          if (response.data.status === 'paid' || response.data.payment_status === 'paid') {
            console.log('[Payment Polling] ✅ Paiement déjà confirmé au démarrage (paiement supplémentaire)');
            if (paymentPollingInterval.value) {
              clearInterval(paymentPollingInterval.value);
              paymentPollingInterval.value = null;
            }
            await loadOrders();
            // Logique de succès pour paiement supplémentaire (sera gérée dans le polling normal)
            return;
          }
        } else {
          response = await apiClient.get(`/api/orders/${orderId}/status`);
          const status = response.data?.status;
          const isPaidFlag = response.data?.is_paid;
          const paymentStatus = response.data?.payment_status;
          if (isPaidFlag === true || status === 'validated' || 
              status === 'paid' || paymentStatus === 'paid') {
            console.log('[Payment Polling] ✅ Paiement déjà confirmé au démarrage (commande principale)');
            if (paymentPollingInterval.value) {
              clearInterval(paymentPollingInterval.value);
              paymentPollingInterval.value = null;
            }
            await loadOrders();
            showValidateModal.value = true;
            currentPollingOrderId.value = null;
            currentPollingAdditionalPaymentId.value = null;
            return;
          }
        }
        console.log('[Payment Polling] ⏳ Paiement pas encore confirmé, démarrage du polling périodique...');
      } catch (error) {
        console.error('[Payment Polling] Erreur lors de la vérification initiale:', error);
        // Continuer avec le polling périodique
      }
    };
    
    // Exécuter la vérification immédiate
    checkImmediately();
    
    // ✅ CORRECTION: Vérifier le statut toutes les 3 secondes (3000ms) comme demandé
    paymentPollingInterval.value = setInterval(async () => {
      try {
        pollingAttempts++;
        const elapsedTime = Date.now() - pollingStartTime;
        
        // ✅ Vérifier si on a dépassé la limite de temps ou le nombre de tentatives
        if (elapsedTime > POLLING_MAX_DURATION || pollingAttempts > MAX_ATTEMPTS) {
          console.warn('[Payment Polling] ⏰ Limite de temps atteinte, arrêt du polling', {
            elapsedTime: Math.round(elapsedTime / 1000) + ' secondes',
            attempts: pollingAttempts,
            maxDuration: POLLING_MAX_DURATION / 1000 + ' secondes',
            maxAttempts: MAX_ATTEMPTS
          });
          
          // Arrêter le polling
          if (paymentPollingInterval.value) {
            clearInterval(paymentPollingInterval.value);
            paymentPollingInterval.value = null;
          }
          
          // Réinitialiser les variables
          currentPollingOrderId.value = null;
          currentPollingAdditionalPaymentId.value = null;
          
          // Afficher un message à l'utilisateur
          alert('Le paiement prend plus de temps que prévu. Veuillez rafraîchir la page pour vérifier le statut de votre commande.');
          
          return;
        }
        
        console.log('[Payment Polling] Vérification du statut...', { 
          orderId, 
          additionalPaymentId,
          timestamp: new Date().toISOString(),
          attempt: pollingAttempts,
          elapsedTime: Math.round(elapsedTime / 1000) + ' secondes'
        });
        
        let isPaid = false;
        let response = null;
        
        if (additionalPaymentId) {
          // Vérifier le statut du paiement supplémentaire
          response = await apiClient.get(`/api/additional-payments/${additionalPaymentId}/check-status`);
          console.log('[Payment Polling] Réponse paiement supplémentaire:', response.data);
          if (response.data.status === 'paid' || response.data.payment_status === 'paid') {
            isPaid = true;
          } else {
            // ✅ MODE DÉVELOPPEMENT: Si le paiement supplémentaire est en attente depuis plus de 30 secondes,
            // appeler automatiquement le webhook simulé pour forcer la validation
            if (import.meta.env.DEV && elapsedTime > 30000 && response.data.status !== 'paid') {
              console.log('[Payment Polling] 🔧 Mode développement: Paiement supplémentaire en attente depuis plus de 30s, appel du webhook simulé...');
              try {
                const simulateResponse = await apiClient.post(`/api/payment/simulate-webhook/${orderId}`, {
                  additional_payment_id: additionalPaymentId
                });
                if (simulateResponse.data.success) {
                  console.log('[Payment Polling] ✅ Webhook simulé (cartes supplémentaires) appelé avec succès, rechargement des données...');
                  // Recharger les commandes pour avoir le statut à jour
                  await loadOrders();
                  // La prochaine itération du polling devrait détecter le statut "paid"
                  return;
                } else {
                  console.warn('[Payment Polling] ⚠️ Webhook simulé retourné mais success=false:', simulateResponse.data);
                }
              } catch (simulateError) {
                console.error('[Payment Polling] ❌ Erreur lors de l\'appel du webhook simulé (cartes supplémentaires):', simulateError);
                // Continuer le polling normalement même en cas d'erreur
              }
            }
          }
        } else {
          // ✅ OPTIMISATION: Utiliser l'endpoint léger /status pour le polling
          response = await apiClient.get(`/api/orders/${orderId}/status`);
          console.log('[Payment Polling] Réponse statut commande complète:', JSON.stringify(response.data, null, 2));
          
          // Vérifier plusieurs conditions pour détecter le paiement réussi
          const status = response.data?.status;
          const isPaidFlag = response.data?.is_paid;
          const paymentStatus = response.data?.payment_status;
          
          console.log('[Payment Polling] Analyse du statut:', {
            status,
            isPaidFlag,
            paymentStatus,
            statusIsValidated: status === 'validated',
            statusIsPaid: status === 'paid',
            paymentStatusIsPaid: paymentStatus === 'paid',
            isPaidFlagTrue: isPaidFlag === true
          });
          
          if (
            isPaidFlag === true ||
            status === 'validated' ||
            status === 'paid' ||
            paymentStatus === 'paid'
          ) {
            isPaid = true;
            console.log('[Payment Polling] ✅ Paiement détecté comme réussi!', {
              status,
              isPaidFlag,
              paymentStatus,
              fullResponse: response.data
            });
          } else {
            console.log('[Payment Polling] ⏳ Paiement pas encore confirmé. Statut actuel:', {
              status,
              isPaidFlag,
              paymentStatus
            });
            
            // ✅ NOTE: La validation automatique se fait maintenant côté backend dans getOrderStatus
            // Plus besoin d'attendre 30 secondes, la validation est immédiate en localhost
            // Cette logique est conservée comme fallback au cas où la validation automatique échouerait
            if (import.meta.env.DEV && elapsedTime > 10000 && status === 'configured' && !additionalPaymentId) {
              console.log('[Payment Polling] 🔧 Mode développement: Paiement en attente depuis plus de 10s, appel du webhook simulé (fallback)...');
              try {
                const simulateResponse = await apiClient.post(`/api/payment/simulate-webhook/${orderId}`, {});
                if (simulateResponse.data.success) {
                  console.log('[Payment Polling] ✅ Webhook simulé appelé avec succès, rechargement des données...');
                  // Recharger les commandes pour avoir le statut à jour
                  await loadOrders();
                  // La prochaine itération du polling devrait détecter le statut "validated"
                  return;
                } else {
                  console.warn('[Payment Polling] ⚠️ Webhook simulé retourné mais success=false:', simulateResponse.data);
                }
              } catch (simulateError) {
                console.error('[Payment Polling] ❌ Erreur lors de l\'appel du webhook simulé:', simulateError);
                // Continuer le polling normalement même en cas d'erreur
              }
            }
          }
        }
        
        if (isPaid) {
          console.log('[Payment Polling] ✅ Paiement confirmé! Arrêt du polling et mise à jour de l\'UI...');
          
          // Arrêter le polling IMMÉDIATEMENT
          if (paymentPollingInterval.value) {
            clearInterval(paymentPollingInterval.value);
            paymentPollingInterval.value = null;
            console.log('[Payment Polling] ✅ Polling arrêté');
          }
          
          // ✅ Le polling s'arrête et on passe directement à la mise à jour
          
          // ✅ CRITIQUE: Sauvegarder les données du paiement avant de les réinitialiser
          let savedPaymentData = null;
          if (additionalPaymentId && pendingAdditionalPayment.value) {
            savedPaymentData = {
              quantity: pendingAdditionalPayment.value.quantity,
              total_price: pendingAdditionalPayment.value.total_price,
            };
          }
          
          // ✅ CRITIQUE: Fermer le modal d'ajout de cartes et les détails de paiement
          if (additionalPaymentId) {
            console.log('[Payment Polling] Fermeture du modal d\'ajout de cartes...');
            showAddCardsModal.value = false;
            showPaymentDetails.value = false;
            pendingAdditionalPayment.value = null;
            selectedOrder.value = null;
            additionalCardsQuantity.value = 1;
            additionalCardPrice.value = null;
            addCardsError.value = "";
          }
          
          // Recharger les commandes pour avoir les données à jour
          console.log('[Payment Polling] Rechargement des commandes...');
          await loadOrders();
          
          // Afficher le modal de félicitations
          if (additionalPaymentId) {
            // Trouver les données du paiement supplémentaire
            const order = orders.value.find(o => o.id === orderId);
            if (order && order.paid_additional_payments) {
              const payment = order.paid_additional_payments.find(p => p.id === additionalPaymentId);
              if (payment) {
                additionalCardsSuccessData.value = {
                  quantity: payment.quantity,
                  total_price: payment.total_price,
                  order_number: order.order_number,
                };
              } else {
                // Fallback: utiliser les données sauvegardées si disponibles
                console.warn('[Payment Polling] Paiement supplémentaire non trouvé, utilisation des données sauvegardées');
                if (savedPaymentData) {
                  additionalCardsSuccessData.value = {
                    quantity: savedPaymentData.quantity,
                    total_price: savedPaymentData.total_price,
                    order_number: order?.order_number || 'N/A',
                  };
                } else {
                  // Données minimales si rien n'est trouvé
                  additionalCardsSuccessData.value = {
                    quantity: 1,
                    total_price: 0,
                    order_number: order?.order_number || 'N/A',
                  };
                }
              }
              // Toujours afficher le modal de félicitations
              showAdditionalCardsSuccessModal.value = true;
              console.log('[Payment Polling] ✅ Modal de félicitations (cartes supplémentaires) affiché');
            } else {
              // Fallback: afficher quand même le modal avec des données sauvegardées ou minimales
              console.warn('[Payment Polling] Commande non trouvée, affichage du modal avec données sauvegardées');
              additionalCardsSuccessData.value = {
                quantity: savedPaymentData?.quantity || 1,
                total_price: savedPaymentData?.total_price || 0,
                order_number: 'N/A',
              };
              showAdditionalCardsSuccessModal.value = true;
            }
          } else {
            // ✅ COMMANDE PRINCIPALE: Afficher le modal de félicitations
            console.log('[Payment Polling] Affichage du modal de félicitations pour la commande principale...');
            showValidateModal.value = true;
            console.log('[Payment Polling] ✅ Modal de félicitations (commande principale) affiché. showValidateModal =', showValidateModal.value);
          }
          
          // Réinitialiser les variables de polling
          currentPollingOrderId.value = null;
          currentPollingAdditionalPaymentId.value = null;
        } else {
          console.log('[Payment Polling] Paiement pas encore confirmé, nouvelle vérification dans 3 secondes...');
        }
      } catch (error) {
        console.error('[Payment Polling] ❌ Erreur lors de la vérification du statut du paiement:', error);
        console.error('[Payment Polling] Détails de l\'erreur:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          orderId,
          additionalPaymentId
        });
        // Continuer le polling même en cas d'erreur (réseau temporaire, etc.)
        // Le polling continuera à la prochaine itération (dans 3 secondes)
      }
    }, 3000); // ✅ CORRECTION: Vérifier toutes les 3 secondes (3000ms) comme demandé
  };
  
  // ✅ NOUVEAU: Arrêter le polling
  const stopPaymentPolling = () => {
    if (paymentPollingInterval.value) {
      clearInterval(paymentPollingInterval.value);
      paymentPollingInterval.value = null;
    }
    currentPollingOrderId.value = null;
    currentPollingAdditionalPaymentId.value = null;
  };

  // ✅ NOUVEAU: Gérer le paiement des cartes supplémentaires
  const handlePayment = () => {
    if (pendingAdditionalPayment.value && pendingAdditionalPayment.value.payment_url) {
      // Ouvrir le paiement dans un nouvel onglet
      console.log('Ouverture du paiement des cartes supplémentaires dans un nouvel onglet:', pendingAdditionalPayment.value.payment_url);
      window.open(pendingAdditionalPayment.value.payment_url, '_blank');
      
      // Démarrer le polling en arrière-plan (sans modal d'attente)
      currentPollingOrderId.value = pendingAdditionalPayment.value.order_id;
      currentPollingAdditionalPaymentId.value = pendingAdditionalPayment.value.id;
      startPaymentPolling(pendingAdditionalPayment.value.order_id, pendingAdditionalPayment.value.id);
    }
  };

  // ✅ NOUVEAU: Annuler le paiement
  const cancelPayment = () => {
    showPaymentDetails.value = false;
    pendingAdditionalPayment.value = null;
    closeAddCardsModal();
  };

  // Fermer le modal pour ajouter des cartes
  const closeAddCardsModal = () => {
    showAddCardsModal.value = false;
    selectedOrder.value = null;
    additionalCardsQuantity.value = 1;
    additionalCardPrice.value = null; // Réinitialiser le prix pour forcer le rechargement à la prochaine ouverture
    addCardsError.value = "";
    showPaymentDetails.value = false; // ✅ Réinitialiser aussi les détails du paiement
    pendingAdditionalPayment.value = null; // ✅ Réinitialiser le paiement en attente
    isBusinessOrder.value = false;
    businessAdminInOrder.value = false;
    businessAdminName.value = "";
    businessAdminCurrentCards.value = 0;
    orderEmployees.value = [];
    businessDistribution.value = {
      admin: 0,
      employees: {},
    };
  };
  
  // Calculer le total de la distribution pour les commandes business
  const businessDistributionTotal = computed(() => {
    const adminTotal = Number(businessDistribution.value.admin) || 0;
    
    // Calculer le total des employés : utiliser orderEmployees pour s'assurer qu'on inclut tous les employés
    let employeesTotal = 0;
    if (orderEmployees.value && orderEmployees.value.length > 0) {
      orderEmployees.value.forEach(employee => {
        const empId = employee.employee_id || employee.id;
        const empQuantity = businessDistribution.value.employees && businessDistribution.value.employees[empId] !== undefined
          ? Number(businessDistribution.value.employees[empId]) || 0
          : 0;
        employeesTotal += empQuantity;
      });
    } else {
      // Fallback : utiliser les valeurs dans businessDistribution.value.employees
      employeesTotal = Object.values(businessDistribution.value.employees || {}).reduce((sum, qty) => {
        const numQty = Number(qty) || 0;
        return sum + numQty;
      }, 0);
    }
    
    const total = adminTotal + employeesTotal;
    
    // Log pour debug
    console.log("OrdersView: businessDistributionTotal computed", {
      admin: adminTotal,
      employeesTotal: employeesTotal,
      employees: businessDistribution.value.employees,
      orderEmployees_count: orderEmployees.value?.length || 0,
      total: total,
      additionalCardsQuantity: additionalCardsQuantity.value
    });
    
    return total;
  });
  
  // Mettre à jour la distribution quand la quantité totale change
  const updateBusinessDistribution = () => {
    // S'assurer que la distribution ne dépasse pas la quantité totale
    const currentTotal = businessDistributionTotal.value;
    if (currentTotal > additionalCardsQuantity.value) {
      // Réduire proportionnellement si nécessaire
      const ratio = additionalCardsQuantity.value / currentTotal;
      businessDistribution.value.admin = Math.floor((businessDistribution.value.admin || 0) * ratio);
      Object.keys(businessDistribution.value.employees).forEach(empId => {
        businessDistribution.value.employees[empId] = Math.floor((businessDistribution.value.employees[empId] || 0) * ratio);
      });
    }
  };

  // Confirmer l'ajout de cartes supplémentaires
  const confirmAddCards = async () => {
    if (!selectedOrder.value || !additionalCardsQuantity.value || additionalCardsQuantity.value < 1) {
      return;
    }

    // Pour les commandes business, vérifier que la distribution correspond
    if (isBusinessOrder.value) {
      if (businessDistributionTotal.value === 0) {
        addCardsError.value = "Veuillez répartir les cartes entre vous-même et vos employés.";
        return;
      }
      if (businessDistributionTotal.value !== additionalCardsQuantity.value) {
        addCardsError.value = `La distribution (${businessDistributionTotal.value}) doit correspondre au total (${additionalCardsQuantity.value}).`;
        return;
      }
    }

    isAddingCards.value = true;
    addCardsError.value = "";

    try {
      // Définir le header CSRF
      const csrfToken = Cookies.get("XSRF-TOKEN");
      if (csrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
      }

      // Préparer le payload
      const payload = {
        quantity: additionalCardsQuantity.value,
      };

      // Pour les commandes business, ajouter la distribution
      if (isBusinessOrder.value) {
        // Convertir et nettoyer la valeur de l'admin (0 si vide/null/undefined)
        const cleanedAdmin = Math.max(0, Number(businessDistribution.value.admin) || 0);
        const cleanedEmployees = {};
        
        // IMPORTANT : Inclure TOUS les employés avec leur valeur (même 0)
        // Cela permet au backend de savoir exactement combien de cartes attribuer à chaque employé
        if (orderEmployees.value && orderEmployees.value.length > 0) {
          orderEmployees.value.forEach(employee => {
            const empId = employee.employee_id || employee.id;
            // Récupérer la valeur depuis businessDistribution, ou 0 si non définie ou si l'employé n'est pas dans la distribution
            const empQuantity = businessDistribution.value.employees && businessDistribution.value.employees[empId] !== undefined
              ? Number(businessDistribution.value.employees[empId]) || 0
              : 0;
            // Inclure même si c'est 0, pour que le backend sache que cet employé ne doit pas recevoir de cartes
            cleanedEmployees[empId] = Math.max(0, empQuantity);
          });
        }

        console.log("OrdersView: confirmAddCards - Distribution complète avant envoi", {
          orderId: selectedOrder.value.id,
          quantity: additionalCardsQuantity.value,
          businessDistributionTotal: businessDistributionTotal.value,
          admin_original: businessDistribution.value.admin,
          admin_cleaned: cleanedAdmin,
          employees_original: businessDistribution.value.employees,
          employees_cleaned: cleanedEmployees,
          total_cleaned: cleanedAdmin + Object.values(cleanedEmployees).reduce((sum, qty) => sum + qty, 0),
          orderEmployees_count: orderEmployees.value?.length || 0,
        });

        payload.distribution = {
          admin: cleanedAdmin,
          employees: cleanedEmployees,
        };
      }

      console.log("OrdersView: confirmAddCards - Payload final envoyé au backend", {
        orderId: selectedOrder.value.id,
        payload: payload,
        distribution: payload.distribution,
      });

      const response = await apiClient.post(`/api/orders/${selectedOrder.value.id}/add-cards`, payload);
      
      console.log("OrdersView: confirmAddCards - Réponse du backend", {
        orderId: selectedOrder.value.id,
        response: response.data,
        requires_payment: response.data.requires_payment,
        additional_payment: response.data.additional_payment,
      });

      // ✅ NOUVEAU: Si un paiement est requis, afficher les détails au lieu de fermer le modal
      if (response.data.requires_payment && response.data.additional_payment) {
        // Stocker les détails du paiement
        pendingAdditionalPayment.value = response.data.additional_payment;
        showPaymentDetails.value = true;
        // Attendre que le DOM soit mis à jour, puis scroller vers le bouton de paiement
        await nextTick();
        setTimeout(() => {
          const paymentButton = document.querySelector('[data-payment-button="additional-cards"]');
          if (paymentButton) {
            paymentButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        // Ne pas fermer le modal, afficher les détails du paiement
        return;
      }

      // Ancien comportement si pas de paiement requis (ne devrait plus arriver)
      // Mettre à jour la commande dans la liste avec les nouvelles données
      const index = orders.value.findIndex((o) => o.id === selectedOrder.value.id);
      if (index !== -1) {
        // Fusionner les données existantes avec les nouvelles données pour préserver les relations
        orders.value[index] = { 
          ...orders.value[index], 
          ...response.data.order,
          // S'assurer que order_employees est bien mis à jour
          order_employees: response.data.order.order_employees || orders.value[index].order_employees,
        };
      }

      // Déclencher un événement pour notifier les autres composants (comme AdminOrderList)
      window.dispatchEvent(new CustomEvent('order-updated', { 
        detail: { 
          orderId: selectedOrder.value.id,
          order: response.data.order 
        } 
      }));

      // Fermer le modal et recharger les commandes pour avoir les données complètes
      closeAddCardsModal();
      await loadOrders();
    } catch (error) {
      console.error("Erreur lors de l'ajout de cartes:", error);
      addCardsError.value = error.response?.data?.message || "Erreur lors de l'ajout de cartes. Veuillez réessayer.";
    } finally {
      isAddingCards.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // ✅ Écouteur pour rafraîchir quand la page devient visible
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      loadOrders();
    }
  };

  // ✅ Écouteur pour rafraîchir quand une nouvelle commande est créée
  const handleOrderCreated = () => {
    // Recharger les commandes pour afficher la nouvelle commande
    loadOrders();
  };
  
  // ✅ Écouteur pour rafraîchir quand une commande est mise à jour (depuis un autre onglet/instance)
  const handleOrderUpdated = async (event) => {
    const { orderId } = event.detail || {};
    if (orderId) {
      console.log("Événement order-updated reçu dans OrdersView pour la commande", orderId);
      // Recharger les commandes pour afficher les mises à jour
      await loadOrders();
    }
  };
  
  // Gestionnaire d'événement pour la mise à jour des prix
  const handlePricingUpdate = async (event) => {
    console.log("Événement pricing-updated reçu dans OrdersView, rechargement des prix...", event.detail);
    // Recharger les prix depuis l'API
    await loadPricing();
    // Utiliser nextTick pour s'assurer que le re-render se fait après la mise à jour des prix
    await nextTick();
    // Les prix seront automatiquement utilisés lors du prochain rendu grâce à getCorrectTotalPrice
    // et la clé de version forcera le re-render des cartes de commandes
  };

  // ✅ CRITIQUE: Fonction globale pour gérer le retour de paiement
  // Cette fonction peut être appelée depuis onMounted ou depuis le watch
  const handlePaymentReturn = async () => {
    const paymentSuccess = route.query.payment === 'success';
    const orderIdFromQuery = route.query.order_id;
    const additionalPaymentIdFromQuery = route.query.additional_payment_id;
    
    if (!paymentSuccess || (!orderIdFromQuery && !additionalPaymentIdFromQuery)) {
      return; // Pas un retour de paiement
    }
    
    console.log("OrdersView: handlePaymentReturn appelé", {
      payment: route.query.payment,
      order_id: orderIdFromQuery,
      additional_payment_id: additionalPaymentIdFromQuery
    });
    
    // Attendre que les commandes soient chargées
    if (orders.value.length === 0) {
      console.log("OrdersView: Commandes pas encore chargées, attente...");
      await loadOrders();
      await nextTick();
    }
    
    // Gérer les paiements supplémentaires
    if (additionalPaymentIdFromQuery) {
      console.log("OrdersView: Vérification du paiement supplémentaire...");
      
      // ✅ OPTIMISATION: Récupérer le cookie CSRF une seule fois au début
      try {
        await apiClient.get("/sanctum/csrf-cookie");
        await new Promise(resolve => setTimeout(resolve, 100)); // Réduit de 200ms à 100ms
        const csrfToken = Cookies.get("XSRF-TOKEN");
        if (csrfToken) {
          apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
        }
      } catch (csrfError) {
        console.warn("OrdersView: Erreur lors de la récupération du cookie CSRF:", csrfError);
      }
      
      const checkAndShowAdditionalCardsSuccessModal = async (retryCount = 0, maxRetries = 5) => { // ✅ Réduit de 10 à 5 tentatives
        console.log(`OrdersView: Vérification du statut du paiement supplémentaire (tentative ${retryCount + 1}/${maxRetries + 1})`);
        
        isLoading.value = true;
        
        try {
          let checkResponse;
          try {
            checkResponse = await apiClient.get(`/api/additional-payments/${additionalPaymentIdFromQuery}/check-status-public`);
            console.log("OrdersView: Statut du paiement supplémentaire vérifié via API publique", checkResponse.data);
          } catch (publicError) {
            if (publicError.response && publicError.response.status === 404) {
              console.error("OrdersView: Paiement supplémentaire non trouvé (404)");
              isLoading.value = false;
              router.replace({ name: 'Orders', query: {} });
              return false;
            }
            
            console.warn("OrdersView: Route publique échouée, tentative avec route authentifiée...", publicError);
            try {
              checkResponse = await apiClient.get(`/api/additional-payments/${additionalPaymentIdFromQuery}/check-status`);
              console.log("OrdersView: Statut du paiement supplémentaire vérifié via API authentifiée", checkResponse.data);
            } catch (authError) {
              console.error("OrdersView: Les deux routes ont échoué", { publicError, authError });
              throw publicError;
            }
          }
          
          if (checkResponse.data.status === 'paid') {
            console.log("OrdersView: Paiement supplémentaire confirmé, chargement des commandes...");
            isLoading.value = false;
            
            try {
              const currentUser = await fetchUser();
              if (currentUser) {
                await loadOrders();
              }
            } catch (loadError) {
              console.warn("OrdersView: Erreur lors du chargement des commandes, mais le paiement est confirmé", loadError);
            }
            
            await nextTick();
            
            additionalCardsSuccessData.value = {
              quantity: checkResponse.data.quantity,
              total_price: checkResponse.data.total_price,
              order_number: checkResponse.data.order_number,
            };
            
            showAdditionalCardsSuccessModal.value = true;
            await nextTick();
            router.replace({ name: 'Orders', query: {} });
            isLoading.value = false;
            return true;
          } else if (checkResponse.data.status === 'pending') {
            if (retryCount < maxRetries) {
              // ✅ OPTIMISATION: Réduire le délai de 2000ms à 800ms pour une réponse plus rapide
              setTimeout(() => {
                checkAndShowAdditionalCardsSuccessModal(retryCount + 1, maxRetries);
              }, 800); // Réduit de 2000ms à 800ms
              return false;
            }
          }
        } catch (error) {
          console.error("OrdersView: Erreur lors de la vérification du paiement supplémentaire", error);
          if (retryCount < maxRetries) {
            // ✅ OPTIMISATION: Réduire le délai de 2000ms à 800ms
            setTimeout(() => {
              checkAndShowAdditionalCardsSuccessModal(retryCount + 1, maxRetries);
            }, 800); // Réduit de 2000ms à 800ms
          } else {
            isLoading.value = false;
            router.replace({ name: 'Orders', query: {} });
          }
          return false;
        }
      };
      
      await checkAndShowAdditionalCardsSuccessModal();
    } 
    // Gérer les paiements normaux
    else if (orderIdFromQuery) {
      console.log("OrdersView: Vérification du paiement normal...");
      
      if (!user.value) {
        console.warn("OrdersView: Utilisateur non connecté, tentative de récupération...");
        const retryUser = await fetchUser();
        if (!retryUser) {
          console.error("OrdersView: Impossible de récupérer la session");
          return;
        }
      }
      
      // ✅ OPTIMISATION: Récupérer le cookie CSRF une seule fois au début
      try {
        await apiClient.get("/sanctum/csrf-cookie");
        await new Promise(resolve => setTimeout(resolve, 100)); // Réduit de 200ms à 100ms
        const csrfToken = Cookies.get("XSRF-TOKEN");
        if (csrfToken) {
          apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
        }
      } catch (csrfError) {
        console.warn("OrdersView: Erreur lors de la récupération du cookie CSRF:", csrfError);
      }
      
      const checkAndShowSuccessModal = async (retryCount = 0, maxRetries = 5) => { // ✅ Réduit de 10 à 5 tentatives
        console.log(`OrdersView: Vérification du statut de la commande (tentative ${retryCount + 1}/${maxRetries + 1})`);
        
        try {
          const checkResponse = await apiClient.get(`/api/orders/${orderIdFromQuery}/check-payment`);
          console.log("OrdersView: Statut de paiement vérifié via API", checkResponse.data);
          
          if (checkResponse.data.status === 'validated') {
            await loadOrders();
            await nextTick();
            
            const targetOrder = orders.value.find(o => 
              o.id === parseInt(orderIdFromQuery) || 
              String(o.id) === String(orderIdFromQuery) ||
              o.order_number === orderIdFromQuery
            );
            
            if (targetOrder && targetOrder.status === 'validated') {
              console.log("OrdersView: Commande validée trouvée, affichage du modal de succès");
              showValidateModal.value = true;
              router.replace({ name: 'Orders', query: {} });
              return true;
            }
          } else if (checkResponse.data.status === 'pending') {
            if (retryCount < maxRetries) {
              // ✅ OPTIMISATION: Réduire le délai de 2000ms à 800ms pour une réponse plus rapide
              setTimeout(() => {
                checkAndShowSuccessModal(retryCount + 1, maxRetries);
              }, 800); // Réduit de 2000ms à 800ms
              return false;
            }
          }
        } catch (error) {
          console.error("OrdersView: Erreur lors de la vérification du statut de paiement", error);
          if (retryCount < maxRetries) {
            // ✅ OPTIMISATION: Réduire le délai de 2000ms à 800ms
            setTimeout(() => {
              checkAndShowSuccessModal(retryCount + 1, maxRetries);
            }, 800); // Réduit de 2000ms à 800ms
          }
          return false;
        }
      };
      
      await checkAndShowSuccessModal();
    }
  };

  // Charger les commandes au montage du composant
  onMounted(async () => {
    try {
      console.log("OrdersView: Composant monté, vérification de la session...");
      
      // ✅ CRITIQUE: Ne JAMAIS appeler loadOrders() si l'utilisateur n'est pas disponible
      // Si l'utilisateur est déjà là (navigation interne), on charge direct
      if (user.value) {
        console.log("OrdersView: Utilisateur déjà disponible, chargement immédiat des commandes", {
          user_id: user.value.id,
          email: user.value.email
        });
        
        // ✅ CORRECTION: Réinitialiser le compteur de réessais au montage du composant
        loadRetryCount.value = 0;
        isRetryingLoad.value = false;
        
        // Si retour de paiement, forcer un refresh réseau (pas de cache)
        const isPaymentReturn = route.query.payment === 'success' && (route.query.order_id || route.query.additional_payment_id);
        await loadOrders({ preferCache: !isPaymentReturn, backgroundRefresh: true });
        console.log("OrdersView: Commandes chargées après montage");
        
        // ✅ CRITIQUE: Déclencher la vérification du retour de paiement maintenant que tout est prêt
        await nextTick();
        await handlePaymentReturn();
        return;
      }
      
      // Sinon (rechargement de page), on attend que le AuthStore fasse son travail
      // Le watch ci-dessous s'en chargera quand l'utilisateur sera disponible
      console.log("OrdersView: Utilisateur non disponible, attente de l'initialisation de l'authentification...");
      
      // ✅ Détecter si c'est un retour de paiement
      const isPaymentReturn = route.query.payment === 'success' && (route.query.order_id || route.query.additional_payment_id);
      
      // ✅ Si c'est un retour de paiement, forcer la synchronisation de l'état utilisateur
      if (isPaymentReturn) {
        console.log("OrdersView: Retour de paiement détecté, synchronisation de l'état utilisateur...");
        try {
          // ✅ FORCER un appel à fetchUser() pour mettre à jour l'état utilisateur
          await fetchUser();
          
          // ✅ Vérifier explicitement si l'utilisateur est connecté
          if (user.value) {
            console.log("OrdersView: Utilisateur connecté après retour de paiement", {
              user_id: user.value.id,
              email: user.value.email
            });
            
            // ✅ CORRECTION: Réinitialiser le compteur de réessais au montage du composant
            loadRetryCount.value = 0;
            isRetryingLoad.value = false;
            
            // ✅ Lancer le chargement des commandes maintenant que l'utilisateur est confirmé connecté
            console.log("OrdersView: Chargement des commandes...");
            await loadOrders({ preferCache: false, backgroundRefresh: false });
            console.log("OrdersView: Commandes chargées après montage");
            
            // ✅ CRITIQUE: Déclencher la vérification du retour de paiement maintenant que tout est prêt
            await nextTick();
            await handlePaymentReturn();
            return; // Sortir de la fonction, tout est prêt
          } else {
            console.warn("OrdersView: Utilisateur non trouvé après fetchUser(), le watch s'en chargera...");
            // Le watch s'en chargera quand l'utilisateur sera disponible
          }
        } catch (syncError) {
          console.warn("OrdersView: Erreur lors de la synchronisation de l'état utilisateur", syncError);
          // Le watch s'en chargera quand l'utilisateur sera disponible
        }
      }
      
      // ✅ CRITIQUE: Ne PAS appeler loadOrders() ici si l'utilisateur n'est pas disponible
      // Le watch ci-dessous s'en chargera quand l'utilisateur sera disponible
      // La vérification du retour de paiement sera gérée par handlePaymentReturn() dans le watch
    } catch (error) {
      console.error("OrdersView: Erreur critique lors du montage:", error);
      loadingError.value = "Erreur lors de l'initialisation. Veuillez rafraîchir la page.";
    }
    
    // Écouter les changements de visibilité de la page
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // Écouter l'événement de création de commande
    window.addEventListener("order-created", handleOrderCreated);
    // Écouter l'événement de mise à jour de commande
    window.addEventListener("order-updated", handleOrderUpdated);
    // Écouter l'événement de mise à jour des prix
    window.addEventListener("pricing-updated", handlePricingUpdate);
    
    console.log("OrdersView: Tous les écouteurs d'événements sont configurés");
  });

  // ✅ Surveiller l'arrivée de l'utilisateur
  // Lance loadOrders() uniquement quand l'utilisateur devient disponible
  watch(() => user.value, async (newUser) => {
    if (newUser) {
      console.log("OrdersView: Utilisateur disponible détecté par watch, chargement des commandes...", {
        user_id: newUser.id,
        email: newUser.email
      });
      
      // ✅ CORRECTION: Réinitialiser le compteur de réessais
      loadRetryCount.value = 0;
      isRetryingLoad.value = false;
      
      // Charger les commandes maintenant que l'utilisateur est disponible
      try {
        const isPaymentReturn = route.query.payment === 'success' && (route.query.order_id || route.query.additional_payment_id);
        await loadOrders({ preferCache: !isPaymentReturn, backgroundRefresh: true });
        console.log("OrdersView: Commandes chargées après détection de l'utilisateur");
        
        // ✅ CRITIQUE: Gérer la logique de retour de paiement après le chargement des commandes
        if (isPaymentReturn) {
          console.log("OrdersView: Retour de paiement détecté dans watch, déclenchement de la vérification...");
          // Utiliser la fonction globale pour gérer le retour de paiement
          await nextTick();
          await handlePaymentReturn();
        }
      } catch (error) {
        console.error("OrdersView: Erreur lors du chargement des commandes après détection de l'utilisateur", error);
      }
    }
  });

  // ✅ Recharger quand le composant devient actif (utile avec keep-alive ou navigation)
  // MAIS seulement si l'utilisateur est disponible
  onActivated(() => {
    if (user.value) {
      loadOrders({ preferCache: true, backgroundRefresh: true });
    } else {
      console.log("OrdersView: onActivated appelé mais utilisateur non disponible, attente du watch...");
    }
  });

  // Nettoyer les écouteurs d'événements et le polling
  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("order-created", handleOrderCreated);
    window.removeEventListener("order-updated", handleOrderUpdated);
    window.removeEventListener("pricing-updated", handlePricingUpdate);
    // ✅ NOUVEAU: Arrêter le polling si actif
    stopPaymentPolling();
  });
</script>
