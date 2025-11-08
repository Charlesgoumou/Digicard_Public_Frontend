<template>
  <div>
    <LoadingSpinner :is-loading="isLoading" />
    <main v-show="!isLoading">
      <HeroSection
        :title="homepage.hero_title"
        :subtitle="homepage.hero_subtitle"
        :cta-text="homepage.hero_cta_text"
        :cta-link="homepage.hero_cta_link"
        :image-url="homepage.hero_image_url"
      />
      <SocialProofSection :social-proof="homepage.social_proof || []" />
      <HowItWorksSection />
      <ProductsSection />
      <TestimonialsSection :testimonials="homepage.testimonials || []" />
      <FAQSection :faqs="homepage.faqs || []" />
      <FinalCTASection :cta-text="homepage.hero_cta_text" :cta-link="homepage.hero_cta_link" />
    </main>
  </div>
</template>

<script setup>
  // Importation des sections de la page d'accueil
  import { ref, onMounted, nextTick } from 'vue';
  import apiClient from '@/api';
  import HeroSection from "@/components/home/HeroSection.vue";
  import SocialProofSection from "@/components/home/SocialProofSection.vue";
  import HowItWorksSection from "@/components/home/HowItWorksSection.vue";
  import ProductsSection from "@/components/home/ProductsSection.vue";
  import TestimonialsSection from "@/components/home/TestimonialsSection.vue";
  import FAQSection from "@/components/home/FAQSection.vue";
  import FinalCTASection from "@/components/home/FinalCTASection.vue";
  import LoadingSpinner from "@/components/layout/LoadingSpinner.vue";
  import { useLoadingStore } from "@/stores/loading";

  const loadingStore = useLoadingStore();
  const isLoading = ref(true);

  const homepage = ref({
    hero_title: '',
    hero_subtitle: '',
    hero_cta_text: '',
    hero_cta_link: '',
    hero_image_url: '',
    highlights: []
  });

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
              // Attendre encore un frame pour s'assurer que tout est rendu
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
              img.addEventListener("error", checkComplete, { once: true }); // Continuer même si une image échoue
            }
          });

          // Timeout de sécurité au cas où certaines images ne se chargeraient pas
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve();
            }
          }, 5000);
        });
      };

      // Attendre que la fenêtre soit complètement chargée
      if (document.readyState === "complete") {
        checkImages();
      } else {
        window.addEventListener("load", checkImages, { once: true });
      }
    });
  };

  async function loadHomepage() {
    try {
      const res = await apiClient.get('/homepage');
      homepage.value = res.data?.homepage || homepage.value;
    } catch (e) {
      // fallback silencieux
    }
  }

  onMounted(async () => {
    // Activer le chargement dans le store pour masquer le header et footer
    loadingStore.setHomePageLoading(true);
    isLoading.value = true;

    // Charger les données de la page d'accueil
    await loadHomepage();

    // Attendre que le DOM soit complètement rendu
    await nextTick();
    await nextTick(); // Double nextTick pour s'assurer que tous les composants sont montés

    // Attendre que toutes les images soient chargées
    await waitForImages();

    // Petit délai supplémentaire pour une transition fluide
    setTimeout(() => {
      isLoading.value = false;
      loadingStore.setHomePageLoading(false);
    }, 300);
  });
</script>
