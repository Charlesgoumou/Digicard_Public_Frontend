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
        <!-- Section Nom de l'entreprise (uniquement pour business_admin) -->
        <div v-if="user?.role === 'business_admin'" class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-sky-400 mb-2">Nom de l'entreprise</h3>
              <p v-if="!isEditingCompanyName" class="text-white text-lg break-words">{{ user.company_name || "Non défini" }}</p>
              <div v-else class="space-y-3">
                <input
                  v-model.trim="editForm.company_name"
                  type="text"
                  autocomplete="organization"
                  inputmode="text"
                  class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Nom de votre entreprise"
                  :disabled="isSavingCompanyName"
                  :readonly="false"
                />
                <div class="flex gap-3">
                  <button
                    @click="saveCompanyName"
                    :disabled="isSavingCompanyName || !editForm.company_name.trim()"
                    class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg v-if="isSavingCompanyName" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSavingCompanyName ? "Enregistrement..." : "Enregistrer" }}
                  </button>
                  <button
                    @click="cancelEditCompanyName"
                    :disabled="isSavingCompanyName"
                    class="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
            <button
              v-if="!isEditingCompanyName"
              @click="startEditCompanyName"
              class="sm:ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              ✏️ Modifier le nom de l'entreprise
            </button>
          </div>
        </div>

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

        <!-- Section Authentification à double facteur -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-sky-400 mb-2">Authentification à double facteur (2FA)</h3>
              <p class="text-slate-400 mb-4">
                Activez l'authentification à double facteur pour renforcer la sécurité de votre compte. 
                Un code de vérification sera envoyé par email à chaque connexion.
              </p>
              <div class="flex items-center gap-3">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="user?.two_factor_enabled ?? true"
                    @change="toggleTwoFactor"
                    :disabled="isTogglingTwoFactor || user?.is_admin"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"></div>
                  <span class="ml-3 text-sm font-medium text-slate-300">
                    {{ user?.two_factor_enabled ? 'Activée' : 'Désactivée' }}
                  </span>
                </label>
                <div v-if="isTogglingTwoFactor" class="flex items-center gap-2 text-sky-400">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-xs">Mise à jour...</span>
                </div>
              </div>
              <p v-if="user?.is_admin" class="text-xs text-yellow-400 mt-2">
                ⚠️ Les super administrateurs ne peuvent pas modifier leur 2FA depuis cette interface.
              </p>
            </div>
          </div>
        </div>

        <!-- Section Comptes liés -->
        <div class="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <h3 class="text-lg font-semibold text-sky-400 mb-4">Mes Comptes</h3>
          <p class="text-slate-400 mb-6 text-sm">
            Gérez vos différents comptes associés à la même adresse email. Vous pouvez basculer entre vos comptes ou en créer de nouveaux.
          </p>

          <!-- Chargement -->
          <div v-if="isLoadingLinkedAccounts" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>

          <!-- Liste des comptes liés -->
          <div v-else-if="linkedAccounts.length > 0" class="space-y-4 mb-6">
            <div
              v-for="account in linkedAccounts"
              :key="account.id"
              :class="[
                'p-4 rounded-lg border-2 transition-all',
                account.is_current
                  ? 'bg-sky-500/10 border-sky-500'
                  : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1 min-w-0">
                  <div class="flex-shrink-0">
                    <div
                      :class="[
                        'w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold',
                        account.role === 'business_admin' ? 'bg-purple-500/20 text-purple-400' :
                        account.role === 'individual' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      ]"
                    >
                      {{ account.role === 'business_admin' ? '🏢' : account.role === 'individual' ? '👤' : '👨‍💼' }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-white truncate">{{ account.name }}</h4>
                      <span
                        v-if="account.is_current"
                        class="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500 text-white"
                      >
                        Actuel
                      </span>
                    </div>
                    <p class="text-sm text-slate-400">
                      {{ account.role_label }}
                      <span v-if="account.company_name"> • {{ account.company_name }}</span>
                    </p>
                    <p class="text-xs text-slate-500 mt-1">
                      Créé le {{ new Date(account.created_at).toLocaleDateString('fr-FR') }}
                    </p>
                  </div>
                </div>
                <button
                  v-if="!account.is_current"
                  @click="switchToAccount(account)"
                  :disabled="isSwitchingAccount"
                  class="ml-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                >
                  <svg v-if="isSwitchingAccount" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSwitchingAccount ? "Basculement..." : "Basculer" }}
                </button>
              </div>
            </div>
          </div>

          <!-- Message si aucun compte lié -->
          <div v-else class="text-center py-8 text-slate-400">
            <p>Aucun autre compte trouvé avec cette adresse email.</p>
          </div>

          <!-- Formulaire de création de compte -->
          <div class="mt-6 pt-6 border-t border-slate-700">
            <h4 class="text-md font-semibold text-slate-300 mb-4">Créer un nouveau compte</h4>
            
            <div v-if="availableAccountTypes.length > 0" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Type de compte</label>
                <select
                  v-model="newAccountForm.account_type"
                  class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="">Sélectionnez un type de compte</option>
                  <option
                    v-for="type in availableAccountTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <div v-if="newAccountForm.account_type">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Nom complet</label>
                    <input
                      v-model.trim="newAccountForm.name"
                      type="text"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div v-if="newAccountForm.account_type === 'business'">
                    <label class="block text-sm font-medium text-slate-300 mb-2">Nom de l'entreprise</label>
                    <input
                      v-model.trim="newAccountForm.company_name"
                      type="text"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                    <input
                      v-model.trim="newAccountForm.password"
                      type="password"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Minimum 8 caractères"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Confirmer le mot de passe</label>
                    <input
                      v-model.trim="newAccountForm.password_confirmation"
                      type="password"
                      class="w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Confirmez votre mot de passe"
                    />
                  </div>

                  <button
                    @click="createLinkedAccount"
                    :disabled="isCreatingAccount || !canCreateAccount"
                    class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg v-if="isCreatingAccount" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isCreatingAccount ? "Création..." : "Créer le compte" }}
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-slate-400 text-sm">
              <p>Vous avez déjà créé tous les types de comptes disponibles pour votre rôle.</p>
            </div>
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
  const isEditingCompanyName = ref(false);
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
  const isSavingCompanyName = ref(false);
  const isSavingEmail = ref(false);
  const isSavingPhone = ref(false);
  const isSavingPassword = ref(false);
  const isTogglingTwoFactor = ref(false);

  // Formulaires d'édition
  const editForm = reactive({
    name: "",
    company_name: "",
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

  // États pour les comptes liés
  const linkedAccounts = ref([]);
  const isLoadingLinkedAccounts = ref(false);
  const isSwitchingAccount = ref(false);
  const isCreatingAccount = ref(false);
  const newAccountForm = reactive({
    account_type: "",
    name: "",
    company_name: "",
    password: "",
    password_confirmation: "",
  });

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

  const startEditCompanyName = () => {
    editForm.company_name = user.value?.company_name || "";
    isEditingCompanyName.value = true;
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

  const cancelEditCompanyName = () => {
    isEditingCompanyName.value = false;
    editForm.company_name = "";
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

  // Sauvegarder le nom de l'entreprise
  const saveCompanyName = async () => {
    if (!editForm.company_name.trim()) {
      showError("Le nom de l'entreprise ne peut pas être vide.");
      return;
    }

    isSavingCompanyName.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.put("/api/account", {
        company_name: editForm.company_name.trim(),
      });

      // Mettre à jour l'utilisateur localement avec les données de la réponse
      if (response.data) {
        const userData = response.data.user || response.data;
        if (updateUserLocally && userData) {
          updateUserLocally(userData);
        }
      }
      
      // Toujours recharger depuis le serveur pour garantir la synchronisation
      await fetchUser();

      isEditingCompanyName.value = false;
      showSuccess("Nom de l'entreprise mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom de l'entreprise:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la mise à jour du nom de l'entreprise.");
      }
    } finally {
      isSavingCompanyName.value = false;
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

  // Toggle 2FA
  const toggleTwoFactor = async (event) => {
    if (user.value?.is_admin) {
      showError("Les super administrateurs ne peuvent pas modifier leur 2FA depuis cette interface.");
      // Réinitialiser le checkbox
      event.target.checked = user.value?.two_factor_enabled ?? true;
      return;
    }

    isTogglingTwoFactor.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.post("/api/account/toggle-two-factor");

      // Mettre à jour l'utilisateur localement
      if (response.data?.user) {
        if (updateUserLocally) {
          updateUserLocally(response.data.user);
        }
      } else {
        await fetchUser();
      }

      showSuccess(response.data?.message || "Authentification à double facteur mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification de la 2FA:", error);
      // Réinitialiser le checkbox en cas d'erreur
      event.target.checked = user.value?.two_factor_enabled ?? true;
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la modification de l'authentification à double facteur.");
      }
    } finally {
      isTogglingTwoFactor.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const goToDashboard = () => {
    router.push({ name: "Dashboard" });
  };

  // Computed pour les types de comptes disponibles
  const availableAccountTypes = computed(() => {
    if (!user.value) return [];
    
    const existingTypes = linkedAccounts.value.map(acc => acc.role);
    const types = [];

    if (user.value.role === 'business_admin') {
      // Business admin peut créer particulier
      if (!existingTypes.includes('individual')) {
        types.push({ value: 'individual', label: '👤 Compte Particulier' });
      }
    } else if (user.value.role === 'individual') {
      // Particulier peut créer business_admin
      if (!existingTypes.includes('business_admin')) {
        types.push({ value: 'business', label: '🏢 Compte Entreprise' });
      }
    } else if (user.value.role === 'employee') {
      // Employé peut créer particulier et business_admin
      if (!existingTypes.includes('individual')) {
        types.push({ value: 'individual', label: '👤 Compte Particulier' });
      }
      if (!existingTypes.includes('business_admin')) {
        types.push({ value: 'business', label: '🏢 Compte Entreprise' });
      }
    }

    return types;
  });

  // Computed pour valider le formulaire de création de compte
  const canCreateAccount = computed(() => {
    if (!newAccountForm.account_type || !newAccountForm.name || !newAccountForm.password || !newAccountForm.password_confirmation) {
      return false;
    }
    if (newAccountForm.password.length < 8) {
      return false;
    }
    if (newAccountForm.password !== newAccountForm.password_confirmation) {
      return false;
    }
    if (newAccountForm.account_type === 'business' && !newAccountForm.company_name.trim()) {
      return false;
    }
    return true;
  });

  // Charger les comptes liés
  const loadLinkedAccounts = async () => {
    isLoadingLinkedAccounts.value = true;
    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();
      const response = await apiClient.get("/api/account/linked-accounts");
      linkedAccounts.value = response.data?.linked_accounts || [];
    } catch (error) {
      console.error("Erreur lors du chargement des comptes liés:", error);
      showError(error.response?.data?.message || "Erreur lors du chargement des comptes liés.");
    } finally {
      isLoadingLinkedAccounts.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Basculer vers un autre compte
  const switchToAccount = async (account) => {
    if (account.is_current) return;

    isSwitchingAccount.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      // Utiliser le nouvel endpoint qui bascule directement sans demander de mot de passe
      const switchResponse = await apiClient.post("/api/account/switch-to-linked-account", {
        target_account_id: account.id,
      });

      if (switchResponse.data?.user) {
        // Mettre à jour l'utilisateur localement
        if (updateUserLocally) {
          updateUserLocally(switchResponse.data.user);
        }
        
        // Recharger les données utilisateur
        await fetchUser();
        
        // Recharger les comptes liés
        await loadLinkedAccounts();
        
        showSuccess(switchResponse.data.message || `Basculement vers le compte ${account.role_label} réussi !`);
        
        // Rediriger vers le dashboard
        setTimeout(() => {
          router.push({ name: "Dashboard" });
        }, 1000);
      }
    } catch (error) {
      console.error("Erreur lors du basculement de compte:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors du basculement de compte.");
      }
    } finally {
      isSwitchingAccount.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Créer un nouveau compte lié
  const createLinkedAccount = async () => {
    if (!canCreateAccount.value) return;

    isCreatingAccount.value = true;
    errorMessage.value = "";

    try {
      await apiClient.get("/sanctum/csrf-cookie");
      setCsrfHeader();

      const response = await apiClient.post("/api/account/create-linked-account", {
        account_type: newAccountForm.account_type,
        name: newAccountForm.name,
        company_name: newAccountForm.company_name || null,
        password: newAccountForm.password,
        password_confirmation: newAccountForm.password_confirmation,
      });

      showSuccess(response.data?.message || "Compte créé avec succès !");
      
      // Réinitialiser le formulaire
      newAccountForm.account_type = "";
      newAccountForm.name = "";
      newAccountForm.company_name = "";
      newAccountForm.password = "";
      newAccountForm.password_confirmation = "";

      // Recharger les comptes liés
      await loadLinkedAccounts();
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        showError(errors[firstErrorField][0]);
      } else {
        showError(error.response?.data?.message || "Erreur lors de la création du compte.");
      }
    } finally {
      isCreatingAccount.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // Charger les données utilisateur
  onMounted(async () => {
    if (!user.value) {
      await fetchUser();
    }
    // Charger les comptes liés
    await loadLinkedAccounts();
  });
</script>

<style scoped>
  /* Styles supplémentaires si nécessaire */
</style>
