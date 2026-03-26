import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { banner, animType, duration } = await request.json();

    if (!banner) {
      return NextResponse.json(
        { error: "Требуется объект banner" },
        { status: 400 }
      );
    }

    // Placeholder: реальная генерация видео требует FFmpeg, Remotion, fal.ai или аналог.
    // В продакшене здесь вызов сервиса рендеринга.
    // Пока возвращаем null — на фронте можно показать анимированный превью через canvas/Web Animations.
    const videoServiceUrl = process.env.VIDEO_SERVICE_URL;
    if (videoServiceUrl) {
      const res = await fetch(videoServiceUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, animType, duration }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({
      url: null,
      message:
        "Видео-сервис не настроен. Добавьте VIDEO_SERVICE_URL или интеграцию с Remotion/fal.ai.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ошибка при генерации видео" },
      { status: 500 }
    );
  }
}
