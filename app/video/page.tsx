"use client";

import { useState, useEffect } from "react";
import { BannerPreview } from "@/components/BannerPreview";
import { getStoredBanners } from "@/lib/storage";
import type { BannerData } from "@/lib/banner-types";
import { Video, Loader2 } from "lucide-react";

export default function VideoPage() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<BannerData | null>(null);
  const [sourceType, setSourceType] = useState<"banner" | "image">("banner");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);
  const [animType, setAnimType] = useState<"slide" | "fade" | "scale">("slide");
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    setBanners(getStoredBanners());
  }, []);

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Выберите изображение (JPG/PNG/WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) return;
      setUploadedImageData(result);
      setSourceType("image");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (sourceType === "banner" && !selectedBanner) {
      alert("Выберите баннер из «Созданные»");
      return;
    }
    if (sourceType === "image" && !uploadedImageData && !imageUrl.trim()) {
      alert("Загрузите фото с устройства или вставьте URL");
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType,
          banner: sourceType === "banner" ? selectedBanner : null,
          imageSource: sourceType === "image" ? (uploadedImageData || imageUrl.trim()) : null,
          animType,
          duration,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка генерации видео");
      }

      const data = await res.json();
      setVideoUrl(data.url || null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Генератор видео по банеру</h1>

      <div className="mb-6 p-6 rounded-2xl border border-white/10 bg-[#161616]">
        <p className="text-sm text-[#a1a1a6] mb-4">
          Выберите источник (баннер или фото) и настройте анимацию. Видео создаётся
          как слайд-шоу/простая motion-анимация (текст выезжает, плавное появление).
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Источник для видео
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSourceType("banner")}
                className={`px-4 py-2 rounded-lg border ${
                  sourceType === "banner"
                    ? "bg-[var(--brand-orange)] border-[var(--brand-orange)] text-white"
                    : "bg-[#0a0a0a] border-white/10 text-white"
                }`}
              >
                Баннер
              </button>
              <button
                type="button"
                onClick={() => setSourceType("image")}
                className={`px-4 py-2 rounded-lg border ${
                  sourceType === "image"
                    ? "bg-[var(--brand-orange)] border-[var(--brand-orange)] text-white"
                    : "bg-[#0a0a0a] border-white/10 text-white"
                }`}
              >
                Фото / Картинка
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Баннер из «Созданные»
            </label>
            {sourceType === "banner" && banners.length === 0 ? (
              <p className="text-sm text-[#6b6b70]">
                Нет сохранённых баннеров. Создайте баннер в Конструкторе или
                Генераторе и сохраните его.
              </p>
            ) : sourceType === "banner" ? (
              <div className="flex flex-wrap gap-3">
                {banners.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBanner(b)}
                    className={`block rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBanner?.id === b.id
                        ? "border-[var(--brand-orange)]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <BannerPreview data={b} scale={0.3} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL изображения (https://...)"
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
                />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand-orange)] file:px-3 file:py-1 file:text-white file:cursor-pointer"
                />
                {(uploadedImageData || imageUrl) && (
                  <img
                    src={uploadedImageData || imageUrl}
                    alt="Источник для видео"
                    className="max-w-xs rounded-lg border border-white/10"
                  />
                )}
              </div>
            )}
          </div>

          {(sourceType === "image" || selectedBanner) && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                  Тип анимации
                </label>
                <select
                  value={animType}
                  onChange={(e) =>
                    setAnimType(e.target.value as "slide" | "fade" | "scale")
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
                >
                  <option value="slide">Текст выезжает слева</option>
                  <option value="fade">Плавное появление</option>
                  <option value="scale">Масштабирование</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                  Длительность (сек)
                </label>
                <input
                  type="number"
                  min={3}
                  max={15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) || 5)}
                  className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--brand-orange)] text-white font-medium hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Генерация...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" /> Создать видео
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {videoUrl && (
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-6">
          <h2 className="font-semibold mb-3">Готовое видео</h2>
          <video
            src={videoUrl}
            controls
            className="w-full max-w-lg rounded-lg"
          />
          <a
            href={videoUrl}
            download="banner-video.mp4"
            className="inline-block mt-3 text-sm text-[var(--brand-orange)] hover:underline"
          >
            Скачать видео
          </a>
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-200">
        <strong>Примечание:</strong> Для полноценной генерации видео нужен backend с
        FFmpeg или внешний сервис (Remotion, fal.ai и т.п.). Сейчас поддержаны
        оба типа источника: сохранённый баннер и загруженная картинка/фото.
      </div>
    </div>
  );
}
