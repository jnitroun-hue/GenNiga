export type BannerFormat = "640x134" | "1456x180" | "300x250" | "600x600";
export type BannerTemplate = "yandex-direct" | "ozon-card" | "wb-card";

export const BANNER_SIZES: Record<BannerFormat, { w: number; h: number }> = {
  "640x134": { w: 640, h: 134 },
  "1456x180": { w: 1456, h: 180 },
  "300x250": { w: 300, h: 250 },
  "600x600": { w: 600, h: 600 },
};

export interface BannerData {
  id: string;
  format: BannerFormat;
  template?: BannerTemplate;
  headline: string;
  subheadline: string;
  benefits: string[];
  accentColor: string;
  backgroundImage?: string;
  logoText?: string;
  createdAt: string;
}

export const DEFAULT_BENEFITS = [
  "Бесплатная консультация",
  'Работаем «под ключ»',
  "С гарантией по договору",
];
