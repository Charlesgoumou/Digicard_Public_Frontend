<template>
  <footer class="bg-slate-900 border-t border-slate-800 text-slate-400 w-full">
    <div class="w-full max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div class="md:col-span-1 flex flex-col items-center">
          <a href="#" class="mb-4">
            <span class="text-2xl font-bold text-white">ArccEnCiel</span>
          </a>
          <p class="text-sm">La carte de visite réinventée pour un réseautage moderne, simple et sans limite.</p>
        </div>

        <div class="flex flex-col items-center">
          <h3 class="text-white font-semibold mb-4 tracking-wider">Liens Rapides</h3>
          <nav class="flex flex-col space-y-2">
            <a href="/#nos-cartes" class="hover:text-blue-500 transition-colors">Nos Cartes</a>
            <a href="/#comment-ca-marche" class="hover:text-blue-500 transition-colors">Comment ça marche</a>
            <a href="/a-propos" class="hover:text-blue-500 transition-colors">À Propos</a>
            <a href="/contact" class="hover:text-blue-500 transition-colors">Contact</a>
          </nav>
        </div>

        <div class="flex flex-col items-center">
          <h3 class="text-white font-semibold mb-4 tracking-wider">Contact</h3>
          <div class="flex flex-col space-y-2 text-sm">
            <p>Conakry, Guinée</p>
            <a href="mailto:contact@arccenciel.com" class="hover:text-blue-500 transition-colors"
              >contact@arccenciel.com</a
            >
            <a href="tel:+224613615732" class="hover:text-blue-500 transition-colors">+224 613 61 57 32</a>
            <a href="tel:+224666572805" class="hover:text-blue-500 transition-colors">+224 666 57 28 05</a>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <h3 class="text-white font-semibold mb-4 tracking-wider">Suivez-nous</h3>
          <div class="flex space-x-4 justify-center">
            <a
              href="https://www.facebook.com/profile.php?id=61561677309291"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-400 hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/arcc-en-ciel/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-400 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {{ new Date().getFullYear() }} ArccEnCiel. Tous droits réservés.</p>
        <div class="mt-2 space-x-4 flex flex-wrap justify-center gap-2 sm:gap-4">
          <router-link to="/mentions-legales" class="hover:text-blue-500 transition-colors"
            >Mentions Légales</router-link
          >
          <router-link to="/conditions-generales" class="hover:text-blue-500 transition-colors"
            >Conditions Générales de Vente et d'Utilisation (CGV/CGU)</router-link
          >
          <router-link to="/politique-confidentialite" class="hover:text-blue-500 transition-colors"
            >Politique de Confidentialité</router-link
          >
        </div>
      </div>
    </div>
  </footer>
</template>
