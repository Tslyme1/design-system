import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from './Surface';
import { Stack } from './Stack';
import { Text } from './Text';
import { crusher, ore } from '@fixtures';

const meta = {
  title: 'Primitives/Surface',
  component: Surface,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: поверхность с уровнем подъёма. **Тень или бордер, не оба сразу.**',
          'Не использовать для: модалок — у `Modal` своя поверхность с оговорённым исключением из этого правила.',
          'Состояния появляются только при `interactive`: поверхность, которая реагирует на наведение, обязана быть кликабельной, иначе она обманывает.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    level: { control: 'inline-radio', options: ['flat', 'raised', 'overlay', 'modal'] },
    radius: { control: 'inline-radio', options: ['none', 'md', 'full'] },
    padding: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    border: { control: 'boolean' },
    interactive: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

const Body = () => (
  <Stack gap="2xs">
    <Text variant="headingSm">{crusher.short}</Text>
    <Text variant="bodySm" color="textMuted">
      {ore}
    </Text>
  </Stack>
);

export const Playground: Story = {
  args: {
    level: 'flat',
    border: true,
    radius: 'none',
    padding: 'lg',
    children: <Body />,
  },
};

/** Четыре уровня. `flat` с рамкой — основной вид системы. */
export const Variants: Story = {
  args: { children: null },
  render: () => (
    <Stack direction="row" gap="xl" wrap align="start">
      <Surface level="flat" border padding="lg">
        <Text variant="label">flat + border</Text>
      </Surface>
      <Surface level="raised" padding="lg" radius="md">
        <Text variant="label">raised</Text>
      </Surface>
      <Surface level="overlay" padding="lg" radius="md">
        <Text variant="label">overlay</Text>
      </Surface>
      <Surface level="modal" border padding="lg" radius="md">
        <Text variant="label">modal</Text>
      </Surface>
    </Stack>
  ),
};

/**
 * Состояния только у `interactive`. Наведи и пройди табом:
 * кольцо фокуса одно на весь проект и не переопределяется на месте.
 */
export const States: Story = {
  args: { children: null },
  render: () => (
    <Stack direction="row" gap="xl" wrap align="start">
      <Surface level="flat" border padding="lg">
        <Text variant="label">Обычная — не реагирует</Text>
      </Surface>
      <Surface level="flat" border padding="lg" interactive>
        <Text variant="label">interactive — hover, active, focus</Text>
      </Surface>
    </Stack>
  ),
};
