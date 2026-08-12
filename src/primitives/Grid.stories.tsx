import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';
import { Stack } from './Stack';
import { Box } from './Box';
import { Text } from './Text';
import { Field } from './Field';
import { Input, Textarea } from '@/components';
import { Labeled, Spec, DoDont } from '@spec';
import { unbreakable, longText } from '@fixtures';

const meta = {
  title: 'Primitives/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: сетка из трёх и более колонок равной ширины.',
          'Анатомия: grid → ячейки. Собственных отступов у ячеек нет — расстояние задаёт только `gap`.',
          'Правила: колонки равны по ширине и не зависят от содержимого — на этом держится выравнивание форм. Больше четырёх колонок в системе не бывает: на пятой колонка становится уже поля ввода.',
          'Не использовать для: двух элементов рядом — это `Stack direction="row"`. Не использовать как таблицу: сетка не связывает ячейки в строки и не сортируется.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    columns: { control: 'inline-radio', options: [2, 3, 4] },
    gap: { control: 'select', options: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    rowGap: { control: 'select', options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const Cell = ({ children }: { children: string }) => (
  <Box padding="md" border background="surfaceSunken">
    <Text variant="bodySm">{children}</Text>
  </Box>
);

export const Overview: Story = {
  args: {
    columns: 3,
    gap: 'lg',
    children: (
      <>
        <Cell>Первая</Cell>
        <Cell>Вторая</Cell>
        <Cell>Третья</Cell>
      </>
    ),
  },
};

export const Playground: Story = {
  args: {
    columns: 3,
    gap: 'lg',
    children: (
      <>
        <Cell>Первая</Cell>
        <Cell>Вторая</Cell>
        <Cell>Третья</Cell>
        <Cell>Четвёртая</Cell>
        <Cell>Пятая</Cell>
        <Cell>Шестая</Cell>
      </>
    ),
  },
};

export const Variants: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="2xl">
      {([2, 3, 4] as const).map((columns) => (
        <Labeled key={columns} label={`columns=${columns}`}>
          <Grid columns={columns} gap="lg">
            {Array.from({ length: columns * 2 }, (_, i) => (
              <Cell key={i}>{`Ячейка ${i + 1}`}</Cell>
            ))}
          </Grid>
        </Labeled>
      ))}
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="2xl">
      <Labeled label="одна ячейка в сетке на три колонки">
        <Grid columns={3} gap="lg">
          <Cell>Одна</Cell>
        </Grid>
      </Labeled>

      <Labeled label="неполный последний ряд">
        <Grid columns={3} gap="lg">
          <Cell>Первая</Cell>
          <Cell>Вторая</Cell>
          <Cell>Третья</Cell>
          <Cell>Четвёртая</Cell>
        </Grid>
      </Labeled>

      <Labeled label="ячейки разной высоты — ряд выравнивается по самой высокой">
        <Grid columns={3} gap="lg">
          <Cell>Коротко</Cell>
          <Box padding="md" border background="surfaceSunken">
            <Text variant="bodySm">{longText}</Text>
          </Box>
          <Cell>Тоже коротко</Cell>
        </Grid>
      </Labeled>

      <Labeled label="строка без пробелов не растягивает колонку">
        <Grid columns={3} gap="lg">
          <Cell>{unbreakable}</Cell>
          <Cell>Вторая</Cell>
          <Cell>Третья</Cell>
        </Grid>
      </Labeled>

      <Labeled label="gap=none — ячейки вплотную">
        <Grid columns={3} gap="none">
          <Cell>Первая</Cell>
          <Cell>Вторая</Cell>
          <Cell>Третья</Cell>
        </Grid>
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        На узком экране сетка не схлопывается: шкалы брейкпоинтов в системе нет, и придумывать её ради одного
        компонента нельзя. Пока адаптив нужен — раскладку меняет вызывающий код.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { children: null },
  render: () => (
    <Spec
      slots={['ячейка × N']}
      annotate={{
        колонки: 'repeat(columns, minmax(0, 1fr))',
        gap: 'space.{gap}',
        'row-gap': 'space.{rowGap ?? gap}',
        'ширина колонки': 'равная, не зависит от содержимого',
      }}
    >
      <Grid columns={3} gap="lg">
        <Cell>Первая</Cell>
        <Cell>Вторая</Cell>
        <Cell>Третья</Cell>
      </Grid>
    </Spec>
  ),
};

export const Usage: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="2xl">
      <Stack gap="sm">
        <Text variant="label">Раскладка формы: колонки шире, строки теснее</Text>
        <Grid columns={2} gap="lg" rowGap="md">
          <Field label="Название проекта">{(props) => <Input {...props} fullWidth />}</Field>
          <Field label="Заказчик" variant="floating">
            {(props) => <Input {...props} fullWidth />}
          </Field>
          <Field label="Примечание">{(props) => <Textarea {...props} fullWidth />}</Field>
          <Field label="Дата расчёта">{(props) => <Input {...props} type="date" fullWidth />}</Field>
        </Grid>
      </Stack>

      <DoDont reason="Два элемента в ряд — это ряд, а не сетка. Сетка обещает равные колонки: кнопка растянется до половины ширины формы и станет главным объектом экрана.">
        <Stack direction="row" gap="sm">
          <Cell>Отмена</Cell>
          <Cell>Сохранить</Cell>
        </Stack>
        <Grid columns={2} gap="sm">
          <Cell>Отмена</Cell>
          <Cell>Сохранить</Cell>
        </Grid>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Не использовать как таблицу: сетка не связывает ячейки в строки, её нельзя отсортировать и прочитать
        скринридером как данные. Для данных — `Table`.
      </Text>
    </Stack>
  ),
};
