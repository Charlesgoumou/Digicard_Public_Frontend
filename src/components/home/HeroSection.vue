<template>
  <!-- Hero Section -->
  <section class="relative bg-slate-900 w-full max-w-7xl rounded-2xl overflow-hidden border border-slate-700">
      <!-- Background glow effect -->
      <div class="absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-x-1/4 -translate-y-1/2 bg-blue-500/20 blur-3xl rounded-full" aria-hidden="true"></div>

      <div class="relative container mx-auto px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
          <div class="lg:w-1/2 text-center lg:text-left">
              <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl animate-fade-in-up" style="animation-delay: 0.2s;">
                  La Carte Qui Simplifie Votre Quotidien
              </h1>
              <p class="mt-6 text-lg leading-8 text-slate-300 animate-fade-in-up" style="animation-delay: 0.4s;">
                  Accédez à un monde de possibilités avec une carte unique. Gérez vos dépenses, sécurisez vos transactions et profitez d'avantages exclusifs.
              </p>
              <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start animate-fade-in-up" style="animation-delay: 0.6s;">
                  <a href="#" class="rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-transform duration-300 hover:scale-105">
                      Commander ma carte
                  </a>
              </div>
          </div>
          <div class="mt-16 sm:mt-24 lg:mt-0 lg:w-1/2 flex justify-center items-center">
              <!-- Espace pour l'image de la carte -->
              <div class="w-full max-w-md animate-fade-in-up rounded-xl overflow-hidden shadow-2xl" style="animation-delay: 0.8s;">
                   <!-- C'est ici que vous mettrez votre image. Ex: src="@/assets/images/ma-carte.png" -->
                   <img class="w-full h-auto object-cover aspect-video" src="@/assets/images/placeholder-card.png" alt="Placeholder pour une image de carte de visite numérique">
              </div>
          </div>
      </div>
  </section>
</template>

<script setup>
// Pas de logique JavaScript nécessaire pour ce composant
</script>

<style scoped>
/* Définition des animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Classe utilitaire pour appliquer les animations */
.animate-fade-in-up {
    opacity: 0; /* Commence invisible */
    animation: fadeInUp 0.8s ease-out forwards;
}
</style>

