import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { Stack } from './Stack';
import { Text } from './Text';
import { icons } from './icons';
import type { IconName } from './icons';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: пиктограмма из закрытого набора. Lucide, обводка 1.5, сетка 24×24.',
          'Не использовать для: иллюстраций и схем. Набор закрыт: добавление иконки требует согласия, как и добавление токена.',
          'Иконка без соседнего текста обязана получить `label` — иначе кнопка с одной иконкой нема для скринридера.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: Object.keys(icons) },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: ['text', 'textMuted', 'textDisabled', 'accentText', 'dangerText', 'successText', 'warningText'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { name: 'settings', size: 'md' },
};

/** Весь набор. Полная сетка с именами — на странице Foundations/Iconography. */
export const Variants: Story = {
  args: { name: 'settings' },
  render: () => (
    <Stack direction="row" gap="md" wrap align="center">
      {(Object.keys(icons) as IconName[]).map((name) => (
        <Icon key={name} name={name} size="md" />
      ))}
    </Stack>
  ),
};

/**
 * Собственного цвета у иконки нет: она наследует `currentColor` от родителя.
 * Проп `color` — это та же семантическая роль, что у текста.
 */
export const States: Story = {
  args: { name: 'alertTriangle' },
  render: () => (
    <Stack gap="md">
      <Stack direction="row" gap="md" align="center">
        <Icon name="alertTriangle" color="dangerText" />
        <Text variant="body" color="dangerText">
          Наследует цвет текста рядом
        </Text>
      </Stack>
      <Stack direction="row" gap="md" align="center">
        <Icon name="check" color="successText" />
        <Text variant="body" color="successText">
          Расчёт завершён
        </Text>
      </Stack>
      <Stack direction="row" gap="md" align="center">
        <Icon name="info" color="textDisabled" />
        <Text variant="body" color="textDisabled">
          Недоступно
        </Text>
      </Stack>
    </Stack>
  ),
};

/** Три размера: рядом с текстом, в контроле, в пустом состоянии. */
export const Sizes: Story = {
  args: { name: 'folder' },
  render: () => (
    <Stack direction="row" gap="xl" align="center">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Stack key={size} gap="2xs" align="center">
          <Icon name="folder" size={size} />
          <Text variant="caption" color="textMuted">
            {size}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
};
