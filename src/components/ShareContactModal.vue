<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto"
        @click.self="emit('close')"
      >
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 my-auto">
          <!-- Header -->
          <div class="relative p-4 sm:p-6 border-b border-slate-700/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <button
              @click="emit('close')"
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-red-500/80 text-slate-400 hover:text-white transition-all"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Échanger mon contact</h2>
                <p class="text-sm text-slate-400">avec {{ ownerName }}</p>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <!-- Formulaire -->
            <div v-if="!isSuccess" class="space-y-4">
              <p class="text-slate-400 text-sm mb-4">
                Partagez vos coordonnées avec {{ ownerName }}. Votre navigateur peut pré-remplir automatiquement les champs.
              </p>

              <form @submit.prevent="submitForm">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Prénom *</label>
                    <input
                      v-model="form.firstName"
                      type="text"
                      name="fname"
                      autocomplete="given-name"
                      required
                      class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-1">Nom *</label>
                    <input
                      v-model="form.lastName"
                      type="text"
                      name="lname"
                      autocomplete="family-name"
                      required
                      class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    name="phone"
                    autocomplete="tel"
                    class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-slate-300 mb-1">
                    Entreprise <span class="text-slate-500">(optionnel)</span>
                  </label>
                  <input
                    v-model="form.company"
                    type="text"
                    name="organization"
                    autocomplete="organization"
                    class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ma Société"
                  />
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-slate-300 mb-1">
                    Message <span class="text-slate-500">(optionnel)</span>
                  </label>
                  <textarea
                    v-model="form.note"
                    name="note"
                    rows="2"
                    class="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Un petit mot..."
                  ></textarea>
                </div>

                <p class="text-xs text-slate-500 mt-4">* Au moins un email ou un téléphone est requis</p>

                <div
                  v-if="errorMessage"
                  class="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm"
                >
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:shadow-none"
                >
                  <template v-if="!isSubmitting">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
                    </svg>
                    Échanger
                  </template>
                  <template v-else>
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Envoi...
                  </template>
                </button>
              </form>
            </div>

            <!-- Succès -->
            <div v-else class="text-center py-8">
              <div
                class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Contact partagé !</h3>
              <p class="text-slate-400 mb-6">
                Vos coordonnées ont été envoyées à<br />
                <span class="text-emerald-400 font-medium">{{ ownerName }}</span>
              </p>
              <button
                @click="emit('close')"
                class="bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-xl font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import apiClient from "@/api";

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
    default: "ce contact",
  },
});

const emit = defineEmits(["close"]);

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  note: "",
});

const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");

// Reset le formulaire quand le modal s'ouvre
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  }
);

const resetForm = () => {
  form.firstName = "";
  form.lastName = "";
  form.email = "";
  form.phone = "";
  form.company = "";
  form.note = "";
  isSuccess.value = false;
  errorMessage.value = "";
};

const submitForm = async () => {
  // Validation
  if (!form.email && !form.phone) {
    errorMessage.value = "Veuillez fournir au moins un email ou un numéro de téléphone.";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      note: form.note.trim() || null,
    };

    if (props.orderId) {
      payload.order_id = props.orderId;
    }

    await apiClient.post(`/api/user/${props.userId}/share-contact`, payload);

    isSuccess.value = true;
  } catch (error) {
    console.error("Erreur lors du partage du contact:", error);
    errorMessage.value = error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

