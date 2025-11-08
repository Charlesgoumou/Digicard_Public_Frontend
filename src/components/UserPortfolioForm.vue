<template>
  <div class="space-y-6">
    <!-- Chargement -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Formulaire -->
    <div v-else class="space-y-6">
      <!-- 1. Sélection du profil -->
      <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span class="text-3xl">👤</span> Quel est votre profil principal ?
        </h2>
        <p class="text-slate-300 text-sm mb-4">
          Cette sélection permettra d'adapter le formulaire et l'assistance IA à votre profil
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="profileOption in profileOptions"
            :key="profileOption.value"
            @click="selectProfile(profileOption.value)"
            :class="[
              'p-6 rounded-lg border-2 transition-all duration-300',
              selectedProfile === profileOption.value
                ? 'border-indigo-500 bg-indigo-900/30 shadow-lg scale-105'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500',
            ]"
          >
            <div class="text-4xl mb-3">{{ profileOption.icon }}</div>
            <div class="text-white font-semibold text-lg">{{ profileOption.label }}</div>
            <div v-if="selectedProfile === profileOption.value" class="mt-2 text-indigo-400 text-sm">✓ Sélectionné</div>
          </button>
        </div>

        <input type="hidden" v-model="form.profile_type" />
      </div>

      <!-- Formulaire adaptatif uniquement si profil sélectionné -->
      <div v-if="selectedProfile">
        <!-- 2. Informations personnelles -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📝</span> Informations personnelles
          </h2>

          <div class="space-y-4">
            <!-- Bio -->
            <div>
              <label class="block text-slate-300 font-medium mb-2">Biographie</label>
              <textarea
                v-model="form.bio"
                rows="4"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Décrivez-vous en quelques lignes..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 3. Compétences -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">🛠️</span> Compétences
          </h2>

          <!-- Liste des compétences -->
          <div class="space-y-4 mb-4">
            <div v-for="(skill, index) in form.skills" :key="index" class="flex items-center gap-3">
              <input
                v-model="skill.icon"
                type="text"
                class="w-20 bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="🏷️"
              />
              <input
                v-model="skill.name"
                type="text"
                class="flex-grow min-w-0 bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: JavaScript, Vue.js"
              />
              <button
                @click="removeSkill(index)"
                type="button"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Bouton Ajouter une compétence -->
          <button
            @click="addSkill"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter une compétence
          </button>
        </div>

        <!-- 4. Projets -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">🎯</span> {{ getLabel("projects", true) }}
          </h2>

          <!-- Liste des projets -->
          <div class="space-y-4 mb-4">
            <div
              v-for="(project, index) in form.projects"
              :key="index"
              class="bg-slate-700 p-4 rounded-lg border border-slate-600"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-white font-semibold">{{ getLabel("projects", true) }} {{ index + 1 }}</h3>
                <button
                  @click="removeProject(index)"
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
                  <label class="block text-slate-300 text-sm font-medium mb-1">Titre</label>
                  <input
                    v-model="project.title"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    :placeholder="getPlaceholder('projects')"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Description courte</label>
                  <textarea
                    v-model="project.short_description"
                    rows="2"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Description courte du projet..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Détails (HTML)</label>
                  <textarea
                    v-model="project.details_html"
                    rows="4"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                    placeholder="Description détaillée du projet (HTML supporté)..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">URL du projet (optionnel)</label>
                  <input
                    v-model="project.link"
                    type="url"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Icône</label>
                  <input
                    v-model="project.icon"
                    type="text"
                    class="w-32 bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="🚀"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter un projet -->
          <button
            @click="addProject"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter {{ getLabel("projects", false) }}
          </button>
        </div>

        <!-- 5. Timeline (Parcours) -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📅</span> {{ getLabel("timeline", true) }}
          </h2>

          <!-- Liste des événements timeline -->
          <div class="space-y-4 mb-4">
            <div
              v-for="(item, index) in form.timeline"
              :key="index"
              class="bg-slate-700 p-4 rounded-lg border border-slate-600"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-white font-semibold">{{ getLabel("timeline", true) }} {{ index + 1 }}</h3>
                <button
                  @click="removeTimelineItem(index)"
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
                  <label class="block text-slate-300 text-sm font-medium mb-1">Titre</label>
                  <input
                    v-model="item.title"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Stage en Agence, Master 2..."
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Organisation</label>
                  <input
                    v-model="item.organization"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Nom de l'entreprise ou établissement"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Dates</label>
                  <input
                    v-model="item.dates"
                    type="text"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Ex: Jan 2020 - Déc 2022"
                  />
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Détails (HTML)</label>
                  <textarea
                    v-model="item.details"
                    rows="3"
                    class="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                    placeholder="Description détaillée (HTML supporté)..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-slate-300 text-sm font-medium mb-1">Icône</label>
                  <input
                    v-model="item.icon"
                    type="text"
                    class="w-32 bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="🎓"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter -->
          <button
            @click="addTimelineItem"
            type="button"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un événement
          </button>
        </div>

        <!-- 6. Contact -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-3xl">📧</span> Informations de contact
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-300 font-medium mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: jean.dupont@example.com"
              />
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-2">Téléphone</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: +224 XXX XXX XXX"
              />
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-2">LinkedIn (optionnel)</label>
              <input
                v-model="form.linkedin_url"
                type="url"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <label class="block text-slate-300 font-medium mb-2">GitHub (optionnel)</label>
              <input
                v-model="form.github_url"
                type="url"
                class="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <!-- 7. Champs cachés pour les couleurs et titre -->
        <input type="hidden" v-model="form.primary_color" />
        <input type="hidden" v-model="form.secondary_color" />
        <input type="hidden" v-model="form.skills_title" />
        <input type="hidden" v-model="form.projects_title" />
        <input type="hidden" v-model="form.timeline_title" />

        <!-- 8. Bouton Générer avec l'IA -->
        <div class="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-xl p-6 shadow-lg border border-purple-600">
          <div class="mb-4">
            <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span class="text-3xl">✨</span> Génération avec l'IA
            </h2>
            <p class="text-purple-200 text-sm">
              Laissez l'intelligence artificielle créer un contenu professionnel adapté à votre profil
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
            ⚠️ Veuillez remplir les informations personnelles et ajouter au moins un projet ou un événement
          </p>

          <p
            v-if="generateMessage"
            :class="generateError ? 'text-red-300' : 'text-green-300'"
            class="text-sm mt-2 text-center"
          >
            {{ generateMessage }}
          </p>
        </div>

        <!-- 9. Bouton Enregistrer et Quitter -->
        <div class="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <div class="mb-4">
            <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span class="text-3xl">💾</span> Enregistrer et Quitter
            </h2>
            <p class="text-slate-300 text-sm">Enregistrez votre profil sans le publier maintenant</p>
          </div>

          <button
            @click="savePortfolio"
            :disabled="isSaving"
            class="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            {{ isSaving ? "Enregistrement..." : "Enregistrer et Quitter" }}
          </button>
        </div>

        <!-- Message de feedback -->
        <div v-if="saveMessage" class="space-y-3">
          <div :class="saveError ? 'bg-red-500' : 'bg-green-500'" class="p-4 rounded-lg text-white text-center">
            {{ saveMessage }}
          </div>
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
  import { useRouter } from "vue-router";

  // Options de profil
  const profileOptions = [
    {
      value: "student",
      label: "Étudiant / Sortant",
      icon: "🎓",
    },
    {
      value: "teacher",
      label: "Enseignant / Formateur",
      icon: "👨‍🏫",
    },
    {
      value: "freelance",
      label: "Freelance / Indépendant",
      icon: "💼",
    },
  ];

  // Labels adaptatifs selon le profil
  const adaptiveLabels = {
    student: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Étudiant en Informatique"',
      timeline: "Ma Formation & Stages",
      timelinePlaceholder: 'Ex: "Stage en Agence", "Master 2"',
      projects: "Mes Projets Académiques",
      projectsPlaceholder: 'Ex: "Projet de fin d\'études"',
    },
    teacher: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Professeur de Français"',
      timeline: "Mon Parcours Professionnel",
      timelinePlaceholder: 'Ex: "Professeur Titulaire"',
      projects: "Mes Réalisations & Projets",
      projectsPlaceholder: 'Ex: "Publication d\'un livre"',
    },
    freelance: {
      headline: "Titre / Rôle",
      headlinePlaceholder: 'Ex: "Développeur Web Freelance"',
      timeline: "Mon Parcours & Clients",
      timelinePlaceholder: 'Ex: "Client X", "Chef de Projet Y"',
      projects: "Mon Portfolio / Projets Clients",
      projectsPlaceholder: 'Ex: "Refonte du site E-commerce Z"',
    },
  };

  const { user } = useAuth();
  const router = useRouter();
  const isLoading = ref(true);
  const isSaving = ref(false);
  const saveMessage = ref("");
  const saveError = ref(false);
  const photoUploadMessage = ref("");
  const photoUploadError = ref(false);
  const photoInput = ref(null);
  const isGenerating = ref(false);
  const generateMessage = ref("");
  const generateError = ref(false);

  const selectedProfile = ref(null);

  // Stocker les données séparées pour chaque profil
  const profileData = ref({
    student: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    teacher: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
    freelance: {
      bio: "",
      skills: [],
      projects: [],
      timeline: [],
      skills_title: "Mes Compétences",
      projects_title: "Mes Projets",
      timeline_title: "Mon Parcours",
    },
  });

  const form = ref({
    profile_type: null,
    name: "",
    photo_url: "",
    hero_headline: "",
    bio: "",
    skills: [],
    projects: [],
    timeline: [],
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    primary_color: "#6366f1", // Indigo par défaut
    secondary_color: "#ffffff",
    skills_title: "Mes Compétences",
    projects_title: "Mes Projets",
    timeline_title: "Mon Parcours",
  });

  // Fonctions pour les labels adaptatifs
  const getLabel = (field, isTitle = false) => {
    if (!selectedProfile.value) return "";
    const labels = adaptiveLabels[selectedProfile.value];
    if (!labels) return "";

    if (isTitle) {
      if (field === "projects") return labels.projects;
      if (field === "timeline") return labels.timeline;
      return "";
    }

    if (field === "headline") return labels.headline;
    return "";
  };

  const getPlaceholder = (field) => {
    if (!selectedProfile.value) return "";
    const labels = adaptiveLabels[selectedProfile.value];
    if (!labels) return "";

    if (field === "headline") return labels.headlinePlaceholder;
    if (field === "timeline") return labels.timelinePlaceholder;
    if (field === "projects") return labels.projectsPlaceholder;
    return "";
  };

  const selectProfile = (profileValue) => {
    // Si l'utilisateur change de profil, sauvegarder les données actuelles
    if (selectedProfile.value && selectedProfile.value !== profileValue) {
      // Sauvegarder les données du profil actuel
      profileData.value[selectedProfile.value] = {
        bio: form.value.bio,
        skills: [...form.value.skills],
        projects: [...form.value.projects],
        timeline: [...form.value.timeline],
        skills_title: form.value.skills_title,
        projects_title: form.value.projects_title,
        timeline_title: form.value.timeline_title,
      };
    }

    selectedProfile.value = profileValue;
    form.value.profile_type = profileValue;

    // Charger les données du nouveau profil sélectionné
    const savedData = profileData.value[profileValue];
    if (savedData) {
      form.value.bio = savedData.bio;
      form.value.skills = [...savedData.skills];
      form.value.projects = [...savedData.projects];
      form.value.timeline = [...savedData.timeline];
      form.value.skills_title = savedData.skills_title;
      form.value.projects_title = savedData.projects_title;
      form.value.timeline_title = savedData.timeline_title;
    }
  };

  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  };

  const loadPortfolio = async () => {
    try {
      const response = await apiClient.get("/user-portfolio");
      Object.assign(form.value, response.data);

      // Initialiser les arrays vides si nécessaire
      if (!form.value.skills) form.value.skills = [];
      if (!form.value.projects) form.value.projects = [];
      if (!form.value.timeline) form.value.timeline = [];

      // Si un profil était déjà configuré, charger ses données dans profileData
      if (form.value.profile_type) {
        profileData.value[form.value.profile_type] = {
          bio: form.value.bio || "",
          skills: [...form.value.skills],
          projects: [...form.value.projects],
          timeline: [...form.value.timeline],
          skills_title: form.value.skills_title || "Mes Compétences",
          projects_title: form.value.projects_title || "Mes Projets",
          timeline_title: form.value.timeline_title || "Mon Parcours",
        };
        selectedProfile.value = form.value.profile_type;
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    photoUploadMessage.value = "";
    photoUploadError.value = false;

    try {
      setCsrfHeader();
      const formData = new FormData();
      formData.append("photo", file);

      const response = await apiClient.post("/user-portfolio/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      form.value.photo_url = response.data.photo_url;
      photoUploadMessage.value = "Photo uploadée avec succès !";
      photoUploadError.value = false;
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      photoUploadMessage.value = error.response?.data?.message || "Erreur lors de l'upload.";
      photoUploadError.value = true;
    } finally {
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  const addSkill = () => {
    form.value.skills.push({
      icon: "🏷️",
      name: "",
    });
  };

  const removeSkill = (index) => {
    form.value.skills.splice(index, 1);
  };

  const addProject = () => {
    form.value.projects.push({
      title: "",
      short_description: "",
      details_html: "",
      link: "",
      icon: "🚀",
    });
  };

  const removeProject = (index) => {
    form.value.projects.splice(index, 1);
  };

  const addTimelineItem = () => {
    form.value.timeline.push({
      title: "",
      organization: "",
      dates: "",
      details: "",
      icon: "🎓",
    });
  };

  const removeTimelineItem = (index) => {
    form.value.timeline.splice(index, 1);
  };

  const canGenerate = computed(() => {
    return (
      selectedProfile.value &&
      ((form.value.projects && form.value.projects.length > 0) ||
        (form.value.timeline && form.value.timeline.length > 0))
    );
  });

  const generateContent = async () => {
    isGenerating.value = true;
    generateMessage.value = "";
    generateError.value = false;

    try {
      setCsrfHeader();

      // Préparer le prompt selon le profil
      const promptTemplate = getPromptForProfile(selectedProfile.value);

      const payload = {
        profile_type: selectedProfile.value,
        name: form.value.name,
        hero_headline: form.value.hero_headline,
        bio: form.value.bio,
        skills: form.value.skills,
        projects: form.value.projects,
        timeline: form.value.timeline,
        prompt_template: promptTemplate,
        primary_color: form.value.primary_color,
      };

      const response = await apiClient.post("/user-portfolio/generate-content", payload);

      // Mettre à jour le formulaire avec le contenu généré
      if (response.data.portfolio) {
        Object.assign(form.value, response.data.portfolio);

        // Mettre à jour profileData avec le contenu généré pour ce profil
        profileData.value[selectedProfile.value] = {
          bio: form.value.bio || "",
          skills: [...form.value.skills],
          projects: [...form.value.projects],
          timeline: [...form.value.timeline],
          skills_title: form.value.skills_title || "Mes Compétences",
          projects_title: form.value.projects_title || "Mes Projets",
          timeline_title: form.value.timeline_title || "Mon Parcours",
        };
      }

      generateMessage.value = response.data.message || "Contenu généré avec succès !";
      generateError.value = false;

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

  const getPromptForProfile = (profileType) => {
    const prompts = {
      student:
        "Tu es un coach de carrière pour un jeune diplômé. Prends ses projets académiques et reformule-les pour montrer son potentiel et ses compétences techniques à un recruteur.",
      teacher:
        "Tu es un rédacteur pour un expert. Prends ses réalisations et reformule-les pour montrer son expérience et son impact pédagogique.",
      freelance:
        "Tu es un rédacteur commercial. Prends les projets clients de ce freelance et reformule-les pour montrer la valeur ajoutée et le retour sur investissement (ROI) pour un futur client, pas seulement les tâches techniques.",
    };
    return prompts[profileType] || prompts.student;
  };

  const savePortfolio = async () => {
    isSaving.value = true;
    saveMessage.value = "";
    saveError.value = false;

    try {
      setCsrfHeader();
      await apiClient.put("/user-portfolio", form.value);

      // Mettre à jour profileData avec les données sauvegardées
      profileData.value[selectedProfile.value] = {
        bio: form.value.bio || "",
        skills: [...form.value.skills],
        projects: [...form.value.projects],
        timeline: [...form.value.timeline],
        skills_title: form.value.skills_title || "Mes Compétences",
        projects_title: form.value.projects_title || "Mes Projets",
        timeline_title: form.value.timeline_title || "Mon Parcours",
      };

      saveMessage.value = "Profil enregistré avec succès !";
      saveError.value = false;

      // Rediriger vers le dashboard après un court délai
      setTimeout(() => {
        router.push({ name: "Dashboard" });
      }, 1000);
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
    loadPortfolio();
  });
</script>

<style scoped>
  /* Styles similaires à CompanyServicesForm */
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
</style>
