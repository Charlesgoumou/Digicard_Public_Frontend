<template>
  <!-- ✅ MASQUÉ: Cette page ne doit pas s'afficher, redirection immédiate -->
  <div style="display: none;"></div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api";
import { useAuth } from "@/composables/useAuth";
import Cookies from "js-cookie";

const route = useRoute();
const router = useRouter();
// ✅ CRITIQUE: Récupérer toutes les fonctions nécessaires de useAuth en une seule fois
const { fetchUser, updateUserLocally, user } = useAuth();

// ✅ CRITIQUE: Fonction pour mettre à jour le header CSRF
const setCsrfHeader = () => {
  const xsrfToken = Cookies.get("XSRF-TOKEN");
  if (xsrfToken) {
    apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    console.log("PaymentProcessingView: Header CSRF mis à jour");
  } else {
    console.warn("PaymentProcessingView: Cookie XSRF-TOKEN non trouvé.");
    delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
  }
};

// ✅ CRITIQUE: Exécuter AVANT le montage du composant pour éviter l'affichage de la page
onBeforeMount(async () => {
  try {
    console.log("PaymentProcessingView: Début du traitement du paiement...");
    console.log("PaymentProcessingView: URL complète:", window.location.href);
    console.log("PaymentProcessingView: Query params:", route.query);
    
    // Récupérer le session_token de l'URL
    const sessionToken = route.query.session_token;
    const orderId = route.query.order_id;
    const additionalPaymentId = route.query.additional_payment_id;
    
    if (!sessionToken) {
      console.error("PaymentProcessingView: Aucun token de session trouvé dans l'URL");
      console.error("PaymentProcessingView: Query params disponibles:", Object.keys(route.query));
      // Rediriger vers /login si pas de token
      router.replace({ name: 'Home' });
      return;
    }
    
    console.log("PaymentProcessingView: Token de session trouvé, échange contre une session...");
    console.log("PaymentProcessingView: Cookies avant échange:", document.cookie);
    
    try {
      // ✅ CRITIQUE: Récupérer d'abord le cookie CSRF pour établir la session Laravel
      // Cela est nécessaire avant d'appeler exchange-token pour que la session soit correctement initialisée
      try {
        console.log("PaymentProcessingView: Récupération du cookie CSRF...");
        await apiClient.get("/sanctum/csrf-cookie");
        // ✅ RÉDUIT: Attendre un minimum pour que le cookie CSRF soit bien défini dans le navigateur
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // ✅ CRITIQUE: Mettre à jour le header CSRF APRÈS avoir récupéré le cookie
        setCsrfHeader();
      } catch (csrfError) {
        console.warn("PaymentProcessingView: Erreur CSRF (peut être ignorée)", csrfError);
      }
      
      // ✅ CRITIQUE: Vérifier une dernière fois que le header CSRF est bien défini
      // Axios devrait le faire automatiquement, mais on s'assure qu'il est présent
      const csrfToken = Cookies.get("XSRF-TOKEN");
      if (csrfToken) {
        apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
        console.log("PaymentProcessingView: Header CSRF vérifié et mis à jour avant la requête");
      } else {
        console.error("PaymentProcessingView: ERREUR - Cookie XSRF-TOKEN non trouvé avant l'appel API!");
      }
      
      // ✅ CRITIQUE: Appeler l'API d'échange de token
      // Le middleware 'web' et 'EnsureFrontendRequestsAreStateful' vont établir la session
      // et le cookie de session sera créé lors de cet appel API
      console.log("PaymentProcessingView: Appel de /api/auth/exchange-token avec token:", sessionToken.substring(0, 10) + '...');
      console.log("PaymentProcessingView: Cookies avant échange:", document.cookie);
      console.log("PaymentProcessingView: Headers de la requête:", {
        'X-XSRF-TOKEN': apiClient.defaults.headers.common["X-XSRF-TOKEN"] ? "Présent (" + apiClient.defaults.headers.common["X-XSRF-TOKEN"].substring(0, 20) + "...)" : "Absent",
        'withCredentials': apiClient.defaults.withCredentials
      });
      
      const exchangeResponse = await apiClient.post('/api/auth/exchange-token', {
        session_token: sessionToken
      }, {
        // ✅ CRITIQUE: S'assurer que les headers sont bien envoyés
        headers: {
          'X-XSRF-TOKEN': apiClient.defaults.headers.common["X-XSRF-TOKEN"] || decodeURIComponent(Cookies.get("XSRF-TOKEN") || '')
        }
      });
      
      console.log("PaymentProcessingView: Token échangé avec succès", exchangeResponse.data);
      console.log("PaymentProcessingView: Cookies après échange:", document.cookie);
      
      // ✅ CRITIQUE: Utiliser directement les données utilisateur retournées par exchange-token
      // au lieu de refaire un fetchUser() qui peut échouer
      if (exchangeResponse.data.user && updateUserLocally) {
        console.log("PaymentProcessingView: Mise à jour de l'utilisateur localement avec les données de l'échange");
        updateUserLocally(exchangeResponse.data.user);
      }
      
      // ✅ CRITIQUE: Rediriger IMMÉDIATEMENT vers Orders après l'échange de token réussi
      // L'utilisateur est maintenant connecté, on peut rediriger sans attendre
      // La vérification de l'état de la commande sera faite dans OrdersView
      const redirectParams = {
        payment: 'success'
      };
      
      if (orderId) {
        redirectParams.order_id = orderId;
      }
      
      if (additionalPaymentId) {
        redirectParams.additional_payment_id = additionalPaymentId;
      }
      
      console.log("PaymentProcessingView: Redirection immédiate vers Orders avec params", redirectParams);
      
      // ✅ CRITIQUE: Utiliser replace au lieu de push pour éviter que l'utilisateur puisse revenir à cette page
      router.replace({ 
        name: 'Orders', 
        query: redirectParams 
      });
      
      // ✅ OPTIONNEL: Vérifier l'état de la commande/paiement en arrière-plan (ne bloque pas la redirection)
      // Cela déclenche la validation automatique en local si nécessaire
      if (additionalPaymentId) {
        // Pour les paiements supplémentaires, vérifier le statut pour déclencher la validation automatique
        setTimeout(async () => {
          try {
            console.log("PaymentProcessingView: Vérification de l'état du paiement supplémentaire en arrière-plan...");
            const checkResponse = await apiClient.get(`/api/additional-payments/${additionalPaymentId}/check-status-public`);
            console.log("PaymentProcessingView: État du paiement supplémentaire vérifié", checkResponse.data);
          } catch (checkError) {
            console.warn("PaymentProcessingView: Erreur lors de la vérification de l'état du paiement supplémentaire", checkError);
          }
        }, 100);
      } else if (orderId) {
        // Pour les paiements normaux, vérifier l'état de la commande
        setTimeout(async () => {
          try {
            console.log("PaymentProcessingView: Vérification de l'état de la commande en arrière-plan...");
            const checkStatusResponse = await apiClient.get(`/api/orders/${orderId}/check-payment`);
            console.log("PaymentProcessingView: État de la commande vérifié", checkStatusResponse.data);
          } catch (checkError) {
            console.warn("PaymentProcessingView: Erreur lors de la vérification de l'état de la commande", checkError);
          }
        }, 100);
      }
    } catch (exchangeError) {
      console.error("PaymentProcessingView: Erreur lors de l'échange de token", exchangeError);
      console.error("PaymentProcessingView: Détails de l'erreur:", {
        message: exchangeError.message,
        response: exchangeError.response?.data,
        status: exchangeError.response?.status,
        statusText: exchangeError.response?.statusText
      });
      
      // ✅ CRITIQUE: Si c'est une erreur 401/419, ne pas rediriger immédiatement
      // L'intercepteur axios ne devrait pas rediriger pour /api/auth/exchange-token
      // mais on vérifie quand même
      if (exchangeError.response && (exchangeError.response.status === 401 || exchangeError.response.status === 419)) {
        console.warn("PaymentProcessingView: Erreur 401/419 lors de l'échange de token, réessai...");
        
        // ✅ CRITIQUE: Si c'est une erreur CSRF (419), récupérer à nouveau le cookie CSRF
        if (exchangeError.response.status === 419) {
          console.log("PaymentProcessingView: Erreur CSRF détectée, récupération d'un nouveau cookie CSRF...");
          try {
            await apiClient.get("/sanctum/csrf-cookie");
            await new Promise(resolve => setTimeout(resolve, 100));
            setCsrfHeader(); // Mettre à jour le header avec le nouveau token
            console.log("PaymentProcessingView: Nouveau cookie CSRF récupéré et header mis à jour");
          } catch (csrfRetryError) {
            console.error("PaymentProcessingView: Erreur lors de la récupération du cookie CSRF pour le réessai", csrfRetryError);
          }
        }
        
        // ✅ RÉDUIT: Réessayer rapidement après un court délai
        await new Promise(resolve => setTimeout(resolve, 200));
        try {
          console.log("PaymentProcessingView: Réessai de l'échange de token...");
          const retryResponse = await apiClient.post('/api/auth/exchange-token', {
            session_token: sessionToken
          });
          console.log("PaymentProcessingView: Réessai réussi", retryResponse.data);
          if (retryResponse.data.user && updateUserLocally) {
            updateUserLocally(retryResponse.data.user);
          }
          // Continuer avec la redirection vers Orders
          const redirectParams = { payment: 'success' };
          if (orderId) redirectParams.order_id = orderId;
          if (additionalPaymentId) redirectParams.additional_payment_id = additionalPaymentId;
          router.replace({ name: 'Orders', query: redirectParams });
          return;
        } catch (retryError) {
          console.error("PaymentProcessingView: Échec du réessai", retryError);
          if (retryError.response && retryError.response.status === 419) {
            console.error("PaymentProcessingView: Erreur CSRF persistante. Vérifiez que le cookie XSRF-TOKEN est bien défini.");
          }
        }
      }
      
      // Échec définitif (Token invalide ou expiré) - Rediriger vers Home
      router.push({ name: 'Home' });
    }
  } catch (error) {
    console.error("PaymentProcessingView: Erreur générale", error);
    // Rediriger vers Home en cas d'erreur
    router.push({ name: 'Home' });
  }
});
</script>

