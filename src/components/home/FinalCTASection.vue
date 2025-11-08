<template>
  <section class="bg-slate-900 py-20 sm:py-24">
    <div class="container mx-auto px-4">
      <div
        class="relative bg-slate-950/70 border border-blue-900/30 rounded-3xl p-8 sm:p-12 text-center overflow-hidden"
      >
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Prêt à Révolutionner votre Réseautage ?</h2>
          <p class="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui ont déjà fait le pas vers une communication plus intelligente
            et plus efficace.
          </p>
          <div v-if="!isEmployee" class="mt-8">
            <button
              @click="openOrderModal"
              class="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 ease-in-out"
            >
              Commander ma carte
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  // MODIFIÉ : Import et utilisation du "cerveau" du modal
  import { useOrderModal } from "@/composables/useOrderModal";
  import { useAuth } from "@/composables/useAuth";
  import { computed } from "vue";

  const { openOrderModal } = useOrderModal();
  const { user } = useAuth();

  // Vérifier si l'utilisateur est un employé
  const isEmployee = computed(() => user.value?.role === "employee");
</script>

<style scoped>
  /* Les styles restent inchangés */
</style>
