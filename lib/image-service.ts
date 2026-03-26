/**
 * Прод-цепочка генерации фона:
 * ComfyUI (локально) -> Pollinations (бесплатный облачный) -> fal.ai -> SVG fallback.
 */

const FAL_FLUX_MODEL = "fal-ai/flux/dev";
type BackgroundProvider = "comfyui" | "pollinations" | "fal" | "svg";

interface BackgroundResult {
  url: string;
  provider: BackgroundProvider;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function tryComfyUi(prompt: string, width: number, height: number): Promise<string | null> {
  const comfyUrl = process.env.COMFYUI_URL;
  if (!comfyUrl) return null;

  // Универсальный endpoint-override: можно подставить свой API-comfy адаптер.
  const endpoint =
    process.env.COMFYUI_TXT2IMG_ENDPOINT ||
    `${comfyUrl.replace(/\/$/, "")}/generate`;

  try {
    const res = await fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          width,
          height,
        }),
      },
      Number(process.env.COMFYUI_TIMEOUT_MS || 30000)
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.imageUrl || data?.url || null;
  } catch {
    return null;
  }
}

async function tryPollinations(prompt: string, width: number, height: number): Promise<string | null> {
  // Бесплатный вариант без ключа
  try {
    const model = process.env.POLLINATIONS_MODEL || "flux";
    const seed = Math.floor(Math.random() * 1_000_000);
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
      `?model=${encodeURIComponent(model)}&width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    // Делаем cheap healthcheck, чтобы не возвращать мертвую ссылку
    const check = await fetchWithTimeout(url, { method: "HEAD" }, 12000);
    if (!check.ok) return null;
    return url;
  } catch {
    return null;
  }
}

async function tryFal(prompt: string, width: number, height: number): Promise<string | null> {
  const key = process.env.FAL_KEY;
  if (!key || key === "YOUR_FAL_API_KEY") return null;

  try {
    const res = await fetchWithTimeout(
      `https://queue.fal.run/${FAL_FLUX_MODEL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${key}`,
        },
        body: JSON.stringify({
          prompt: `${prompt}, professional photography, high quality, commercial use, no text`,
          image_size: { width, height },
          num_inference_steps: 28,
          num_images: 1,
        }),
      },
      25000
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.images?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

export async function generateBackgroundImage(
  prompt: string,
  width: number,
  height: number
): Promise<BackgroundResult> {
  const comfy = await tryComfyUi(prompt, width, height);
  if (comfy) return { url: comfy, provider: "comfyui" };

  const pollinations = await tryPollinations(prompt, width, height);
  if (pollinations) return { url: pollinations, provider: "pollinations" };

  const fal = await tryFal(prompt, width, height);
  if (fal) return { url: fal, provider: "fal" };

  return {
    url: getStockImageForNiche("custom", [], width, height),
    provider: "svg",
  };
}

function toDataUri(svg: string) {
  // encodeURIComponent, но оставляем запятые/двоеточия читабельными
  const encoded = encodeURIComponent(svg)
    .replace(/%0A/g, "")
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export function getStockImageForNiche(
  nicheId: string,
  presets: { id: string; accentColors: string[] }[],
  width: number,
  height: number
): string {
  const preset = presets.find((p) => p.id === nicheId);
  const accent = preset?.accentColors?.[0] ?? "#FF9100";
  const accent2 = preset?.accentColors?.[1] ?? "#007AFF";

  // Универсальный фон в стиле маркетплейса (градиент + мягкие формы)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b0c"/>
      <stop offset="0.55" stop-color="#151518"/>
      <stop offset="1" stop-color="#0b0b0c"/>
    </linearGradient>
    <radialGradient id="r1" cx="30%" cy="25%" r="70%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.60"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="r2" cx="75%" cy="80%" r="75%">
      <stop offset="0" stop-color="${accent2}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${accent2}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${Math.max(18, Math.round(Math.min(width, height) * 0.05))}"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${Math.round(width * 0.2)}" cy="${Math.round(height * 0.18)}" r="${Math.round(
    Math.min(width, height) * 0.45
  )}" fill="url(#r1)" filter="url(#blur)"/>
  <circle cx="${Math.round(width * 0.82)}" cy="${Math.round(height * 0.82)}" r="${Math.round(
    Math.min(width, height) * 0.5
  )}" fill="url(#r2)" filter="url(#blur)"/>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#000" opacity="0.08"/>
</svg>`;

  return toDataUri(svg);
}
