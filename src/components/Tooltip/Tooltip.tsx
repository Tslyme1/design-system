import type { ReactNode } from 'react';
import { useId, useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { useAutoSide } from '../useAutoPlacement';
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

/**
 * Подсказка по наведению и фокусу.
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
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  /**
   * `placement` — предпочтение: у верхней кромки экрана подсказка
   * раскрывается вниз, иначе она уедет за край и её нельзя будет прочитать.
   */
  const side = useAutoSide(placement, open, wrapperRef, bubbleRef);

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
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {trigger}
      <span
        ref={bubbleRef}
        id={id}
        role="tooltip"
        className={[styles.bubble, styles[side], open ? styles.open : null].filter(Boolean).join(' ')}
      >
        {content}
      </span>
    </span>
  );
}
