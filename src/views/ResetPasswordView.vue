<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo / En-tête -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Réinitialisation de mot de passe</h1>
        <p class="text-slate-400">Saisissez votre nouveau mot de passe</p>
      </div>

      <!-- Formulaire -->
      <div class="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
        <!-- Vérification du token en cours -->
        <div v-if="verifying" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
          <p class="text-slate-300">Vérification du lien...</p>
        </div>

        <!-- Token invalide -->
        <div v-else-if="tokenError" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">Lien invalide</h3>
          <p class="text-slate-400 mb-6">{{ tokenError }}</p>
          <button
            @click="goToHome"
            class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>

        <!-- Formulaire de réinitialisation -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nouveau mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-2">Nouveau mot de passe</label>
            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                required
                minlength="8"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-12"
                placeholder="Minimum 8 caractères"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          <!-- Confirmation du mot de passe -->
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-slate-300 mb-2"
              >Confirmer le mot de passe</label
            >
            <div class="relative">
              <input
                id="password_confirmation"
                :type="showPasswordConfirm ? 'text' : 'password'"
                v-model="form.password_confirmation"
                required
                minlength="8"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-12"
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <svg v-if="showPasswordConfirm" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          <!-- Message d'erreur -->
          <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
            {{ error }}
          </div>

          <!-- Message de succès -->
          <div v-if="success" class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
            {{ success }}
          </div>

          <!-- Boutons -->
          <div class="space-y-3">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe" }}</span>
            </button>

            <button
              v-if="success"
              type="button"
              @click="goToHome"
              class="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import apiClient from "@/api";

  const router = useRouter();
  const route = useRoute();

  const form = ref({
    email: "",
    token: "",
    password: "",
    password_confirmation: "",
  });

  const showPassword = ref(false);
  const showPasswordConfirm = ref(false);
  const isSubmitting = ref(false);
  const error = ref("");
  const success = ref("");
  const verifying = ref(true);
  const tokenError = ref("");

  // Vérifier le token au chargement
  onMounted(async () => {
    const email = route.query.email;
    const token = route.query.token;

    if (!email || !token) {
      tokenError.value = "Lien de réinitialisation invalide.";
      verifying.value = false;
      return;
    }

    form.value.email = email;
    form.value.token = token;

    // Vérifier la validité du token
    try {
      await apiClient.post("/api/password/verify-token", {
        email: email,
        token: token,
      });
      verifying.value = false;
    } catch (err) {
      console.error("Erreur de vérification du token:", err);
      tokenError.value = err.response?.data?.message || "Ce lien de réinitialisation a expiré ou est invalide.";
      verifying.value = false;
    }
  });

  const handleSubmit = async () => {
    error.value = "";
    success.value = "";

    if (form.value.password !== form.value.password_confirmation) {
      error.value = "Les mots de passe ne correspondent pas.";
      return;
    }

    if (form.value.password.length < 8) {
      error.value = "Le mot de passe doit contenir au moins 8 caractères.";
      return;
    }

    isSubmitting.value = true;

    try {
      const response = await apiClient.post("/api/password/reset", form.value);
      success.value = response.data.message;

      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        goToHome();
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de la réinitialisation:", err);
      error.value = err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.";
    } finally {
      isSubmitting.value = false;
    }
  };

  const goToHome = () => {
    router.push({ name: "Home" });
  };
</script>
