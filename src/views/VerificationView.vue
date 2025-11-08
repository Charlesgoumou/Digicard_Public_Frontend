<template>
  <div class="min-h-screen bg-slate-900 pt-20 sm:pt-32 text-white flex items-center justify-center px-4">
    <div class="relative max-w-md w-full p-8 bg-slate-800 rounded-xl border border-slate-700 text-center">
      <!-- Indicateur de chargement circulaire (overlay) -->
      <div
        v-if="isSubmitting || isResending"
        class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        <p class="mt-4 text-white font-medium">{{ loadingMessage }}</p>
      </div>

      <h1 class="text-3xl font-bold mb-2">Vérifiez votre email</h1>
      <p class="text-slate-400 mb-6">
        Un code à 6 chiffres a été envoyé à <br /><strong>{{ emailForDisplay }}</strong>
      </p>

      <div class="flex justify-center space-x-2 mb-6">
        <input
          v-for="(n, index) in 6"
          :key="index"
          :ref="
            (el) => {
              if (el) codeInput[index] = el;
            }
          "
          v-model="code[index]"
          @input="handleInput(index, $event)"
          @keydown="handleKeydown(index, $event)"
          @paste="handlePaste"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          :id="`code-input-${index}`"
          class="w-12 h-14 text-center text-2xl font-bold bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors disabled:opacity-50"
          :aria-label="`Chiffre ${index + 1} du code`"
          :disabled="isSubmitting || isResending"
        />
      </div>

      <p v-if="feedbackMessage" :class="isError ? 'text-red-400' : 'text-green-400'" class="text-sm mb-4 h-5">
        {{ feedbackMessage }}
      </p>

      <button
        @click="handleSubmit"
        :disabled="isSubmitting || isResending"
        class="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? "Vérification..." : "Vérifier le code" }}
      </button>

      <div class="mt-4">
        <button
          @click="handleResend"
          :disabled="isResending || !canResend"
          class="text-sm text-sky-400 hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ resendButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, nextTick, onUnmounted } from "vue";
  import { useAuth } from "@/composables/useAuth";
  import { useRouter, useRoute } from "vue-router";
  import apiClient from "@/api";

  const { verifyCode, resendVerificationCode } = useAuth();
  const router = useRouter();
  const route = useRoute();

  const email = ref(route.query.email || ""); // Récupère l'email depuis l'URL
  const accountType = ref(route.query.account_type || ""); // Récupère le type de compte depuis l'URL
  const code = ref(Array(6).fill("")); // Tableau pour stocker les 6 chiffres
  const codeInput = ref([]); // Références aux éléments input
  const feedbackMessage = ref(""); // Message pour l'utilisateur
  const isError = ref(false); // Pour la couleur du message
  const isSubmitting = ref(false); // État lors de la vérification
  const isResending = ref(false); // État lors du renvoi
  const loadingMessage = ref(""); // Message affiché pendant le chargement

  // Logique du cooldown pour le bouton "Renvoyer"
  const canResend = ref(true);
  const cooldownTimer = ref(0);
  let cooldownInterval = null;

  // Propriété calculée pour afficher l'email (ou un texte par défaut)
  const emailForDisplay = computed(() => email.value || "votre adresse email");

  // Propriété calculée pour le texte du bouton "Renvoyer"
  const resendButtonText = computed(() => {
    if (isResending.value) return "Envoi en cours...";
    if (!canResend.value) return `Renvoyer (${cooldownTimer.value}s)`; // Affiche le timer
    return "Renvoyer le code";
  });

  // Met le focus sur le premier input au chargement et initialise le cookie CSRF
  onMounted(async () => {
    // Initialiser le cookie CSRF pour les requêtes suivantes
    try {
      await apiClient.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error("Erreur lors de l'initialisation du cookie CSRF:", error);
    }
    codeInput.value[0]?.focus();
  });

  // Nettoie l'intervalle du timer quand le composant est détruit
  onUnmounted(() => {
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
    }
  });

  // Gère la saisie dans un input : passe au suivant
  const handleInput = (index, event) => {
    const value = event.target.value;
    // N'autorise que les chiffres (vide la case si autre chose)
    if (!/^\d*$/.test(value)) {
      code.value[index] = "";
      return;
    }
    code.value[index] = value; // Met à jour le modèle
    // Passe au champ suivant si un chiffre est entré et si ce n'est pas le dernier champ
    if (value && index < 5) {
      nextTick(() => {
        // Attend que le DOM soit mis à jour
        codeInput.value[index + 1]?.focus();
      });
    }
    // Si c'est le dernier champ et qu'il est rempli, tente de soumettre
    if (index === 5 && code.value.every((c) => c !== "")) {
      handleSubmit();
    }
  };

  // Gère les touches spéciales : Retour arrière, flèches
  const handleKeydown = (index, event) => {
    if (event.key === "Backspace") {
      // Si la case est vide ET que ce n'est pas la première, recule le focus
      if (!code.value[index] && index > 0) {
        event.preventDefault(); // Empêche le comportement par défaut (double effacement)
        nextTick(() => {
          codeInput.value[index - 1]?.focus();
        });
      }
      // Si la case a une valeur, l'effacement normal se produit (pas besoin d'intervenir)
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault(); // Empêche le curseur de bouger dans l'input
      codeInput.value[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      codeInput.value[index + 1]?.focus();
    }
  };

  // Gère le collage d'un code
  const handlePaste = (event) => {
    event.preventDefault(); // Empêche le collage par défaut
    const pasteData = event.clipboardData?.getData("text").trim().replace(/\s+/g, "").slice(0, 6); // Nettoie et limite à 6 chiffres
    // Vérifie si les données collées sont bien 6 chiffres
    if (pasteData && /^\d{6}$/.test(pasteData)) {
      pasteData.split("").forEach((char, index) => {
        code.value[index] = char; // Remplit les cases
      });
      // Met le focus sur la dernière case après le collage
      codeInput.value[5]?.focus();
      handleSubmit(); // Tente de soumettre directement après le collage
    } else {
      // Gère le collage partiel ou invalide (optionnel)
      if (pasteData && /^\d+$/.test(pasteData)) {
        pasteData.split("").forEach((char, idx) => {
          if (idx < 6) code.value[idx] = char;
        });
        const focusIndex = Math.min(pasteData.length, 5);
        codeInput.value[focusIndex]?.focus();
      } else {
        feedbackMessage.value = "Code collé invalide.";
        isError.value = true;
      }
    }
  };

  // Soumet le code au backend
  const handleSubmit = async () => {
    feedbackMessage.value = "";
    isError.value = false;
    const fullCode = code.value.join("");

    // Vérifie si le code a 6 chiffres
    if (fullCode.length !== 6) {
      feedbackMessage.value = "Veuillez entrer les 6 chiffres.";
      isError.value = true;
      return;
    }
    // Vérifie si l'email est présent (sécurité)
    if (!email.value) {
      feedbackMessage.value = "Adresse email manquante. Veuillez revenir en arrière.";
      isError.value = true;
      return;
    }

    // Activer le chargement après validation
    isSubmitting.value = true;
    loadingMessage.value = "Vérification du code...";

    try {
      // ✅ Envoyer le type de compte si disponible pour gérer les comptes multiples
      const payload = { email: email.value, code: fullCode };
      if (accountType.value) {
        payload.account_type = accountType.value;
      }
      await verifyCode(payload);
      // ✅ La redirection est gérée par useAuth.js (vers Dashboard ou EmployeeSetPassword)
    } catch (error) {
      feedbackMessage.value = error.response?.data?.message || "Une erreur est survenue.";
      isError.value = true;
      // Efface les champs et remet le focus au début en cas d'erreur
      code.value.fill("");
      codeInput.value[0]?.focus();
    } finally {
      isSubmitting.value = false; // Réactive le bouton
      loadingMessage.value = "";
    }
  };

  // Demande au backend de renvoyer un code
  const handleResend = async () => {
    feedbackMessage.value = "";
    isError.value = false;
    isResending.value = true; // Désactive le bouton (état visuel)
    loadingMessage.value = "Renvoi du code...";

    try {
      const response = await resendVerificationCode(email.value);
      feedbackMessage.value = response.data.message || "Code renvoyé avec succès.";
      startCooldown(); // Lance le timer de 30s
    } catch (error) {
      feedbackMessage.value = error.response?.data?.message || "Erreur lors du renvoi du code.";
      isError.value = true;
      isResending.value = false; // Réactive le bouton immédiatement en cas d'erreur
      loadingMessage.value = "";
    }
    // Ne réactive pas canResend ici, géré par le timer
    // isResending état visuel se termine ici
  };

  // Lance le timer de 30 secondes pour le bouton "Renvoyer"
  const startCooldown = () => {
    canResend.value = false; // Désactive logiquement le bouton
    isResending.value = false; // Termine l'état visuel "Envoi en cours..."
    loadingMessage.value = ""; // Réinitialise le message de chargement
    cooldownTimer.value = 30; // Initialise le timer
    if (cooldownInterval) clearInterval(cooldownInterval); // Nettoie un timer précédent

    // Décrémente le timer chaque seconde
    cooldownInterval = setInterval(() => {
      cooldownTimer.value -= 1;
      if (cooldownTimer.value <= 0) {
        clearInterval(cooldownInterval);
        canResend.value = true; // Réactive le bouton à la fin du timer
      }
    }, 1000);
  };
</script>

<style scoped>
  /* Style optionnel pour un curseur différent quand désactivé */
  button:disabled {
    cursor: not-allowed;
  }
  /* Style pour les inputs */
  input {
    caret-color: transparent; /* Masque le curseur texte */
  }
  input:focus {
    border-color: #0ea5e9; /* sky-500 */
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.5);
  }
</style>
