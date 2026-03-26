"use client";

import { useState } from "react";
import { BannerPreview } from "@/components/BannerPreview";
import { saveBanner } from "@/lib/storage";
import type { BannerData, BannerFormat, BannerTemplate } from "@/lib/banner-types";
import { NICHE_PRESETS } from "@/lib/niche-presets";
import { Sparkles, Loader2, Zap } from "lucide-react";

const FORMATS: { value: BannerFormat; label: string }[] = [
  { value: "640x134", label: "640×134 (моб.)" },
  { value: "1456x180", label: "1456×180 (десктоп)" },
  { value: "300x250", label: "300×250" },
  { value: "600x600", label: "600×600 (квадрат)" },
];

export default function GeneratorPage() {
  const initPreset = NICHE_PRESETS.find((p) => p.id === "realty") ?? NICHE_PRESETS[0];
  const [nicheId, setNicheId] = useState("realty");
  const [headline, setHeadline] = useState(initPreset.headlineExamples[0] ?? "");
  const [subheadline, setSubheadline] = useState(initPreset.subheadlineExamples[0] ?? "");
  const [benefits, setBenefits] = useState<string[]>([...initPreset.benefitExamples]);
  const [format, setFormat] = useState<BannerFormat>("600x600");
  const [accentColor, setAccentColor] = useState(initPreset.accentColors[0] ?? "#FF9100");
  const [logoText, setLogoText] = useState("");
  const [template, setTemplate] = useState<BannerTemplate>("yandex-direct");
  const [generateImage, setGenerateImage] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BannerData | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const preset = NICHE_PRESETS.find((p) => p.id === nicheId) ?? NICHE_PRESETS[0];

  const applyPreset = () => {
    setHeadline(preset.headlineExamples[0] ?? "");
    setSubheadline(preset.subheadlineExamples[0] ?? "");
    setBenefits([...preset.benefitExamples]);
    setAccentColor(preset.accentColors[0] ?? "#FF9100");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProvider(null);
    setWarnings([]);

    try {
      const res = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nicheId,
          headline: headline || undefined,
          subheadline: subheadline || undefined,
          benefits: benefits.length ? benefits : undefined,
          format,
          accentColor,
          logoText: logoText || undefined,
          template,
          generateImage,
          customPrompt: customPrompt || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка генерации");
      }

      const data = await res.json();
      setResult(data.banner);
      setProvider(data?.meta?.backgroundProvider ?? null);
      setWarnings(data?.meta?.warnings ?? []);
      saveBanner(data.banner);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при генерации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Профессиональный генератор карточек</h1>
      <p className="text-[#a1a1a6] text-sm mb-6">
        Стиль Ozon / Wildberries — для любой ниши: недвижимость, банкротство, игрушки,
        косметика, авто и др.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Ниша
            </label>
            <select
              value={nicheId}
              onChange={(e) => {
                const newId = e.target.value;
                setNicheId(newId);
                const p = NICHE_PRESETS.find((x) => x.id === newId) ?? NICHE_PRESETS[0];
                setHeadline(p.headlineExamples[0] ?? "");
                setSubheadline(p.subheadlineExamples[0] ?? "");
                setBenefits([...p.benefitExamples]);
                setAccentColor(p.accentColors[0] ?? "#FF9100");
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            >
              {NICHE_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={applyPreset}
              className="mt-2 text-xs text-[var(--brand-orange)] hover:underline"
            >
              Подставить примеры из ниши
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder={preset.headlineExamples[0]}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Подзаголовок (кнопка/блок)
            </label>
            <input
              type="text"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder={preset.subheadlineExamples[0]}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Преимущества (через запятую)
            </label>
            <input
              type="text"
              value={benefits.join(", ")}
              onChange={(e) => setBenefits(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Бесплатная консультация, Под ключ, Гарантия"
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Цвет акцента
            </label>
            <div className="flex gap-2 flex-wrap">
              {preset.accentColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccentColor(c)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    accentColor === c ? "border-white scale-110" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Шаблон
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as BannerTemplate)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            >
              <option value="yandex-direct">Yandex Direct</option>
              <option value="ozon-card">Ozon Card</option>
              <option value="wb-card">WB Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Формат
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as BannerFormat)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
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
              Логотип (правый нижний угол)
            </label>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="ПРОЕКТОР • 20 лет"
              className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white placeholder:text-[#6b6b70] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#161616] p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Сгенерировать фон через AI (fal.ai)</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </label>
            {generateImage && (
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Напр: modern office, professional"
                className="mt-2 w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-sm text-white placeholder:text-[#6b6b70]"
              />
            )}
            <p className="mt-1 text-xs text-[#6b6b70]">
              Прод-цепочка: ComfyUI → Pollinations → fal.ai → SVG fallback.
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-orange)] text-white font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Генерация...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Создать карточку
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <p className="text-sm text-[#a1a1a6] mb-3">Предпросмотр</p>
          {result ? (
            <div className="border border-white/10 overflow-hidden shadow-xl rounded-lg">
              <BannerPreview data={result} scale={1} />
            </div>
          ) : (
            <div className="w-full max-w-[400px] aspect-square rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[#6b6b70] text-sm">
              Заполните поля и нажмите «Создать карточку»
            </div>
          )}
          {result && (
            <p className="mt-3 text-sm text-[#a1a1a6]">
              Карточка сохранена в «Созданные». Откройте в Конструкторе для правок.
            </p>
          )}
          {provider && (
            <p className="mt-1 text-xs text-[#6b6b70]">
              Источник фона: <span className="text-white">{provider}</span>
            </p>
          )}
          {warnings.length > 0 && (
            <div className="mt-2 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200">
              {warnings.map((w, i) => (
                <p key={`${w}-${i}`}>- {w}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
