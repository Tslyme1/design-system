import type { ReactNode } from 'react';
import { Icon } from '../../primitives';
import type { IconName } from '../../primitives';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

/**
 * Иконки, допустимые каждой роли. Первая в списке — та, что подставляется
 * при `icon` без значения.
 *
 * Список закрыт не ради экономии: иконка здесь повторяет смысл цвета, а не
 * украшает. `x` в зелёном бейдже сообщает провал и успех одновременно —
 * читатель верит форме, а не цвету, и понимает статус наоборот. Поэтому
 * набор ограничен типом, а не соглашением: соглашение не переживает
 * ни спешку, ни нового человека в команде.
 */
export const badgeToneIcons = {
  /** Состояния без оценки: черновик, архив, ещё не начато. */
  neutral: ['fileText', 'folder', 'clock'],
  /** Идёт сейчас: в работе, на расчёте, на согласовании. */
  accent: ['clock', 'info'],
  /** Завершено благополучно. Отрицания в этой роли быть не может. */
  success: ['check'],
  /** Требует внимания, но не потеряно: проверить, просрочено. */
  warning: ['alertTriangle', 'clock'],
  /** Потеря данных или ошибка. */
  danger: ['x', 'alertTriangle'],
} as const satisfies Record<BadgeTone, readonly [IconName, ...IconName[]]>;

/** Иконки, разрешённые конкретной роли. */
export type BadgeIcon<T extends BadgeTone = BadgeTone> = (typeof badgeToneIcons)[T][number];

export type BadgeProps<T extends BadgeTone = 'neutral'> = {
  children: ReactNode;
  /**
   * Роль статуса. Цвет здесь означает смысл, а не оформление:
   * `danger` — потеря данных или ошибка, `warning` — требует внимания.
   */
  tone?: T;
  /**
   * Иконка перед текстом. Дублирует смысл цвета: статус, отличимый
   * только по цвету, не читается при дальтонизме и в печати.
   *
   * `icon` — иконка роли по умолчанию. Этого хватает почти всегда.
   * `icon="имя"` — другая иконка, но только из числа допустимых этой роли:
   * `<Badge tone="success" icon="x">` не компилируется.
   */
  icon?: boolean | BadgeIcon<T>;
  /**
   * Бейдж стоит внутри строки текста, а не в раскладке.
   *
   * В потоке текста межсловного пробела бейджу мало — он слипается с
   * соседними словами, а выравнивание по базовой линии поднимает его
   * над строкой. Проп добавляет воздух по горизонтали и опускает бейдж
   * к оптическому центру строки. В `Stack` он не нужен: там расстояние
   * задаёт `gap`.
   */
  inText?: boolean;
};

/**
 * Статус системы.
 *
 * Не путать с `Tag`: у метки цвет означает выбор пользователя, здесь —
 * состояние объекта. В аудите роль ошибочно закрывалась `Tag`, поэтому
 * «Согласовано» и «Ошибка расчёта» выглядели как две пользовательские метки.
 */
export function Badge<T extends BadgeTone = 'neutral'>({
  children,
  tone,
  icon = false,
  inText = false,
}: BadgeProps<T>) {
  const role = (tone ?? 'neutral') as BadgeTone;
  const name: IconName | null = icon === true ? badgeToneIcons[role][0] : icon === false ? null : icon;

  return (
    <span className={[styles.badge, styles[role], inText ? styles.inText : ''].filter(Boolean).join(' ')}>
      {name ? <Icon name={name} size="sm" /> : null}
      <span className={styles.label}>{children}</span>
    </span>
  );
}
