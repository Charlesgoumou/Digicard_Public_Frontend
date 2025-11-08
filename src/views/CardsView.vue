<template>
  <div>
    <LoadingSpinner :is-loading="isLoading" />
    <div v-show="!isLoading" class="min-h-screen bg-slate-900 pt-16 sm:pt-20 text-white">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h1
            class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500"
          >
            Une Carte pour Chaque Style
          </h1>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
            Découvrez nos modèles conçus pour s'adapter à votre identité professionnelle, alliant élégance, technologie et
            durabilité.
          </p>
        </div>

        <!-- Réutilisation du composant Produits -->
        <ProductsSection />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";
  import ProductsSection from "@/components/home/ProductsSection.vue";
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
