import type { ReactNode, ElementType, CSSProperties } from 'react';
import type { TextVariantToken, TextColorToken } from '../tokens';
import { color } from '../tokens';
import styles from './Text.module.css';

export type TextProps = {
  children: ReactNode;
  /** Типографическая роль. Задаёт размер, интерлиньяж, вес и гарнитуру разом. */
  variant?: TextVariantToken;
  color?: TextColorToken;
  /** Обрезать одной строкой с многоточием. Требует ограниченной ширины родителя. */
  truncate?: boolean;
  /** Выравнивание. Для чисел в таблицах — 'right'. */
  align?: 'left' | 'center' | 'right';
  as?: ElementType;
  /** Связь подписи с контролом. Только для `as="label"` — это семантика, не стиль. */
  htmlFor?: string;
  /** Идентификатор — чтобы на текст можно было сослаться через aria-describedby. */
  id?: string;
};

const variantClass: Record<TextVariantToken, string> = {
  caption: styles.caption,
  bodySm: styles.bodySm,
  body: styles.body,
  bodyLg: styles.bodyLg,
  label: styles.label,
  headingSm: styles.headingSm,
  headingMd: styles.headingMd,
  headingLg: styles.headingLg,
};

/**
 * Типографика.
 *
 * Единственный способ задать размер текста. `font-size` напрямую в системе
 * запрещён: в аудите он дал 18 разных кеглей, включая пары 11/11.5, 12/12.5
 * и 13/13.5, между которыми нет визуальной разницы — только дрейф.
 *
 * Роль выбирается по смыслу, а не по желаемому размеру.
 */
export function Text({
  children,
  variant = 'body',
  color: colorToken = 'text',
  truncate = false,
  align,
  as,
  htmlFor,
  id,
}: TextProps) {
  const defaultTag: ElementType =
    variant === 'headingLg' ? 'h1' : variant === 'headingMd' ? 'h2' : variant === 'headingSm' ? 'h3' : 'span';
  const Tag = as ?? defaultTag;

  const style: CSSProperties = {
    color: color[colorToken],
    textAlign: align,
  };

  const className = [styles.text, variantClass[variant], truncate ? styles.truncate : null]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={className} style={style} htmlFor={htmlFor} id={id}>
      {children}
    </Tag>
  );
}
