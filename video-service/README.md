# Video Service (Node + FFmpeg)

Minimal free video renderer for your card generator.

## What it does

- Accepts image from:
  - `imageSource` (URL or `data:image/...`)
  - or `banner.backgroundImage`
- Generates MP4 using FFmpeg animation:
  - `slide`
  - `fade`
  - `scale`
- Returns public URL:
  - `http://host/media/<id>.mp4`

## Run locally

```bash
cd video-service
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:4000/health
```

## API

`POST /render`

Example body:

```json
{
  "sourceType": "image",
  "imageSource": "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  "animType": "slide",
  "duration": 6,
  "width": 1280,
  "height": 720
}
```

Example response:

```json
{
  "url": "http://localhost:4000/media/9e6fa3f8-....mp4",
  "provider": "ffmpeg-local",
  "duration": 6,
  "animType": "slide"
}
```

## Connect with main app

In your main app `.env.local`:

```env
VIDEO_SERVICE_URL=http://localhost:4000/render
VIDEO_SERVICE_TOKEN=change_me_secret_token
```

Then restart your Next.js app.

And in `video-service` environment too:

```env
VIDEO_SERVICE_TOKEN=change_me_secret_token
```

## Docker

```bash
cd video-service
docker build -t genniga-video-service .
docker run -p 4000:4000 genniga-video-service
```

## Deploy notes

- You can deploy this service separately (Render, Railway, Fly.io, VPS, etc.)
- Set `PUBLIC_BASE_URL` on server so generated URLs use your domain:

```env
PUBLIC_BASE_URL=https://your-video-service-domain.com
```
