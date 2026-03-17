<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
    <div class="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              💳 Mon solde
            </h1>
            <p class="text-slate-400 text-sm mt-1">Consultez votre solde et l'historique des transactions.</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="goBack"
              class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              ← Retour
            </button>
            <button
              @click="refresh"
              :disabled="isLoading"
              class="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-lg"
            >
              {{ isLoading ? 'Actualisation…' : 'Actualiser' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 flex-1">
      <div
        v-if="banner.message"
        class="mb-6 rounded-xl border p-4 text-sm flex items-start justify-between gap-4"
        :class="banner.type === 'success'
          ? 'bg-green-500/10 border-green-500/30 text-green-200'
          : banner.type === 'warning'
            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
            : 'bg-slate-800/60 border-slate-700 text-slate-200'"
      >
        <div class="min-w-0">
          <div class="font-semibold">{{ banner.title }}</div>
          <div class="text-xs mt-1 opacity-90 break-words">{{ banner.message }}</div>
        </div>
        <button class="text-slate-300 hover:text-white" @click="banner = { type: 'info', title: '', message: '' }">✕</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div class="flex items-center justify-between">
            <div class="text-slate-400 text-sm">Solde disponible</div>
            <select
              v-model="currency"
              @change="refresh"
              class="bg-slate-700/60 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="GNF">GNF</option>
              <option value="XOF">XOF</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div class="mt-4">
            <div class="text-4xl font-bold text-sky-400">
              {{ formatMoney(balance) }}
              <span class="text-base text-slate-400 font-semibold">{{ currency }}</span>
            </div>
            <div class="text-xs text-slate-500 mt-2">Balance interne du système (transactions utilisateurs).</div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button
              @click="openDepositModal"
              class="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-4 py-3 rounded-lg text-sm font-semibold border border-slate-600 shadow-lg"
            >
              + Recharger (Mobile Money)
            </button>
            <button
              @click="openWithdrawModal"
              class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg text-sm font-semibold border border-slate-600"
            >
              Retirer
            </button>
          </div>

          <div v-if="error" class="mt-4 bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-sm text-red-300">
            {{ error }}
          </div>
        </div>

        <div class="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-lg font-bold text-white">Historique</h2>
            <div class="text-xs text-slate-400">Dernières {{ transactions.length }} transactions</div>
          </div>
          
          <!-- Onglets rapides -->
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
              :class="filters.status === '' ? 'bg-sky-500/20 border-sky-500/40 text-sky-200' : 'bg-slate-700/40 border-slate-600 text-slate-200 hover:bg-slate-700/60'"
              @click="setQuickStatus('')"
            >
              Tous
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
              :class="filters.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-200' : 'bg-slate-700/40 border-slate-600 text-slate-200 hover:bg-slate-700/60'"
              @click="setQuickStatus('pending')"
            >
              En attente
              <span v-if="pendingCount > 0" class="ml-2 inline-flex items-center justify-center bg-yellow-500 text-slate-900 text-xs font-bold rounded-full px-2 py-0.5">
                {{ pendingCount > 99 ? '99+' : pendingCount }}
              </span>
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
              :class="filters.status === 'completed' ? 'bg-green-500/20 border-green-500/40 text-green-200' : 'bg-slate-700/40 border-slate-600 text-slate-200 hover:bg-slate-700/60'"
              @click="setQuickStatus('completed')"
            >
              Terminés
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
              :class="filters.status === 'failed' ? 'bg-red-500/20 border-red-500/40 text-red-200' : 'bg-slate-700/40 border-slate-600 text-slate-200 hover:bg-slate-700/60'"
              @click="setQuickStatus('failed')"
            >
              Échecs
            </button>
            <div class="flex-1"></div>
            <button
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-slate-700/40 border-slate-600 text-slate-200 hover:bg-slate-700/60 transition-colors"
              @click="exportCsv"
              :disabled="transactions.length === 0"
              title="Exporter les transactions affichées"
            >
              Export CSV
            </button>
          </div>

          <!-- Filtres -->
          <div class="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              v-model="filters.q"
              @input="debouncedReload"
              type="text"
              placeholder="Rechercher (référence, provider, type, statut)…"
              class="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
            <select
              v-model="filters.type"
              @change="reloadTransactions"
              class="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            >
              <option value="">Tous types</option>
              <option value="purchase_debit">Achat</option>
              <option value="sale_credit">Vente</option>
              <option value="deposit_external">Recharge</option>
              <option value="withdraw_external">Retrait</option>
              <option value="adjustment">Ajustement</option>
            </select>
            <select
              v-model="filters.status"
              @change="reloadTransactions"
              class="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            >
              <option value="">Tous statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
              <option value="failed">Échec</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div v-if="isLoading && transactions.length === 0" class="mt-6 text-slate-400">
            Chargement…
          </div>

          <div v-else-if="transactions.length === 0" class="mt-6 text-slate-400">
            Aucune transaction pour le moment.
          </div>

          <div v-else class="mt-4 divide-y divide-slate-700">
            <div
              v-for="tx in transactions"
              :key="tx.id"
              class="py-4 flex items-start justify-between gap-4"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
                      tx.direction === 'credit' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    ]"
                  >
                    {{ tx.direction === 'credit' ? 'CRÉDIT' : 'DÉBIT' }}
                  </span>
                  <span class="text-sm font-semibold text-white">{{ humanizeType(tx.type) }}</span>
                  <span
                    v-if="tx.status && tx.status !== 'completed'"
                    class="text-xs text-slate-400"
                  >
                    ({{ tx.status }})
                  </span>
                </div>
                <div class="text-xs text-slate-400 mt-1">
                  {{ formatDateTime(tx.created_at) }}
                  <span v-if="tx.marketplace_offer_id"> · Offre #{{ tx.marketplace_offer_id }}</span>
                  <span v-if="tx.marketplace_purchase_id"> · Achat #{{ tx.marketplace_purchase_id }}</span>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <div
                  :class="[
                    'text-lg font-bold',
                    tx.direction === 'credit' ? 'text-green-300' : 'text-red-300'
                  ]"
                >
                  {{ tx.direction === 'credit' ? '+' : '-' }}{{ formatMoney(tx.amount, tx.currency) }} {{ tx.currency }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-xs text-slate-500" v-if="nextBeforeId">
              Plus de résultats disponibles.
            </div>
            <div v-else class="text-xs text-slate-500">
              Fin de liste.
            </div>
            <button
              v-if="nextBeforeId"
              @click="loadMore"
              :disabled="isLoadingMore"
              class="bg-slate-700 hover:bg-slate-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {{ isLoadingMore ? 'Chargement…' : 'Charger plus' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Recharge -->
    <div v-if="showDeposit" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="closeModals">
      <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div class="p-4 border-b border-slate-700 flex items-center justify-between">
          <div class="font-bold">Recharger via Mobile Money</div>
          <button class="text-slate-400 hover:text-white" @click="closeModals">✕</button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm text-slate-300 mb-2">Montant</label>
            <input v-model="depositAmount" type="number" min="0.5" step="0.01"
              class="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div class="text-xs text-slate-400">
            Vous serez redirigé vers la page de paiement Chap Chap Pay.
          </div>
          <div v-if="actionError" class="bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-sm text-red-300">
            {{ actionError }}
          </div>
          <div class="flex gap-3">
            <button class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg" @click="closeModals">
              Annuler
            </button>
            <button class="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-2 rounded-lg font-semibold"
              :disabled="isActionLoading"
              @click="initiateDeposit">
              {{ isActionLoading ? 'Ouverture…' : 'Continuer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Retrait -->
    <div v-if="showWithdraw" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" @click.self="closeModals">
      <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div class="p-4 border-b border-slate-700 flex items-center justify-between">
          <div class="font-bold">Retirer vers Mobile Money</div>
          <button class="text-slate-400 hover:text-white" @click="closeModals">✕</button>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm text-slate-300 mb-2">Montant</label>
            <input v-model="withdrawAmount" type="number" min="0.5" step="0.01"
              class="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-slate-300 mb-2">Opérateur</label>
              <select v-model="withdrawProvider"
                class="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="mtn">MTN</option>
                <option value="orange">Orange</option>
                <option value="wave">Wave</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-slate-300 mb-2">Numéro</label>
              <input v-model="withdrawDestination" type="text" placeholder="Ex: 6XXXXXXXX"
                class="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
          <div v-if="actionError" class="bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-sm text-red-300">
            {{ actionError }}
          </div>
          <div class="flex gap-3">
            <button class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg" @click="closeModals">
              Annuler
            </button>
            <button class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold"
              :disabled="isActionLoading"
              @click="initiateWithdraw">
              {{ isActionLoading ? 'Envoi…' : 'Valider' }}
            </button>
          </div>
          <div class="text-xs text-slate-400">
            Le retrait est créé en attente. L’intégration provider sera finalisée via webhook.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const error = ref('');
const currency = ref('GNF');
const balance = ref(0);
const transactions = ref([]);
const nextBeforeId = ref(null);
const isLoadingMore = ref(false);
const filters = ref({ q: '', type: '', status: '' });
const qTimeout = ref(null);

const showDeposit = ref(false);
const showWithdraw = ref(false);
const depositAmount = ref(10);
const withdrawAmount = ref(10);
const withdrawProvider = ref('mtn');
const withdrawDestination = ref('');
const isActionLoading = ref(false);
const actionError = ref('');

const banner = ref({ type: 'info', title: '', message: '' });
const polling = ref({ active: false, secondsLeft: 0 });
const pollTimer = ref(null);

const formatMoney = (value, ccy = currency.value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  const upper = String(ccy || '').toUpperCase();
  const digits = (upper === 'GNF' || upper === 'XOF') ? 0 : 2;
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
};

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};

const humanizeType = (type) => {
  switch (type) {
    case 'purchase_debit': return 'Achat (débit)';
    case 'sale_credit': return 'Vente (crédit)';
    case 'deposit_external': return 'Recharge';
    case 'withdraw_external': return 'Retrait';
    case 'adjustment': return 'Ajustement';
    default: return type || 'Transaction';
  }
};

const pendingCount = computed(() => {
  return (transactions.value || []).filter((t) => t?.status === 'pending').length;
});

const refresh = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const walletRes = await apiClient.get('/api/wallet', { params: { currency: currency.value } });
    balance.value = walletRes.data?.balance ?? 0;
  } catch (e) {
    console.error('Erreur chargement wallet:', e);
    error.value = e?.response?.data?.message || 'Erreur lors du chargement du solde.';
  } finally {
    isLoading.value = false;
  }
};

const fetchTransactions = async ({ append = false } = {}) => {
  const params = {
    currency: currency.value,
    limit: 30,
    ...(filters.value.q ? { q: filters.value.q } : {}),
    ...(filters.value.type ? { type: filters.value.type } : {}),
    ...(filters.value.status ? { status: filters.value.status } : {}),
    ...(append && nextBeforeId.value ? { before_id: nextBeforeId.value } : {}),
  };
  const res = await apiClient.get('/api/wallet/transactions', { params });
  const items = res.data?.transactions ?? [];
  const next = res.data?.next_before_id ?? null;
  if (append) transactions.value = [...transactions.value, ...items];
  else transactions.value = items;
  nextBeforeId.value = next;
};

const reloadTransactions = async () => {
  nextBeforeId.value = null;
  await fetchTransactions({ append: false });
};

const setQuickStatus = async (status) => {
  filters.value.status = status;
  await reloadTransactions();
};

const debouncedReload = () => {
  if (qTimeout.value) clearTimeout(qTimeout.value);
  qTimeout.value = setTimeout(() => {
    reloadTransactions();
  }, 300);
};

const exportCsv = () => {
  const rows = transactions.value || [];
  if (rows.length === 0) return;

  const escapeCsv = (v) => {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };

  const header = [
    'id',
    'created_at',
    'direction',
    'type',
    'status',
    'amount',
    'currency',
    'external_provider',
    'external_reference',
    'marketplace_offer_id',
    'marketplace_purchase_id',
  ];

  const lines = [header.join(',')].concat(
    rows.map((t) => {
      const data = [
        t.id,
        t.created_at,
        t.direction,
        t.type,
        t.status,
        t.amount,
        t.currency,
        t.external_provider,
        t.external_reference,
        t.marketplace_offer_id,
        t.marketplace_purchase_id,
      ];
      return data.map(escapeCsv).join(',');
    }),
  );

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wallet-transactions-${currency.value}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

const loadMore = async () => {
  if (!nextBeforeId.value || isLoadingMore.value) return;
  isLoadingMore.value = true;
  try {
    await fetchTransactions({ append: true });
  } finally {
    isLoadingMore.value = false;
  }
};

const isPendingRelevantTx = computed(() => {
  const list = transactions.value || [];
  return list.some((t) => t?.status === 'pending' && (t.type === 'deposit_external' || t.type === 'withdraw_external'));
});

const stopPolling = () => {
  polling.value.active = false;
  polling.value.secondsLeft = 0;
  if (pollTimer.value) {
    clearInterval(pollTimer.value);
    pollTimer.value = null;
  }
};

const startPolling = (reason = 'update') => {
  // Poller 30s max, toutes les 3s (10 itérations)
  stopPolling();
  polling.value.active = true;
  polling.value.secondsLeft = 30;

  banner.value = {
    type: 'info',
    title: 'Mise à jour en cours…',
    message: reason === 'deposit_return'
      ? 'Nous vérifions automatiquement le statut de votre recharge (cela peut prendre quelques secondes).'
      : 'Nous vérifions automatiquement le statut de vos transactions en attente.',
  };

  pollTimer.value = setInterval(async () => {
    polling.value.secondsLeft = Math.max(0, polling.value.secondsLeft - 3);
    await refresh();

    // Si plus de pending, on arrête
    if (!isPendingRelevantTx.value) {
      banner.value = {
        type: 'success',
        title: 'Mise à jour terminée',
        message: 'Votre solde et vos transactions ont été synchronisés.',
      };
      stopPolling();
      return;
    }

    // Timeout
    if (polling.value.secondsLeft <= 0) {
      banner.value = {
        type: 'warning',
        title: 'Toujours en attente',
        message: 'La transaction est encore en cours. Réessayez “Actualiser” dans quelques instants.',
      };
      stopPolling();
    }
  }, 3000);
};

const closeModals = () => {
  showDeposit.value = false;
  showWithdraw.value = false;
  actionError.value = '';
  isActionLoading.value = false;
};

const openDepositModal = () => {
  closeModals();
  showDeposit.value = true;
};

const openWithdrawModal = () => {
  closeModals();
  showWithdraw.value = true;
};

const initiateDeposit = async () => {
  if (isActionLoading.value) return;
  actionError.value = '';
  isActionLoading.value = true;
  try {
    const res = await apiClient.post('/api/wallet/deposit/chapchappay', {
      amount: Number(depositAmount.value),
      currency: currency.value,
    });
    const url = res.data?.payment_url;
    if (!url) {
      actionError.value = 'Lien de paiement indisponible.';
      return;
    }
    // Ouvrir le lien (nouvel onglet)
    window.open(url, '_blank', 'noopener');
    closeModals();
    // Montrer une info et activer le polling si l'utilisateur revient ici
    banner.value = {
      type: 'info',
      title: 'Recharge initiée',
      message: 'Après paiement, revenez sur cette page: la mise à jour sera automatique.',
    };
  } catch (e) {
    console.error('Erreur init recharge:', e);
    actionError.value = e?.response?.data?.message || 'Erreur lors de l’initiation de la recharge.';
  } finally {
    isActionLoading.value = false;
  }
};

const initiateWithdraw = async () => {
  if (isActionLoading.value) return;
  actionError.value = '';
  isActionLoading.value = true;
  try {
    await apiClient.post('/api/wallet/withdraw', {
      amount: Number(withdrawAmount.value),
      currency: currency.value,
      provider: withdrawProvider.value,
      destination: withdrawDestination.value,
    });
    closeModals();
    await refresh();
    // Si un retrait est pending, lancer un polling (webhook)
    if (isPendingRelevantTx.value) {
      startPolling('update');
    } else {
      banner.value = {
        type: 'success',
        title: 'Retrait pris en compte',
        message: 'Votre demande de retrait a été envoyée. Vous recevrez la mise à jour dès confirmation.',
      };
    }
  } catch (e) {
    console.error('Erreur init retrait:', e);
    actionError.value = e?.response?.data?.message || 'Erreur lors de l’initiation du retrait.';
  } finally {
    isActionLoading.value = false;
  }
};

const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push({ name: 'Marketplace' });
};

const handleDepositReturn = async () => {
  // Retour depuis Chap Chap Pay
  const deposit = route.query?.deposit;
  const ref = route.query?.ref;
  if (deposit === 'return') {
    banner.value = {
      type: 'info',
      title: 'Retour paiement',
      message: ref ? `Référence: ${String(ref)}` : 'Nous allons vérifier le statut de la recharge.',
    };
    await refresh();
    if (isPendingRelevantTx.value) {
      startPolling('deposit_return');
    } else {
      banner.value = {
        type: 'success',
        title: 'Recharge synchronisée',
        message: 'Votre solde a été mis à jour.',
      };
    }
  }
};

onMounted(async () => {
  await refresh();
  await reloadTransactions();
  await handleDepositReturn();
  // Si on arrive sur la page avec des pending, lancer un polling léger
  if (isPendingRelevantTx.value) startPolling('update');
});

watch(
  () => route.query,
  async () => {
    await handleDepositReturn();
  },
);

onUnmounted(() => {
  stopPolling();
});
</script>

