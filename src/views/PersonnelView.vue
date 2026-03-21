<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <div class="container mx-auto px-4 py-10">
      <div class="max-w-6xl mx-auto mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold">Personnel</h1>
          <p class="text-slate-400 text-sm">Gérez le personnel associé à vos commandes entreprise.</p>
        </div>
        <button
          @click="router.push({ name: 'Dashboard' })"
          class="bg-slate-800 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retour
        </button>
      </div>

      <div v-if="!user" class="max-w-6xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-slate-700 animate-pulse">
        <div class="h-7 w-48 bg-slate-700 rounded mb-6" />
        <div class="space-y-4">
          <div class="h-20 bg-slate-700/40 rounded-xl border border-slate-600" />
          <div class="h-20 bg-slate-700/40 rounded-xl border border-slate-600" />
          <div class="h-20 bg-slate-700/40 rounded-xl border border-slate-600" />
        </div>
      </div>

      <div
        v-else-if="user.role !== 'business_admin'"
        class="max-w-3xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-slate-700"
      >
        <p class="text-slate-200 font-medium mb-2">Cette page est réservée aux comptes entreprise.</p>
        <p class="text-slate-400 text-sm">Retournez au tableau de bord pour continuer.</p>
      </div>

      <div
        v-else
        class="max-w-6xl mx-auto p-4 sm:p-6 bg-slate-800/50 rounded-lg border border-slate-700"
      >
        <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Gérer le Personnel</h2>

        <div v-if="isLoadingBusinessOrders" class="space-y-4 animate-pulse">
          <div class="h-5 w-48 bg-slate-700 rounded" />
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="h-20 bg-slate-700/40 rounded-xl border border-slate-600" />
            <div class="h-20 bg-slate-700/40 rounded-xl border border-slate-600" />
            <div class="h-20 bg-slate-700/40 rounded-xl border border-slate-600 hidden lg:block" />
          </div>
        </div>

        <div v-else-if="!hasBusinessOrder" class="text-slate-400 italic text-center py-8">
          Aucune commande entreprise trouvée.
        </div>

        <template v-else>
          <div v-if="businessOrders.length > 1" class="mb-6">
            <label class="block text-sm font-medium text-slate-300 mb-3">Sélectionner une commande :</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                v-for="order in businessOrders"
                :key="order.id"
                @click="selectBusinessOrder(order.id)"
                :class="[
                  'p-4 rounded-xl border-2 transition-all duration-300 text-left',
                  selectedOrderId === order.id
                    ? 'bg-sky-500/20 border-sky-500 shadow-lg shadow-sky-500/30'
                    : 'bg-slate-700/50 border-slate-600 hover:border-sky-400 hover:bg-slate-700',
                ]"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="[
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedOrderId === order.id ? 'bg-sky-500' : 'bg-slate-600',
                    ]"
                  >
                    <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      :class="[
                        'font-semibold text-sm truncate',
                        selectedOrderId === order.id ? 'text-sky-400' : 'text-white',
                      ]"
                    >
                      Commande #{{ order.order_number }}
                    </p>
                    <div class="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        {{ order.total_employees }} pers.
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                        {{ order.card_quantity }} carte{{ order.card_quantity > 1 ? "s" : "" }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedOrderId === order.id" class="flex-shrink-0">
                    <svg class="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Navigation onglets -->
          <div class="mb-6">
            <div class="inline-flex w-full sm:w-auto bg-slate-900/30 border border-slate-700 rounded-xl p-1 gap-1">
              <button
                type="button"
                @click="activeSection = 'affectation'"
                :class="[
                  'flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeSection === 'affectation'
                    ? 'bg-sky-500/20 border border-sky-500 text-sky-300 shadow-lg shadow-sky-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40 border border-transparent',
                ]"
              >
                Affectation
              </button>
              <button
                type="button"
                @click="activeSection = 'parametres'"
                :class="[
                  'flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeSection === 'parametres'
                    ? 'bg-sky-500/20 border border-sky-500 text-sky-300 shadow-lg shadow-sky-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40 border border-transparent',
                ]"
              >
                Paramètres
              </button>
            </div>
          </div>

          <!-- Services activés (commande sélectionnée) -->
          <div
            v-if="selectedOrderId && orderActiveServicesState.services.length > 0"
            class="mb-6 relative z-20"
          >
            <button
              type="button"
              @click="servicesDropdownOpen = !servicesDropdownOpen"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-sky-500/50 bg-sky-500/10 text-sky-300 text-sm font-semibold hover:bg-sky-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Services activés pour cette commande
              <svg
                class="w-4 h-4 transition-transform flex-shrink-0"
                :class="servicesDropdownOpen ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="servicesDropdownOpen"
              class="absolute left-0 right-0 sm:right-auto sm:min-w-[240px] mt-2 py-1 rounded-xl border border-slate-600 bg-slate-900 shadow-xl"
            >
              <router-link
                v-for="svc in orderActiveServicesState.services"
                :key="svc.slug"
                :to="{
                  name: 'PersonnelService',
                  params: { serviceSlug: svc.slug },
                  query: selectedOrderId ? { order: String(selectedOrderId) } : {},
                }"
                class="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 hover:text-sky-300 transition-colors"
                @click="servicesDropdownOpen = false"
              >
                {{ svc.label }}
              </router-link>
            </div>
          </div>

          <!-- Vue Affectation -->
          <div v-if="activeSection === 'affectation'" ref="assignmentsSectionRef" class="scroll-mt-6">
            <div v-if="isLoadingSlots" class="space-y-4 animate-pulse">
              <div class="bg-slate-700/30 rounded-lg border border-slate-600 p-4">
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                    <div class="h-6 sm:h-8 w-20 sm:w-24 bg-slate-600/50 rounded-full"></div>
                    <div class="h-5 sm:h-6 w-24 sm:w-32 bg-slate-600/50 rounded"></div>
                    <div class="h-5 sm:h-6 w-16 sm:w-20 bg-slate-600/50 rounded-full"></div>
                    <div class="h-5 sm:h-6 w-24 sm:w-28 bg-slate-600/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              <p class="text-center text-slate-400 text-xs sm:text-sm mt-4">Chargement du personnel...</p>
            </div>

            <div v-else-if="currentOrderSlots.length > 0" class="space-y-4">
              <div
                v-for="slot in currentOrderSlots"
                :key="slot.slot_number"
                class="bg-slate-700/30 rounded-lg border border-slate-600 p-3 sm:p-4 transition-all hover:border-slate-500"
              >
                <div v-if="!slot.is_assigned" class="space-y-3">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        class="px-2 sm:px-3 py-1 bg-slate-600 text-slate-200 rounded-full text-xs sm:text-sm font-semibold border border-slate-500 whitespace-nowrap"
                      >
                        Personnel {{ slot.display_number }}
                      </span>
                      <span
                        class="px-2 sm:px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30 whitespace-nowrap"
                      >
                        {{ slot.cards_quantity }} carte{{ slot.cards_quantity > 1 ? "s" : "" }}
                      </span>
                      <span
                        class="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs border border-yellow-500/30 whitespace-nowrap"
                      >
                        ⏳ Non assigné
                      </span>
                    </div>
                  </div>

                  <form @submit.prevent="assignSlot(slot)" class="space-y-3">
                    <!-- Ligne 1 : Nom complet | Email -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        v-model.trim="slot.temp_name"
                        type="text"
                        placeholder="Nom complet"
                        required
                        class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      />
                      <input
                        v-model.trim="slot.temp_email"
                        type="email"
                        placeholder="Email"
                        required
                        class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      />
                    </div>

                    <!-- Ligne 2 : Matricule (opt) | Département (opt) | Groupe (optionnel) -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        v-model.trim="slot.temp_matricule"
                        type="text"
                        placeholder="Matricule (optionnel)"
                        class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      />
                      <input
                        v-model.trim="slot.temp_department"
                        type="text"
                        placeholder="Département (optionnel)"
                        class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      />
                      <select
                        v-model="slot.temp_group"
                        :disabled="groupOptions.length === 0"
                        class="bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option v-if="groupOptions.length === 0" disabled value="">
                          Aucun groupe n'est configuré
                        </option>
                        <option v-else value="">Aucun groupe sélectionné</option>
                        <option v-for="g in groupOptions" :key="g" :value="g">{{ g }}</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      :disabled="slot.isAssigning"
                      class="w-full bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <svg v-if="slot.isAssigning" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ slot.isAssigning ? "Assignation..." : "✓ Assigner" }}
                    </button>
                  </form>

                  <p v-if="slot.feedback" :class="slot.isError ? 'text-red-400' : 'text-green-400'" class="text-sm mt-2">
                    {{ slot.feedback }}
                  </p>
                </div>

                <div
                  v-else
                  @click="openEmployeeModal(slot)"
                  class="cursor-pointer hover:bg-slate-700/50 transition-colors rounded-lg p-2 -m-2"
                >
                  <div class="flex items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <span
                          class="px-2 sm:px-3 py-1 bg-slate-600 text-slate-200 rounded-full text-xs sm:text-sm font-semibold border border-slate-500 whitespace-nowrap"
                        >
                          Personnel {{ slot.display_number }}
                        </span>
                        <strong class="text-white font-semibold text-base sm:text-lg break-words">{{ slot.employee_name }}</strong>
                        <span
                          class="px-2 sm:px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-xs border border-sky-500/30 whitespace-nowrap"
                        >
                          {{ slot.cards_quantity }} carte{{ slot.cards_quantity > 1 ? "s" : "" }}
                        </span>
                        <span
                          :class="
                            slot.is_configured
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          "
                          class="px-2 sm:px-3 py-1 rounded-full text-xs border whitespace-nowrap"
                        >
                          {{ slot.is_configured ? "✓ Configuré" : "⏳ Non configuré" }}
                        </span>
                        <span
                          v-if="pointageLabelForSlot(slot)"
                          class="px-2 sm:px-3 py-1 bg-cyan-500/15 text-cyan-300 rounded-full text-xs border border-cyan-500/35 max-w-full min-w-0 truncate sm:whitespace-normal sm:break-words sm:max-w-[20rem]"
                          :title="pointageLabelForSlot(slot)"
                        >
                          {{ pointageLabelForSlot(slot) }}
                        </span>
                      </div>
                      <p class="text-slate-400 text-xs sm:text-sm break-words">
                        {{ slot.employee_email }}{{ employeeMatriculeDeptSuffix(slot) }}
                      </p>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 flex-shrink-0 mt-1 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-slate-400 italic text-center py-8">Aucun personnel dans cette commande.</p>
          </div>

          <!-- Vue Paramètres : assistant groupes + calendrier + géofencing -->
          <div v-else class="space-y-8 text-slate-300">
            <div class="bg-slate-700/20 border border-slate-700 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white">Paramètres</h3>
              <p class="text-slate-400 text-sm mt-1">
                Créez des profils de groupe (calendrier, pointage, zone GPS) puis assignez-les au personnel.
              </p>
            </div>

            <div class="bg-slate-800/40 border border-slate-600 rounded-xl p-4 sm:p-6">
              <h4 class="text-white font-semibold mb-4 flex items-center gap-2">
                <span class="text-sky-400">①</span> Nouveau profil de groupe
              </h4>
              <GroupSecurityWizard
                :initial-payload="wizardInitialPayload"
                :edit-index="wizardEditIndex"
                @add-group="onWizardAddGroup"
                @update-group="onWizardUpdateGroup"
              />
            </div>

            <div class="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-4 sm:p-5">
              <div class="flex items-center justify-between gap-3 mb-3">
                <h4 class="text-white font-semibold">Groupes enregistrés sur la commande</h4>
                <button
                  type="button"
                  @click="addGroupDraft"
                  class="bg-slate-800 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  + Ligne manuelle
                </button>
              </div>

              <p v-if="groupsDraft.length === 0" class="text-slate-400 text-sm">Aucun groupe pour l’instant.</p>

              <div v-else class="space-y-3">
                <div
                  v-for="(g, idx) in groupsDraft"
                  :key="idx"
                  class="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-600/80"
                >
                  <input
                    v-model.trim="groupsDraft[idx]"
                    type="text"
                    placeholder="Nom du groupe"
                    class="flex-1 bg-slate-600 border border-slate-500 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <span
                    v-if="groupSecurityConfigsDraft[idx] && groupSecurityConfigsDraft[idx].version"
                    class="text-xs text-emerald-400/90 whitespace-nowrap px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/10"
                    >Profil détaillé</span
                  >
                  <button
                    v-if="groupSecurityConfigsDraft[idx] && groupSecurityConfigsDraft[idx].version"
                    type="button"
                    @click="editGroupConfig(idx)"
                    class="shrink-0 bg-slate-800 hover:bg-slate-700/60 border border-slate-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    @click="removeGroupDraft(idx)"
                    class="shrink-0 bg-slate-800 hover:bg-red-900/30 border border-slate-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    aria-label="Supprimer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div class="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p v-if="settingsFeedback" :class="settingsError ? 'text-red-400' : 'text-green-400'" class="text-sm">
                  {{ settingsFeedback }}
                </p>
                <button
                  type="button"
                  @click="saveGroups"
                  :disabled="isSavingGroups || !selectedOrderId"
                  class="sm:ml-auto bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  {{ isSavingGroups ? "Enregistrement..." : "Enregistrer les groupes" }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="showEmployeeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      @click.self="closeEmployeeModal"
    >
      <div
        class="w-full max-w-[92vw] sm:max-w-md bg-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl border border-slate-700 max-h-[85vh] overflow-y-auto overscroll-contain"
      >
        <div v-if="showDeleteConfirmation" class="space-y-6">
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Confirmer la suppression</h3>
            <p class="text-slate-300 mb-2">Voulez-vous supprimer ce personnel ?</p>
            <p v-if="selectedEmployee" class="font-semibold text-white text-lg">{{ selectedEmployee.name }}</p>
          </div>

          <div class="flex gap-3">
            <button
              @click="cancelDelete"
              :disabled="isProcessing"
              class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              NON
            </button>
            <button
              @click="confirmDelete"
              :disabled="isProcessing"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="isProcessing" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ isProcessing ? "Suppression..." : "OUI" }}</span>
            </button>
          </div>
        </div>

        <div v-else-if="selectedEmployee">
          <div class="flex justify-between items-center gap-3 mb-5 sm:mb-6">
            <h3 class="text-lg sm:text-xl font-bold text-white">Gérer le Personnel</h3>
            <button @click="closeEmployeeModal" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-5 sm:space-y-6">
            <div class="bg-slate-700/30 rounded-lg p-4">
              <p class="text-white font-semibold text-lg">{{ selectedEmployee.name }}</p>
              <p class="text-slate-400 text-sm">{{ selectedEmployee.email }}</p>
              <div class="flex flex-wrap items-center gap-2 mt-3">
                <span :class="selectedEmployee.email_verified_at ? 'text-green-400' : 'text-yellow-400'" class="text-xs">
                  {{ selectedEmployee.email_verified_at ? "✓ Vérifié" : "⏳ En attente de vérification" }}
                </span>
                <div
                  v-if="selectedEmployee.total_cards > 0"
                  class="flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/30"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  <span class="text-sm font-semibold">
                    {{ selectedEmployee.total_cards }} carte{{ selectedEmployee.total_cards > 1 ? "s" : "" }}
                  </span>
                </div>
                <div v-else class="px-3 py-1 bg-slate-600/30 text-slate-400 rounded-full text-xs">Aucune carte assignée</div>
              </div>
            </div>

            <div class="space-y-3">
              <a
                v-if="selectedEmployee.is_configured && selectedEmployee.username"
                :href="getEmployeeProfileUrl(selectedEmployee)"
                target="_blank"
                class="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Afficher le Profil</span>
              </a>

              <button
                v-if="!selectedEmployee.is_configured"
                @click="removeCardFromEmployee"
                :disabled="isProcessing"
                class="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
                <span>Retirer une Carte</span>
              </button>

              <div
                v-if="selectedEmployee.is_configured"
                class="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-medium py-3 px-4 rounded-lg flex items-center gap-2"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span class="text-sm">Impossible de retirer des cartes car l'employé a déjà configuré sa carte.</span>
              </div>

              <!-- Sécurité Appareil (lié à la commande sélectionnée) -->
              <div
                v-if="selectedEmployee.is_configured"
                class="w-full bg-slate-700/30 border border-slate-600 rounded-lg p-4 space-y-3"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h4 class="text-white font-semibold">Sécurité Appareil</h4>
                  <span class="text-xs text-slate-400">Appareil unique</span>
                </div>
                <p class="text-sm text-slate-300">
                  Statut :
                  <span class="text-slate-200 font-medium">
                    {{
                      selectedEmployee.device_model
                        ? `${selectedEmployee.device_model} lié`
                        : selectedEmployee.device_uuid
                          ? "Appareil lié"
                          : "Aucun appareil lié"
                    }}
                  </span>
                </p>
                <button
                  type="button"
                  @click="resetEmployeeDevice"
                  :disabled="isProcessing"
                  class="w-full bg-slate-800 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v6h6M20 20v-6h-6M5 9a7 7 0 0112.02-3.11M19 15a7 7 0 01-12.02 3.11"
                    />
                  </svg>
                  <span>Réinitialiser l'appareil</span>
                </button>
              </div>

              <button
                @click="deleteEmployee"
                :disabled="isProcessing"
                class="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg v-if="isProcessing" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>{{ isProcessing ? "Suppression..." : "Supprimer l'Employé" }}</span>
              </button>
            </div>

            <p v-if="employeeModalFeedback" :class="employeeModalError ? 'text-red-400' : 'text-green-400'" class="text-sm text-center">
              {{ employeeModalFeedback }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import apiClient from "@/api";
import { useAuth } from "@/composables/useAuth";
import GroupSecurityWizard from "@/components/personnel/GroupSecurityWizard.vue";
import { orderActiveServicesState, refreshOrderActiveServices } from "@/stores/orderActiveServices";

const router = useRouter();
const { user } = useAuth();

const assignmentsSectionRef = ref(null);

// ✅ PERF: cache mémoire des commandes (mutualisé avec /parametres, /choisir-profil, /mes-commandes)
const ORDERS_CACHE = (globalThis.__DIGICARD_ORDERS_CACHE__ ||= { value: null, ts: 0, inFlight: null });
const ORDERS_TTL_MS = 60_000; // 60s

// ⚠️ Ne pas afficher "Aucune commande entreprise" tant qu'on n'a pas un résultat fiable
const hasUsableFreshCache =
  Array.isArray(ORDERS_CACHE.value) && ORDERS_CACHE.value.length > 0 && Date.now() - ORDERS_CACHE.ts < ORDERS_TTL_MS;
const isLoadingBusinessOrders = ref(!hasUsableFreshCache);

const hasBusinessOrder = ref(false);
const businessOrders = ref([]);
const selectedOrderId = ref(null);
const servicesDropdownOpen = ref(false);
const currentOrderSlots = ref([]);
const isLoadingSlots = ref(false);
const slotsLoaded = ref(false);

const activeSection = ref("affectation");

const showEmployeeModal = ref(false);
const selectedEmployee = ref(null);
const isProcessing = ref(false);
const employeeModalFeedback = ref("");
const employeeModalError = ref(false);
const showDeleteConfirmation = ref(false);

const configuredGroups = ref([]);
const groupOptions = computed(() =>
  (configuredGroups.value || []).filter((g) => typeof g === "string" && g.trim()).map((g) => g.trim()),
);

const groupsDraft = ref([]);
/** Profils détaillés (calendrier + géofencing), index aligné sur groupsDraft */
const groupSecurityConfigsDraft = ref([]);
const isSavingGroups = ref(false);
const settingsFeedback = ref("");
const settingsError = ref(false);

const setCsrfHeader = () => {
  const xsrfToken = Cookies.get("XSRF-TOKEN");
  if (xsrfToken) {
    apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
  } else {
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

const applyBusinessOrdersFromAllOrders = async (allOrders) => {
  businessOrders.value = (allOrders || []).filter((order) => order?.order_type === "business");
  hasBusinessOrder.value = businessOrders.value.length > 0;

  // Si on a une liste non vide (cache ou API), on peut considérer l'état comme fiable
  if (Array.isArray(allOrders) && allOrders.length > 0) {
    isLoadingBusinessOrders.value = false;
  }

  // Garder la sélection si elle existe encore, sinon basculer sur la première
  if (hasBusinessOrder.value) {
    const exists = businessOrders.value.some((o) => o.id === selectedOrderId.value);
    if (!selectedOrderId.value || !exists) {
      selectedOrderId.value = businessOrders.value[0].id;
    }
    // Par défaut: onglet Affectation actif quand une commande est chargée/sélectionnée
    activeSection.value = "affectation";

    await nextTick();
    if (!slotsLoaded.value && selectedOrderId.value) {
      await loadOrderSlots();
    }
  } else {
    selectedOrderId.value = null;
    currentOrderSlots.value = [];
    slotsLoaded.value = false;
  }
};

const checkBusinessOrders = async (options = {}) => {
  const { preferCache = true, backgroundRefresh = true } = options;
  if (user.value?.role !== "business_admin") return;

  const now = Date.now();
  const hasFreshCache = Array.isArray(ORDERS_CACHE.value) && now - ORDERS_CACHE.ts < ORDERS_TTL_MS;
  const hasUsableCache = hasFreshCache && Array.isArray(ORDERS_CACHE.value) && ORDERS_CACHE.value.length > 0;

  // Affichage instantané depuis le cache si dispo
  if (preferCache && hasUsableCache) {
    await applyBusinessOrdersFromAllOrders(ORDERS_CACHE.value);
    if (!backgroundRefresh) return;
    // On continue en arrière-plan pour rafraîchir silencieusement
  }

  try {
    if (!hasUsableCache) {
      isLoadingBusinessOrders.value = true;
    }
    // Dédupliquer les appels concurrents (si une autre page a déjà lancé /api/orders)
    let response;
    if (ORDERS_CACHE.inFlight) {
      response = await ORDERS_CACHE.inFlight;
    } else {
      ORDERS_CACHE.inFlight = apiClient.get(`/api/orders`);
      response = await ORDERS_CACHE.inFlight;
    }

    const orders = Array.isArray(response.data) ? response.data : [];
    ORDERS_CACHE.value = orders;
    ORDERS_CACHE.ts = Date.now();

    await applyBusinessOrdersFromAllOrders(orders);
  } catch (error) {
    console.error("Erreur lors du chargement des commandes business:", error);
    hasBusinessOrder.value = false;
    businessOrders.value = [];
  } finally {
    isLoadingBusinessOrders.value = false;
    ORDERS_CACHE.inFlight = null;
  }
};

const scrollToAssignments = async () => {
  await nextTick();
  const el = assignmentsSectionRef.value;
  if (!el || typeof el.scrollIntoView !== "function") return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const selectBusinessOrder = async (orderId) => {
  selectedOrderId.value = orderId;
  activeSection.value = "affectation";
  slotsLoaded.value = false;
  currentOrderSlots.value = [];
  await loadOrderSlots();
  await scrollToAssignments();
};

const loadOrderSlots = async () => {
  if (!selectedOrderId.value) return;
  if (slotsLoaded.value && currentOrderSlots.value.length > 0) return;

  slotsLoaded.value = false;
  isLoadingSlots.value = true;
  try {
    const response = await apiClient.get(`/api/orders/${selectedOrderId.value}`);
    const order = response.data;

    // Récupérer les groupes de sécurité configurés (depuis l'onglet Paramètres)
    configuredGroups.value = Array.isArray(order?.security_groups) ? order.security_groups : [];
    const cfgs = Array.isArray(order?.group_security_configs) ? order.group_security_configs : [];
    const names = groupOptions.value;
    if (activeSection.value === "parametres") {
      groupsDraft.value = [...names];
      groupSecurityConfigsDraft.value = names.map((_, i) => (cfgs[i] && typeof cfgs[i] === "object" ? { ...cfgs[i] } : null));
    }

    let slotsToDisplay = order.employee_slots || [];

    const orderEmployeesMap = new Map();
    if (order.order_employees && Array.isArray(order.order_employees)) {
      order.order_employees.forEach((oe) => {
        if (oe.employee_id) orderEmployeesMap.set(oe.employee_id, oe);
      });
    }

    slotsToDisplay = slotsToDisplay
      .filter((slot) => {
        if (slot.employee_id === user.value?.id) return false;
        const hasCards = (slot.cards_quantity ?? 0) > 0;
        if (slot.is_assigned === false && hasCards) return true;
        if (slot.is_assigned === false && !hasCards) return false;
        return true;
      })
      .map((slot) => {
        const orderEmployee = slot.employee_id ? orderEmployeesMap.get(slot.employee_id) : null;
        const actualCardQuantity = orderEmployee?.card_quantity ?? slot.cards_quantity ?? 0;

        if (!slot.employee_id || slot.is_assigned === false) {
          const originalCardsQuantity = slot.cards_quantity && slot.cards_quantity > 0 ? slot.cards_quantity : 1;
          return {
            ...slot,
            employee_id: null,
            employee_name: null,
            employee_email: null,
            employee_username: null,
            is_assigned: false,
            is_configured: false,
            cards_quantity: originalCardsQuantity,
          };
        }

        const isAssigned = slot.employee_id && slot.is_assigned !== false;
        const isEmployeeDeleted = isAssigned && !orderEmployee;
        const hasNoCards = isAssigned && actualCardQuantity <= 0;
        if (isEmployeeDeleted || hasNoCards) {
          const originalCardsQuantity = slot.cards_quantity && slot.cards_quantity > 0 ? slot.cards_quantity : 1;
          return {
            ...slot,
            employee_id: null,
            employee_name: null,
            employee_email: null,
            employee_username: null,
            is_assigned: false,
            is_configured: false,
            cards_quantity: originalCardsQuantity,
          };
        }
        return slot;
      });

    const boIdx = businessOrders.value.findIndex((o) => o.id === order.id);
    if (boIdx >= 0) {
      businessOrders.value[boIdx] = {
        ...businessOrders.value[boIdx],
        security_groups: order.security_groups,
        group_security_configs: order.group_security_configs ?? null,
      };
    }

    currentOrderSlots.value = slotsToDisplay.map((slot, index) => {
      const orderEmployee = slot.employee_id ? orderEmployeesMap.get(slot.employee_id) : null;
      const actualCardQuantity = orderEmployee?.card_quantity ?? slot.cards_quantity ?? 0;
      return {
        ...slot,
        display_number: index + 1,
        temp_name: "",
        temp_email: "",
        temp_matricule: "",
        temp_department: "",
        temp_group: "",
        isAssigning: false,
        feedback: "",
        isError: false,
        actual_card_quantity: actualCardQuantity,
        cards_quantity: actualCardQuantity,
        employee_group: orderEmployee?.employee_group ?? slot.employee_group ?? null,
        employee_matricule:
          orderEmployee?.employee_matricule ??
          orderEmployee?.employeeMatricule ??
          slot.employee_matricule ??
          slot.employeeMatricule ??
          null,
        employee_department:
          orderEmployee?.employee_department ??
          orderEmployee?.employeeDepartment ??
          slot.employee_department ??
          slot.employeeDepartment ??
          null,
      };
    });

    slotsLoaded.value = true;
    const oAfterSlots = businessOrders.value.find((x) => x.id === selectedOrderId.value);
    refreshOrderActiveServices(oAfterSlots);
  } catch (error) {
    console.error("Error loading order slots:", error);
    currentOrderSlots.value = [];
  } finally {
    isLoadingSlots.value = false;
  }
};

const assignSlot = async (slot) => {
  if (!slot.temp_name || !slot.temp_email) {
    slot.feedback = "Veuillez remplir les champs obligatoires.";
    slot.isError = true;
    return;
  }

  slot.isAssigning = true;
  slot.feedback = "";
  slot.isError = false;

  try {
    await apiClient.get("/sanctum/csrf-cookie");
    setCsrfHeader();

    const response = await apiClient.post(`/api/orders/${selectedOrderId.value}/slots/${slot.slot_number}/assign`, {
      employee_name: slot.temp_name,
      employee_email: slot.temp_email,
      employee_matricule: slot.temp_matricule || null,
      employee_department: slot.temp_department || null,
      employee_group: slot.temp_group,
    });

    slot.feedback = response.data.message || "Employé assigné avec succès !";
    slot.isError = false;

    slotsLoaded.value = false;
    await loadOrderSlots();
    await checkBusinessOrders({ preferCache: false, backgroundRefresh: false });
  } catch (error) {
    console.error("Error assigning slot:", error);
    slot.feedback = error.response?.data?.message || "Erreur lors de l'assignation.";
    slot.isError = true;
  } finally {
    slot.isAssigning = false;
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

const openEmployeeModal = async (slot) => {
  let actualCardQuantity = slot.cards_quantity || 0;
  selectedEmployee.value = {
    id: slot.employee_id,
    name: slot.employee_name,
    email: slot.employee_email,
    username: slot.employee_username,
    total_cards: actualCardQuantity,
    email_verified_at: slot.is_configured ? new Date() : null,
    is_configured: slot.is_configured,
    slot_number: slot.slot_number,
    device_uuid: null,
    device_model: null,
    employee_group: null,
  };
  showEmployeeModal.value = true;
  employeeModalFeedback.value = "";
  employeeModalError.value = false;

  try {
    if (selectedOrderId.value && slot.employee_id) {
      const response = await apiClient.get(`/api/orders/${selectedOrderId.value}`);
      const order = response.data;
      if (order.order_employees && Array.isArray(order.order_employees)) {
        const orderEmployee = order.order_employees.find((oe) => oe.employee_id === slot.employee_id);
        if (orderEmployee && orderEmployee.card_quantity !== undefined) {
          actualCardQuantity = orderEmployee.card_quantity;
          if (selectedEmployee.value) selectedEmployee.value.total_cards = actualCardQuantity;
        }
        if (orderEmployee && selectedEmployee.value) {
          selectedEmployee.value.employee_group = orderEmployee.employee_group || null;
          selectedEmployee.value.device_uuid = orderEmployee.device_uuid || null;
          selectedEmployee.value.device_model = orderEmployee.device_model || null;
        }
      }
    }

    // Fallback legacy (users.device_*) si la ligne order_employee n’a pas encore les champs
    if (slot.employee_id && selectedEmployee.value && !selectedEmployee.value.device_uuid) {
      try {
        const employeesResponse = await apiClient.get("/api/employees");
        const employees = Array.isArray(employeesResponse.data) ? employeesResponse.data : [];
        const found = employees.find((e) => e?.id === slot.employee_id);
        if (found && selectedEmployee.value) {
          selectedEmployee.value.device_uuid = found.device_uuid || null;
          selectedEmployee.value.device_model = found.device_label || found.device_model || null;
        }
      } catch {
        /* non bloquant */
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données order_employees:", error);
  }
};

const closeEmployeeModal = () => {
  showEmployeeModal.value = false;
  showDeleteConfirmation.value = false;
  selectedEmployee.value = null;
  employeeModalFeedback.value = "";
  employeeModalError.value = false;
};

const removeCardFromEmployee = async () => {
  if (isProcessing.value || !selectedEmployee.value) return;

  if (selectedEmployee.value.is_configured) {
    employeeModalFeedback.value = "Impossible de retirer une carte. Cet employé a déjà configuré sa carte.";
    employeeModalError.value = true;
    return;
  }

  if (!window.confirm("Êtes-vous sûr de vouloir retirer une carte à cet employé ?")) return;

  isProcessing.value = true;
  employeeModalFeedback.value = "";
  employeeModalError.value = false;

  try {
    setCsrfHeader();
    const response = await apiClient.post(`/api/employees/${selectedEmployee.value.id}/remove-card`);
    await loadOrderSlots();
    selectedEmployee.value.total_cards = response.data.card_quantity;
    employeeModalFeedback.value = response.data.message || "Carte retirée avec succès !";
    employeeModalError.value = false;
    setTimeout(() => closeEmployeeModal(), 2000);
  } catch (error) {
    console.error("Erreur lors du retrait de carte:", error);
    employeeModalFeedback.value = error.response?.data?.message || "Erreur lors du retrait de la carte.";
    employeeModalError.value = true;
  } finally {
    isProcessing.value = false;
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

const deleteEmployee = () => {
  if (isProcessing.value || !selectedEmployee.value) return;
  showDeleteConfirmation.value = true;
};

const resetEmployeeDevice = async () => {
  if (isProcessing.value || !selectedEmployee.value) return;
  if (!selectedEmployee.value.is_configured) return;

  if (!window.confirm("Réinitialiser l'appareil lié ? L'employé pourra configurer sur un nouveau téléphone.")) return;

  isProcessing.value = true;
  employeeModalFeedback.value = "";
  employeeModalError.value = false;

  try {
    setCsrfHeader();
    const response = await apiClient.post(`/api/employees/${selectedEmployee.value.id}/reset-device`, {
      order_id: selectedOrderId.value,
    });
    if (selectedEmployee.value) {
      selectedEmployee.value.device_uuid = null;
      selectedEmployee.value.device_model = null;
    }
    employeeModalFeedback.value = response.data?.message || "Appareil réinitialisé avec succès.";
    employeeModalError.value = false;
  } catch (error) {
    employeeModalFeedback.value = error.response?.data?.message || "Erreur lors de la réinitialisation de l'appareil.";
    employeeModalError.value = true;
  } finally {
    isProcessing.value = false;
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

const confirmDelete = async () => {
  if (isProcessing.value || !selectedEmployee.value) return;
  isProcessing.value = true;
  employeeModalFeedback.value = "";
  employeeModalError.value = false;
  showDeleteConfirmation.value = false;

  try {
    setCsrfHeader();
    const deletedEmployeeId = selectedEmployee.value.id;
    const response = await apiClient.delete(`/api/employees/${deletedEmployeeId}`, {
      data: { order_id: selectedOrderId.value },
    });

    employeeModalFeedback.value =
      response.data.message ||
      "Personnel retiré avec succès ! Le slot est maintenant disponible pour assigner un nouvel employé.";
    employeeModalError.value = false;

    slotsLoaded.value = false;
    await loadOrderSlots();
    await checkBusinessOrders({ preferCache: false, backgroundRefresh: false });

    setTimeout(() => closeEmployeeModal(), 2500);
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    employeeModalFeedback.value = error.response?.data?.message || "Erreur lors de la suppression.";
    employeeModalError.value = true;
  } finally {
    isProcessing.value = false;
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  employeeModalFeedback.value = "";
  employeeModalError.value = false;
};

const getOrderAccessToken = (order) => {
  if (!order) return null;
  if (order.access_token) return order.access_token;
  if (order.profile_token) return order.profile_token;
  if (order.public_token) return order.public_token;
  if (order.token) return order.token;
  return null;
};

const getOrderShortCode = (order) => {
  if (!order) return null;
  return order.short_code || order.shortCode || null;
};

const getEmployeeProfileUrl = (employee) => {
  if (!employee?.username) return "";
  const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
  const order = businessOrders.value.find((o) => o.id === selectedOrderId.value);
  const shortCode = order ? getOrderShortCode(order) : null;
  if (shortCode) return `${backendUrl}/p/${shortCode}`;
  const accessToken = order ? getOrderAccessToken(order) : null;
  if (accessToken) return `${backendUrl}/profil/${employee.username}?token=${accessToken}`;
  if (selectedOrderId.value) return `${backendUrl}/profil/${employee.username}?order=${selectedOrderId.value}`;
  return `${backendUrl}/profil/${employee.username}`;
};

/**
 * Libellé « Pointage : … » sur la carte employé si le groupe assigné a le pointage activé (profil enregistré).
 */
function pointageLabelForSlot(slot) {
  const raw = slot?.employee_group;
  const groupName = typeof raw === "string" ? raw.trim() : "";
  if (!groupName) return "";
  const order = businessOrders.value.find((o) => o.id === selectedOrderId.value);
  if (!order) return "";
  const groups = Array.isArray(order.security_groups) ? order.security_groups : [];
  const configs = Array.isArray(order.group_security_configs) ? order.group_security_configs : [];
  const idx = groups.findIndex((g) => (typeof g === "string" ? g.trim() : "") === groupName);
  if (idx < 0) return "";
  const cfg = configs[idx];
  if (!cfg || typeof cfg !== "object") return "";
  if (!cfg.services?.pointage) return "";
  return `Pointage : ${groupName}`;
}

/** Texte à coller après l’e-mail (même style) : matricule / département saisis à l’assignation. */
function employeeMatriculeDeptSuffix(slot) {
  const m = (slot?.employee_matricule ?? slot?.employeeMatricule ?? "").toString().trim();
  const d = (slot?.employee_department ?? slot?.employeeDepartment ?? "").toString().trim();
  const parts = [];
  if (m) parts.push(`Matricule : ${m}`);
  if (d) parts.push(`Département : ${d}`);
  if (!parts.length) return "";
  return " · " + parts.join(" · ");
}

onMounted(async () => {
  // La route est protégée par le guard auth. Ici on limite juste par rôle.
  if (user.value && user.value.role !== "business_admin") {
    router.replace({ name: "Dashboard" });
    return;
  }
  await checkBusinessOrders({ preferCache: true, backgroundRefresh: true });
});

watch(
  [selectedOrderId, businessOrders],
  () => {
    const o = businessOrders.value.find((x) => x.id === selectedOrderId.value);
    refreshOrderActiveServices(o);
    servicesDropdownOpen.value = false;
  },
  { deep: true, immediate: true },
);

watch(
  activeSection,
  (v) => {
    if (v === "parametres") {
      const names = groupOptions.value;
      groupsDraft.value = [...names];
      const cfgs = []; // recharger depuis commande si besoin
      try {
        const o = businessOrders.value.find((x) => x.id === selectedOrderId.value);
        const raw = o?.group_security_configs;
        if (Array.isArray(raw)) {
          names.forEach((_, i) => cfgs.push(raw[i] && typeof raw[i] === "object" ? { ...raw[i] } : null));
        }
      } catch (_) {
        /* ignore */
      }
      groupSecurityConfigsDraft.value = names.map((_, i) => cfgs[i] ?? null);
      settingsFeedback.value = "";
      settingsError.value = false;
    } else if (v === "affectation") {
      // Resynchroniser la liste des groupes pour le sélecteur d’affectation (au cas où on vient de Paramètres après enregistrement)
      const o = businessOrders.value.find((x) => x.id === selectedOrderId.value);
      const groups = Array.isArray(o?.security_groups) ? o.security_groups : [];
      configuredGroups.value = groups;
    }
  },
  { immediate: false },
);

const addGroupDraft = () => {
  groupsDraft.value = [...(groupsDraft.value || []), ""];
  groupSecurityConfigsDraft.value = [...(groupSecurityConfigsDraft.value || []), null];
};

const removeGroupDraft = (idx) => {
  groupsDraft.value = (groupsDraft.value || []).filter((_, i) => i !== idx);
  groupSecurityConfigsDraft.value = (groupSecurityConfigsDraft.value || []).filter((_, i) => i !== idx);
};

const onWizardAddGroup = (payload) => {
  const name = (payload?.groupName || "").trim();
  if (!name) return;
  const exists = (groupsDraft.value || []).some((g) => (typeof g === "string" ? g.trim() : "") === name);
  if (exists) {
    settingsFeedback.value = `Un groupe nommé « ${name} » existe déjà. Modifiez le nom ou supprimez l’entrée existante.`;
    settingsError.value = true;
    return;
  }
  groupsDraft.value = [...(groupsDraft.value || []), name];
  groupSecurityConfigsDraft.value = [...(groupSecurityConfigsDraft.value || []), payload];
  settingsFeedback.value = `Groupe « ${name} » ajouté à la liste (enregistrez pour persister).`;
  settingsError.value = false;
};

const wizardInitialPayload = ref(null);
const wizardEditIndex = ref(null);

const editGroupConfig = async (idx) => {
  const payload = groupSecurityConfigsDraft.value?.[idx];
  if (!payload) return;
  wizardEditIndex.value = idx;
  // Cloner pour éviter de modifier la liste tant que l’utilisateur n’a pas validé
  wizardInitialPayload.value = JSON.parse(JSON.stringify(payload));
  await nextTick();
  const el = assignmentsSectionRef.value;
  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const onWizardUpdateGroup = ({ index, payload }) => {
  const idx = Number(index);
  if (!Number.isFinite(idx) || idx < 0) return;
  const name = (payload?.groupName || "").trim();
  if (!name) return;

  const existsOther = (groupsDraft.value || []).some((g, i) => {
    if (i === idx) return false;
    return (typeof g === "string" ? g.trim() : "") === name;
  });
  if (existsOther) {
    settingsFeedback.value = `Un autre groupe utilise déjà le nom « ${name} ».`;
    settingsError.value = true;
    return;
  }

  const nextNames = [...(groupsDraft.value || [])];
  const nextCfg = [...(groupSecurityConfigsDraft.value || [])];
  nextNames[idx] = name;
  nextCfg[idx] = payload;
  groupsDraft.value = nextNames;
  groupSecurityConfigsDraft.value = nextCfg;

  wizardEditIndex.value = null;
  wizardInitialPayload.value = null;
  settingsFeedback.value = `Groupe « ${name} » mis à jour (pensez à enregistrer).`;
  settingsError.value = false;
};

const saveGroups = async () => {
  if (!selectedOrderId.value || isSavingGroups.value) return;
  isSavingGroups.value = true;
  settingsFeedback.value = "";
  settingsError.value = false;

  try {
    await apiClient.get("/sanctum/csrf-cookie");
    setCsrfHeader();

    const cleaned = [];
    const configs = [];
    (groupsDraft.value || []).forEach((g, i) => {
      const n = typeof g === "string" ? g.trim() : "";
      if (!n) return;
      cleaned.push(n);
      const c = groupSecurityConfigsDraft.value[i];
      configs.push(c && typeof c === "object" ? c : null);
    });

    const response = await apiClient.patch(`/api/orders/${selectedOrderId.value}/security-groups`, {
      security_groups: cleaned,
      group_security_configs: configs,
    });

    configuredGroups.value = Array.isArray(response.data?.security_groups) ? response.data.security_groups : cleaned;
    const savedCfg = response.data?.group_security_configs;
    const finalNames = groupOptions.value;
    groupsDraft.value = [...finalNames];
    groupSecurityConfigsDraft.value = finalNames.map((_, i) =>
      Array.isArray(savedCfg) && savedCfg[i] && typeof savedCfg[i] === "object" ? savedCfg[i] : null,
    );

    const ord = businessOrders.value.find((o) => o.id === selectedOrderId.value);
    if (ord) {
      ord.security_groups = finalNames;
      ord.group_security_configs = Array.isArray(savedCfg) ? savedCfg : configs;
    }

    // Le groupe est optionnel : ne pas forcer un groupe par défaut sur les slots existants
    currentOrderSlots.value = (currentOrderSlots.value || []).map((s) =>
      s && s.is_assigned === false ? { ...s, temp_group: s.temp_group || "" } : s,
    );

    settingsFeedback.value = response.data?.message || "Groupes enregistrés.";
    settingsError.value = false;
  } catch (error) {
    settingsFeedback.value = error.response?.data?.message || "Erreur lors de l'enregistrement des groupes.";
    settingsError.value = true;
  } finally {
    isSavingGroups.value = false;
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};
</script>
