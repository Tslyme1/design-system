import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';
import { Stack } from './Stack';
import { Text } from './Text';

const meta = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: внутренний отступ, фон, рамка и скругление — всё из шкал.',
          'Не использовать для: расстояния между соседями — это задача `Stack gap`. Box намеренно не умеет внешние отступы: пропа `margin` у него нет и не будет.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    padding: { control: 'select', options: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    background: {
      control: 'select',
      options: ['bg', 'surface', 'surfaceRaised', 'surfaceSunken', 'accentSubtle', 'dangerSubtle', 'successSubtle', 'warningSubtle'],
    },
    radius: { control: 'inline-radio', options: ['none', 'md', 'full'] },
    border: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    padding: 'lg',
    border: true,
    background: 'surface',
    children: <Text variant="body">Label</Text>,
  },
};

/** Подложки статусов: цвет означает роль, а не оформление. */
export const Backgrounds: Story = {
  args: { children: null },
  render: () => (
    <Stack direction="row" gap="md" wrap align="start">
      {(['surfaceSunken', 'accentSubtle', 'successSubtle', 'warningSubtle', 'dangerSubtle'] as const).map((bg) => (
        <Box key={bg} padding="md" background={bg} radius="md">
          <Text variant="bodySm">{bg}</Text>
        </Box>
      ))}
    </Stack>
  ),
};
