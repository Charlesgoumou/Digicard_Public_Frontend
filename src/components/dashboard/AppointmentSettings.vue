<template>
  <div class="space-y-6">
    <!-- En-tête avec titre et switch global -->
    <div class="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-2xl">📅</span>
            Prise de Rendez-vous
          </h2>
          <p class="text-sm text-slate-400 mt-1">
            Configurez vos disponibilités en sélectionnant des dates spécifiques ou des mois récurrents.
          </p>
        </div>

        <!-- Switch Global -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-400">{{ isEnabled ? 'Activé' : 'Désactivé' }}</span>
          <button
            type="button"
            @click="toggleEnabled"
            :class="[
              'relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800',
              isEnabled ? 'bg-sky-500' : 'bg-slate-600'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                isEnabled ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Message si désactivé -->
    <div v-if="!isEnabled" class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-yellow-400">
        <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="font-medium text-sm sm:text-base">L'icône de prise de rendez-vous ne s'affichera pas sur votre profil public tant que cette option est désactivée.</p>
      </div>
    </div>

    <!-- Configuration par jour de la semaine (visible seulement si activé) -->
    <div v-if="isEnabled" class="space-y-3">
      <div
        v-for="day in daysOfWeek"
        :key="day.id"
        :data-day-id="day.id"
        class="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden transition-all duration-300"
        :class="{ 'border-sky-500/50': expandedDays[day.id] }"
      >
        <!-- Header du jour (cliquable) -->
        <div
          class="p-3 sm:p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
          @click="toggleDay(day.id)"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                {{ day.short }}
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-white text-sm sm:text-base">{{ day.name }}</h3>
                <p class="text-xs text-slate-400 truncate">
                  <span v-if="!expandedDays[day.id]">
                    <span v-if="getDayRules(day.id).length === 0">Cliquez pour ajouter des créneaux</span>
                    <span v-else>{{ getDayRulesSummary(day.id) }} - Cliquez pour modifier</span>
                  </span>
                  <span v-else>{{ getDayRulesSummary(day.id) }}</span>
                </p>
              </div>
            </div>
            <!-- Icône de flèche -->
            <svg
              class="w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0"
              :class="{ 'rotate-180': expandedDays[day.id] }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Liste des règles pour ce jour (affichée seulement si le jour est étendu) -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[2000px]"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 max-h-[2000px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="expandedDays[day.id]" class="p-4 space-y-4 border-t border-slate-700/50 overflow-hidden">
          <div
            v-for="(rule, ruleIndex) in getDayRules(day.id)"
            :key="`${day.id}-${getGlobalRuleIndex(rule)}`"
            class="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 space-y-4"
          >
            <!-- Type de règle -->
            <div class="flex items-center gap-3">
              <span class="text-xs font-medium text-slate-400">Type :</span>
              <span
                :class="[
                  'text-xs px-2 py-1 rounded-full',
                  rule.type === 'specific' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                ]"
              >
                {{ rule.type === 'specific' ? '📅 Dates spécifiques' : '🔄 Tous les ' + day.name + ' du mois' }}
              </span>
            </div>

            <!-- Dates spécifiques -->
            <div v-if="rule.type === 'specific'" class="space-y-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(date, dateIndex) in rule.dates"
                  :key="dateIndex"
                  class="inline-flex items-center gap-1 bg-slate-700/70 border border-slate-600 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-white"
                >
                  <span class="truncate max-w-[150px] sm:max-w-none">{{ formatDate(date) }}</span>
                  <button
                    type="button"
                    @click="removeDateFromRule(day.id, getRuleKey(rule), dateIndex)"
                    class="ml-1 w-4 h-4 rounded-full bg-slate-600 hover:bg-red-500 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <svg class="w-2.5 h-2.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex flex-col sm:flex-row gap-2">
                <select
                  v-model="newDates[`rule-${getRuleKey(rule)}`]"
                  class="flex-1 bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Sélectionner une date</option>
                  <option
                    v-for="dateOption in getAvailableDatesForDay(day.id)"
                    :key="dateOption.value"
                    :value="dateOption.value"
                  >
                    {{ dateOption.label }}
                  </option>
                </select>
                <button
                  type="button"
                  @click="addDateToRule(day.id, getRuleKey(rule))"
                  :disabled="!newDates[`rule-${getRuleKey(rule)}`] || !isDateValid(newDates[`rule-${getRuleKey(rule)}`])"
                  class="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <!-- Récurrence mensuelle -->
            <div v-if="rule.type === 'recurring_month'" class="space-y-3">
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-400 mb-1">Mois</label>
                  <select
                    v-model.number="rule.month"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option v-for="(monthName, monthNum) in months" :key="monthNum" :value="monthNum">
                      {{ monthName }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-400 mb-1">Année</label>
                  <input
                    type="number"
                    v-model.number="rule.year"
                    :min="currentYear"
                    :max="currentYear + 1"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <!-- Créneaux pour cette règle -->
            <div class="space-y-3 border-t border-slate-700/50 pt-3">
              <label class="block text-xs font-medium text-slate-400">Créneaux horaires</label>
              
              <!-- Liste des créneaux -->
              <div v-if="rule.slots && rule.slots.length > 0" class="flex flex-wrap gap-2 mb-3">
                <div
                  v-for="(slot, slotIndex) in rule.slots"
                  :key="slotIndex"
                  class="inline-flex items-center gap-1 sm:gap-2 bg-slate-700/70 border border-slate-600 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm group hover:border-red-500/50 transition-colors"
                >
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-white font-medium">{{ slot.start }}</span>
                  <span class="text-slate-400">({{ formatDuration(slot.duration) }})</span>
                  <button
                    type="button"
                    @click="removeSlotFromRule(day.id, getRuleKey(rule), slotIndex)"
                    class="ml-0.5 sm:ml-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-600 hover:bg-red-500 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Formulaire d'ajout de créneau -->
              <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-end gap-2 sm:gap-3">
                <div class="col-span-1 sm:flex-1 sm:min-w-[120px]">
                  <label class="block text-xs font-medium text-slate-400 mb-1">Heure</label>
                  <select
                    v-model="newSlots[`rule-${getRuleKey(rule)}`].start"
                    @change="handleTimeSelectChange(`rule-${getRuleKey(rule)}`)"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Heure</option>
                    <option
                      v-for="timeOption in getAvailableTimesForDay(day.id, rule)"
                      :key="timeOption.value"
                      :value="timeOption.value"
                    >
                      {{ timeOption.label }}
                    </option>
                    <option value="custom">Autre (saisie manuelle)</option>
                  </select>
                </div>
                <div
                  v-if="newSlots[`rule-${getRuleKey(rule)}`]?.start === 'custom'"
                  class="col-span-1 sm:flex-1 sm:min-w-[120px]"
                >
                  <label class="block text-xs font-medium text-slate-400 mb-1">Heure personnalisée</label>
                  <input
                    type="time"
                    v-model="newSlots[`rule-${getRuleKey(rule)}`].customTime"
                    required
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p class="text-xs text-slate-500 mt-1">Format: HH:MM (de 00:00 à 23:59, votre choix libre)</p>
                </div>
                <div class="col-span-1 sm:flex-1 sm:min-w-[140px]">
                  <label class="block text-xs font-medium text-slate-400 mb-1">Durée</label>
                  <select
                    v-model="newSlots[`rule-${getRuleKey(rule)}`].duration"
                    @change="handleDurationSelectChange(`rule-${getRuleKey(rule)}`)"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option :value="15">15 min</option>
                    <option :value="30">30 min</option>
                    <option :value="45">45 min</option>
                    <option :value="60">1h</option>
                    <option :value="90">1h30</option>
                    <option :value="120">2h</option>
                    <option value="custom">Autre (saisie manuelle)</option>
                  </select>
                </div>
                <div
                  v-if="newSlots[`rule-${getRuleKey(rule)}`]?.duration === 'custom'"
                  class="col-span-1 sm:flex-1 sm:min-w-[140px]"
                >
                  <label class="block text-xs font-medium text-slate-400 mb-1">Durée personnalisée (minutes)</label>
                  <input
                    type="number"
                    v-model.number="newSlots[`rule-${getRuleKey(rule)}`].customDuration"
                    @input="handleCustomDurationInput(`rule-${getRuleKey(rule)}`)"
                    min="1"
                    max="480"
                    step="1"
                    required
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-2 sm:px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Ex: 25"
                  />
                  <p class="text-xs text-slate-500 mt-1">Entre 1 et 480 minutes (votre choix)</p>
                </div>
                <button
                  type="button"
                  @click="addSlotToRule(day.id, getRuleKey(rule))"
                  :disabled="!isSlotValid(`rule-${getRuleKey(rule)}`)"
                  class="col-span-2 sm:col-span-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="sm:inline">Ajouter</span>
                </button>
              </div>
            </div>

            <!-- Bouton supprimer la règle -->
            <div class="flex justify-end pt-2 border-t border-slate-700/50">
              <button
                type="button"
                @click="removeRule(day.id, getRuleKey(rule))"
                class="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer cette règle
              </button>
            </div>
          </div>

          <!-- Bouton ajouter une règle pour ce jour -->
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              @click="addRule(day.id, 'specific')"
              class="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="truncate">Ajouter des dates spécifiques</span>
            </button>
            <button
              type="button"
              @click="addRule(day.id, 'recurring_month')"
              class="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-400 py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="truncate">Tous les {{ day.name }} du mois</span>
            </button>
          </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Toast de notification -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border',
          toast.type === 'success'
            ? 'bg-green-500/90 border-green-400 text-white'
            : 'bg-red-500/90 border-red-400 text-white'
        ]"
      >
        <svg v-if="toast.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import apiClient from '@/api';
import Cookies from 'js-cookie';

// Props - order_id pour avoir des paramètres distincts par commande
const props = defineProps({
  orderId: {
    type: [Number, String],
    default: null,
  },
});

// Jours de la semaine (1 = Lundi, 7 = Dimanche selon ISO)
const daysOfWeek = [
  { id: '1', name: 'Lundi', short: 'LU' },
  { id: '2', name: 'Mardi', short: 'MA' },
  { id: '3', name: 'Mercredi', short: 'ME' },
  { id: '4', name: 'Jeudi', short: 'JE' },
  { id: '5', name: 'Vendredi', short: 'VE' },
  { id: '6', name: 'Samedi', short: 'SA' },
  { id: '7', name: 'Dimanche', short: 'DI' },
];

// Mois de l'année
const months = {
  1: 'Janvier',
  2: 'Février',
  3: 'Mars',
  4: 'Avril',
  5: 'Mai',
  6: 'Juin',
  7: 'Juillet',
  8: 'Août',
  9: 'Septembre',
  10: 'Octobre',
  11: 'Novembre',
  12: 'Décembre',
};

const currentYear = new Date().getFullYear();

// Date minimale (aujourd'hui)
const minDate = ref(new Date().toISOString().split('T')[0]);

// État du composant
const isEnabled = ref(false);
const isSaving = ref(false);
const isLoading = ref(true);

// Structure de données : date_rules est un tableau de règles
// Chaque règle a un id unique pour faciliter la gestion
let nextRuleId = 1;
const dateRules = ref([]);

// État des jours étendus (accordéon)
const expandedDays = reactive({
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
  '7': false,
});

// Nouvelles dates en cours d'ajout (une par règle)
const newDates = reactive({});

// Nouveaux créneaux en cours de création (un par règle)
const newSlots = reactive({});

// Toast de notification
const toast = reactive({
  show: false,
  message: '',
  type: 'success',
});

// Helper pour le CSRF
const setCsrfHeader = () => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  if (xsrfToken) {
    apiClient.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
};

// Afficher un toast
const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;

  setTimeout(() => {
    toast.show = false;
  }, 4000);
};

// Formater la durée
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`;
  } else if (minutes === 60) {
    return '1h';
  } else if (minutes === 90) {
    return '1h30';
  } else if (minutes === 120) {
    return '2h';
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  }
};

// Formater une date
const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Vérifier si une date est valide (dans le futur ou aujourd'hui)
const isDateValid = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

// Vérifier si une date est strictement dans le passé (avant aujourd'hui)
const isDateInPast = (dateString) => {
  if (!dateString) return true;
  const selectedDate = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today;
};

// Vérifier si un mois récurrent est complètement dans le passé
const isRecurringMonthInPast = (month, year, dayOfWeek) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Dernier jour du mois
  const lastDayOfMonth = new Date(year, month, 0); // month est 1-12, donc on utilise month comme param pour obtenir le dernier jour du mois précédent (qui est en fait le mois actuel)
  
  // Si le dernier jour du mois est avant aujourd'hui, le mois est complètement passé
  if (lastDayOfMonth < today) {
    return true;
  }
  
  // Vérifier s'il reste au moins un jour de ce type dans le mois
  const firstDayOfMonth = new Date(year, month - 1, 1);
  let currentDate = new Date(Math.max(today.getTime(), firstDayOfMonth.getTime()));
  const endOfMonth = new Date(year, month, 0);
  
  while (currentDate <= endOfMonth) {
    const dayISO = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
    if (dayISO === parseInt(dayOfWeek)) {
      return false; // Il reste au moins un jour de ce type
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return true; // Aucun jour de ce type restant
};

// Obtenir les dates disponibles pour un jour de la semaine donné
// Retourne les prochaines dates correspondant à ce jour (ex: tous les lundis)
const getAvailableDatesForDay = (dayId) => {
  const targetDayOfWeek = parseInt(dayId); // 1 = Lundi, 7 = Dimanche (format ISO)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Trouver le prochain jour correspondant
  const currentDayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc. (format JavaScript)
  // Convertir en format ISO (1 = Lundi, 7 = Dimanche)
  const currentDayISO = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
  
  // Calculer le nombre de jours à ajouter pour atteindre le jour cible
  let daysToAdd = targetDayOfWeek - currentDayISO;
  if (daysToAdd < 0) {
    daysToAdd += 7; // Semaine suivante
  }
  // Si daysToAdd === 0, c'est aujourd'hui et c'est le bon jour, on l'inclut
  
  const firstDate = new Date(today);
  firstDate.setDate(today.getDate() + daysToAdd);
  
  const availableDates = [];
  const maxDates = 12; // Afficher les 12 prochaines dates (environ 3 mois)
  
  for (let i = 0; i < maxDates; i++) {
    const date = new Date(firstDate);
    date.setDate(firstDate.getDate() + (i * 7));
    
    // Vérifier que la date est dans le futur ou aujourd'hui
    if (date >= today) {
      const dateString = date.toISOString().split('T')[0];
      
      // Vérifier que la date correspond bien au jour de la semaine cible
      const dateDayOfWeek = date.getDay();
      const dateDayISO = dateDayOfWeek === 0 ? 7 : dateDayOfWeek;
      
      if (dateDayISO === targetDayOfWeek) {
        const label = date.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
        
        availableDates.push({
          value: dateString,
          label: label.charAt(0).toUpperCase() + label.slice(1), // Capitaliser la première lettre
        });
      }
    }
  }
  
  return availableDates;
};

// Obtenir les heures disponibles pour un jour et une règle donnés
// Les heures sont limitées entre 6h et 22h
// Si plusieurs dates sont sélectionnées pour le même jour, les heures commencent toujours à 6h
// Les créneaux avant l'heure actuelle seront automatiquement réservés pour les dates futures
const getAvailableTimesForDay = (dayId, rule) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];
  
  // Vérifier si la règle a des dates spécifiques
  let hasTodayDate = false;
  let hasMultipleDates = false;
  if (rule.type === 'specific' && rule.dates && Array.isArray(rule.dates)) {
    hasTodayDate = rule.dates.includes(todayString);
    hasMultipleDates = rule.dates.length > 1;
  }
  
  // Si c'est une récurrence mensuelle, vérifier si aujourd'hui correspond
  let isTodayInRecurringMonth = false;
  let hasMultipleDaysInMonth = false;
  if (rule.type === 'recurring_month') {
    const targetDayOfWeek = parseInt(dayId); // 1 = Lundi, 7 = Dimanche
    const currentDayOfWeek = today.getDay();
    const currentDayISO = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();
    
    isTodayInRecurringMonth = (
      targetDayOfWeek === currentDayISO &&
      rule.month === currentMonth &&
      rule.year === currentYear
    );
    
    // Vérifier s'il y a plusieurs jours dans le mois
    if (rule.month === currentMonth && rule.year === currentYear) {
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
      let dayCount = 0;
      for (let day = 1; day <= lastDayOfMonth; day++) {
        const testDate = new Date(currentYear, currentMonth - 1, day);
        const testDayISO = testDate.getDay() === 0 ? 7 : testDate.getDay();
        if (testDayISO === targetDayOfWeek) {
          dayCount++;
        }
      }
      hasMultipleDaysInMonth = dayCount > 1;
    } else {
      // Si c'est un mois futur, il y aura forcément plusieurs jours
      hasMultipleDaysInMonth = true;
    }
  }
  
  // Heures limites : de 6h à 22h
  const minHour = 6;
  const maxHour = 22;
  
  // Si plusieurs dates sont sélectionnées, toujours commencer à 6h
  // Les créneaux avant l'heure actuelle seront automatiquement réservés pour les dates futures
  const useCurrentTime = !hasMultipleDates && !hasMultipleDaysInMonth && (hasTodayDate || isTodayInRecurringMonth);
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Arrondir les minutes à l'intervalle de 15 minutes supérieur
  let startMinute = 0;
  let startHour = minHour;
  
  if (useCurrentTime) {
    // Si c'est une seule date (aujourd'hui), utiliser l'heure actuelle
    if (currentHour < minHour) {
      startHour = minHour;
      startMinute = 0;
    } else if (currentHour > maxHour) {
      // Si on est après 22h, ne pas afficher d'heures
      return [];
    } else {
      // Arrondir à l'intervalle de 15 minutes supérieur
      const roundedMinute = Math.ceil(currentMinute / 15) * 15;
      if (roundedMinute >= 60) {
        startHour = currentHour + 1;
        startMinute = 0;
      } else {
        startHour = currentHour;
        startMinute = roundedMinute;
      }
      
      // S'assurer qu'on ne dépasse pas 22h
      if (startHour > maxHour) {
        return [];
      }
      
      // S'assurer qu'on ne commence pas avant 6h
      if (startHour < minHour) {
        startHour = minHour;
        startMinute = 0;
      }
    }
  }
  // Si plusieurs dates, startHour reste à minHour (6h) et startMinute à 0
  
  const availableTimes = [];
  
  // Générer les heures de startHour:startMinute à 22:00 par intervalles de 15 minutes
  const endHour = maxHour;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const minuteStart = hour === startHour ? startMinute : 0;
    const minuteEnd = hour === endHour ? 0 : 60; // À 22h, on s'arrête à 22:00
    
    for (let minute = minuteStart; minute < minuteEnd; minute += 15) {
      const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const timeLabel = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      availableTimes.push({
        value: timeString,
        label: timeLabel,
      });
    }
  }
  
  return availableTimes;
};

// Calculer l'heure de fin d'un créneau
const getSlotEnd = (start, duration) => {
  const [hours, minutes] = start.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + duration * 60000);
  return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
};

// Vérifier si deux créneaux se chevauchent
const slotsOverlap = (slot1, slot2) => {
  const slot1Start = slot1.start;
  const slot1End = getSlotEnd(slot1.start, slot1.duration);
  const slot2Start = slot2.start;
  const slot2End = getSlotEnd(slot2.start, slot2.duration);
  
  // Deux créneaux se chevauchent si : (start1 < end2) && (end1 > start2)
  return slot1Start < slot2End && slot1End > slot2Start;
};

// Obtenir les règles pour un jour donné
const getDayRules = (dayId) => {
  return dateRules.value.filter(rule => rule.day_of_week == dayId);
};

// Obtenir l'index global d'une règle dans dateRules.value
const getGlobalRuleIndex = (rule) => {
  return dateRules.value.findIndex(r => r === rule);
};

// Obtenir la clé unique d'une règle
const getRuleKey = (rule) => {
  return rule.id || rule._id || dateRules.value.findIndex(r => r === rule);
};

// Obtenir un résumé des règles pour un jour
const getDayRulesSummary = (dayId) => {
  const rules = getDayRules(dayId);
  if (rules.length === 0) {
    return 'Aucune règle configurée';
  }
  const count = rules.length;
  return `${count} règle${count > 1 ? 's' : ''} configurée${count > 1 ? 's' : ''}`;
};

// Toggle l'activation globale
const toggleEnabled = () => {
  isEnabled.value = !isEnabled.value;
  // Réinitialiser l'état des jours étendus quand on désactive
  if (!isEnabled.value) {
    Object.keys(expandedDays).forEach(dayId => {
      expandedDays[dayId] = false;
    });
  }
};

// Toggle l'état d'un jour (ouvrir/fermer l'accordéon)
// Ferme automatiquement les autres jours pour un comportement accordion
const toggleDay = (dayId) => {
  const isCurrentlyOpen = expandedDays[dayId];
  
  // Sauvegarder la position de scroll actuelle
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  // Fermer tous les autres jours
  Object.keys(expandedDays).forEach(id => {
    if (id !== dayId) {
      expandedDays[id] = false;
    }
  });
  
  // Toggle le jour cliqué
  expandedDays[dayId] = !isCurrentlyOpen;
  
  // Si on vient d'ouvrir le jour, maintenir la position de scroll
  // et scroller légèrement pour garder le jour visible
  if (!isCurrentlyOpen) {
    // Attendre que l'animation de transition commence
    setTimeout(() => {
      const dayElement = document.querySelector(`[data-day-id="${dayId}"]`);
      if (dayElement) {
        const rect = dayElement.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        
        // Scroller seulement si le jour n'est pas complètement visible
        // On garde le header du jour visible en haut avec un petit offset
        if (rect.top < 80 || rect.bottom > window.innerHeight) {
          window.scrollTo({
            top: elementTop - 80, // 80px d'offset pour le header et la navigation
            behavior: 'smooth'
          });
        }
      }
    }, 50);
  }
};

// Ajouter une nouvelle règle pour un jour
const addRule = (dayId, type) => {
  // Ouvrir automatiquement le jour si ce n'est pas déjà fait
  if (!expandedDays[dayId]) {
    expandedDays[dayId] = true;
  }
  
  const ruleId = nextRuleId++;
  const newRule = {
    id: ruleId,
    day_of_week: parseInt(dayId),
    type: type,
    slots: [],
  };

  if (type === 'specific') {
    newRule.dates = [];
  } else if (type === 'recurring_month') {
    newRule.month = new Date().getMonth() + 1; // Mois actuel (1-12)
    newRule.year = currentYear;
  }

  dateRules.value.push(newRule);
  
  // Initialiser les nouveaux slots pour cette règle
  const ruleKey = `rule-${ruleId}`;
  newSlots[ruleKey] = { start: '', customTime: '', duration: 30, customDuration: null };
  if (type === 'specific') {
    newDates[ruleKey] = '';
  }
};

// Supprimer une règle
const removeRule = (dayId, ruleId) => {
  const rule = dateRules.value.find(r => (r.id || r._id) == ruleId);
  if (rule && rule.day_of_week == dayId) {
    const ruleIndex = dateRules.value.findIndex(r => r === rule);
    if (ruleIndex !== -1) {
      dateRules.value.splice(ruleIndex, 1);
      // Nettoyer les clés de newSlots et newDates
      const ruleKey = `rule-${ruleId}`;
      delete newSlots[ruleKey];
      delete newDates[ruleKey];
    }
  }
};

// Ajouter une date à une règle de type "specific"
const addDateToRule = (dayId, ruleId) => {
  const rule = dateRules.value.find(r => (r.id || r._id) == ruleId);
  if (!rule || rule.day_of_week != dayId || rule.type !== 'specific') return;
  
  const ruleKey = `rule-${ruleId}`;
  const newDate = newDates[ruleKey];

  if (!newDate) return;

  // Vérifier que la date est valide (dans le futur)
  if (!isDateValid(newDate)) {
    showToast('Veuillez sélectionner une date future !', 'error');
    return;
  }

  // Vérifier si la date existe déjà
  if (rule.dates && rule.dates.includes(newDate)) {
    showToast('Cette date est déjà ajoutée !', 'error');
    return;
  }

  if (!rule.dates) {
    rule.dates = [];
  }
  rule.dates.push(newDate);
  rule.dates.sort(); // Trier les dates chronologiquement

  newDates[ruleKey] = '';
};

// Supprimer une date d'une règle
const removeDateFromRule = (dayId, ruleId, dateIndex) => {
  const rule = dateRules.value.find(r => (r.id || r._id) == ruleId);
  if (rule && rule.day_of_week == dayId && rule.dates) {
    rule.dates.splice(dateIndex, 1);
  }
};

// Vérifier si un créneau est passé pour aujourd'hui
const isSlotPassedForToday = (slotStart, rule) => {
  const now = new Date();
  const todayString = now.toISOString().split('T')[0];
  
  // Vérifier si la règle concerne aujourd'hui
  let concernsToday = false;
  
  if (rule.type === 'specific' && rule.dates && rule.dates.includes(todayString)) {
    concernsToday = true;
  } else if (rule.type === 'recurring_month') {
    const currentDayISO = now.getDay() === 0 ? 7 : now.getDay();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    if (rule.day_of_week == currentDayISO && rule.month === currentMonth && rule.year === currentYear) {
      concernsToday = true;
    }
  }
  
  if (!concernsToday) return false;
  
  // Comparer l'heure du créneau avec l'heure actuelle
  const [hours, minutes] = slotStart.split(':').map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  
  return slotTime <= now;
};

// Gérer le changement de sélection dans le select d'heure
const handleTimeSelectChange = (ruleKey) => {
  const slot = newSlots[ruleKey];
  if (!slot) return;
  if (slot.start !== 'custom') {
    slot.customTime = '';
  } else {
    if (!slot.customTime) {
      slot.customTime = '09:00';
    }
  }
};

const handleDurationSelectChange = (ruleKey) => {
  const slot = newSlots[ruleKey];
  if (!slot) return;
  if (slot.duration !== 'custom' && typeof slot.duration === 'string') {
    slot.duration = parseInt(slot.duration, 10);
  }
  if (slot.duration !== 'custom') {
    slot.customDuration = null;
  } else {
    if (slot.customDuration === null || slot.customDuration === undefined) {
      slot.customDuration = 30;
    }
  }
};

const handleCustomDurationInput = (ruleKey) => {
  const slot = newSlots[ruleKey];
  if (!slot || slot.customDuration === null || slot.customDuration === undefined) return;
  if (slot.customDuration < 1) {
    slot.customDuration = 1;
  } else if (slot.customDuration > 480) {
    slot.customDuration = 480;
  }
};

const isSlotValid = (ruleKey) => {
  const slot = newSlots[ruleKey];
  if (!slot) return false;
  let hourValid = false;
  if (slot.start === 'custom') {
    hourValid = !!slot.customTime && slot.customTime.trim() !== '';
  } else {
    hourValid = !!slot.start && slot.start.trim() !== '';
  }
  let durationValid = false;
  if (slot.duration === 'custom') {
    durationValid = slot.customDuration !== null && slot.customDuration !== undefined && slot.customDuration >= 1 && slot.customDuration <= 480;
  } else {
    const durationValue = typeof slot.duration === 'string' ? parseInt(slot.duration, 10) : slot.duration;
    durationValid = !!durationValue && durationValue > 0 && durationValue <= 480;
  }
  return hourValid && durationValid;
};

// Ajouter un créneau à une règle
const addSlotToRule = (dayId, ruleId) => {
  const rule = dateRules.value.find(r => (r.id || r._id) == ruleId);
  if (!rule || rule.day_of_week != dayId) return;
  
  const ruleKey = `rule-${ruleId}`;
  const newSlot = newSlots[ruleKey];

  if (!newSlot) return;

  let slotStart = newSlot.start;
  if (slotStart === 'custom') {
    if (!newSlot.customTime || newSlot.customTime.trim() === '') {
      showToast('Veuillez saisir une heure personnalisée', 'error');
      return;
    }
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newSlot.customTime)) {
      showToast('Format d\'heure invalide. Utilisez HH:MM (ex: 09:30 ou 23:45)', 'error');
      return;
    }
    slotStart = newSlot.customTime;
  }
  
  if (!slotStart || slotStart === 'custom') return;

  let slotDuration = newSlot.duration;
  if (slotDuration === 'custom') {
    if (!newSlot.customDuration || newSlot.customDuration < 1 || newSlot.customDuration > 480) {
      showToast('Veuillez saisir une durée valide (entre 1 et 480 minutes)', 'error');
      return;
    }
    slotDuration = newSlot.customDuration;
  } else {
    slotDuration = typeof slotDuration === 'string' ? parseInt(slotDuration, 10) : slotDuration;
  }
  
  if (!slotDuration || slotDuration < 1 || slotDuration > 480) {
    showToast('La durée doit être entre 1 et 480 minutes', 'error');
    return;
  }

  if (isSlotPassedForToday(slotStart, rule)) {
    showToast('⚠️ Cette heure est déjà passée pour aujourd\'hui. Le créneau sera disponible uniquement pour les dates futures.', 'error');
    // On continue quand même l'ajout car le créneau peut être valide pour d'autres dates
  }

  if (rule.slots && rule.slots.some(slot => slot.start === slotStart && slot.duration === slotDuration)) {
    showToast('Ce créneau existe déjà !', 'error');
    return;
  }

  const slotToAdd = { start: slotStart, duration: slotDuration };
  if (rule.slots && rule.slots.some(existingSlot => slotsOverlap(slotToAdd, existingSlot))) {
    showToast('Ce créneau chevauche avec un créneau existant !', 'error');
    return;
  }

  if (!rule.slots) {
    rule.slots = [];
  }
  rule.slots.push({
    start: slotStart,
    duration: slotDuration,
  });

  // Trier par heure de début
  rule.slots.sort((a, b) => a.start.localeCompare(b.start));

  // Réinitialiser le formulaire
  if (newSlots[ruleKey]) {
    newSlots[ruleKey].start = '';
    newSlots[ruleKey].customTime = '';
    newSlots[ruleKey].duration = 30;
    newSlots[ruleKey].customDuration = null;
  }
};

// Supprimer un créneau d'une règle
const removeSlotFromRule = (dayId, ruleId, slotIndex) => {
  const rule = dateRules.value.find(r => (r.id || r._id) == ruleId);
  if (rule && rule.day_of_week == dayId && rule.slots) {
    rule.slots.splice(slotIndex, 1);
  }
};

// Charger les paramètres existants pour la commande spécifique
const loadSettings = async () => {
  isLoading.value = true;
  
  // Réinitialiser les valeurs avant de charger
  dateRules.value = [];
  
  try {
    // Construire l'URL avec order_id si fourni
    let url = '/api/appointment-settings';
    if (props.orderId) {
      url += `?order_id=${props.orderId}`;
    }
    
    const response = await apiClient.get(url);
    const settings = response.data.settings;

    console.log('[AppointmentSettings] loadSettings - Réponse reçue:', response.data);
    console.log('[AppointmentSettings] loadSettings - settings.weekly_availability:', settings?.weekly_availability);

    if (settings) {
      isEnabled.value = settings.is_enabled || false;

      // Charger les règles de dates
      if (settings.weekly_availability && settings.weekly_availability.date_rules) {
        let totalPastDatesRemoved = 0;
        let rulesToRemove = [];
        
        dateRules.value = settings.weekly_availability.date_rules.map((rule, index) => {
          // Générer un ID si la règle n'en a pas
          if (!rule.id && !rule._id) {
            rule.id = nextRuleId++;
          } else if (rule._id && !rule.id) {
            rule.id = rule._id;
          }
          
          // Mettre à jour nextRuleId pour éviter les conflits
          if (rule.id >= nextRuleId) {
            nextRuleId = rule.id + 1;
          }
          
          // Initialiser newSlots et newDates pour chaque règle
          const ruleKey = `rule-${rule.id}`;
          newSlots[ruleKey] = { start: '', customTime: '', duration: 30, customDuration: null };
          if (rule.type === 'specific') {
            newDates[ruleKey] = '';
          }
          
          const processedRule = {
            ...rule,
            // S'assurer que les dates sont des strings et filtrer les dates passées
            dates: rule.dates ? rule.dates.map(d => String(d)).filter(d => !isDateInPast(d)) : [],
            slots: rule.slots || [],
          };
          
          // Compter les dates supprimées
          if (rule.type === 'specific' && rule.dates) {
            const removed = rule.dates.length - processedRule.dates.length;
            totalPastDatesRemoved += removed;
            
            // Marquer la règle pour suppression si elle n'a plus de dates
            if (processedRule.dates.length === 0) {
              rulesToRemove.push(index);
            }
          }
          
          // Vérifier si une règle récurrente est complètement dans le passé
          if (rule.type === 'recurring_month') {
            if (isRecurringMonthInPast(rule.month, rule.year, rule.day_of_week)) {
              rulesToRemove.push(index);
            }
          }
          
          return processedRule;
        });
        
        // Supprimer les règles vides ou passées (en partant de la fin pour éviter les décalages d'index)
        rulesToRemove.sort((a, b) => b - a).forEach(index => {
          dateRules.value.splice(index, 1);
        });
        
        // Afficher un message si des dates ont été nettoyées
        if (totalPastDatesRemoved > 0 || rulesToRemove.length > 0) {
          console.log(`[AppointmentSettings] Nettoyage automatique : ${totalPastDatesRemoved} date(s) passée(s) et ${rulesToRemove.length} règle(s) obsolète(s) supprimée(s).`);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
    showToast('Erreur lors du chargement des paramètres.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Sauvegarder les paramètres pour la commande spécifique
const saveSettings = async () => {
  isSaving.value = true;
  try {
    setCsrfHeader();

    console.log('[AppointmentSettings] Sauvegarde - dateRules brutes:', JSON.parse(JSON.stringify(dateRules.value)));

    // Vérifier qu'il y a des règles avec des dates ou des mois sélectionnés
    const rulesWithIssues = dateRules.value.filter(rule => {
      if (rule.type === 'specific') {
        return !rule.dates || rule.dates.length === 0;
      }
      if (rule.type === 'recurring_month') {
        return !rule.month || !rule.year;
      }
      return false;
    });

    if (rulesWithIssues.length > 0) {
      console.warn('[AppointmentSettings] Règles incomplètes détectées:', rulesWithIssues);
      showToast('Attention: Certaines règles n\'ont pas de dates sélectionnées et seront ignorées.', 'error');
    }

    // Filtrer les règles valides (nettoyer les dates passées et règles obsolètes)
    const validRules = dateRules.value
      .map(rule => {
        const ruleData = {
          day_of_week: rule.day_of_week,
          type: rule.type,
          slots: rule.slots || [],
        };
        
        if (rule.type === 'specific') {
          // Filtrer les dates passées avant la sauvegarde
          ruleData.dates = (rule.dates || []).filter(date => !isDateInPast(date));
        } else if (rule.type === 'recurring_month') {
          ruleData.month = rule.month;
          ruleData.year = rule.year;
        }
        
        return ruleData;
      })
      .filter(rule => {
        // Exclure les règles spécifiques sans dates
        if (rule.type === 'specific' && (!rule.dates || rule.dates.length === 0)) {
          console.log('[AppointmentSettings] Règle exclue (pas de dates):', rule);
          return false;
        }
        // Exclure les règles sans créneaux
        if (!rule.slots || rule.slots.length === 0) {
          console.log('[AppointmentSettings] Règle exclue (pas de créneaux):', rule);
          return false;
        }
        // Exclure les règles récurrentes complètement dans le passé
        if (rule.type === 'recurring_month') {
          if (isRecurringMonthInPast(rule.month, rule.year, rule.day_of_week)) {
            console.log('[AppointmentSettings] Règle exclue (mois passé):', rule);
            return false;
          }
        }
        return true;
      });

    console.log('[AppointmentSettings] Règles valides après filtrage:', validRules);

    // Préparer les données avec order_id si fourni
    const payload = {
      order_id: props.orderId ? parseInt(props.orderId) : null,
      is_enabled: isEnabled.value,
      weekly_availability: {
        date_rules: validRules,
      },
    };

    console.log('[AppointmentSettings] Payload envoyé:', payload);

    const response = await apiClient.put('/api/appointment-settings', payload);
    console.log('[AppointmentSettings] Réponse du serveur:', response.data);

    // ✅ MODIFIÉ : Message de succès supprimé à la demande de l'utilisateur
    // showToast('Configuration enregistrée avec succès !', 'success');

    // Recharger pour synchroniser l'état local avec le serveur
    await loadSettings();

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showToast(error.response?.data?.message || 'Erreur lors de la sauvegarde.', 'error');
  } finally {
    isSaving.value = false;
    delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
  }
};

// Charger les paramètres au montage
onMounted(() => {
  loadSettings();
});

// Recharger les paramètres quand order_id change
watch(
  () => props.orderId,
  (newOrderId, oldOrderId) => {
    if (newOrderId !== oldOrderId) {
      console.log('AppointmentSettings: order_id changed, reloading settings...', { newOrderId, oldOrderId });
      loadSettings();
    }
  }
);

// Exposer la fonction saveSettings pour qu'elle puisse être appelée depuis le parent
defineExpose({
  saveSettings,
  isSaving,
});
</script>

<style scoped>
/* Styles pour le date input */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
