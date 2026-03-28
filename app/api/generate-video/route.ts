import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      sourceType = "banner",
      banner,
      imageSource,
      animType,
      duration,
      width,
      height,
      focusPosition,
    } = await request.json();

    if (sourceType === "banner" && !banner) {
      return NextResponse.json(
        { error: "Требуется объект banner" },
        { status: 400 }
      );
    }
    if (sourceType === "image" && !imageSource) {
      return NextResponse.json(
        { error: "Требуется imageSource (URL или data:image/...)" },
        { status: 400 }
      );
    }

    const videoServiceUrl = process.env.VIDEO_SERVICE_URL;
    if (!videoServiceUrl) {
      return NextResponse.json(
        {
          error:
            "Видео-сервис не настроен. На Vercel укажите VIDEO_SERVICE_URL (внешний https endpoint), например https://your-video-service.com/render",
        },
        { status: 503 }
      );
    }

    if (
      process.env.VERCEL &&
      /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(videoServiceUrl)
    ) {
      return NextResponse.json(
        {
          error:
            "VIDEO_SERVICE_URL указывает на локальный адрес. Для Vercel нужен внешний публичный URL.",
        },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    let upstreamRes: Response;
    try {
      upstreamRes = await fetch(videoServiceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.VIDEO_SERVICE_TOKEN
            ? { Authorization: `Bearer ${process.env.VIDEO_SERVICE_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({
          sourceType,
          banner,
          imageSource,
          animType,
          duration,
          width,
          height,
          focusPosition,
        }),
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (error) {
      const msg =
        error instanceof Error && error.name === "AbortError"
          ? "Таймаут ответа от видео-сервиса (45s)"
          : "Не удалось связаться с видео-сервисом";
      return NextResponse.json({ error: msg }, { status: 504 });
    } finally {
      clearTimeout(timeout);
    }

    const rawText = await upstreamRes.text();
    const parsed = safeJsonParse(rawText);

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          error:
            (parsed && typeof parsed.error === "string" && parsed.error) ||
            `Видео-сервис вернул ошибку: ${upstreamRes.status}`,
          upstreamStatus: upstreamRes.status,
        },
        { status: 502 }
      );
    }

    if (!parsed || typeof parsed.url !== "string" || !parsed.url) {
      return NextResponse.json(
        { error: "Видео-сервис вернул некорректный ответ (нет url)" },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка при генерации видео" },
      { status: 500 }
    );
  }
}

function safeJsonParse(value: string): any | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
