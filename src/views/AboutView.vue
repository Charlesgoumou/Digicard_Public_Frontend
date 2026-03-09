<template>
  <div>
    <LoadingSpinner :is-loading="isLoading" />
    <div v-show="!isLoading" class="min-h-screen bg-slate-900 pt-16 sm:pt-20 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Qui Sommes-Nous ?
          </h1>
          <p class="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
            Arcc En Ciel est une Startup diversifiée, active dans plusieurs secteurs, notamment la vente et la
            conception de solutions digitales, le campus voyage, la formation, la vente de licences informatiques,
            l'agrobusiness, le management et la gestion de projets.
          </p>
        </div>
        <div class="text-center mb-12">
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Notre Vision et Notre Mission
          </h1>
          <p class="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
            Nous sommes pleinement conscients que votre satisfaction est primordiale, et nous nous engageons à l'assurer
            à travers l'ensemble de nos services. Notre objectif est de devenir le leader du marché dans nos divers
            domaines d'activité, en adaptant nos services aux besoins spécifiques de nos clients.
          </p>
        </div>
        <div class="text-center mb-12">
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Notre Philosophie
          </h1>
          <p class="mt-4 max-w-3xl mx-auto text-lg text-slate-300">
            Nous croyons fermement en l'évolution de notre société et nous nous engageons activement à répondre à vos
            désirs, quels qu'ils soient, même les plus modestes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";
  import LoadingSpinner from "@/components/layout/LoadingSpinner.vue";
  import { useLoadingStore } from "@/stores/loading";

  const loadingStore = useLoadingStore();
  const isLoading = ref(true);

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
