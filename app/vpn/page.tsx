"use client";

import { useMemo, useState } from "react";
import { Shield, Copy, ExternalLink, Server, Bot, CheckCircle2, AlertTriangle } from "lucide-react";

type Platform = "windows" | "android" | "ios" | "mac";
type OptionId = "warp" | "proton";
type Goal = "my-device" | "bots-on-server";

const PLATFORM_LABEL: Record<Platform, string> = {
  windows: "Windows",
  android: "Android",
  ios: "iOS",
  mac: "macOS",
};

const OPTIONS: Array<{
  id: OptionId;
  title: string;
  subtitle: string;
  links: Partial<Record<Platform, { label: string; url: string }>>;
  steps: Record<Platform, string[]>;
  notes?: string[];
}> = [
  {
    id: "warp",
    title: "Cloudflare WARP (бесплатно)",
    subtitle: "Самый простой вариант “включил и работает”.",
    links: {
      windows: { label: "Скачать WARP для Windows", url: "https://one.one.one.one/" },
      android: { label: "WARP в Google Play", url: "https://play.google.com/store/apps/details?id=com.cloudflare.onedotonedotonedotone" },
      ios: { label: "WARP в App Store", url: "https://apps.apple.com/app/1-1-1-1-faster-internet/id1423538627" },
      mac: { label: "WARP для macOS", url: "https://one.one.one.one/" },
    },
    steps: {
      windows: [
        "Открой страницу скачивания и установи Cloudflare WARP.",
        "Запусти WARP и нажми “Connect / Подключить”.",
        "Проверь, что статус стал “Connected”.",
      ],
      android: [
        "Установи “1.1.1.1: Faster & Safer Internet (WARP)” из Google Play.",
        "Открой приложение и включи переключатель подключения.",
        "Разреши создание VPN-профиля, если спросит система.",
      ],
      ios: [
        "Установи приложение 1.1.1.1 (WARP) из App Store.",
        "Открой и включи WARP.",
        "Разреши добавление VPN-профиля, если спросит iOS.",
      ],
      mac: [
        "Скачай и установи Cloudflare WARP для macOS.",
        "Открой приложение и нажми “Connect”.",
        "Убедись, что статус “Connected”.",
      ],
    },
    notes: [
      "Это не “VPN для всего мира”, а быстрый безопасный туннель. Для большинства задач хватает.",
      "На некоторых сетях может требоваться перезапуск приложения.",
    ],
  },
  {
    id: "proton",
    title: "Proton VPN (есть бесплатный тариф)",
    subtitle: "Классический VPN, бесплатно — но с ограничениями.",
    links: {
      windows: { label: "Proton VPN (официальный сайт)", url: "https://protonvpn.com/" },
      android: { label: "Proton VPN в Google Play", url: "https://play.google.com/store/apps/details?id=ch.protonvpn.android" },
      ios: { label: "Proton VPN в App Store", url: "https://apps.apple.com/app/proton-vpn-fast-secure/id1437005085" },
      mac: { label: "Proton VPN для macOS", url: "https://protonvpn.com/" },
    },
    steps: {
      windows: [
        "Скачай и установи Proton VPN.",
        "Создай аккаунт (можно бесплатный).",
        "Выбери бесплатный сервер и нажми Connect.",
      ],
      android: [
        "Установи Proton VPN из Google Play.",
        "Войди/создай аккаунт.",
        "Выбери бесплатный сервер и подключись.",
      ],
      ios: [
        "Установи Proton VPN из App Store.",
        "Войди/создай аккаунт.",
        "Выбери бесплатный сервер и подключись.",
      ],
      mac: [
        "Установи Proton VPN для macOS.",
        "Войди/создай аккаунт.",
        "Выбери бесплатный сервер и подключись.",
      ],
    },
    notes: ["На бесплатном тарифе скорость/серверы ограничены — это нормально."],
  },
];

function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

export default function VpnPage() {
  const [goal, setGoal] = useState<Goal>("bots-on-server");
  const [platform, setPlatform] = useState<Platform>("windows");
  const [optionId, setOptionId] = useState<OptionId>("warp");
  const [copied, setCopied] = useState<string | null>(null);

  const option = useMemo(
    () => OPTIONS.find((o) => o.id === optionId) ?? OPTIONS[0],
    [optionId]
  );

  const link = option.links[platform];
  const steps = option.steps[platform];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[var(--brand-orange)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">VPN / Прокси для тестов</h1>
          <p className="text-sm text-[#a1a1a6] mt-1">
            Важно: если боты работают на Vercel, твой VPN на ПК на них не влияет. Для ботов нужен сервер/прокси.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#161616] p-5 mb-6">
        <p className="text-sm font-medium text-white mb-2">Что ты хочешь сделать?</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGoal("bots-on-server")}
            className={`rounded-xl border p-4 text-left transition-colors ${
              goal === "bots-on-server"
                ? "bg-[var(--brand-orange)] border-[var(--brand-orange)] text-white"
                : "bg-[#0a0a0a] border-white/10 text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="w-4 h-4" />
              VPN/прокси для ботов (если они на Vercel)
            </div>
            <div className={`mt-1 text-sm ${goal === "bots-on-server" ? "text-white/90" : "text-[#a1a1a6]"}`}>
              Чтобы запросы ботов шли через “правильный” IP/регион — нужен отдельный сервер или прокси.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setGoal("my-device")}
            className={`rounded-xl border p-4 text-left transition-colors ${
              goal === "my-device"
                ? "bg-[var(--brand-orange)] border-[var(--brand-orange)] text-white"
                : "bg-[#0a0a0a] border-white/10 text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <Shield className="w-4 h-4" />
              VPN для моего устройства
            </div>
            <div className={`mt-1 text-sm ${goal === "my-device" ? "text-white/90" : "text-[#a1a1a6]"}`}>
              Чтобы ты сам мог открывать сайты/сервисы с другого канала.
            </div>
          </button>
        </div>
      </div>

      {goal === "bots-on-server" ? (
        <BotsOnVercelExplainer copied={copied} setCopied={setCopied} />
      ) : null}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Устройство
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]"
            >
              {Object.entries(PLATFORM_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
              Вариант
            </label>
            <div className="flex gap-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOptionId(o.id)}
                  className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    optionId === o.id
                      ? "bg-[var(--brand-orange)] border-[var(--brand-orange)] text-white"
                      : "bg-[#0a0a0a] border-white/10 text-white hover:bg-white/5"
                  }`}
                >
                  {o.id === "warp" ? "WARP" : "Proton"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
            <p className="font-semibold text-white">{option.title}</p>
            <p className="text-sm text-[#a1a1a6] mt-1">{option.subtitle}</p>
            {link && (
              <a
                className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--brand-orange)] hover:underline"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                {link.label}
              </a>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-[#a1a1a6] mb-2">Быстрая проверка</p>
            <div className="grid gap-2">
              <CopyRow
                label="Открыть проверку IP (что VPN включён)"
                value="https://1.1.1.1/help"
                copied={copied}
                setCopied={setCopied}
              />
              <CopyRow
                label="Если нужен быстрый speed-test"
                value="https://speed.cloudflare.com/"
                copied={copied}
                setCopied={setCopied}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">
          <h2 className="font-semibold text-white mb-3">Пошагово</h2>
          <ol className="space-y-2 text-sm text-[#d2d2d7] list-decimal pl-5">
            {steps.map((s, i) => (
              <li key={`${optionId}-${platform}-${i}`}>{s}</li>
            ))}
          </ol>

          {option.notes?.length ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 text-sm text-[#a1a1a6]">
              <p className="font-medium text-white mb-2">Примечания</p>
              <ul className="list-disc pl-5 space-y-1">
                {option.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BotsOnVercelExplainer({
  copied,
  setCopied,
}: {
  copied: string | null;
  setCopied: (v: string | null) => void;
}) {
  return (
    <div className="mb-6 grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-[var(--brand-orange)]" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Если боты на Vercel</h2>
            <p className="text-sm text-[#a1a1a6] mt-1">
              Твой VPN на ПК меняет IP только у <b>твоего устройства</b>. Но боты на Vercel выполняются
              на серверах Vercel — у них свой выход в интернет.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Главное
          </div>
          <p className="mt-1">
            Чтобы “поменять IP/регион” именно для ботов — нужен <b>прокси</b> или перенос ботов на <b>VPS</b>.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">
        <h2 className="font-semibold text-white mb-3">2 рабочих пути</h2>
        <div className="space-y-3 text-sm text-[#d2d2d7]">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Путь A: Перенести ботов на VPS
            </div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-[#a1a1a6]">
              <li>Самый стабильный IP, меньше ограничений.</li>
              <li>Дешево: обычно 300–900 ₽/мес за VPS.</li>
              <li>Можно держать рядом БД/кэш/очереди.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Путь B: Оставить на Vercel, но подключить прокси
            </div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-[#a1a1a6]">
              <li>В коде бота добавляется proxy-agent для запросов (если библиотека поддерживает).</li>
              <li>Прокси можно взять платный или поднять на своём VPS.</li>
              <li>Платные прокси обычно 200–1500 ₽/мес (зависит от страны/качества).</li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-[#a1a1a6] mb-2">Проверки</p>
          <div className="grid gap-2">
            <CopyRow
              label="Проверка IP / сеть (полезно для отладки)"
              value="https://ifconfig.me/"
              copied={copied}
              setCopied={setCopied}
            />
            <CopyRow
              label="Проверка Cloudflare / сеть"
              value="https://1.1.1.1/help"
              copied={copied}
              setCopied={setCopied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyRow({
  label,
  value,
  copied,
  setCopied,
}: {
  label: string;
  value: string;
  copied: string | null;
  setCopied: (v: string | null) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#161616] p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-[#a1a1a6]">{label}</p>
        <p className="text-sm text-white truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await copyText(value);
          setCopied(value);
          setTimeout(() => setCopied(null), 1200);
        }}
        className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10"
      >
        <Copy className="w-4 h-4" />
        {copied === value ? "Скопировано" : "Копировать"}
      </button>
    </div>
  );
}

