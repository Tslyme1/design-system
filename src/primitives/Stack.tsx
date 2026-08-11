import type { ReactNode, ElementType, CSSProperties } from 'react';
import type { SpaceToken } from '@/tokens';
import { spaceVar } from '@/tokens';
import styles from './Stack.module.css';

export type StackProps = {
  children: ReactNode;
  /** Направление раскладки. По умолчанию — колонка. */
  direction?: 'row' | 'column';
  /** Расстояние между детьми. Единственный легальный способ его задать. */
  gap?: SpaceToken;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  /** Растянуть по доступной ширине родителя. */
  grow?: boolean;
  /** Тег-обёртка. Для семантики разметки: 'ul', 'section', 'header'. */
  as?: ElementType;
};

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const;

/**
 * Раскладка с расстоянием между детьми.
 *
 * Это единственный разрешённый способ поставить отступ между соседями.
 * `margin` в системе запрещён: он схлопывается, наследуется и не читается
 * в структуре — из-за него в аудите нашлось 517 разных значений отступа.
 *
 * Проп `gap` принимает только токен: `gap="13px"` не скомпилируется.
 *
 * Пропа `className` нет намеренно. Если нужен стиль, которого здесь нет, —
 * это сигнал расширить систему, а не обойти её.
 */
export function Stack({
  children,
  direction = 'column',
  gap = 'none',
  align,
  justify,
  wrap = false,
  grow = false,
  as: Tag = 'div',
}: StackProps) {
  const style: CSSProperties = {
    flexDirection: direction,
    gap: spaceVar[gap],
    alignItems: align ? alignMap[align] : undefined,
    justifyContent: justify ? justifyMap[justify] : undefined,
    flexWrap: wrap ? 'wrap' : undefined,
    flexGrow: grow ? 1 : undefined,
  };

  return (
    <Tag className={styles.stack} style={style}>
      {children}
    </Tag>
  );
}
