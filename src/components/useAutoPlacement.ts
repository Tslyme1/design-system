import { useEffect, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { spacing } from '@/tokens';

/**
 * Выбор размещения по свободному месту во вьюпорте.
 *
 * Проп `placement` у слоя — это **предпочтение**, а не приказ: поле в конце
 * страницы обязано раскрывать панель вверх, иначе она уедет за нижний край
 * и половина списка станет недоступна.
 *
 * Почему написано руками, а не взято из floating-ui: библиотеку не удалось
 * поставить — реестр npm рвал соединение даже на метаданных. Здесь закрыты
 * два случая из трёх (переворот и выбор стороны выравнивания); сдвига вдоль
 * оси, как `shift()` в floating-ui, нет. Когда сеть починится, замена
 * ограничится этим файлом: наружу отдаётся только итоговое размещение.
 */

export type Side = 'top' | 'bottom';
export type Align = 'start' | 'end';
export type Placement = `${Side}-${Align}`;

/** Зазор между триггером и панелью. Значение приходит из шкалы, а не из головы. */
const GAP = Number.parseFloat(spacing.xs);

function split(placement: Placement): [Side, Align] {
  const [side, align] = placement.split('-') as [Side, Align];
  return [side, align];
}

export function useAutoPlacement(
  preferred: Placement,
  open: boolean,
  triggerRef: RefObject<HTMLElement>,
  panelRef: RefObject<HTMLElement>
): Placement {
  const [placement, setPlacement] = useState<Placement>(preferred);

  // useLayoutEffect, а не useEffect: измерять и переставлять нужно до
  // отрисовки, иначе панель мигнёт внизу и перепрыгнет наверх.
  useLayoutEffect(() => {
    if (!open) {
      setPlacement(preferred);
      return;
    }

    const compute = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const rect = trigger.getBoundingClientRect();
      const { offsetHeight: height, offsetWidth: width } = panel;
      const [preferredSide, preferredAlign] = split(preferred);

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const needed = height + GAP;

      /**
       * Переворот только тогда, когда на предпочтённой стороне не помещается,
       * а на противоположной помещается. Если не помещается нигде — остаёмся
       * на предпочтённой: прыгать между двумя одинаково плохими сторонами хуже,
       * чем предсказуемо показать одну.
       */
      let side = preferredSide;
      if (preferredSide === 'bottom' && spaceBelow < needed && spaceAbove >= needed) side = 'top';
      if (preferredSide === 'top' && spaceAbove < needed && spaceBelow >= needed) side = 'bottom';

      // `start` — панель растёт вправо от левого края триггера, `end` — влево от правого.
      const fitsRight = rect.left + width <= window.innerWidth;
      const fitsLeft = rect.right - width >= 0;

      let align = preferredAlign;
      if (preferredAlign === 'start' && !fitsRight && fitsLeft) align = 'end';
      if (preferredAlign === 'end' && !fitsLeft && fitsRight) align = 'start';

      setPlacement(`${side}-${align}`);
    };

    compute();

    // Пересчёт на прокрутке любого предка (третий аргумент — фаза захвата)
    // и на изменении размеров окна: панель открыта, а страница живёт.
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, preferred, triggerRef, panelRef]);

  return placement;
}

/**
 * То же для слоёв, у которых есть только верх и низ, — подсказки.
 * Отдельная функция, а не проп: у подсказки нет выравнивания, она
 * центрируется по триггеру, и притворяться, что оно есть, не нужно.
 */
export function useAutoSide(
  preferred: Side,
  open: boolean,
  triggerRef: RefObject<HTMLElement>,
  panelRef: RefObject<HTMLElement>
): Side {
  const [side, setSide] = useState<Side>(preferred);

  useEffect(() => {
    if (!open) {
      setSide(preferred);
      return;
    }

    const compute = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const rect = trigger.getBoundingClientRect();
      const needed = panel.offsetHeight + GAP;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let next = preferred;
      if (preferred === 'top' && spaceAbove < needed && spaceBelow >= needed) next = 'bottom';
      if (preferred === 'bottom' && spaceBelow < needed && spaceAbove >= needed) next = 'top';

      setSide(next);
    };

    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open, preferred, triggerRef, panelRef]);

  return side;
}
