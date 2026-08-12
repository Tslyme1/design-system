import type { ElementType, ReactNode } from 'react';
import type { SpaceToken } from '@/tokens';
import { spaceVar } from '@/tokens';
import styles from './Grid.module.css';

export type GridProps = {
  children: ReactNode;
  /**
   * Число колонок. Больше четырёх в этой системе не бывает: на пятой
   * колонка становится уже поля ввода, и форма перестаёт читаться.
   */
  columns?: 2 | 3 | 4;
  gap?: SpaceToken;
  /** Разный шаг по вертикали: строки формы обычно теснее колонок. */
  rowGap?: SpaceToken;
  as?: ElementType;
};

/**
 * Сетка из трёх и более колонок.
 *
 * `Stack` для этого не годится: он раскладывает в один ряд, и колонки
 * в нём выравниваются только случайно — по ширине содержимого.
 *
 * Не использовать для двух элементов рядом — это `Stack direction="row"`.
 *
 * Схлопывания в одну колонку на узком экране здесь нет намеренно:
 * для этого нужна шкала брейкпоинтов, а её в системе пока не существует.
 * Заводить её ради одного компонента — значит выдумать шкалу на глаз.
 */
export function Grid({ children, columns = 2, gap = 'lg', rowGap, as: Tag = 'div' }: GridProps) {
  const className = [styles.grid, styles[`columns${columns}`]].join(' ');

  return (
    <Tag
      className={className}
      style={{
        ['--grid-gap' as string]: spaceVar[gap],
        ['--grid-row-gap' as string]: spaceVar[rowGap ?? gap],
      }}
    >
      {children}
    </Tag>
  );
}
