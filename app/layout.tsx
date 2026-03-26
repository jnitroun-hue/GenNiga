import type { Metadata } from "next";
import "./globals.css";
import { LayoutClient } from "@/components/LayoutClient";

export const metadata: Metadata = {
  title: "GenNiga — Генератор баннеров для Яндекс.Директ",
  description:
    "Создавайте профессиональные рекламные баннеры для Яндекс.Директ. Конструктор, AI-генерация, создание видео.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-dvh">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
