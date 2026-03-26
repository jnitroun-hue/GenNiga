# GenNiga — Настройка и деплой

## Что нужно от вас

### 1. GitHub репозиторий

1. Создайте репозиторий на GitHub (например `GenNiga`).
2. Инициализируйте git и запушьте проект:

```bash
cd c:\Users\msi\Desktop\GitHub\GenNiga
git init
git add .
git commit -m "Initial commit: GenNiga banner generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/GenNiga.git
git push -u origin main
```

### 2. Vercel

1. Зайдите на [vercel.com](https://vercel.com) и авторизуйтесь через GitHub.
2. **Import Project** → выберите репозиторий GenNiga.
3. Оставьте настройки по умолчанию (Framework: Next.js).
4. **Environment Variables** (опционально):
   - `USE_OLLAMA` = `true` — для генерации текстов через Ollama
   - `OLLAMA_URL` — URL Ollama API (по умолчанию `http://127.0.0.1:11434`)
   - `VIDEO_SERVICE_URL` — URL сервиса рендеринга видео
   - `COMFYUI_URL` — локальный ComfyUI (напр. `http://127.0.0.1:8188`) для фоновых изображений
   - `COMFYUI_TXT2IMG_ENDPOINT` — ваш endpoint-адаптер (если есть), напр. `http://127.0.0.1:8188/generate`
   - `POLLINATIONS_MODEL` — модель Pollinations (`flux` по умолчанию)
   - `FAL_KEY` — ключ fal.ai (резервный провайдер генерации)

> **Важно:** Для прод-стабильности фонов в проекте уже включена цепочка fallback:
> `ComfyUI -> Pollinations -> fal.ai -> SVG`.
> Даже если внешние сервисы лагают, генератор не падает.

5. Deploy.

---

## MCP серверы (для Cursor)

MCP серверы настраиваются в Cursor, а не в проекте. Файл `.cursor/mcp.json.example` — это шаблон.

### Как добавить MCP

1. Откройте Cursor → Settings → MCP (или `%USERPROFILE%\.cursor\mcp.json`).
2. Скопируйте нужные блоки из `mcp.json.example` в свой конфиг.
3. Замените плейсхолдеры на реальные ключи.

### Рекомендуемые MCP

| MCP | Назначение | Бесплатно? |
|-----|------------|------------|
| **Figma** | Импорт дизайнов, референсы | Да (Figma API token) |
| **Ollama** | Локальная AI-генерация текста/идей | Да (Ollama локально) |
| **Exa** | Поиск референсов, примеров баннеров | Платный (есть trial) |
| **Context7** | Актуальная документация (Next.js, React) | Да (есть лимиты) |
| **fal.ai** | Генерация изображений и видео | Есть free tier |
| **Chrome DevTools** | Тестирование в браузере | Да |

### Tilda

MCP для Tilda есть через **Zapier** или **Pipedream** — это облачные интеграции, а не npm-пакеты. Для баннеров GenNiga Tilda не обязательна.

### Blender 3D

Для баннеров не нужен. Blender MCP полезен только если будете делать 3D-визуализации.

### Генерация видео

- **fal.ai** — image-to-video, text-to-video (платно, есть кредиты).
- **Remotion** — программный рендер из React (self-hosted, бесплатно).
- **FFmpeg** — на своём сервере, бесплатно (нужен бэкенд с FFmpeg).

Для простых «текст выезжает» и слайд-шоу достаточно FFmpeg + скрипт или Remotion.

---

## Альтернативы Ollama (бесплатные/дешёвые)

| Сервис | Описание |
|--------|----------|
| **Ollama** | Локально, бесплатно. Нужен установленный Ollama. |
| **Groq** | Быстрый inference, есть free tier. |
| **Together AI** | Есть бесплатные кредиты. |
| **OpenRouter** | Агрегатор моделей, много бесплатных. |

Для GenNiga в API route `/api/generate-banner` можно добавить вызов любого из них по аналогии с Ollama.

---

## Краткий чеклист

- [ ] Создать GitHub репозиторий
- [ ] Запушить код
- [ ] Подключить проект к Vercel
- [ ] (Опционально) Добавить env-переменные
- [ ] Скопировать MCP-конфиг из `.cursor/mcp.json.example` в настройки Cursor
- [ ] Получить API-ключи (Figma, fal.ai, Exa, Context7 — по необходимости)
- [ ] Установить Ollama локально, если нужна AI-генерация без платных API
