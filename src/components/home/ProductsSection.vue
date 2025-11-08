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
        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500"
          v-animate-on-scroll="{ delay: 200 }"
        >
          <div class="overflow-hidden">
            <img
              src="@/assets/images/design_professionnel.png"
              alt="Carte PVC avec un design professionnel et épuré"
              class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          </div>
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-white mb-2">Design Professionnel</h3>
            <p class="text-slate-400 mb-6 text-sm">
              Un style sobre et élégant, parfait pour une image de marque forte et une lisibilité maximale.
            </p>
          </div>
        </div>

        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500"
          v-animate-on-scroll="{ delay: 350 }"
        >
          <div class="overflow-hidden">
            <img
              src="@/assets/images/design_creatif.png"
              alt="Carte PVC avec un design créatif et coloré"
              class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          </div>
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-white mb-2">Design Créatif & Moderne</h3>
            <p class="text-slate-400 mb-6 text-sm">
              Osez la couleur et les formes audacieuses. Exprimez votre créativité pour une carte qui ne passe pas
              inaperçue.
            </p>
          </div>
        </div>

        <div
          class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500"
          v-animate-on-scroll="{ delay: 500 }"
        >
          <div class="overflow-hidden">
            <img
              src="@/assets/images/design_personnalise.png"
              alt="Carte PVC avec un design personnalisé et premium"
              class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
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
