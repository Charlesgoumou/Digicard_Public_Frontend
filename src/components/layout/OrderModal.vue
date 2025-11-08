<template>
  <transition name="modal-fade">
    <div
      v-if="isOrderModalOpen"
      @click.self="closeOrderModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
    >
      <div
        class="relative w-full max-w-2xl max-h-[90vh] bg-slate-800/50 rounded-xl border border-slate-700 mx-2 flex flex-col"
      >
        <!-- Indicateur de chargement circulaire pendant l'enregistrement -->
        <div
          v-if="isSubmitting"
          class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-50"
        >
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          <p class="mt-4 text-white font-medium">Enregistrement de votre commande...</p>
        </div>

        <button
          v-if="view !== 'selection' && view !== 'confirmation'"
          @click="goBack"
          class="absolute top-2 left-2 sm:-top-4 sm:-left-4 h-10 w-10 sm:h-12 sm:w-12 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors flex items-center justify-center border border-slate-700 shadow-lg z-10"
          aria-label="Retour à l'étape précédente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
            shape-rendering="geometricPrecision"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <button
          @click="resetAndClose"
          class="absolute top-2 right-2 sm:-top-4 sm:-right-4 h-10 w-10 sm:h-12 sm:w-12 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors flex items-center justify-center border border-slate-700 shadow-lg z-10"
          aria-label="Fermer la fenêtre de commande"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
            shape-rendering="geometricPrecision"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="overflow-y-auto p-4 sm:p-8">
          <transition name="fade" mode="out-in">
            <!-- ===== ÉCRAN DE SÉLECTION ===== -->
            <div v-if="view === 'selection'" key="selection" class="animate-fade-in">
              <!-- Pour Business Admin : Choisir "Pour Moi" ou "Pour Mon Entreprise" -->
              <div v-if="user && user.role === 'business_admin'">
                <h1 class="text-3xl font-extrabold text-center text-white mb-8">Cette commande est...</h1>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    @click="handleUserTypeSelection('personal')"
                    class="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all text-center"
                  >
                    <span class="text-5xl">👤</span>
                    <p class="mt-4 font-semibold text-lg text-white">Pour Moi</p>
                    <p class="text-xs text-slate-400 mt-1">(Commande personnelle)</p>
                  </button>
                  <button
                    @click="handleUserTypeSelection('business')"
                    class="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all text-center"
                  >
                    <span class="text-5xl">🏢</span>
                    <p class="mt-4 font-semibold text-lg text-white">Pour Mon Entreprise</p>
                    <p class="text-xs text-slate-400 mt-1">(Commande pour le Personnel)</p>
                  </button>
                </div>
              </div>
              <!-- Pour utilisateur non connecté ou particulier -->
              <div v-else>
                <h1 class="text-3xl font-extrabold text-center text-white mb-8">Vous êtes...</h1>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    @click="handleUserTypeSelection('particulier')"
                    class="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all text-center"
                  >
                    <span class="text-5xl">👤</span>
                    <p class="mt-4 font-semibold text-lg text-white">Un Particulier</p>
                  </button>
                  <!-- Cacher l'option Entreprise si l'utilisateur est un particulier connecté -->
                  <button
                    v-if="!user || user.role !== 'individual'"
                    @click="handleUserTypeSelection('entreprise')"
                    class="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all text-center"
                  >
                    <span class="text-5xl">🏢</span>
                    <p class="mt-4 font-semibold text-lg text-white">Une Entreprise</p>
                  </button>
                </div>
              </div>
            </div>

            <!-- ===== ÉCRAN PARTICULIER : Quantité ===== -->
            <div v-else-if="view === 'particulier_quantity'" key="particulier" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">Commande Particulier</h1>
              <div>
                <label for="quantity" class="block text-sm font-medium text-slate-300 mb-2"
                  >Combien de cartes souhaitez-vous ?</label
                >
                <input
                  v-model.number="particulierQuantity"
                  type="number"
                  id="quantity"
                  min="1"
                  class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
              <button
                @click="handleParticulierSubmit"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg"
              >
                Valider ma commande
              </button>
            </div>

            <!-- ===== ÉCRAN ENTREPRISE : Nombre d'employés ===== -->
            <div v-else-if="view === 'entreprise_employees'" key="entreprise" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">Commande Entreprise</h1>
              <div>
                <label for="employees" class="block text-sm font-medium text-slate-300 mb-2"
                  >Combien de personne souhaitez vous équiper ?</label
                >
                <input
                  v-model.number="entrepriseEmployeeCount"
                  type="number"
                  id="employees"
                  min="1"
                  max="100"
                  placeholder="Ex: 5"
                  class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
                <p class="text-xs text-slate-400 mt-2">Maximum 100 Personne par commande</p>
              </div>
              <button
                @click="handleEmployeeCountSubmit"
                :disabled="!entrepriseEmployeeCount || entrepriseEmployeeCount < 1"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>

            <!-- ===== ÉCRAN ENTREPRISE : Souhaitez-vous en acheter pour vous aussi ? ===== -->
            <div v-else-if="view === 'business_include_admin'" key="include-admin" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">Et pour vous ?</h1>
              <p class="text-slate-300 text-center mb-8">Souhaitez-vous en acheter pour vous aussi ?</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  @click="handleIncludeAdminChoice(true)"
                  class="p-6 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all text-center"
                >
                  <span class="text-4xl mb-3 block">✅</span>
                  <p class="font-semibold text-lg text-white">Oui</p>
                  <p class="text-xs text-slate-400 mt-1">Je souhaite des cartes pour moi</p>
                </button>
                <button
                  @click="handleIncludeAdminChoice(false)"
                  class="p-6 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-sky-500 hover:bg-slate-700 transition-all text-center"
                >
                  <span class="text-4xl mb-3 block">❌</span>
                  <p class="font-semibold text-lg text-white">Non</p>
                  <p class="text-xs text-slate-400 mt-1">Uniquement pour mes employés</p>
                </button>
              </div>
            </div>

            <!-- ===== ÉCRAN ENTREPRISE : Nombre de cartes pour une seule personne ===== -->
            <div v-else-if="view === 'business_single_person_quantity'" key="single-person" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">Nombre de Cartes</h1>
              <div>
                <label for="single-quantity" class="block text-sm font-medium text-slate-300 mb-2"
                  >Combien de cartes souhaitez-vous ?</label
                >
                <input
                  v-model.number="singlePersonQuantity"
                  type="number"
                  id="single-quantity"
                  min="1"
                  max="10"
                  class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
              <button
                @click="handleSinglePersonQuantitySubmit"
                :disabled="!singlePersonQuantity || singlePersonQuantity < 1"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Afficher Mon Devis
              </button>
            </div>

            <!-- ===== ÉCRAN ENTREPRISE : Mode de distribution des cartes ===== -->
            <div v-else-if="view === 'business_cards_mode'" key="cards-mode" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">Distribution des Cartes</h1>
              <p class="text-slate-300 text-center mb-6">Comment souhaitez-vous distribuer les cartes ?</p>

              <div class="space-y-4">
                <!-- Option 1 : Uniforme -->
                <label
                  class="block p-6 bg-slate-700/50 rounded-lg border-2 cursor-pointer transition-all hover:border-sky-500"
                  :class="cardsDistributionMode === 'uniform' ? 'border-sky-500 bg-slate-700' : 'border-slate-600'"
                >
                  <div class="flex items-start gap-4">
                    <input
                      type="radio"
                      v-model="cardsDistributionMode"
                      value="uniform"
                      class="mt-1 h-5 w-5 text-sky-500 focus:ring-sky-500"
                    />
                    <div class="flex-1">
                      <p class="text-white font-semibold text-lg">Même nombre pour tous</p>
                      <p class="text-slate-400 text-sm mt-1">Chaque personne recevra le même nombre de cartes</p>

                      <div v-if="cardsDistributionMode === 'uniform'" class="mt-4">
                        <label for="uniform-cards" class="block text-sm text-slate-300 mb-2">
                          Nombre de cartes par personne :
                        </label>
                        <input
                          v-model.number="uniformCardsQuantity"
                          type="number"
                          id="uniform-cards"
                          min="1"
                          max="10"
                          class="w-32 bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </label>

                <!-- Option 2 : Personnalisé -->
                <label
                  class="block p-6 bg-slate-700/50 rounded-lg border-2 cursor-pointer transition-all hover:border-sky-500"
                  :class="cardsDistributionMode === 'custom' ? 'border-sky-500 bg-slate-700' : 'border-slate-600'"
                >
                  <div class="flex items-start gap-4">
                    <input
                      type="radio"
                      v-model="cardsDistributionMode"
                      value="custom"
                      class="mt-1 h-5 w-5 text-sky-500 focus:ring-sky-500"
                    />
                    <div class="flex-1">
                      <p class="text-white font-semibold text-lg">Nombre personnalisé</p>
                      <p class="text-slate-400 text-sm mt-1">
                        Définissez le nombre de cartes pour chaque personnel individuellement
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <button
                @click="handleCardsModeSubmit"
                :disabled="!cardsDistributionMode || (cardsDistributionMode === 'uniform' && !uniformCardsQuantity)"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>

            <!-- ===== ÉCRAN ENTREPRISE : Allocation personnalisée par employé ===== -->
            <div v-else-if="view === 'entreprise_allocation'" key="allocation" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">Cartes par Personnel</h1>
              <p class="text-slate-300 text-center mb-6">Définissez le nombre de cartes pour chaque personnel</p>

              <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                <div
                  v-for="employee in entrepriseCardsPerEmployee"
                  :key="employee.id"
                  class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                >
                  <label :for="`employee-${employee.id}`" class="text-slate-300 font-medium">
                    {{
                      employee.id === 1 && includeAdminInOrder
                        ? "Vous"
                        : `Personnel ${includeAdminInOrder ? employee.id - 1 : employee.id}`
                    }}
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="employee.quantity"
                      type="number"
                      :id="`employee-${employee.id}`"
                      min="1"
                      max="10"
                      placeholder="1"
                      class="w-20 bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      @blur="if (!employee.quantity || employee.quantity < 1) employee.quantity = 1;"
                    />
                    <span class="text-slate-400 text-sm">carte(s)</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <p class="text-slate-300 text-sm">
                  <strong class="text-white">Total :</strong> {{ totalCustomCards }} carte(s)
                </p>
              </div>

              <button
                @click="handleAllocationSubmit"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg"
              >
                Afficher Mon Devis
              </button>
            </div>

            <!-- ===== ÉCRAN RÉSUMÉ (DEVIS) ===== -->
            <div v-else-if="view === 'summary'" key="summary" class="animate-fade-in">
              <h1 class="text-3xl font-extrabold text-center text-white mb-8">📊 Votre Devis</h1>
              
              <!-- Indicateur de chargement des prix (si nécessaire) -->
              <div v-if="!pricesLoaded" class="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm text-center">
                <div class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                Chargement des prix actualisés...
              </div>

              <!-- Résumé Particulier / Personal -->
              <div v-if="userType === 'particulier' || userType === 'personal'" class="space-y-4">
                <div class="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-slate-300">Nombre de cartes :</span>
                    <span class="text-white font-semibold text-lg">{{ particulierQuantity }}</span>
                  </div>

                  <!-- Détail des prix -->
                  <div class="space-y-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-400">Première carte :</span>
                      <span class="text-white">{{ formatPrice(BASE_PRICE) }} GNF</span>
                    </div>
                    <div v-if="particulierQuantity > 1" class="flex justify-between items-center text-sm">
                      <span class="text-slate-400">{{ particulierQuantity - 1 }} carte(s) supplémentaire(s) :</span>
                      <span class="text-white">{{ formatPrice((particulierQuantity - 1) * EXTRA_PRICE) }} GNF</span>
                    </div>
                  </div>

                  <hr class="border-slate-700 my-4" />
                  <div class="flex justify-between items-center">
                    <span class="text-white font-bold text-lg">Prix total :</span>
                    <span
                      class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
                    >
                      {{ formatPrice(totalCardsPrice) }} GNF
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                    <span class="text-slate-300 text-sm">Abonnement annuel :</span>
                    <span class="text-slate-300 font-semibold">{{ formatPrice(totalAnnualSubscription) }} GNF/an</span>
                  </div>
                </div>
              </div>

              <!-- Résumé Entreprise / Business -->
              <div v-if="userType === 'entreprise' || userType === 'business'" class="space-y-4">
                <!-- Détails par employé (si personnalisé) -->
                <div
                  v-if="cardsDistributionMode === 'custom'"
                  class="bg-slate-900/50 p-6 rounded-lg border border-slate-700 max-h-64 overflow-y-auto"
                >
                  <h3 class="text-white font-semibold mb-4">Détails de la commande :</h3>
                  <div class="space-y-2">
                    <div
                      v-for="slot in employeeSlots"
                      :key="slot.slot_number"
                      class="flex justify-between items-center text-sm py-2 border-b border-slate-700/50 last:border-0"
                    >
                      <span class="text-slate-300"
                        >{{
                          slot.slot_number === 1 && includeAdminInOrder
                            ? "Vous"
                            : `Personnel ${includeAdminInOrder ? slot.slot_number - 1 : slot.slot_number}`
                        }}
                        :</span
                      >
                      <span class="text-white font-medium"
                        >{{ slot.cards_quantity }} carte{{ slot.cards_quantity > 1 ? "s" : "" }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Résumé des montants -->
                <div class="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-slate-300">Nombre de personnel à équiper :</span>
                      <span class="text-white font-semibold text-lg">{{ totalPeopleCount }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-slate-300">Nombre total de cartes :</span>
                      <span class="text-white font-semibold text-lg">{{ totalCardQuantity }}</span>
                    </div>

                    <!-- Détail de tarification -->
                    <div class="p-3 bg-slate-800/50 rounded-lg space-y-2 text-sm">
                      <div class="flex justify-between items-center">
                        <span class="text-slate-400">Tarif :</span>
                        <span class="text-slate-300">Première carte : {{ formatPrice(displayedBasePrice) }} GNF</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-slate-400"></span>
                        <span class="text-slate-300">Cartes supplémentaires : {{ formatPrice(displayedExtraPrice) }} GNF</span>
                      </div>
                    </div>

                    <hr class="border-slate-700 my-4" />
                    <div class="flex justify-between items-center">
                      <span class="text-white font-bold text-lg">Prix total :</span>
                      <span
                        class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
                      >
                        {{ formatPrice(totalCardsPrice) }} GNF
                      </span>
                    </div>
                    <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                      <span class="text-slate-300 text-sm">Abonnement annuel :</span>
                      <span class="text-slate-300 font-semibold"
                        >{{ formatPrice(totalAnnualSubscription) }} GNF/an ({{
                          formatPrice(ANNUAL_SUBSCRIPTION)
                        }}
                        GNF/an par personne)</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bouton final : Connecté vs Non connecté -->
              <button
                v-if="isLoggedIn"
                @click="validateOrder"
                :disabled="isSubmitting"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enregistrer Ma Commande
              </button>
              <button
                v-else
                @click="handleFinalConnect"
                class="mt-6 w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg"
              >
                Me Connecter et Enregistrer Ma Commande
              </button>
            </div>

            <!-- ===== ÉCRAN CONFIRMATION ===== -->
            <div v-else-if="view === 'confirmation'" key="confirmation" class="animate-fade-in text-center">
              <div class="mb-6">
                <div
                  class="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500"
                >
                  <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 class="text-3xl font-extrabold text-white mb-4">Commande Créée !</h1>
              <p class="text-slate-300 text-lg mb-4">Votre commande a été créée avec succès.</p>
              <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
                <div class="flex items-start gap-3">
                  <svg
                    class="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p class="text-yellow-400 font-semibold mb-1">⚠️ N'oubliez pas de valider votre commande !</p>
                    <p class="text-slate-300 text-sm">
                      Rendez-vous dans la section <span class="font-semibold text-white">"Mes Commandes"</span> et
                      cliquez sur <span class="font-semibold text-white">"Valider la Commande"</span> pour recevoir
                      votre confirmation par email avec les conditions générales d'utilisation.
                    </p>
                  </div>
                </div>
              </div>
              <button
                @click="goToDashboard"
                class="bg-sky-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-sky-600 transition-colors text-lg"
              >
                Aller au Dashboard
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { ref, computed, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import { useOrderModal } from "@/composables/useOrderModal";
  import apiClient from "@/api";
  import Cookies from "js-cookie";

  // --- PRIX DYNAMIQUES (valeurs par défaut + chargées depuis l'API publique) ---
  // Les prix par défaut seront remplacés par les prix chargés depuis l'API
  // Ces valeurs ne sont utilisées qu'en cas d'échec du chargement depuis l'API
  const BASE_PRICE = ref(200000); // Première carte (par défaut, sera remplacé par l'API)
  const EXTRA_PRICE = ref(60000); // Carte additionnelle (par défaut, sera remplacé par l'API)
  const ANNUAL_SUBSCRIPTION = ref(40000); // Abonnement annuel (par défaut, sera remplacé par l'API)

  // --- COMPOSABLES ---
  const router = useRouter();
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const { isOrderModalOpen, closeOrderModal } = useOrderModal();

  // --- ÉTATS LOCAUX ---
  const view = ref("selection");
  const userType = ref(null);
  const particulierQuantity = ref(1);

  // États pour commande entreprise
  const entrepriseEmployeeCount = ref(1);
  const includeAdminInOrder = ref(false); // Est-ce que le business admin veut des cartes pour lui aussi ?
  const totalPeopleCount = ref(1); // Nombre total de personnes (employés + admin si inclus)
  const singlePersonQuantity = ref(1); // Nombre de cartes pour une seule personne
  const entrepriseCardsPerEmployee = ref([]);
  const cardsDistributionMode = ref(null); // 'uniform' ou 'custom'
  const uniformCardsQuantity = ref(1); // Nombre de cartes si mode uniforme
  const employeeSlots = ref([]); // Liste des slots d'employés

  const isSubmitting = ref(false);
  const pricesLoaded = ref(false); // Indicateur pour savoir si les prix sont chargés depuis l'API

  // --- LOGIQUE DE CALCUL ---
  // Nombre total de cartes pour le mode personnalisé
  const totalCustomCards = computed(() => {
    if (cardsDistributionMode.value === "custom") {
      return entrepriseCardsPerEmployee.value.reduce((total, emp) => {
        // S'assurer que emp.quantity est un nombre, sinon utiliser 1 par défaut
        const quantity = Number(emp.quantity) || 1;
        return total + quantity;
      }, 0);
    }
    return 0;
  });

  // Nombre total de cartes (tous types)
  const totalCardQuantity = computed(() => {
    if (userType.value === "particulier" || userType.value === "personal") {
      return particulierQuantity.value;
    }
    if (userType.value === "entreprise" || userType.value === "business") {
      // Cas d'une seule personne
      if (totalPeopleCount.value === 1 && singlePersonQuantity.value) {
        return singlePersonQuantity.value;
      }
      // Cas du mode uniforme
      if (cardsDistributionMode.value === "uniform") {
        return totalPeopleCount.value * uniformCardsQuantity.value;
      }
      // Cas du mode personnalisé
      else if (cardsDistributionMode.value === "custom") {
        return totalCustomCards.value;
      }
    }
    return 1;
  });

  // Fonction utilitaire pour calculer le prix d'une quantité de cartes
  // Utilise les prix chargés depuis l'API (dynamiques)
  const calculatePriceForQuantity = (quantity) => {
    if (quantity <= 0) return 0;
    return BASE_PRICE.value + (quantity - 1) * EXTRA_PRICE.value;
  };

  // Prix total des cartes avec le nouveau système de tarification
  // Cette fonction est utilisée à la fois dans le devis et lors de l'enregistrement
  const totalCardsPrice = computed(() => {
    // Log pour debug (uniquement pour les commandes entreprises)
    if (userType.value === "entreprise" || userType.value === "business") {
      console.log('Calcul du prix total pour commande ENTREPRISE:', {
        BASE_PRICE: BASE_PRICE.value,
        EXTRA_PRICE: EXTRA_PRICE.value,
        totalPeopleCount: totalPeopleCount.value,
        cardsDistributionMode: cardsDistributionMode.value,
        uniformCardsQuantity: uniformCardsQuantity.value,
        singlePersonQuantity: singlePersonQuantity.value,
        employeeSlots: employeeSlots.value,
        entrepriseCardsPerEmployee: entrepriseCardsPerEmployee.value,
      });
    }
    
    if (userType.value === "particulier" || userType.value === "personal") {
      // Pour un particulier : première carte = BASE_PRICE, suivantes = EXTRA_PRICE
      return calculatePriceForQuantity(particulierQuantity.value);
    }

    if (userType.value === "entreprise" || userType.value === "business") {
      // Cas d'une seule personne
      if (totalPeopleCount.value === 1 && singlePersonQuantity.value) {
        const price = calculatePriceForQuantity(singlePersonQuantity.value);
        console.log('Prix calculé (1 personne):', price, 'avec', singlePersonQuantity.value, 'cartes');
        return price;
      }
      // Cas du mode uniforme
      if (cardsDistributionMode.value === "uniform") {
        // Chaque personne : première carte = BASE_PRICE, suivantes = EXTRA_PRICE
        const pricePerPerson = calculatePriceForQuantity(uniformCardsQuantity.value);
        const totalPrice = totalPeopleCount.value * pricePerPerson;
        console.log('Prix calculé (mode uniforme):', totalPrice, '=', totalPeopleCount.value, 'personnes ×', pricePerPerson, 'GNF/personne');
        return totalPrice;
      }
      // Cas du mode personnalisé - utiliser employeeSlots si disponible, sinon entrepriseCardsPerEmployee
      else if (cardsDistributionMode.value === "custom") {
        // Si employeeSlots est disponible (après allocation), l'utiliser pour être cohérent avec l'enregistrement
        if (employeeSlots.value && employeeSlots.value.length > 0) {
          const totalPrice = employeeSlots.value.reduce((total, slot) => {
            const quantity = Number(slot.cards_quantity) || 1;
            const slotPrice = calculatePriceForQuantity(quantity);
            console.log('Prix pour slot', slot.slot_number, ':', slotPrice, 'GNF (', quantity, 'cartes)');
            return total + slotPrice;
          }, 0);
          console.log('Prix total calculé (mode personnalisé):', totalPrice, 'GNF');
          return totalPrice;
        }
        // Sinon, utiliser entrepriseCardsPerEmployee (pendant la saisie)
        const totalPrice = entrepriseCardsPerEmployee.value.reduce((total, emp) => {
          const quantity = Number(emp.quantity) || 1;
          return total + calculatePriceForQuantity(quantity);
        }, 0);
        console.log('Prix total calculé (mode personnalisé - saisie):', totalPrice, 'GNF');
        return totalPrice;
      }
    }

    return 0;
  });

  // Prix affichés dans le devis (utilisent les prix chargés depuis l'API)
  const displayedBasePrice = computed(() => BASE_PRICE.value);
  const displayedExtraPrice = computed(() => EXTRA_PRICE.value);

  // Abonnement annuel total (40 000 GNF/an par personne)
  const totalAnnualSubscription = computed(() => {
    if (userType.value === "particulier" || userType.value === "personal") {
      // Pour un particulier : 40 000 GNF/an
      return ANNUAL_SUBSCRIPTION.value;
    }

    if (userType.value === "entreprise" || userType.value === "business") {
      // Pour une entreprise : 40 000 GNF/an × nombre de personnes
      return ANNUAL_SUBSCRIPTION.value * totalPeopleCount.value;
    }

    return ANNUAL_SUBSCRIPTION.value;
  });

  // --- MÉTHODES ---
  const formatPrice = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleUserTypeSelection = (type) => {
    userType.value = type;
    // Pour Business Admin : 'personal' -> particulier, 'business' -> entreprise
    if (type === "personal" || type === "particulier") {
      view.value = "particulier_quantity";
    } else if (type === "business" || type === "entreprise") {
      view.value = "entreprise_employees";
    }
  };

  const handleParticulierSubmit = async () => {
    if (particulierQuantity.value >= 1) {
      // Recharger les prix avant d'afficher le devis pour garantir la cohérence (avec rechargement forcé)
      await loadPublicPricing(true);
      view.value = "summary";
    }
  };

  const handleEmployeeCountSubmit = () => {
    if (entrepriseEmployeeCount.value >= 1) {
      // Réinitialiser le mode de distribution
      cardsDistributionMode.value = null;
      uniformCardsQuantity.value = 1;
      // Passer à la question "Souhaitez-vous en acheter pour vous aussi ?"
      view.value = "business_include_admin";
    }
  };

  const handleIncludeAdminChoice = (includeAdmin) => {
    includeAdminInOrder.value = includeAdmin;
    // Calculer le nombre total de personnes
    totalPeopleCount.value = includeAdmin ? entrepriseEmployeeCount.value + 1 : entrepriseEmployeeCount.value;

    // Si total = 1 personne : demander directement le nombre de cartes
    if (totalPeopleCount.value === 1) {
      view.value = "business_single_person_quantity";
    } else {
      // Si total >= 2 : afficher le menu de distribution
      view.value = "business_cards_mode";
    }
  };

  const handleSinglePersonQuantitySubmit = async () => {
    if (singlePersonQuantity.value >= 1) {
      // Recharger les prix avant d'afficher le devis pour garantir la cohérence (avec rechargement forcé)
      await loadPublicPricing(true);
      
      // Créer un slot unique pour cette personne
      employeeSlots.value = [
        {
          slot_number: 1,
          cards_quantity: singlePersonQuantity.value,
          employee_id: null,
          employee_name: null,
          employee_email: null,
          is_assigned: false,
          is_configured: false,
        },
      ];
      view.value = "summary";
    }
  };

  const handleCardsModeSubmit = async () => {
    if (cardsDistributionMode.value === "uniform") {
      // Recharger les prix avant d'afficher le devis pour garantir la cohérence (avec rechargement forcé)
      await loadPublicPricing(true);
      
      // Mode uniforme : créer les slots directement
      employeeSlots.value = Array.from({ length: totalPeopleCount.value }, (_, i) => ({
        slot_number: i + 1,
        cards_quantity: uniformCardsQuantity.value,
        employee_id: null,
        employee_name: null,
        employee_email: null,
        is_assigned: false,
        is_configured: false,
      }));
      view.value = "summary";
    } else if (cardsDistributionMode.value === "custom") {
      // Mode personnalisé : aller vers l'allocation
      entrepriseCardsPerEmployee.value = Array.from({ length: totalPeopleCount.value }, (_, i) => ({
        id: i + 1,
        quantity: 1,
      }));
      view.value = "entreprise_allocation";
    }
  };

  const handleAllocationSubmit = async () => {
    // Recharger les prix avant d'afficher le devis pour garantir la cohérence (avec rechargement forcé)
    await loadPublicPricing(true);
    
    // Créer les slots basés sur l'allocation personnalisée
    employeeSlots.value = entrepriseCardsPerEmployee.value.map((emp) => ({
      slot_number: emp.id,
      cards_quantity: Number(emp.quantity) || 1, // S'assurer que c'est un nombre, sinon 1 par défaut
      employee_id: null,
      employee_name: null,
      employee_email: null,
      is_assigned: false,
      is_configured: false,
    }));
    view.value = "summary";
  };

  const handleFinalConnect = () => {
    closeOrderModal();
    openAuthModal();
  };

  // Nouvelle fonction : Enregistrer la commande (utilisateur connecté)
  const validateOrder = async () => {
    isSubmitting.value = true;

    try {
      // Recharger les prix juste avant l'enregistrement pour garantir la cohérence avec le devis (avec rechargement forcé)
      await loadPublicPricing(true);
      
      // S'assurer d'avoir un CSRF token frais
      await apiClient.get("/sanctum/csrf-cookie");

      // Récupérer le CSRF token
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      if (xsrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
      }

      // Déterminer le type de commande
      let orderType = "personal";
      if (userType.value === "business" || userType.value === "entreprise") {
        orderType = "business";
      }

      // Utiliser les prix chargés depuis l'API (pas de forçage)
      // Les prix sont déjà chargés depuis l'API et sont à jour
      const finalBasePrice = BASE_PRICE.value;
      const finalExtraPrice = EXTRA_PRICE.value;
      
      // Utiliser le prix calculé par le computed totalCardsPrice
      // qui utilise déjà les prix chargés depuis l'API
      const calculatedTotalPrice = totalCardsPrice.value;
      
      // Log pour debug (peut être retiré en production)
      console.log('Prix utilisés pour l\'enregistrement:', {
        BASE_PRICE: BASE_PRICE.value,
        EXTRA_PRICE: EXTRA_PRICE.value,
        totalCardsPrice: totalCardsPrice.value,
        calculatedTotalPrice: calculatedTotalPrice,
        userType: userType.value,
        totalPeopleCount: totalPeopleCount.value,
        cardsDistributionMode: cardsDistributionMode.value,
        employeeSlots: employeeSlots.value,
        // Calcul détaillé pour vérification
        expectedCalculation: orderType === "business" && employeeSlots.value.length > 0 
          ? employeeSlots.value.map(slot => {
              const qty = Number(slot.cards_quantity) || 1;
              const slotPrice = BASE_PRICE.value + (qty - 1) * EXTRA_PRICE.value;
              return { slot: slot.slot_number, quantity: qty, price: slotPrice };
            })
          : null,
      });

      const payload = {
        order_type: orderType,
        card_quantity: totalCardQuantity.value,
        unit_price: finalBasePrice, // Prix de la première carte (chargé depuis l'API)
        extra_card_price: finalExtraPrice, // Prix des cartes supplémentaires (chargé depuis l'API)
        total_price: calculatedTotalPrice, // Utiliser le prix calculé avec les prix de l'API
        annual_subscription: totalAnnualSubscription.value,
        // IMPORTANT: Flag pour indiquer au backend d'utiliser les prix envoyés sans recalculer
        use_provided_prices: true, // Le backend doit utiliser ces prix sans recalculer
        // Ajouter les prix utilisés pour que le backend puisse les vérifier
        pricing_details: {
          base_price: finalBasePrice,
          extra_price: finalExtraPrice,
          annual_subscription: ANNUAL_SUBSCRIPTION.value,
          calculated_total: calculatedTotalPrice,
          // Calcul détaillé pour vérification côté backend
          calculation_breakdown: orderType === "business" && employeeSlots.value.length > 0
            ? employeeSlots.value.map(slot => {
                const qty = Number(slot.cards_quantity) || 1;
                const slotPrice = finalBasePrice + (qty - 1) * finalExtraPrice;
                return {
                  slot_number: slot.slot_number,
                  quantity: qty,
                  price_per_slot: slotPrice,
                  calculation: `${finalBasePrice} + (${qty} - 1) × ${finalExtraPrice} = ${slotPrice}`
                };
              })
            : null,
        },
      };

      // Si c'est une commande business, ajouter les slots d'employés
      if (orderType === "business" && employeeSlots.value.length > 0) {
        payload.total_employees = totalPeopleCount.value;
        payload.employee_slots = employeeSlots.value;
        payload.include_admin_in_order = includeAdminInOrder.value; // Indiquer si le business admin s'est inclus
        payload.cards_per_employee =
          cardsDistributionMode.value === "uniform"
            ? uniformCardsQuantity.value
            : totalPeopleCount.value === 1
              ? singlePersonQuantity.value
              : 1;
      }

      const response = await apiClient.post("/orders", payload);
      console.log("Commande créée avec succès:", response.data);

      // Vérifier que le prix retourné par le backend correspond au prix envoyé
      const returnedOrder = response.data.order || response.data;
      if (returnedOrder && returnedOrder.total_price !== undefined) {
        const backendPrice = Number(returnedOrder.total_price);
        const frontendPrice = calculatedTotalPrice;
        
        if (Math.abs(backendPrice - frontendPrice) > 1) { // Tolérance de 1 GNF pour les arrondis
          console.error('⚠️ INCOHÉRENCE DE PRIX DÉTECTÉE:', {
            prixEnvoyé: frontendPrice,
            prixRetourné: backendPrice,
            différence: Math.abs(backendPrice - frontendPrice),
            BASE_PRICE_envoyé: finalBasePrice,
            EXTRA_PRICE_envoyé: finalExtraPrice,
            unit_price_retourné: returnedOrder.unit_price,
            orderType: orderType,
            employeeSlots: employeeSlots.value,
            // Calcul détaillé pour comprendre la différence
            calculFrontend: orderType === "business" && employeeSlots.value.length > 0
              ? employeeSlots.value.map(slot => {
                  const qty = Number(slot.cards_quantity) || 1;
                  const slotPrice = finalBasePrice + (qty - 1) * finalExtraPrice;
                  return `Slot ${slot.slot_number}: ${qty} cartes = ${finalBasePrice} + (${qty}-1) × ${finalExtraPrice} = ${slotPrice}`;
                }).join(' | ')
              : null,
          });
          
          // Calculer le prix avec les anciens prix pour voir si c'est ce que le backend utilise
          const oldBasePrice = 180000;
          const oldExtraPrice = 45000;
          let oldCalculatedPrice = 0;
          if (orderType === "business" && employeeSlots.value.length > 0) {
            oldCalculatedPrice = employeeSlots.value.reduce((total, slot) => {
              const qty = Number(slot.cards_quantity) || 1;
              return total + oldBasePrice + (qty - 1) * oldExtraPrice;
            }, 0);
          }
          console.log('Calcul avec anciens prix (180000/45000):', oldCalculatedPrice);
          
          // Afficher un avertissement à l'utilisateur avec plus de détails
          console.warn(`⚠️ Le backend a utilisé des prix différents. Prix envoyé: ${frontendPrice} GNF, Prix retourné: ${backendPrice} GNF. Le backend doit être mis à jour pour utiliser les prix envoyés (${finalBasePrice} GNF et ${finalExtraPrice} GNF).`);
        } else {
          console.log('✅ Prix cohérent entre frontend et backend:', {
            prixEnvoyé: frontendPrice,
            prixRetourné: backendPrice,
          });
        }
      }

      // Émettre un événement pour notifier qu'une nouvelle commande a été créée
      // Cela permettra à OrdersView de se mettre à jour automatiquement
      window.dispatchEvent(new CustomEvent('order-created', {
        detail: { order: returnedOrder }
      }));

      // Afficher l'écran de confirmation
      view.value = "confirmation";
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande:", error);
      console.error("Détails de l'erreur:", error.response?.data);

      let errorMessage = "Une erreur est survenue lors de l'enregistrement de votre commande.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join("\n");
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage + "\n\nVeuillez réessayer.");
    } finally {
      isSubmitting.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };
  // Charger la tarification publique (disponible sans auth)
  // Cette fonction est appelée à chaque fois qu'on a besoin des prix actualisés
  const loadPublicPricing = async (forceReload = false) => {
    try {
      // Ajouter un timestamp pour éviter le cache du navigateur
      const timestamp = forceReload ? `?t=${Date.now()}` : '';
      const res = await apiClient.get(`/api/settings/pricing${timestamp}`);
      const pricing = res.data?.pricing || res.data || {};
      
      // Toujours mettre à jour les prix si disponibles depuis l'API
      // Vérifier plusieurs noms de champs possibles pour la compatibilité
      if (pricing.card_price !== undefined && pricing.card_price !== null) {
        BASE_PRICE.value = Number(pricing.card_price);
      } else if (pricing.first_card_price !== undefined && pricing.first_card_price !== null) {
        BASE_PRICE.value = Number(pricing.first_card_price);
      } else if (pricing.base_price !== undefined && pricing.base_price !== null) {
        BASE_PRICE.value = Number(pricing.base_price);
      }
      
      if (pricing.additional_card_price !== undefined && pricing.additional_card_price !== null) {
        EXTRA_PRICE.value = Number(pricing.additional_card_price);
      } else if (pricing.extra_card_price !== undefined && pricing.extra_card_price !== null) {
        EXTRA_PRICE.value = Number(pricing.extra_card_price);
      } else if (pricing.supplementary_card_price !== undefined && pricing.supplementary_card_price !== null) {
        EXTRA_PRICE.value = Number(pricing.supplementary_card_price);
      }
      
      if (pricing.subscription_price !== undefined && pricing.subscription_price !== null) {
        ANNUAL_SUBSCRIPTION.value = Number(pricing.subscription_price);
      } else if (pricing.annual_subscription !== undefined && pricing.annual_subscription !== null) {
        ANNUAL_SUBSCRIPTION.value = Number(pricing.annual_subscription);
      }
      
      // Validation : s'assurer que les prix sont valides (supérieurs à 0)
      if (BASE_PRICE.value <= 0) {
        console.warn('Prix de la première carte invalide depuis l\'API, utilisation de la valeur par défaut');
        BASE_PRICE.value = 200000; // Valeur par défaut mise à jour
      }
      if (EXTRA_PRICE.value <= 0) {
        console.warn('Prix de la carte supplémentaire invalide depuis l\'API, utilisation de la valeur par défaut');
        EXTRA_PRICE.value = 60000; // Valeur par défaut mise à jour
      }
      
      // Marquer les prix comme chargés
      pricesLoaded.value = true;
      
      // Log pour debug
      console.log('Prix chargés depuis l\'API:', {
        BASE_PRICE: BASE_PRICE.value,
        EXTRA_PRICE: EXTRA_PRICE.value,
        ANNUAL_SUBSCRIPTION: ANNUAL_SUBSCRIPTION.value,
        source: 'API',
        userType: userType.value,
        orderType: userType.value === 'business' || userType.value === 'entreprise' ? 'BUSINESS' : 'PERSONAL',
      });
      
      return true; // Succès
    } catch (e) {
      // En cas d'échec, on garde les valeurs par défaut mais on log l'erreur
      console.warn('Impossible de charger la tarification publique depuis l\'API. Utilisation des valeurs par défaut.', e);
      console.warn('Prix par défaut utilisés:', {
        BASE_PRICE: BASE_PRICE.value,
        EXTRA_PRICE: EXTRA_PRICE.value,
        ANNUAL_SUBSCRIPTION: ANNUAL_SUBSCRIPTION.value,
        source: 'DEFAULT',
        userType: userType.value,
        orderType: userType.value === 'business' || userType.value === 'entreprise' ? 'BUSINESS' : 'PERSONAL',
      });
      // Même en cas d'échec, on marque comme chargé pour éviter les boucles infinies
      pricesLoaded.value = true;
      return false; // Échec
    }
  };

  // Charger les prix dès l'ouverture du modal (avec rechargement forcé pour éviter le cache)
  loadPublicPricing(true);
  
  // Surveiller l'ouverture du modal pour recharger les prix si nécessaire
  watch(isOrderModalOpen, (isOpen) => {
    if (isOpen) {
      // Recharger les prix à chaque ouverture du modal pour garantir qu'ils sont à jour
      pricesLoaded.value = false; // Réinitialiser l'indicateur
      loadPublicPricing(true);
    }
  });

  // Aller au Dashboard
  const goToDashboard = () => {
    resetAndClose();
    router.push({ name: "Dashboard" });
  };

  const resetAndClose = () => {
    closeOrderModal();
    setTimeout(() => {
      view.value = "selection";
      userType.value = null;
      particulierQuantity.value = 1;
      entrepriseEmployeeCount.value = 1;
      includeAdminInOrder.value = false;
      totalPeopleCount.value = 1;
      singlePersonQuantity.value = 1;
      entrepriseCardsPerEmployee.value = [];
      cardsDistributionMode.value = null;
      uniformCardsQuantity.value = 1;
      employeeSlots.value = [];
      pricesLoaded.value = false; // Réinitialiser l'indicateur de chargement des prix
    }, 300);
  };

  // Nouvelle fonction pour revenir en arrière
  const goBack = () => {
    switch (view.value) {
      case "particulier_quantity":
      case "entreprise_employees":
        view.value = "selection";
        break;
      case "business_include_admin":
        view.value = "entreprise_employees";
        break;
      case "business_single_person_quantity":
        view.value = "business_include_admin";
        break;
      case "business_cards_mode":
        view.value = "business_include_admin";
        break;
      case "entreprise_allocation":
        view.value = "business_cards_mode";
        break;
      case "summary":
        if (userType.value === "particulier" || userType.value === "personal") {
          view.value = "particulier_quantity";
        } else {
          // Pour entreprise, gestion du retour
          if (totalPeopleCount.value === 1) {
            // Si une seule personne, retourner vers le nombre de cartes pour cette personne
            view.value = "business_single_person_quantity";
          } else if (cardsDistributionMode.value === "custom") {
            // Si mode personnalisé, retourner vers l'allocation
            view.value = "entreprise_allocation";
          } else {
            // Sinon retourner vers le choix du mode
            view.value = "business_cards_mode";
          }
        }
        break;
    }
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease-out;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.4s ease-out forwards;
  }
</style>
