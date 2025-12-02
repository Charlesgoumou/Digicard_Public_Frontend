<template>
  <div class="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="mb-8">
        <svg
          class="w-24 h-24 mx-auto text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-white mb-4">Paiement terminé</h1>
      <p class="text-lg text-slate-300 mb-8">
        Vous pouvez fermer cet onglet et retourner sur l'application Digicard.
      </p>
      <p class="text-sm text-slate-400">
        Cet onglet se fermera automatiquement dans quelques secondes...
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/api";

const route = useRoute();

onMounted(async () => {
  // Récupérer l'ID de commande depuis l'URL
  const orderId = route.query.order_id;
  const additionalPaymentId = route.query.additional_payment_id;

  console.log('[PaymentClose] Page chargée', {
    orderId,
    additionalPaymentId,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    fullQuery: route.query,
    fullUrl: window.location.href,
  });

  // ✅ NOUVEAU: En mode développement, simuler le webhook avant de fermer l'onglet
  if (import.meta.env.DEV && orderId) {
    try {
      console.log('[PaymentClose] Mode développement détecté, simulation du webhook...', { orderId, additionalPaymentId });
      
      // ✅ Appeler la route spécifique pour simuler le webhook
      // Si c'est un paiement supplémentaire, passer l'ID dans le body
      const payload = additionalPaymentId ? { additional_payment_id: additionalPaymentId } : {};
      console.log('[PaymentClose] Appel de l\'API...', {
        url: `/api/payment/simulate-webhook/${orderId}`,
        payload,
      });
      
      const response = await apiClient.post(`/api/payment/simulate-webhook/${orderId}`, payload);
      
      console.log('[PaymentClose] Réponse reçue:', response.data);
      
      if (response.data.success) {
        console.log('[PaymentClose] ✅ Simulation Webhook envoyée avec succès:', response.data);
        if (additionalPaymentId) {
          console.log('[PaymentClose] Paiement supplémentaire validé - Le polling de l\'onglet principal devrait détecter le changement');
        } else {
          console.log('[PaymentClose] Commande validée - Le polling de l\'onglet principal devrait détecter le changement');
        }
      } else {
        console.warn('[PaymentClose] Simulation webhook retournée mais success=false:', response.data);
      }
    } catch (error) {
      console.error('[PaymentClose] ❌ Erreur lors de la simulation du webhook:', {
        error,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
      });
      // Ne pas bloquer la fermeture de l'onglet même en cas d'erreur
    }
  } else {
    if (!import.meta.env.DEV) {
      console.log('[PaymentClose] Mode production détecté, pas de simulation de webhook');
    }
    if (!orderId) {
      console.warn('[PaymentClose] Mode développement détecté mais order_id manquant dans l\'URL', {
        query: route.query,
        fullUrl: window.location.href,
      });
    }
  }

  // Essayer de fermer l'onglet automatiquement après 5 secondes (augmenté pour laisser le temps au webhook)
  setTimeout(() => {
    try {
      console.log('[PaymentClose] Tentative de fermeture de l\'onglet...');
      window.close();
    } catch (error) {
      // Si window.close() échoue (certains navigateurs le bloquent), on ne fait rien
      console.log("[PaymentClose] Impossible de fermer l'onglet automatiquement", error);
    }
  }, 5000);
});
</script>

