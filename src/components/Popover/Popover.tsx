import type { ReactNode } from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { useAutoPlacement } from '../useAutoPlacement';
import styles from './Popover.module.css';

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type PopoverProps = {
  open: boolean;
  onClose: () => void;
  /**
   * Элемент, у которого раскрывается панель. Рендерится всегда,
   * панель позиционируется относительно него.
   */
  trigger: ReactNode;
  children: ReactNode;
  placement?: PopoverPlacement;
  /** Ширина панели. `auto` — по содержимому, но не уже триггера. */
  width?: 'auto' | 'trigger' | 'sm' | 'md';
  /** Заголовок панели с разделителем под ним. */
  title?: string;
  /** Закреплённая нижняя строка: «+ Добавить», «Сбросить». */
  footer?: ReactNode;
};

const widthClass = {
  auto: undefined,
  trigger: 'widthTrigger',
  sm: 'widthSm',
  md: 'widthMd',
} as const;

/**
 * Размещение → класс. Отображение явное, а не `styles[placement]`:
 * у CSS-модулей включён `camelCaseOnly`, дефисные ключи из экспорта
 * удаляются, и обращение по имени пропа молча давало `undefined` —
 * панель оставалась без смещений и вставала поверх триггера.
 */
const placementClass: Record<PopoverPlacement, string> = {
  'bottom-start': 'bottomStart',
  'bottom-end': 'bottomEnd',
  'top-start': 'topStart',
  'top-end': 'topEnd',
};

/**
 * Всплывающая панель у элемента.
 *
 * Закрывает три случая, которые в аудите были написаны отдельно каждый раз:
 * панель фильтров, выбор режима работы и меню действий над диаграммой.
 * Везде повторялась одна и та же конструкция — `card elev-md` в абсолютной
 * позиции плюс невидимая подложка на весь экран для перехвата клика,
 * причём `z-index` подбирался вручную: 240, 250, 251, 255, 256.
 *
 * Закрытие по Esc и клику снаружи, возврат фокуса на триггер — здесь,
 * а не в вызывающем коде.
 *
 * Не использовать для модальных решений: поповер не блокирует интерфейс
 * и закрывается случайным кликом. Если ответ обязателен — это `Modal`.
 */
export function Popover({
  open,
  onClose,
  trigger,
  children,
  placement = 'bottom-start',
  width = 'auto',
  title,
  footer,
}: PopoverProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /**
   * `placement` — предпочтение, а не приказ: если снизу не помещается,
   * панель раскрывается вверх. Иначе фильтр у нижнего края экрана
   * открывается за границу окна.
   */
  const actualPlacement = useAutoPlacement(placement, open, wrapperRef, panelRef);

  const handlePointerDown = useCallback(
    (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) onClose();
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        // Фокус возвращается на триггер: иначе он остаётся в никуда
        // и следующий Tab начинает обход с начала страницы.
        wrapperRef.current?.querySelector<HTMLElement>('button, [tabindex]')?.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    // pointerdown, а не click: иначе панель успевает закрыться раньше,
    // чем сработает обработчик внутри неё.
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handlePointerDown, handleKeyDown]);

  const cls = widthClass[width];

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {trigger}

      {open ? (
        <div
          ref={panelRef}
          className={[styles.panel, styles[placementClass[actualPlacement]], cls ? styles[cls] : null]
            .filter(Boolean)
            .join(' ')}
          role="dialog"
        >
          {title ? <div className={styles.title}>{title}</div> : null}
          <div className={styles.content}>{children}</div>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
