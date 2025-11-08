<template>
  <section class="relative bg-slate-900 overflow-hidden pt-16 sm:pt-20">
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px]">
      <div
        class="w-full aspect-square max-w-[800px] bg-gradient-to-tr from-sky-500/40 via-blue-700/30 to-indigo-900/50 rounded-full blur-3xl animate-pulse-slow"
      ></div>
    </div>

    <div class="container mx-auto px-4 relative z-20">
      <div
        class="flex flex-col items-center text-center lg:items-center lg:text-left lg:flex-row lg:justify-between py-12 lg:py-16"
      >
        <div class="lg:w-1/2 animate-fade-in-right">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tighter">
            <span v-html="computedTitle"></span>
          </h1>
          <p class="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-slate-300">
            {{ computedSubtitle }}
          </p>
          <div v-if="!isEmployee" class="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
            <a
              v-if="ctaLinkFinal"
              :href="ctaLinkFinal"
              class="group relative inline-block text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-full px-8 py-3.5 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/30"
            >
              {{ ctaTextFinal }}
            </a>
            <button
              v-else
              @click="openOrderModal"
              class="group relative inline-block text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-full px-8 py-3.5 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/30"
            >
              {{ ctaTextFinal }}
            </button>
          </div>
        </div>

        <div class="lg:w-1/2 w-full flex items-center justify-center p-8 lg:p-0 animate-fade-in-left">
          <div
            class="relative w-full max-w-md aspect-video rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-800/50"
          >
            <template v-if="imageUrl">
              <img :src="imageUrl" alt="Illustration" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <a href="#" id="slide-1" class="slideshow-image">
                <img src="@/assets/images/1.png" alt="Carte de visite digitale 1" />
              </a>
              <a href="#" id="slide-2" class="slideshow-image">
                <img src="@/assets/images/2.png" alt="Carte de visite digitale 2" />
              </a>
              <a href="#" id="slide-3" class="slideshow-image">
                <img src="@/assets/images/3.png" alt="Carte de visite digitale 3" />
              </a>
              <a href="#" id="slide-4" class="slideshow-image">
                <img src="@/assets/images/4.png" alt="Carte de visite digitale 4" />
              </a>
              <a href="#" id="slide-5" class="slideshow-image">
                <img src="@/assets/images/5.png" alt="Carte de visite digitale 5" />
              </a>
              <a href="#" id="slide-6" class="slideshow-image">
                <img src="@/assets/images/6.png" alt="Carte de visite digitale 6" />
              </a>
              <a href="#" id="slide-7" class="slideshow-image">
                <img src="@/assets/images/7.png" alt="Carte de visite digitale 7" />
              </a>
              <a href="#" id="slide-8" class="slideshow-image">
                <img src="@/assets/images/8.png" alt="Carte de visite digitale 8" />
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  // MODIFIÉ : Import du "cerveau" du modal
  import { useOrderModal } from "@/composables/useOrderModal";
  import { useAuth } from "@/composables/useAuth";
  import { onMounted, onUnmounted, computed, defineProps } from "vue";

  // Props CMS (facultatives)
  const props = defineProps({
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    ctaText: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  });

  // MODIFIÉ : Initialisation de la fonction pour ouvrir le modal
  const { openOrderModal } = useOrderModal();
  const { user } = useAuth();

  // Vérifier si l'utilisateur est un employé
  const isEmployee = computed(() => user.value?.role === "employee");

  // Derivés avec fallback (garde le design actuel)
  const computedTitle = computed(() => {
    if (props.title) return props.title;
    return (
      'La Carte de Visite, <br class="hidden sm:block" />' +
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Réinventée.</span>'
    );
  });
  const computedSubtitle = computed(
    () => props.subtitle || "Partagez instantanément vos contacts, liens et profils avec une seule carte intelligente.",
  );
  const ctaTextFinal = computed(() => props.ctaText || "Commander ma carte");
  const ctaLinkFinal = computed(() => props.ctaLink || "");

  let intervalId = null;

  onMounted(() => {
    const images = document.querySelectorAll(".slideshow-image");
    let currentImageIndex = 0;

    const animations = [
      { in: "fadeIn", out: "fadeOut" },
      { in: "slideInLeft", out: "slideOutRight" },
      { in: "zoomIn", out: "zoomOut" },
      { in: "slideInUp", out: "slideOutDown" },
      { in: "fadeIn", out: "fadeOut" },
      { in: "slideInRight", out: "slideOutLeft" },
      { in: "zoomIn", out: "zoomOut" },
      { in: "slideInDown", out: "slideOutUp" },
    ];

    if (!props.imageUrl && images.length > 0) {
      images[currentImageIndex].classList.add("visible");

      const nextSlide = () => {
        const outgoingImage = images[currentImageIndex];
        const animationPair = animations[currentImageIndex];
        currentImageIndex = (currentImageIndex + 1) % images.length;
        const incomingImage = images[currentImageIndex];
        outgoingImage.classList.add(animationPair.out);
        incomingImage.classList.add("visible", animationPair.in);

        setTimeout(() => {
          outgoingImage.classList.remove("visible", animationPair.out);
          incomingImage.classList.remove(animationPair.in);
        }, 1000);
      };
      intervalId = setInterval(nextSlide, 3000);
    }
  });

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<style scoped>
  /* Tous les styles restent exactement les mêmes */
  .slideshow-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
  }
  .slideshow-image.visible {
    opacity: 1;
    visibility: visible;
  }
  .slideshow-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  @keyframes slideOutLeft {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
  @keyframes slideInDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes slideOutUp {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }
  @keyframes zoomIn {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes zoomOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.5);
      opacity: 0;
    }
  }
  .fadeIn {
    animation: fadeIn 1s forwards;
  }
  .fadeOut {
    animation: fadeOut 1s forwards;
  }
  .slideInLeft {
    animation: slideInLeft 1s forwards;
  }
  .slideOutRight {
    animation: slideOutRight 1s forwards;
  }
  .slideInRight {
    animation: slideInRight 1s forwards;
  }
  .slideOutLeft {
    animation: slideOutLeft 1s forwards;
  }
  .slideInUp {
    animation: slideInUp 1s forwards;
  }
  .slideOutDown {
    animation: slideOutDown 1s forwards;
  }
  .slideInDown {
    animation: slideInDown 1s forwards;
  }
  .slideOutUp {
    animation: slideOutUp 1s forwards;
  }
  .zoomIn {
    animation: zoomIn 1s forwards;
  }
  .zoomOut {
    animation: zoomOut 1s forwards;
  }
  @keyframes fade-in-right {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes fade-in-left {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .animate-fade-in-right {
    animation: fade-in-right 0.8s ease-out 0.2s forwards;
    opacity: 0;
  }
  .animate-fade-in-left {
    animation: fade-in-left 0.8s ease-out 0.4s forwards;
    opacity: 0;
  }
  .animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.8;
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
  }
</style>
