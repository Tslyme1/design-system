import type { ReactNode } from 'react';
import { useId, useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
  size,
  FloatingPortal,
} from '@floating-ui/react';
import { motionDuration, spacing } from '../../tokens';
import { usePresence } from '../usePresence';
import { useLayerRoot } from '../LayerRoot';
import styles from './Tooltip.module.css';

export type TooltipProps = {
  /** Триггер. Обязан быть фокусируемым: подсказка только по наведению недоступна с клавиатуры. */
  children: ReactElement;
  /** Текст подсказки. Короткий: подсказка не заменяет пояснение под полем. */
  content: ReactNode;
  placement?: 'top' | 'bottom';
  /** Задержка появления. Мгновенная подсказка мешает при проходе курсором. */
  delay?: number;
};

/** Зазор между триггером и пузырём — у подсказки он меньше, чем у панели. */
const GAP = Number.parseFloat(spacing['2xs']);
/** Зазор между пузырём и кромкой окна. */
const EDGE = Number.parseFloat(spacing.sm);

/**
 * Подсказка по наведению и фокусу.
 *
 * Размещение считает floating-ui: сторона выбирается по свободному месту,
 * а у кромки окна пузырь сдвигается внутрь — центрирование по триггеру при
 * этом теряется, и это осознанный размен, прочитать подсказку важнее.
 * Пузырь рисуется в портале и позиционируется от вьюпорта: подсказка в
 * таблице с прокруткой иначе обрезалась бы контейнером.
 *
 * Не использовать для: текста, без которого нельзя работать. Подсказка
 * недоступна с сенсорного экрана и исчезает при попытке её прочитать —
 * важное объясняет `hint` у `Field` или текст рядом.
 *
 * Не класть внутрь интерактивные элементы: до них нельзя дотянуться
 * мышью, не потеряв подсказку.
 */
export function Tooltip({ children, content, placement = 'top', delay = 300 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();
  // Пузырь доигрывает исчезновение и только потом уходит из дерева.
  // Скрытый пузырь в дереве не остаётся вовсе — прежде он висел там всегда
  // с `visibility: hidden`, и это приходилось объяснять отдельным комментарием.
  const { mounted, exiting } = usePresence(open, motionDuration.fast);

  /** Корень портала: внутри модалки — сама модалка. См. `LayerRoot`. */
  const layerRoot = useLayerRoot();

  const { refs, floatingStyles } = useFloating({
    open,
    placement,
    // Считать от вьюпорта, а не от предка: иначе пузырь режет ближайший
    // контейнер с прокруткой задолго до кромки окна.
    strategy: 'fixed',
    middleware: [
      offset(GAP),
      flip({ padding: EDGE }),
      // Сдвиг вдоль оси: подсказка у кнопки в углу экрана иначе
      // центрируется за кромку окна и наполовину обрезается.
      shift({ padding: EDGE, limiter: limitShift() }),
      size({
        padding: EDGE,
        apply({ availableHeight, elements }) {
          elements.floating.style.setProperty('--layer-max-height', `${availableHeight}px`);
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // Esc убирает подсказку, не трогая фокус: она может перекрывать то,
      // что человек как раз пытается прочитать.
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-describedby': open ? id : undefined,
      })
    : children;

  return (
    <span
      ref={refs.setReference}
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {trigger}
      {mounted ? (
        <FloatingPortal root={layerRoot ?? undefined}>
          <span
            ref={refs.setFloating}
            id={id}
            role="tooltip"
            className={[styles.bubble, exiting ? styles.exiting : null].filter(Boolean).join(' ')}
            style={floatingStyles}
          >
            {content}
          </span>
        </FloatingPortal>
      ) : null}
    </span>
  );
}
