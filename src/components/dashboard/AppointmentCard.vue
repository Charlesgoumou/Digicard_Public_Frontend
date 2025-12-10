<template>
  <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4 hover:border-slate-500 transition-colors">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Informations du rendez-vous -->
      <div class="flex-1 space-y-2">
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Date et heure -->
          <div class="flex items-center gap-2">
            <svg v-if="showDate" class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <svg v-else class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span v-if="showDate" class="text-white font-semibold">{{ formatDate(appointment.start_time) }}</span>
            <span v-if="showDate" class="text-slate-400">à</span>
            <span class="text-white font-semibold">{{ formatTime(appointment.start_time) }}</span>
            <span class="text-slate-400">({{ formatDuration(appointment.duration) }})</span>
          </div>

          <!-- Statut -->
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              appointment.status === 'confirmed'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : appointment.status === 'cancelled'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            ]"
          >
            {{ getStatusLabel(appointment.status) }}
          </span>
        </div>

        <!-- Informations du visiteur -->
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="text-white font-medium">{{ appointment.visitor_name }}</span>
          </div>
          <div class="flex items-center gap-2 min-w-0">
            <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span class="text-slate-300 text-sm truncate" :title="appointment.visitor_email">{{ appointment.visitor_email }}</span>
          </div>
          <div v-if="appointment.visitor_phone" class="flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span class="text-slate-300 text-sm">{{ appointment.visitor_phone }}</span>
          </div>
          <div v-if="appointment.message" class="mt-2 p-2 bg-slate-800/50 rounded border border-slate-600">
            <p class="text-slate-300 text-sm">{{ appointment.message }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-2">
        <button
          v-if="appointment.status === 'confirmed' && isUpcoming(appointment.start_time)"
          @click="$emit('cancel', appointment)"
          :disabled="isCancelling === appointment.id"
          class="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            v-if="isCancelling === appointment.id"
            class="animate-spin h-4 w-4"
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
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {{ isCancelling === appointment.id ? 'Annulation...' : 'Annuler' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appointment: {
    type: Object,
    required: true,
  },
  isCancelling: {
    type: [Number, null],
    default: null,
  },
  showDate: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['cancel']);

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

// Formater l'heure
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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

// Obtenir le libellé du statut
const getStatusLabel = (status) => {
  const labels = {
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
  };
  return labels[status] || status;
};

// Vérifier si le rendez-vous est à venir
const isUpcoming = (dateString) => {
  const appointmentDate = new Date(dateString);
  return appointmentDate > new Date();
};
</script>

