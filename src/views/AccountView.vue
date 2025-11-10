<template>
  <div class="min-h-screen bg-slate-900 pt-20 sm:pt-32 text-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Bouton Retour -->
      <div class="max-w-3xl mx-auto mb-6">
        <button
          @click="goToDashboard"
          type="button"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg
            class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">Retour au Dashboard</span>
        </button>
      </div>

      <h1 class="text-3xl sm:text-4xl font-bold text-center mb-8">Mon Compte</h1>

      <!-- Messages -->
      <div v-if="successMessage" class="max-w-3xl mx-auto mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="max-w-3xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Contenu -->
      <div v-if="user" class="max-w-3xl mx-auto space-y-6">
        <!-- Section Nom -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-sky-400 mb-2">Nom complet</h3>
              <p v-if="!isEditingName" class="text-white text-lg break-words">{{ user.name || "Non défini" }}</p>
              <div v-else class="space-y-3">
                <input
                  v-model.trim="editForm.name"
                  type="text"
                  autocomplete="name"
                  inputmode="text"
                  class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Votre nom complet"
                  :disabled="isSavingName"
                  :readonly="false"
                />
                <div class="flex gap-3">
                  <button
                    @click="saveName"
                    :disabled="isSavingName || !editForm.name.trim()"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isSavingName" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSavingName ? "Enregistrement..." : "Enregistrer" }}
                  </button>
                  <button
                    @click="cancelEditName"
                    :disabled="isSavingName"
                    class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            <button
              v-if="!isEditingName"
              @click="startEditName"
              class="sm:ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              ✏️ Modifier le nom
            </button>
          </div>
        </div>

        <!-- Section Email -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-sky-400 mb-2">Adresse email</h3>
              <p v-if="!isEditingEmail && !requiresEmailVerification" class="text-white text-lg break-words">{{ user.email || "Non défini" }}</p>
              <div v-else-if="isEditingEmail && !requiresEmailVerification" class="space-y-3">
                <input
                  v-model.trim="editForm.email"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="votre@email.com"
                  :disabled="isSavingEmail"
                  :readonly="false"
                />
                <p class="text-xs text-slate-400">Cette adresse email est utilisée pour vous connecter.</p>
                <div class="flex gap-3">
                  <button
                    @click="saveEmail"
                    :disabled="isSavingEmail || !editForm.email.trim()"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isSavingEmail" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSavingEmail ? "Enregistrement..." : "Enregistrer" }}
                  </button>
                  <button
                    @click="cancelEditEmail"
                    :disabled="isSavingEmail"
                    class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
              <!-- Champ de vérification du code -->
              <div v-else-if="requiresEmailVerification" class="space-y-3">
                <div class="p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg">
                  <p class="text-sm text-sky-400 mb-2">
                    <strong>Code de vérification envoyé</strong>
                  </p>
                  <p class="text-xs text-slate-300">
                    Un code de vérification a été envoyé à <strong>{{ pendingEmail }}</strong>. 
                    Veuillez saisir le code pour confirmer le changement d'email.
                  </p>
                </div>
                <input
                  v-model.trim="emailVerificationCode"
                  type="text"
                  maxlength="6"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  autocomplete="one-time-code"
                  class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-center text-2xl tracking-widest"
                  placeholder="000000"
                  :disabled="isVerifyingEmail"
                  :readonly="false"
                  @input="emailVerificationCode = emailVerificationCode.replace(/\D/g, '').slice(0, 6)"
                />
                <div class="flex gap-3">
                  <button
                    @click="verifyEmailChange"
                    :disabled="isVerifyingEmail || emailVerificationCode.length !== 6"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isVerifyingEmail" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isVerifyingEmail ? "Vérification..." : "Vérifier le code" }}
                  </button>
                  <button
                    @click="resendEmailChangeCode"
                    :disabled="isResendingCode"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <svg v-if="isResendingCode" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isResendingCode ? "Envoi..." : "Renvoyer le code" }}
                  </button>
                  <button
                    @click="cancelEmailChange"
                    :disabled="isVerifyingEmail || isResendingCode"
                    class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            <button
              v-if="!isEditingEmail && !requiresEmailVerification"
              @click="startEditEmail"
              class="sm:ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              ✏️ Modifier l'email
            </button>
          </div>
        </div>

        <!-- Section Téléphone -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-sky-400 mb-2">Numéro de téléphone</h3>
              <p v-if="!isEditingPhone" class="text-white text-lg break-words">{{ user.phone || "Non défini" }}</p>
              <div v-else class="space-y-3">
                <input
                  v-model.trim="editForm.phone"
                  type="tel"
                  autocomplete="tel"
                  inputmode="tel"
                  class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="+224XXXXXXXXX"
                  :disabled="isSavingPhone"
                  :readonly="false"
                />
                <p class="text-xs text-slate-400">Format: +224 suivi de 9 chiffres</p>
                <div class="flex gap-3">
                  <button
                    @click="savePhone"
                    :disabled="isSavingPhone"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isSavingPhone" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSavingPhone ? "Enregistrement..." : "Enregistrer" }}
                  </button>
                  <button
                    @click="cancelEditPhone"
                    :disabled="isSavingPhone"
                    class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            <button
              v-if="!isEditingPhone"
              @click="startEditPhone"
              class="sm:ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              ✏️ Modifier le téléphone
            </button>
          </div>
        </div>

        <!-- Section Mot de passe -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-sky-400 mb-2">Mot de passe</h3>
              <p v-if="!isEditingPassword" class="text-slate-400">••••••••</p>
              <div v-else class="space-y-4">
                <!-- Mot de passe actuel -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Mot de passe actuel</label>
                  <div class="relative">
                    <input
                      v-model.trim="editForm.current_password"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      autocomplete="current-password"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition pr-10"
                      placeholder="Votre mot de passe actuel"
                      :disabled="isSavingPassword"
                      :readonly="false"
                    />
                    <button
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Nouveau mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Nouveau mot de passe</label>
                  <div class="relative">
                    <input
                      v-model.trim="editForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition pr-10"
                      placeholder="Minimum 8 caractères"
                      :disabled="isSavingPassword"
                      :readonly="false"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <svg v-if="showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Confirmation mot de passe -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Confirmer le nouveau mot de passe</label>
                  <div class="relative">
                    <input
                      v-model.trim="editForm.password_confirmation"
                      :type="showPasswordConfirm ? 'text' : 'password'"
                      autocomplete="new-password"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition pr-10"
                      placeholder="Confirmez votre nouveau mot de passe"
                      :disabled="isSavingPassword"
                      :readonly="false"
                    />
                    <button
                      type="button"
                      @click="showPasswordConfirm = !showPasswordConfirm"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <svg v-if="showPasswordConfirm" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button
                    @click="savePassword"
                    :disabled="isSavingPassword || !canSavePassword"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isSavingPassword" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSavingPassword ? "Enregistrement..." : "Enregistrer" }}
                  </button>
                  <button
                    @click="cancelEditPassword"
                    :disabled="isSavingPassword"
                    class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            <button
              v-if="!isEditingPassword"
              @click="startEditPassword"
              class="sm:ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              ✏️ Modifier le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import apiClient from "@/api";
  import Cookies from "js-cookie";

  const router = useRouter();
  const { user, fetchUser, updateUserLocally } = useAuth();

  // États d'édition
  const isEditingName = ref(false);
  const isEditingEmail = ref(false);
  const isEditingPhone = ref(false);
  const isEditingPassword = ref(false);

  // État pour la vérification d'email
  const requiresEmailVerification = ref(false);
  const pendingEmail = ref("");
  const emailVerificationCode = ref("");
  const isVerifyingEmail = ref(false);
  const isResendingCode = ref(false);

  // États de sauvegarde
  const isSavingName = ref(false);
  const isSavingEmail = ref(false);
  const isSavingPhone = ref(false);
  const isSavingPassword = ref(false);

  // Formulaires d'édition
  const editForm = reactive({
    name: "",
    email: "",
    phone: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Visibilité des mots de passe
  const showPassword = ref(false);
  const showPasswordConfirm = ref(false);
  const showCurrentPassword = ref(false);

  // Messages
  const successMessage = ref("");
  const errorMessage = ref("");

  // Computed pour valider le formulaire de mot de passe
  const canSavePassword = computed(() => {
    return (
      editForm.current_password &&
      editForm.password &&
      editForm.password_confirmation &&
      editForm.password.length >= 8 &&
      editForm.password === editForm.password_confirmation
    );
  });

  // Fonctions pour démarrer l'édition
  const startEditName = () => {
    editForm.name = user.value?.name || "";
    isEditingName.value = true;
  };

  const startEditEmail = () => {
    editForm.email = user.value?.email || "";
    isEditingEmail.value = true;
  };

  const startEditPhone = () => {
    editForm.phone = user.value?.phone || "";
    isEditingPhone.value = true;
  };

  const startEditPassword = () => {
    editForm.current_password = "";
    editForm.password = "";
    editForm.password_confirmation = "";
    isEditingPassword.value = true;
  };

  // Fonctions pour annuler l'édition
  const cancelEditName = () => {
    isEditingName.value = false;
    editForm.name = "";
    errorMessage.value = "";
  };

  const cancelEditEmail = () => {
    isEditingEmail.value = false;
    editForm.email = "";
    errorMessage.value = "";
    requiresEmailVerification.value = false;
    pendingEmail.value = "";
    emailVerificationCode.value = "";
  };

  const cancelEmailChange = () => {
    requiresEmailVerification.value = false;
    pendingEmail.value = "";
    emailVerificationCode.value = "";
    isEditingEmail.value = false;
    editForm.email = "";
    errorMessage.value = "";
  };

  const cancelEditPhone = () => {
    isEditingPhone.value = false;
    editForm.phone = "";
    errorMessage.value = "";
  };

  const cancelEditPassword = () => {
    isEditingPassword.value = false;
    editForm.current_password = "";
    editForm.password = "";
    editForm.password_confirmation = "";
    errorMessage.value = "";
  };

  // Fonction pour obtenir le cookie CSRF
  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    } else {
      console.warn("Cookie XSRF-TOKEN non trouvé.");
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Fonction pour afficher un message de succès
  const showSuccess = (message) => {
    successMessage.value = message;
    setTimeout(() => {
      successMessage.value = "";
    }, 5000);
  };

  // Fonction pour afficher une erreur
  const showError = (message) => {
    errorMessage.value = message;
    setTimeout(() => {
      errorMessage.value = "";
    }, 8000);
  };

  // Sauvegarder le nom
  const saveName = async () => {
    if (!editForm.name.trim()) {
      showError("Le nom ne peut pas être vide.");
      return;
    }

    isSavingName.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.put("/api/account", {
        name: editForm.name.trim(),
      });

      // Mettre à jour l'utilisateur localement avec les données de la réponse
      if (response.data) {
        // Si l'API retourne { user: {...} }, utiliser response.data.user
        // Sinon, utiliser response.data directement
        const userData = response.data.user || response.data;
        if (updateUserLocally && userData) {
          updateUserLocally(userData);
        }
      }
      
      // Toujours recharger depuis le serveur pour garantir la synchronisation
      await fetchUser();

      isEditingName.value = false;
      showSuccess("Nom mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la mise à jour du nom.");
      }
    } finally {
      isSavingName.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Sauvegarder l'email
  const saveEmail = async () => {
    if (!editForm.email.trim()) {
      showError("L'adresse email ne peut pas être vide.");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email.trim())) {
      showError("Veuillez entrer une adresse email valide.");
      return;
    }

    // Vérifier si l'email a changé
    if (editForm.email.trim() === user.value?.email) {
      showError("Vous avez déjà cette adresse email.");
      return;
    }

    isSavingEmail.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.put("/api/account", {
        email: editForm.email.trim(),
      });

      // Si une vérification est requise
      if (response.data?.requires_verification) {
        requiresEmailVerification.value = true;
        pendingEmail.value = response.data.pending_email || editForm.email.trim();
        isEditingEmail.value = false;
        showSuccess("Un code de vérification a été envoyé à votre nouvelle adresse email.");
      } else {
        // Email mis à jour directement (ne devrait pas arriver normalement)
        if (updateUserLocally && response.data?.user) {
          updateUserLocally(response.data.user);
        } else {
          await fetchUser();
        }
        isEditingEmail.value = false;
        showSuccess("Email mis à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la mise à jour de l'email.");
      }
    } finally {
      isSavingEmail.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Vérifier le code de changement d'email
  const verifyEmailChange = async () => {
    if (emailVerificationCode.value.length !== 6) {
      showError("Le code doit contenir 6 chiffres.");
      return;
    }

    isVerifyingEmail.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.post("/api/account/verify-email-change", {
        code: emailVerificationCode.value,
      });

      // Mettre à jour l'utilisateur localement
      if (updateUserLocally && response.data?.user) {
        updateUserLocally(response.data.user);
      } else {
        await fetchUser();
      }

      // Réinitialiser les états
      requiresEmailVerification.value = false;
      pendingEmail.value = "";
      emailVerificationCode.value = "";
      isEditingEmail.value = false;

      showSuccess(response.data?.message || "Adresse email mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Code de vérification incorrect ou expiré.");
      }
    } finally {
      isVerifyingEmail.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Renvoyer le code de vérification
  const resendEmailChangeCode = async () => {
    isResendingCode.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.post("/api/account/resend-email-change-code");

      showSuccess(response.data?.message || "Un nouveau code de vérification a été envoyé.");
    } catch (error) {
      console.error("Erreur lors du renvoi du code:", error);
      showError(error.response?.data?.message || "Erreur lors du renvoi du code de vérification.");
    } finally {
      isResendingCode.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Sauvegarder le téléphone
  const savePhone = async () => {
    // Validation téléphone si fourni
    if (editForm.phone.trim()) {
      const phoneRegex = /^\+224[0-9]{9}$/;
      if (!phoneRegex.test(editForm.phone.trim())) {
        showError("Le numéro de téléphone doit être au format +224XXXXXXXXX.");
        return;
      }
    }

    isSavingPhone.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const payload = {};
      if (editForm.phone.trim()) {
        payload.phone = editForm.phone.trim();
      } else {
        payload.phone = null; // Permettre de supprimer le téléphone
      }

      const response = await apiClient.put("/api/account", payload);

      // Mettre à jour l'utilisateur localement avec les données de la réponse
      if (response.data) {
        // Si l'API retourne { user: {...} }, utiliser response.data.user
        // Sinon, utiliser response.data directement
        const userData = response.data.user || response.data;
        if (updateUserLocally && userData) {
          updateUserLocally(userData);
        }
      }
      
      // Toujours recharger depuis le serveur pour garantir la synchronisation
      await fetchUser();

      isEditingPhone.value = false;
      showSuccess("Numéro de téléphone mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du téléphone:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la mise à jour du téléphone.");
      }
    } finally {
      isSavingPhone.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Sauvegarder le mot de passe
  const savePassword = async () => {
    if (!editForm.current_password) {
      showError("Vous devez entrer votre mot de passe actuel.");
      return;
    }

    if (editForm.password.length < 8) {
      showError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (editForm.password !== editForm.password_confirmation) {
      showError("Les mots de passe ne correspondent pas.");
      return;
    }

    isSavingPassword.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.put("/api/account", {
        current_password: editForm.current_password,
        password: editForm.password,
        password_confirmation: editForm.password_confirmation,
      });

      // Réinitialiser les champs
      editForm.current_password = "";
      editForm.password = "";
      editForm.password_confirmation = "";
      isEditingPassword.value = false;

      showSuccess("Mot de passe mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.");
      }
    } finally {
      isSavingPassword.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const goToDashboard = () => {
    router.push({ name: "Dashboard" });
  };

  // Charger les données utilisateur
  onMounted(async () => {
    if (!user.value) {
      await fetchUser();
    }
  });
</script>

<style scoped>
  /* Styles supplémentaires si nécessaire */
</style>
