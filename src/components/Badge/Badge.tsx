import type { ReactNode } from 'react';
import { Icon } from '@/primitives';
import type { IconName } from '@/primitives';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export type BadgeProps = {
  children: ReactNode;
  /**
   * Роль статуса. Цвет здесь означает смысл, а не оформление:
   * `danger` — потеря данных или ошибка, `warning` — требует внимания.
   */
  tone?: BadgeTone;
  /**
   * Иконка перед текстом. Дублирует смысл цвета: статус, отличимый
   * только по цвету, не читается при дальтонизме и в печати.
   */
  icon?: IconName;
};

/**
 * Статус системы.
 *
 * Не путать с `Tag`: у метки цвет означает выбор пользователя, здесь —
 * состояние объекта. В аудите роль ошибочно закрывалась `Tag`, поэтому
 * «Согласовано» и «Ошибка расчёта» выглядели как две пользовательские метки.
 */
export function Badge({ children, tone = 'neutral', icon }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[tone]].join(' ')}>
      {icon ? <Icon name={icon} size="sm" /> : null}
      <span className={styles.label}>{children}</span>
    </span>
  );
}
