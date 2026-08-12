import type { ReactNode, ElementType, CSSProperties } from 'react';
import type { SpaceToken, RadiusToken, SurfaceColorToken } from '../tokens';
import { spaceVar, radiusVar, color } from '../tokens';
import styles from './Box.module.css';

export type BoxProps = {
  children?: ReactNode;
  /** Внутренний отступ со всех сторон. */
  padding?: SpaceToken;
  /** Горизонтальный внутренний отступ. Переопределяет padding. */
  paddingX?: SpaceToken;
  /** Вертикальный внутренний отступ. Переопределяет padding. */
  paddingY?: SpaceToken;
  background?: SurfaceColorToken;
  radius?: RadiusToken;
  /** Хайрлайн-рамка семантическим цветом границы. */
  border?: boolean;
  /** Занять всю ширину родителя. */
  fullWidth?: boolean;
  as?: ElementType;
};

/**
 * Контейнер с внутренним отступом, фоном и рамкой.
 *
 * Внешние отступы Box не задаёт принципиально — расстояние между
 * соседями ставит только родительский `<Stack gap>`.
 *
 * Все размерные пропы принимают токен, а не строку: `padding="13px"`
 * не скомпилируется.
 */
export function Box({
  children,
  padding,
  paddingX,
  paddingY,
  background,
  radius,
  border = false,
  fullWidth = false,
  as: Tag = 'div',
}: BoxProps) {
  const style: CSSProperties = {
    padding: padding ? spaceVar[padding] : undefined,
    paddingLeft: paddingX ? spaceVar[paddingX] : undefined,
    paddingRight: paddingX ? spaceVar[paddingX] : undefined,
    paddingTop: paddingY ? spaceVar[paddingY] : undefined,
    paddingBottom: paddingY ? spaceVar[paddingY] : undefined,
    background: background ? color[background] : undefined,
    borderRadius: radius ? radiusVar[radius] : undefined,
    border: border ? `var(--border-hairline) solid ${color.border}` : undefined,
    width: fullWidth ? '100%' : undefined,
  };

  return (
    <Tag className={styles.box} style={style}>
      {children}
    </Tag>
  );
}
