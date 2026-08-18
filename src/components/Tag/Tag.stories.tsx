import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';
import { Stack, Text } from '@/primitives';
import { Labeled } from '@spec';
import { projectTags, label, longLabel } from '@fixtures';

const COLORS = ['steel', 'sage', 'amber', 'clay', 'violet', 'slate'] as const;

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
  args: { children: label, color: 'steel' },
};

/**
 * Шесть цветов. Порядок в палитре смысла не несёт — это выбор автора проекта.
 *
 * Подпись у всех одна: цвет метки задаёт человек, и связывать конкретный
 * цвет с конкретным словом система не вправе. Настоящие метки — в `Usage`.
 */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="lg" wrap align="start">
      {COLORS.map((color) => (
        <Labeled key={color} label={color}>
          <Tag color={color}>{label}</Tag>
        </Labeled>
      ))}
    </Stack>
  ),
};

/** Состояния есть только у кнопки снятия: сама метка не интерактивна. */
export const States: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="md">
      <Stack direction="row" gap="lg" align="start">
        <Labeled label="без снятия">
          <Tag color="steel">{label}</Tag>
        </Labeled>
        <Labeled label="со снятием">
          <Tag color="steel" onRemove={() => undefined}>
            {label}
          </Tag>
        </Labeled>
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
      <Tag color="steel">{label}</Tag>
      <Tag color="amber">{longLabel}</Tag>
      <Tag color="slate" onRemove={() => undefined}>
        {label}
      </Tag>
    </Stack>
  ),
};

/**
 * Примеры использования: метки проекта. Здесь формулировки настоящие —
 * блок показывает, как метки выглядят в списке, а не что умеет компонент.
 */
export const Usage: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="label">Метки в карточке проекта</Text>
      <Stack direction="row" gap="sm" wrap align="center">
        {projectTags.map((tag) => (
          <Tag key={tag.label} color={tag.color} onRemove={() => undefined}>
            {tag.label}
          </Tag>
        ))}
      </Stack>
      <Text variant="bodySm" color="textMuted">
        Цвет здесь выбрал человек: «Черновик» жёлтый не потому, что система назначила жёлтому смысл. Для статуса, у
        которого смысл есть, — `Badge`.
      </Text>
    </Stack>
  ),
};
