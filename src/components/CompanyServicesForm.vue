<template>
  <div class="space-y-6">
    <!-- Chargement -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
    </div>

    <!-- Formulaire -->
    <div v-else class="space-y-6">
      <!-- 1. Identité de l'entreprise -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">🏢</span> Identité de l'entreprise
        </h2>

        <div class="space-y-4">
          <!-- Site web de l'entreprise -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Site web de l'entreprise</label>
            <input
              v-model="form.company_website_url"
              type="url"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: https://www.monentreprise.com"
            />
            <!-- Case à cocher pour mettre en avant le site web -->
            <div class="mt-3 flex items-center gap-2">
              <input
                v-model="form.website_featured_in_services_button"
                type="checkbox"
                id="website-featured-checkbox"
                class="w-4 h-4 text-sky-500 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-sky-500 cursor-pointer"
              />
              <label for="website-featured-checkbox" class="text-slate-300 text-sm cursor-pointer">
                Voulez vous mettre en avant votre site web dans le bouton "Découvrir nos Services" ?
              </label>
            </div>
            <p class="text-xs text-slate-400 mt-2">
              Si coché, le bouton "Découvrir nos Services" redirigera vers votre site web. Sinon, l'URL apparaîtra dans
              la section contact du footer.
            </p>
          </div>

          <!-- Nom de l'entreprise -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Nom de l'entreprise</label>
            <input
              v-model="form.company_name"
              type="text"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: Mon Entreprise SARL"
            />
          </div>

          <!-- Nom court -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Nom court ou Acronyme</label>
            <input
              v-model="form.company_name_short"
              type="text"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: MEX"
              maxlength="10"
            />
          </div>

          <!-- Logo -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Logo de l'entreprise</label>
            <div class="flex items-start gap-4">
              <div v-if="form.logo_url" class="flex-shrink-0">
                <img :src="form.logo_url" alt="Logo" class="h-24 w-24 object-contain bg-white rounded-lg p-2" />
              </div>
              <div class="flex-grow">
                <input type="file" @change="handleLogoUpload" accept="image/*" class="hidden" ref="logoInput" :disabled="isUploadingLogo" />
                <button
                  @click="$refs.logoInput.click()"
                  type="button"
                  :disabled="isUploadingLogo"
                  class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg v-if="isUploadingLogo" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="isUploadingLogo">Téléchargement...</span>
                  <span v-else>{{ form.logo_url ? "Changer le logo" : "Télécharger un logo" }}</span>
                </button>
                <div v-if="isUploadingLogo" class="flex items-center gap-2 text-sky-400 text-sm mt-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Téléchargement du logo en cours...</span>
                </div>
                <p v-else class="text-sm text-slate-400 mt-2">Les couleurs seront automatiquement extraites du logo</p>
                <p
                  v-if="logoUploadMessage && !isUploadingLogo"
                  :class="logoUploadError ? 'text-red-400' : 'text-green-400'"
                  class="text-sm mt-2"
                >
                  {{ logoUploadMessage }}
                </p>
              </div>
            </div>
          </div>

          <!-- Upload fichier de présentation (NOUVEAU) -->
          <div class="mt-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 border border-indigo-600">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">📄</span>
              <h3 class="text-xl font-bold text-white">Extraction Automatique (Optionnel)</h3>
            </div>
            <p class="text-indigo-200 text-sm mb-4">
              Uploadez un fichier de présentation de votre entreprise (PDF ou image) et nous remplirons automatiquement
              tous les champs ci dessous
            </p>
            <p class="text-indigo-300 text-xs mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              L'extraction peut prendre jusqu'à 2 minutes pour les gros fichiers PDF
            </p>
            <div class="flex items-center gap-4">
              <input
                type="file"
                @change="handlePresentationUpload"
                accept=".pdf,image/*"
                class="hidden"
                ref="presentationInput"
              />
              <button
                @click="$refs.presentationInput.click()"
                type="button"
                :disabled="isExtracting"
                class="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg v-if="isExtracting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {{ isExtracting ? "Extraction en cours..." : "Uploader le fichier de présentation" }}
              </button>
            </div>
            <p
              v-if="extractionMessage"
              :class="extractionError ? 'text-red-300' : 'text-green-300'"
              class="text-sm mt-3"
            >
              {{ extractionMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- 2. Charte graphique -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">🎨</span> Charte graphique
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Couleur principale -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Couleur principale</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.primary_color"
                type="color"
                class="h-12 w-20 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
              />
              <input
                v-model="form.primary_color"
                type="text"
                class="flex-grow bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="#000000"
              />
            </div>
            <p class="text-xs text-slate-400 mt-1">Auto-rempli depuis le logo, mais modifiable</p>
          </div>

          <!-- Couleur secondaire -->
          <div>
            <label class="block text-slate-300 font-medium mb-2">Couleur secondaire (optionnel)</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.secondary_color"
                type="color"
                class="h-12 w-20 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
              />
              <input
                v-model="form.secondary_color"
                type="text"
                class="flex-grow bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Offres et Services -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">📦</span> Offres et Services
        </h2>

        <!-- Liste des services -->
        <div class="space-y-4 mb-4">
          <div
            v-for="(service, index) in form.services"
            :key="index"
            class="bg-slate-700 p-4 rounded-lg border border-slate-600"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-white font-semibold">Service {{ index + 1 }}</h3>
              <button
                @click="removeService(index)"
                type="button"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-slate-300 text-sm font-medium mb-1">Titre du service</label>
                <input
                  v-model="service.title"
                  type="text"
                  class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Ex: Tôles et Toiture"
                />
              </div>

              <div>
                <label class="block text-slate-300 text-sm font-medium mb-1">Description du service</label>
                <textarea
                  v-model="service.description"
                  rows="3"
                  class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Ex: Nous vendons des tôles bac acier et ondulées..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton Ajouter un Service -->
        <button
          @click="addService"
          type="button"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter un Service
        </button>
      </div>

      <!-- 4. Hero Section (Section d'accueil) -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">🎯</span> Section d'accueil (Hero)
          <span class="text-xs text-slate-400 font-normal">(Optionnel)</span>
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-slate-300 font-medium mb-2">Titre principal</label>
            <input
              v-model="form.hero_headline"
              type="text"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: Solutions Complètes pour vos Projets"
            />
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Sous-titre</label>
            <textarea
              v-model="form.hero_subheadline"
              rows="2"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: Expertise et qualité depuis 20 ans"
            ></textarea>
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Description</label>
            <textarea
              v-model="form.hero_description"
              rows="3"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: Nous offrons une gamme complète de services..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 5. Informations de contact (Email uniquement) -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">📧</span> Email de contact
        </h2>

        <div class="space-y-2">
          <div>
            <label class="block text-slate-300 font-medium mb-2">Email professionnel</label>
            <input
              v-model="form.contact_email"
              type="email"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: contact@entreprise.com"
            />
          </div>
          <p class="text-sm text-slate-400 mt-2">
            <i class="fas fa-info-circle mr-1"></i>
            Les autres informations de contact (adresse, téléphones, réseaux sociaux) sont automatiquement récupérées
            depuis votre configuration "Ma Carte".
          </p>
        </div>
      </div>

      <!-- 6. Configuration du bouton produits -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">🔘</span> Bouton principal
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-slate-300 font-medium mb-2">Texte du bouton</label>
            <input
              v-model="form.products_button_text"
              type="text"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: Nos Produits"
            />
          </div>

          <div>
            <label class="block text-slate-300 font-medium mb-2">Titre du modal</label>
            <input
              v-model="form.products_modal_title"
              type="text"
              class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Ex: Nos Produits et Services"
            />
          </div>
        </div>
      </div>

      <!-- Bouton Générer avec l'IA -->
      <div class="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-xl p-6 shadow-lg border border-purple-600">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span class="text-3xl">✨</span> Génération avec l'IA
          </h2>
          <p class="text-purple-200 text-sm">
            Laissez l'intelligence artificielle créer un contenu marketing professionnel
          </p>
        </div>

        <button
          @click="generateContent"
          :disabled="isGenerating || !canGenerate"
          class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <svg v-if="isGenerating" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ isGenerating ? "Génération en cours..." : "Générer le contenu avec l'IA" }}
        </button>

        <p v-if="!canGenerate" class="text-yellow-300 text-sm mt-2 text-center">
          ⚠️ Veuillez remplir le nom de l'entreprise et ajouter au moins un service avant de générer
        </p>

        <p
          v-if="generateMessage"
          :class="generateError ? 'text-red-300' : 'text-green-300'"
          class="text-sm mt-2 text-center"
        >
          {{ generateMessage }}
        </p>
      </div>

      <!-- Bouton Enregistrer et Publier -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span class="text-3xl">💾</span> Enregistrer et Publier
          </h2>
          <p class="text-slate-300 text-sm">Enregistrez votre travail et activez la publication en ligne</p>
          <p class="text-slate-400 text-xs mt-2">
            💡 <strong>Astuce :</strong> Si vous avez coché la case pour mettre en avant votre site web dans le bouton
            "Découvrir nos Services", vous pouvez enregistrer et publier même si les autres champs ne sont pas remplis.
            Le bouton redirigera directement vers votre site web.
          </p>
        </div>

        <button
          @click="saveCompanyPage"
          :disabled="isSaving"
          class="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg v-if="isSaving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ isSaving ? "Enregistrement..." : "Enregistrer et Publier" }}
        </button>
      </div>

      <!-- Message de feedback -->
      <div v-if="saveMessage" class="space-y-3">
        <div :class="saveError ? 'bg-red-500' : 'bg-green-500'" class="p-4 rounded-lg text-white text-center">
          {{ saveMessage }}
        </div>

        <!-- Message de confirmation après publication -->
        <div v-if="!saveError && form.is_published" class="bg-slate-700 rounded-lg p-4">
          <p class="text-sm text-slate-300 text-center">✅ Votre page est maintenant accessible publiquement</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from "vue";
  import apiClient from "@/api";
  import Cookies from "js-cookie";
  import { useAuth } from "@/composables/useAuth";

  // Props
  const props = defineProps({
    orderId: {
      type: Number,
      default: null,
    },
  });

  const { user } = useAuth();
  const username = ref(user.value?.username || "");
  const publicPageUrl = computed(() => `${window.location.origin}/entreprise/${username.value}`);

  const isLoading = ref(true);
  const isSaving = ref(false);
  const saveMessage = ref("");
  const saveError = ref(false);
  const logoUploadMessage = ref("");
  const logoUploadError = ref(false);
  const isUploadingLogo = ref(false);
  const logoInput = ref(null);
  const presentationInput = ref(null);
  const isGenerating = ref(false);
  const generateMessage = ref("");
  const generateError = ref(false);
  const isExtracting = ref(false);
  const extractionMessage = ref("");
  const extractionError = ref(false);

  const form = ref({
    company_name: "",
    company_name_short: "",
    company_website_url: "",
    website_featured_in_services_button: false,
    logo_url: "",
    primary_color: "#3b82f6",
    secondary_color: "#ffffff",
    services: [],
    hero_headline: "",
    hero_subheadline: "",
    hero_description: "",
    chart_labels: [],
    chart_data: [],
    chart_colors: [],
    chart_title: "",
    chart_description: "",
    pillars: [],
    pillars_title: "",
    engagement_description: "",
    products_button_text: "Nos Produits",
    products_button_icon: "", // Généré automatiquement par l'IA
    products_modal_title: "Nos Produits et Services",
    contact_email: "",
    is_published: false,
  });

  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  };

  const loadCompanyPage = async () => {
    try {
      const params = props.orderId ? { order_id: props.orderId } : {};
      const response = await apiClient.get("/api/company-page", { params });

      // Mettre à jour le formulaire avec les données reçues
      if (response.data) {
        // Préserver les valeurs par défaut pour les champs qui pourraient ne pas être dans la réponse
        const currentForm = { ...form.value };
        Object.assign(form.value, response.data);

        // S'assurer que les champs critiques ne sont pas perdus
        if (!form.value.services || !Array.isArray(form.value.services)) {
          form.value.services = [];
        }
        if (form.value.company_website_url === undefined) {
          form.value.company_website_url = currentForm.company_website_url || "";
        }
        if (form.value.website_featured_in_services_button === undefined) {
          form.value.website_featured_in_services_button = currentForm.website_featured_in_services_button || false;
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    logoUploadMessage.value = "";
    logoUploadError.value = false;
    isUploadingLogo.value = true;

    try {
      setCsrfHeader();
      const formData = new FormData();
      formData.append("logo", file);
      if (props.orderId) {
        formData.append("order_id", props.orderId);
      }

      const response = await apiClient.post("/api/company-page/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      form.value.logo_url = response.data.logo_url;
      if (response.data.colors) {
        form.value.primary_color = response.data.colors.primary;
        form.value.secondary_color = response.data.colors.secondary;
      }

      logoUploadMessage.value = "Logo uploadé et couleurs extraites avec succès !";
      logoUploadError.value = false;
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      logoUploadMessage.value = error.response?.data?.message || "Erreur lors de l'upload.";
      logoUploadError.value = true;
    } finally {
      isUploadingLogo.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const handlePresentationUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    extractionMessage.value = "";
    extractionError.value = false;
    isExtracting.value = true;

    try {
      setCsrfHeader();
      const formData = new FormData();
      formData.append("presentation", file);
      if (props.orderId) {
        formData.append("order_id", props.orderId);
      }

      const response = await apiClient.post("/api/company-page/extract-presentation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Remplir automatiquement les champs avec les données extraites
      if (response.data.extractedData) {
        const extracted = response.data.extractedData;

        // Remplir le nom de l'entreprise si disponible
        if (extracted.company_name) {
          form.value.company_name = extracted.company_name;
        }
        if (extracted.company_name_short) {
          form.value.company_name_short = extracted.company_name_short;
        }

        // Remplir les services
        if (extracted.services && Array.isArray(extracted.services)) {
          form.value.services = extracted.services;
        }

        // Remplir les autres champs
        if (extracted.hero_headline) form.value.hero_headline = extracted.hero_headline;
        if (extracted.hero_subheadline) form.value.hero_subheadline = extracted.hero_subheadline;
        if (extracted.hero_description) form.value.hero_description = extracted.hero_description;
        if (extracted.engagement_description) form.value.engagement_description = extracted.engagement_description;
      }

      extractionMessage.value =
        response.data.message || "Extraction réussie ! Les champs ont été remplis automatiquement.";
      extractionError.value = false;

      // Masquer le message après 5 secondes
      setTimeout(() => {
        extractionMessage.value = "";
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de l'extraction:", error);

      // Messages d'erreur personnalisés selon le code de statut
      if (error.response?.status === 503) {
        extractionMessage.value =
          error.response?.data?.message ||
          "Le service d'IA est temporairement surchargé. Veuillez réessayer dans quelques instants.";
      } else if (error.response?.status === 413) {
        extractionMessage.value = "Le fichier est trop volumineux. Taille maximale : 10 MB.";
      } else if (error.response?.status === 422) {
        extractionMessage.value = "Format de fichier non supporté. Formats acceptés : PDF, JPG, PNG, JPEG.";
      } else {
        extractionMessage.value = error.response?.data?.message || "Erreur lors de l'extraction du fichier.";
      }

      extractionError.value = true;

      // Masquer les messages d'erreur après 10 secondes (plus long pour laisser le temps de lire)
      setTimeout(() => {
        extractionMessage.value = "";
      }, 10000);
    } finally {
      isExtracting.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
      // Réinitialiser l'input pour permettre de reuploader le même fichier
      if (presentationInput.value) {
        presentationInput.value.value = "";
      }
    }
  };

  const addService = () => {
    form.value.services.push({
      title: "",
      description: "",
      icon: "fa-cube",
    });
  };

  const removeService = (index) => {
    form.value.services.splice(index, 1);
  };

  const canGenerate = computed(() => {
    return form.value.company_name && form.value.services && form.value.services.length > 0;
  });

  const generateContent = async () => {
    isGenerating.value = true;
    generateMessage.value = "";
    generateError.value = false;

    try {
      setCsrfHeader();
      // Envoyer les services actuels du formulaire à l'IA
      const payload = {
        services: form.value.services,
        company_name: form.value.company_name,
        company_name_short: form.value.company_name_short,
        primary_color: form.value.primary_color,
        products_button_text: form.value.products_button_text,
      };
      if (props.orderId) {
        payload.order_id = props.orderId;
      }
      const response = await apiClient.post("/api/company-page/generate-content", payload);

      // Mettre à jour le formulaire avec le contenu généré
      if (response.data.companyPage) {
        Object.assign(form.value, response.data.companyPage);
      }

      generateMessage.value = response.data.message || "Contenu généré avec succès !";
      generateError.value = false;

      // Masquer le message après 5 secondes
      setTimeout(() => {
        generateMessage.value = "";
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      generateMessage.value = error.response?.data?.message || "Erreur lors de la génération du contenu.";
      generateError.value = true;
    } finally {
      isGenerating.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const saveCompanyPage = async () => {
    isSaving.value = true;
    saveMessage.value = "";
    saveError.value = false;

    try {
      setCsrfHeader();

      // Activer automatiquement la publication
      form.value.is_published = true;

      // Enregistrer la page avec order_id si disponible
      const payload = { ...form.value };
      if (props.orderId) {
        payload.order_id = props.orderId;
      }
      const response = await apiClient.put("/api/company-page", payload);

      // Mettre à jour le formulaire avec les données retournées par le backend
      // pour s'assurer que toutes les données sont synchronisées
      if (response.data && response.data.companyPage) {
        // Mettre à jour le formulaire avec les données retournées
        // Le backend formate déjà l'URL du logo correctement
        Object.assign(form.value, response.data.companyPage);

        // S'assurer que services est un tableau
        if (!form.value.services || !Array.isArray(form.value.services)) {
          form.value.services = [];
        }
      } else {
        // Si le backend ne retourne pas les données, recharger depuis l'API
        await loadCompanyPage();
      }

      saveMessage.value = "Page entreprise enregistrée et publiée avec succès !";
      saveError.value = false;

      // Masquer le message après 3 secondes
      setTimeout(() => {
        saveMessage.value = "";
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      saveMessage.value = error.response?.data?.message || "Erreur lors de la sauvegarde.";
      saveError.value = true;
    } finally {
      isSaving.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  onMounted(() => {
    loadCompanyPage();
  });
</script>
