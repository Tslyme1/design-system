import type { ReactNode, ElementType, CSSProperties } from 'react';
import type { ElevationToken, RadiusToken, SpaceToken, SurfaceColorToken } from '../tokens';
import { elevation, radiusVar, spaceVar, color } from '../tokens';
import styles from './Surface.module.css';

export type SurfaceProps = {
  children?: ReactNode;
  /** Уровень подъёма. Правило системы: тень ИЛИ бордер, не оба. */
  level?: ElevationToken;
  /** Хайрлайн-рамка. Основной вид системы — `flat` + рамка. */
  border?: boolean;
  radius?: RadiusToken;
  padding?: SpaceToken;
  background?: SurfaceColorToken;
  /** Реагировать на наведение и фокус. Для кликабельных карточек и строк. */
  interactive?: boolean;
  fullWidth?: boolean;
  as?: ElementType;
};

/**
 * Поверхность с уровнем подъёма.
 *
 * Правило системы: тень **или** бордер, не оба сразу. Единственное
 * оговорённое исключение — модальное окно: без рамки его край теряется
 * на тёмной теме.
 *
 * Основной вид Industry — `level="flat"` с рамкой: карточки и фигуры
 * рисуются как чертёжные объекты, а не как мягкие залитые блоки.
 */
export function Surface({
  children,
  level = 'flat',
  border = true,
  radius = 'none',
  padding,
  background = 'surface',
  interactive = false,
  fullWidth = false,
  as: Tag = 'div',
}: SurfaceProps) {
  const style: CSSProperties = {
    boxShadow: elevation[level],
    border: border ? `var(--border-hairline) solid ${color.border}` : undefined,
    borderRadius: radiusVar[radius],
    padding: padding ? spaceVar[padding] : undefined,
    background: color[background],
    width: fullWidth ? '100%' : undefined,
  };

  const className = [styles.surface, interactive ? styles.interactive : null].filter(Boolean).join(' ');

  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}
