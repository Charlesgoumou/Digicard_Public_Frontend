<template>
  <div>
    <LoadingSpinner :is-loading="isLoading" />
    <div v-show="!isLoading" class="min-h-screen bg-slate-900 pt-16 sm:pt-20 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Contactez-nous
          </h1>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Une question ? Un projet ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs
            délais.
          </p>
        </div>

        <div class="max-w-lg mx-auto bg-slate-800/50 p-8 rounded-xl border border-slate-700">
          <!-- Message de succès -->
          <div
            v-if="successMessage"
            class="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
          >
            {{ successMessage }}
          </div>

          <!-- Message d'erreur -->
          <div
            v-if="errorMessage"
            class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
          >
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Nom complet -->
            <div>
              <label for="name" class="block text-sm font-medium text-slate-300"
                >Nom complet <span class="text-red-400">*</span></label
              >
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                autocomplete="name"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-slate-300"
                >Email <span class="text-red-400">*</span></label
              >
              <input
                v-model="form.email"
                type="email"
                id="email"
                required
                autocomplete="email"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>

            <!-- Objet -->
            <div>
              <label for="subject" class="block text-sm font-medium text-slate-300"
                >Objet <span class="text-red-400">*</span></label
              >
              <input
                v-model="form.subject"
                type="text"
                id="subject"
                required
                placeholder="Ex: Demande de renseignements"
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-slate-300"
                >Votre message <span class="text-red-400">*</span></label
              >
              <textarea
                v-model="form.message"
                id="message"
                rows="5"
                required
                placeholder="Décrivez votre demande..."
                class="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md py-2.5 px-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-none"
              ></textarea>
            </div>

            <!-- Bouton d'envoi -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-sky-500 text-white font-semibold py-2.5 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!isSubmitting">Envoyer le message</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Envoi en cours...
              </span>
            </button>

            <p class="text-xs text-slate-400 text-center"><span class="text-red-400">*</span> Champs obligatoires</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, nextTick } from "vue";
  import apiClient from "@/api";
  import Cookies from "js-cookie";
  import LoadingSpinner from "@/components/layout/LoadingSpinner.vue";
  import { useLoadingStore } from "@/stores/loading";

  const loadingStore = useLoadingStore();
  const isLoading = ref(true);

  // État du formulaire
  const form = reactive({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const isSubmitting = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");

  // Fonction pour attendre que toutes les images soient chargées
  const waitForImages = () => {
    return new Promise((resolve) => {
      const checkImages = () => {
        requestAnimationFrame(() => {
          const images = document.querySelectorAll("img");
          if (images.length === 0) {
            resolve();
            return;
          }

          let loadedCount = 0;
          const totalImages = images.length;
          let resolved = false;

          const checkComplete = () => {
            if (resolved) return;
            loadedCount++;
            if (loadedCount === totalImages) {
              resolved = true;
              requestAnimationFrame(() => {
                resolve();
              });
            }
          };

          images.forEach((img) => {
            if (img.complete && img.naturalHeight !== 0) {
              checkComplete();
            } else {
              img.addEventListener("load", checkComplete, { once: true });
              img.addEventListener("error", checkComplete, { once: true });
            }
          });

          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          }, 5000);
        });
      };

      if (document.readyState === "complete") {
        checkImages();
      } else {
        window.addEventListener("load", checkImages, { once: true });
      }
    });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    // Réinitialiser les messages
    successMessage.value = "";
    errorMessage.value = "";

    // Validation côté client
    if (!form.name || !form.email || !form.subject || !form.message) {
      errorMessage.value = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    isSubmitting.value = true;

    try {
      // Récupérer le token CSRF
      await apiClient.get("/sanctum/csrf-cookie");

      // Définir le header CSRF
      const csrfToken = Cookies.get("XSRF-TOKEN");
      if (csrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
      }

      // Envoyer le message
      const response = await apiClient.post("/api/contact", {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      // Afficher le message de succès
      successMessage.value = response.data.message;

      // Réinitialiser le formulaire
      form.name = "";
      form.email = "";
      form.subject = "";
      form.message = "";

      // Faire disparaître le message de succès après 8 secondes
      setTimeout(() => {
        successMessage.value = "";
      }, 8000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);

      // Afficher le message d'erreur
      if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = "Une erreur est survenue. Veuillez réessayer ultérieurement.";
      }

      // Faire disparaître le message d'erreur après 8 secondes
      setTimeout(() => {
        errorMessage.value = "";
      }, 8000);
    } finally {
      isSubmitting.value = false;
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  onMounted(async () => {
    loadingStore.setHomePageLoading(true);
    isLoading.value = true;

    await nextTick();
    await nextTick();

    await waitForImages();

    setTimeout(() => {
      isLoading.value = false;
      loadingStore.setHomePageLoading(false);
    }, 300);
  });
</script>
