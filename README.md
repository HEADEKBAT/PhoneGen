# PhoneGen — Генератор телефонных номеров

Бесплатный онлайн-генератор валидных телефонных номеров для 100+ стран.  
Поддерживает международный, национальный, E.164 и RFC 3966 форматы.

## Возможности

- **100+ стран** — от России до Зимбабве, с реальными мобильными префиксами
- **4 формата** — International, National, E.164, RFC 3966 (tel:)
- **Массовая генерация** — 1, 5, 10, 25, 50 или 100 номеров за раз
- **Копирование** — один номер или все сразу
- **Экспорт** — TXT, CSV, JSON
- **Seed** — детерминированная генерация (одинаковый seed = одинаковые номера)
- **Избранное** — сохраняйте часто используемые страны
- **Недавние** — быстрый доступ к последним 5 странам
- **Поиск** — фильтр стран по названию или коду
- **Мобильная версия** — адаптивный интерфейс
- **URL-параметры** — передача страны, количества и формата в ссылке
- **5 языков** — русский, English, Deutsch, Español, Français
- **Информация о стране** — код страны, длина номера, пример

## Технологии

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **shadcn/ui** + Radix UI
- **Zustand** (persist в localStorage)
- **Lucide React** (иконки)

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
npm start
```

## URL-параметры

Все параметры опциональны:

| Параметр | Значения | Пример |
|----------|----------|--------|
| `country` | Код страны (NG, US, DE, RU…) | `?country=DE` |
| `count` | 1, 5, 10, 25, 50, 100 | `?count=50` |
| `format` | international, national, e164, rfc3966 | `?format=e164` |

Комбинация: `?country=JP&count=25&format=national`

## Структура проекта

```
app/              # Next.js App Router pages
  page.tsx        # Главная страница
  layout.tsx      # Корневой layout
  about/          # Страница «О сервисе»
components/       # UI-компоненты
  ui/             # shadcn/ui компоненты
  Header.tsx
  Sidebar.tsx     # Список стран, избранное, поиск
  MainContent.tsx # Основной контент с контролами
  GeneratorControls.tsx
  PhoneList.tsx   # Таблица номеров + копирование + экспорт
  InfoCard.tsx    # Информация о стране
  Footer.tsx
lib/              # Логика
  phoneGenerator.ts  # Генерация номеров (50+ стран)
  store.ts           # Zustand store (страна, язык, избранное)
  i18n/              # Переводы (ru, en, de, es, fr)
public/           # Статические файлы
```

## Деплой

Проект оптимизирован для [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Лицензия

MIT
