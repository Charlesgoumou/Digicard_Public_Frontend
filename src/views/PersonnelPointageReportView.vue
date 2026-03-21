<template>
  <div class="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
    <router-link to="/personnel" class="text-sky-400 text-sm mb-4 inline-block hover:text-sky-300">
      ← Retour au personnel
    </router-link>

    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold">Rapport d'assiduité (pointage)</h1>
          <p class="text-slate-400 text-sm mt-1">
            Consultation par groupe de sécurité pour la date choisie (arrivées / départs, retards selon l’horaire du groupe).
          </p>
        </div>
      </div>

      <div v-if="!user" class="animate-pulse h-32 bg-slate-800/60 rounded-xl border border-slate-700" />

      <div v-else-if="user.role !== 'business_admin'" class="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
        <p class="text-slate-200">Cette page est réservée aux comptes entreprise.</p>
      </div>

      <template v-else>
        <div v-if="loadingOrders" class="animate-pulse space-y-3">
          <div class="h-10 bg-slate-800 rounded-lg" />
        </div>

        <div v-else-if="!businessOrders.length" class="text-slate-400 italic py-8 text-center">
          Aucune commande entreprise trouvée.
        </div>

        <template v-else>
          <!-- Filtres -->
          <div
            class="flex flex-col xl:flex-row xl:flex-wrap gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 items-stretch xl:items-end"
          >
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-medium text-slate-400 mb-1">Commande</label>
              <div
                v-if="isCommandScopedToOneOrder && scopedOrderForDisplay"
                class="w-full bg-slate-800/90 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100"
                title="Ouvert depuis le personnel pour cette commande uniquement"
              >
                #{{ scopedOrderForDisplay.order_number }} — {{ scopedOrderForDisplay.card_quantity }} carte(s)
              </div>
              <select
                v-else
                v-model.number="selectedOrderId"
                class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option v-for="o in businessOrders" :key="o.id" :value="o.id">
                  #{{ o.order_number }} — {{ o.card_quantity }} carte(s)
                </option>
              </select>
            </div>
            <div class="w-full sm:w-auto sm:min-w-[180px]">
              <label class="block text-xs font-medium text-slate-400 mb-1">Date du rapport</label>
              <input
                v-model="selectedDate"
                type="date"
                class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500"
              />
              <p class="text-[0.65rem] text-slate-500 mt-1">Par défaut : aujourd’hui</p>
            </div>
            <div class="w-full sm:w-auto sm:min-w-[160px]">
              <label class="block text-xs font-medium text-slate-400 mb-1">Format export avancé</label>
              <select
                v-model="exportFormat"
                class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500"
              >
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">CSV (Excel / tableur)</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                @click="fetchReport"
                :disabled="reportLoading || exporting"
                class="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-sm font-medium"
              >
                {{ reportLoading ? "Chargement…" : "Actualiser" }}
              </button>
              <button
                type="button"
                @click="exportExcelForDay"
                :disabled="!selectedOrderId || reportLoading || exporting"
                class="px-4 py-2 rounded-lg bg-emerald-700/90 hover:bg-emerald-600 border border-emerald-600/80 text-sm font-medium disabled:opacity-50"
                title="Télécharge le rapport journalier pour tous les groupes (Excel)"
              >
                {{ exporting ? "Préparation…" : "Exporter en Excel" }}
              </button>
              <button
                type="button"
                @click="exportGlobalDay"
                :disabled="exporting"
                class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-sm disabled:opacity-50"
              >
                {{ exporting ? "Préparation…" : "Exporter (format choisi, jour affiché)" }}
              </button>
            </div>
          </div>

          <p v-if="reportError" class="text-red-400 text-sm">{{ reportError }}</p>
          <p
            v-if="exportFeedback"
            :class="
              exportFeedback.type === 'success'
                ? 'text-emerald-400/95 text-sm border border-emerald-700/50 bg-emerald-950/30 rounded-lg px-3 py-2'
                : 'text-amber-200 text-sm border border-amber-700/50 bg-amber-950/30 rounded-lg px-3 py-2'
            "
            role="status"
          >
            {{ exportFeedback.text }}
          </p>

          <!-- Statistiques (employés configurés — aligné sur le pointage) -->
          <div v-if="report" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div class="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
              <p class="text-slate-400 text-xs uppercase tracking-wide">Total employés</p>
              <p class="text-2xl font-bold text-white mt-1">{{ report.stats.total_employees }}</p>
              <p class="text-[0.65rem] text-slate-500 mt-1">Profils configurés</p>
            </div>
            <div class="rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4">
              <p class="text-emerald-400/90 text-xs uppercase tracking-wide">Présents (aujourd’hui)</p>
              <p class="text-2xl font-bold text-emerald-300 mt-1">{{ report.stats.present }}</p>
              <p class="text-[0.65rem] text-emerald-500/70 mt-1">Arrivée pointée ce jour</p>
            </div>
            <div class="rounded-xl border border-amber-800/50 bg-amber-950/30 p-4">
              <p class="text-amber-400/90 text-xs uppercase tracking-wide">Retards</p>
              <p class="text-2xl font-bold text-amber-300 mt-1">{{ report.stats.late }}</p>
              <p class="text-[0.65rem] text-amber-500/70 mt-1">Après heure limite du groupe</p>
            </div>
            <div class="rounded-xl border border-rose-800/50 bg-rose-950/30 p-4">
              <p class="text-rose-400/90 text-xs uppercase tracking-wide">Départs manquants</p>
              <p class="text-2xl font-bold text-rose-300 mt-1">{{ report.stats.missing_checkout }}</p>
              <p class="text-[0.65rem] text-rose-400/60 mt-1">Arrivée sans départ</p>
            </div>
          </div>

          <!-- Groupes -->
          <div v-if="reportLoading && !report" class="py-16 text-center text-slate-500">Chargement du rapport…</div>

          <div v-else-if="report" class="space-y-10">
            <section
              v-for="(grp, gIdx) in report.groups"
              :key="`${grp.index ?? 'u'}-${gIdx}`"
              class="rounded-xl border border-slate-700 overflow-hidden bg-slate-900/40"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 bg-slate-800/80 border-b border-slate-700"
              >
                <div>
                  <h2 class="text-lg font-semibold text-white">{{ grp.title }}</h2>
                  <p v-if="!grp.is_working_day" class="text-xs text-slate-500 mt-0.5">Jour non ouvré pour ce groupe</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-sky-200 border border-slate-600"
                    :title="`Présents sur effectifs attendus ce jour ouvré : ${grp.presence_ratio.present} / ${grp.presence_ratio.expected}`"
                  >
                    {{ grp.presence_ratio.present }} / {{ grp.presence_ratio.expected }}
                  </span>
                  <span class="text-xs text-slate-500">Entrée max : {{ grp.daily_window_start }}</span>
                </div>
              </div>

              <div class="px-4 py-2 flex flex-wrap gap-2 border-b border-slate-700/60 bg-slate-900/50">
                <span class="text-xs text-slate-500 self-center mr-1">Exports pour ce groupe :</span>
                <button
                  v-for="p in exportPeriods"
                  :key="p.id"
                  type="button"
                  @click="exportForGroup(grp, p.id)"
                  :disabled="exporting"
                  class="text-xs px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 disabled:opacity-50"
                >
                  {{ p.label }}
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full min-w-[720px] text-sm text-left border-collapse border border-slate-800/80">
                  <thead>
                    <tr class="bg-slate-800/90 text-slate-300 text-xs uppercase tracking-wide">
                      <th class="px-4 py-3">Employé</th>
                      <th class="px-4 py-3 whitespace-nowrap">Matricule</th>
                      <th class="px-4 py-3">Arrivée</th>
                      <th class="px-4 py-3">Départ</th>
                      <th class="px-4 py-3">Statut</th>
                      <th class="px-4 py-3 w-14">GPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, rIdx) in grp.rows"
                      :key="row.order_employee_id"
                      :class="rIdx % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-800/25'"
                      class="border-t border-slate-800/80"
                    >
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3 min-w-[200px]">
                          <img
                            v-if="resolveAvatarUrl(row.avatar_url)"
                            :src="resolveAvatarUrl(row.avatar_url)"
                            alt=""
                            class="w-9 h-9 rounded-full object-cover border border-slate-600"
                          />
                          <div
                            v-else
                            class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold"
                          >
                            {{ initials(row.full_name) }}
                          </div>
                          <div class="min-w-0">
                            <p class="font-medium text-white truncate">{{ row.full_name }}</p>
                            <p class="text-xs text-slate-500 truncate">{{ row.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {{ row.matricule || "—" }}
                      </td>
                      <td class="px-4 py-3 text-slate-200 font-mono">{{ row.arrival || "—" }}</td>
                      <td class="px-4 py-3 text-slate-200 font-mono">{{ row.departure || "--:--" }}</td>
                      <td class="px-4 py-3">
                        <span :class="statusBadgeClass(row.status)">{{ statusLabel(row.status) }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <button
                          type="button"
                          class="p-2 rounded-lg text-sky-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700/80 enabled:hover:bg-slate-700/80"
                          :disabled="!hasGps(row)"
                          :title="gpsTooltip(row)"
                          :aria-label="hasGps(row) ? 'Coordonnées GPS : ' + gpsTooltip(row) : 'Aucune coordonnée GPS'"
                          @click="copyGps(row)"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import apiClient from "@/api";

const router = useRouter();
const route = useRoute();
const { user } = useAuth();

const loadingOrders = ref(true);
const businessOrders = ref([]);

/** ID commande passé dans l’URL (?order=) depuis « Services activés pour cette commande » */
const scopedOrderIdFromRoute = computed(() => {
  const raw = route.query.order;
  if (raw === undefined || raw === null || raw === "") return null;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
});

const scopedOrderForDisplay = computed(() => {
  const id = scopedOrderIdFromRoute.value;
  if (!id) return null;
  return businessOrders.value.find((o) => o.id === id) ?? null;
});

/** Liste chargée contient bien la commande demandée dans l’URL → pas de sélecteur multi-commandes */
const isCommandScopedToOneOrder = computed(() => scopedOrderForDisplay.value !== null);
const selectedOrderId = ref(null);
const selectedDate = ref(todayIso());
const report = ref(null);
const reportLoading = ref(false);
const reportError = ref("");
const exporting = ref(false);
/** @type {import('vue').Ref<{ type: 'success' | 'error'; text: string } | null>} */
const exportFeedback = ref(null);
let exportFeedbackTimer = null;
/** @type {import('vue').Ref<'xlsx'|'csv'|'pdf'>} */
const exportFormat = ref("xlsx");

const exportPeriods = [
  { id: "day", label: "Jour" },
  { id: "week", label: "Semaine" },
  { id: "month", label: "Mois" },
  { id: "quarter", label: "Trimestre" },
  { id: "semester", label: "Semestre" },
  { id: "year", label: "Année" },
];

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initials(name) {
  const s = String(name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

const backendBase = () => import.meta.env.VITE_APP_URL_BACKEND || "http://localhost:8000";

function resolveAvatarUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${backendBase()}${url}`;
  return `${backendBase()}/${url.replace(/^\//, "")}`;
}

function statusLabel(status) {
  const map = {
    a_l_heure: "À l'heure",
    en_poste: "En poste",
    retard: "Retard",
    absent: "Absent",
    jour_off: "Jour off",
    non_configure: "Non configuré",
  };
  return map[status] || status;
}

function statusBadgeClass(status) {
  const base = "inline-flex px-2 py-0.5 rounded-full text-xs font-semibold";
  switch (status) {
    case "a_l_heure":
      return `${base} bg-emerald-500/20 text-emerald-300 border border-emerald-500/40`;
    case "en_poste":
      return `${base} bg-sky-500/20 text-sky-200 border border-sky-500/40`;
    case "retard":
      return `${base} bg-amber-500/20 text-amber-200 border border-amber-500/40`;
    case "absent":
      return `${base} bg-rose-500/20 text-rose-200 border border-rose-500/40`;
    case "jour_off":
      return `${base} bg-slate-600/40 text-slate-300 border border-slate-500/50`;
    case "non_configure":
      return `${base} bg-slate-700/50 text-slate-400 border border-slate-600`;
    default:
      return `${base} bg-slate-700 text-slate-300`;
  }
}

function hasGps(row) {
  return Boolean(row.gps?.check_in || row.gps?.check_out);
}

function gpsTooltip(row) {
  const parts = [];
  if (row.gps?.check_in) {
    parts.push(`Entrée : ${row.gps.check_in.lat.toFixed(6)}, ${row.gps.check_in.lng.toFixed(6)}`);
  }
  if (row.gps?.check_out) {
    parts.push(`Sortie : ${row.gps.check_out.lat.toFixed(6)}, ${row.gps.check_out.lng.toFixed(6)}`);
  }
  return parts.length ? parts.join(" | ") : "Aucune coordonnée enregistrée";
}

async function copyGps(row) {
  const t = gpsTooltip(row);
  if (t.includes("Aucune")) return;
  try {
    await navigator.clipboard.writeText(t);
  } catch {
    /* ignore */
  }
}

async function loadBusinessOrders() {
  loadingOrders.value = true;
  reportError.value = "";
  try {
    const { data } = await apiClient.get("/api/orders");
    const orders = Array.isArray(data) ? data : [];
    businessOrders.value = orders.filter((o) => o?.order_type === "business");
    const scoped = scopedOrderIdFromRoute.value;
    if (businessOrders.value.length) {
      if (scoped && businessOrders.value.some((o) => o.id === scoped)) {
        selectedOrderId.value = scoped;
      } else if (!selectedOrderId.value || !businessOrders.value.some((o) => o.id === selectedOrderId.value)) {
        selectedOrderId.value = businessOrders.value[0].id;
      }
    }
  } catch (e) {
    console.error(e);
    businessOrders.value = [];
    reportError.value = "Impossible de charger les commandes.";
  } finally {
    loadingOrders.value = false;
  }
}

async function fetchReport() {
  if (!selectedOrderId.value) return;
  reportLoading.value = true;
  reportError.value = "";
  try {
    const { data } = await apiClient.get("/api/business/reports/attendance", {
      params: { order_id: selectedOrderId.value, date: selectedDate.value },
    });
    report.value = data;
  } catch (e) {
    console.error(e);
    report.value = null;
    reportError.value = e.response?.data?.message || "Erreur lors du chargement du rapport.";
  } finally {
    reportLoading.value = false;
  }
}

async function exportGlobalDay() {
  await tryExport({ period: "day", group_index: undefined });
}

/** Rapport journalier tous groupes, toujours en Excel (.xlsx). */
async function exportExcelForDay() {
  const prev = exportFormat.value;
  exportFormat.value = "xlsx";
  try {
    await tryExport({ period: "day", group_index: undefined });
  } finally {
    exportFormat.value = prev;
  }
}

/**
 * @param {object} grp
 * @param {string} period
 */
async function exportForGroup(grp, period) {
  const groupIndex =
    grp.index === null || grp.index === undefined ? -1 : grp.index;
  await tryExport({ period, group_index: groupIndex });
}

function parseFilenameFromContentDisposition(cd) {
  if (!cd || typeof cd !== "string") return null;
  const utf = cd.match(/filename\*=UTF-8''([^;\n]+)/i);
  if (utf?.[1]) {
    try {
      return decodeURIComponent(utf[1].trim());
    } catch {
      return utf[1].trim();
    }
  }
  const m = cd.match(/filename="?([^";\n]+)"?/i);
  return m?.[1]?.trim() || null;
}

function setExportFeedback(type, text, autoClearMs = 6000) {
  if (exportFeedbackTimer) {
    clearTimeout(exportFeedbackTimer);
    exportFeedbackTimer = null;
  }
  exportFeedback.value = { type, text };
  if (autoClearMs > 0) {
    exportFeedbackTimer = setTimeout(() => {
      exportFeedback.value = null;
      exportFeedbackTimer = null;
    }, autoClearMs);
  }
}

/**
 * Message lisible pour l’utilisateur (évite d’afficher les détails techniques du serveur).
 * @param {string | undefined} raw
 */
function friendlyExportErrorMessage(raw) {
  const s = String(raw || "").trim();
  if (!s) return "L’export n’a pas pu être généré. Réessayez dans un instant.";
  if (s.includes("Aucun employé pour ce filtre de groupe")) {
    return "Aucun employé ne correspond à ce groupe pour l’export choisi.";
  }
  if (s.includes("Aucune ligne à exporter")) {
    return "Aucune donnée à exporter sur cette période. Vérifiez la date ou les pointages.";
  }
  if (s.includes("Accès refusé") || s.includes("Non autorisé")) {
    return "Vous n’avez pas accès à cette commande ou à cette action.";
  }
  return "L’export n’a pas pu être généré. Réessayez dans un instant.";
}

/**
 * @param {Record<string, unknown>} extra
 */
async function tryExport(extra) {
  if (!selectedOrderId.value) return;
  exporting.value = true;
  try {
    await apiClient.get("/sanctum/csrf-cookie");
    const params = {
      order_id: selectedOrderId.value,
      date: selectedDate.value,
      format: exportFormat.value,
      ...extra,
    };
    if (params.group_index === undefined) {
      delete params.group_index;
    }
    const response = await apiClient.get("/api/business/reports/attendance/export", {
      params,
      responseType: "blob",
      timeout: 120000,
    });
    const filename =
      parseFilenameFromContentDisposition(response.headers["content-disposition"]) ||
      `assiduite.${exportFormat.value}`;
    const blob =
      response.data instanceof Blob ? response.data : new Blob([response.data], { type: response.headers["content-type"] || undefined });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExportFeedback("success", "Téléchargement lancé. Le fichier apparaît dans vos téléchargements.");
  } catch (e) {
    console.error(e);
    let raw = "";
    if (e.response?.data instanceof Blob) {
      try {
        const text = await e.response.data.text();
        const j = JSON.parse(text);
        raw = j.message || "";
      } catch {
        raw = "";
      }
    } else if (e.response?.data && typeof e.response.data === "object" && e.response.data.message) {
      raw = e.response.data.message;
    } else if (e.code === "ECONNABORTED" || e.message?.includes("timeout")) {
      setExportFeedback("error", "La génération a pris trop de temps. Réessayez avec une période plus courte ou un autre format.");
      return;
    } else if (!e.response) {
      setExportFeedback("error", "Connexion impossible. Vérifiez votre réseau et réessayez.");
      return;
    }
    setExportFeedback("error", friendlyExportErrorMessage(raw));
  } finally {
    exporting.value = false;
  }
}

onMounted(async () => {
  if (user.value && user.value.role !== "business_admin") {
    router.replace({ name: "Dashboard" });
    return;
  }
  await loadBusinessOrders();
});

watch(
  () => route.query.order,
  () => {
    const id = scopedOrderIdFromRoute.value;
    if (id && businessOrders.value.some((o) => o.id === id)) {
      selectedOrderId.value = id;
    }
  }
);

watch(
  [selectedOrderId, selectedDate],
  async () => {
    if (selectedOrderId.value) await fetchReport();
  },
  { immediate: true }
);
</script>
