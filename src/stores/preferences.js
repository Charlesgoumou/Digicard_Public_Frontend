import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useAuth } from "@/composables/useAuth";
import apiClient from "@/api";

/**
 * Store Pinia pour la gestion des préférences utilisateur.
 * Implémente une stratégie hybride : LocalStorage (instantané) + Base de données (synchronisation cross-device).
 */
export const usePreferencesStore = defineStore("preferences", () => {
  // ========== STATE ==========
  
  /**
   * Préférences utilisateur (thème, sidebar, langue, etc.)
   */
  const settings = ref({
    theme: "light", // 'light' | 'dark' | 'auto'
    sidebarOpen: true,
    language: "fr",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard_layout: "default",
    table_pagination: 10,
  });

  /**
   * Indique si les préférences sont synchronisées avec le serveur
   */
  const isSynced = ref(false);

  /**
   * Indique si une synchronisation est en cours
   */
  const isSyncing = ref(false);

  /**
   * Timer pour le debounce des mises à jour
   */
  let syncTimeout = null;

  // ========== CONSTANTS ==========
  
  const STORAGE_KEY = "user_preferences";
  const SYNC_DEBOUNCE_MS = 500;

  // ========== COMPUTED ==========
  
  /**
   * Retourne le thème actuel (utile si 'auto' est sélectionné)
   */
  const currentTheme = computed(() => {
    if (settings.value.theme === "auto") {
      // Détecter la préférence système
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return settings.value.theme;
  });

  // ========== HELPERS ==========
  
  /**
   * Fonction debounce pour éviter de spammer l'API
   */
  const debounce = (fn, delay) => {
    return (...args) => {
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      syncTimeout = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  /**
   * Sauvegarde les préférences dans le localStorage
   */
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
      console.log("[PreferencesStore] Préférences sauvegardées dans localStorage");
    } catch (error) {
      console.error("[PreferencesStore] Erreur lors de la sauvegarde localStorage:", error);
    }
  };

  /**
   * Charge les préférences depuis le localStorage
   */
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Fusionner avec les valeurs par défaut (au cas où de nouvelles clés sont ajoutées)
        settings.value = {
          ...settings.value,
          ...parsed,
        };
        console.log("[PreferencesStore] Préférences chargées depuis localStorage");
        return true;
      }
    } catch (error) {
      console.error("[PreferencesStore] Erreur lors du chargement localStorage:", error);
    }
    return false;
  };

  /**
   * Applique les préférences à l'interface (ex: thème, sidebar)
   */
  const applyPreferences = () => {
    // Appliquer le thème
    const theme = currentTheme.value;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Appliquer la langue (si nécessaire)
    if (settings.value.language) {
      document.documentElement.lang = settings.value.language;
    }

    console.log("[PreferencesStore] Préférences appliquées à l'interface");
  };

  // ========== ACTIONS ==========
  
  /**
   * Initialise le store depuis le localStorage (INSTANTANÉ - avant même l'auth)
   * Cette fonction doit être appelée au démarrage de l'application.
   */
  const initialize = () => {
    console.log("[PreferencesStore] Initialisation depuis localStorage...");
    loadFromLocalStorage();
    applyPreferences();
    isSynced.value = false; // Pas encore synchronisé avec le serveur
  };

  /**
   * Synchronise les préférences avec le serveur (après connexion)
   * Fusionne les préférences BDD avec le state local (priorité à la BDD)
   */
  const syncWithServer = async () => {
    const { isLoggedIn } = useAuth();
    
    if (!isLoggedIn.value) {
      console.log("[PreferencesStore] Utilisateur non connecté, pas de synchronisation");
      return;
    }

    if (isSyncing.value) {
      console.log("[PreferencesStore] Synchronisation déjà en cours");
      return;
    }

    isSyncing.value = true;

    try {
      console.log("[PreferencesStore] Récupération des préférences depuis le serveur...");
      const response = await apiClient.get("/api/user/preferences");
      const serverPreferences = response.data?.preferences || {};

      // Fusionner : Priorité à la BDD (source de vérité cross-device)
      // Mais garder les valeurs locales si elles n'existent pas en BDD
      settings.value = {
        ...settings.value, // Valeurs par défaut + localStorage
        ...serverPreferences, // Priorité à la BDD
      };

      // Mettre à jour le localStorage avec les valeurs fusionnées
      saveToLocalStorage();
      
      // Appliquer les nouvelles préférences
      applyPreferences();

      isSynced.value = true;
      console.log("[PreferencesStore] ✅ Synchronisation réussie avec le serveur");
    } catch (error) {
      console.error("[PreferencesStore] Erreur lors de la synchronisation:", error);
      // En cas d'erreur, on garde les préférences locales
      isSynced.value = false;
    } finally {
      isSyncing.value = false;
    }
  };

  /**
   * Met à jour une préférence (Optimistic UI)
   * 1. Met à jour le state immédiatement
   * 2. Met à jour le localStorage immédiatement
   * 3. Envoie la requête API en arrière-plan (debounced)
   */
  const updatePreference = (key, value) => {
    // 1. Mettre à jour le state immédiatement
    if (key.includes(".")) {
      // Gestion des clés imbriquées (ex: "notifications.email")
      const keys = key.split(".");
      let obj = settings.value;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
          obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    } else {
      settings.value[key] = value;
    }

    // 2. Sauvegarder dans localStorage immédiatement
    saveToLocalStorage();

    // 3. Appliquer les changements à l'interface
    applyPreferences();

    // 4. Synchroniser avec le serveur en arrière-plan (debounced)
    const { isLoggedIn } = useAuth();
    if (isLoggedIn.value) {
      debouncedSync();
    } else {
      console.log("[PreferencesStore] Utilisateur non connecté, pas de synchronisation serveur");
    }
  };

  /**
   * Fonction debounced pour synchroniser avec le serveur
   */
  const debouncedSync = debounce(async () => {
    if (isSyncing.value) {
      return;
    }

    isSyncing.value = true;

    try {
      console.log("[PreferencesStore] Synchronisation des préférences avec le serveur...");
      await apiClient.post("/api/user/preferences", {
        preferences: settings.value,
      });

      isSynced.value = true;
      console.log("[PreferencesStore] ✅ Préférences synchronisées avec succès");
    } catch (error) {
      console.error("[PreferencesStore] Erreur lors de la synchronisation:", error);
      isSynced.value = false;
      // En cas d'erreur, on garde les préférences locales (elles sont déjà dans localStorage)
    } finally {
      isSyncing.value = false;
    }
  }, SYNC_DEBOUNCE_MS);

  /**
   * Met à jour plusieurs préférences en une fois
   */
  const updatePreferences = (newPreferences) => {
    Object.keys(newPreferences).forEach((key) => {
      updatePreference(key, newPreferences[key]);
    });
  };

  /**
   * Réinitialise les préférences aux valeurs par défaut
   */
  const resetPreferences = () => {
    settings.value = {
      theme: "light",
      sidebarOpen: true,
      language: "fr",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      dashboard_layout: "default",
      table_pagination: 10,
    };

    saveToLocalStorage();
    applyPreferences();

    // Synchroniser avec le serveur si connecté
    const { isLoggedIn } = useAuth();
    if (isLoggedIn.value) {
      debouncedSync();
    }
  };

  /**
   * Nettoie les préférences lors de la déconnexion
   * Option: garder les préférences génériques (thème, langue) pour la prochaine visite
   */
  const clearOnLogout = (keepGenericPreferences = true) => {
    if (keepGenericPreferences) {
      // Garder uniquement les préférences génériques (thème, langue)
      const genericPreferences = {
        theme: settings.value.theme,
        language: settings.value.language,
      };
      settings.value = {
        ...settings.value,
        ...genericPreferences,
      };
      saveToLocalStorage();
    } else {
      // Tout nettoyer
      localStorage.removeItem(STORAGE_KEY);
      resetPreferences();
    }

    isSynced.value = false;
    console.log("[PreferencesStore] Préférences nettoyées après déconnexion");
  };

  // ========== EXPORT ==========
  
  return {
    // State
    settings,
    isSynced,
    isSyncing,
    
    // Computed
    currentTheme,
    
    // Actions
    initialize,
    syncWithServer,
    updatePreference,
    updatePreferences,
    resetPreferences,
    clearOnLogout,
  };
});
