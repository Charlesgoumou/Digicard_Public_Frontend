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

  // ✅ NOUVEAU: En mode développement, simuler le webhook avant de fermer l'onglet
  if (import.meta.env.DEV && orderId) {
    try {
      console.log('[PaymentClose] Mode développement détecté, simulation du webhook...', { orderId, additionalPaymentId });
      
      // ✅ Appeler la route spécifique pour simuler le webhook
      const response = await apiClient.post(`/api/payment/simulate-webhook/${orderId}`);
      
      if (response.data.success) {
        console.log('[PaymentClose] ✅ Simulation Webhook envoyée avec succès:', response.data);
        console.log('[PaymentClose] Commande validée - Le polling de l\'onglet principal devrait détecter le changement');
      } else {
        console.warn('[PaymentClose] Simulation webhook retournée mais success=false:', response.data);
      }
    } catch (error) {
      console.error('[PaymentClose] ❌ Erreur lors de la simulation du webhook:', error);
      // Ne pas bloquer la fermeture de l'onglet même en cas d'erreur
    }
  } else if (import.meta.env.DEV && !orderId) {
    console.warn('[PaymentClose] Mode développement détecté mais order_id manquant dans l\'URL');
  }

  // Essayer de fermer l'onglet automatiquement après 3 secondes
  setTimeout(() => {
    try {
      window.close();
    } catch (error) {
      // Si window.close() échoue (certains navigateurs le bloquent), on ne fait rien
      console.log("[PaymentClose] Impossible de fermer l'onglet automatiquement");
    }
  }, 3000);
});
</script>

