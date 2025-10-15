<template>
  <!-- Section Preuve Sociale avec design "Pro" et animation de défilement -->
  <section class="social-proof-section bg-slate-900 w-full py-16 sm:py-20 border-y border-slate-700 overflow-hidden">
    <div class="container mx-auto px-6 text-center">

      <h2 class="text-sm font-bold uppercase text-slate-400 tracking-widest title-animate">
        Ils nous font confiance
      </h2>

      <!-- Conteneur qui cache le surplus pour l'effet de défilement -->
      <div class="logos-container mt-12 relative w-full">
        <!-- Le scroller contient deux fois la liste des logos pour un défilement infini parfait -->
        <div class="logos-scroller flex w-max">
          <!-- Set de logos 1 -->
          <div class="flex items-center justify-around flex-shrink-0 w-max space-x-16 px-8">
              <!-- Logo Microsoft -->
              <svg class="h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0h11.25v11.25H0V0zm12.75 0H24v11.25H12.75V0zM0 12.75h11.25V24H0V12.75zm12.75 12.75H24V24H12.75v-1.25z"/></svg>
              <!-- Logo Google -->
              <svg class="h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,11.76 21.35,11.1 21.35,11.1V11.1Z"/></svg>
              <!-- Logo Airbnb -->
              <svg class="h-10 text-slate-400" fill="currentColor" viewBox="0 0 16 16"><path d="M8.21,3.2A5.1,5.1,0,0,0,3.2,8.21,5.1,5.1,0,0,0,8.21,13.2a5.1,5.1,0,0,0,5-5A5.1,5.1,0,0,0,8.21,3.2Zm0,8.62A3.62,3.62,0,0,1,4.59,8.21a3.62,3.62,0,0,1,3.62-3.62,3.62,3.62,0,0,1,3.62,3.62A3.62,3.62,0,0,1,8.21,11.82Zm0-10.4A6.59,6.59,0,0,0,1.62,8.21,6.59,6.59,0,0,0,8.21,14.8,6.59,6.59,0,0,0,14.8,8.21,6.59,6.59,0,0,0,8.21,1.42Z"/></svg>
              <!-- Logo Spotify -->
              <svg class="h-9 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.053 13.903c-.195.308-.578.42-.887.224-2.52-1.54-5.692-1.884-9.363-1.033-.352.08-.688-.164-.768-.516-.08-.352.164-.688.516-.768 4.015-.92 7.518-.525 10.288 1.18.309.195.42.578.224.887m.62-2.735c-.244.384-.71.516-1.094.272-2.83-1.745-7.144-2.26-10.443-1.24-.422.132-.877-.11-.998-.532-.12-.422.11-.877.532-.998 3.666-1.104 8.356-.533 11.488 1.418.384.243.516.71.272 1.094m.128-2.87c-.29.46-.86.62-1.32.33-3.25-1.99-8.5-2.52-12.1-1.38-.506.15-.98-.16-1.13-.66-.15-.506.16-.98.66-1.13 4.1-1.26 9.85-.66 13.56 1.63.46.29.62.86.33 1.32"/></svg>
          </div>
          <!-- Set de logos 2 (Duplicata pour un effet de boucle parfait) -->
          <div class="flex items-center justify-around flex-shrink-0 w-max space-x-16 px-8">
              <!-- Logo Microsoft -->
              <svg class="h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0h11.25v11.25H0V0zm12.75 0H24v11.25H12.75V0zM0 12.75h11.25V24H0V12.75zm12.75 12.75H24V24H12.75v-1.25z"/></svg>
              <!-- Logo Google -->
              <svg class="h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,11.76 21.35,11.1 21.35,11.1V11.1Z"/></svg>
              <!-- Logo Airbnb -->
              <svg class="h-10 text-slate-400" fill="currentColor" viewBox="0 0 16 16"><path d="M8.21,3.2A5.1,5.1,0,0,0,3.2,8.21,5.1,5.1,0,0,0,8.21,13.2a5.1,5.1,0,0,0,5-5A5.1,5.1,0,0,0,8.21,3.2Zm0,8.62A3.62,3.62,0,0,1,4.59,8.21a3.62,3.62,0,0,1,3.62-3.62,3.62,3.62,0,0,1,3.62,3.62A3.62,3.62,0,0,1,8.21,11.82Zm0-10.4A6.59,6.59,0,0,0,1.62,8.21,6.59,6.59,0,0,0,8.21,14.8,6.59,6.59,0,0,0,14.8,8.21,6.59,6.59,0,0,0,8.21,1.42Z"/></svg>
              <!-- Logo Spotify -->
              <svg class="h-9 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.053 13.903c-.195.308-.578.42-.887.224-2.52-1.54-5.692-1.884-9.363-1.033-.352.08-.688-.164-.768-.516-.08-.352.164-.688.516-.768 4.015-.92 7.518-.525 10.288 1.18.309.195.42.578.224.887m.62-2.735c-.244.384-.71.516-1.094.272-2.83-1.745-7.144-2.26-10.443-1.24-.422.132-.877-.11-.998-.532-.12-.422.11-.877.532-.998 3.666-1.104 8.356-.533 11.488 1.418.384.243.516.71.272 1.094m.128-2.87c-.29.46-.86.62-1.32.33-3.25-1.99-8.5-2.52-12.1-1.38-.506.15-.98-.16-1.13-.66-.15-.506.16-.98.66-1.13 4.1-1.26 9.85-.66 13.56 1.63.46.29.62.86.33 1.32"/></svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Pas de logique JavaScript nécessaire pour ce composant
</script>

<style scoped>
/* Animation pour le titre */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Animation pour le défilement des logos */
@keyframes scroll {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
}

.title-animate {
    animation: fadeInDown 1s ease-out forwards;
}

.logos-scroller {
    /* L'animation 'scroll' dure 40s, est linéaire et se répète à l'infini */
    animation: scroll 40s linear infinite;
}

/* On met l'animation en pause au survol de la souris */
.logos-container:hover .logos-scroller {
    animation-play-state: paused;
}
</style>

