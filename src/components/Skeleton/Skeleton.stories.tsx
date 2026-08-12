import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { EmptyState } from '@/components';
import { Stack, Text, Box, Surface, Grid } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: форма будущего содержимого на время загрузки.',
          'Анатомия: одна или несколько полос. У `text` последняя строка короче — так заготовка читается как абзац, а не как блок.',
          'Правила: заготовка повторяет раскладку того, что придёт. Если после загрузки раскладка меняется — заготовка врёт, и это хуже спиннера. Для скринридера она не существует (`aria-hidden`), поэтому область обязана сообщить `aria-busy`.',
          'Не использовать для: областей, которые останутся пустыми — пустота это `EmptyState`, и текст там другой.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'block', 'control'] },
    lines: { control: { type: 'number', min: 1, max: 8 } },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: { variant: 'text', lines: 3 },
  render: (args) => (
    <Box padding="md">
      <Skeleton {...args} />
    </Box>
  ),
};

export const Playground: Story = {
  args: { variant: 'text', lines: 3 },
  render: (args) => (
    <Box padding="md">
      <Skeleton {...args} />
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="text">
        <Box padding="sm">
          <Skeleton variant="text" lines={3} />
        </Box>
      </Labeled>
      <Labeled label="control">
        <Box padding="sm">
          <Skeleton variant="control" />
        </Box>
      </Labeled>
      <Labeled label="block">
        <Box padding="sm">
          <Skeleton variant="block" />
        </Box>
      </Labeled>
    </Stack>
  ),
};

export const Content: Story = {
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="1 строка">
        <Skeleton variant="text" lines={1} />
      </Labeled>
      <Labeled label="3 строки">
        <Skeleton variant="text" lines={3} />
      </Labeled>
      <Labeled label="10 строк">
        <Skeleton variant="text" lines={10} />
      </Labeled>
      <Labeled label="заготовка формы: подпись + контрол">
        <Stack gap="md">
          {[0, 1].map((i) => (
            <Stack key={i} gap="xs">
              <Skeleton variant="text" lines={1} />
              <Skeleton variant="control" />
            </Stack>
          ))}
        </Stack>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  render: () => (
    <Stack gap="xl" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: заготовка занимает всю ширину родителя и не имеет собственной. Высота `block` задана
        пропорцией, а не числом, поэтому в узкой колонке он остаётся прямоугольником, а не полосой.
      </Text>
      <Grid columns={3} gap="lg">
        <Skeleton variant="block" />
        <Skeleton variant="block" />
        <Skeleton variant="block" />
      </Grid>
      <Box padding="sm" border>
        <Skeleton variant="text" lines={4} />
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="lines=0 — не рисуется ничего">
        <Box padding="sm" border>
          <Skeleton variant="text" lines={0} />
        </Box>
      </Labeled>
      <Labeled label="lines=1 — короткой последней строки нет">
        <Skeleton variant="text" lines={1} />
      </Labeled>
      <Labeled label="prefers-reduced-motion">
        <Stack gap="xs">
          <Skeleton variant="text" lines={2} />
          <Text variant="caption" color="textMuted">
            При включённом «уменьшить движение» пульсация выключается — заготовка остаётся статичной полосой.
          </Text>
        </Stack>
      </Labeled>
    </Stack>
  ),
};

export const Anatomy: Story = {
  render: () => (
    <Spec
      slots={['line × lines']}
      annotate={{
        'высота строки': 'space.md',
        'gap между строками': 'space.sm',
        'высота control': 'control.md',
        'пропорция block': '16 / 9',
        radius: 'radius.md',
        фон: 'color.surfaceSunken',
        анимация: 'duration.slow, alternate',
      }}
    >
      <Skeleton variant="text" lines={3} />
    </Spec>
  ),
};

export const Usage: Story = {
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">Заготовка повторяет раскладку результата</Text>
        <Stack direction="row" gap="xl" align="start">
          <Surface level="flat" border padding="lg">
            <Stack gap="sm">
              <Skeleton variant="text" lines={1} />
              <Skeleton variant="text" lines={2} />
            </Stack>
          </Surface>
          <Surface level="flat" border padding="lg">
            <Stack gap="sm">
              <Text variant="headingSm">КМД-1750Т7-Д</Text>
              <Text variant="bodySm" color="textMuted">
                Коркино, железистые кварциты
              </Text>
            </Stack>
          </Surface>
        </Stack>
      </Stack>

      <DoDont reason="Пустота и загрузка — разные состояния. Заготовка на месте, где данных не будет, обещает содержимое, которого никто не дождётся.">
        <Box padding="md">
          <Skeleton variant="text" lines={3} />
        </Box>
        <Surface level="flat" border padding="md">
          <EmptyState icon="search" title="Ничего не найдено" description="Измените условия фильтрации." />
        </Surface>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: ожидания дольше нескольких секунд — затянувшаяся загрузка это ошибка, и о ней надо
        сказать текстом. Область с заготовками обязана нести `aria-busy`: сами заготовки для скринридера не существуют.
      </Text>
    </Stack>
  ),
};
