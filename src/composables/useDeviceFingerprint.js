/**
 * Empreinte navigateur / appareil (stable : hors chaîne User-Agent brute)
 * + libellé commercial du terminal (Client Hints, UA, estimation iOS).
 */

async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hashToUuid(hex32) {
  const h = hex32.replace(/[^a-f0-9]/gi, "").slice(0, 32).padEnd(32, "0");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function getWebGLParts() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { vendor: "", renderer: "" };
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (!dbg) return { vendor: "webgl", renderer: "unknown" };
    return {
      vendor: String(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || ""),
      renderer: String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || ""),
    };
  } catch {
    return { vendor: "", renderer: "" };
  }
}

/** Rendu canvas déterministe (ASCII uniquement). */
function stableCanvasToken() {
  try {
    const c = document.createElement("canvas");
    c.width = 240;
    c.height = 48;
    const ctx = c.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#424242";
    ctx.fillRect(8, 8, 100, 24);
    ctx.fillStyle = "#1e88e5";
    ctx.font = "14px Arial,Helvetica,sans-serif";
    ctx.fillText("DigiCard device id", 12, 22);
    const g = ctx.createLinearGradient(0, 0, 120, 0);
    g.addColorStop(0, "#ff0000");
    g.addColorStop(1, "#0000ff");
    ctx.fillStyle = g;
    ctx.fillRect(10, 28, 80, 6);
    return c.toDataURL().slice(-160);
  } catch {
    return "";
  }
}

function estimateIosFromScreen() {
  const w = Math.min(screen.width, screen.height);
  const h = Math.max(screen.width, screen.height);
  const dpr = window.devicePixelRatio || 1;
  const key = `${w}x${h}@${dpr}`;
  const map = {
    "375x667@2": "iPhone (6/7/8)",
    "414x736@3": "iPhone Plus (6-8)",
    "375x812@3": "iPhone X / XS / 11 Pro",
    "414x896@2": "iPhone XR / 11",
    "390x844@3": "iPhone 12 / 13 / 14",
    "428x926@3": "iPhone 12 Pro Max / 13 Pro Max / 14 Plus",
    "393x852@3": "iPhone 14 Pro / 15",
    "430x932@3": "iPhone 14 Pro Max / 15 Plus",
    "402x874@3": "iPhone 16",
    "440x956@3": "iPhone 16 Pro Max",
    "768x1024@2": "iPad (classique)",
    "834x1194@2": "iPad Pro 11",
    "1024x1366@2": "iPad Pro 12.9",
  };
  return map[key] || `iPhone ou iPad (${w}x${h}, ${dpr}x)`;
}

/**
 * Nom commercial approximatif (Tecno, Samsung, iPhone, etc.)
 */
export async function getCommercialDeviceModel() {
  const ua = navigator.userAgent || "";

  if (navigator.userAgentData?.getHighEntropyValues) {
    try {
      const ch = await navigator.userAgentData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion",
        "architecture",
      ]);
      const model = (ch.model || "").trim();
      const platform = (ch.platform || navigator.userAgentData.platform || "").trim();
      if (model && !/^generic/i.test(model)) {
        return `${platform} ${model}`.trim();
      }
      if (platform) {
        if (/iPhone|iPad|iOS/i.test(ua) || platform === "iOS") {
          return estimateIosFromScreen();
        }
        return `${platform} (appareil)`;
      }
    } catch {
      /* ignore */
    }
  }

  const androidMatch = ua.match(/Android[\s\d._]+;\s*([^)]+)\)/);
  if (androidMatch) {
    let rest = androidMatch[1].trim();
    if (rest.includes("Build/")) rest = rest.split("Build/")[0].trim();
    return rest || "Android";
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    return estimateIosFromScreen();
  }

  return (navigator.platform || "Navigateur").trim();
}

/**
 * UUID dérivé d'une empreinte stable (distingue deux appareils identiques modèle).
 */
export async function computeFingerprintUuid() {
  const webgl = getWebGLParts();
  const canvasTok = stableCanvasToken();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""])
    .join(",");

  const parts = [
    tz,
    langs,
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth || 0),
    String(window.devicePixelRatio || 1),
    String(navigator.hardwareConcurrency || ""),
    String(navigator.deviceMemory || ""),
    String(navigator.maxTouchPoints ?? ""),
    webgl.vendor,
    webgl.renderer,
    canvasTok,
  ];

  const raw = parts.join("|");
  const hex = await sha256Hex(raw);
  return hashToUuid(hex);
}

/**
 * @returns {Promise<{ uuid: string, model: string }>}
 */
export async function computeDeviceIdentity() {
  const [uuid, model] = await Promise.all([computeFingerprintUuid(), getCommercialDeviceModel()]);
  return { uuid, model: model.slice(0, 250) };
}
