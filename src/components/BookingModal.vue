<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden my-auto flex flex-col max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)]"
          >
            <!-- Header -->
            <div class="relative p-4 sm:p-6 border-b border-slate-700/50 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 flex-shrink-0">
              <button
                @click="closeModal"
                class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-red-500/80 text-slate-400 hover:text-white transition-all"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Prendre Rendez-vous</h2>
                  <p class="text-sm text-slate-400">avec {{ ownerName }}</p>
                </div>
              </div>

              <!-- Stepper -->
              <div class="flex items-center justify-center gap-2 mt-6">
                <div
                  v-for="s in 3"
                  :key="s"
                  :class="[
                    'w-8 h-1 rounded-full transition-all duration-300',
                    step >= s ? 'bg-sky-500' : 'bg-slate-600'
                  ]"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="p-4 sm:p-6 flex-1 overflow-y-auto min-h-0">
              <!-- Étape 1: Choix de la date -->
              <div v-if="step === 1" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-3">
                    📅 Choisissez une date
                  </label>
                  
                  <!-- Chargement des dates disponibles -->
                  <div v-if="isLoadingAvailableDates" class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-8 flex flex-col items-center justify-center gap-3">
                    <div class="relative">
                      <div class="w-12 h-12 rounded-full border-4 border-slate-700"></div>
                      <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
                    </div>
                    <span class="text-sm text-slate-400">Chargement des dates disponibles...</span>
                  </div>
                  
                  <!-- Grille de dates visuelle -->
                  <div v-else-if="availableDates.length > 0" class="space-y-6">
                    <!-- Dates groupées par mois -->
                    <div
                      v-for="(monthGroup, monthKey) in groupedDatesByMonth"
                      :key="monthKey"
                      class="space-y-3"
                    >
                      <!-- En-tête du mois -->
                      <div class="flex items-center gap-2 px-2">
                        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                        <h3 class="text-sm font-semibold text-sky-400 px-3 py-1 bg-slate-800/50 rounded-lg">
                          {{ monthKey }}
                        </h3>
                        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                      </div>
                      
                      <!-- Grille de dates -->
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          v-for="date in monthGroup"
                          :key="date.value"
                          @click="selectDate(date.value)"
                          :class="[
                            'group relative p-3 rounded-xl border-2 transition-all duration-200 text-left overflow-hidden',
                            selectedDate === date.value
                              ? 'bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border-sky-500 shadow-lg shadow-sky-500/20 scale-105'
                              : 'bg-slate-700/30 border-slate-600 hover:border-sky-400/50 hover:bg-slate-700/50 hover:scale-102'
                          ]"
                        >
                          <!-- Effet de brillance au survol -->
                          <div class="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:via-white/10 group-hover:to-white/5 transition-all duration-300"></div>
                          
                          <!-- Contenu -->
                          <div class="relative z-10">
                            <!-- Jour de la semaine -->
                            <div class="flex items-center gap-1.5 mb-1">
                              <span class="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                {{ getDayName(date.value) }}
                              </span>
                              <svg v-if="selectedDate === date.value" class="w-3 h-3 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                              </svg>
                            </div>
                            
                            <!-- Numéro du jour -->
                            <div class="flex items-baseline gap-1">
                              <span :class="[
                                'text-2xl font-bold transition-colors',
                                selectedDate === date.value ? 'text-sky-400' : 'text-white group-hover:text-sky-300'
                              ]">
                                {{ getDayNumber(date.value) }}
                              </span>
                            </div>
                            
                            <!-- Mois -->
                            <div class="text-xs text-slate-400 mt-0.5">
                              {{ getMonthName(date.value) }}
                            </div>
                          </div>
                          
                          <!-- Indicateur de sélection -->
                          <div v-if="selectedDate === date.value" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50 animate-pulse"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message si aucune date disponible -->
                  <div v-else-if="!isLoadingAvailableDates && availableDates.length === 0" class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-12 flex flex-col items-center justify-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center">
                      <svg class="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p class="text-slate-400 text-sm text-center px-4">Aucune date disponible pour le moment</p>
                  </div>
                </div>

                <!-- Chargement des créneaux -->
                <div v-if="selectedDate && isLoadingSlots" class="flex flex-col items-center justify-center py-8 gap-3 mt-4">
                  <div class="relative">
                    <div class="w-12 h-12 rounded-full border-4 border-slate-700"></div>
                    <div class="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
                  </div>
                  <p class="text-sm text-slate-400 animate-pulse">Chargement des créneaux disponibles...</p>
                </div>

                <!-- Message si pas de date sélectionnée -->
                <div v-else-if="!selectedDate && !isLoadingAvailableDates && availableDates.length > 0 && !isLoadingSlots" class="text-center py-8 mt-4">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <svg class="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-slate-400">Sélectionnez une date ci-dessus pour voir les créneaux disponibles</p>
                </div>

                <!-- Message d'erreur -->
                <div v-else-if="slotsError" class="text-center py-8">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p class="text-red-400">{{ slotsError }}</p>
                </div>
              </div>

              <!-- Étape 2: Choix du créneau -->
              <div v-if="step === 2" class="space-y-4">
                <div class="flex items-center justify-between mb-2">
                  <button
                    @click="goToStep(1)"
                    class="flex items-center gap-1 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Modifier la date
                  </button>
                  <span class="text-sm text-sky-400 font-medium">{{ formatDisplayDate(selectedDate) }}</span>
                </div>

                <!-- Créneaux disponibles -->
                <div v-if="availableSlots.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    v-for="slot in availableSlots"
                    :key="slot.start"
                    @click="selectSlot(slot)"
                    :class="[
                      'p-3 rounded-xl border-2 transition-all duration-200 text-center',
                      selectedSlot?.start === slot.start
                        ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                        : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-sky-400 hover:text-sky-400'
                    ]"
                  >
                    <div class="font-bold text-lg">{{ slot.start }}</div>
                    <div class="text-xs opacity-70">{{ formatDuration(slot.duration) }}</div>
                  </button>
                </div>

                <!-- Aucun créneau -->
                <div v-else class="text-center py-8">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p class="text-yellow-400 font-medium mb-1">Il n'y a pas de Rendez-vous disponible pour cette date</p>
                  <p class="text-slate-400 text-sm">Veuillez essayer une autre date.</p>
                </div>
              </div>

              <!-- Étape 3: Formulaire et confirmation -->
              <div v-if="step === 3" class="space-y-4">
                <button
                  @click="goToStep(2)"
                  class="flex items-center gap-1 text-sm text-slate-400 hover:text-sky-400 transition-colors mb-4"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Modifier le créneau
                </button>

                <!-- Récapitulatif -->
                <div class="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 rounded-xl p-4 mb-4">
                  <p class="text-sm text-slate-300">
                    <span class="text-sky-400 font-medium">📅 Rendez-vous avec {{ ownerName }}</span><br>
                    Le <span class="font-bold text-white">{{ formatDisplayDate(selectedDate) }}</span>
                    à <span class="font-bold text-white">{{ selectedSlot?.start }}</span>
                    <span class="text-slate-400">({{ formatDuration(selectedSlot?.duration) }})</span>
                  </p>
                </div>

                <!-- Formulaire -->
                <form @submit.prevent="submitBooking" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Votre nom *</label>
                    <input
                      type="text"
                      v-model="form.visitor_name"
                      required
                      class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Votre email *</label>
                    <input
                      type="email"
                      v-model="form.visitor_email"
                      required
                      class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="jean@example.com"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Téléphone <span class="text-slate-500">(optionnel)</span></label>
                    <input
                      type="tel"
                      v-model="form.visitor_phone"
                      class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Message <span class="text-slate-500">(optionnel)</span></label>
                    <textarea
                      v-model="form.message"
                      rows="3"
                      class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                      placeholder="Précisez le sujet de votre rendez-vous..."
                    ></textarea>
                  </div>

                  <!-- Erreur de soumission -->
                  <div v-if="submitError" class="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                    {{ submitError }}
                  </div>

                  <button
                    type="submit"
                    :disabled="isSubmitting || !form.visitor_name || !form.visitor_email"
                    class="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:shadow-none text-sm sm:text-base"
                  >
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isSubmitting ? 'Confirmation...' : '✓ Confirmer le rendez-vous' }}</span>
                  </button>
                </form>
              </div>

              <!-- Étape de succès -->
              <div v-if="step === 4" class="text-center py-8">
                <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Rendez-vous confirmé !</h3>
                <p class="text-slate-400 mb-6">
                  Votre rendez-vous avec <span class="text-sky-400">{{ ownerName }}</span> a été enregistré.<br>
                  Un email de confirmation vous sera envoyé.
                </p>
                <div class="bg-slate-700/30 rounded-xl p-4 text-left mb-6">
                  <p class="text-sm text-slate-300">
                    <span class="text-slate-500">📅 Date :</span> {{ formatDisplayDate(selectedDate) }}<br>
                    <span class="text-slate-500">⏰ Heure :</span> {{ selectedSlot?.start }} - {{ selectedSlot?.end }}
                  </p>
                </div>
                <button
                  @click="closeModal"
                  class="bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-xl font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>

            <!-- Footer avec bouton Continuer (étapes 1 et 2) -->
            <div v-if="step === 1 && selectedDate && availableSlots.length > 0" class="p-4 sm:p-6 border-t border-slate-700/50 bg-slate-800/50 flex-shrink-0">
              <button
                @click="goToStep(2)"
                class="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Choisir un créneau
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div v-if="step === 2 && selectedSlot" class="p-6 border-t border-slate-700/50">
              <button
                @click="goToStep(3)"
                class="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Continuer
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import apiClient from '@/api';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: [Number, String],
    required: true,
  },
  orderId: {
    type: [Number, String],
    default: null,
  },
  ownerName: {
    type: String,
    default: 'ce contact',
  },
});

const emit = defineEmits(['close']);

// État du composant
const step = ref(1);
const selectedDate = ref('');
const selectedSlot = ref(null);
const availableSlots = ref([]);
const isLoadingSlots = ref(false);
const slotsError = ref('');
const isSubmitting = ref(false);
const submitError = ref('');
const availableDates = ref([]);
const isLoadingAvailableDates = ref(false);

// Formulaire
const form = reactive({
  visitor_name: '',
  visitor_email: '',
  visitor_phone: '',
  message: '',
});

// Date minimum (aujourd'hui)
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Réinitialiser quand la modale s'ouvre
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetModal();
  }
});

// Réinitialiser le formulaire
const resetModal = () => {
  step.value = 1;
  selectedDate.value = '';
  selectedSlot.value = null;
  availableSlots.value = [];
  isLoadingSlots.value = false;
  slotsError.value = '';
  isSubmitting.value = false;
  submitError.value = '';
  form.visitor_name = '';
  form.visitor_email = '';
  form.visitor_phone = '';
  form.message = '';
  // Charger les dates disponibles quand le modal s'ouvre
  fetchAvailableDates();
};

// Fermer la modale
const closeModal = () => {
  emit('close');
};

// Changer d'étape
const goToStep = (s) => {
  step.value = s;
};

// Récupérer toutes les dates disponibles avec des créneaux
const fetchAvailableDates = async () => {
  isLoadingAvailableDates.value = true;
  availableDates.value = [];

  try {
    // Utiliser le nouvel endpoint backend qui retourne toutes les dates disponibles en une seule requête
    const params = {
      days_ahead: 60 // Vérifier les 60 prochains jours
    };
    
    if (props.orderId) {
      params.order_id = parseInt(props.orderId, 10);
    }
    
    console.log('[BookingModal] fetchAvailableDates - Paramètres:', {
      userId: props.userId,
      orderId: props.orderId,
      params: params
    });
    
    const response = await apiClient.get(`/api/user/${props.userId}/available-dates`, { 
      params,
      timeout: 10000 // Timeout plus long car c'est une seule requête
    });
    
    console.log('[BookingModal] fetchAvailableDates - Réponse:', {
      data: response.data,
      available_dates_count: response.data?.available_dates?.length || 0
    });
    
    const datesData = response.data?.available_dates || [];
    
    // Formater les dates pour l'affichage
    const dates = datesData.map(dateInfo => ({
      value: dateInfo.date,
      label: dateInfo.formatted_date || formatDisplayDate(dateInfo.date),
      dayName: dateInfo.day_name || getDayNameFromDate(dateInfo.date),
      monthName: getMonthNameFromDate(dateInfo.date),
      dayNumber: getDayNumberFromDate(dateInfo.date)
    }));
    
    availableDates.value = dates;
    
    console.log('[BookingModal] fetchAvailableDates - Dates formatées:', dates);
    
  } catch (error) {
    console.error('[BookingModal] Erreur lors de la récupération des dates disponibles:', {
      error: error,
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      userId: props.userId,
      orderId: props.orderId
    });
    // En cas d'erreur, on peut toujours permettre la sélection manuelle
    // mais on affichera un message d'avertissement
    availableDates.value = [];
  } finally {
    isLoadingAvailableDates.value = false;
  }
};

// Sélectionner une date et charger les créneaux
const selectDate = async (dateValue) => {
  selectedDate.value = dateValue;
  await fetchSlots();
};

// Récupérer les créneaux disponibles
const fetchSlots = async () => {
  if (!selectedDate.value) return;

  isLoadingSlots.value = true;
  slotsError.value = '';
  availableSlots.value = [];
  selectedSlot.value = null;

  try {
    // Inclure order_id si fourni pour obtenir les créneaux spécifiques à la commande
    const params = { date: selectedDate.value };
    if (props.orderId) {
      // Convertir en entier pour s'assurer que l'API le reçoit correctement
      params.order_id = parseInt(props.orderId, 10);
    }

    // Appel API avec timeout de 10 secondes
    const response = await apiClient.get(`/api/user/${props.userId}/slots`, { 
      params,
      timeout: 10000 
    });

    availableSlots.value = response.data.available_slots || [];

    // Toujours passer à l'étape 2 pour afficher les créneaux ou le message "aucun créneau"
    step.value = 2;
    
    // Afficher le message d'erreur si fourni par l'API et pas de créneaux
    if (availableSlots.value.length === 0 && response.data.message) {
      slotsError.value = response.data.message;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    if (error.code === 'ECONNABORTED') {
      slotsError.value = 'Le serveur met trop de temps à répondre. Veuillez réessayer.';
    } else {
      slotsError.value = error.response?.data?.message || 'Impossible de charger les créneaux disponibles.';
    }
  } finally {
    isLoadingSlots.value = false;
  }
};

// Sélectionner un créneau
const selectSlot = (slot) => {
  selectedSlot.value = slot;
};

// Soumettre la réservation
const submitBooking = async () => {
  if (!selectedDate.value || !selectedSlot.value) return;

  isSubmitting.value = true;
  submitError.value = '';

  try {
    // Inclure order_id si fourni
    const payload = {
      visitor_name: form.visitor_name,
      visitor_email: form.visitor_email,
      visitor_phone: form.visitor_phone || null,
      message: form.message || null,
      date: selectedDate.value,
      start_time: selectedSlot.value.start,
    };
    
    if (props.orderId) {
      payload.order_id = props.orderId;
    }

    await apiClient.post(`/api/user/${props.userId}/appointments`, payload);

    // Succès - passer à l'étape de confirmation
    step.value = 4;
  } catch (error) {
    console.error('Erreur lors de la réservation:', error);

    if (error.response?.status === 409) {
      submitError.value = 'Ce créneau vient d\'être réservé. Veuillez en choisir un autre.';
      // Retourner à l'étape 2 et recharger les créneaux
      step.value = 2;
      await fetchSlots();
    } else {
      submitError.value = error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Formater la durée
const formatDuration = (minutes) => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}min`;
  if (minutes === 60) return '1h';
  if (minutes === 90) return '1h30';
  if (minutes === 120) return '2h';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
};

// Formater la date pour l'affichage
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
};

// Grouper les dates par mois
const groupedDatesByMonth = computed(() => {
  const grouped = {};
  
  availableDates.value.forEach(date => {
    const dateObj = new Date(date.value);
    const monthKey = dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    // Capitaliser la première lettre
    const capitalizedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
    
    if (!grouped[capitalizedMonth]) {
      grouped[capitalizedMonth] = [];
    }
    grouped[capitalizedMonth].push(date);
  });
  
  // Trier les dates dans chaque mois
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => {
      return new Date(a.value) - new Date(b.value);
    });
  });
  
  return grouped;
});

// Helpers pour extraire les informations de date
const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { weekday: 'short' });
};

const getDayNumber = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.getDate();
};

const getMonthName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { month: 'short' });
};

// Helpers pour le formatage initial des dates
const getDayNameFromDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { weekday: 'short' });
};

const getMonthNameFromDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { month: 'short' });
};

const getDayNumberFromDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.getDate();
};
</script>

<style scoped>
/* Style personnalisé pour le select */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:focus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%230ea5e9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
}

/* Animation de pulse pour le succès */
@keyframes pulse-success {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-pulse-success {
  animation: pulse-success 2s ease-in-out infinite;
}
</style>

