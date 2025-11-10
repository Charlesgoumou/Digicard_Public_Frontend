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
            <a href="#" class="text-slate-400 hover:text-blue-500 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="#" class="text-slate-400 hover:text-blue-500 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M21.543 7.104c.015.17.015.34.015.512 0 5.236-3.998 11.27-11.27 11.27-2.23 0-4.306-.653-6.05-1.772a7.994 7.994 0 005.82-1.634 3.93 3.93 0 01-3.668-2.718 4.22 4.22 0 001.77-.067 3.926 3.926 0 01-3.148-3.845v-.05c.5.278 1.07.444 1.68.463a3.929 3.929 0 01-1.64-3.267c0-.718.193-1.39.53-1.968a11.156 11.156 0 008.088 4.1 3.928 3.928 0 016.688-3.582 7.846 7.846 0 002.483-.945 3.94 3.94 0 01-1.718 2.162 7.89 7.89 0 002.25-.608 8.24 8.24 0 01-1.95 2.03z"
                ></path>
              </svg>
            </a>
            <a href="#" class="text-slate-400 hover:text-blue-500 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12.019c0 4.438 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.019C22 6.477 17.523 2 12 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {{ new Date().getFullYear() }} ArccEnCiel. Tous droits réservés.</p>
        <div class="mt-2 space-x-4">
          <a href="#" class="hover:text-blue-500 transition-colors">Mentions Légales</a>
          <a href="#" class="hover:text-blue-500 transition-colors">Politique de Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
</template>
