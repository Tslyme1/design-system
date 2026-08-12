import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';
import { Stack, Text } from '@/primitives';
import { projectTags, crusher } from '@fixtures';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: пользовательская метка проекта. Единственное место системы, где цвет означает выбор пользователя, а не роль.',
          'Не использовать для: статусов системы (успех, ошибка, предупреждение) — там цвет несёт смысл, и для этого нужен `Badge` (не построен). Не брать цвета отсюда для чего-либо, кроме меток.',
          'Палитра перенесена из приложения, а не из сторибука: версии разошлись, и сторибучные значения не выводились ни из чего.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    color: { control: 'inline-radio', options: ['steel', 'sage', 'amber', 'clay', 'violet', 'slate'] },
    onRemove: { action: 'removed' },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: 'Рабочий', color: 'steel' },
};

/** Шесть цветов. Порядок в палитре смысла не несёт — это выбор автора проекта. */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="sm" wrap align="center">
      {projectTags.map((tag) => (
        <Tag key={tag.label} color={tag.color}>
          {tag.label}
        </Tag>
      ))}
      <Tag color="violet">violet</Tag>
    </Stack>
  ),
};

/** Состояния есть только у кнопки снятия: сама метка не интерактивна. */
export const States: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Tag color="steel">Без снятия</Tag>
        <Tag color="steel" onRemove={() => undefined}>
          Со снятием
        </Tag>
      </Stack>
      <Text variant="caption" color="textMuted">
        Наведи на крестик и пройди табом: hover и focus-visible принадлежат кнопке, а не метке.
      </Text>
    </Stack>
  ),
};

/** Длинная метка не растягивает ряд бесконечно — текст переносится вместе с ним. */
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="sm" wrap align="center">
      <Tag color="amber">{crusher.long}</Tag>
      <Tag color="slate" onRemove={() => undefined}>
        Архив
      </Tag>
    </Stack>
  ),
};
