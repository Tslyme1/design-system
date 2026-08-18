import type { ReactNode } from 'react';
import { useEffect, useCallback, useState } from 'react';
import { motionDuration } from '../../tokens';
import { usePresence } from '../usePresence';
import { LayerRootProvider } from '../LayerRoot';
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
  // Панель уезжает вправо, а не пропадает на месте: она въехала оттуда же,
  // и без обратного хода закрытие читается как сбой отрисовки.
  const { mounted, exiting } = usePresence(open, motionDuration.base);
  /** Узел панели — корень портала для поповеров внутри неё. См. `LayerRoot`. */
  const [layerNode, setLayerNode] = useState<HTMLElement | null>(null);

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

  if (!mounted) return null;

  return (
    <>
      <div
        className={[styles.scrim, exiting ? styles.exiting : null].filter(Boolean).join(' ')}
        // Пока панель уезжает, она уже закрыта: повторный клик по затемнению
        // ничего не должен запускать.
        onClick={exiting ? undefined : onClose}
        role="presentation"
      />

      <aside
        ref={setLayerNode}
        className={[styles.panel, styles[size], exiting ? styles.exiting : null].filter(Boolean).join(' ')}
        role="dialog"
        aria-label={title}
        aria-modal="false"
      >
        {title ? <header className={styles.header}>{title}</header> : null}
        <LayerRootProvider node={layerNode}>
          <div className={styles.content}>{children}</div>
          {footer ? <footer className={styles.footer}>{footer}</footer> : null}
        </LayerRootProvider>
      </aside>
    </>
  );
}
