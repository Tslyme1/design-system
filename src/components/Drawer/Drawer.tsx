import type { ReactNode } from 'react';
import { useEffect, useCallback } from 'react';
import styles from './Drawer.module.css';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Слот действий внизу панели. */
  footer?: ReactNode;
  /** Заголовок. Необязателен: панель результата открывается из подписанной кнопки. */
  title?: string;
  /**
   * Ширина. `wide` — панель результата расчёта, `narrow` — вспомогательные
   * панели вроде списка пользователей.
   */
  size?: 'narrow' | 'wide';
};

/**
 * Выдвижная панель у правого края рабочей области.
 *
 * **Позиционируется абсолютно** — то есть перекрывает рабочую область,
 * но не шапку сервиса: шапка остаётся доступной, пока панель открыта.
 * Поэтому родитель обязан иметь `position: relative` и `overflow: hidden`.
 * Это отличает панель от модалки, которая закрывает интерфейс целиком.
 *
 * Анатомия — прокручиваемое содержимое плюс закреплённый футер — зашита,
 * содержимое обоих слотов приходит снаружи.
 */
export function Drawer({ open, onClose, children, footer, title, size = 'wide' }: DrawerProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} role="presentation" />

      <aside
        className={[styles.panel, styles[size]].join(' ')}
        role="dialog"
        aria-label={title}
        aria-modal="false"
      >
        {title ? <header className={styles.header}>{title}</header> : null}
        <div className={styles.content}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </aside>
    </>
  );
}
