<template>
  <body class="text-gray-800">
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center p-4">
        <div class="flex items-center">
          <img
            v-if="pageData.logo_url"
            :src="pageData.logo_url"
            :alt="'Logo ' + pageData.company_name"
            class="h-12 mr-3"
            loading="eager"
            fetchpriority="high"
          />
          <h1 class="text-2xl font-bold hidden md:block" :style="{ color: pageData.primary_color || '#000' }">
            {{ pageData.company_name }}
          </h1>
        </div>
        <button
          @click="openModal('menu')"
          class="text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-lg flex items-center justify-center"
          :style="{
            backgroundColor: pageData.primary_color || '#3b82f6',
          }"
          @mouseenter="(e) => (e.target.style.backgroundColor = darkenColor(pageData.primary_color || '#3b82f6', 20))"
          @mouseleave="(e) => (e.target.style.backgroundColor = pageData.primary_color || '#3b82f6')"
        >
          <i class="fas mr-2" :class="pageData.products_button_icon || 'fa-list'"></i>
          {{ pageData.products_button_text || "Nos Produits" }}
        </button>
      </div>
    </header>

    <main class="container mx-auto p-4 md:p-8">
      <section v-if="pageData.hero_headline" id="hero" class="text-center my-12">
        <h2 class="text-4xl md:text-5xl font-black tracking-tight" :style="{ color: pageData.primary_color || '#000' }">
          {{ pageData.hero_headline }}
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          {{ pageData.hero_subheadline }}
        </p>
        <p class="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          {{ pageData.hero_description }}
        </p>
      </section>

      <section
        v-if="pageData.chart_labels && pageData.chart_labels.length > 0"
        id="expertise"
        class="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-8"
      >
        <h2 class="text-3xl font-bold text-center mb-2" :style="{ color: pageData.primary_color || '#000' }">
          {{ pageData.chart_title || "Notre Expertise" }}
        </h2>
        <p class="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          {{ pageData.chart_description }}
        </p>
        <div class="chart-container">
          <canvas ref="expertiseChart"></canvas>
        </div>
      </section>

      <section v-if="pageData.pillars && pageData.pillars.length > 0" id="services-piliers" class="mb-8">
        <h2 class="text-3xl font-bold text-center mb-8" :style="{ color: pageData.primary_color || '#000' }">
          {{ pageData.pillars_title }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="pillar in pageData.pillars"
            :key="pillar.title"
            class="bg-white rounded-lg shadow-xl p-6 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <div class="text-5xl mb-4" :style="{ color: pageData.primary_color || '#000' }">
              <i class="fas" :class="pillar.icon"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">
              {{ pillar.title }}
            </h3>
            <p class="text-gray-600">{{ pillar.description }}</p>
          </div>
        </div>
      </section>

      <!-- Section Accompagnement (Organigrammes) -->
      <section v-if="pageData.process_order_steps || pageData.process_logistics_steps" id="accompagnement" class="mb-8">
        <h2 class="text-3xl font-bold text-center mb-8" :style="{ color: pageData.primary_color || '#000' }">
          {{ pageData.processes_title || "Nos Processus Simplifiés" }}
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Processus de Commande -->
          <div
            v-if="pageData.process_order_steps && pageData.process_order_steps.length > 0"
            class="bg-white rounded-lg shadow-xl p-6 md:p-8"
          >
            <h3 class="text-2xl font-bold text-gray-800 mb-2 text-center">
              <i class="fas fa-shopping-cart" :style="{ color: pageData.primary_color || '#000' }"></i>
              {{ pageData.process_order_title || "Processus de Commande" }}
            </h3>
            <p class="text-center text-gray-600 mb-6">
              {{ pageData.process_order_description || "Un parcours simple et efficace." }}
            </p>
            <div class="flex flex-col space-y-4">
              <template v-for="(step, index) in pageData.process_order_steps" :key="index">
                <div
                  class="flowchart-step p-4 rounded-lg font-semibold shadow-md"
                  :class="getStepClass(index, pageData.process_order_steps.length)"
                  :style="getStepStyle(index, pageData.process_order_steps.length)"
                >
                  {{ index + 1 }}. {{ step }}
                </div>
                <div
                  v-if="index < pageData.process_order_steps.length - 1"
                  class="flowchart-arrow"
                  :style="{ color: getArrowColor(index, pageData.process_order_steps.length) }"
                >
                  ⬇️
                </div>
              </template>
            </div>
          </div>

          <!-- Processus Logistique -->
          <div
            v-if="pageData.process_logistics_steps && pageData.process_logistics_steps.length > 0"
            class="bg-white rounded-lg shadow-xl p-6 md:p-8"
          >
            <h3 class="text-2xl font-bold text-gray-800 mb-2 text-center">
              <i class="fas fa-truck" :style="{ color: pageData.primary_color || '#000' }"></i>
              {{ pageData.process_logistics_title || "Logistique & Livraison" }}
            </h3>
            <p class="text-center text-gray-600 mb-6">
              {{ pageData.process_logistics_description || "Nous assurons l'acheminement de vos produits." }}
            </p>
            <div class="flex flex-col space-y-4">
              <template v-for="(step, index) in pageData.process_logistics_steps" :key="index">
                <div
                  class="flowchart-step p-4 rounded-lg font-semibold shadow-md"
                  :class="getStepClass(index, pageData.process_logistics_steps.length)"
                  :style="getStepStyle(index, pageData.process_logistics_steps.length)"
                >
                  {{ index + 1 }}. {{ step }}
                </div>
                <div
                  v-if="index < pageData.process_logistics_steps.length - 1"
                  class="flowchart-arrow"
                  :style="{ color: getArrowColor(index, pageData.process_logistics_steps.length) }"
                >
                  ⬇️
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="pageData.engagement_description"
        id="engagement"
        class="bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 mb-8 text-white text-center"
      >
        <h2
          v-if="pageData.company_name"
          class="text-3xl font-bold mb-4"
          :style="{ color: pageData.primary_color || '#fff' }"
        >
          {{ pageData.company_name }}
        </h2>
        <div v-if="pageData.company_name_short" class="text-8xl md:text-9xl font-black my-4 text-white">
          {{ pageData.company_name_short }}
        </div>
        <p class="text-lg text-gray-300 max-w-3xl mx-auto">
          {{ pageData.engagement_description }}
        </p>
      </section>
    </main>

    <footer class="bg-gray-900 text-white p-8">
      <div class="container mx-auto text-center">
        <h2 class="text-2xl font-bold mb-4">Contactez-nous</h2>
        <div class="text-center mb-6 space-y-2 text-gray-300">
          <p v-if="pageData.contact_address"><strong>Adresse :</strong> {{ pageData.contact_address }}</p>
          <p v-if="pageData.contact_phones"><strong>Téléphones :</strong> {{ pageData.contact_phones }}</p>
          <p v-if="pageData.contact_email"><strong>Email :</strong> {{ pageData.contact_email }}</p>
          <p v-if="pageData.website_url">
            <strong>Site web :</strong>
            <a
              :href="pageData.website_url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-400 underline break-all"
            >
              {{ pageData.website_url }}
            </a>
          </p>
        </div>

        <!-- Réseaux sociaux avec icône rendez-vous toujours au centre -->
        <div
          v-if="
            pageData.whatsapp_url ||
            pageData.linkedin_url ||
            pageData.facebook_url ||
            pageData.twitter_url ||
            pageData.youtube_url ||
            pageData.deezer_url ||
            pageData.spotify_url ||
            pageData.tiktok_url ||
            pageData.threads_url ||
            isAppointmentEnabled
          "
          class="flex justify-center items-center mb-6"
        >
          <!-- Groupe gauche des icônes (équilibré) -->
          <div class="flex items-center justify-end gap-4" :style="{ minWidth: isAppointmentEnabled ? '80px' : '0' }">
            <a
              v-for="icon in leftSocialIcons"
              :key="icon.name"
              :href="icon.url"
              target="_blank"
              rel="noopener noreferrer"
              :class="['text-gray-300 transition-colors text-2xl', icon.hoverClass]"
              :title="icon.title"
            >
              <i :class="icon.iconClass"></i>
            </a>
          </div>

          <!-- Bouton Prendre Rendez-vous - TOUJOURS AU CENTRE -->
          <button
            v-if="isAppointmentEnabled"
            @click="openBookingModal"
            class="text-gray-300 hover:text-sky-400 transition-colors text-2xl cursor-pointer relative group flex-shrink-0 mx-5"
            title="Prendre rendez-vous"
          >
            <i class="fas fa-calendar-check"></i>
            <!-- Badge indicateur -->
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full animate-pulse"></span>
          </button>

          <!-- Groupe droite des icônes (équilibré) -->
          <div class="flex items-center justify-start gap-4" :style="{ minWidth: isAppointmentEnabled ? '80px' : '0' }">
            <a
              v-for="icon in rightSocialIcons"
              :key="icon.name"
              :href="icon.url"
              target="_blank"
              rel="noopener noreferrer"
              :class="['text-gray-300 transition-colors text-2xl', icon.hoverClass]"
              :title="icon.title"
            >
              <i :class="icon.iconClass"></i>
            </a>
          </div>
        </div>

        <p class="text-gray-500">
          &copy; {{ new Date().getFullYear() }} {{ pageData.company_name }}. Tous droits réservés.
        </p>
      </div>
    </footer>

    <!-- Modal Menu -->
    <div
      v-if="isMenuModalOpen"
      class="modal-backdrop fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      @click.self="closeModal('menu')"
    >
      <div class="modal-content bg-white rounded-lg shadow-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold" :style="{ color: pageData.primary_color || '#000' }">
            {{ pageData.products_modal_title || "Nos Produits et Services" }}
          </h2>
          <button @click="closeModal('menu')" class="text-gray-500 text-3xl hover:text-red-500 transition-colors">
            &times;
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            v-for="service in pageData.services"
            :key="service.title"
            @click="openServiceDetails(service)"
            class="p-4 bg-gray-100 rounded-lg text-left hover:text-white transition-colors duration-200 flex items-center"
            @mouseenter="(e) => (e.currentTarget.style.backgroundColor = pageData.primary_color || '#3b82f6')"
            @mouseleave="(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')"
          >
            <span class="text-2xl mr-4 w-8 text-center">
              <i class="fas" :class="service.icon || 'fa-cube'"></i>
            </span>
            <span class="font-semibold">{{ service.title }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Détails Service -->
    <div
      v-if="isDetailsModalOpen"
      class="modal-backdrop fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      @click.self="closeModal('details')"
    >
      <div class="modal-content bg-white rounded-lg shadow-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2">
        <div class="flex justify-between items-center mb-4">
          <h2 id="details-title" class="text-3xl font-bold" :style="{ color: pageData.primary_color || '#000' }">
            {{ selectedService.title }}
          </h2>
          <button @click="closeModal('details')" class="text-gray-500 text-3xl hover:text-red-500 transition-colors">
            &times;
          </button>
        </div>
        <div
          id="details-content"
          class="prose max-w-none text-gray-700"
          v-html="selectedService.details || selectedService.description"
        ></div>
      </div>
    </div>

    <!-- Modal de Réservation de Rendez-vous -->
    <BookingModal
      :isOpen="isBookingModalOpen"
      :userId="appointmentUserId"
      :orderId="appointmentOrderId"
      :ownerName="ownerName"
      @close="closeBookingModal"
    />
  </body>
</template>

<script setup>
  import { ref, onMounted, watch, nextTick, computed } from "vue";
  import Chart from "chart.js/auto";
  import BookingModal from "./BookingModal.vue";

  const props = defineProps({
    pageData: {
      type: Object,
      required: true,
    },
  });

  // --- Rendez-vous ---
  const isBookingModalOpen = ref(false);

  // Vérifier si les rendez-vous sont activés
  const isAppointmentEnabled = computed(() => {
    return props.pageData?.appointment_setting?.is_enabled === true;
  });

  // ID de l'utilisateur pour les rendez-vous
  const appointmentUserId = computed(() => {
    return props.pageData?.user_id || props.pageData?.id;
  });

  // ID de la commande pour les rendez-vous (pour la configuration spécifique)
  const appointmentOrderId = computed(() => {
    const orderId = props.pageData?.order_id || props.pageData?.order?.id || null;
    console.log('[PageTemplate] appointmentOrderId computed:', {
      order_id: props.pageData?.order_id,
      order_id_direct: orderId,
      pageData_keys: props.pageData ? Object.keys(props.pageData) : [],
      full_pageData: props.pageData
    });
    return orderId;
  });

  // Nom du propriétaire
  const ownerName = computed(() => {
    return props.pageData?.company_name || props.pageData?.name || 'ce contact';
  });

  // Liste de toutes les icônes sociales disponibles
  const allSocialIcons = computed(() => {
    const icons = [];
    
    if (props.pageData?.whatsapp_url) {
      icons.push({
        name: 'whatsapp',
        url: props.pageData.whatsapp_url,
        iconClass: 'fab fa-whatsapp',
        hoverClass: 'hover:text-green-400',
        title: 'WhatsApp'
      });
    }
    if (props.pageData?.linkedin_url) {
      icons.push({
        name: 'linkedin',
        url: props.pageData.linkedin_url,
        iconClass: 'fab fa-linkedin',
        hoverClass: 'hover:text-blue-500',
        title: 'LinkedIn'
      });
    }
    if (props.pageData?.facebook_url) {
      icons.push({
        name: 'facebook',
        url: props.pageData.facebook_url,
        iconClass: 'fab fa-facebook',
        hoverClass: 'hover:text-blue-600',
        title: 'Facebook'
      });
    }
    if (props.pageData?.twitter_url) {
      icons.push({
        name: 'twitter',
        url: props.pageData.twitter_url,
        iconClass: 'fab fa-twitter',
        hoverClass: 'hover:text-blue-400',
        title: 'Twitter'
      });
    }
    if (props.pageData?.youtube_url) {
      icons.push({
        name: 'youtube',
        url: props.pageData.youtube_url,
        iconClass: 'fab fa-youtube',
        hoverClass: 'hover:text-red-500',
        title: 'YouTube'
      });
    }
    if (props.pageData?.deezer_url) {
      icons.push({
        name: 'deezer',
        url: props.pageData.deezer_url,
        iconClass: 'fab fa-deezer',
        hoverClass: 'hover:text-purple-500',
        title: 'Deezer'
      });
    }
    if (props.pageData?.spotify_url) {
      icons.push({
        name: 'spotify',
        url: props.pageData.spotify_url,
        iconClass: 'fab fa-spotify',
        hoverClass: 'hover:text-green-500',
        title: 'Spotify'
      });
    }
    if (props.pageData?.tiktok_url) {
      icons.push({
        name: 'tiktok',
        url: props.pageData.tiktok_url,
        iconClass: 'fab fa-tiktok',
        hoverClass: 'hover:text-black dark:hover:text-white',
        title: 'TikTok'
      });
    }
    if (props.pageData?.threads_url) {
      icons.push({
        name: 'threads',
        url: props.pageData.threads_url,
        iconClass: 'fab fa-threads',
        hoverClass: 'hover:text-gray-800 dark:hover:text-gray-200',
        title: 'Threads'
      });
    }
    
    return icons;
  });

  // Icônes à gauche de l'icône rendez-vous (première moitié)
  const leftSocialIcons = computed(() => {
    const all = allSocialIcons.value;
    const midPoint = Math.ceil(all.length / 2);
    return all.slice(0, midPoint);
  });

  // Icônes à droite de l'icône rendez-vous (seconde moitié)
  const rightSocialIcons = computed(() => {
    const all = allSocialIcons.value;
    const midPoint = Math.ceil(all.length / 2);
    return all.slice(midPoint);
  });

  const openBookingModal = () => {
    isBookingModalOpen.value = true;
  };

  const closeBookingModal = () => {
    isBookingModalOpen.value = false;
  };

  const isMenuModalOpen = ref(false);
  const isDetailsModalOpen = ref(false);
  const selectedService = ref(null);
  const chartInstance = ref(null);
  const expertiseChart = ref(null);

  const openModal = (modalType) => {
    if (modalType === "menu") {
      isMenuModalOpen.value = true;
    } else if (modalType === "details") {
      isDetailsModalOpen.value = true;
    }
  };

  const closeModal = (modalType) => {
    if (modalType === "menu") {
      isMenuModalOpen.value = false;
    } else if (modalType === "details") {
      isDetailsModalOpen.value = false;
    }
  };

  const openServiceDetails = (service) => {
    selectedService.value = service;
    closeModal("menu");
    setTimeout(() => {
      openModal("details");
    }, 350);
  };

  const initChart = () => {
    if (props.pageData.chart_labels && expertiseChart.value) {
      const ctx = expertiseChart.value.getContext("2d");

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      chartInstance.value = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: props.pageData.chart_labels,
          datasets: [
            {
              label: "Catégories de Produits",
              data: props.pageData.chart_data,
              backgroundColor: props.pageData.chart_colors,
              borderColor: "#FFFFFF",
              borderWidth: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    }
  };

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Fonctions pour les organigrammes
  const getStepClass = (index, totalSteps) => {
    const midPoint = Math.floor(totalSteps / 2);
    if (index < midPoint - 1) return "bg-gray-200 text-gray-800";
    if (index === midPoint - 1) return "bg-gray-300 text-gray-800";
    if (index === totalSteps - 1) return "bg-black text-white";
    return "";
  };

  const getStepStyle = (index, totalSteps) => {
    const midPoint = Math.floor(totalSteps / 2);
    const primaryColor = props.pageData.primary_color || "#3b82f6";

    if (index === midPoint) {
      return { backgroundColor: primaryColor, color: "white" };
    }
    if (index === midPoint + 1 && index !== totalSteps - 1) {
      return { backgroundColor: darkenColor(primaryColor, 20), color: "white" };
    }
    return {};
  };

  const getArrowColor = (index, totalSteps) => {
    const midPoint = Math.floor(totalSteps / 2);
    const primaryColor = props.pageData.primary_color || "#3b82f6";

    if (index < midPoint - 1) return "#9ca3af";
    if (index === midPoint - 1) return primaryColor;
    if (index === midPoint) return darkenColor(primaryColor, 20);
    return "#9ca3af";
  };

  onMounted(() => {
    // Charger Font Awesome pour les icônes
    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fontAwesomeLink);

    nextTick(() => {
      initChart();
    });
  });

  watch(
    () => props.pageData.chart_labels,
    () => {
      nextTick(() => {
        initChart();
      });
    },
  );
</script>

<style scoped>
  body {
    font-family: "Inter", sans-serif;
    background-color: #f8f9fa;
  }

  .chart-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    height: 300px;
    max-height: 400px;
  }

  @media (min-width: 768px) {
    .chart-container {
      height: 400px;
    }
  }

  .modal-backdrop {
    transition: opacity 0.3s ease-in-out;
  }

  .modal-content {
    transition: transform 0.3s ease-in-out;
    max-height: 90vh;
    overflow-y: auto;
  }

  /* Styles pour les organigrammes */
  .flowchart-step {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .flowchart-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    line-height: 1;
  }
</style>
