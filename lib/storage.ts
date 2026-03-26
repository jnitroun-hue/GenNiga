"use client";

import type { BannerData } from "./banner-types";

const STORAGE_KEY = "genniga_banners";

export function getStoredBanners(): BannerData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBanner(banner: BannerData): void {
  const list = getStoredBanners();
  const idx = list.findIndex((b) => b.id === banner.id);
  if (idx >= 0) list[idx] = banner;
  else list.unshift(banner);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function deleteBanner(id: string): void {
  const list = getStoredBanners().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
