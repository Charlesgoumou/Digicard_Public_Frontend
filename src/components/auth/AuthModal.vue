<template>
  <div
    v-if="isAuthModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    @click.self="closeAuthModal"
  >
    <div
      class="relative w-full max-w-md p-4 sm:p-6 md:p-8 bg-slate-800/90 rounded-2xl shadow-2xl border border-slate-700 mx-2 max-h-[90vh] overflow-y-auto"
    >
      <button
        @click="closeAuthModal"
        class="absolute top-2 right-2 sm:top-3 sm:right-3 text-slate-400 hover:text-white transition-colors p-1 z-10"
      >
        <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Indicateur de chargement circulaire (overlay) -->
      <div
        v-if="isSubmitting"
        class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        <p class="mt-4 text-white font-medium">{{ loadingMessage }}</p>
      </div>

      <transition name="fade" mode="out-in">
        <!-- VUE CONNEXION -->
        <div v-if="view === 'login'" key="login">
          <h2 class="text-2xl font-bold text-white text-center mb-6">Se Connecter</h2>
          <div class="mb-6">
            <button
              disabled
              class="w-full flex items-center justify-center py-2.5 border border-slate-600 rounded-lg text-slate-500 transition-colors cursor-not-allowed opacity-50"
            >
              <svg class="h-5 w-5 mr-3" viewBox="0 0 48 48">...</svg>
              Connexion rapide avec Google (Bientôt !)
            </button>
          </div>
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-700"></div></div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-slate-800 px-2 text-slate-400">ou connectez-vous avec votre email</span>
            </div>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="login-email" class="block text-sm font-medium text-slate-300">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                id="login-email"
                required
                autocomplete="email"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            <div>
              <label for="login-password" class="block text-sm font-medium text-slate-300">Mot de passe</label>
              <div class="relative mt-1">
                <input
                  v-model="loginForm.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  id="login-password"
                  required
                  autocomplete="current-password"
                  class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
                <button
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <svg v-if="showLoginPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            <!-- Lien Mot de passe oublié -->
            <div class="flex justify-end">
              <button
                type="button"
                @click="
                  view = 'forgotPassword';
                  errorMessage = '';
                "
                class="text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <p v-if="errorMessage" class="text-sm text-red-400 text-center pt-1 h-5">{{ errorMessage }}</p>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-sky-500 text-white font-semibold py-2.5 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? "Connexion..." : "Se Connecter" }}
            </button>
          </form>
          <p class="text-center text-sm text-slate-400 mt-6">
            Vous n'avez pas de compte?
            <button
              type="button"
              @click="
                view = 'register';
                errorMessage = '';
              "
              class="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none"
            >
              S'inscrire
            </button>
          </p>
        </div>

        <!-- VUE INSCRIPTION -->
        <div v-else-if="view === 'register'" key="register">
          <h2 class="text-2xl font-bold text-white text-center mb-6">Créer un compte</h2>
          <form @submit.prevent="handleRegister" class="space-y-4">
            <fieldset class="mb-2">
              <legend class="block text-sm font-medium text-slate-300 mb-2 text-center sr-only">Type de compte</legend>
              <div class="flex justify-center space-x-6">
                <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-slate-700/50">
                  <input
                    type="radio"
                    v-model="registerForm.user_type"
                    value="individual"
                    name="user_type"
                    class="form-radio text-sky-500 focus:ring-sky-500 bg-slate-700 border-slate-600"
                  />
                  <span class="text-slate-300">Particulier</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-slate-700/50">
                  <input
                    type="radio"
                    v-model="registerForm.user_type"
                    value="business"
                    name="user_type"
                    class="form-radio text-sky-500 focus:ring-sky-500 bg-slate-700 border-slate-600"
                  />
                  <span class="text-slate-300">Entreprise</span>
                </label>
              </div>
            </fieldset>

            <transition name="fade">
              <div v-if="registerForm.user_type === 'business'">
                <label for="register-company" class="block text-sm font-medium text-slate-300"
                  >Nom de l'entreprise</label
                >
                <input
                  v-model.trim="registerForm.company_name"
                  type="text"
                  id="register-company"
                  required
                  class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
            </transition>

            <div>
              <label for="register-name" class="block text-sm font-medium text-slate-300">Nom complet</label>
              <input
                v-model.trim="registerForm.name"
                type="text"
                id="register-name"
                required
                autocomplete="name"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            <div>
              <label for="register-phone" class="block text-sm font-medium text-slate-300">Téléphone (+224XXXXXXXXX)</label>
              <input
                v-model.trim="registerForm.phone"
                type="tel"
                id="register-phone"
                required
                placeholder="+224XXXXXXXXX"
                @focus="onPhoneFocus"
                @input="onPhoneInput"
                @blur="onPhoneBlur"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            <div>
              <label for="register-email" class="block text-sm font-medium text-slate-300">Email</label>
              <input
                v-model.trim="registerForm.email"
                type="email"
                id="register-email"
                required
                autocomplete="email"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
            <div>
              <label for="register-password" class="block text-sm font-medium text-slate-300"
                >Mot de passe (8+ caractères)</label
              >
              <div class="relative mt-1">
                <input
                  v-model="registerForm.password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  id="register-password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                  class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
                <button
                  type="button"
                  @click="showRegisterPassword = !showRegisterPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    v-if="showRegisterPassword"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
              <label for="register-password-confirm" class="block text-sm font-medium text-slate-300"
                >Confirmer le mot de passe</label
              >
              <div class="relative mt-1">
                <input
                  v-model="registerForm.password_confirmation"
                  :type="showRegisterPasswordConfirm ? 'text' : 'password'"
                  id="register-password-confirm"
                  required
                  minlength="8"
                  autocomplete="new-password"
                  class="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pr-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
                <button
                  type="button"
                  @click="showRegisterPasswordConfirm = !showRegisterPasswordConfirm"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    v-if="showRegisterPasswordConfirm"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
              class="w-full bg-sky-500 text-white font-semibold py-2.5 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? "Création..." : "Créer mon compte" }}
            </button>
          </form>
          <p class="text-center text-sm text-slate-400 mt-6">
            Déjà un compte?
            <button
              type="button"
              @click="
                view = 'login';
                errorMessage = '';
              "
              class="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none"
            >
              Se connecter
            </button>
          </p>
        </div>

        <!-- VUE MOT DE PASSE OUBLIÉ -->
        <div v-else-if="view === 'forgotPassword'" key="forgotPassword">
          <h2 class="text-2xl font-bold text-white text-center mb-6">Mot de passe oublié</h2>
          <p class="text-slate-400 text-center mb-6">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label for="forgot-email" class="block text-sm font-medium text-slate-300">Email</label>
              <input
                v-model="forgotPasswordEmail"
                type="email"
                id="forgot-email"
                required
                autocomplete="email"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            <p v-if="errorMessage" class="text-sm text-red-400 text-center pt-1">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-sm text-green-400 text-center pt-1">{{ successMessage }}</p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-sky-500 text-white font-semibold py-2.5 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? "Envoi..." : "Envoyer le lien" }}
            </button>
          </form>
          <p class="text-center text-sm text-slate-400 mt-6">
            <button
              type="button"
              @click="
                view = 'login';
                errorMessage = '';
                successMessage = '';
              "
              class="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none"
            >
              ← Retour à la connexion
            </button>
          </p>
        </div>

        <!-- VUE SÉLECTION DE COMPTE -->
        <div v-else-if="view === 'selectAccount'" key="selectAccount">
          <h2 class="text-2xl font-bold text-white text-center mb-4">Choisissez votre compte</h2>
          <p class="text-slate-300 text-center mb-6">
            Vous avez plusieurs comptes avec cet email. Veuillez sélectionner le type de compte que vous souhaitez
            utiliser.
          </p>

          <div class="space-y-3">
            <button
              v-for="account in availableAccounts"
              :key="account.type"
              @click="selectAccountAndLogin(account.type)"
              class="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-sky-500 rounded-lg p-4 text-left transition-all group"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <svg
                      v-if="account.type === 'business'"
                      class="w-6 h-6 text-sky-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <svg v-else class="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span class="text-white font-semibold">
                      {{ account.type === "business" ? "Compte Entreprise" : "Compte Personnel" }}
                    </span>
                  </div>
                  <p class="text-slate-400 text-sm mt-1">{{ account.name }}</p>
                  <p v-if="account.company_name" class="text-slate-500 text-xs mt-0.5">{{ account.company_name }}</p>
                </div>
                <svg
                  class="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <p class="text-center text-sm text-slate-400 mt-6">
            <button
              type="button"
              @click="
                view = 'login';
                errorMessage = '';
                successMessage = '';
                availableAccounts = [];
                storedLoginCredentials = null;
              "
              class="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none"
            >
              ← Retour à la connexion
            </button>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from "vue";
  import { useAuth } from "@/composables/useAuth";
  import apiClient from "@/api";

  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const view = ref("login"); // 'login' | 'register' | 'forgotPassword' | 'selectAccount'
  const errorMessage = ref("");
  const successMessage = ref("");
  const isSubmitting = ref(false);
  const loadingMessage = ref(""); // Message affiché pendant le chargement

  // Visibilité des mots de passe
  const showLoginPassword = ref(false);
  const showRegisterPassword = ref(false);
  const showRegisterPasswordConfirm = ref(false);

  // Sélection de compte multiple
  const availableAccounts = ref([]);
  const storedLoginCredentials = ref(null);

  // Form state
  const loginForm = reactive({ email: "", password: "" });
  const registerForm = reactive({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    user_type: "individual",
    company_name: "",
    phone: "+224",
  });
  const forgotPasswordEmail = ref("");

  // Login handler
  const handleLogin = async (accountType = null) => {
    errorMessage.value = "";
    isSubmitting.value = true;
    loadingMessage.value = "Connexion en cours...";
    try {
      const credentials = { ...loginForm };
      // ✅ Vérifier que accountType est une string valide, pas un Event
      if (accountType && typeof accountType === "string") {
        credentials.account_type = accountType;
      }
      await login(credentials);
    } catch (error) {
      // ✅ Gérer le cas de comptes multiples
      if (error.response?.data?.multiple_accounts) {
        availableAccounts.value = error.response.data.available_accounts;
        storedLoginCredentials.value = { email: loginForm.email, password: loginForm.password };
        view.value = "selectAccount";
        isSubmitting.value = false;
        loadingMessage.value = "";
        return;
      }

      if (error.response?.data?.errors?.email) {
        errorMessage.value = error.response.data.errors.email[0];
      } else if (error.response?.data?.errors) {
        // Afficher la première erreur disponible
        const firstErrorKey = Object.keys(error.response.data.errors)[0];
        errorMessage.value = error.response.data.errors[firstErrorKey][0];
      } else {
        errorMessage.value = error.response?.data?.message || "Erreur de connexion.";
      }
    } finally {
      isSubmitting.value = false;
      loadingMessage.value = "";
    }
  };

  // Sélectionner le type de compte et se connecter
  const selectAccountAndLogin = async (accountType) => {
    loginForm.email = storedLoginCredentials.value.email;
    loginForm.password = storedLoginCredentials.value.password;
    await handleLogin(accountType);
  };

  // Registration handler
  const handleRegister = async () => {
    errorMessage.value = "";

    // Validation frontend (sans afficher le chargement)
    if (registerForm.user_type === "business" && !registerForm.company_name.trim()) {
      errorMessage.value = "Le nom de l'entreprise est requis.";
      return;
    }

    if (registerForm.password !== registerForm.password_confirmation) {
      errorMessage.value = "Les mots de passe ne correspondent pas.";
      return;
    }

    if (registerForm.password.length < 8) {
      errorMessage.value = "Le mot de passe doit contenir au moins 8 caractères.";
      return;
    }

    // Valider le format du téléphone (+224 suivi de 9 chiffres)
    const phoneRegex = /^\+224[0-9]{9}$/;
    if (!phoneRegex.test(registerForm.phone.trim())) {
      errorMessage.value = "Le numéro de téléphone doit être au format +224XXXXXXXXX.";
      return;
    }

    // Activer le chargement après validation
    isSubmitting.value = true;
    loadingMessage.value = "Création du compte...";

    // Prepare payload
    const payload = {
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      password_confirmation: registerForm.password_confirmation,
      user_type: registerForm.user_type,
      phone: registerForm.phone.trim(),
      ...(registerForm.user_type === "business" && { company_name: registerForm.company_name.trim() }),
    };

    try {
      loadingMessage.value = "Envoi du code de vérification...";
      await register(payload);
    } catch (error) {
      // Vérifier si c'est une erreur CORS
      if (!error.response && error.message && (error.message.includes('CORS') || error.message.includes('Network Error'))) {
        errorMessage.value = "Erreur de connexion au serveur. Vérifiez votre connexion réseau ou contactez le support.";
        console.error("Erreur CORS détectée:", error);
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError;
      } else {
        errorMessage.value = error.response?.data?.message || "Erreur lors de l'inscription.";
      }
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      isSubmitting.value = false;
      loadingMessage.value = "";
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    errorMessage.value = "";
    successMessage.value = "";
    isSubmitting.value = true;
    loadingMessage.value = "Envoi du lien de réinitialisation...";

    try {
      const response = await apiClient.post("/password/reset-link", {
        email: forgotPasswordEmail.value,
      });
      successMessage.value = response.data.message;
      forgotPasswordEmail.value = "";
    } catch (error) {
      errorMessage.value = error.response?.data?.message || "Erreur lors de l'envoi de l'email.";
    } finally {
      isSubmitting.value = false;
      loadingMessage.value = "";
    }
  };

  // --- Phone masking (+224 + 9 digits) ---
  const sanitizeGuineaPhone = (value) => {
    if (!value) return "+224";
    // Keep only + and digits
    let cleaned = value.replace(/[^+\d]/g, "");
    // Ensure prefix
    if (!cleaned.startsWith("+224")) {
      // Extract digits from the whole input
      const digits = cleaned.replace(/\D/g, "");
      // Remove any leading 224 already present in digits
      const without224 = digits.startsWith("224") ? digits.slice(3) : digits;
      cleaned = "+224" + without224;
    }
    // Cut to +224 + 9 digits max
    const afterPrefix = cleaned.slice(4).replace(/\D/g, "").slice(0, 9);
    return "+224" + afterPrefix;
  };

  const onPhoneFocus = () => {
    if (!registerForm.phone) {
      registerForm.phone = "+224";
    }
  };

  const onPhoneInput = (e) => {
    registerForm.phone = sanitizeGuineaPhone(e.target.value);
  };

  const onPhoneBlur = () => {
    registerForm.phone = sanitizeGuineaPhone(registerForm.phone || "");
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
