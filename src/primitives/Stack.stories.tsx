import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { Box } from './Box';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: расстояние между соседями. Единственный разрешённый способ его поставить.',
          'Не использовать для: сеток из трёх и более колонок — для них нужен `Grid` (не построен, спросить). Не использовать вместо `Box`, когда нужен только внутренний отступ.',
          '`margin` между соседними элементами запрещён на уровне правил проекта: расстояние принадлежит контейнеру, а не элементу, иначе оно удваивается и разъезжается при переносе.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    gap: { control: 'select', options: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around'] },
    wrap: { control: 'boolean' },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Item = ({ children }: { children: string }) => (
  <Box padding="md" border background="surfaceSunken">
    <Text variant="bodySm">{children}</Text>
  </Box>
);

export const Playground: Story = {
  args: {
    direction: 'row',
    gap: 'md',
    align: 'center',
    children: (
      <>
        <Item>Первый</Item>
        <Item>Второй</Item>
        <Item>Третий</Item>
      </>
    ),
  },
};

/** Плотность решает иерархию: внутри группы теснее, чем между группами. */
export const InContext: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="label">Заказчик</Text>
        <Text variant="body">ММК</Text>
      </Stack>
      <Stack gap="xs">
        <Text variant="label">Дата расчёта</Text>
        <Text variant="body">12.08.2026</Text>
      </Stack>
    </Stack>
  ),
};
