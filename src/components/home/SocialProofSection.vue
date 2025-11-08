<template>
  <section class="bg-slate-900 py-16 sm:py-20">
    <div class="container mx-auto px-4">
      <!-- Titre de la section amélioré -->
      <div class="text-center">
        <h2
          class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 sm:text-5xl animate-fade-in-down"
        >
          Ils nous ont choisi !
        </h2>
      </div>

      <!-- Carrousel de logos défilant -->
      <div
        v-if="companies.length > 0"
        class="group relative mt-12 overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
      >
        <div class="flex animate-scroll" style="width: max-content">
          <!-- Set 1 -->
          <div class="flex items-center justify-center flex-shrink-0 mx-8 space-x-16">
            <div v-for="(company, index) in companies" :key="`set1-${index}`" class="flex items-center space-x-4">
              <img
                :src="getLogoUrl(company.logo_url)"
                :alt="`Logo ${company.name}`"
                class="h-10 w-auto"
                @error="handleImageError"
              />
              <span class="text-slate-400 text-xl font-semibold">{{ company.name }}</span>
            </div>
          </div>
          <!-- Set 2 (Duplication pour la boucle) -->
          <div class="flex items-center justify-center flex-shrink-0 mx-8 space-x-16">
            <div v-for="(company, index) in companies" :key="`set2-${index}`" class="flex items-center space-x-4">
              <img
                :src="getLogoUrl(company.logo_url)"
                :alt="`Logo ${company.name}`"
                class="h-10 w-auto"
                @error="handleImageError"
              />
              <span class="text-slate-400 text-xl font-semibold">{{ company.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import apiClient from "@/api";

  // Props pour recevoir les social_proof depuis le parent
  const props = defineProps({
    socialProof: {
      type: Array,
      default: () => [],
    },
  });

  // Données des entreprises
  const companies = ref([]);

  // Imports des logos par défaut pour le fallback
  import LogoIconValley from "@/assets/images/LogoIconValley.png";
  import LogoGnalenmady from "@/assets/images/LogoGnalenmady.png";
  import LogoByteSecuritas from "@/assets/images/LogoByteSecuritas.png";
  import LogoBMEX from "@/assets/images/LogoBMEX.png";
  import LogoAGEP from "@/assets/images/LogoAGEP.png";

  // Mapping des logos par défaut
  const defaultLogos = {
    "/images/LogoIconValley.png": LogoIconValley,
    "/images/LogoGnalenmady.png": LogoGnalenmady,
    "/images/LogoByteSecuritas.png": LogoByteSecuritas,
    "/images/LogoBMEX.png": LogoBMEX,
    "/images/LogoAGEP.png": LogoAGEP,
    "LogoIconValley.png": LogoIconValley,
    "LogoGnalenmady.png": LogoGnalenmady,
    "LogoByteSecuritas.png": LogoByteSecuritas,
    "LogoBMEX.png": LogoBMEX,
    "LogoAGEP.png": LogoAGEP,
  };

  // Fonction pour obtenir l'URL complète du logo
  const getLogoUrl = (logoUrl) => {
    if (!logoUrl) {
      return LogoIconValley; // Fallback par défaut
    }

    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

    // Si c'est déjà une URL complète
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      return logoUrl;
    }

    // Si c'est un chemin de storage du backend (commence par /storage/)
    if (logoUrl.startsWith("/storage/")) {
      return backendUrl + logoUrl;
    }

    // Si c'est un chemin d'image statique référencé par /images/, vérifier si c'est un logo par défaut
    if (logoUrl.startsWith("/images/")) {
      const fileName = logoUrl.replace(/^.*\//, "");
      // Vérifier si c'est un logo par défaut connu
      if (defaultLogos[logoUrl] || defaultLogos[fileName]) {
        return defaultLogos[logoUrl] || defaultLogos[fileName] || LogoIconValley;
      }
      // Sinon, essayer de servir depuis le dossier public
      return logoUrl;
    }

    // Si c'est un chemin relatif commençant par /, l'utiliser tel quel
    if (logoUrl.startsWith("/")) {
      return logoUrl;
    }

    // Sinon, supposer que c'est un chemin relatif et ajouter le backend URL
    return backendUrl + "/" + logoUrl.replace(/^\//, "");
  };

  // Gestion des erreurs d'image
  const handleImageError = (event) => {
    // En cas d'erreur, utiliser le logo IconValley par défaut
    event.target.src = LogoIconValley;
  };

  // Fonction pour charger les entreprises
  async function loadSocialProof() {
    try {
      const res = await apiClient.get("/homepage");
      const homepageSocialProof = res.data?.homepage?.social_proof || [];
      companies.value = homepageSocialProof.length > 0 ? homepageSocialProof : props.socialProof;
    } catch {
      // Fallback vers les props si l'API échoue
      companies.value = props.socialProof;
    }
  }

  onMounted(() => {
    loadSocialProof();
  });
</script>

<style scoped>
  /* Animation pour le défilement des logos */
  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .animate-scroll {
    animation: scroll 40s linear infinite;
  }

  .group:hover .animate-scroll {
    animation-play-state: paused;
  }

  /* Animation pour l'apparition du titre */
  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-down {
    animation: fade-in-down 1s ease-out forwards;
  }
</style>
