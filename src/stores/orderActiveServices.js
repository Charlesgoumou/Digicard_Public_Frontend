/**
 * État global : services métier actifs pour la commande sélectionnée (ex. Pointage).
 * Alimenté depuis PersonnelView à partir de security_groups / group_security_configs.
 */
import { reactive } from "vue";

function isPointageFullyConfigured(cfg) {
  if (!cfg || typeof cfg !== "object") return false;
  if (!cfg.services?.pointage) return false;
  const poly = cfg.geofence?.polygonGeoJson;
  if (!poly || poly.type !== "Polygon") return false;
  const ring = poly.coordinates?.[0];
  if (!Array.isArray(ring) || ring.length < 4) return false;
  const wd = cfg.calendar?.weekdays;
  if (!Array.isArray(wd) || wd.length < 1) return false;
  return true;
}

export const orderActiveServicesState = reactive({
  /** @type {number|null} */
  orderId: null,
  /** @type {{ slug: string, label: string }[]} */
  services: [],
});

/**
 * @param {Record<string, unknown>|null|undefined} order
 */
export function refreshOrderActiveServices(order) {
  orderActiveServicesState.orderId = order?.id ?? null;
  orderActiveServicesState.services = [];
  if (!order) return;

  const groups = Array.isArray(order.security_groups) ? order.security_groups : [];
  const configs = Array.isArray(order.group_security_configs) ? order.group_security_configs : [];
  const seen = new Set();

  groups.forEach((_, i) => {
    const cfg = configs[i];
    if (isPointageFullyConfigured(cfg) && !seen.has("pointage")) {
      seen.add("pointage");
      orderActiveServicesState.services.push({ slug: "pointage", label: "Pointage" });
    }
  });
}
