import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentType } from 'react';
import { Table, TableSummary } from './Table';
import type { TableColumn, TableSort, TableProps } from './Table';
import { Badge, Button, EmptyState } from '@/components';
import { Stack, Text, Box, Grid } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { projectRows, longText, unbreakable, label, description, errorText } from '@fixtures';

/**
 * Тип строки задан явно, а не выведен из фикстуры: вывод даёт union
 * (`capacity: number` и `capacity: null` в разных строках), и обобщённая
 * таблица перестаёт связывать колонки со строками.
 */
type Row = {
  id: string;
  title: string;
  customer: string;
  capacity: number | null;
  status: string;
  note?: string;
};

/**
 * Данные демонстрационных блоков нейтральны: таблица показывает форму —
 * сортировку, выравнивание, прочерк вместо пустой ячейки, — а не предметный
 * отчёт. Настоящие проекты со статусами живут в блоке `Usage`.
 *
 * Числа и пустая третья строка оставлены как есть: выравнивание по правому
 * краю и прочерк на пустом значении показать иначе нечем.
 */
const rows: Row[] = [
  { id: '1', title: 'Value 1', customer: 'Value', capacity: 1250, status: 'Label' },
  { id: '2', title: 'Value 2', customer: 'Value', capacity: 890, status: 'Label' },
  { id: '3', title: 'Value 3', customer: '', capacity: null, status: 'Label' },
];

const columns: TableColumn<Row>[] = [
  { key: 'title', title: 'Label 1', sortable: true },
  { key: 'customer', title: 'Label 2', sortable: true },
  { key: 'capacity', title: 'Label 3', align: 'end', sortable: true },
  {
    key: 'status',
    title: 'Label 4',
    render: (row) => <Badge tone="neutral">{row.status}</Badge>,
  },
];

/** Предметные данные — только для блока `Usage`. */
const usageRows = projectRows as Row[];

const usageColumns: TableColumn<Row>[] = [
  { key: 'title', title: 'Обозначение', sortable: true },
  { key: 'customer', title: 'Заказчик', sortable: true },
  { key: 'capacity', title: 'Производительность, т/ч', align: 'end', sortable: true },
  {
    key: 'status',
    title: 'Статус',
    render: (row) => (
      <Badge
        tone={row.status === 'Согласовано' ? 'success' : row.status === 'В работе' ? 'accent' : 'neutral'}
        icon={row.status === 'Согласовано'}
      >
        {row.status}
      </Badge>
    ),
  },
];

const meta: Meta<TableProps<Row>> = {
  title: 'Components/Table',
  // Таблица обобщённая: без приведения Storybook выводит её пропсы как unknown.
  component: Table as ComponentType<TableProps<Row>>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: данные, которые сравнивают по столбцам.',
          'Анатомия: caption / thead → th × N / tbody → tr → td × N / TableSummary?. `caption` обязателен: таблица без названия не читается в списке заголовков скринридера.',
          'Правила: пустое значение показывается прочерком «—», а не пустой ячейкой — пустая читается как «забыли заполнить». Числа выравниваются по правому краю, чтобы их можно было сравнивать столбиком. Действие живёт в первой ячейке, а не на строке: у `tr` нет роли и его нельзя открыть в новой вкладке.',
          'Не использовать для: раскладки — для формы есть `Grid`.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<TableProps<Row>>;

const base = { columns, rows, rowKey: (row: Row) => row.id, caption: 'Label' };

const usageBase = { columns: usageColumns, rows: usageRows, rowKey: (row: Row) => row.id, caption: 'Проекты' };

export const Playground: Story = {
  args: base,
  render: (args) => {
    const [sort, setSort] = useState<TableSort | null>({ key: 'title', direction: 'asc' });
    return <Table {...args} sort={sort} onSortChange={setSort} />;
  },
};

/** Три формы: только чтение, с сортировкой, с переходом по строке и итогом. */
export const Variants: Story = {
  args: base,
  render: () => {
    const [sort, setSort] = useState<TableSort | null>(null);
    return (
      <Stack gap="2xl">
        <Labeled label="только чтение">
          <Table {...base} />
        </Labeled>
        <Labeled label="sortable">
          <Table {...base} sort={sort} onSortChange={setSort} />
        </Labeled>
        <Labeled label="onRowClick + TableSummary">
          <Stack gap="none">
            <Table {...base} onRowClick={() => undefined} />
            <TableSummary>Итого: Value</TableSummary>
          </Stack>
        </Labeled>
      </Stack>
    );
  },
};

export const States: Story = {
  args: base,
  render: () => {
    const [sort, setSort] = useState<TableSort | null>({ key: 'capacity', direction: 'desc' });
    return (
      <Stack gap="xl">
        <Text variant="bodySm" color="textMuted">
          Наведи на строку и пройди табом. Фокус принадлежит кнопке в первой ячейке, подсветка — всей строке.
          Направление сортировки читается по шеврону и по `aria-sort`.
        </Text>
        <Table {...base} sort={sort} onSortChange={setSort} onRowClick={() => undefined} />
      </Stack>
    );
  },
};

/** Матрица: форма таблицы × состояние данных. Пустая и ошибочная не зависят от сортировки. */
export const VariantStates: Story = {
  args: base,
  render: () => (
    <Stack gap="2xl">
      {(
        [
          { label: 'sortable', props: { sort: { key: 'title', direction: 'asc' } as TableSort, onSortChange: () => undefined } },
          { label: 'onRowClick', props: { onRowClick: () => undefined } },
        ] as const
      ).map((variant) => (
        <Stack key={variant.label} gap="lg">
          <Text variant="label">{variant.label}</Text>
          <Labeled label="данные">
            <Table {...base} {...variant.props} />
          </Labeled>
          <Labeled label="пусто">
            <Table {...base} {...variant.props} rows={[]} />
          </Labeled>
        </Stack>
      ))}
    </Stack>
  ),
};

/** Загрузка, пустота и ошибка. Шапка остаётся на месте во всех трёх. */
export const DataStates: Story = {
  args: base,
  render: () => (
    <Stack gap="2xl">
      <Labeled label="loading">
        <Table {...base} rows={[]} loading />
      </Labeled>
      <Labeled label="empty — по умолчанию">
        <Table {...base} rows={[]} />
      </Labeled>
      <Labeled label="empty — со своим текстом и действием">
        <Table
          {...base}
          rows={[]}
          empty={
            <EmptyState
              icon="placeholder"
              title={label}
              description={description}
              action={
                <Button variant="primary" size="sm" iconStart="placeholder">
                  Label
                </Button>
              }
            />
          }
        />
      </Labeled>
      <Labeled label="error">
        <Table {...base} rows={[]} error={errorText} />
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Ошибка вытесняет строки целиком: половина данных хуже, чем ничего — по ней принимают решения, не зная, что
        она неполная. На загрузке таблица несёт `aria-busy`, потому что заготовки для скринридера не существуют.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  args: base,
  render: () => (
    <Stack gap="2xl">
      <Labeled label="одна строка">
        <Table {...base} rows={[rows[0]]} />
      </Labeled>
      <Labeled label="строка с дырами — прочерк вместо пустоты">
        <Table {...base} rows={[rows[2]]} />
      </Labeled>
      <Labeled label="десять строк">
        <Table
          {...base}
          rows={Array.from({ length: 10 }, (_, i) => ({ ...rows[i % 3], id: String(i) }))}
        />
      </Labeled>
      <Labeled label="две колонки">
        <Table {...base} columns={columns.slice(0, 2)} />
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: base,
  render: () => (
    <Stack gap="xl">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: таблица шире контейнера прокручивается внутри себя, а не растягивает страницу. Текст в
        ячейке переносится, ячейка растёт вниз — обрезать данные нельзя, их читают.
      </Text>

      <Labeled label="много колонок в узком контейнере">
        <Box border padding="md">
          <Table
            {...base}
            columns={[
              ...columns,
              { key: 'note', title: 'Label 5' },
              { key: 'author', title: 'Label 6' },
              { key: 'date', title: 'Label 7' },
            ]}
          />
        </Box>
      </Labeled>

      <Labeled label="длинный текст и строка без пробелов в ячейке">
        <Table
          {...base}
          columns={[
            { key: 'title', title: 'Label 1' },
            { key: 'note', title: 'Label 2' },
          ]}
          rows={[
            { ...rows[0], note: longText },
            { ...rows[1], note: unbreakable },
          ]}
        />
      </Labeled>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: base,
  render: () => (
    <Stack gap="2xl">
      <Labeled label="ноль в числовой колонке — это значение, а не пустота">
        <Table {...base} rows={[{ ...rows[0], capacity: 0 }]} />
      </Labeled>
      <Labeled label="отрицательное число">
        <Table {...base} rows={[{ ...rows[0], capacity: -15 }]} />
      </Labeled>
      <Labeled label="очень большое число">
        <Table {...base} rows={[{ ...rows[0], capacity: 1234567890 }]} />
      </Labeled>
      <Labeled label="все значения пустые">
        <Table {...base} rows={[{ id: 'x', title: '', customer: '', capacity: null, status: '' }]} />
      </Labeled>
      <Labeled label="ни одной колонки">
        <Table {...base} columns={[]} rows={[]} />
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Ноль обязан отличаться от прочерка: «0 т/ч» означает остановленную линию, «—» означает, что величину не
        считали. Подмена одного другим — потеря данных.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: base,
  render: () => (
    <Spec
      slots={['caption', 'thead → th', 'tbody → tr → td', 'TableSummary?']}
      annotate={{
        'padding ячейки': 'space.sm space.lg',
        'padding caption': 'space.md space.lg',
        'разделители': 'hairline / color.border',
        'фон шапки': 'color.surfaceSunken',
        'типографика шапки': 'text.label',
        'типографика ячейки': 'text.bodySm',
        'подсветка строки': 'color.accentSubtle',
        прочерк: 'color.textMuted',
      }}
    >
      <Table {...base} rows={[rows[0], rows[2]]} onRowClick={() => undefined} />
    </Spec>
  ),
};

/**
 * Примеры использования: настоящие данные — обозначения, заказчики, статусы.
 * В блоках выше на их месте стоят «Label» и «Value»: там показана форма
 * таблицы, а не содержимое конкретного отчёта.
 */
export const Usage: Story = {
  args: usageBase,
  render: () => (
    <Stack gap="2xl">
      <Stack gap="sm">
        <Text variant="label">Список проектов</Text>
        <Stack gap="none">
          <Table
            {...usageBase}
            onRowClick={() => undefined}
            sort={{ key: 'capacity', direction: 'desc' }}
            onSortChange={() => undefined}
          />
          <TableSummary>Итого: 2 140 т/ч</TableSummary>
        </Stack>
      </Stack>

      <DoDont reason="Пустая ячейка читается как недосмотр вёрстки: непонятно, значения нет или его не показали. Прочерк — это явное «величина отсутствует».">
        <Table {...usageBase} rows={[usageRows[2]]} caption="С прочерком" />
        <Box border padding="md">
          <Grid columns={2} gap="sm">
            <Text variant="bodySm">ККД-1500/180</Text>
            <Text variant="bodySm"> </Text>
          </Grid>
        </Box>
      </DoDont>

      <DoDont reason="Таблица связывает ячейки в строки и колонки: её читают вдоль и поперёк, сортируют и сравнивают. Сетка ничего не связывает — она про раскладку.">
        <Table {...usageBase} columns={usageColumns.slice(0, 3)} caption="Данные — таблицей" />
        <Box border padding="md">
          <Grid columns={2} gap="md">
            <Text variant="label">Заказчик</Text>
            <Text variant="body">ММК</Text>
            <Text variant="label">Дата</Text>
            <Text variant="body">12.08.2026</Text>
          </Grid>
        </Box>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: раскладки формы — там `Grid`. Липкой шапки здесь нет намеренно: для неё нужна шкала
        высот областей, которой в системе не существует.
      </Text>
    </Stack>
  ),
};
