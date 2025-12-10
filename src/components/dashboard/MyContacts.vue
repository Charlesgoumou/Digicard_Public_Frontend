<template>
  <div class="bg-slate-800/50 rounded-xl border border-slate-700">
    <!-- Header -->
    <div v-if="showHeader" class="p-4 sm:p-6 border-b border-slate-700/50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Contacts Reçus</h2>
            <p class="text-sm text-slate-400">Visiteurs ayant partagé leurs coordonnées</p>
          </div>
        </div>
        <div v-if="newContactsCount > 0" class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">
          {{ newContactsCount }} nouveau{{ newContactsCount > 1 ? 'x' : '' }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-6">
      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="contacts.length === 0" class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-700/50 flex items-center justify-center">
          <svg class="w-10 h-10 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Aucun contact reçu</h3>
        <p class="text-slate-400 text-sm max-w-md mx-auto">
          Les visiteurs de votre profil peuvent partager leurs coordonnées avec vous. 
          Les contacts apparaîtront ici.
        </p>
      </div>

      <!-- Contacts list -->
      <div v-else class="space-y-4">
        <!-- Bouton télécharger tous -->
        <button
          v-if="newContactsCount > 0"
          @click="downloadAllContacts"
          :disabled="isDownloading"
          class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:shadow-none"
        >
          <svg v-if="!isDownloading" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Télécharger tous les nouveaux contacts ({{ newContactsCount }})</span>
        </button>

        <!-- Liste des contacts -->
        <div class="space-y-3">
          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden"
          >
            <!-- Header du contact -->
            <button
              @click="toggleContact(contact.id)"
              class="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                     :class="contact.is_downloaded ? 'bg-slate-600' : 'bg-emerald-500/20'">
                  <span class="text-lg">{{ getInitials(contact.first_name, contact.last_name) }}</span>
                </div>
                <div class="min-w-0 text-left">
                  <p class="text-white font-medium truncate">{{ contact.first_name }} {{ contact.last_name }}</p>
                  <p class="text-slate-400 text-xs truncate">{{ formatDate(contact.created_at) }}</p>
                </div>
                <span v-if="!contact.is_downloaded" class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs border border-emerald-500/30 flex-shrink-0">
                  Nouveau
                </span>
              </div>
              <svg
                :class="['w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2', expandedContacts[contact.id] ? 'rotate-180' : '']"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Détails du contact -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="expandedContacts[contact.id]" class="px-4 pb-4 border-t border-slate-700/50 overflow-hidden">
                <div class="pt-4 space-y-3">
                  <!-- Email -->
                  <div v-if="contact.email" class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a :href="'mailto:' + contact.email" class="text-sky-400 text-sm hover:underline truncate">{{ contact.email }}</a>
                  </div>
                  
                  <!-- Téléphone -->
                  <div v-if="contact.phone" class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a :href="'tel:' + contact.phone" class="text-sky-400 text-sm hover:underline">{{ contact.phone }}</a>
                  </div>
                  
                  <!-- Entreprise -->
                  <div v-if="contact.company" class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-slate-300 text-sm">{{ contact.company }}</span>
                  </div>
                  
                  <!-- Note -->
                  <div v-if="contact.note" class="mt-2 p-3 bg-slate-800/50 rounded-lg">
                    <p class="text-slate-400 text-sm italic">"{{ contact.note }}"</p>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2 pt-2">
                    <button
                      @click.stop="downloadContact(contact)"
                      :disabled="downloadingContactId === contact.id"
                      class="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-emerald-500/30"
                    >
                      <svg v-if="downloadingContactId !== contact.id" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <svg v-else class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Télécharger vCard
                    </button>
                    <button
                      @click.stop="confirmDelete(contact)"
                      :disabled="deletingContactId === contact.id"
                      class="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
                    >
                      <svg v-if="deletingContactId !== contact.id" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <svg v-else class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Info suppression auto -->
        <p class="text-xs text-slate-500 text-center mt-4">
          Les contacts téléchargés sont automatiquement supprimés après 24h.
        </p>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div class="bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full border border-slate-700 p-6">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Supprimer ce contact ?</h3>
              <p class="text-slate-400 text-sm mb-6">
                Le contact de <span class="font-semibold text-white">{{ contactToDelete?.first_name }} {{ contactToDelete?.last_name }}</span> sera définitivement supprimé.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  @click="deleteContact"
                  :disabled="deletingContactId !== null"
                  class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Supprimer
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import apiClient from '@/api';

const props = defineProps({
  orderId: {
    type: [Number, String],
    default: null
  },
  showHeader: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:newCount']);

const contacts = ref([]);
const isLoading = ref(false);
const isDownloading = ref(false);
const downloadingContactId = ref(null);
const deletingContactId = ref(null);
const expandedContacts = reactive({});
const showDeleteModal = ref(false);
const contactToDelete = ref(null);

const newContactsCount = computed(() => {
  return contacts.value.filter(c => !c.is_downloaded).length;
});

const getInitials = (firstName, lastName) => {
  return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('fr-FR', options);
};

const toggleContact = (contactId) => {
  // Fermer tous les autres contacts
  Object.keys(expandedContacts).forEach(key => {
    if (key !== String(contactId)) {
      expandedContacts[key] = false;
    }
  });
  // Basculer le contact sélectionné
  expandedContacts[contactId] = !expandedContacts[contactId];
};

const loadContacts = async () => {
  isLoading.value = true;
  try {
    const response = await apiClient.get('/api/shared-contacts');
    contacts.value = response.data.contacts || [];
  } catch (error) {
    console.error('Erreur lors du chargement des contacts:', error);
  } finally {
    isLoading.value = false;
  }
};

const downloadContact = async (contact) => {
  downloadingContactId.value = contact.id;
  try {
    const response = await apiClient.get(`/api/shared-contacts/${contact.id}/download`, {
      responseType: 'blob'
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${contact.first_name}_${contact.last_name}.vcf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    // Mettre à jour le statut localement
    const index = contacts.value.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      contacts.value[index].is_downloaded = true;
      contacts.value[index].downloaded_at = new Date().toISOString();
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
  } finally {
    downloadingContactId.value = null;
  }
};

const downloadAllContacts = async () => {
  isDownloading.value = true;
  try {
    const response = await apiClient.get('/api/shared-contacts/download-all', {
      responseType: 'blob'
    });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const filename = `contacts_${new Date().toISOString().slice(0,10)}.vcf`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    // Mettre à jour tous les contacts comme téléchargés
    contacts.value.forEach(c => {
      if (!c.is_downloaded) {
        c.is_downloaded = true;
        c.downloaded_at = new Date().toISOString();
      }
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de tous les contacts:', error);
  } finally {
    isDownloading.value = false;
  }
};

const confirmDelete = (contact) => {
  contactToDelete.value = contact;
  showDeleteModal.value = true;
};

const deleteContact = async () => {
  if (!contactToDelete.value) return;
  
  deletingContactId.value = contactToDelete.value.id;
  try {
    await apiClient.delete(`/api/shared-contacts/${contactToDelete.value.id}`);
    contacts.value = contacts.value.filter(c => c.id !== contactToDelete.value.id);
    showDeleteModal.value = false;
    contactToDelete.value = null;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  } finally {
    deletingContactId.value = null;
  }
};

// Émettre le compteur de nouveaux contacts quand il change
watch(newContactsCount, (count) => {
  emit('update:newCount', count);
}, { immediate: true });

// Charger les contacts au montage
onMounted(() => {
  loadContacts();
});

// Recharger si l'orderId change
watch(() => props.orderId, () => {
  loadContacts();
});
</script>

