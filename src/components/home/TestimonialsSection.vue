<template>
  <section class="bg-slate-900 py-20 sm:py-24 overflow-x-hidden">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Ils nous font confiance</h2>
        <p class="mt-4 text-lg text-slate-300">
          Découvrez comment nos clients transforment leur réseautage grâce à nos cartes
          intelligentes.
        </p>
      </div>

      <div class="swiper">
        <div class="swiper-wrapper">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="swiper-slide h-auto">
            <div
              class="bg-slate-950/50 border border-slate-800 rounded-2xl p-8 flex flex-col h-full"
            >
              <div class="flex-grow">
                <p class="text-slate-300 italic mb-6">
                  "{{ testimonial.text }}"
                </p>
              </div>
              <div class="flex items-center mt-auto pt-6 border-t border-slate-800">
                <img
                  :src="getAvatarUrl(testimonial.avatar_url)"
                  :alt="`Avatar de ${testimonial.author_name}`"
                  class="w-12 h-12 rounded-full object-cover mr-4"
                  @error="handleImageError"
                />
                <div>
                  <p class="font-bold text-white">{{ testimonial.author_name }}</p>
                  <p class="text-sm text-slate-400">{{ testimonial.author_role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Imports de Swiper
import Swiper from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { ref, onMounted, nextTick } from 'vue'
import apiClient from '@/api'
// Imports des images par défaut
import avatar1 from '@/assets/images/avatar1.jpg'
import avatar2 from '@/assets/images/avatar2.jpg'
import avatar3 from '@/assets/images/avatar3.jpg'

// Props pour recevoir les testimonials depuis le parent
const props = defineProps({
  testimonials: {
    type: Array,
    default: () => []
  }
});

// Données des témoignages
const testimonials = ref([]);

// Mapping des avatars par défaut
const defaultAvatars = {
  '/images/avatar1.jpg': avatar1,
  '/images/avatar2.jpg': avatar2,
  '/images/avatar3.jpg': avatar3,
  'avatar1.jpg': avatar1,
  'avatar2.jpg': avatar2,
  'avatar3.jpg': avatar3,
};

// Fonction pour obtenir l'URL complète de l'avatar
const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) {
    // Fallback vers avatar1 par défaut
    return avatar1;
  }
  
  const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:8000';
  
  // Si c'est déjà une URL complète
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  
  // Si c'est un chemin de storage du backend (commence par /storage/)
  if (avatarUrl.startsWith('/storage/')) {
    return backendUrl + avatarUrl;
  }
  
  // Si c'est un chemin d'image statique référencé par /images/, vérifier si c'est un avatar par défaut
  if (avatarUrl.startsWith('/images/') || avatarUrl.includes('avatar')) {
    // Extraire le nom du fichier (ex: avatar1.jpg depuis /images/avatar1.jpg)
    const fileName = avatarUrl.replace(/^.*\//, '');
    const fileNameWithoutExt = fileName.replace(/\.(jpg|jpeg|png|gif)$/i, '');
    
    // Vérifier si c'est un avatar par défaut connu
    if (defaultAvatars[avatarUrl] || defaultAvatars[fileName]) {
      return defaultAvatars[avatarUrl] || defaultAvatars[fileName] || avatar1;
    }
    
    // Si le nom du fichier contient "avatar" et un numéro, essayer de mapper
    const avatarMatch = fileName.match(/avatar(\d+)/i);
    if (avatarMatch) {
      const avatarNum = avatarMatch[1];
      if (avatarNum === '1') return avatar1;
      if (avatarNum === '2') return avatar2;
      if (avatarNum === '3') return avatar3;
    }
    
    // Sinon, essayer de servir depuis le dossier public
    return avatarUrl;
  }
  
  // Si c'est un chemin relatif commençant par /, l'utiliser tel quel
  if (avatarUrl.startsWith('/')) {
    return avatarUrl;
  }
  
  // Sinon, supposer que c'est un chemin relatif et ajouter le backend URL
  return backendUrl + '/' + avatarUrl.replace(/^\//, '');
};

// Gestion des erreurs d'image
const handleImageError = (event) => {
  // En cas d'erreur, utiliser avatar1 par défaut
  event.target.src = avatar1;
};

// Fonction pour charger les témoignages
async function loadTestimonials() {
  try {
    const res = await apiClient.get('/homepage');
    const homepageTestimonials = res.data?.homepage?.testimonials || [];
    testimonials.value = homepageTestimonials.length > 0 ? homepageTestimonials : props.testimonials;
    
    // Réinitialiser Swiper après le chargement des données
    await nextTick();
    initSwiper();
  } catch (e) {
    // Fallback vers les props si l'API échoue
    testimonials.value = props.testimonials;
    await nextTick();
    initSwiper();
  }
}

let swiperInstance = null;

function initSwiper() {
  // Détruire l'instance existante si elle existe
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
  }
  
  const hasMoreThanThree = testimonials.value.length > 3;
  // Pour que la boucle fonctionne correctement, il faut plus de slides que le nombre visible
  // Sur desktop (3 visibles), il faut au moins 4 slides pour la boucle
  // Sur tablette (2 visibles), il faut au moins 3 slides
  // Sur mobile (1 visible), il faut au moins 2 slides
  const canLoop = testimonials.value.length > 1;
  
  // Initialisation de Swiper
  swiperInstance = new Swiper('.swiper', {
    modules: [Autoplay, Pagination],

    // Boucle infinie seulement si on a assez de slides
    loop: canLoop && hasMoreThanThree,

    // Direction du défilement : de droite vers la gauche (par défaut)
    direction: 'horizontal',

    // Configuration de l'autoplay - seulement s'il y a plus de 3 témoignages
    autoplay: hasMoreThanThree ? {
      delay: 3000, // 3 secondes par slide pour un défilement plus fluide
      disableOnInteraction: false, // L'autoplay redémarre après une interaction manuelle
      pauseOnMouseEnter: true, // Se met en pause au survol de la souris
      reverseDirection: false, // Défilement de droite vers la gauche (sens normal)
    } : false,

    // Effet de transition
    speed: 600, // Durée de la transition en ms

    // Affiche 1 slide sur mobile, 2 sur tablette, 3 sur PC
    slidesPerView: 1,
    spaceBetween: 32, // Espace entre les slides
    breakpoints: {
      768: {
        // md:
        slidesPerView: 2,
      },
      1024: {
        // lg:
        slidesPerView: 3,
      },
    },

    // Configuration de la pagination (les points)
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true, // Affiche dynamiquement les bullets selon le nombre de slides
    },
  });
}

onMounted(() => {
  loadTestimonials();
});
</script>

<style scoped>
/* Style pour que les slides aient la même hauteur */
.swiper-slide {
  height: auto;
}

/* Personnalisation des points de pagination pour le thème sombre */
.swiper-pagination {
  position: relative;
  margin-top: 2rem;
}

:global(.swiper-pagination-bullet) {
  background-color: #4b5563; /* Couleur des points inactifs */
  opacity: 1;
}

:global(.swiper-pagination-bullet-active) {
  background-color: #6366f1; /* Couleur du point actif (indigo) */
}
</style>
