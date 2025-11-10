import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/api";
import Cookies from "js-cookie";

/**
 * Composable pour gérer la logique métier des paramètres de carte
 *
 * @param {Ref} selectedOrderId - Référence à l'ID de la commande sélectionnée
 * @param {Ref} user - Référence à l'utilisateur actuel
 * @param {Function} updateUserLocally - Fonction pour mettre à jour l'utilisateur localement
 * @param {Function} onAvatarPreviewUpdate - Callback pour mettre à jour l'aperçu de l'avatar
 * @param {Function} onDesignStateUpdate - Callback pour mettre à jour l'état du design
 * @param {Function} onCustomDesignPreviewUpdate - Callback pour mettre à jour l'aperçu du design personnalisé
 * @param {Function} getAvatarUrl - Fonction utilitaire pour construire l'URL de l'avatar
 * @returns {Object} - Objet contenant form, état, et fonctions
 */
export function useCardSettings(
  selectedOrderId,
  user,
  updateUserLocally,
  onAvatarPreviewUpdate,
  onDesignStateUpdate,
  onCustomDesignPreviewUpdate,
  getAvatarUrl,
  onDataLoadedCallback,
) {
  const router = useRouter();

  // ========== ÉTAT RÉACTIF ==========

  // Structure réactive pour le formulaire
  const form = reactive({
    name: "",
    title: "",
    // Couleurs
    profile_border_color: "#facc15",
    save_contact_button_color: "#ca8a04",
    services_button_color: "#0ea5e9",
    // Téléphones et emails (tableaux)
    phone_numbers: [""],
    emails: [""],
    // Date importante
    birth_day: null,
    birth_month: null,
    // Site web
    website_url: "",
    // Adresse
    address_neighborhood: "",
    address_commune: "",
    address_city: "",
    address_country: "",
    // Réseaux sociaux
    whatsapp_url: "",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
    deezer_url: "",
    spotify_url: "",
    // Design de la carte
    card_design_type: null, // 'template' ou 'custom'
    card_design_number: null, // Numéro du template (1-30) ou null
    card_design_custom_url: null, // URL du design personnalisé uploadé
    no_design_yet: false, // Case à cocher "Je n'ai pas encore mon design"
    // Anciens champs vCard (conservés pour compatibilité)
    vcard_phone: "",
    vcard_email: "",
    vcard_company: "",
    vcard_address: "",
  });

  // État de sauvegarde
  const isSaving = ref(false);
  const saveSuccess = ref("");
  const saveError = ref("");
  const savingMessage = ref("Enregistrement en cours...");
  const showSuccessIcon = ref(false);

  // État de chargement des données
  const isLoadingOrderData = ref(false);
  
  // Stocker les données de la commande chargée pour y accéder depuis SettingsView
  const loadedOrderData = ref(null);

  // ========== FONCTIONS UTILITAIRES ==========

  /**
   * Configure le header CSRF pour les requêtes API
   */
  const setCsrfHeader = () => {
    const xsrfToken = Cookies.get("XSRF-TOKEN");
    if (xsrfToken) {
      apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    } else {
      console.warn("Cookie XSRF-TOKEN non trouvé pour la sauvegarde.");
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // ========== GESTION DES TÉLÉPHONES ET EMAILS ==========

  /**
   * Ajoute un champ téléphone vide
   */
  const addPhone = () => {
    form.phone_numbers.push("");
  };

  /**
   * Supprime un champ téléphone à l'index donné
   * @param {number} index - Index du téléphone à supprimer
   */
  const removePhone = (index) => {
    if (form.phone_numbers.length > 1) {
      form.phone_numbers.splice(index, 1);
    }
  };

  /**
   * Ajoute un champ email vide
   */
  const addEmail = () => {
    form.emails.push("");
  };

  /**
   * Supprime un champ email à l'index donné
   * @param {number} index - Index de l'email à supprimer
   */
  const removeEmail = (index) => {
    if (form.emails.length > 1) {
      form.emails.splice(index, 1);
    }
  };

  // ========== CHARGEMENT DES DONNÉES ==========

  /**
   * Charge les données de la commande sélectionnée dans le formulaire
   */
  const loadOrderData = async (orderId) => {
    if (!orderId || !user.value) return;

    console.log("useCardSettings: Loading order data for orderId:", orderId);

    // Activer l'indicateur de chargement
    isLoadingOrderData.value = true;

    try {
      // Charger les données complètes de la commande depuis l'API
      const response = await apiClient.get(`/api/orders/${orderId}`);
      const selectedOrder = response.data;
      
      // Stocker les données chargées pour y accéder depuis SettingsView
      loadedOrderData.value = selectedOrder;
      
      const currentUser = user.value;

      // Pour les employés ou les business admins inclus dans une commande entreprise,
      // utiliser employee_profile si disponible
      const isBusinessAdminInOrder = 
        currentUser.role === "business_admin" && 
        selectedOrder.order_type === "business" &&
        (selectedOrder.employee_card_quantity !== undefined || selectedOrder.employee_profile);
      
      const profileData =
        ((currentUser.role === "employee" || isBusinessAdminInOrder) && selectedOrder.employee_profile)
          ? selectedOrder.employee_profile
          : selectedOrder;

      const isOrderConfigured =
        (currentUser.role === "employee" || isBusinessAdminInOrder)
          ? selectedOrder.employee_profile && selectedOrder.employee_profile.profile_name
          : selectedOrder.is_configured;

      console.log("useCardSettings: Loading order data", {
        orderId: selectedOrder.id,
        isBusinessAdminInOrder,
        hasEmployeeProfile: !!selectedOrder.employee_profile,
        isOrderConfigured,
        is_design_locked_by_admin: selectedOrder.employee_profile?.is_design_locked_by_admin,
        employeeProfile: selectedOrder.employee_profile,
        profileData: profileData ? {
          profile_name: profileData.profile_name,
          card_design_type: profileData.card_design_type,
          card_design_number: profileData.card_design_number,
          no_design_yet: profileData.no_design_yet,
          is_design_locked_by_admin: profileData.is_design_locked_by_admin,
        } : null,
      });

      // Charger les données de profil
      if (isOrderConfigured) {
        console.log("useCardSettings: Loading configured order data...");
        form.name = profileData.profile_name || currentUser.name || "";
        form.title = profileData.profile_title || "";
        form.profile_border_color = profileData.profile_border_color || "#facc15";
        form.save_contact_button_color = profileData.save_contact_button_color || "#ca8a04";
        form.services_button_color = profileData.services_button_color || "#0ea5e9";

        // Charger tous les autres champs de profil
        if (profileData.phone_numbers && Array.isArray(profileData.phone_numbers)) {
          form.phone_numbers = profileData.phone_numbers.filter((item) => item !== null && item !== "");
        }
        if (profileData.emails && Array.isArray(profileData.emails)) {
          form.emails = profileData.emails.filter((item) => item !== null && item !== "");
        }
        form.birth_day = profileData.birth_day || null;
        form.birth_month = profileData.birth_month || null;
        form.website_url = profileData.website_url || "";
        form.address_neighborhood = profileData.address_neighborhood || "";
        form.address_commune = profileData.address_commune || "";
        form.address_city = profileData.address_city || "";
        form.address_country = profileData.address_country || "";
        form.whatsapp_url = profileData.whatsapp_url || "";
        form.linkedin_url = profileData.linkedin_url || "";
        form.facebook_url = profileData.facebook_url || "";
        form.twitter_url = profileData.twitter_url || "";
        form.youtube_url = profileData.youtube_url || "";
        form.deezer_url = profileData.deezer_url || "";
        form.spotify_url = profileData.spotify_url || "";

        // Charger les données de design
        form.card_design_type = profileData.card_design_type || null;
        form.card_design_number = profileData.card_design_number || null;
        form.card_design_custom_url = profileData.card_design_custom_url || null;
        form.no_design_yet = profileData.no_design_yet || false;

        console.log("useCardSettings: Design data loaded", {
          card_design_type: form.card_design_type,
          card_design_number: form.card_design_number,
          card_design_custom_url: form.card_design_custom_url,
          no_design_yet: form.no_design_yet,
        });

        // Mettre à jour les refs pour l'affichage via le callback
        if (onDesignStateUpdate) {
          onDesignStateUpdate({
            selectedDesignType: form.card_design_type,
            selectedDesignNumber: form.card_design_number,
            noDesignYet: form.no_design_yet,
          });
          console.log("useCardSettings: onDesignStateUpdate called with", {
            selectedDesignType: form.card_design_type,
            selectedDesignNumber: form.card_design_number,
            noDesignYet: form.no_design_yet,
          });
        }

        // Si un design personnalisé existe, charger l'aperçu
        if (form.card_design_custom_url && onCustomDesignPreviewUpdate && getAvatarUrl) {
          onCustomDesignPreviewUpdate(getAvatarUrl(form.card_design_custom_url));
        }
      } else {
        // Pour le business admin inclus, même si la commande n'est pas encore configurée,
        // on doit quand même charger les données de design depuis employee_profile si elles existent
        const hasDesignData = (isBusinessAdminInOrder && selectedOrder.employee_profile) 
          ? (selectedOrder.employee_profile.card_design_type || selectedOrder.employee_profile.no_design_yet !== undefined)
          : false;

        console.log("useCardSettings: Loading user data for unconfigured order...", { hasDesignData });

        form.name = currentUser.name || "";
        form.title = "";
        form.profile_border_color = "#facc15";
        form.save_contact_button_color = "#ca8a04";
        form.services_button_color = "#0ea5e9";

        // Charger les données du user pour le reste des champs
        if (Array.isArray(currentUser.phone_numbers) && currentUser.phone_numbers.length > 0) {
          form.phone_numbers = currentUser.phone_numbers.filter((item) => item !== null && item !== "");
        } else {
          form.phone_numbers = [""];
        }
        if (Array.isArray(currentUser.emails) && currentUser.emails.length > 0) {
          form.emails = currentUser.emails.filter((item) => item !== null && item !== "");
        } else {
          form.emails = [currentUser.email || ""];
        }
        form.birth_day = currentUser.birth_day || null;
        form.birth_month = currentUser.birth_month || null;
        form.website_url = currentUser.website_url || "";
        form.address_neighborhood = currentUser.address_neighborhood || "";
        form.address_commune = currentUser.address_commune || "";
        form.address_city = currentUser.address_city || "";
        form.address_country = currentUser.address_country || "";
        form.whatsapp_url = currentUser.whatsapp_url || "";
        form.linkedin_url = currentUser.linkedin_url || "";
        form.facebook_url = currentUser.facebook_url || "";
        form.twitter_url = currentUser.twitter_url || "";
        form.youtube_url = currentUser.youtube_url || "";
        form.deezer_url = currentUser.deezer_url || "";
        form.spotify_url = currentUser.spotify_url || "";

        // Pour le business admin inclus, charger les données de design depuis employee_profile si disponibles
        if (hasDesignData && selectedOrder.employee_profile) {
          form.card_design_type = selectedOrder.employee_profile.card_design_type || null;
          form.card_design_number = selectedOrder.employee_profile.card_design_number || null;
          form.card_design_custom_url = selectedOrder.employee_profile.card_design_custom_url || null;
          form.no_design_yet = selectedOrder.employee_profile.no_design_yet || false;
          
          console.log("useCardSettings: Design data loaded from employee_profile for unconfigured order", {
            card_design_type: form.card_design_type,
            card_design_number: form.card_design_number,
            card_design_custom_url: form.card_design_custom_url,
            no_design_yet: form.no_design_yet,
          });

          // Mettre à jour les refs pour l'affichage via le callback
          if (onDesignStateUpdate) {
            onDesignStateUpdate({
              selectedDesignType: form.card_design_type,
              selectedDesignNumber: form.card_design_number,
              noDesignYet: form.no_design_yet,
            });
            console.log("useCardSettings: onDesignStateUpdate called with design data", {
              selectedDesignType: form.card_design_type,
              selectedDesignNumber: form.card_design_number,
              noDesignYet: form.no_design_yet,
            });
          }

          // Si un design personnalisé existe, charger l'aperçu
          if (form.card_design_custom_url && onCustomDesignPreviewUpdate && getAvatarUrl) {
            onCustomDesignPreviewUpdate(getAvatarUrl(form.card_design_custom_url));
          }
        } else {
          // Réinitialiser les données de design pour une nouvelle commande
          form.card_design_type = null;
          form.card_design_number = null;
          form.card_design_custom_url = null;
          form.no_design_yet = false;

          if (onDesignStateUpdate) {
            onDesignStateUpdate({
              selectedDesignType: null,
              selectedDesignNumber: null,
              noDesignYet: false,
            });
          }
        }
      }

      // S'assurer qu'il y a au moins un champ vide pour téléphones et emails
      if (!form.phone_numbers.length) form.phone_numbers = [""];
      if (!form.emails.length) form.emails = [currentUser.email || ""];

      // Charger l'avatar de la commande
      const backendUrl = import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";
      let avatarUrl = null;

      // Pour les employés ou les business admins inclus, utiliser employee_avatar_url en priorité
      let orderAvatarUrl = null;
      if ((currentUser.role === "employee" || isBusinessAdminInOrder) && selectedOrder.employee_profile) {
        orderAvatarUrl = profileData.employee_avatar_url || null;
        avatarUrl = orderAvatarUrl || currentUser.avatar_url;
      } else {
        // Pour les autres, utiliser order_avatar_url en priorité, sinon avatar_url de l'utilisateur
        orderAvatarUrl = selectedOrder.order_avatar_url || null;
        avatarUrl = orderAvatarUrl || currentUser.avatar_url;
      }

      // Construire l'URL complète si nécessaire
      if (avatarUrl && onAvatarPreviewUpdate) {
        let constructedUrl;
        // ✅ CORRECTION : Gérer les deux formats (/storage/ et /api/storage/)
        // Si c'est un chemin relatif (commence par /api/storage/ ou /storage/), ajouter le backend URL
        if (avatarUrl.startsWith("/api/storage/") || avatarUrl.startsWith("/storage/")) {
          constructedUrl = backendUrl + avatarUrl;
        }
        // Si c'est déjà une URL complète (http:// ou https://), l'utiliser directement
        else if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
          constructedUrl = avatarUrl;
        }
        // Sinon, c'est probablement un chemin relatif, ajouter le backend URL
        else {
          constructedUrl = backendUrl + "/" + avatarUrl.replace(/^\//, "");
        }

        // ✅ CORRECTION : Toujours utiliser directement l'URL construite
        // Le préchargement avec Image() peut causer des problèmes de timing et de CORS
        // Mieux vaut laisser le navigateur gérer le chargement de l'image directement
        // Si l'image ne se charge pas, l'événement @error dans le composant gérera l'affichage
        onAvatarPreviewUpdate(constructedUrl + "?t=" + new Date().getTime());
      } else if (onAvatarPreviewUpdate) {
        onAvatarPreviewUpdate(null);
      }

      // Log pour debug
      console.log("Avatar chargé pour la commande:", {
        orderId: selectedOrder.id,
        orderAvatarUrl: selectedOrder.order_avatar_url,
        userAvatarUrl: currentUser.avatar_url,
        finalAvatarUrl: avatarUrl,
      });
    } catch (error) {
      console.error("Error loading order data:", error);
      throw error;
    } finally {
      // Désactiver l'indicateur de chargement
      isLoadingOrderData.value = false;
      if (onDataLoadedCallback) {
        onDataLoadedCallback();
      }
    }
  };

  // Watcher pour charger automatiquement les données quand selectedOrderId change
  watch(
    selectedOrderId,
    async (newOrderId, oldOrderId) => {
      if (!newOrderId) return;
      console.log("useCardSettings: selectedOrderId changed from", oldOrderId, "to", newOrderId);
      try {
        await loadOrderData(newOrderId);
      } catch (error) {
        console.error("useCardSettings: Error in watch handler:", error);
      }
    },
    { immediate: false }, // Ne pas charger immédiatement, onMounted s'en chargera
  );

  // ========== SAUVEGARDE ==========

  /**
   * Sauvegarde les paramètres de la carte
   * @param {Function} onNoDesignYet - Callback pour obtenir la valeur de noDesignYet (si nécessaire)
   * @param {String} selectedDesignType - Type de design sélectionné (template/custom)
   * @param {Number} selectedDesignNumber - Numéro du design template sélectionné
   */
  const handleSaveSettings = async (onNoDesignYet = null, selectedDesignType = null, selectedDesignNumber = null) => {
    saveSuccess.value = "";
    saveError.value = "";
    savingMessage.value = "Enregistrement en cours...";
    showSuccessIcon.value = false;

    isSaving.value = true;
    setCsrfHeader();

    try {
      // Nettoyer les tableaux (supprimer les entrées vides)
      const cleanedPhones = form.phone_numbers.filter((phone) => phone && phone.trim());
      const cleanedEmails = form.emails.filter((email) => email && email.trim());

      // Si une commande est sélectionnée, sauvegarder UNIQUEMENT dans la commande
      // SANS modifier le profil utilisateur général
      if (selectedOrderId.value) {
        try {
          // Obtenir la valeur de noDesignYet depuis le callback si fourni, sinon utiliser form
          const noDesignYetValue = onNoDesignYet ? onNoDesignYet() : form.no_design_yet;

          // Construire le payload avec seulement les champs définis
          const payload = {
            profile_name: form.name,
            profile_title: form.title,
            profile_border_color: form.profile_border_color,
            save_contact_button_color: form.save_contact_button_color,
            services_button_color: form.services_button_color,
            phone_numbers: cleanedPhones.length ? cleanedPhones : null,
            emails: cleanedEmails.length ? cleanedEmails : null,
            birth_day: form.birth_day,
            birth_month: form.birth_month,
            website_url: form.website_url,
            address_neighborhood: form.address_neighborhood,
            address_commune: form.address_commune,
            address_city: form.address_city,
            address_country: form.address_country,
            whatsapp_url: form.whatsapp_url,
            linkedin_url: form.linkedin_url,
            facebook_url: form.facebook_url,
            twitter_url: form.twitter_url,
            youtube_url: form.youtube_url,
            deezer_url: form.deezer_url,
            spotify_url: form.spotify_url,
          };

          // Ajouter les champs de design de la carte
          // NOTE: Assurez-vous que la migration 2025_11_04_215742_add_card_design_fields_to_orders_table.php
          // a été exécutée pour que ces colonnes existent dans la base de données.
          // Si "Je n'ai pas encore mon design" est coché, on envoie seulement no_design_yet
          if (noDesignYetValue) {
            payload.no_design_yet = true;
            // Si no_design_yet est true, on ne doit pas envoyer les autres champs de design
            payload.card_design_type = null;
            payload.card_design_number = null;
            payload.card_design_custom_url = null;
          } else {
            // Si un design est sélectionné, envoyer les informations du design
            // Utiliser d'abord les paramètres passés (selectedDesignType, selectedDesignNumber),
            // puis form.card_design_type et form.card_design_number comme fallback
            payload.no_design_yet = false;
            
            // Prioriser les paramètres passés, sinon utiliser form
            const designType = selectedDesignType || form.card_design_type || null;
            const designNumber = selectedDesignNumber !== null ? selectedDesignNumber : (form.card_design_number || null);
            const customDesignUrl = form.card_design_custom_url || null;
            
            console.log("useCardSettings: Saving design data", {
              selectedDesignType,
              selectedDesignNumber,
              form_card_design_type: form.card_design_type,
              form_card_design_number: form.card_design_number,
              final_design_type: designType,
              final_design_number: designNumber,
              card_design_custom_url: customDesignUrl,
              no_design_yet: false,
            });
            
            if (designType) {
              payload.card_design_type = designType;
              if (designType === "template" && designNumber) {
                payload.card_design_number = designNumber;
                payload.card_design_custom_url = null;
              } else if (designType === "custom" && customDesignUrl) {
                payload.card_design_number = null;
                payload.card_design_custom_url = customDesignUrl;
              } else {
                payload.card_design_number = null;
                payload.card_design_custom_url = null;
              }
            } else {
              // Aucun design sélectionné
              payload.card_design_type = null;
              payload.card_design_number = null;
              payload.card_design_custom_url = null;
            }
          }

          // Sauvegarder TOUTES les données de profil dans la commande (ou order_employee pour les employés)
          // Le backend appliquera automatiquement le design du business admin aux employés si nécessaire
          const saveResponse = await apiClient.patch(`/api/orders/${selectedOrderId.value}/profile`, payload);
          console.log("useCardSettings: Profile saved, response:", saveResponse.data);

          // Marquer la commande comme configurée
          await apiClient.patch(`/api/orders/${selectedOrderId.value}/configure`);
          console.log(`Commande ${selectedOrderId.value} marquée comme configurée.`);
          
          // Recharger les données de la commande pour s'assurer que tout est synchronisé
          // Cela garantit que les données retournées par le backend sont bien chargées
          try {
            await loadOrderData(selectedOrderId.value);
            console.log("useCardSettings: Order data reloaded after save");
          } catch (reloadError) {
            console.error("useCardSettings: Error reloading order data after save", reloadError);
            // Ne pas bloquer la sauvegarde si le rechargement échoue
          }
        } catch (error) {
          console.error("Erreur lors du marquage de la commande comme configurée:", error);
          throw error; // Propager l'erreur pour l'afficher
        }
      } else {
        // Aucune commande sélectionnée : Ne devrait pas arriver normalement
        // mais on pourrait sauvegarder dans le profil utilisateur si nécessaire
        const payload = {
          // NE PAS inclure name, title et username ici pour éviter de modifier le nom général
          profile_border_color: form.profile_border_color,
          save_contact_button_color: form.save_contact_button_color,
          services_button_color: form.services_button_color,
          phone_numbers: cleanedPhones.length ? cleanedPhones : null,
          emails: cleanedEmails.length ? cleanedEmails : null,
          birth_day: form.birth_day,
          birth_month: form.birth_month,
          website_url: form.website_url,
          address_neighborhood: form.address_neighborhood,
          address_commune: form.address_commune,
          address_city: form.address_city,
          address_country: form.address_country,
          whatsapp_url: form.whatsapp_url,
          linkedin_url: form.linkedin_url,
          facebook_url: form.facebook_url,
          twitter_url: form.twitter_url,
          youtube_url: form.youtube_url,
          deezer_url: form.deezer_url,
          spotify_url: form.spotify_url,
        };

        const response = await apiClient.put("/api/profile", payload);

        if (updateUserLocally) {
          updateUserLocally(response.data);
        }
      }

      saveSuccess.value = "Vos modifications ont été enregistrées !";

      // Afficher l'icône de succès et le message
      savingMessage.value = "✓ Enregistré avec succès !";
      showSuccessIcon.value = true;

      // Les données du formulaire restent intactes, pas besoin de les recharger
      // Elles seront automatiquement rechargées par le watcher quand l'utilisateur reviendra

      // Rediriger vers le Dashboard après 1.5 secondes (pour que l'utilisateur voie le message de succès)
      setTimeout(() => {
        isSaving.value = false;
        router.push({ name: "Dashboard" });
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error.response?.data || error);
      if (error.response?.status === 422 && error.response.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorField = Object.keys(errors)[0];
        saveError.value = errors[firstErrorField][0];
      } else {
        saveError.value = error.response?.data?.message || "Erreur sauvegarde.";
      }
      setTimeout(() => (saveError.value = ""), 6000);
      isSaving.value = false; // Désactiver immédiatement en cas d'erreur
    } finally {
      delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
    }
  };

  // ========== RETOUR ==========

  return {
    // État du formulaire
    form,

    // État de sauvegarde
    isSaving,
    saveSuccess,
    saveError,
    savingMessage,
    showSuccessIcon,

    // État de chargement
    isLoadingOrderData,
    loadedOrderData,

    // Fonctions de gestion du formulaire
    addPhone,
    removePhone,
    addEmail,
    removeEmail,

    // Fonction de sauvegarde
    handleSaveSettings,

    // Fonction de chargement (pour utilisation manuelle si nécessaire)
    loadOrderData,
  };
}
