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
            @cancel="cancelAppointment"
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
            @cancel="cancelAppointment"
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
            @cancel="cancelAppointment"
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
                :show-date="false"
                @cancel="cancelAppointment"
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

  // Computed: Rendez-vous du jour (non annulés)
  const todayAppointments = computed(() => {
    const today = getToday();
    const tomorrow = getTomorrow();
    return appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= today && aptDate < tomorrow && apt.status !== "cancelled";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  // Computed: Rendez-vous de demain (non annulés)
  const tomorrowAppointments = computed(() => {
    const tomorrow = getTomorrow();
    const dayAfter = getDayAfterTomorrow();
    return appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= tomorrow && aptDate < dayAfter && apt.status !== "cancelled";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  // Computed: Rendez-vous d'après-demain (non annulés)
  const dayAfterTomorrowAppointments = computed(() => {
    const dayAfter = getDayAfterTomorrow();
    const dayAfterPlus1 = new Date(dayAfter);
    dayAfterPlus1.setDate(dayAfterPlus1.getDate() + 1);
    return appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= dayAfter && aptDate < dayAfterPlus1 && apt.status !== "cancelled";
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  });

  // Computed: Rendez-vous suivants groupés par date (non annulés)
  const futureAppointmentsGrouped = computed(() => {
    const dayAfter = getDayAfterTomorrow();
    const dayAfterPlus1 = new Date(dayAfter);
    dayAfterPlus1.setDate(dayAfterPlus1.getDate() + 1);

    const futureApts = appointments.value
      .filter((apt) => {
        const aptDate = getStartOfDay(apt.start_time);
        return aptDate >= dayAfterPlus1 && apt.status !== "cancelled";
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

  // Annuler un rendez-vous
  const cancelAppointment = async (appointment) => {
    if (!confirm(`Êtes-vous sûr de vouloir annuler le rendez-vous avec ${appointment.visitor_name} ?`)) {
      return;
    }

    isCancelling.value = appointment.id;
    try {
      setCsrfHeader();

      const response = await apiClient.put(`/api/appointments/${appointment.id}/cancel`);

      // Mettre à jour le statut localement
      appointment.status = "cancelled";

      showToast("Rendez-vous annulé avec succès. Le créneau est maintenant disponible.", "success");

      // Recharger la liste après un court délai
      setTimeout(() => {
        loadAppointments();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      showToast(error.response?.data?.message || "Erreur lors de l'annulation du rendez-vous.", "error");
    } finally {
      isCancelling.value = null;
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
