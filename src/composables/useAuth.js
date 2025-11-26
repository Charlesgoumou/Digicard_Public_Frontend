import { ref, readonly, computed } from "vue";
import apiClient from "@/api";
import { useRouter } from "vue-router";
import Cookies from "js-cookie"; // Import js-cookie

// State global
const isAuthModalOpen = ref(false);
const user = ref(null); // Internal reactive user state

// Fonction helper pour ajouter l'en-tête CSRF manuellement
const setCsrfHeader = () => {
  const xsrfToken = Cookies.get("XSRF-TOKEN");
  if (xsrfToken) {
    apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
  } else {
    console.warn("Cookie XSRF-TOKEN non trouvé.");
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

export function useAuth() {
  const router = useRouter();

  const openAuthModal = async () => {
    try {
      await apiClient.get("/sanctum/csrf-cookie");
      isAuthModalOpen.value = true;
    } catch (error) {
      console.error("Impossible d'initialiser la session CSRF:", error);
      console.error("Détails de l'erreur:", error.response?.data || error.message);
      alert(
        "Erreur de connexion au serveur. Vérifiez votre connexion réseau.\n\nDétails: " +
          (error.message || "Erreur inconnue"),
      );
    }
  };

  const closeAuthModal = () => {
    isAuthModalOpen.value = false;
  };

  const _fetchUser = async () => {
    try {
      // ✅ CRITIQUE: Récupérer le cookie CSRF avant de faire la requête utilisateur
      // Nécessaire pour établir la session Laravel et éviter les erreurs 419/401
      // ✅ CORRECTION: Augmenter le délai pour s'assurer que le cookie est bien défini,
      // surtout lors d'un rechargement de page (F5)
      try {
        console.log("[_fetchUser] Récupération du cookie CSRF...");
        await apiClient.get("/sanctum/csrf-cookie");
        // ✅ CORRECTION: Augmenter le délai à 800ms pour s'assurer que la session est bien établie
        // après un rechargement de page, la session peut prendre plus de temps à être restaurée
        // Le délai plus long permet à Laravel de restaurer la session depuis la base de données
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("[_fetchUser] Cookie CSRF récupéré, attente de 800ms pour établir la session");
      } catch (csrfError) {
        console.warn("Erreur lors de la récupération du cookie CSRF:", csrfError);
        // Continuer quand même, le cookie peut déjà être présent
      }

      // ✅ CRITIQUE: Mettre à jour le header CSRF après avoir récupéré le cookie
      await setCsrfHeader();
      
      // ✅ NOUVEAU: Vérifier que le cookie XSRF-TOKEN est bien présent
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      if (!xsrfToken) {
        console.warn("[_fetchUser] Cookie XSRF-TOKEN non trouvé après récupération, réessai...");
        // Réessayer une fois avec un délai plus long
        await apiClient.get("/sanctum/csrf-cookie");
        await new Promise((resolve) => setTimeout(resolve, 500));
        await setCsrfHeader();
      }
      
      // ✅ NOUVEAU: Attendre un peu plus avant d'appeler /api/user pour laisser le temps
      // à la session Laravel d'être complètement restaurée depuis la base de données
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      console.log("[_fetchUser] Header CSRF mis à jour, appel de /api/user...");

      const response = await apiClient.get("/api/user");
      console.log("[_fetchUser] Réponse reçue de /api/user:", response.data);
      // Le backend retourne {user: null} ou {user: {...}}
      // Il faut accéder à response.data.user pour obtenir l'utilisateur ou null
      const fetchedUser = response.data.user || null;

      // ✅ CORRECTION : Construire l'URL complète de l'avatar si présent
      if (fetchedUser && fetchedUser.avatar_url) {
        const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
        let fullAvatarUrl = fetchedUser.avatar_url;

        // Si ce n'est pas déjà une URL complète, la construire
        if (!fullAvatarUrl.startsWith("http://") && !fullAvatarUrl.startsWith("https://")) {
          // Gérer les deux formats (/api/storage/ et /storage/)
          if (fullAvatarUrl.startsWith("/api/storage/") || fullAvatarUrl.startsWith("/storage/")) {
            fullAvatarUrl = backendUrl + fullAvatarUrl;
          } else {
            fullAvatarUrl = backendUrl + "/" + fullAvatarUrl.replace(/^\//, "");
          }
        }
        fetchedUser.avatar_url = fullAvatarUrl;
      }

      user.value = fetchedUser;
      return user.value;
    } catch (error) {
      // ✅ IMPORTANT: Ne pas bloquer la navigation si fetchUser() échoue
      // Mettre user à null et retourner null au lieu de lancer une erreur
      if (error.response && (error.response.status === 401 || error.response.status === 419)) {
        // Session expirée ou non authentifié - c'est normal, mettre user à null
        user.value = null;
        return null; // ✅ Retourner null au lieu de lancer l'erreur
      } else {
        // Erreur réseau ou autre - ne pas bloquer, juste mettre user à null
        console.warn("Erreur _fetchUser (non bloquante):", error.message);
        user.value = null;
        return null; // ✅ Retourner null au lieu de lancer l'erreur
      }
    }
  };

  const register = async (credentials) => {
    try {
      setCsrfHeader();
      const response = await apiClient.post("/api/register", credentials);
      closeAuthModal();
      router.push({ name: "Verification", query: { email: credentials.email } });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error.response?.data || error.message);
      throw error;
    }
  };

  /**
   * Connecte un utilisateur.
   */
  const login = async (credentials) => {
    try {
      setCsrfHeader();
      const response = await apiClient.post("/api/login", credentials);

      // ✅ NOUVEAU : Gérer le cas de comptes multiples
      if (response.data.multiple_accounts) {
        // Retourner les données sans fermer le modal ni rediriger
        // AuthModal.vue gérera l'affichage de la sélection
        throw {
          response: {
            data: response.data,
          },
        };
      }

      // ✅ NOUVEAU : Gérer le 2FA obligatoire à chaque connexion
      if (response.data.two_factor_required || response.data.verification_required) {
        // L'utilisateur doit entrer le code 2FA qui a été envoyé par email
        closeAuthModal();
        router.push({
          name: "Verification",
          query: {
            email: credentials.email,
            account_type: credentials.account_type || response.data.account_type,
          },
        });
      } else if (response.data.password_reset_required) {
        // Cas 2: L'employé doit changer son mot de passe (après validation 2FA)
        await _fetchUser(); // S'assure que user.value est défini
        closeAuthModal();
        router.push({ name: "EmployeeSetPassword" }); // Redirige vers la page de mdp
      } else {
        // Cas 3: Connexion normale (ne devrait plus arriver avec le 2FA obligatoire)
        await _fetchUser();
        if (user.value) {
          console.log("Connexion réussie, utilisateur chargé, redirection vers Dashboard.");
          closeAuthModal();
          router.push({ name: "Dashboard" });
        } else {
          throw new Error("Échec de la récupération des données utilisateur après connexion.");
        }
      }
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error.response?.data || error.message);
      throw error;
    }
  };

  /**
   * Vérifie le code 2FA.
   */
  const verifyCode = async (data) => {
    try {
      setCsrfHeader();
      const response = await apiClient.post("/api/verify", data);
      user.value = response.data.user; // Met à jour l'état

      // ✅ CORRECTION : Ajout de la vérification password_reset_required
      if (response.data.password_reset_required) {
        // Cas 1: Vérifié, mais doit changer le mot de passe
        console.log("Vérification réussie, réinitialisation du mot de passe requise.");
        router.push({ name: "EmployeeSetPassword" });
      } else if (user.value) {
        // Cas 2: Vérifié et prêt pour le Dashboard
        console.log("Vérification réussie, redirection vers le Dashboard.");
        router.push({ name: "Dashboard" });
      } else {
        throw new Error("Données utilisateur manquantes après vérification.");
      }
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error.response?.data || error.message);
      throw error;
    }
  };

  /**
   * Renvoie le code de vérification.
   */
  const resendVerificationCode = async (email, accountType = null) => {
    if (!email) {
      throw new Error("Email manquant pour renvoyer le code.");
    }
    try {
      setCsrfHeader();
      const payload = { email };
      if (accountType) {
        payload.account_type = accountType;
      }
      const response = await apiClient.post("/api/resend-verification", payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors du renvoi du code:", error.response?.data || error.message);
      throw error;
    }
  };

  /**
   * Déconnecte l'utilisateur et le redirige vers la page d'accueil.
   */
  const logout = async () => {
    try {
      setCsrfHeader();
      await apiClient.post("/api/logout");
    } catch (error) {
      console.error("Erreur API lors de la déconnexion:", error.response?.data || error.message);
    } finally {
      // Nettoyer l'état utilisateur
      user.value = null;

      // ✅ CORRECTION: Nettoyer tous les cookies de manière exhaustive
      // Supprimer les cookies avec différents domaines et chemins
      const cookieNames = ['XSRF-TOKEN', 'laravel_session'];
      const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:8000';
      const isLocalhost = backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1');
      
      cookieNames.forEach(cookieName => {
        // Supprimer avec path=/
        Cookies.remove(cookieName, { path: '/' });
        Cookies.remove(cookieName, { path: '/', domain: window.location.hostname });
        
        // En production, supprimer aussi pour les domaines possibles
        if (!isLocalhost) {
          Cookies.remove(cookieName, { path: '/', domain: '.arccenciel.com' });
          Cookies.remove(cookieName, { path: '/', domain: '.digicard.arccenciel.com' });
        }
        
        // Supprimer aussi via document.cookie pour être sûr
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        if (!isLocalhost) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.arccenciel.com;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.digicard.arccenciel.com;`;
        }
      });
      
      // Nettoyer tous les autres cookies de session potentiels
      const allCookies = document.cookie.split(';');
      allCookies.forEach(cookie => {
        const [name] = cookie.trim().split('=');
        if (name && (name.includes('session') || name.includes('laravel') || name.includes('sanctum'))) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });

      // Nettoyer le localStorage si nécessaire
      localStorage.clear();

      // Supprimer l'en-tête CSRF
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];

      // Redirection vers la page d'accueil publique
      router.push({ name: "Home" });
    }
  };

  /**
   * Vérifie la session de l'utilisateur (pour la garde de navigation).
   * Retourne l'utilisateur si trouvé, null si non authentifié, ou lance une erreur si problème réseau.
   */
  const checkUserSession = async () => {
    if (user.value) return user.value;
    try {
      const result = await _fetchUser();
      // Si _fetchUser() retourne null, c'est qu'il n'y a pas d'utilisateur authentifié
      // Mais on ne lance pas d'erreur pour permettre au Guard de gérer
      return result;
    } catch (error) {
      // Si c'est une erreur réseau (pas de réponse), la lancer pour que le Guard puisse réessayer
      if (!error.response && (error.code === "ERR_NETWORK" || error.message?.includes("Network"))) {
        throw error; // Relancer les erreurs réseau pour permettre les retries
      }
      // Pour les erreurs 401/419, _fetchUser() retourne déjà null, donc on retourne null ici aussi
      return null;
    }
  };

  /**
   * Met à jour l'avatar dans l'état local.
   */
  const updateUserAvatar = (newAvatarUrl) => {
    if (user.value) {
      user.value = { ...user.value, avatar_url: newAvatarUrl };
    }
  };

  const updateUserLocally = (updatedUserData) => {
    if (updatedUserData) {
      if (user.value) {
        // Fusionne les nouvelles données dans l'objet utilisateur existant
        // Cela préserve la réactivité si user.value est déjà réactif
        user.value = { ...user.value, ...updatedUserData };
        console.log("User state updated locally (merged):", user.value);
      } else {
        // Si user.value est null, créer un nouvel utilisateur avec les données fournies
        user.value = { ...updatedUserData };
        console.log("User state created locally:", user.value);
      }
    }
  };

  // --- Export ---
  return {
    isAuthModalOpen: readonly(isAuthModalOpen),
    isLoggedIn: computed(() => !!user.value),
    user: readonly(user),
    openAuthModal,
    closeAuthModal,
    register,
    login,
    logout,
    fetchUser: checkUserSession,
    verifyCode,
    resendVerificationCode,
    updateUserAvatar,
    updateUserLocally,
  };
}
