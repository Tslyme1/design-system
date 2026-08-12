import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Text, Surface } from '@/primitives';
import type { ElevationToken } from '@/tokens';

const meta: Meta = {
  title: 'Foundations/Elevation',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Четыре уровня. **Правило: тень или бордер, не оба сразу.** Единственное оговорённое исключение — модалка: без рамки её край теряется на тёмной теме.',
          'Проверяй страницу в обеих темах: тень на тёмном фоне работает иначе, поэтому для тёмной темы значения свои.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LEVELS: { level: ElevationToken; title: string; note: string; border: boolean }[] = [
  { level: 'flat', title: 'flat', note: 'Основной вид карточек и фигур: хайрлайн-рамка, без тени', border: true },
  { level: 'raised', title: 'raised', note: 'Слегка приподнято, но остаётся в потоке', border: false },
  { level: 'overlay', title: 'overlay', note: 'Выпадающее меню, поповер, подсказка', border: false },
  { level: 'modal', title: 'modal', note: 'Модальное окно — единственное место с тенью и рамкой сразу', border: true },
];

export const Playground: Story = {
  render: () => (
    <Stack direction="row" gap="2xl" wrap align="start">
      {LEVELS.map((item) => (
        <Surface key={item.level} level={item.level} border={item.border} padding="lg" radius="md">
          <Stack gap="2xs">
            <Text variant="label">{item.title}</Text>
            <Text variant="caption" color="textMuted">
              {item.note}
            </Text>
          </Stack>
        </Surface>
      ))}
    </Stack>
  ),
};
