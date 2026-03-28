"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BannerPreview } from "@/components/BannerPreview";
import { saveBanner, getStoredBanners } from "@/lib/storage";
import type { BackgroundPosition, BannerData, BannerFormat } from "@/lib/banner-types";
import { BANNER_SIZES, DEFAULT_BENEFITS } from "@/lib/banner-types";
import { Download, Plus, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";

const FORMATS: { value: BannerFormat; label: string }[] = [
  { value: "640x134", label: "640×134 (мобильная)" },
  { value: "1456x180", label: "1456×180 (десктоп)" },
  { value: "300x250", label: "300×250 (средний прямоугольник)" },
  { value: "600x600", label: "600×600 (квадрат)" },
];

const ACCENT_COLORS = ["#FF9100", "#007AFF", "#34C759", "#AF52DE", "#FF3B30"];

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200";

function createNewBanner(): BannerData {
  return {
    id: crypto.randomUUID(),
    format: "640x134",
    headline: "СДЕЛАЛИ ПЕРЕПЛАНИРОВКУ И БОИТЕСЬ ШТРАФА?",
    subheadline: "Поможем узаконить и согласовать без лишней бюрократии",
    benefits: [...DEFAULT_BENEFITS],
    accentColor: "#FF9100",
    backgroundImage: DEFAULT_BG,
    backgroundPosition: "center",
    createdAt: new Date().toISOString(),
  };
}

export function ConstructorContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [banner, setBanner] = useState<BannerData>(createNewBanner);
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BG);
  const [backgroundPosition, setBackgroundPosition] = useState<BackgroundPosition>("center");
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "webp">("png");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editId) {
      const found = getStoredBanners().find((b) => b.id === editId);
      if (found) {
        setBanner(found);
        setBackgroundUrl(found.backgroundImage || DEFAULT_BG);
        setBackgroundPosition(found.backgroundPosition ?? "center");
      }
    }
  }, [editId]);

  const updateBanner = useCallback((updates: Partial<BannerData>) => {
    setBanner((b) => ({ ...b, ...updates }));
  }, []);

  const addBenefit = () => {
    updateBanner({ benefits: [...banner.benefits, "Новый пункт"] });
  };

  const removeBenefit = (i: number) => {
    if (banner.benefits.length <= 1) return;
    updateBanner({
      benefits: banner.benefits.filter((_, idx) => idx !== i),
    });
  };

  const handleSave = () => {
    const withBg = backgroundUrl
      ? { ...banner, backgroundImage: backgroundUrl, backgroundPosition }
      : banner;
    saveBanner(withBg);
    alert("Баннер сохранён в «Созданные»");
  };

  const handleDownload = async () => {
    const el = previewRef.current;
    if (!el) return;
    const { w, h } = BANNER_SIZES[banner.format];
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: w,
        height: h,
      });
      const link = document.createElement("a");
      const mime =
        downloadFormat === "jpeg"
          ? "image/jpeg"
          : downloadFormat === "webp"
            ? "image/webp"
            : "image/png";
      const quality = downloadFormat === "png" ? undefined : 0.95;
      link.download = `banner-${banner.format}-${Date.now()}.${downloadFormat === "jpeg" ? "jpg" : downloadFormat}`;
      link.href = canvas.toDataURL(mime, quality);
      link.click();
    } catch (e) {
      console.error(e);
      alert("Ошибка экспорта");
    }
  };

  const handleBackgroundFileUpload = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Выберите изображение (JPG/PNG/WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setBackgroundUrl(result);
      updateBanner({ backgroundImage: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Конструктор баннера</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Формат
            </label>
            <select
              value={banner.format}
              onChange={(e) =>
                updateBanner({ format: e.target.value as BannerFormat })
              }
              className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={banner.headline}
              onChange={(e) => updateBanner({ headline: e.target.value })}
              placeholder="СДЕЛАЛИ ПЕРЕПЛАНИРОВКУ И БОИТЕСЬ ШТРАФА?"
              className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                Позиция фона
              </label>
              <select
                value={backgroundPosition}
                onChange={(e) => setBackgroundPosition(e.target.value as BackgroundPosition)}
                className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
              >
                <option value="top">Верх</option>
                <option value="center">Центр</option>
                <option value="bottom">Низ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Подзаголовок (оранжевый/синий блок)
            </label>
            <input
              type="text"
              value={banner.subheadline}
              onChange={(e) => updateBanner({ subheadline: e.target.value })}
              placeholder="Поможем узаконить и согласовать..."
              className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Цвет акцента
            </label>
            <div className="flex gap-2 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateBanner({ accentColor: c })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    banner.accentColor === c
                      ? "border-white scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Логотип / бренд (правый нижний угол)
            </label>
            <input
              type="text"
              value={banner.logoText || ""}
              onChange={(e) => updateBanner({ logoText: e.target.value || undefined })}
              placeholder="ПРОЕКТОР • 20 лет на рынке"
              className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Фоновое изображение (URL)
            </label>
            <input
              type="url"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
            <label className="block text-sm font-medium text-[#a1a1a6] mt-3 mb-2">
              Или загрузить с устройства
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => handleBackgroundFileUpload(e.target.files?.[0] ?? null)}
              className="w-full px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand-orange)] file:px-3 file:py-1 file:text-white file:cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#a1a1a6]">
                Преимущества
              </label>
              <button
                type="button"
                onClick={addBenefit}
                className="text-sm text-[var(--brand-orange)] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
            <div className="space-y-2">
              {banner.benefits.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const next = [...banner.benefits];
                      next[i] = e.target.value;
                      updateBanner({ benefits: next });
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#161616] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(i)}
                    disabled={banner.benefits.length <= 1}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as "png" | "jpeg" | "webp")}
              className="px-3 py-2 rounded-lg bg-[#161616] border border-white/20 text-white"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WEBP</option>
            </select>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[var(--brand-orange)] text-white font-medium hover:opacity-90"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5"
            >
              <Download className="w-4 h-4" /> Скачать PNG
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <p className="text-sm text-[#a1a1a6] mb-3">Предпросмотр</p>
          <div className="border border-white/10 overflow-hidden shadow-lg rounded">
            <div ref={previewRef} className="inline-block">
              <BannerPreview
                data={{
                  ...banner,
                  backgroundPosition,
                  backgroundImage: backgroundUrl || banner.backgroundImage,
                }}
                scale={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
