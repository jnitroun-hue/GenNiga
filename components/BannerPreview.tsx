"use client";

import type { BannerData } from "@/lib/banner-types";
import { BANNER_SIZES } from "@/lib/banner-types";
import { Check } from "lucide-react";

interface BannerPreviewProps {
  data: BannerData;
  className?: string;
  scale?: number;
}

export function BannerPreview({ data, className = "", scale = 1 }: BannerPreviewProps) {
  const { format, headline, subheadline, benefits, accentColor, backgroundImage, logoText } =
    data;
  const { w, h } = BANNER_SIZES[format];
  const sw = Math.round(w * scale);
  const sh = Math.round(h * scale);

  const isCompact = h <= 134;
  const pad = isCompact ? 10 * scale : 16 * scale;
  const headlineSize = isCompact ? Math.max(12, 14 * scale) : Math.max(16, 20 * scale);
  const subheadSize = isCompact ? Math.max(10, 11 * scale) : Math.max(12, 14 * scale);
  const benefitSize = isCompact ? Math.max(9, 10 * scale) : Math.max(10, 12 * scale);
  const gap = isCompact ? 4 * scale : 6 * scale;
  const iconSize = isCompact ? 12 * scale : 16 * scale;
  const shownBenefits = (benefits ?? []).slice(0, isCompact ? 2 : 4);
  const template = data.template ?? "yandex-direct";
  const cardRadius =
    template === "ozon-card" ? 16 * scale : template === "wb-card" ? 20 * scale : 10 * scale;
  const badgeRadius =
    template === "ozon-card" ? 12 * scale : template === "wb-card" ? 999 : 999;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: sw,
        height: sh,
        borderRadius: cardRadius,
        background: backgroundImage
          ? `linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.14) 100%), url(\"${backgroundImage}\") center/cover no-repeat`
          : "linear-gradient(to right, #141414 0%, #242424 40%, #2f2f2f 100%)",
      }}
    >
      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: pad }}
      >
        {/* Заголовок — крупный белый текст без фона */}
        <h2
          className="font-extrabold text-white uppercase leading-tight drop-shadow-lg"
          style={{
            fontSize: headlineSize,
            lineHeight: 1.2,
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            marginTop: isCompact ? 0 : 2 * scale,
          }}
        >
          {headline || "ВАШ ЗАГОЛОВОК"}
        </h2>

        {/* Подзаголовок — яркий оранжевый pill */}
        <div
          className="mt-1.5 inline-flex items-center rounded-full font-bold text-white"
          style={{
            backgroundColor: accentColor || "#FF9100",
            fontSize: subheadSize,
            padding: `${6 * scale}px ${18 * scale}px`,
            marginTop: gap,
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            maxWidth: isCompact ? sw - pad * 2 : sw * 0.9,
            borderRadius: badgeRadius,
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subheadline || "Подзаголовок"}
          </span>
        </div>

        {/* Преимущества — тёмные полупрозрачные pills с галочкой */}
        <div
          className="mt-2 flex flex-col gap-1"
          style={{ marginTop: gap + 4, gap: gap }}
        >
          {shownBenefits.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-full font-semibold text-white"
              style={{
                backgroundColor: "rgba(0,0,0,0.65)",
                fontSize: benefitSize,
                padding: `${5 * scale}px ${14 * scale}px`,
                gap: 10 * scale,
                width: "fit-content",
                boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="flex shrink-0 items-center justify-center rounded-full"
                style={{
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: accentColor || "#FF9100",
                  minWidth: iconSize,
                  minHeight: iconSize,
                }}
              >
                <Check
                  className="text-white"
                  strokeWidth={3}
                  style={{ width: iconSize * 0.6, height: iconSize * 0.6 }}
                />
              </div>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Логотип — правый нижний угол */}
      {logoText && (
        <div
          className="absolute right-0 bottom-0 rounded-lg bg-white px-3 py-2 text-right"
          style={{
            margin: pad * 0.5,
            fontSize: benefitSize,
            fontWeight: 700,
            color: "#1a1a1a",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {logoText}
        </div>
      )}
    </div>
  );
}
