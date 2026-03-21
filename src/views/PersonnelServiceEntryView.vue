<template>
  <component :is="activeComponent" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import PersonnelPointageReportView from "./PersonnelPointageReportView.vue";
import PersonnelServicePlaceholderView from "./PersonnelServicePlaceholderView.vue";

const route = useRoute();

const activeComponent = computed(() => {
  return String(route.params.serviceSlug || "") === "pointage"
    ? PersonnelPointageReportView
    : PersonnelServicePlaceholderView;
});
</script>
