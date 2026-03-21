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
        class="bg-sky-950/40 border border-sky-600/40 rounded-lg p-4 min-h-[4rem] text-slate-200 text-sm leading-relaxed"
      >
        <p class="text-sky-400/90 text-xs uppercase tracking-wide mb-1 font-medium">Assistant</p>
        {{ geoAssistantMessage }}
      </div>

      <div class="space-y-2">
        <label for="geofence-map-search" class="block text-xs font-medium text-slate-400">
          Rechercher un lieu (Google Places) ou coller des coordonnées décimales (ex. depuis Google Maps : lat, lng)
        </label>
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            id="geofence-map-search"
            ref="mapSearchInputRef"
            type="text"
            autocomplete="off"
            placeholder="Quartier, adresse… ou 9.5123, -13.7122"
            class="flex-1 w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 px-3 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-amber-500/80 focus:border-transparent"
            @keydown.enter.prevent="onMapSearchSubmit"
            @paste="onMapSearchPaste"
          />
          <button
            type="button"
            @click="onMapSearchSubmit"
            class="shrink-0 bg-amber-600/90 hover:bg-amber-500 text-white text-sm font-semibold py-2.5 px-4 rounded-lg border border-amber-500/50 transition-colors"
          >
            Aller
          </button>
        </div>
        <p class="text-slate-500 text-[11px] leading-relaxed">
          <span class="text-slate-400">Mobile :</span> un doigt déplace la carte, pincer zoome ou pivote comme sur Google Maps ; un appui pose un sommet (appui long possible). Après placement, faites glisser les marqueurs pour affiner. « Recentrer » utilise le GPS haute précision (quelques secondes).
        </p>
      </div>

      <div class="relative w-full rounded-xl overflow-hidden border border-slate-600 bg-slate-950 shadow-inner">
        <div
          ref="mapContainerRef"
          class="w-full min-h-[360px] h-[min(560px,60vh)] sm:min-h-[400px]"
          style="touch-action: none"
          role="application"
          aria-label="Carte satellite — appui pour placer un sommet, glisser un doigt pour déplacer la carte, pincer pour zoomer ou pivoter"
        />
        <div v-if="isMapLoading" class="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-[2]">
          <span class="text-slate-300 text-sm text-center px-4">Chargement de la carte…</span>
        </div>
        <div
          class="absolute top-2 right-2 z-[3] flex flex-col gap-1.5 max-w-[min(100%,9.5rem)] sm:max-w-[11rem] pointer-events-none [&>button]:pointer-events-auto"
        >
          <button
            type="button"
            @click="resetTrace"
            class="bg-slate-900/90 hover:bg-amber-600/90 border border-amber-600/60 text-amber-100 text-[10px] sm:text-xs font-semibold leading-tight py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-md shadow-md backdrop-blur-sm transition-colors text-left"
          >
            Réinitialiser le tracé
          </button>
          <button
            type="button"
            :disabled="isMapLoading"
            @click="recenterOnMyPosition"
            class="bg-slate-900/90 hover:bg-amber-600/90 border border-amber-500/50 text-amber-100 text-[10px] sm:text-xs font-semibold leading-tight py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-md shadow-md backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            Recentrer sur ma position
          </button>
        </div>
      </div>

      <p v-if="geoError" class="text-red-400 text-sm">{{ geoError }}</p>
      <p v-if="locationNotice" class="text-sky-400/85 text-xs leading-relaxed">{{ locationNotice }}</p>
      <p v-if="surfaceHint" class="text-xs text-slate-500">{{ surfaceHint }}</p>

      <div class="space-y-2">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide">Points capturés ({{ capturedPoints.length }} / {{ maxPoints }})</p>
        <ul v-if="capturedPoints.length" class="space-y-2">
          <li
            v-for="(p, i) in capturedPoints"
            :key="`${p.lat}-${p.lng}-${i}`"
            class="flex items-center gap-3 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-300"
          >
            <span class="shrink-0 w-7 h-7 rounded-full bg-amber-600/30 border border-amber-500/50 flex items-center justify-center font-bold text-amber-200 text-[11px]">
              {{ i + 1 }}
            </span>
            <span class="flex-1 font-mono text-[11px] sm:text-xs break-all">
              {{ p.lat.toFixed(6) }}, {{ p.lng.toFixed(6) }}
            </span>
            <button
              type="button"
              @click="removePointAt(i)"
              class="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-colors"
              title="Supprimer ce point"
              aria-label="Supprimer ce point"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </li>
        </ul>
        <p v-else class="text-slate-500 text-xs italic">Aucun point pour l’instant — cliquez sur la carte pour commencer.</p>
      </div>

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
          :disabled="!canProceedToRecap"
          @click="wizardStep = 3"
          :class="[
            'ml-auto font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors',
            canProceedToRecap
              ? 'bg-sky-500 hover:bg-sky-600 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600',
          ]"
        >
          Voir le récapitulatif
        </button>
      </div>
    </div>

    <!-- Étape 3 : Récapitulatif de confirmation -->
    <div
      v-show="wizardStep === 3 && step1Validated"
      class="bg-slate-800/50 border border-slate-600 rounded-xl p-4 sm:p-6 space-y-6"
    >
      <div class="flex items-center gap-2 border-b border-slate-600 pb-3">
        <span class="text-xl">✓</span>
        <h4 class="text-white font-semibold text-lg">Étape 3 — Récapitulatif</h4>
      </div>

      <p v-if="recapData.groupName" class="text-slate-300 text-sm">
        <span class="text-slate-500">Groupe :</span>
        <strong class="text-white ml-1">{{ recapData.groupName }}</strong>
      </p>

      <!-- Carte Calendrier -->
      <div
        class="bg-slate-900/60 border border-slate-600 rounded-xl p-4 sm:p-5 space-y-3"
      >
        <div class="flex items-center gap-2 text-sky-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h5 class="font-semibold text-white text-sm uppercase tracking-wide">Calendrier</h5>
        </div>
        <ul class="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
          <li>
            <span class="text-slate-500">Mois :</span>
            <span class="ml-1">{{ recapData.calendar.monthLabel }}</span>
          </li>
          <li>
            <span class="text-slate-500">Jours ouvrés :</span>
            <span class="ml-1">{{ recapData.calendar.weekdaysLabels.join(", ") }}</span>
          </li>
          <li>
            <span class="text-slate-500">Horaires :</span>
            <span class="ml-1">{{ recapData.calendar.dayStart }} – {{ recapData.calendar.dayEnd }}</span>
          </li>
        </ul>
      </div>

      <!-- Carte Exceptions -->
      <div
        class="bg-slate-900/60 border border-slate-600 rounded-xl p-4 sm:p-5 space-y-3"
      >
        <div class="flex items-center gap-2 text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h5 class="font-semibold text-white text-sm uppercase tracking-wide">Exceptions</h5>
        </div>
        <ul v-if="recapData.exceptions.length" class="space-y-2 text-sm text-slate-300">
          <li
            v-for="(ex, idx) in recapData.exceptions"
            :key="idx"
            class="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700"
          >
            <span class="text-amber-200/90 font-medium">{{ ex.dateFormatted }}</span>
            <span class="text-slate-400">—</span>
            <span>{{ ex.reason }}</span>
          </li>
        </ul>
        <p v-else class="text-slate-500 text-sm italic">Aucune exception définie.</p>
      </div>

      <!-- Carte Zone de présence -->
      <div
        class="bg-slate-900/60 border border-slate-600 rounded-xl p-4 sm:p-5 space-y-3"
      >
        <div class="flex items-center gap-2 text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h5 class="font-semibold text-white text-sm uppercase tracking-wide">Zone de présence</h5>
        </div>
        <ul class="space-y-1.5 text-sm text-slate-300 list-disc list-inside">
          <li>
            <span class="text-slate-500">Périmètre :</span>
            <span class="ml-1">{{ recapData.geofence.pointCount }} sommet{{ recapData.geofence.pointCount > 1 ? "s" : "" }}, marge de {{ recapData.geofence.bufferMeters }} m</span>
          </li>
          <li class="text-slate-400 italic pt-1">
            L'employé doit être dans ce périmètre pour émarger.
          </li>
        </ul>
      </div>

      <p class="text-slate-400 text-xs leading-relaxed border-t border-slate-600 pt-4">
        En validant, vous autorisez le système à activer automatiquement le module de pointage pour les employés de ce groupe selon les règles géographiques et temporelles définies ci-dessus.
      </p>

      <div class="flex flex-wrap gap-3 pt-2">
        <button type="button" @click="wizardStep = 2" class="text-slate-400 hover:text-white text-sm py-2">
          ← Retour géofencing
        </button>
        <button
          type="button"
          @click="emitAddToList"
          class="ml-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg text-sm shadow-lg shadow-emerald-900/30 transition-all hover:shadow-emerald-800/40 hover:scale-[1.02]"
        >
          {{ typeof editIndex === "number" ? "Mettre à jour le groupe" : "Ajouter le groupe à la commande" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onBeforeUnmount } from "vue";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import * as turf from "@turf/turf";

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

const wizardStep = ref(1);
const step1Validated = ref(false);
const step1Error = ref("");
const geoError = ref("");
const locationNotice = ref("");
const surfaceHint = ref("");

const capturedPoints = ref([]);
const polygonGeoJson = ref(null);

const mapContainerRef = ref(null);
const mapSearchInputRef = ref(null);
const isMapLoading = ref(false);
let placesAutocomplete = null;
let mapInstance = null;
let mapClickListener = null;
let mapRightClickListener = null;
let mapMarkers = [];
let mapPolyline = null;
let mapPolygon = null;
/** Repère visuel « ma position » (hors points de capture du polygone) */
let userLocationCircle = null;
let userLocationMarker = null;

/** Styles carte : masquer POI / noms commerciaux pour une vue satellite épurée */
const GOOGLE_MAP_SILENT_STYLES = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

const geoAssistantMessage = computed(() => {
  if (!step1Validated.value) {
    return "Complétez et validez l’étape 1 pour débloquer le géofencing sur la carte.";
  }
  const n = capturedPoints.value.length;
  if (n === 0) {
    return "Localisez votre entreprise et cliquez sur le premier coin de l’enceinte.";
  }
  if (n >= 1 && n <= 3) {
    const remaining = 4 - n;
    return `Continuez à délimiter les contours (encore ${remaining} point${remaining > 1 ? "s" : ""} minimum).`;
  }
  if (n >= 4 && n <= maxPoints) {
    return "Zone définie ! Vous pouvez ajuster ou valider la surface.";
  }
  return "";
});

const canProceedToRecap = computed(() => capturedPoints.value.length >= 4);

const weekdayDefs = [
  { bit: 1, label: "Lun" },
  { bit: 2, label: "Mar" },
  { bit: 3, label: "Mer" },
  { bit: 4, label: "Jeu" },
  { bit: 5, label: "Ven" },
  { bit: 6, label: "Sam" },
  { bit: 7, label: "Dim" },
];

/** Jours complets pour le récapitulatif */
const weekdayFullNames = {
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
  7: "Dimanche",
};

/**
 * Traduit le payload en données lisibles pour l’étape Récapitulatif.
 */
const recapData = computed(() => {
  const cal = form.calendar;
  const monthVal = cal.month || currentMonthValue();
  const [y, m] = String(monthVal).split("-").map(Number);
  const monthLabel =
    y && m
      ? new Date(y, m - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
      : monthVal;

  const weekdaysLabels = [1, 2, 3, 4, 5, 6, 7]
    .filter((b) => cal.weekdays[b])
    .map((b) => weekdayFullNames[b] ?? `Jour ${b}`);

  const exceptions = (form.exceptions || [])
    .filter((e) => e.date)
    .map((e) => ({
      date: e.date,
      dateFormatted: formatDateLabel(e.date),
      reason: (e.reason || "").trim() || "—",
    }));

  const pointCount = capturedPoints.value.length;
  const bufferMeters = 5;

  return {
    groupName: form.groupName.trim() || "—",
    calendar: {
      monthLabel,
      weekdaysLabels,
      dayStart: cal.dayStart || "08:00",
      dayEnd: cal.dayEnd || "18:00",
    },
    exceptions,
    geofence: {
      pointCount,
      bufferMeters,
    },
  };
});

function formatDateLabel(isoDate) {
  if (!isoDate) return "—";
  const [y, m, d] = String(isoDate).split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

  const incomingPoly = payload?.geofence?.polygonGeoJson;
  if (incomingPoly && typeof incomingPoly === "object") {
    polygonGeoJson.value = incomingPoly.type === "Feature" ? incomingPoly.geometry : incomingPoly;
  } else {
    polygonGeoJson.value = null;
  }
  if (!polygonGeoJson.value && capturedPoints.value.length >= 4) {
    updateBufferedPolygon();
  }
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

function buildClosedRingLngLat(pts) {
  if (!Array.isArray(pts) || pts.length < 3) return null;
  const ring = pts.map((p) => [Number(p.lng), Number(p.lat)]);
  ring.push([Number(pts[0].lng), Number(pts[0].lat)]);
  return ring;
}

/** Buffer extérieur ~5 m via Turf (coordonnées WGS84). */
function updateBufferedPolygon() {
  surfaceHint.value = "";
  const pts = capturedPoints.value;
  if (pts.length < 4) {
    polygonGeoJson.value = null;
    return;
  }
  try {
    const ring = buildClosedRingLngLat(pts);
    if (!ring) {
      polygonGeoJson.value = null;
      return;
    }
    const poly = turf.polygon([ring]);
    const buffered = turf.buffer(poly, 5, { units: "meters" });
    const geom = buffered && (buffered.type === "Feature" ? buffered.geometry : buffered);
    if (geom && geom.type) {
      polygonGeoJson.value = geom;
      surfaceHint.value = "Marge de sécurité +5 m appliquée au polygone (Turf.js).";
    } else {
      polygonGeoJson.value = null;
      surfaceHint.value = "Impossible de calculer le buffer : résultat vide.";
    }
  } catch (e) {
    console.warn("GroupSecurityWizard: buffer Turf", e);
    polygonGeoJson.value = null;
    surfaceHint.value = "Erreur lors du calcul du buffer géographique.";
  }
}

function clearMapMarkers() {
  mapMarkers.forEach((m) => m.setMap(null));
  mapMarkers.length = 0;
}

/**
 * Affiche le point GPS et un cercle d’incertitude (précision) après recentrage.
 */
function drawUserLocationOverlay(lat, lng, accuracyM) {
  if (!mapInstance || typeof google === "undefined" || !google.maps) return;
  clearUserLocationOverlay();
  userLocationMarker = new google.maps.Marker({
    position: { lat, lng },
    map: mapInstance,
    zIndex: 5000,
    title: "Votre position (GPS)",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#22d3ee",
      fillOpacity: 0.95,
      strokeColor: "#0f172a",
      strokeWeight: 2,
    },
  });
  const acc = typeof accuracyM === "number" && Number.isFinite(accuracyM) ? accuracyM : null;
  if (acc != null && acc > 6 && acc < 2500) {
    const radiusM = Math.min(Math.max(acc, 8), 500);
    userLocationCircle = new google.maps.Circle({
      center: { lat, lng },
      radius: radiusM,
      map: mapInstance,
      strokeColor: "#22d3ee",
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: "#22d3ee",
      fillOpacity: 0.07,
      zIndex: 4999,
    });
  }
}

let lastVertexAddAt = 0;
let lastVertexKey = "";

function addCapturePointAtLatLng(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
  const t = Date.now();
  if (key === lastVertexKey && t - lastVertexAddAt < 450) {
    return;
  }
  lastVertexKey = key;
  lastVertexAddAt = t;
  if (capturedPoints.value.length >= maxPoints) {
    geoError.value = `Maximum ${maxPoints} points. Réinitialisez le tracé ou supprimez un point.`;
    return;
  }
  geoError.value = "";
  capturedPoints.value = [
    ...capturedPoints.value,
    { lat, lng, capturedAt: new Date().toISOString() },
  ];
  updateBufferedPolygon();
}

function syncMapOverlays() {
  if (!mapInstance || typeof google === "undefined" || !google.maps) return;

  clearMapMarkers();
  const pts = capturedPoints.value;
  pts.forEach((p, i) => {
    const m = new google.maps.Marker({
      position: { lat: p.lat, lng: p.lng },
      map: mapInstance,
      draggable: true,
      title: `Sommet ${i + 1} — glisser pour ajuster`,
      label: {
        text: String(i + 1),
        color: "#0c1222",
        fontSize: "11px",
        fontWeight: "700",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: "#f59e0b",
        fillOpacity: 1,
        strokeColor: "#38bdf8",
        strokeWeight: 2,
      },
    });
    m.addListener("dragstart", () => {
      geoError.value = "";
    });
    m.addListener("dragend", () => {
      const pos = m.getPosition();
      if (!pos) return;
      const idx = mapMarkers.indexOf(m);
      if (idx < 0) return;
      const next = capturedPoints.value.map((pt, j) =>
        j === idx
          ? {
              ...pt,
              lat: pos.lat(),
              lng: pos.lng(),
              capturedAt: pt.capturedAt || new Date().toISOString(),
            }
          : pt,
      );
      capturedPoints.value = next;
      updateBufferedPolygon();
    });
    mapMarkers.push(m);
  });

  const path = pts.map((p) => ({ lat: p.lat, lng: p.lng }));

  if (mapPolyline) {
    mapPolyline.setMap(null);
    mapPolyline = null;
  }
  if (mapPolygon) {
    mapPolygon.setMap(null);
    mapPolygon = null;
  }

  if (pts.length >= 2 && pts.length < 4) {
    mapPolyline = new google.maps.Polyline({
      path,
      map: mapInstance,
      strokeColor: "#38bdf8",
      strokeOpacity: 0.95,
      strokeWeight: 3,
    });
  } else if (pts.length >= 4) {
    mapPolyline = new google.maps.Polyline({
      path: [...path, path[0]],
      map: mapInstance,
      strokeColor: "#38bdf8",
      strokeOpacity: 0.85,
      strokeWeight: 3,
    });
    mapPolygon = new google.maps.Polygon({
      paths: path,
      map: mapInstance,
      strokeColor: "#f59e0b",
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: "#0ea5e9",
      fillOpacity: 0.22,
    });
  }
}

function clearUserLocationOverlay() {
  if (userLocationCircle) {
    userLocationCircle.setMap(null);
    userLocationCircle = null;
  }
  if (userLocationMarker) {
    userLocationMarker.setMap(null);
    userLocationMarker = null;
  }
}

/**
 * Extrait une paire lat,lng depuis du texte collé (Google Maps, notes, etc.).
 * Prend les deux premiers nombres décimaux trouvés.
 */
function tryParseLatLngFromText(raw) {
  if (raw == null || typeof raw !== "string") return null;
  const t = raw.trim().replace(/^\(/, "").replace(/\)$/, "").trim();
  const re = /-?\d+(?:\.\d+)?/g;
  const found = t.match(re);
  if (!found || found.length < 2) return null;
  const a = parseFloat(found[0]);
  const b = parseFloat(found[1]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return { lat: a, lng: b };
  if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return { lat: b, lng: a };
  return null;
}

function panMapToLatLng(lat, lng, zoom = 18) {
  if (!mapInstance || !Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  mapInstance.panTo({ lat, lng });
  mapInstance.setZoom(zoom);
  return true;
}

/** Recentre la carte sur la position GPS actuelle (zoom adapté à la précision). */
async function recenterOnMyPosition() {
  if (!mapInstance || isMapLoading.value) return;
  if (typeof google === "undefined" || !google.maps) return;
  geoError.value = "";
  locationNotice.value = "";
  try {
    const loc = await resolveUserMapCenter();
    const z = typeof loc.zoom === "number" ? loc.zoom : 19;
    panMapToLatLng(loc.center.lat, loc.center.lng, z);
    if (loc.ok) {
      drawUserLocationOverlay(loc.center.lat, loc.center.lng, loc.accuracyM);
    } else {
      clearUserLocationOverlay();
      locationNotice.value =
        "Impossible de récupérer votre position. Autorisez la géolocalisation ou utilisez la recherche / les coordonnées.";
    }
    if (loc.ok && (loc.mode === "coarse" || (loc.accuracyM != null && loc.accuracyM > 400))) {
      locationNotice.value =
        "Position approximative" +
        (loc.accuracyM != null ? ` (précision ±${Math.round(loc.accuracyM)} m)` : "") +
        ". Zoomez et ajustez les sommets à la main si besoin.";
    } else if (loc.ok && loc.accuracyM != null && loc.accuracyM > 35) {
      locationNotice.value = `Précision GPS ±${Math.round(loc.accuracyM)} m — le cercle bleu indique la marge d’incertitude.`;
    }
  } catch (e) {
    console.warn("GroupSecurityWizard: recenterOnMyPosition", e);
    geoError.value = "Géolocalisation impossible pour le moment.";
  }
}

function teardownPlacesSearch() {
  const input = mapSearchInputRef.value;
  if (input && typeof google !== "undefined" && google.maps?.event) {
    google.maps.event.clearInstanceListeners(input);
  }
  placesAutocomplete = null;
}

function setupPlacesSearch() {
  teardownPlacesSearch();
  const input = mapSearchInputRef.value;
  if (!input || !mapInstance || typeof google === "undefined" || !google.maps?.places) return;
  try {
    placesAutocomplete = new google.maps.places.Autocomplete(input, {
      fields: ["geometry", "name", "formatted_address"],
      types: [],
    });
    placesAutocomplete.bindTo("bounds", mapInstance);
    placesAutocomplete.addListener("place_changed", () => {
      const place = placesAutocomplete.getPlace();
      const loc = place.geometry?.location;
      if (!loc) return;
      mapInstance.panTo(loc);
      mapInstance.setZoom(18);
      geoError.value = "";
    });
  } catch (e) {
    console.warn("GroupSecurityWizard: Places Autocomplete", e);
    locationNotice.value =
      (locationNotice.value ? `${locationNotice.value} ` : "") +
      "Recherche d’adresses : activez l’API Places (Google Cloud) si les suggestions n’apparaissent pas.";
  }
}

function onMapSearchSubmit() {
  const text = mapSearchInputRef.value?.value?.trim() || "";
  const parsed = tryParseLatLngFromText(text);
  if (parsed) {
    if (panMapToLatLng(parsed.lat, parsed.lng, 18)) {
      geoError.value = "";
      locationNotice.value = "";
    }
    return;
  }
  locationNotice.value =
    "Saisissez deux nombres décimaux (latitude, longitude) ou choisissez une suggestion dans la liste déroulante.";
}

function onMapSearchPaste() {
  setTimeout(() => {
    const text = mapSearchInputRef.value?.value?.trim() || "";
    const parsed = tryParseLatLngFromText(text);
    if (parsed && mapInstance) {
      panMapToLatLng(parsed.lat, parsed.lng, 18);
      geoError.value = "";
      locationNotice.value = "";
    }
  }, 50);
}

function destroyGoogleMap() {
  teardownPlacesSearch();
  if (mapClickListener) {
    if (typeof google !== "undefined" && google.maps?.event) {
      google.maps.event.removeListener(mapClickListener);
    }
    mapClickListener = null;
  }
  if (mapRightClickListener) {
    if (typeof google !== "undefined" && google.maps?.event) {
      google.maps.event.removeListener(mapRightClickListener);
    }
    mapRightClickListener = null;
  }
  clearUserLocationOverlay();
  clearMapMarkers();
  if (mapPolyline) {
    mapPolyline.setMap(null);
    mapPolyline = null;
  }
  if (mapPolygon) {
    mapPolygon.setMap(null);
    mapPolygon = null;
  }
  mapInstance = null;
  isMapLoading.value = false;
  locationNotice.value = "";
}

/** Promise autour de navigator.geolocation.getCurrentPosition */
function geolocationGetPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Sur mobile, plusieurs mesures GPS successives améliorent souvent la précision.
 * @param {GeolocationPosition} initialPosition
 * @param {number} maxMs
 * @returns {Promise<GeolocationPosition>}
 */
function refinePositionWithWatch(initialPosition, maxMs = 10000) {
  if (!navigator.geolocation?.watchPosition) {
    return Promise.resolve(initialPosition);
  }
  return new Promise((resolve) => {
    let best = initialPosition;
    let finished = false;
    /** @type {number|null} */
    let watchId = null;
    const opts = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 60000,
    };
    const done = () => {
      if (finished) return;
      finished = true;
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
      resolve(best);
    };
    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const a = Number(pos.coords.accuracy) || 9999;
          const ba = Number(best.coords.accuracy) || 9999;
          if (a < ba) best = pos;
          if (a <= 12) {
            done();
          }
        },
        () => done(),
        opts,
      );
    } catch {
      resolve(best);
      return;
    }
    setTimeout(done, maxMs);
  });
}

function zoomFromAccuracyMeters(acc) {
  if (acc == null || !Number.isFinite(acc)) return 19;
  if (acc <= 15) return 20;
  if (acc <= 35) return 19;
  if (acc <= 80) return 18;
  if (acc <= 200) return 17;
  if (acc <= 400) return 16;
  if (acc > 8000) return 11;
  if (acc > 3000) return 13;
  if (acc > 1000) return 15;
  return 17;
}

/**
 * GPS haute précision + affinage court, puis repli réseau / cache.
 */
async function resolveUserMapCenter() {
  const worldFallback = { lat: 8, lng: 10 };
  if (!navigator.geolocation) {
    return {
      center: worldFallback,
      zoom: 3,
      ok: false,
      mode: "unsupported",
      accuracyM: null,
    };
  }

  try {
    const first = await geolocationGetPosition({
      enableHighAccuracy: true,
      timeout: 45000,
      maximumAge: 0,
    });
    const refined = await refinePositionWithWatch(first, 12000);
    const acc = Number(refined.coords.accuracy) || null;
    return {
      center: { lat: refined.coords.latitude, lng: refined.coords.longitude },
      zoom: zoomFromAccuracyMeters(acc ?? undefined),
      ok: true,
      mode: "high",
      accuracyM: acc,
    };
  } catch {
    try {
      const pos = await geolocationGetPosition({
        enableHighAccuracy: false,
        timeout: 25000,
        maximumAge: 120000,
      });
      const acc = Number(pos.coords.accuracy) || 9999;

      return {
        center: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        zoom: zoomFromAccuracyMeters(acc),
        ok: true,
        mode: "coarse",
        accuracyM: acc,
      };
    } catch {
      return {
        center: worldFallback,
        zoom: 3,
        ok: false,
        mode: "denied",
        accuracyM: null,
      };
    }
  }
}

async function initGoogleMap() {
  geoError.value = "";
  locationNotice.value = "";
  const el = mapContainerRef.value;
  if (!el || mapInstance) return;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || String(apiKey).trim() === "") {
    geoError.value = "Clé API manquante : ajoutez VITE_GOOGLE_MAPS_API_KEY dans votre fichier .env (voir .env.example).";
    return;
  }

  isMapLoading.value = true;

  // Intercepter les erreurs d'authentification Google (clé invalide, domaine non autorisé)
  const prevAuthFailure = window.gm_authFailure;
  window.gm_authFailure = () => {
    geoError.value =
      "Clé Google Maps refusée. Vérifiez : API Maps JavaScript activée, facturation activée, domaine autorisé (ex. localhost, 127.0.0.1).";
  };

  try {
    setOptions({
      key: String(apiKey).trim(),
      v: "weekly",
    });
    await importLibrary("maps");
    await importLibrary("marker");
    await importLibrary("places");

    const defaultCenter = { lat: 46.603354, lng: 1.888334 };
    const pts = capturedPoints.value;

    let mapCenter = defaultCenter;
    let mapZoom = 6;
    /** @type {{ center: { lat: number, lng: number }, zoom?: number, ok: boolean, accuracyM?: number|null }|null} */
    let initialLoc = null;

    if (pts.length === 0) {
      const loc = await resolveUserMapCenter();
      initialLoc = loc;
      mapCenter = loc.center;
      mapZoom = loc.zoom;
      if (!loc.ok) {
        locationNotice.value =
          "Impossible de vous localiser. Utilisez la recherche ci-dessus, saisissez des coordonnées, ou déplacez la carte manuellement.";
      } else if (loc.mode === "coarse" || (loc.accuracyM != null && loc.accuracyM > 400)) {
        locationNotice.value =
          "Position approximative" +
          (loc.accuracyM != null ? ` (précision ±${Math.round(loc.accuracyM)} m)` : "") +
          ". Si le lieu ne correspond pas, zoomez, utilisez la recherche ou « Recentrer sur ma position ».";
      } else if (loc.ok && loc.accuracyM != null && loc.accuracyM > 35) {
        locationNotice.value = `Précision GPS ±${Math.round(loc.accuracyM)} m — le cercle bleu indique la marge d’incertitude.`;
      }
    }

    mapInstance = new google.maps.Map(el, {
      center: mapCenter,
      zoom: mapZoom,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
      rotateControl: true,
      // Mobile : un doigt déplace la carte, deux doigts zoom / pivot (comportement proche de Google Maps)
      gestureHandling: "greedy",
      minZoom: 3,
      maxZoom: 22,
      clickableIcons: false,
      styles: GOOGLE_MAP_SILENT_STYLES,
    });

    mapClickListener = mapInstance.addListener("click", (e) => {
      if (!e?.latLng) return;
      addCapturePointAtLatLng(e.latLng.lat(), e.latLng.lng());
    });

    // Appui long / clic droit : pose un sommet (utile sur mobile si le tap simple est ambigu)
    mapRightClickListener = mapInstance.addListener("rightclick", (e) => {
      if (!e?.latLng) return;
      addCapturePointAtLatLng(e.latLng.lat(), e.latLng.lng());
    });

    if (pts.length === 0 && initialLoc?.ok) {
      drawUserLocationOverlay(initialLoc.center.lat, initialLoc.center.lng, initialLoc.accuracyM);
    }

    if (pts.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      pts.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      mapInstance.fitBounds(bounds, 64);
      google.maps.event.addListenerOnce(mapInstance, "idle", () => {
        const z = mapInstance.getZoom();
        if (typeof z === "number" && z > 19) mapInstance.setZoom(19);
      });
    }

    syncMapOverlays();

    await nextTick();
    setupPlacesSearch();

    requestAnimationFrame(() => {
      if (mapInstance) google.maps.event.trigger(mapInstance, "resize");
    });
  } catch (err) {
    console.error("GroupSecurityWizard: Google Maps", err);
    const msg = err?.message || "";
    geoError.value =
      msg.includes("could not load") || msg.includes("Impossible")
        ? "Google Maps ne charge pas. Vérifiez : (1) Google Cloud Console → API Maps JavaScript activée ; (2) Facturation activée sur le projet ; (3) Restriction HTTP referrer : ajoutez localhost, 127.0.0.1 ou utilisez une clé sans restriction pour tester."
        : msg || "Impossible de charger Google Maps.";
    destroyGoogleMap();
  } finally {
    window.gm_authFailure = prevAuthFailure;
    isMapLoading.value = false;
  }
}

function removePointAt(index) {
  capturedPoints.value = capturedPoints.value.filter((_, i) => i !== index);
  geoError.value = "";
  updateBufferedPolygon();
}

function resetTrace() {
  capturedPoints.value = [];
  polygonGeoJson.value = null;
  surfaceHint.value = "";
  geoError.value = "";
  locationNotice.value = "";
  clearUserLocationOverlay();
  if (mapSearchInputRef.value) mapSearchInputRef.value.value = "";
}

watch(
  () => [wizardStep.value, step1Validated.value],
  async ([step, ok]) => {
    if (step === 2 && ok) {
      await nextTick();
      await nextTick();
      await initGoogleMap();
    } else {
      destroyGoogleMap();
    }
  },
);

watch(
  capturedPoints,
  () => {
    if (mapInstance && wizardStep.value === 2) syncMapOverlays();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  destroyGoogleMap();
});

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

function buildGroupSecurityPayload() {
  const weekdayBits = [1, 2, 3, 4, 5, 6, 7].filter((b) => form.calendar.weekdays[b]);
  const ring =
    capturedPoints.value.length >= 4
      ? [
          ...capturedPoints.value.map((p) => [p.lng, p.lat]),
          [capturedPoints.value[0].lng, capturedPoints.value[0].lat],
        ]
      : null;

  const rawPolygon =
    ring != null
      ? {
          type: "Polygon",
          coordinates: [ring],
        }
      : null;

  const g = polygonGeoJson.value;
  const fallbackPolygon = g && typeof g === "object" && g.type ? g : rawPolygon;

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
