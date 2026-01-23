<template>
  <div>
    <!-- Header seulement si pas dans une modale (pour compatibilité) -->
    <div v-if="showHeader" class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span class="text-2xl">📅</span>
          Mes Rendez-vous
        </h2>
        <p class="text-sm text-slate-400 mt-1">Gérez vos rendez-vous et libérez des créneaux si nécessaire.</p>
      </div>
    </div>

    <!-- Bouton Importer tous les rendez-vous (visible seulement s'il y en a à télécharger) -->
    <div v-if="notDownloadedCount > 0 && !isLoading && appointments.length > 0" class="mb-4">
      <button
        @click="downloadAllAppointments"
        :disabled="isDownloadingAll"
        class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25 disabled:shadow-none"
      >
        <svg v-if="isDownloadingAll" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Importer {{ notDownloadedCount }} rendez-vous dans mon agenda</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      <p class="text-slate-400 mt-4 text-sm">Chargement des rendez-vous...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="appointments.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p class="text-slate-400">Aucun rendez-vous pour le moment.</p>
    </div>

    <!-- Appointments Sections -->
    <div v-else class="space-y-4">
      <!-- Section: Rendez-vous du jour -->
      <div v-if="todayAppointments.length > 0" class="rounded-xl border border-slate-600 overflow-hidden">
        <button
          @click="toggleSection('today')"
          class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 hover:from-emerald-500/30 hover:to-emerald-600/20 transition-all duration-200"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">🌟</span>
            <span class="text-white font-semibold text-lg">Mes Rendez-vous du jour</span>
            <span class="bg-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-sm font-medium">
              {{ todayAppointments.length }}
            </span>
          </div>
          <svg
            :class="[
              'w-5 h-5 text-slate-400 transition-transform duration-200',
              expandedSections.today ? 'rotate-180' : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="expandedSections.today" class="p-4 space-y-3 bg-slate-800/30">
          <AppointmentCard
            v-for="appointment in todayAppointments"
            :key="appointment.id"
            :appointment="appointment"
            :is-cancelling="isCancelling"
            :is-downloading="downloadingId"
            @cancel="openCancelModal"
            @download="downloadAppointment"
          />
        </div>
      </div>

      <!-- Section: Rendez-vous de demain -->
      <div v-if="tomorrowAppointments.length > 0" class="rounded-xl border border-slate-600 overflow-hidden">
        <button
          @click="toggleSection('tomorrow')"
          class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-sky-500/20 to-sky-600/10 hover:from-sky-500/30 hover:to-sky-600/20 transition-all duration-200"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">📆</span>
            <span class="text-white font-semibold text-lg">Mes Rendez-vous de demain</span>
            <span class="bg-sky-500/30 text-sky-400 px-2.5 py-0.5 rounded-full text-sm font-medium">
              {{ tomorrowAppointments.length }}
            </span>
          </div>
          <svg
            :class="[
              'w-5 h-5 text-slate-400 transition-transform duration-200',
              expandedSections.tomorrow ? 'rotate-180' : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="expandedSections.tomorrow" class="p-4 space-y-3 bg-slate-800/30">
          <AppointmentCard
            v-for="appointment in tomorrowAppointments"
            :key="appointment.id"
            :appointment="appointment"
            :is-cancelling="isCancelling"
            :is-downloading="downloadingId"
            @cancel="openCancelModal"
            @download="downloadAppointment"
          />
        </div>
      </div>

      <!-- Section: Rendez-vous d'après-demain -->
      <div v-if="dayAfterTomorrowAppointments.length > 0" class="rounded-xl border border-slate-600 overflow-hidden">
        <button
          @click="toggleSection('dayAfterTomorrow')"
          class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-500/20 to-violet-600/10 hover:from-violet-500/30 hover:to-violet-600/20 transition-all duration-200"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">📅</span>
            <span class="text-white font-semibold text-lg">Mes Rendez-vous d'après-demain</span>
            <span class="bg-violet-500/30 text-violet-400 px-2.5 py-0.5 rounded-full text-sm font-medium">
              {{ dayAfterTomorrowAppointments.length }}
            </span>
          </div>
          <svg
            :class="[
              'w-5 h-5 text-slate-400 transition-transform duration-200',
              expandedSections.dayAfterTomorrow ? 'rotate-180' : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="expandedSections.dayAfterTomorrow" class="p-4 space-y-3 bg-slate-800/30">
          <AppointmentCard
            v-for="appointment in dayAfterTomorrowAppointments"
            :key="appointment.id"
            :appointment="appointment"
            :is-cancelling="isCancelling"
            :is-downloading="downloadingId"
            @cancel="openCancelModal"
            @download="downloadAppointment"
          />
        </div>
      </div>

      <!-- Section: Rendez-vous suivants (groupés par date) -->
      <div
        v-if="Object.keys(futureAppointmentsGrouped).length > 0"
        class="rounded-xl border border-slate-600 overflow-hidden"
      >
        <button
          @click="toggleSection('future')"
          class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 transition-all duration-200"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">🗓️</span>
            <span class="text-white font-semibold text-lg">Mes Rendez-vous suivants</span>
            <span class="bg-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-full text-sm font-medium">
              {{ futureAppointmentsCount }}
            </span>
          </div>
          <svg
            :class="[
              'w-5 h-5 text-slate-400 transition-transform duration-200',
              expandedSections.future ? 'rotate-180' : '',
            ]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="expandedSections.future" class="bg-slate-800/30">
          <!-- Sous-sections par date -->
          <div
            v-for="(dateAppointments, dateKey) in futureAppointmentsGrouped"
            :key="dateKey"
            class="border-t border-slate-700 first:border-t-0"
          >
            <button
              @click="toggleDateSection(dateKey)"
              class="w-full flex items-center justify-between p-3 pl-6 hover:bg-slate-700/30 transition-colors"
            >
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-white font-medium">{{ formatDateLabel(dateKey) }}</span>
                <span class="bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ dateAppointments.length }} RDV
                </span>
              </div>
              <svg
                :class="[
                  'w-4 h-4 text-slate-400 transition-transform duration-200',
                  expandedDateSections[dateKey] ? 'rotate-180' : '',
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="expandedDateSections[dateKey]" class="p-4 pl-8 space-y-3 bg-slate-900/20">
              <AppointmentCard
                v-for="appointment in dateAppointments"
                :key="appointment.id"
                :appointment="appointment"
                :is-cancelling="isCancelling"
                :is-downloading="downloadingId"
                :show-date="false"
                @cancel="openCancelModal"
                @download="downloadAppointment"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun rendez-vous à venir -->
      <div
        v-if="
          todayAppointments.length === 0 &&
          tomorrowAppointments.length === 0 &&
          dayAfterTomorrowAppointments.length === 0 &&
          Object.keys(futureAppointmentsGrouped).length === 0
        "
        class="text-center py-8"
      >
        <svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="text-slate-400">Aucun rendez-vous à venir.</p>
      </div>
    </div>

    <!-- Toast de notification -->
    <div
      v-if="toast.show"
      :class="[
        'fixed bottom-6 right-6 p-4 rounded-lg shadow-lg text-white z-50 transition-all duration-300 transform',
        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500',
      ]"
    >
      {{ toast.message }}
    </div>

    <!-- Modal de confirmation d'annulation -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showCancelModal"
          class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          @click.self="showCancelModal = false"
        >
          <div class="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden">
            <!-- Header -->
            <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-red-500/10 to-orange-500/10">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Annuler le rendez-vous ?</h3>
                  <p class="text-sm text-slate-400 mt-1">Cette action est irréversible</p>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div v-if="appointmentToCancel" class="space-y-4">
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-white font-semibold">{{ appointmentToCancel.visitor_name }}</p>
                      <p class="text-slate-400 text-sm">{{ appointmentToCancel.visitor_email }}</p>
                    </div>
                  </div>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center gap-2 text-slate-300">
                      <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{{ formatDate(appointmentToCancel.start_time) }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-slate-300">
                      <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{{ formatTime(appointmentToCancel.start_time) }} - {{ formatTime(appointmentToCancel.end_time) }}</span>
                    </div>
                  </div>
                </div>

                <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p class="text-yellow-400 text-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Le créneau sera automatiquement libéré et disponible pour d'autres visiteurs.
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 mt-6">
                <button
                  @click="showCancelModal = false"
                  :disabled="isCancelling !== null"
                  class="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Non, garder le rendez-vous
                </button>
                <button
                  @click="cancelAppointment"
                  :disabled="isCancelling !== null"
                  class="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 disabled:shadow-none"
                >
                  <svg
                    v-if="isCancelling === appointmentToCancel?.id"
                    class="animate-spin h-5 w-5"
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
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {{ isCancelling === appointmentToCancel?.id ? 'Annulation...' : 'Oui, annuler' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, onMounted, watch } from "vue";
  import apiClient from "@/api";
  import Cookies from "js-cookie";
  import AppointmentCard from "./AppointmentCard.vue";

  // Props - order_id pour filtrer les rendez-vous par commande
  const props = defineProps({
    orderId: {
      type: [Number, String],
      default: null,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  });

  // État du composant
  const appointments = ref([]);
  const isLoading = ref(true);
  const isCancelling = ref(null);
  const showCancelModal = ref(false);
  const appointmentToCancel = ref(null);
  
  // État pour le téléchargement
  const isDownloadingAll = ref(false);
  const downloadingId = ref(null);
  const notDownloadedCount = ref(0);

  // État des sections dépliables
  const expandedSections = reactive({
    today: true,
    tomorrow: false,
    dayAfterTomorrow: false,
    future: false,
  });

  // État des sous-sections par date (pour les rendez-vous suivants)
  const expandedDateSections = reactive({});

  // Toggle une section principale
  const toggleSection = (section) => {
    expandedSections[section] = !expandedSections[section];
  };

  // Toggle une sous-section par date
  const toggleDateSection = (dateKey) => {
    expandedDateSections[dateKey] = !expandedDateSections[dateKey];
  };

  // Helpers pour les dates
  const getStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getToday = () => getStartOfDay(new Date());

  const getTomorrow = () => {
    const d = getToday();
    d.setDate(d.getDate() + 1);
    return d;
  };

  const getDayAfterTomorrow = () => {
    const d = getToday();
    d.setDate(d.getDate() + 2);
    return d;
  };

  const getDateKey = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // Computed: Rendez-vous du jour (confirmés uniquement, non annulés)
  const todayAppointments = computed(() => {
    const today = getToday();
    const tomorrow = getTomorrow();
    return appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= today && aptDate < tomorrow && apt.status === "confirmed";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  // Computed: Rendez-vous de demain (confirmés uniquement, non annulés)
  const tomorrowAppointments = computed(() => {
    const tomorrow = getTomorrow();
    const dayAfter = getDayAfterTomorrow();
    return appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= tomorrow && aptDate < dayAfter && apt.status === "confirmed";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  // Computed: Rendez-vous d'après-demain (confirmés uniquement, non annulés)
  const dayAfterTomorrowAppointments = computed(() => {
    const dayAfter = getDayAfterTomorrow();
    const dayAfterPlus1 = new Date(dayAfter);
    dayAfterPlus1.setDate(dayAfterPlus1.getDate() + 1);
    return appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= dayAfter && aptDate < dayAfterPlus1 && apt.status === "confirmed";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  // Computed: Rendez-vous suivants groupés par date (confirmés uniquement, non annulés)
  const futureAppointmentsGrouped = computed(() => {
    const dayAfter = getDayAfterTomorrow();
    const dayAfterPlus1 = new Date(dayAfter);
    dayAfterPlus1.setDate(dayAfterPlus1.getDate() + 1);

    const futureApts = appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= dayAfterPlus1 && apt.status === "confirmed";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    // Grouper par date
    const grouped = {};
    futureApts.forEach((apt) => {
      const dateKey = getDateKey(apt.start_time);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(apt);
    });

    return grouped;
  });

  // Computed: Nombre total de rendez-vous suivants
  const futureAppointmentsCount = computed(() => {
    return Object.values(futureAppointmentsGrouped.value).reduce((total, apts) => total + apts.length, 0);
  });

  // Formater le label d'une date pour les sous-sections
  const formatDateLabel = (dateKey) => {
    const date = new Date(dateKey + "T12:00:00"); // Ajouter l'heure pour éviter les problèmes de timezone
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Debug: Watcher pour surveiller les changements de appointments
  watch(
    appointments,
    (newVal, oldVal) => {
      console.log("[MyAppointments] appointments changed:", {
        oldLength: oldVal?.length || 0,
        newLength: newVal?.length || 0,
        newValue: newVal,
      });
    },
    { deep: true },
  );

  // Toast de notification
  const toast = reactive({
    show: false,
    message: "",
    type: "success",
  });

  // Helper pour le CSRF
  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  };

  // Afficher un toast
  const showToast = (message, type = "success") => {
    toast.message = message;
    toast.type = type;
    toast.show = true;

    setTimeout(() => {
      toast.show = false;
    }, 4000);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  // Formater l'heure
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  // Formater la durée
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}min`;
    } else if (minutes === 60) {
      return "1h";
    } else if (minutes === 90) {
      return "1h30";
    } else if (minutes === 120) {
      return "2h";
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status) => {
    const labels = {
      confirmed: "Confirmé",
      cancelled: "Annulé",
      completed: "Terminé",
    };
    return labels[status] || status;
  };

  // Vérifier si le rendez-vous est à venir
  const isUpcoming = (dateString) => {
    const appointmentDate = new Date(dateString);
    return appointmentDate > new Date();
  };

  // Charger les rendez-vous
  const loadAppointments = async () => {
    isLoading.value = true;
    try {
      const params = {};
      if (props.orderId) {
        params.order_id = props.orderId;
      }

      console.log("[MyAppointments] Chargement des rendez-vous avec params:", params);
      const response = await apiClient.get("/api/appointments", { params });
      console.log("[MyAppointments] Réponse API complète:", response);
      console.log("[MyAppointments] Réponse data:", response.data);
      console.log("[MyAppointments] Appointments dans response.data:", response.data?.appointments);

      // S'assurer que appointments est bien un tableau
      const appointmentsArray = Array.isArray(response.data?.appointments) ? response.data.appointments : [];

      appointments.value = appointmentsArray;
      
      // Mettre à jour le compteur de rendez-vous non téléchargés
      updateNotDownloadedCount();
      
      console.log("[MyAppointments] Rendez-vous chargés:", {
        count: appointments.value.length,
        appointments: appointments.value,
        isArray: Array.isArray(appointments.value),
      });
    } catch (error) {
      console.error("[MyAppointments] Erreur lors du chargement des rendez-vous:", error);
      console.error("[MyAppointments] Détails de l'erreur:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      showToast("Erreur lors du chargement des rendez-vous.", "error");
      appointments.value = [];
    } finally {
      isLoading.value = false;
    }
  };
  
  // Mettre à jour le compteur de rendez-vous non téléchargés
  const updateNotDownloadedCount = () => {
    const confirmed = appointments.value.filter(apt => apt.status === 'confirmed' && !apt.is_downloaded);
    notDownloadedCount.value = confirmed.length;
  };
  
  // Télécharger un seul rendez-vous au format ICS
  const downloadAppointment = async (appointment) => {
    if (appointment.is_downloaded) return;
    
    downloadingId.value = appointment.id;
    try {
      const response = await apiClient.get(`/api/appointments/${appointment.id}/download`, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const blob = new Blob([response.data], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rdv-${appointment.visitor_name}-${new Date(appointment.start_time).toISOString().split('T')[0]}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Marquer localement comme téléchargé
      appointment.is_downloaded = true;
      updateNotDownloadedCount();
      
      showToast("Rendez-vous importé avec succès !", "success");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      showToast("Erreur lors du téléchargement du rendez-vous.", "error");
    } finally {
      downloadingId.value = null;
    }
  };
  
  // Télécharger tous les rendez-vous non téléchargés
  const downloadAllAppointments = async () => {
    isDownloadingAll.value = true;
    try {
      const params = {};
      if (props.orderId) {
        params.order_id = props.orderId;
      }
      
      const response = await apiClient.get('/api/appointments/download-all', {
        params,
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const blob = new Blob([response.data], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mes-rendez-vous-digicard-${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Marquer localement tous comme téléchargés
      appointments.value.forEach(apt => {
        if (apt.status === 'confirmed' && !apt.is_downloaded) {
          apt.is_downloaded = true;
        }
      });
      updateNotDownloadedCount();
      
      showToast("Tous les rendez-vous ont été importés avec succès !", "success");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      if (error.response?.status === 404) {
        showToast("Aucun nouveau rendez-vous à télécharger.", "warning");
      } else {
        showToast("Erreur lors du téléchargement des rendez-vous.", "error");
      }
    } finally {
      isDownloadingAll.value = false;
    }
  };

  // Ouvrir le modal de confirmation d'annulation
  const openCancelModal = (appointment) => {
    appointmentToCancel.value = appointment;
    showCancelModal.value = true;
  };

  // Annuler un rendez-vous (appelé après confirmation)
  const cancelAppointment = async () => {
    if (!appointmentToCancel.value) return;

    const appointment = appointmentToCancel.value;
    isCancelling.value = appointment.id;
    showCancelModal.value = false;

    try {
      setCsrfHeader();

      const response = await apiClient.put(`/api/appointments/${appointment.id}/cancel`);

      // Mettre à jour le statut localement
      appointment.status = "cancelled";

      showToast("Rendez-vous annulé avec succès. Le créneau est maintenant disponible.", "success");

      // Recharger immédiatement pour mettre à jour le compteur
      await loadAppointments();
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      showToast(error.response?.data?.message || "Erreur lors de l'annulation du rendez-vous.", "error");
    } finally {
      isCancelling.value = null;
      appointmentToCancel.value = null;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Charger les rendez-vous au montage
  onMounted(() => {
    loadAppointments();
  });

  // Recharger les rendez-vous si orderId change
  watch(
    () => props.orderId,
    (newOrderId, oldOrderId) => {
      if (newOrderId !== oldOrderId) {
        console.log("[MyAppointments] orderId changed, reloading appointments:", { newOrderId, oldOrderId });
        loadAppointments();
      }
    },
  );
</script>
