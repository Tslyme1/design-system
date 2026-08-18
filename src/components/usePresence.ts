import { useEffect, useState } from 'react';

/**
 * Присутствие слоя в дереве, растянутое на время анимации закрытия.
 *
 * Модалка, панель и поповер до этого исчезали в тот же кадр, в котором
 * `open` становился `false`: анимация открытия была, анимации закрытия не
 * было ни у одного из трёх. Слой не может доиграть уход, пока он размонтирован,
 * поэтому размонтирование откладывается — ровно на длительность из шкалы.
 *
 * Наружу отдаются два флага: `mounted` — рисовать ли слой вообще,
 * `exiting` — идёт ли уход. Второй вешает класс с обратной анимацией.
 * Решение о самой анимации остаётся в CSS компонента: у панели это сдвиг
 * вправо, у модалки — падение, у поповера — схлопывание к триггеру.
 *
 * Таймер, а не `animationend`: у панели и модалки уходят два элемента сразу
 * (подложка и сам слой), и слушать пришлось бы оба, гадая, который последний.
 * Длительность приходит из токена, поэтому таймер и CSS не могут разъехаться.
 */
export function usePresence(open: boolean, duration: string): { mounted: boolean; exiting: boolean } {
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setExiting(false);
      return;
    }

    if (!mounted) return;

    setExiting(true);

    /**
     * При `prefers-reduced-motion` анимации в проекте сведены к 0.01ms
     * глобально, в `tokens.css`. Держать монтирование дольше кадра здесь
     * было бы прямым противоречием этой настройке.
     */
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timer = window.setTimeout(
      () => {
        setMounted(false);
        setExiting(false);
      },
      reduced ? 0 : Number.parseFloat(duration)
    );

    return () => window.clearTimeout(timer);
  }, [open, mounted, duration]);

  return { mounted, exiting };
}
