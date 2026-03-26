"use client";

import { useState, useEffect, useRef } from "react";
import { BannerPreview } from "@/components/BannerPreview";
import { getStoredBanners, deleteBanner } from "@/lib/storage";
import type { BannerData } from "@/lib/banner-types";
import { Download, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";
import Link from "next/link";
import { BANNER_SIZES } from "@/lib/banner-types";

export default function CreatedPage() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const refsMap = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setBanners(getStoredBanners());
  }, []);

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    refsMap.current[id] = el;
  };

  const handleDownload = async (banner: BannerData) => {
    const el = refsMap.current[banner.id];
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
      link.download = `banner-${banner.format}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
      alert("Ошибка экспорта");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить баннер?")) {
      deleteBanner(id);
      setBanners(getStoredBanners());
    }
  };

  if (banners.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Созданные</h1>
        <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#161616]">
          <p className="text-[#a1a1a6] mb-4">Пока нет сохранённых баннеров</p>
          <Link
            href="/builder"
            className="text-[var(--brand-orange)] hover:underline"
          >
            Создать в Конструкторе
          </Link>
          {" или "}
          <Link
            href="/generator"
            className="text-[var(--brand-orange)] hover:underline"
          >
            сгенерировать через AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Созданные</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="p-4 rounded-2xl border border-white/10 bg-[#161616]"
          >
            <div
              ref={setRef(banner.id)}
              className="mb-4 rounded-lg overflow-hidden border border-white/5"
            >
              <BannerPreview data={banner} scale={0.5} />
            </div>
            <p className="text-sm text-[#a1a1a6] mb-3 truncate">{banner.headline}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/builder?edit=${banner.id}`}
                className="flex-1 text-center px-3 py-2 rounded-lg bg-white/5 text-sm font-medium hover:bg-white/10"
              >
                Редактировать
              </Link>
              <button
                type="button"
                onClick={() => handleDownload(banner)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5"
              >
                <Download className="w-4 h-4" /> Скачать
              </button>
              <button
                type="button"
                onClick={() => handleDelete(banner.id)}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/20"
                aria-label="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

