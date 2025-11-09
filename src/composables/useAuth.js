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
      const response = await apiClient.get("/api/user");
      // Le backend retourne {user: null} ou {user: {...}}
      // Il faut accéder à response.data.user pour obtenir l'utilisateur ou null
      user.value = response.data.user || null;
      return user.value;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 419)) {
        user.value = null;
      } else {
        console.error("Erreur _fetchUser:", error);
        user.value = null;
      }
      throw error;
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
            account_type: credentials.account_type || response.data.account_type
          } 
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

      // Nettoyer tous les cookies Sanctum
      Cookies.remove("XSRF-TOKEN");
      Cookies.remove("laravel_session");

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
   */
  const checkUserSession = async () => {
    if (user.value) return user.value;
    try {
      return await _fetchUser();
    } catch (error) {
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
    if (user.value && updatedUserData) {
      // Fusionne les nouvelles données dans l'objet utilisateur existant
      // Cela préserve la réactivité si user.value est déjà réactif
      user.value = { ...user.value, ...updatedUserData };
      console.log("User state updated locally after profile save:", user.value);
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
