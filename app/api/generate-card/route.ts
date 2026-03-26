import { NextResponse } from "next/server";
import type { BannerData, BannerFormat, BannerTemplate } from "@/lib/banner-types";
import { BANNER_SIZES } from "@/lib/banner-types";
import { NICHE_PRESETS } from "@/lib/niche-presets";
import { generateBackgroundImage, getStockImageForNiche } from "@/lib/image-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nicheId = "custom",
      headline,
      subheadline,
      benefits = [],
      format = "600x600",
      accentColor = "#FF9100",
      logoText,
      template = "yandex-direct",
      generateImage = false,
      customPrompt,
    } = body;

    const preset = NICHE_PRESETS.find((p) => p.id === nicheId) ?? NICHE_PRESETS[NICHE_PRESETS.length - 1];
    const { w, h } = BANNER_SIZES[format as BannerFormat] ?? BANNER_SIZES["600x600"];

    let backgroundImage = getStockImageForNiche(nicheId, NICHE_PRESETS, w, h);
    let backgroundProvider = "svg";

    if (generateImage && (customPrompt || preset.backgroundKeywords?.length)) {
      const prompt = customPrompt ?? preset.backgroundKeywords.join(", ");
      const generated = await generateBackgroundImage(prompt, w, h);
      if (generated?.url) {
        backgroundImage = generated.url;
        backgroundProvider = generated.provider;
      }
    }

    const warnings = runQualityGate({
      format: format as BannerFormat,
      headline: headline || preset.headlineExamples[0],
      subheadline: subheadline || preset.subheadlineExamples[0],
      benefits: benefits.length ? benefits : preset.benefitExamples,
    });

    const banner: BannerData = {
      id: crypto.randomUUID(),
      format: format as BannerFormat,
      template: template as BannerTemplate,
      headline: headline || preset.headlineExamples[0],
      subheadline: subheadline || preset.subheadlineExamples[0],
      benefits: benefits.length ? benefits : preset.benefitExamples,
      accentColor: accentColor || preset.accentColors[0],
      backgroundImage,
      logoText: logoText || undefined,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ banner, meta: { backgroundProvider, warnings } });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка генерации карточки" },
      { status: 500 }
    );
  }
}

function runQualityGate(input: {
  format: BannerFormat;
  headline: string;
  subheadline: string;
  benefits: string[];
}) {
  const warnings: string[] = [];
  const limit = input.format === "640x134" ? 42 : input.format === "1456x180" ? 70 : 55;

  if (input.headline.length > limit) {
    warnings.push(`Слишком длинный заголовок для ${input.format} (>${limit} символов).`);
  }
  if (input.subheadline.length > Math.round(limit * 0.9)) {
    warnings.push("Подзаголовок может не поместиться, сократите формулировку.");
  }
  if (input.benefits.length > (input.format === "640x134" ? 2 : 4)) {
    warnings.push("Слишком много преимуществ для текущего формата.");
  }
  if (input.benefits.some((b) => b.length > 34)) {
    warnings.push("Некоторые пункты преимуществ слишком длинные.");
  }
  return warnings;
}
