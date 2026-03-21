<template>
  <div class="min-h-screen bg-slate-950 text-white p-6">
    <router-link to="/personnel" class="text-sky-400 text-sm mb-4 inline-block hover:text-sky-300">
      ← Retour au personnel
    </router-link>
    <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
    <p class="text-slate-400 mt-3">Cette section sera bientôt disponible.</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const pageTitle = computed(() => {
  const s = String(route.params.serviceSlug || "");
  if (s === "pointage") return "Pointage";
  if (!s) return "Service";
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
});

onMounted(() => {
  if (user.value && user.value.role !== "business_admin") {
    router.replace({ name: "Dashboard" });
  }
});
</script>
