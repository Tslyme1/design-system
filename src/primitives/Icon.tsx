import type { CSSProperties } from 'react';
import type { TextColorToken } from '../tokens';
import { color as colorToken } from '../tokens';
import { icons, type IconName } from './icons';

export type IconProps = {
  name: IconName;
  /** Размер из шкалы. Произвольные значения не принимаются. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Цвет. По умолчанию наследуется от родителя (`currentColor`) —
   * так иконка внутри кнопки автоматически повторяет её состояния.
   */
  color?: TextColorToken;
  /**
   * Подпись для скринридера. Если иконка декоративная и рядом есть текст,
   * оставить пустым — тогда она скрывается от вспомогательных технологий.
   */
  label?: string;
};

const sizeMap = { sm: 14, md: 16, lg: 20 } as const;

/**
 * Иконка из набора Lucide, обводка 1.5 — единая толщина по всей системе.
 *
 * Размер только из шкалы, цвет только `currentColor` или семантическая роль.
 * Так иконка не может разойтись с текстом, рядом с которым стоит.
 */
export function Icon({ name, size = 'md', color, label }: IconProps) {
  const px = sizeMap[size];
  const paths = icons[name];

  const style: CSSProperties = {
    color: color ? colorToken[color] : undefined,
    flexShrink: 0,
    display: 'block',
  };

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
