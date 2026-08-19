import type { ReactNode } from 'react';
import { Icon, Text, Stack } from '../../primitives';
import { Skeleton } from '../Skeleton/Skeleton';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './Table.module.css';

export type SortDirection = 'asc' | 'desc';

export type TableSort = { key: string; direction: SortDirection };

export type TableColumn<Row> = {
  /** Ключ колонки. По нему же приходит сортировка. */
  key: string;
  title: string;
  /** Числа выравниваются по правому краю: так их можно сравнивать столбиком. */
  align?: 'start' | 'end';
  sortable?: boolean;
  /** Своё содержимое ячейки. Без него берётся `row[key]`. */
  render?: (row: Row) => ReactNode;
};

export type TableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Устойчивый ключ строки. Индекс массива не годится: он меняется при сортировке. */
  rowKey: (row: Row) => string;
  /**
   * Название таблицы. Без него блок названия не рисуется совсем.
   *
   * Опускать стоит там, где название таблице уже дано снаружи — заголовком
   * раздела или подписью панели. Тогда таблица берёт имя оттуда; если рядом
   * нет и такого, в списке заголовков скринридера она останется безымянной.
   */
  caption?: string;
  /**
   * Убрать название с экрана, оставив его скринридеру.
   *
   * Средний вариант между видимым названием и его отсутствием: глаз не
   * читает два одинаковых текста подряд, а таблица при этом остаётся
   * различимой в списке заголовков. Без `caption` не действует.
   */
  captionHidden?: boolean;
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort) => void;
  onRowClick?: (row: Row) => void;
  /** Показать заготовки вместо строк. Шапка при этом остаётся на месте. */
  loading?: boolean;
  /** Текст ошибки загрузки. Вытесняет строки: половина данных хуже, чем ничего. */
  error?: string;
  /** Что показать, когда строк нет. По умолчанию — короткое пустое состояние. */
  empty?: ReactNode;
};

/** Пустое значение показывается прочерком, а не пустой ячейкой: пустая читается как «забыли». */
const DASH = '—';

function cellValue<Row>(row: Row, column: TableColumn<Row>): ReactNode {
  if (column.render) return column.render(row);
  const value = (row as Record<string, unknown>)[column.key];
  if (value === null || value === undefined || value === '') return <span className={styles.dash}>{DASH}</span>;
  return String(value);
}

/**
 * Таблица данных.
 *
 * Шапка, сортировка, наведение на строку и прочерк для пустых значений
 * заведены здесь один раз. В аудите прочерк встречался 56 раз в трёх
 * разных размерах — каждый экран решал это заново.
 *
 * Не использовать для раскладки: таблица означает данные, которые
 * сравнивают по столбцам. Для раскладки формы есть `Grid`.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  caption,
  captionHidden = false,
  sort,
  onSortChange,
  onRowClick,
  loading = false,
  error,
  empty,
}: TableProps<Row>) {
  const toggleSort = (key: string) => {
    if (!onSortChange) return;
    const direction: SortDirection = sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ key, direction });
  };

  const body = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={columns.length} className={styles.stateCell}>
            <EmptyState icon="alertTriangle" title="Не удалось загрузить данные" description={error} />
          </td>
        </tr>
      );
    }

    if (loading) {
      // Три строки-заготовки: одна читается как сбой, десять — как содержимое.
      return Array.from({ length: 3 }, (_, i) => (
        <tr key={i} className={styles.row}>
          {columns.map((column) => (
            <td key={column.key} className={styles.cell}>
              <Skeleton variant="text" />
            </td>
          ))}
        </tr>
      ));
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className={styles.stateCell}>
            {empty ?? <EmptyState icon="search" title="Нет данных" description="Измените условия фильтрации." />}
          </td>
        </tr>
      );
    }

    return rows.map((row) => (
      <tr
        key={rowKey(row)}
        className={[styles.row, onRowClick ? styles.interactive : null].filter(Boolean).join(' ')}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
      >
        {columns.map((column, index) => (
          <td
            key={column.key}
            className={[styles.cell, column.align === 'end' ? styles.alignEnd : null].filter(Boolean).join(' ')}
          >
            {/* Действие живёт в первой ячейке, а не на строке: у `tr` нет
                роли, его нельзя открыть в новой вкладке, а фокус на каждой
                строке превращает проход по таблице в сотню нажатий таба. */}
            {onRowClick && index === 0 ? (
              <button
                type="button"
                className={styles.rowAction}
                onClick={(event) => {
                  event.stopPropagation();
                  onRowClick(row);
                }}
              >
                {cellValue(row, column)}
              </button>
            ) : (
              cellValue(row, column)
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={styles.scroll}>
      {/* aria-busy сообщает о загрузке тем, кто не видит заготовок:
          сами Skeleton помечены aria-hidden и для скринридера не существуют. */}
      <table className={styles.table} aria-busy={loading || undefined}>
        {/* Пустой `caption` не рисуется: пустой блок читался бы как
            потерянный заголовок, а не как его отсутствие. */}
        {caption ? (
          <caption className={[styles.caption, captionHidden ? styles.captionHidden : null].filter(Boolean).join(' ')}>
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {columns.map((column) => {
              const sorted = sort?.key === column.key;
              const ariaSort = sorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined;

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={[styles.head, column.align === 'end' ? styles.alignEnd : null].filter(Boolean).join(' ')}
                >
                  {column.sortable && onSortChange ? (
                    <button type="button" className={styles.sortButton} onClick={() => toggleSort(column.key)}>
                      <span className={styles.headLabel}>{column.title}</span>
                      <Icon
                        name={sorted && sort.direction === 'desc' ? 'chevronDown' : 'chevronUp'}
                        size="sm"
                        color={sorted ? 'text' : 'textDisabled'}
                      />
                    </button>
                  ) : (
                    <span className={styles.headLabel}>{column.title}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{body()}</tbody>
      </table>
    </div>
  );
}

/**
 * Итоговая строка под таблицей. Отдельным элементом, а не строкой таблицы:
 * итог не сортируется вместе с данными и не должен уезжать при сортировке.
 */
export function TableSummary({ children }: { children: ReactNode }) {
  return (
    <div className={styles.summary}>
      <Stack direction="row" gap="lg" justify="end" align="baseline">
        <Text variant="label">{children}</Text>
      </Stack>
    </div>
  );
}
