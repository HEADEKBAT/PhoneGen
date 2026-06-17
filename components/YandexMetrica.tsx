'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    ym?: (id: string, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Яндекс.Метрика
 * Установи NEXT_PUBLIC_YM_COUNTER_ID в переменные окружения Vercel.
 * Если ID не указан — компонент ничего не рендерит.
 */
export default function YandexMetrica() {
  const pathname = usePathname();
  const counterId = process.env.NEXT_PUBLIC_YM_COUNTER_ID;

  useEffect(() => {
    if (!counterId) return;

    // Загружаем скрипт Метрики один раз
    if (!window.ym) {
      const script = document.createElement('script');
      script.src = 'https://mc.yandex.ru/metrika/tag.js';
      script.async = true;
      document.head.appendChild(script);

      // Инициализируем после загрузки
      script.onload = () => {
        window.ym?.(counterId, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
      };
    }

    // Отправляем просмотр страницы при смене роута
    if (window.ym) {
      window.ym(counterId, 'hit', window.location.href);
    }
  }, [counterId, pathname]);

  if (!counterId) return null;

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${counterId}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  );
}
