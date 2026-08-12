import type { ReactNode } from 'react';
import type { TagColorToken } from '../../tokens';
import { Icon } from '../../primitives';
import styles from './Tag.module.css';

export type TagProps = {
  children: ReactNode;
  /**
   * Цвет метки. Это единственное место в системе, где цвет означает
   * пользовательский выбор, а не роль. Для статусов системы — `Badge`.
   */
  color?: TagColorToken;
  /** Показать крестик снятия метки. */
  onRemove?: () => void;
};

/**
 * Пользовательская метка проекта.
 *
 * Палитра взята из приложения (`TAG_PALETTE`), а не из сторибука: в аудите
 * версии разошлись, и сторибучные значения не выводились ни из чего —
 * шесть сырых оттенков, набранных вручную. Теперь источник один,
 * и он же питает обе темы.
 */
export function Tag({ children, color = 'steel', onRemove }: TagProps) {
  return (
    <span className={[styles.tag, styles[color]].join(' ')}>
      <span className={styles.label}>{children}</span>
      {onRemove ? (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label="Снять метку">
          <Icon name="x" size="sm" />
        </button>
      ) : null}
    </span>
  );
}
