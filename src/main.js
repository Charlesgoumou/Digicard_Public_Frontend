// 1. Importer le fichier CSS principal qui contient les styles de Tailwind
import "./assets/main.css";

// 2. Importer les fonctions nécessaires de Vue
import { createApp } from "vue";

// 3. Importer Pinia pour la gestion d'état
import { createPinia } from "pinia";

// 4. Importer le composant racine de l'application
import App from "./App.vue";

// 5. Importer notre configurateur de routes (le "GPS" de l'application)
import router from "./router";

// ⚠️ ATTENTION : Cette fonction est DÉSACTIVÉE et ne doit PAS être utilisée
//
// PROBLÈME TECHNIQUE MAJEUR :
// - Les cookies HttpOnly (comme laravel_session) ne sont PAS accessibles via document.cookie
// - Cette fonction ne peut donc PAS voir ni supprimer le vrai cookie de session Laravel
// - Elle ne peut voir que XSRF-TOKEN (qui n'est pas HttpOnly)
// - Si elle tente de supprimer XSRF-TOKEN, cela provoque des erreurs 419 (CSRF token mismatch)
//
// SÉCURITÉ MODERNE :
// - SESSION_SECURE_COOKIE=true et HttpOnly sont activés dans le backend
// - Le navigateur et le backend gèrent correctement l'expiration des cookies
// - Les erreurs "Header too large" viennent généralement de cookies tiers (Google, Facebook, etc.)
//
// ❌ NE PAS UTILISER CETTE FONCTION
const cleanUpCookies = () => {
  console.warn(
    "[Cookie Cleanup] ⚠️ ATTENTION: Cette fonction est désactivée car elle ne peut pas gérer les cookies HttpOnly",
  );
};

// ✅ CRITIQUE: NE PAS exécuter cleanUpCookies() - DÉSACTIVÉ POUR DES RAISONS DE SÉCURITÉ
//
// PROBLÈME TECHNIQUE MAJEUR :
// - Les cookies HttpOnly (comme laravel_session) ne sont PAS accessibles via document.cookie
// - Cette fonction ne peut donc PAS voir ni supprimer le vrai cookie de session Laravel
// - Elle ne peut voir que XSRF-TOKEN (qui n'est pas HttpOnly)
// - Si elle tente de supprimer XSRF-TOKEN, cela provoque des erreurs 419 (CSRF token mismatch)
//
// SÉCURITÉ MODERNE :
// - SESSION_SECURE_COOKIE=true et HttpOnly sont activés dans le backend
// - Le navigateur et le backend gèrent correctement l'expiration des cookies
// - Les erreurs "Header too large" viennent généralement de cookies tiers (Google, Facebook, etc.)
// - Pas des cookies Laravel qui sont bien gérés
//
// RECOMMANDATION :
// - Laisser cette fonction DÉSACTIVÉE (commentée)
// - Laisser le navigateur et le backend gérer l'expiration des cookies automatiquement
// cleanUpCookies(); // ❌ DÉSACTIVÉ - Ne pas utiliser avec des cookies HttpOnly

// 6. Créer l'instance de Pinia
const pinia = createPinia();

// 7. Créer l'instance de l'application Vue
const app = createApp(App);

// 8. Dire à l'application d'utiliser Pinia et le routeur
app.use(pinia);
app.use(router);

// 9. Initialiser le store de préférences AVANT le montage (pour un affichage instantané)
import { usePreferencesStore } from "./stores/preferences";
const preferencesStore = usePreferencesStore();
preferencesStore.initialize();

// 10. Monter (afficher) l'application dans l'élément HTML qui a l'id "app"
app.mount("#app");
