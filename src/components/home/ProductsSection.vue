<template>
  <section id="nos-cartes" class="bg-slate-950 py-20 sm:py-24 overflow-x-hidden scroll-mt-20">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16" v-animate-on-scroll>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Un Design pour Chaque Style</h2>
        <p class="mt-4 text-lg text-slate-300">
          Votre carte PVC blanche est une toile vierge. Découvrez les possibilités de design infinies pour créer une
          carte qui vous ressemble vraiment.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- ✅ MODIFICATION: Premier cadre "Design Discret" avec défilement droite->gauche -->
        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500"
          v-animate-on-scroll="{ delay: 200 }"
        >
          <div class="overflow-hidden relative aspect-square">
            <div
              ref="carousel1"
              class="flex transition-transform duration-1000 ease-in-out h-full"
              :style="{ transform: `translateX(-${currentIndex1 * 100}%)` }"
            >
              <img
                v-for="(image, index) in designDiscretImages"
                :key="index"
                :src="image"
                :alt="`Design Discret - Image ${index + 1}`"
                class="w-full h-full object-contain flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-white mb-2">Design Discret</h3>
            <p class="text-slate-400 mb-6 text-sm">
              Un style sobre et élégant, parfait pour une image de marque forte et une lisibilité maximale.
            </p>
          </div>
        </div>

        <!-- ✅ MODIFICATION: Deuxième cadre "Design Professionnel" avec défilement gauche->droite -->
        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500"
          v-animate-on-scroll="{ delay: 350 }"
        >
          <div class="overflow-hidden relative aspect-square">
            <div
              ref="carousel2"
              class="flex transition-transform duration-1000 ease-in-out h-full"
              :style="{ transform: `translateX(-${currentIndex2 * 100}%)` }"
            >
              <img
                v-for="(image, index) in designProfessionnelImages"
                :key="index"
                :src="image"
                :alt="`Design Professionnel - Image ${index + 1}`"
                class="w-full h-full object-contain flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-white mb-2">Design Professionnel</h3>
            <p class="text-slate-400 mb-6 text-sm">
              Une carte qui parle mieux de votre organisation et qui vous rapproche davantage de vos clients.
            </p>
          </div>
        </div>

        <!-- ✅ MODIFICATION: Troisième cadre avec image unique sans défilement -->
        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500"
          v-animate-on-scroll="{ delay: 500 }"
        >
          <div class="overflow-hidden relative aspect-square">
            <img
              :src="designPersonnaliseImage"
              alt="Carte PVC avec un design personnalisé et premium"
              class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          </div>
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-white mb-2">Design Personnalisé & Premium</h3>
            <p class="text-slate-400 mb-6 text-sm">
              Moins, c'est plus. Un design épuré qui met l'accent sur vous avec une touche de luxe.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from "vue";

  // ✅ MODIFICATION: Images pour "Design Discret" (défilement droite->gauche)
  import carte3 from "@/assets/images/cartes/carte3.jpg";
  import carte4 from "@/assets/images/cartes/carte4.jpg";
  import carte24 from "@/assets/images/cartes/carte24.jpg";
  import carte1 from "@/assets/images/cartes/carte1.jpg";
  import carte19 from "@/assets/images/cartes/carte19.jpg";

  const designDiscretImages = [carte3, carte4, carte24, carte1, carte19];

  // ✅ MODIFICATION: Images pour "Design Professionnel" (défilement gauche->droite)
  import carte16 from "@/assets/images/cartes/carte16.jpg";
  import carte26 from "@/assets/images/cartes/carte26.jpg";
  import carte27 from "@/assets/images/cartes/carte27.jpg";
  import carte15 from "@/assets/images/cartes/carte15.jpg";
  import carte21 from "@/assets/images/cartes/carte21.jpg";

  // Inverser l'ordre pour un défilement gauche->droite
  const designProfessionnelImages = [carte21, carte15, carte27, carte26, carte16];

  // ✅ MODIFICATION: Image unique pour "Design Personnalisé & Premium"
  import carte31 from "@/assets/images/cartes/carte31.jpg";
  const designPersonnaliseImage = carte31;

  // Indices pour les carrousels
  const currentIndex1 = ref(0); // Design Discret (droite->gauche)
  const currentIndex2 = ref(0); // Design Professionnel (gauche->droite)
  const carousel1 = ref(null);
  const carousel2 = ref(null);

  let interval1 = null;
  let interval2 = null;

  // ✅ MODIFICATION: Défilement automatique pour "Design Discret" (droite->gauche)
  const startCarousel1 = () => {
    interval1 = setInterval(() => {
      currentIndex1.value = (currentIndex1.value + 1) % designDiscretImages.length;
    }, 2000); // 2 secondes
  };

  // ✅ MODIFICATION: Défilement automatique pour "Design Professionnel" (gauche->droite)
  // Pour un défilement gauche->droite, on décrémente l'index
  const startCarousel2 = () => {
    interval2 = setInterval(() => {
      currentIndex2.value = (currentIndex2.value - 1 + designProfessionnelImages.length) % designProfessionnelImages.length;
    }, 2000); // 2 secondes
  };

  const stopCarousels = () => {
    if (interval1) {
      clearInterval(interval1);
      interval1 = null;
    }
    if (interval2) {
      clearInterval(interval2);
      interval2 = null;
    }
  };

  onMounted(() => {
    startCarousel1();
    startCarousel2();
  });

  onUnmounted(() => {
    stopCarousels();
  });

  // Directive Vue personnalisée pour animer les éléments au défilement
  const vAnimateOnScroll = {
    beforeMount: (el, binding) => {
      el.classList.add("before-enter-zoom");
      el.style.visibility = "hidden";

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = binding.value?.delay || 0;
            setTimeout(() => {
              el.classList.add("is-visible-zoom");
              el.style.visibility = "visible";
            }, delay);
            observer.unobserve(el);
          }
        });
      });

      observer.observe(el);
    },
  };
</script>

<style scoped>
  /* État initial de l'élément avant l'animation de zoom */
  .before-enter-zoom {
    opacity: 0;
    transform: scale(0.9); /* Commence légèrement plus petit */
    transition:
      opacity 0.6s ease-out,
      transform 0.6s ease-out;
  }

  /* État final de l'élément après l'animation */
  .before-enter-zoom.is-visible-zoom {
    opacity: 1;
    transform: scale(1); /* Revient à sa taille normale */
  }
</style>
