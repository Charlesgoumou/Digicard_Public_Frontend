import { reactive } from "vue";
import apiClient from "@/api";
import { getOrCreateDeviceIdentity, DEVICE_SEAL_LS_PREFIX } from "@/composables/useDeviceFingerprint";

/** État pour bannière (paramètres, dashboard) / futur pointage */
export const orderDeviceTrustState = reactive({
  orderId: null,
  blocked: false,
  message: "",
});

function writeStored(orderId, uuid, model) {
  try {
    localStorage.setItem(`${DEVICE_SEAL_LS_PREFIX}_${orderId}`, JSON.stringify({ uuid, model, t: Date.now() }));
  } catch {
    /* quota / private mode */
  }
}

async function setCsrfHeader() {
  await apiClient.get("/sanctum/csrf-cookie");
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match?.[1]) {
    apiClient.defaults.headers.common["X-XSRF-TOKEN"] = decodeURIComponent(match[1]);
  }
}

function clearCsrfHeader() {
  delete apiClient.defaults.headers.common["X-XSRF-TOKEN"];
}

function isBusinessEmployeeOrder(order, user) {
  if (!order?.id || user?.role !== "employee") return false;
  return order.order_type === "business";
}

function isConfiguredForOrder(order) {
  return order.is_configured === true || order.employee_is_configured === true;
}

/**
 * Logique pure (une commande). Ne modifie pas orderDeviceTrustState.
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function executeTrustForOrder(order, user) {
  if (!isBusinessEmployeeOrder(order, user)) {
    return { ok: true };
  }
  if (!isConfiguredForOrder(order)) {
    return { ok: true };
  }

  const serverUuid = order.employee_profile?.device_uuid || null;
  const { uuid: currentUuid, model: currentModel } = await getOrCreateDeviceIdentity(order.id);

  try {
    if (!serverUuid) {
      await setCsrfHeader();
      await apiClient.post(`/api/orders/${order.id}/seal-device`, {
        device_uuid: currentUuid,
        device_model: currentModel,
      });
      writeStored(order.id, currentUuid, currentModel);
      return { ok: true };
    }

    if (currentUuid === serverUuid) {
      writeStored(order.id, currentUuid, currentModel);
      return { ok: true };
    }

    return {
      ok: false,
      message:
        "Appareil non reconnu. Utilisez l’appareil déjà enregistré pour cette commande ou demandez à votre administrateur une réinitialisation.",
    };
  } catch (e) {
    console.warn("executeTrustForOrder:", e);
    const st = e.response?.status;
    if (st === 409) {
      return {
        ok: false,
        message:
          "Appareil non reconnu. Un autre téléphone est déjà lié à cette commande, ou la liaison a échoué.",
      };
    }
    if (!serverUuid) {
      return {
        ok: false,
        message: "Impossible de lier cet appareil à la commande. Réessayez ou contactez le support.",
      };
    }
    return { ok: true };
  } finally {
    clearCsrfHeader();
  }
}

/** Après chargement GET /api/orders/:id (paramètres) */
export async function syncOrderDeviceTrust(order, user) {
  orderDeviceTrustState.orderId = order?.id ?? null;
  orderDeviceTrustState.blocked = false;
  orderDeviceTrustState.message = "";
  const r = await executeTrustForOrder(order, user);
  if (!r.ok) {
    orderDeviceTrustState.blocked = true;
    orderDeviceTrustState.message = r.message || "Appareil non reconnu.";
  }
  return r;
}

/** Après GET /api/orders (liste employé) — vérifie chaque commande métier configurée */
export async function syncAllEmployeeOrdersDeviceTrust(orders, user) {
  orderDeviceTrustState.blocked = false;
  orderDeviceTrustState.message = "";
  orderDeviceTrustState.orderId = null;
  if (user?.role !== "employee" || !Array.isArray(orders)) {
    return;
  }
  for (const o of orders) {
    if (o.order_type !== "business") continue;
    if (!isConfiguredForOrder(o)) continue;
    const r = await executeTrustForOrder(o, user);
    if (!r.ok) {
      orderDeviceTrustState.blocked = true;
      orderDeviceTrustState.message = r.message || "Appareil non reconnu.";
      orderDeviceTrustState.orderId = o.id;
      break;
    }
  }
}
