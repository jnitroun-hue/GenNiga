# Видео-сервис для GenNiga: простая пошаговая инструкция

Этот файл объясняет **простыми словами**, как поднять видео-сервис (Node + FFmpeg) на сервере, чтобы всё работало с Vercel **без локалки**.

---

## 0) Что мы делаем и зачем

У тебя есть основной сайт на Vercel (Next.js).  
Vercel сам по себе не рендерит такие видео через FFmpeg в этом проекте.  
Поэтому мы поднимаем **отдельный мини-сервис** `video-service`, который:

1. получает картинку/баннер,
2. делает mp4 через FFmpeg,
3. отдает ссылку на готовое видео.

Потом основной сайт обращается к нему по `VIDEO_SERVICE_URL`.

---

## 1) Что нужно заранее

- Репозиторий уже есть: `https://github.com/jnitroun-hue/GenNiga.git`
- VPS с Ubuntu 22.04 (любой провайдер, где тебе удобно)
- Домен или поддомен (например `video.yourdomain.com`)
- Доступ по SSH к серверу (IP, логин, пароль/ключ)

---

## 2) Заходим на сервер

С твоего ПК:

```bash
ssh root@IP_СЕРВЕРА
```

Если у тебя не root, используй своего пользователя.

---

## 3) Устанавливаем Docker и Git

На сервере выполни:

```bash
apt update
apt install -y docker.io docker-compose-plugin git
systemctl enable docker
systemctl start docker
docker --version
```

Если версия показалась — Docker работает.

---

## 4) Клонируем проект

```bash
cd /opt
git clone https://github.com/jnitroun-hue/GenNiga.git
cd /opt/GenNiga/video-service
```

---

## 5) Готовим секретный токен

Это защита, чтобы только твой Vercel мог дергать видео-сервис.

Пример токена:

```bash
openssl rand -hex 24
```

Скопируй результат, например:

`a1b2c3d4e5f6...`

---

## 6) Собираем Docker-образ

```bash
cd /opt/GenNiga/video-service
docker build -t genniga-video-service .
```

---

## 7) Запускаем контейнер

Пока можно запустить на прямом порту `4000`:

```bash
docker run -d --name genniga-video \
  -p 4000:4000 \
  -e VIDEO_SERVICE_TOKEN="ТВОЙ_СЕКРЕТНЫЙ_ТОКЕН" \
  -e PUBLIC_BASE_URL="http://IP_СЕРВЕРА:4000" \
  --restart unless-stopped \
  genniga-video-service
```

Проверка:

```bash
curl http://127.0.0.1:4000/health
```

Ожидаемый ответ:

```json
{"ok":true,"ffmpeg":true}
```

---

## 8) (Рекомендовано) Делаем домен + HTTPS

Ниже — простой путь через Nginx и Let's Encrypt.

### 8.1 Установка Nginx и Certbot

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### 8.2 DNS

У регистратора домена создай `A` запись:

- `video.yourdomain.com` -> IP твоего сервера

Подожди, пока DNS обновится (обычно 5-30 минут).

### 8.3 Nginx конфиг

Создай файл:

```bash
nano /etc/nginx/sites-available/video-service
```

Вставь:

```nginx
server {
    listen 80;
    server_name video.yourdomain.com;

    client_max_body_size 30m;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Включи сайт и проверь:

```bash
ln -s /etc/nginx/sites-available/video-service /etc/nginx/sites-enabled/video-service
nginx -t
systemctl reload nginx
```

### 8.4 Выпуск SSL

```bash
certbot --nginx -d video.yourdomain.com
```

После этого сервис будет доступен по:

`https://video.yourdomain.com`

---

## 9) Обновляем `PUBLIC_BASE_URL` в контейнере

Когда HTTPS уже готов, перезапусти контейнер с правильным URL:

```bash
docker rm -f genniga-video
docker run -d --name genniga-video \
  -p 4000:4000 \
  -e VIDEO_SERVICE_TOKEN="ТВОЙ_СЕКРЕТНЫЙ_ТОКЕН" \
  -e PUBLIC_BASE_URL="https://video.yourdomain.com" \
  --restart unless-stopped \
  genniga-video-service
```

Проверка:

```bash
curl https://video.yourdomain.com/health
```

---

## 10) Подключаем к Vercel

В Vercel -> Project -> Settings -> Environment Variables:

- `VIDEO_SERVICE_URL` = `https://video.yourdomain.com/render`
- `VIDEO_SERVICE_TOKEN` = `ТВОЙ_СЕКРЕТНЫЙ_ТОКЕН`

Сохрани и сделай Redeploy.

---

## 11) Тест в приложении

1. Открой страницу генерации видео.
2. Выбери баннер или загрузи фото.
3. Нажми "Создать видео".
4. Должна прийти ссылка на mp4 и превью видео.

---

## 12) Обновление сервиса после изменений в GitHub

На сервере:

```bash
cd /opt/GenNiga
git pull
cd /opt/GenNiga/video-service
docker build -t genniga-video-service .
docker rm -f genniga-video
docker run -d --name genniga-video \
  -p 4000:4000 \
  -e VIDEO_SERVICE_TOKEN="ТВОЙ_СЕКРЕТНЫЙ_ТОКЕН" \
  -e PUBLIC_BASE_URL="https://video.yourdomain.com" \
  --restart unless-stopped \
  genniga-video-service
```

---

## 13) Полезные команды (если что-то сломалось)

Логи контейнера:

```bash
docker logs -f genniga-video
```

Список контейнеров:

```bash
docker ps
```

Перезапуск:

```bash
docker restart genniga-video
```

Проверка health:

```bash
curl https://video.yourdomain.com/health
```

---

## 14) Частые проблемы и простые решения

### Проблема: в Vercel ошибка про видео-сервис

Проверь:
- точно ли `VIDEO_SERVICE_URL` начинается с `https://.../render`
- совпадает ли `VIDEO_SERVICE_TOKEN` в Vercel и в контейнере
- открывается ли `https://video.yourdomain.com/health`

### Проблема: 401 Unauthorized

Неверный токен или не передается заголовок авторизации.  
Нужно, чтобы токен в Vercel и на сервере был **одинаковым**.

### Проблема: SSL не выдался

Обычно DNS еще не обновился. Подожди и повтори `certbot`.

### Проблема: долго первый запрос

Для VPS это обычно нормально только при очень слабом сервере.  
Увеличь ресурсы (хотя бы 1 vCPU / 2 GB RAM).

---

## 15) Мини-чеклист

- [ ] VPS куплен и доступен по SSH
- [ ] Docker установлен
- [ ] Контейнер `genniga-video` запущен
- [ ] `health` отвечает `ok: true`
- [ ] Домен привязан
- [ ] HTTPS работает
- [ ] Vercel env выставлены
- [ ] Видео в приложении генерируется

---

Если хочешь, следующим шагом могу добавить в репозиторий готовый `docker-compose.yml` для `video-service`, чтобы запуск был одной командой: `docker compose up -d`.
