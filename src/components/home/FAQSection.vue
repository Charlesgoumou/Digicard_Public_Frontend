<template>
  <section class="bg-slate-950/70 py-20 sm:py-24">
    <div class="container mx-auto px-4">
      <!-- Titre de la section -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
          Vous avez des questions ?
        </h2>
        <p class="mt-4 text-lg text-slate-300">
          Nous avons les réponses. Trouvez ici les informations les plus courantes sur nos produits et services.
        </p>
      </div>

      <!-- Liste des questions/réponses (Accordéon) -->
      <div class="max-w-3xl mx-auto">
        <div class="space-y-4">
          <div v-for="(item, index) in faqItems" :key="index" class="border border-slate-800 rounded-2xl overflow-hidden">
            <button
              @click="toggleQuestion(index)"
              class="w-full flex justify-between items-center text-left p-6 bg-slate-900 hover:bg-slate-800/50 transition-colors duration-300"
            >
              <span class="font-semibold text-lg text-white">{{ item.question }}</span>
              <span class="text-blue-400 transform transition-transform duration-300" :class="{ 'rotate-45': openQuestionIndex === index }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <transition name="fade">
              <div v-if="openQuestionIndex === index" class="p-6 bg-slate-950/50">
                <p class="text-slate-300">{{ item.answer }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/api';

// Props pour recevoir les FAQs depuis le parent
const props = defineProps({
  faqs: {
    type: Array,
    default: () => []
  }
});

// Indice de la question actuellement ouverte
const openQuestionIndex = ref(null);

// Données de la FAQ
const faqItems = ref([]);

// Fonction pour charger les FAQs
async function loadFAQs() {
  try {
    const res = await apiClient.get('/homepage');
    const homepageFAQs = res.data?.homepage?.faqs || [];
    faqItems.value = homepageFAQs.length > 0 ? homepageFAQs : props.faqs;
  } catch (e) {
    // Fallback vers les props si l'API échoue
    faqItems.value = props.faqs;
  }
}

// Fonction pour ouvrir/fermer une question
const toggleQuestion = (index) => {
  if (openQuestionIndex.value === index) {
    // Si la même question est cliquée, on la ferme
    openQuestionIndex.value = null;
  } else {
    // Sinon, on ouvre la nouvelle question
    openQuestionIndex.value = index;
  }
};

onMounted(() => {
  loadFAQs();
});
</script>

<style scoped>
/* Styles pour l'animation de transition */
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  padding-top: 0;
  padding-bottom: 0;
  max-height: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 1000px; /* Valeur suffisamment grande */
}
</style>

