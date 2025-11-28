// 1. Importer le fichier CSS principal qui contient les styles de Tailwind
import './assets/main.css'

// 2. Importer les fonctions nécessaires de Vue
import { createApp } from 'vue'

// 3. Importer Pinia pour la gestion d'état
import { createPinia } from 'pinia'

// 4. Importer le composant racine de l'application
import App from './App.vue'

// 5. Importer notre configurateur de routes (le "GPS" de l'application)
import router from './router'

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
  console.warn('[Cookie Cleanup] ⚠️ ATTENTION: Cette fonction est désactivée car elle ne peut pas gérer les cookies HttpOnly');
  return; // Ne rien faire
  try {
    // ✅ CRITIQUE: Ne pas nettoyer les cookies si on est sur la route de traitement de paiement
    // Car on a besoin de tous les cookies pour établir la session après le retour de la passerelle
    const currentPath = window.location.pathname;
    if (currentPath === '/payment/process' || currentPath.includes('/payment/process')) {
      console.log('[Cookie Cleanup] Route de paiement détectée, pas de nettoyage des cookies');
      return; // Ne pas nettoyer les cookies sur cette route
    }
    
    const allCookies = document.cookie.split(';').filter(c => c.trim());
    const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:8000';
    const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
    const hostname = window.location.hostname;
    
    // ✅ CRITIQUE: Liste des cookies VALIDES à CONSERVER
    // Le cookie de session Laravel peut avoir différents noms selon APP_NAME
    const validCookieNames = ['XSRF-TOKEN', 'laravel_session', 'site-carte-digitale-session'];
    
    // Si on a moins de 10 cookies, pas besoin de nettoyer (pas de risque d'erreur 431)
    if (allCookies.length <= 10) {
      console.log('[Cookie Cleanup] Nombre de cookies acceptable (' + allCookies.length + '), pas de nettoyage nécessaire');
      return;
    }
    
    console.log('[Cookie Cleanup] Début du nettoyage sélectif des cookies...');
    console.log('[Cookie Cleanup] Cookies avant nettoyage:', allCookies.length);
    
    // ✅ NOUVEAU: Détecter les cookies de session Laravel (noms aléatoires de 40 caractères)
    // Les cookies de session Laravel ont généralement des noms aléatoires de 40 caractères
    // et contiennent des valeurs encodées en base64 qui commencent par "eyJ"
    const sessionCookies = [];
    const otherCookies = [];
    
    allCookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      const cookieName = name.trim();
      
      if (cookieName) {
        // Détecter les cookies de session Laravel :
        // 1. Nom de 40 caractères (format Laravel session ID)
        // 2. OU valeur qui commence par "eyJ" (JSON encodé en base64)
        // 3. OU nom contient 'session', 'laravel', 'sanctum' mais n'est pas dans la liste valide
        const isSessionCookie = (cookieName.length === 40 && /^[a-zA-Z0-9]+$/.test(cookieName)) ||
                                (value && value.trim().startsWith('eyJ')) ||
                                ((cookieName.includes('session') || cookieName.includes('laravel') || cookieName.includes('sanctum')) 
                                 && !validCookieNames.includes(cookieName));
        
        if (isSessionCookie) {
          sessionCookies.push({ name: cookieName, value: value || '' });
        } else if (!validCookieNames.includes(cookieName)) {
          otherCookies.push({ name: cookieName, value: value || '' });
        }
      }
    });
    
    // ✅ NOUVEAU: Garder uniquement le cookie de session le plus récent (celui avec la valeur la plus longue = le plus récent)
    // Supprimer tous les autres cookies de session
    // ✅ CRITIQUE: Ne supprimer QUE si on a plus d'un cookie de session ET que ce n'est pas le cookie de session standard
    if (sessionCookies.length > 1) {
      // Vérifier si on a le cookie de session standard (laravel_session ou site-carte-digitale-session)
      const standardSessionCookie = sessionCookies.find(c => 
        c.name === 'laravel_session' || 
        c.name === 'site-carte-digitale-session' ||
        c.name.includes('-session')
      );
      
      // Si on a un cookie de session standard, le garder et supprimer les autres
      if (standardSessionCookie) {
        console.log('[Cookie Cleanup] Cookie de session standard trouvé, conservation:', standardSessionCookie.name);
        
        // Supprimer tous les autres cookies de session (sauf le standard)
        sessionCookies.filter(c => c.name !== standardSessionCookie.name).forEach(cookie => {
          const paths = ['/', ''];
          const domains = isLocalhost 
            ? [hostname, 'localhost', '127.0.0.1', '']
            : [hostname, '.arccenciel.com', '.digicard.arccenciel.com', 'arccenciel.com', 'digicard.arccenciel.com', ''];
          
          paths.forEach(path => {
            domains.forEach(domain => {
              let cookieString = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
              if (domain) {
                cookieString += ` domain=${domain};`;
              }
              document.cookie = cookieString;
            });
          });
          
          console.log('[Cookie Cleanup] Ancien cookie de session supprimé:', cookie.name);
        });
      } else {
        // Si pas de cookie standard, garder le plus récent (celui avec la valeur la plus longue)
        sessionCookies.sort((a, b) => (b.value?.length || 0) - (a.value?.length || 0));
        const mostRecentSession = sessionCookies[0];
        
        console.log('[Cookie Cleanup] ' + sessionCookies.length + ' cookies de session détectés, conservation du plus récent:', mostRecentSession.name);
        
        // Supprimer tous les autres cookies de session
        sessionCookies.slice(1).forEach(cookie => {
          const paths = ['/', ''];
          const domains = isLocalhost 
            ? [hostname, 'localhost', '127.0.0.1', '']
            : [hostname, '.arccenciel.com', '.digicard.arccenciel.com', 'arccenciel.com', 'digicard.arccenciel.com', ''];
          
          paths.forEach(path => {
            domains.forEach(domain => {
              let cookieString = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
              if (domain) {
                cookieString += ` domain=${domain};`;
              }
              document.cookie = cookieString;
            });
          });
          
          console.log('[Cookie Cleanup] Ancien cookie de session supprimé:', cookie.name);
        });
      }
    }
    
    // Supprimer les autres cookies obsolètes
    let deletedCount = sessionCookies.length > 1 ? sessionCookies.length - 1 : 0;
    
    otherCookies.forEach(cookie => {
      const paths = ['/', ''];
      const domains = isLocalhost 
        ? [hostname, 'localhost', '127.0.0.1', '']
        : [hostname, '.arccenciel.com', '.digicard.arccenciel.com', 'arccenciel.com', 'digicard.arccenciel.com', ''];
      
      paths.forEach(path => {
        domains.forEach(domain => {
          let cookieString = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
          if (domain) {
            cookieString += ` domain=${domain};`;
          }
          document.cookie = cookieString;
          deletedCount++;
        });
      });
      
      console.log('[Cookie Cleanup] Cookie obsolète supprimé:', cookie.name);
    });
    
    // Attendre un peu pour que les suppressions prennent effet
    setTimeout(() => {
      const remainingCookies = document.cookie.split(';').filter(c => c.trim());
      console.log('[Cookie Cleanup] Cookies restants après nettoyage:', remainingCookies.length);
      console.log('[Cookie Cleanup] Cookies supprimés:', deletedCount);
      
      if (remainingCookies.length > 10) {
        console.warn('[Cookie Cleanup] Attention: Encore ' + remainingCookies.length + ' cookies restants');
      }
    }, 100);
    
  } catch (error) {
    console.error('[Cookie Cleanup] Erreur lors du nettoyage des cookies:', error);
  }
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
const pinia = createPinia()

// 7. Créer l'instance de l'application Vue
const app = createApp(App)

// 8. Dire à l'application d'utiliser Pinia et le routeur
app.use(pinia)
app.use(router)

// 9. Monter (afficher) l'application dans l'élément HTML qui a l'id "app"
app.mount('#app')

