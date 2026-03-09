<template>
  <section id="comment-ca-marche" class="bg-slate-900 py-20 sm:py-24 overflow-x-hidden scroll-mt-20">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16" v-animate-on-scroll>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Simple comme 1, 2, 3</h2>
        <p class="mt-4 text-lg text-slate-300">Commencez à révolutionner votre réseautage en quelques minutes.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div
          class="relative border border-slate-800 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden bg-cover bg-center"
          :style="{ backgroundImage: 'url(' + etape1Image + ')' }"
          v-animate-on-scroll="{ delay: 200 }"
        >
          <div class="absolute inset-0 bg-black/70"></div>
          <div class="relative z-10 flex flex-col items-center">
            <div
              class="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">1. Choisissez votre style</h3>
            <p class="text-slate-400">
              Sélectionnez la carte qui vous représente parmi nos modèles uniques et professionnels.
            </p>
          </div>
        </div>

        <div
          class="relative border border-slate-800 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden bg-cover bg-center"
          :style="{ backgroundImage: 'url(' + etape2Image + ')' }"
          v-animate-on-scroll="{ delay: 350 }"
        >
          <div class="absolute inset-0 bg-black/70"></div>
          <div class="relative z-10 flex flex-col items-center">
            <div
              class="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">2. Personnalisez votre profil</h3>
            <p class="text-slate-400">Configurez votre page en quelques clics depuis votre espace membre intuitif.</p>
          </div>
        </div>

        <div
          class="relative border border-slate-800 rounded-2xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden bg-cover bg-center"
          :style="{ backgroundImage: 'url(' + etape3Image + ')' }"
          v-animate-on-scroll="{ delay: 500 }"
        >
          <div class="absolute inset-0 bg-black/70"></div>
          <div class="relative z-10 flex flex-col items-center">
            <div
              class="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">3. Partagez sans limite</h3>
            <p class="text-slate-400">
              Approchez votre carte d'un smartphone pour partager votre monde instantanément.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import etape1Image from "@/assets/images/etape1.png";
  import etape2Image from "@/assets/images/etape2.png";
  import etape3Image from "@/assets/images/etape3.png";

  // Directive Vue personnalisée pour animer les éléments au défilement
  const vAnimateOnScroll = {
    beforeMount: (el, binding) => {
      // Prépare l'élément en le rendant invisible et en appliquant l'état initial de l'animation
      el.classList.add("before-enter");
      el.style.visibility = "hidden";

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = binding.value?.delay || 0;
            setTimeout(() => {
              // Applique la classe pour déclencher la transition et rend l'élément visible
              el.classList.add("is-visible");
              el.style.visibility = "visible";
            }, delay);
            // Arrête d'observer l'élément une fois qu'il a été animé
            observer.unobserve(el);
          }
        });
      });

      observer.observe(el);
    },
  };
</script>

<style scoped>
  /* État initial de l'élément avant l'animation */
  .before-enter {
    opacity: 0;
    transform: translateY(40px);
    transition:
      opacity 0.7s ease-out,
      transform 0.7s ease-out;
  }

  /* État final de l'élément après l'animation */
  .before-enter.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>
