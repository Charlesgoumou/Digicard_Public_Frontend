import axios from "axios";

// Configuration globale pour les cookies cross-origin
// CRITIQUE: Permet l'envoi des cookies de session entre le frontend (5173) et le backend (8000)
axios.defaults.withCredentials = true;

// Lire l'URL du backend depuis les variables d'environnement
// En développement local : http://localhost:8000
// Pour tester sur réseau local : http://192.168.1.126:8000
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000",
  withCredentials: true, // Crucial pour les cookies (redondant mais explicite)

  // Configuration CSRF explicite pour forcer Axios à fonctionner correctement
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Intercepteur pour gérer les erreurs 401 (session expirée) et les erreurs CORS
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vérifier si c'est une erreur CORS (pas de réponse du serveur)
    if (!error.response) {
      // Cela peut être une erreur CORS ou une erreur réseau
      if (error.message && (error.message.includes("Network Error") || error.code === "ERR_NETWORK")) {
        console.error("Erreur réseau ou CORS détectée:", error.message);
        // Ne pas rediriger pour les erreurs CORS, laisser le composant gérer l'erreur
      }
    }

    // Si on reçoit une erreur 401 (non autorisé) ou 419 (session expirée)
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      // ✅ CRITIQUE: Au tout début de la gestion des erreurs 401/419
      // Empêcher TOUTE redirection si c'est une vérification de session
      // Cela évite la boucle infinie entre l'intercepteur et le router guard
      const isSessionCheck =
        error.config.url.includes("/api/user") || error.config.url.includes("/sanctum/csrf-cookie");

      // Si c'est une vérification de session qui échoue, on ne fait RIEN (pas de redirect).
      // On rejette juste l'erreur pour que le composant ou le routeur gère le retry.
      if (isSessionCheck) {
        return Promise.reject(error);
      }

      // Vérifier si ce n'est pas une tentative de login/logout ou de vérification initiale
      // OU une route Google OAuth (qui gère ses propres erreurs)
      // OU une route de réinitialisation de mot de passe
      // ✅ CRITIQUE: Inclure /api/auth/exchange-token pour éviter la redirection après paiement
      const isAuthRequest =
        error.config.url.includes("/api/login") ||
        error.config.url.includes("/api/logout") ||
        error.config.url.includes("/api/register") ||
        error.config.url.includes("/api/verify") ||
        error.config.url.includes("/api/auth/exchange-token") ||
        error.config.url.includes("/api/google/validate-token") ||
        error.config.url.includes("/api/google/select-account") ||
        error.config.url.includes("/api/google/pending-accounts") ||
        error.config.url.includes("/api/password/reset-link") ||
        error.config.url.includes("/api/password/reset") ||
        error.config.url.includes("/api/password/verify-token");

      // ✅ MODIFICATION: Ne pas rediriger pour les requêtes vers /api/orders ou /api/payment
      // car elles peuvent échouer temporairement après un retour de paiement
      const isOrderOrPaymentRequest =
        error.config.url.includes("/api/orders") || error.config.url.includes("/api/payment");

      // ✅ NOUVEAU: Sécurité supplémentaire pour /api/orders
      // Si l'erreur survient sur /api/orders ET que nous sommes tout juste après un chargement de page (moins de 2 secondes),
      // ne pas déconnecter l'utilisateur. Contente-toi de rejeter l'erreur. Laisse le composant réessayer.
      if (error.config.url.includes("/api/orders")) {
        const pageLoadTime = performance.timing.navigationStart || performance.timeOrigin;
        const timeSincePageLoad = Date.now() - pageLoadTime;
        const isRecentPageLoad = timeSincePageLoad < 2000; // Moins de 2 secondes

        if (isRecentPageLoad) {
          console.warn(
            "api.js: Erreur 401 sur /api/orders dans les 2 secondes suivant le chargement de la page. Ne pas déconnecter, laisser le composant réessayer.",
            {
              timeSincePageLoad,
              url: error.config.url,
            },
          );
          // Ne pas rediriger, juste rejeter l'erreur pour que le composant puisse gérer le retry
          return Promise.reject(error);
        }
      }

      // ✅ Ensuite seulement, le reste de la logique de redirection
      // ✅ CRITIQUE: Ne pas rediriger si on est sur la route de traitement de paiement
      // car l'utilisateur peut être en train d'échanger un token de session
      const isOnPaymentProcessingPage = window.location.pathname === '/payment/process' || 
                                        window.location.pathname.includes('/payment/process');
      
      if (!isAuthRequest && !isOrderOrPaymentRequest && !isOnPaymentProcessingPage) {
        console.warn("Session expirée. Redirection vers la page d'accueil...");
        // Nettoyer et rediriger (sera géré par useAuth)
        window.location.href = "/";
      } else if (isOnPaymentProcessingPage) {
        console.warn("api.js: Erreur 401/419 sur la page de traitement de paiement, ne pas rediriger pour permettre l'échange de token");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
