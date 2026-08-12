import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';
import { Stack, Text } from '@/primitives';
import { crusher, ore } from '@fixtures';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: плашка выбранного объекта — что именно сейчас выбрано и что с этим можно сделать.',
          'Не использовать для: пользовательских меток — там `Tag`, где цвет означает выбор пользователя. Плашка показывает объект и ведёт к действию над ним.',
          'В аудите собиралась вручную из `.input` с иконкой плюс отдельной кнопки-карандаша рядом: поле ввода служило подложкой для нередактируемого текста.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: [undefined, 'settings', 'folder', 'fileText'] },
    active: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: crusher.short,
    meta: 'Конусная, мелкого дробления',
    icon: 'settings',
    action: { icon: 'pencil', label: 'Сменить дробилку', onClick: () => undefined },
  },
};

/** Три формы: показать, показать выбранное, показать и дать сменить. */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="md" align="start">
      <Chip icon="settings">{crusher.short}</Chip>
      <Chip icon="settings" active>
        {crusher.short}
      </Chip>
      <Chip
        icon="settings"
        meta="Конусная, мелкого дробления"
        action={{ icon: 'pencil', label: 'Сменить дробилку', onClick: () => undefined }}
      >
        {crusher.short}
      </Chip>
    </Stack>
  ),
};

/** Состояния есть только у кликабельной плашки — без `onClick` она статична. */
export const States: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="md" align="start">
      <Chip icon="settings">Статичная — не реагирует</Chip>
      <Chip icon="settings" onClick={() => undefined}>
        Кликабельная — hover, active, focus
      </Chip>
      <Chip icon="settings" onClick={() => undefined} active>
        Выбранная
      </Chip>
      <Text variant="caption" color="textMuted">
        У плашки с `action` два независимых фокуса: сама плашка и кнопка действия.
      </Text>
    </Stack>
  ),
};

/** Длинное обозначение: плашка не растёт бесконечно, текст обрезается. */
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="md" align="start">
      <Chip
        icon="settings"
        meta={ore}
        action={{ icon: 'pencil', label: 'Сменить', onClick: () => undefined }}
      >
        {crusher.long}
      </Chip>
      <Chip icon="folder" fullWidth>
        На всю ширину родителя
      </Chip>
    </Stack>
  ),
};
