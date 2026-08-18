import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';
import { Stack } from './Stack';
import { Box } from './Box';
import { longText, label } from '@fixtures';

const VARIANTS = ['headingLg', 'headingMd', 'headingSm', 'bodyLg', 'body', 'bodySm', 'label', 'caption'] as const;

const meta = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: весь текст в проекте. `font-size` напрямую задавать нельзя — только `variant`.',
          'Не использовать для: подгонки размера под макет. Роль выбирается по смыслу; если смысл требует другого размера — это вопрос к шкале, а не к месту применения.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: {
      control: 'select',
      options: ['text', 'textMuted', 'textDisabled', 'accentText', 'dangerText', 'successText', 'warningText'],
    },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    truncate: { control: 'boolean' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'body',
    color: 'text',
    children: label,
  },
};

/** Восемь ролей. Подписи говорят о назначении, а не о кегле. */
export const Variants: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="md">
      {VARIANTS.map((variant) => (
        <Text key={variant} variant={variant}>
          {variant}
        </Text>
      ))}
    </Stack>
  ),
};

/** Цвет — роль, а не оттенок. `textDisabled` не заменяет `textMuted`. */
export const Colors: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="sm">
      {(['text', 'textMuted', 'textDisabled', 'accentText', 'dangerText', 'successText', 'warningText'] as const).map(
        (color) => (
          <Text key={color} variant="body" color={color}>
            {color}
          </Text>
        )
      )}
    </Stack>
  ),
};

/** Длинный текст: перенос по умолчанию, обрезка — только по требованию. */
export const Content: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="lg">
      <Box padding="md" border>
        <Text variant="body">{longText}</Text>
      </Box>
      <Box padding="md" border>
        <Text variant="body" truncate>
          {longText}
        </Text>
      </Box>
    </Stack>
  ),
};
