<template>
  <div class="min-h-screen bg-slate-900 pt-20 sm:pt-32 text-white flex items-center justify-center px-4">
    <div class="max-w-md w-full p-8 bg-slate-800 rounded-xl border border-slate-700">
      <h1 class="text-2xl sm:text-3xl font-bold text-center mb-6">Définir votre mot de passe</h1>
      <p class="text-center text-slate-400 mb-6 text-sm sm:text-base">
        Bienvenue ! Pour sécuriser votre compte, veuillez choisir un nouveau mot de passe.
      </p>

      <form @submit.prevent="handleSetPassword" class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-slate-300"
            >Nouveau mot de passe (min. 8 caractères)</label
          >
          <div class="relative mt-1">
            <input
              v-model="passwordForm.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              required
              autocomplete="new-password"
              class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-slate-300"
            >Confirmer le mot de passe</label
          >
          <div class="relative mt-1">
            <input
              v-model="passwordForm.password_confirmation"
              :type="showPasswordConfirm ? 'text' : 'password'"
              id="password_confirmation"
              required
              autocomplete="new-password"
              class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <svg v-if="!showPasswordConfirm" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="text-sm text-red-400 text-center pt-1 h-5">{{ errorMessage }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {{ isSubmitting ? "Enregistrement..." : "Enregistrer et Continuer" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import apiClient from "@/api";
  // import { useAuth } from '@/composables/useAuth'; // Not strictly needed here unless fetching user again
  import Cookies from "js-cookie";

  const router = useRouter();
  const passwordForm = reactive({
    password: "",
    password_confirmation: "",
  });
  const errorMessage = ref("");
  const isSubmitting = ref(false);
  const showPassword = ref(false);
  const showPasswordConfirm = ref(false);

  const handleSetPassword = async () => {
    errorMessage.value = "";
    isSubmitting.value = true;

    // Frontend Validation
    if (passwordForm.password.length < 8) {
      errorMessage.value = "Le mot de passe doit contenir au moins 8 caractères.";
      isSubmitting.value = false;
      return;
    }
    if (passwordForm.password !== passwordForm.password_confirmation) {
      errorMessage.value = "Les mots de passe ne correspondent pas.";
      isSubmitting.value = false;
      return;
    }

    try {
      // Set CSRF header manually
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      if (xsrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
      } else {
        console.warn("XSRF token not found for setting password.");
      } // Proceed but log warning

      const response = await apiClient.post("/api/employee/set-password", passwordForm);

      // Success: Redirect to dashboard
      alert(response.data.message || "Mot de passe défini avec succès !");
      // Clear sensitive data from form
      passwordForm.password = "";
      passwordForm.password_confirmation = "";
      router.push({ name: "Dashboard" });
    } catch (error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        errorMessage.value = errors[firstErrorField][0];
      } else {
        errorMessage.value = error.response?.data?.message || "Une erreur est survenue.";
      }
    } finally {
      isSubmitting.value = false;
      // Clean up header
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };
</script>

<style scoped>
  button:disabled {
    cursor: not-allowed;
  }
</style>
