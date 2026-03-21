<template>
  <div class="space-y-6">
    <!-- Stepper -->
    <div class="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
      <template v-for="(s, i) in stepLabels" :key="s.key">
        <div class="flex items-center gap-2">
          <div
            :class="[
              'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
              wizardStep >= s.key
                ? 'bg-sky-500 border-sky-400 text-white'
                : 'bg-slate-800 border-slate-600 text-slate-500',
            ]"
          >
            {{ s.key }}
          </div>
          <span
            :class="wizardStep >= s.key ? 'text-white font-medium text-sm' : 'text-slate-500 text-sm'"
            class="hidden sm:inline max-w-[120px]"
            >{{ s.label }}</span
          >
        </div>
        <div
          v-if="i < stepLabels.length - 1"
          class="h-0.5 w-8 sm:w-16 rounded"
          :class="wizardStep > s.key ? 'bg-sky-500' : 'bg-slate-600'"
        />
      </template>
    </div>

    <!-- Étape 1 : Groupe + Calendrier -->
    <div
      v-show="wizardStep === 1"
      class="bg-slate-800/50 border border-slate-600 rounded-xl p-4 sm:p-6 space-y-6"
    >
      <div class="flex items-center gap-2 border-b border-slate-600 pb-3">
        <span class="text-xl">📅</span>
        <h4 class="text-white font-semibold text-lg">Étape 1 — Groupe & calendrier</h4>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">Nom du groupe</label>
        <input
          v-model.trim="form.groupName"
          type="text"
          placeholder="Ex. Équipe Chantier A"
          class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>

      <div class="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
        <p class="text-slate-300 text-sm font-medium mb-3">Services</p>
        <label class="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            role="switch"
            :aria-checked="pointageEnabled"
            @click="togglePointage"
            :class="[
              'relative w-11 h-6 rounded-full transition-colors',
              pointageEnabled ? 'bg-sky-500' : 'bg-slate-600',
            ]"
          >
            <span
              :class="[
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                pointageEnabled ? 'left-6' : 'left-1',
              ]"
            />
          </button>
          <span class="text-white">Pointage</span>
        </label>
        <p class="text-slate-500 text-xs mt-2">D’autres modules (accès, badges…) pourront s’ajouter ici.</p>
      </div>

      <div
        class="border-t border-slate-600 pt-4 space-y-4"
        :class="!pointageEnabled ? 'opacity-50' : ''"
        :aria-disabled="!pointageEnabled"
      >
        <p class="text-slate-300 text-sm font-medium flex items-center justify-between gap-3">
          <span>Planification temporelle</span>
          <span v-if="!pointageEnabled" class="text-xs text-slate-400">Verrouillé (Pointage désactivé)</span>
        </p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Mois de référence</label>
          <select
            v-model="form.calendar.month"
            :disabled="!pointageEnabled"
            class="w-full sm:max-w-xs bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed"
          >
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-2">Jours ouvrés</p>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="d in weekdayDefs"
              :key="d.bit"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors"
              :class="[
                !pointageEnabled ? 'cursor-not-allowed' : 'cursor-pointer',
                form.calendar.weekdays[d.bit]
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                  : 'bg-slate-700/50 border-slate-600 text-slate-400',
              ]"
            >
              <input v-model="form.calendar.weekdays[d.bit]" :disabled="!pointageEnabled" type="checkbox" class="sr-only" />
              {{ d.label }}
            </label>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Heure début</label>
            <input
              v-model="form.calendar.dayStart"
              type="time"
              :disabled="!pointageEnabled"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Heure fin</label>
            <input
              v-model="form.calendar.dayEnd"
              type="time"
              :disabled="!pointageEnabled"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        <p v-if="rrulePreviewHint" class="text-xs text-slate-500 italic">{{ rrulePreviewHint }}</p>
      </div>

      <div class="border-t border-slate-600 pt-4 space-y-3" :class="!pointageEnabled ? 'opacity-50' : ''">
        <p class="text-slate-300 text-sm font-medium flex items-center justify-between gap-3">
          <span>Exceptions (jours fériés, fermetures)</span>
          <span v-if="!pointageEnabled" class="text-xs text-slate-400">Verrouillé</span>
        </p>
        <div v-for="(ex, idx) in form.exceptions" :key="idx" class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
          <div class="flex-1">
            <label class="block text-xs text-slate-400 mb-1">Date</label>
            <input
              v-model="ex.date"
              type="date"
              :disabled="!pointageEnabled"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed"
            />
          </div>
          <div class="flex-[2]">
            <label class="block text-xs text-slate-400 mb-1">Motif d’absence collective</label>
            <input
              v-model.trim="ex.reason"
              type="text"
              placeholder="Ex. Fête nationale"
              :disabled="!pointageEnabled"
              class="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            @click="removeException(idx)"
            :disabled="!pointageEnabled"
            class="shrink-0 py-2 px-3 bg-slate-700 hover:bg-red-900/40 disabled:hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm disabled:cursor-not-allowed"
          >
            Retirer
          </button>
        </div>
        <button
          type="button"
          @click="addException"
          :disabled="!pointageEnabled"
          class="text-sky-400 hover:text-sky-300 disabled:hover:text-sky-400 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          + Ajouter une date d’exception
        </button>
      </div>

      <p v-if="step1Error" class="text-red-400 text-sm">{{ step1Error }}</p>
      <button
        type="button"
        @click="validateStep1AndContinue"
        class="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Valider l’étape 1 et continuer
      </button>
    </div>

    <!-- Étape 2 : Géofencing (débloquée après étape 1) -->
    <div
      v-show="wizardStep === 2 && step1Validated"
      class="bg-slate-800/50 border border-amber-700/40 rounded-xl p-4 sm:p-6 space-y-6"
    >
      <div class="flex items-center gap-2 border-b border-slate-600 pb-3">
        <span class="text-xl">📍</span>
        <h4 class="text-white font-semibold text-lg">Étape 2 — Zone de présence (géofencing)</h4>
      </div>

      <div
        class="bg-slate-900/60 border border-slate-600 rounded-lg p-4 min-h-[4rem] text-slate-200 text-sm leading-relaxed"
      >
        <p class="text-slate-400 text-xs uppercase tracking-wide mb-1">Assistant</p>
        {{ geoAssistantMessage }}
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="n in maxPoints"
          :key="n"
          type="button"
          :disabled="isCapturing || (n > capturedPoints.length + 1)"
          @click="capturePointN(n)"
          class="bg-amber-600/80 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
        >
          {{ n === capturedPoints.length + 1 ? `Capturer le point ${n}` : n <= capturedPoints.length ? `Point ${n} ✓` : `Point ${n}` }}
        </button>
      </div>
      <p v-if="geoError" class="text-red-400 text-sm">{{ geoError }}</p>
      <ul class="text-xs text-slate-400 space-y-1">
        <li v-for="(p, i) in capturedPoints" :key="i">
          Point {{ i + 1 }} : {{ p.lat.toFixed(6) }}, {{ p.lng.toFixed(6) }}
        </li>
      </ul>

      <button
        v-if="capturedPoints.length >= 4"
        type="button"
        @click="onGenerateSurface"
        class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-5 rounded-lg text-sm"
      >
        Générer la surface
      </button>
      <p v-if="surfaceHint" class="text-xs text-slate-500">{{ surfaceHint }}</p>

      <div class="flex flex-wrap gap-3 pt-2 border-t border-slate-600">
        <button
          type="button"
          @click="wizardStep = 1"
          class="text-slate-400 hover:text-white text-sm"
        >
          ← Modifier le calendrier
        </button>
        <button
          type="button"
          @click="wizardStep = 3"
          class="ml-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg text-sm"
        >
          Voir le récapitulatif
        </button>
      </div>
    </div>

    <!-- Étape 3 : Payload JSON -->
    <div
      v-show="wizardStep === 3 && step1Validated"
      class="bg-slate-800/50 border border-slate-600 rounded-xl p-4 sm:p-6 space-y-4"
    >
      <div class="flex items-center gap-2 border-b border-slate-600 pb-3">
        <span class="text-xl">✓</span>
        <h4 class="text-white font-semibold text-lg">Étape 3 — Récapitulatif (payload)</h4>
      </div>
      <pre
        class="bg-slate-950 border border-slate-700 rounded-lg p-4 text-xs text-green-400/90 overflow-x-auto max-h-64 overflow-y-auto font-mono"
        >{{ payloadPreview }}</pre
      >
      <div class="flex flex-wrap gap-3">
        <button type="button" @click="wizardStep = 2" class="text-slate-400 hover:text-white text-sm">← Retour géofencing</button>
        <button
          type="button"
          @click="emitAddToList"
          class="ml-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-5 rounded-lg text-sm"
        >
          {{ typeof editIndex === "number" ? "Mettre à jour le groupe" : "Ajouter le groupe à la commande" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";

const props = defineProps({
  initialPayload: { type: Object, default: null },
  editIndex: { type: Number, default: null },
});

const emit = defineEmits(["add-group", "update-group", "cancel-edit"]);

const stepLabels = [
  { key: 1, label: "Calendrier" },
  { key: 2, label: "Géofencing" },
  { key: 3, label: "Récapitulatif" },
];

const maxPoints = 6;
const MIN_SEGMENT_M = 5;

const wizardStep = ref(1);
const step1Validated = ref(false);
const step1Error = ref("");
const geoError = ref("");
const geoAssistantMessage = ref("Validez d’abord l’étape 1, puis capturez les points GPS du périmètre.");
const isCapturing = ref(false);
const surfaceHint = ref("");

const capturedPoints = ref([]);
const polygonGeoJson = ref(null);

const weekdayDefs = [
  { bit: 1, label: "Lun" },
  { bit: 2, label: "Mar" },
  { bit: 3, label: "Mer" },
  { bit: 4, label: "Jeu" },
  { bit: 5, label: "Ven" },
  { bit: 6, label: "Sam" },
  { bit: 7, label: "Dim" },
];

function currentMonthValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const monthOptions = computed(() => {
  const out = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const v = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    out.push({
      value: v,
      label: d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
    });
  }
  return out;
});

const form = reactive({
  groupName: "",
  services: { pointage: true },
  calendar: {
    month: currentMonthValue(),
    weekdays: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false },
    dayStart: "08:00",
    dayEnd: "18:00",
  },
  exceptions: [],
});

// Ref dédiée pour que l’UI (verrouillage des champs) se mette à jour immédiatement au clic sur le toggle
const pointageEnabled = ref(true);

function togglePointage() {
  pointageEnabled.value = !pointageEnabled.value;
  form.services.pointage = pointageEnabled.value;
}

function applyPayload(payload) {
  if (!payload || typeof payload !== "object") return;

  // Étape 1
  form.groupName = (payload.groupName || "").toString();
  pointageEnabled.value = !!payload?.services?.pointage;
  form.services.pointage = pointageEnabled.value;

  const cal = payload.calendar || {};
  if (typeof cal.month === "string" && cal.month) {
    form.calendar.month = cal.month;
  } else {
    form.calendar.month = currentMonthValue();
  }

  // weekdays: tableau de bits [1..7]
  const wBits = Array.isArray(cal.weekdays) ? cal.weekdays : [];
  const nextWeekdays = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
  [1, 2, 3, 4, 5, 6, 7].forEach((b) => {
    nextWeekdays[b] = wBits.includes(b);
  });
  // Fallback: si pas de données → Lun-Ven
  const hasAny = [1, 2, 3, 4, 5, 6, 7].some((b) => nextWeekdays[b]);
  form.calendar.weekdays = hasAny ? nextWeekdays : { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false };

  const win = cal.dailyWindow || {};
  form.calendar.dayStart = typeof win.start === "string" && win.start ? win.start : "08:00";
  form.calendar.dayEnd = typeof win.end === "string" && win.end ? win.end : "18:00";

  // Exceptions
  const ex = Array.isArray(payload.exceptions) ? payload.exceptions : [];
  form.exceptions = ex.map((e) => ({
    date: (e?.date || "").toString(),
    reason: (e?.collectiveAbsenceReason || "").toString(),
  }));

  // Étape 2: points capturés
  const capturePoints = Array.isArray(payload?.geofence?.capturePoints) ? payload.geofence.capturePoints : [];
  capturedPoints.value = capturePoints
    .map((p) => {
      const coords = Array.isArray(p?.coordinates) ? p.coordinates : null;
      if (!coords || coords.length < 2) return null;
      return { lat: Number(coords[1]), lng: Number(coords[0]), capturedAt: p?.properties?.capturedAt || null };
    })
    .filter((p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lng));

  polygonGeoJson.value = payload?.geofence?.polygonGeoJson && typeof payload.geofence.polygonGeoJson === "object" ? payload.geofence.polygonGeoJson : null;
  surfaceHint.value = "";
  geoError.value = "";
  step1Validated.value = true;
  wizardStep.value = 1;
}

watch(
  () => props.initialPayload,
  (p) => {
    if (p) applyPayload(p);
  },
  { immediate: true },
);

function addException() {
  form.exceptions.push({ date: "", reason: "" });
}
function removeException(idx) {
  form.exceptions.splice(idx, 1);
}

/** Placeholder RRULE (répétition sur le mois). */
function buildCalendarRrulePlaceholder() {
  // TODO: RRULE à partir de form.calendar.month + weekdays + horaires
  return null;
}

const rrulePreviewHint = computed(() => {
  const r = buildCalendarRrulePlaceholder();
  return r ? `Aperçu RRULE : ${r}` : "La récurrence mensuelle (RRULE) sera calculée à l’enregistrement final.";
});

/** Distance Haversine en mètres entre deux points { lat, lng }. */
function checkDistance(point1, point2) {
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistanceMeters(d) {
  const v = Number(d);
  if (!Number.isFinite(v)) return "?";
  if (v < 1) return `${Math.max(0, Math.round(v * 100))} cm`;
  if (v < 10) return `${v.toFixed(2)} m`;
  return `${v.toFixed(1)} m`;
}

/**
 * Génère un polygone GeoJSON "bufferisé" (~5m) sans dépendance externe.
 * Approche: on agrandit chaque sommet depuis le centroïde d'un facteur
 * (distance + buffer) / distance. Suffisant pour un périmètre terrain.
 */
function generatePolygonWithBuffer(points) {
  const src = Array.isArray(points) ? points : [];
  if (src.length < 3) return null;

  const centroid = src.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat / src.length, lng: acc.lng + p.lng / src.length }),
    { lat: 0, lng: 0 },
  );

  const buffered = src.map((p) => {
    const d = checkDistance(centroid, p);
    // Si un point est quasi au centroïde, garder le point brut.
    if (!Number.isFinite(d) || d < 0.01) {
      return [p.lng, p.lat];
    }
    const scale = (d + 5) / d;
    const lat = centroid.lat + (p.lat - centroid.lat) * scale;
    const lng = centroid.lng + (p.lng - centroid.lng) * scale;
    return [lng, lat];
  });

  // Fermer l'anneau GeoJSON
  const first = buffered[0];
  const last = buffered[buffered.length - 1];
  const isClosed = first && last && first[0] === last[0] && first[1] === last[1];
  const ring = isClosed ? buffered : [...buffered, first];

  return {
    type: "Polygon",
    coordinates: [ring],
  };
}

watch(
  () => [wizardStep.value, step1Validated.value, capturedPoints.value.length],
  () => {
    if (!step1Validated.value) {
      geoAssistantMessage.value = "Complétez et validez l’étape 1 pour débloquer la capture GPS.";
      return;
    }
    const n = capturedPoints.value.length;
    if (n === 0) {
      geoAssistantMessage.value =
        "Positionnez-vous au premier sommet du périmètre, puis appuyez sur « Capturer le point 1 ».";
    } else if (n < maxPoints) {
      geoAssistantMessage.value =
        "Déplacez-vous d’au moins 5 mètres par rapport au point précédent, puis capturez le point suivant pour délimiter le périmètre.";
    } else {
      geoAssistantMessage.value = "Maximum 6 points atteint. Vous pouvez générer la surface ou passer au récapitulatif.";
    }
  },
  { immediate: true },
);

function validateStep1AndContinue() {
  step1Error.value = "";
  if (!form.groupName.trim()) {
    step1Error.value = "Indiquez un nom de groupe.";
    return;
  }
  const wd = form.calendar.weekdays;
  if (![1, 2, 3, 4, 5, 6, 7].some((b) => wd[b])) {
    step1Error.value = "Sélectionnez au moins un jour ouvré.";
    return;
  }
  step1Validated.value = true;
  wizardStep.value = 2;
}

function capturePointN(n) {
  geoError.value = "";
  if (n !== capturedPoints.value.length + 1) return;
  if (!navigator.geolocation) {
    geoError.value = "La géolocalisation n’est pas disponible sur ce navigateur.";
    return;
  }
  isCapturing.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      isCapturing.value = false;
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const prev = capturedPoints.value[capturedPoints.value.length - 1];
      if (prev) {
        const d = checkDistance(prev, { lat, lng });
        if (d < MIN_SEGMENT_M) {
          geoError.value = `Trop proche du point précédent (${formatDistanceMeters(d)}). Éloignez-vous d’au moins ${MIN_SEGMENT_M} m.`;
          return;
        }
      }
      capturedPoints.value = [...capturedPoints.value, { lat, lng, capturedAt: new Date().toISOString() }];
    },
    (err) => {
      isCapturing.value = false;
      geoError.value = err.message || "Impossible d’obtenir la position (vérifiez les autorisations).";
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
  );
}

function onGenerateSurface() {
  surfaceHint.value = "";
  const poly = generatePolygonWithBuffer(capturedPoints.value);
  polygonGeoJson.value = poly;
  if (!poly) {
    surfaceHint.value = "Capturez au moins 3 points pour générer la surface.";
  } else {
    surfaceHint.value = "Surface GeoJSON générée avec marge extérieure d'environ 5 m.";
  }
}

function buildGroupSecurityPayload() {
  const weekdayBits = [1, 2, 3, 4, 5, 6, 7].filter((b) => form.calendar.weekdays[b]);
  const ring =
    capturedPoints.value.length >= 3
      ? [
          ...capturedPoints.value.map((p) => [p.lng, p.lat]),
          [capturedPoints.value[0].lng, capturedPoints.value[0].lat],
        ]
      : null;

  const fallbackPolygon =
    ring && !polygonGeoJson.value
      ? {
          type: "Polygon",
          coordinates: [ring],
        }
      : polygonGeoJson.value;

  return {
    version: 1,
    groupName: form.groupName.trim(),
    services: { pointage: !!form.services.pointage },
    calendar: {
      month: form.calendar.month,
      weekdays: weekdayBits,
      dailyWindow: { start: form.calendar.dayStart, end: form.calendar.dayEnd },
      rrule: buildCalendarRrulePlaceholder(),
    },
    exceptions: (form.exceptions || [])
      .filter((e) => e.date)
      .map((e) => ({ date: e.date, collectiveAbsenceReason: (e.reason || "").trim() })),
    geofence: {
      capturePoints: capturedPoints.value.map((p) => ({
        type: "Point",
        coordinates: [p.lng, p.lat],
        properties: { capturedAt: p.capturedAt },
      })),
      polygonGeoJson: fallbackPolygon,
      bufferMeters: 5,
    },
  };
}

const payloadPreview = computed(() => JSON.stringify(buildGroupSecurityPayload(), null, 2));

function emitAddToList() {
  const payload = buildGroupSecurityPayload();
  if (typeof props.editIndex === "number" && props.editIndex >= 0) {
    emit("update-group", { index: props.editIndex, payload });
  } else {
    emit("add-group", payload);
  }
  resetWizard();
}

function resetWizard() {
  wizardStep.value = 1;
  step1Validated.value = false;
  step1Error.value = "";
  capturedPoints.value = [];
  polygonGeoJson.value = null;
  surfaceHint.value = "";
  geoError.value = "";
  form.groupName = "";
  pointageEnabled.value = true;
  form.services.pointage = true;
  form.calendar.month = currentMonthValue();
  form.calendar.weekdays = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false };
  form.calendar.dayStart = "08:00";
  form.calendar.dayEnd = "18:00";
  form.exceptions = [];
}
</script>
