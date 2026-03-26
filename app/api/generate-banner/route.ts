import { NextResponse } from "next/server";
import type { BannerData, BannerFormat } from "@/lib/banner-types";

export async function POST(request: Request) {
  try {
    const { prompt, format = "640x134" } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Требуется поле prompt" },
        { status: 400 }
      );
    }

    const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
    const useOllama = process.env.USE_OLLAMA === "true";

    let structured: {
      headline: string;
      subheadline: string;
      benefits: string[];
      accentColor: string;
    } | null = null;

    if (useOllama) {
      try {
        const res = await fetch(`${ollamaUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: process.env.OLLAMA_MODEL || "llama3.2",
            prompt: `Ты помощник по созданию рекламных баннеров для Яндекс.Директ.
По описанию ниже создай структуру баннера в формате JSON (без markdown, только валидный JSON):
{
  "headline": "ЗАГЛАВНЫЕ БУКВЫ, ДО 60 СИМВОЛОВ",
  "subheadline": "Короткий подзаголовок для оранжевого блока",
  "benefits": ["Преимущество 1", "Преимущество 2", "Преимущество 3"],
  "accentColor": "#FF9500 или #007AFF"
}

Описание: ${prompt}`,
            stream: false,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.response || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            structured = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        console.warn("Ollama unavailable:", e);
      }
    }

    if (!structured) {
      structured = parsePromptFallback(prompt);
    }

    const banner: BannerData = {
      id: crypto.randomUUID(),
      format: format as BannerFormat,
      headline: structured.headline || "ВАШ ЗАГОЛОВОК",
      subheadline: structured.subheadline || "Ваш подзаголовок",
      benefits: structured.benefits?.slice(0, 5) || ["Преимущество 1", "Преимущество 2", "Преимущество 3"],
      accentColor: structured.accentColor || "#FF9500",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ banner });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка при генерации баннера" },
      { status: 500 }
    );
  }
}

function parsePromptFallback(prompt: string) {
  const headlineMatch = prompt.match(/(?:заголовок|headline)[:\s]+["']?([^"'\n]+)["']?/i);
  const subMatch = prompt.match(/(?:подзаголовок|subheadline)[:\s]+["']?([^"'\n]+)["']?/i);
  const benefitsMatch = prompt.match(/(?:преимущества|benefits)[:\s]+([^\n]+)/i);
  const colorMatch = prompt.match(/#[0-9A-Fa-f]{6}|оранжев|синий|blue|orange/i);

  const benefits = benefitsMatch
    ? benefitsMatch[1]
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5)
    : ["Бесплатная консультация", 'Работаем «под ключ»', "С гарантией по договору"];

  let accentColor = "#FF9500";
  if (colorMatch) {
    const c = colorMatch[0];
    if (c.startsWith("#")) accentColor = c;
    else if (/синий|blue/i.test(c)) accentColor = "#007AFF";
  }

  return {
    headline: (headlineMatch?.[1] || "ВАШ ЗАГОЛОВОК").toUpperCase().slice(0, 60),
    subheadline: subMatch?.[1] || "Ваш подзаголовок",
    benefits,
    accentColor,
  };
}
