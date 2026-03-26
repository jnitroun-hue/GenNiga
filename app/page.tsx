import Link from "next/link";
import { Layout, ImageIcon, Video, FolderOpen, ArrowRight } from "lucide-react";

export default function HomePage() {
  const cards = [
    {
      href: "/builder",
      title: "Конструктор",
      description: "Соберите баннер вручную: фоны, текст, блоки преимуществ.",
      icon: Layout,
    },
    {
      href: "/generator",
      title: "Генератор карточек",
      description: "Профессиональные карточки Ozon/ВБ для любой ниши — недвижимость, банкротство, игрушки, косметика.",
      icon: ImageIcon,
    },
    {
      href: "/video",
      title: "Генератор видео",
      description: "Сделайте анимированное видео из баннера — текст выезжает, слайд-шоу.",
      icon: Video,
    },
    {
      href: "/created",
      title: "Созданные",
      description: "Скачать или удалить созданные баннеры и видео.",
      icon: FolderOpen,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Генератор рекламных карточек
        </h1>
        <p className="text-[#a1a1a6] text-lg max-w-2xl mx-auto">
          Стиль Ozon / Wildberries. Любая ниша: недвижимость, банкротство, игрушки, косметика. Конструктор, AI-генерация фона, видео.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group block p-6 rounded-2xl border border-white/10 bg-[#161616] hover:border-[var(--brand-orange)]/50 hover:bg-[#1c1c1c] transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[var(--brand-orange)]/20 transition-colors">
                <Icon className="w-6 h-6 text-[var(--brand-orange)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-lg mb-1 group-hover:text-[var(--brand-orange)] transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-[#a1a1a6] mb-3">{description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-orange)]">
                  Перейти
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12 p-6 rounded-2xl border border-white/10 bg-[#161616]">
        <h2 className="font-semibold text-lg mb-3">Форматы для Яндекс.Директ</h2>
        <ul className="text-sm text-[#a1a1a6] space-y-1">
          <li>• Мобильная версия: 640 × 134 px, до 512 КБ (JPG, PNG, GIF)</li>
          <li>• Десктоп и новая вкладка: 1456 × 180 px, до 1 МБ</li>
          <li>• Рекомендуется без рамок, читаемый текст, контрастные цвета</li>
        </ul>
      </section>
    </div>
  );
}

