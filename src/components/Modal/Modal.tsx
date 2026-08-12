import type { ReactNode } from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ModalWidthToken } from '../../tokens';
import { Text, Icon } from '../../primitives';
import styles from './Modal.module.css';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Заголовок окна. Обязателен: окно без заголовка не объясняет, что произошло. */
  title: string;
  /** Содержимое. Что угодно — модалка не знает о нём ничего. */
  children: ReactNode;
  /** Слот действий. Обычно `<Modal.Footer>` с кнопками. */
  footer?: ReactNode;
  size?: ModalWidthToken;
  /**
   * Разрешить закрытие по Esc и клику по фону.
   * Отключать только там, где потеря введённых данных необратима.
   */
  dismissible?: boolean;
};

/**
 * Модальное окно.
 *
 * Анатомия — шапка / содержимое / футер — зашита здесь и не собирается
 * заново на месте. В аудите было 23 модалки, но `dialog-body` использовался
 * лишь в 6: остальные 17 верстали тело руками, из-за чего отступ заголовка
 * гулял между 12, 14 и нулём, а футер имел четыре разных `gap`.
 *
 * При этом ни одно частное решение внутрь не зашито: содержимое и состав
 * футера задаются снаружи целиком.
 *
 * Прокрутка живёт только в содержимом — шапка и футер остаются на виду.
 */
export function Modal({ open, onClose, title, children, footer, size = 'sm', dismissible = true }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        onClose();
        return;
      }

      // Удержание фокуса внутри окна: за его пределами интерфейс недоступен,
      // и уводить туда клавиатуру нельзя.
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [dismissible, onClose]
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'
    );
    firstFocusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      // Фокус возвращается туда, откуда окно открыли.
      previouslyFocused.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={dismissible ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={[styles.dialog, styles[size]].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <Text variant="headingSm" as="h2" id="modal-title" truncate>
            {title}
          </Text>
          {dismissible ? (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
              <Icon name="x" size="md" />
            </button>
          ) : null}
        </header>

        <div className={styles.content}>{children}</div>

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    document.body
  );
}

export type ModalFooterProps = {
  children: ReactNode;
  /**
   * Второстепенное содержимое слева — счётчик, чекбокс «не показывать снова».
   * Действия при этом остаются прижатыми вправо.
   */
  aside?: ReactNode;
};

/**
 * Футер модалки: действия справа, необязательное содержимое слева.
 *
 * Отступ, разделитель и расстояние между кнопками заданы здесь.
 * Снаружи задаётся только состав кнопок.
 */
function ModalFooter({ children, aside }: ModalFooterProps) {
  return (
    <>
      {aside ? <div className={styles.footerAside}>{aside}</div> : null}
      <div className={styles.footerActions}>{children}</div>
    </>
  );
}

Modal.Footer = ModalFooter;
