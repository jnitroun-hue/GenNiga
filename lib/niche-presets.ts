/**
 * Универсальные пресеты для любых ниш.
 * Стиль карточек Ozon/Wildberries — профессиональные рекламные баннеры.
 */

export interface NichesPreset {
  id: string;
  label: string;
  headlineExamples: string[];
  subheadlineExamples: string[];
  benefitExamples: string[];
  backgroundKeywords: string[];
  accentColors: string[];
  stockImageUrl: string;
}

export const NICHE_PRESETS: NichesPreset[] = [
  {
    id: "realty",
    label: "Недвижимость / Перепланировка",
    headlineExamples: [
      "СДЕЛАЛИ ПЕРЕПЛАНИРОВКУ И БОИТЕСЬ ШТРАФА?",
      "ПЕРЕПЛАНИРОВКА? СОГЛАСУЕМ.",
      "УЗАКОНИМ ПЕРЕПЛАНИРОВКУ ПОД КЛЮЧ",
    ],
    subheadlineExamples: [
      "Поможем узаконить и согласовать без лишней бюрократии",
      "Без очередей и нервов",
      "Работаем с МФЦ и БТИ",
    ],
    benefitExamples: [
      "Бесплатная консультация",
      'Работаем «под ключ»',
      "С гарантией по договору",
    ],
    backgroundKeywords: ["apartment interior", "modern living room", "apartment buildings"],
    accentColors: ["#FF9100", "#007AFF"],
    stockImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
  },
  {
    id: "bankruptcy",
    label: "Банкротство / Юр. услуги",
    headlineExamples: [
      "ДОЛГИ ДУШАТ? ОСВОБОДИМ.",
      "БАНКРОТСТВО ФИЗЛИЦ ПОД КЛЮЧ",
      "СПИСАНИЕ ДОЛГОВ ЗАКОННО",
    ],
    subheadlineExamples: [
      "Списание долгов от 3 месяцев",
      "Без предоплаты до результата",
      "Опыт 2000+ дел",
    ],
    benefitExamples: [
      "Бесплатный анализ ситуации",
      "Работаем по всей России",
      "Гарантия списания по договору",
    ],
    backgroundKeywords: ["modern office", "business documents", "corporate"],
    accentColors: ["#007AFF", "#34C759"],
    stockImageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200",
  },
  {
    id: "toys",
    label: "Детские товары / Игрушки",
    headlineExamples: [
      "ЛУЧШИЕ ИГРУШКИ ДЛЯ ВАШЕГО РЕБЁНКА",
      "РАЗВИВАЮЩИЕ ИГРУШКИ СО СКИДКОЙ",
      "КАЧЕСТВО И БЕЗОПАСНОСТЬ",
    ],
    subheadlineExamples: [
      "Доставка за 1 день",
      "Сертификаты качества",
      "Возврат без вопросов",
    ],
    benefitExamples: [
      "Гарантия 2 года",
      "Экологичные материалы",
      "Бесплатная доставка от 2000₽",
    ],
    backgroundKeywords: ["kids room", "colorful toys", "children playing"],
    accentColors: ["#FF6B9D", "#FF9100", "#34C759"],
    stockImageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200",
  },
  {
    id: "beauty",
    label: "Красота / Косметика",
    headlineExamples: [
      "ПРОФЕССИОНАЛЬНЫЙ УХОД ДОМА",
      "КОСМЕТИКА ПРЕМИУМ КАЧЕСТВА",
      "ТВОЯ КРАСОТА — НАШ ПРИОРИТЕТ",
    ],
    subheadlineExamples: [
      "Скидка 20% на первый заказ",
      "Только оригиналы",
      "Бесплатные образцы",
    ],
    benefitExamples: [
      "Доставка в день заказа",
      "Консультация косметолога",
      "Гарантия подлинности",
    ],
    backgroundKeywords: ["cosmetics", "beauty products", "skincare"],
    accentColors: ["#E91E63", "#9C27B0", "#FF9100"],
    stockImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200",
  },
  {
    id: "auto",
    label: "Авто / Запчасти",
    headlineExamples: [
      "ЗАПЧАСТИ С ДОСТАВКОЙ ЗА 24 ЧАСА",
      "ОРИГИНАЛ И АНАЛОГИ ПО ЛУЧШИМ ЦЕНАМ",
      "АВТОСЕРВИС ПОД КЛЮЧ",
    ],
    subheadlineExamples: [
      "Гарантия на все запчасти",
      "Подбор по VIN",
      "Сеть по всей России",
    ],
    benefitExamples: [
      "Бесплатная диагностика",
      "Гарантия 2 года",
      "Рассрочка 0%",
    ],
    backgroundKeywords: ["car interior", "auto parts", "mechanic"],
    accentColors: ["#FF3B30", "#007AFF", "#34C759"],
    stockImageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
  },
  {
    id: "food",
    label: "Продукты / Доставка еды",
    headlineExamples: [
      "СВЕЖИЕ ПРОДУКТЫ К СТОЛУ",
      "ДОСТАВКА ЗА 30 МИНУТ",
      "ЗДОРОВОЕ ПИТАНИЕ КАЖДЫЙ ДЕНЬ",
    ],
    subheadlineExamples: [
      "Бесплатная доставка от 1500₽",
      "Фермерские продукты",
      "Акции каждый день",
    ],
    benefitExamples: [
      "Свежесть гарантирована",
      "Возврат в течение 24ч",
      "Эко-упаковка",
    ],
    backgroundKeywords: ["fresh food", "healthy meal", "kitchen"],
    accentColors: ["#34C759", "#FF9100"],
    stockImageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200",
  },
  {
    id: "tech",
    label: "Электроника / Гаджеты",
    headlineExamples: [
      "НОВИНКИ ТЕХНИКИ ПО ЛУЧШИМ ЦЕНАМ",
      "СМАРТФОНЫ И ГАДЖЕТЫ",
      "ТЕХНОЛОГИИ БУДУЩЕГО УЖЕ СЕЙЧАС",
    ],
    subheadlineExamples: [
      "Рассрочка 0-0-12",
      "Только оригинал",
      "Гарантия 2 года",
    ],
    benefitExamples: [
      "Trade-in старой техники",
      "Бесплатная доставка",
      "Сервисное обслуживание",
    ],
    backgroundKeywords: ["technology", "smartphone", "gadgets"],
    accentColors: ["#007AFF", "#5AC8FA", "#AF52DE"],
    stockImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
  },
  {
    id: "custom",
    label: "Своя ниша",
    headlineExamples: ["ВАШ ЗАГОЛОВОК"],
    subheadlineExamples: ["Ваш подзаголовок"],
    benefitExamples: ["Преимущество 1", "Преимущество 2", "Преимущество 3"],
    backgroundKeywords: [],
    accentColors: ["#FF9100", "#007AFF", "#34C759", "#AF52DE"],
    stockImageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200",
  },
];
