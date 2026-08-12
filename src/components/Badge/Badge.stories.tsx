import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import type { BadgeTone } from './Badge';
import { Stack, Text, Box } from '@/primitives';
import { Tag } from '@/components';
import { Labeled, Spec, DoDont } from '@spec';
import { unbreakable, longWord } from '@fixtures';

const TONES: readonly BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'danger'];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: статус системы — состояние объекта, а не выбор человека.',
          'Анатомия: icon? / label. Слот `label` обязателен, `icon` — необязателен, но обязателен у warning и danger.',
          'Правила: цвет означает смысл, а не оформление; статус, отличимый только по цвету, не читается при дальтонизме и в печати. Подпись — одно-два слова, без точки.',
          'Не использовать для: пользовательских меток — там `Tag`, где цвет означает выбор человека.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    icon: { control: 'select', options: [undefined, 'check', 'alertTriangle', 'x', 'info'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Порядок экспортов = порядок в сайдбаре. Не переставлять.

// 1. Основной компонент
export const Overview: Story = {
  args: { children: 'Согласовано', tone: 'success', icon: 'check' },
};

// 2. Песочница
export const Playground: Story = {
  args: { children: 'В работе', tone: 'accent' },
};

// 3. Варианты
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="lg" wrap align="start">
      {TONES.map((tone) => (
        <Labeled key={tone} label={tone}>
          <Badge tone={tone} icon={tone === 'success' ? 'check' : tone === 'warning' ? 'alertTriangle' : tone === 'danger' ? 'x' : undefined}>
            {tone === 'neutral' ? 'Черновик' : tone === 'accent' ? 'В работе' : tone === 'success' ? 'Согласовано' : tone === 'warning' ? 'Проверить' : 'Ошибка'}
          </Badge>
        </Labeled>
      ))}
    </Stack>
  ),
};

// 8. Наполнение
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="только подпись">
        <Badge tone="neutral">Черновик</Badge>
      </Labeled>
      <Labeled label="иконка + подпись">
        <Badge tone="danger" icon="x">
          Ошибка расчёта
        </Badge>
      </Labeled>
      <Labeled label="в строке текста">
        <Text variant="body">
          Расчёт КМД-1750Т7-Д <Badge tone="success" icon="check">Согласовано</Badge> от 12.08.2026
        </Text>
      </Labeled>
      <Labeled label="группа из трёх">
        <Stack direction="row" gap="xs" wrap>
          <Badge tone="success" icon="check">Готово</Badge>
          <Badge tone="warning" icon="alertTriangle">Проверить</Badge>
          <Badge tone="neutral">Архив</Badge>
        </Stack>
      </Labeled>
    </Stack>
  ),
};

// 9. Переполнение
export const Overflow: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: подпись обрезается многоточием, бейдж не переносится на вторую строку и не растягивает
        соседей. Статус в две строки перестаёт читаться как метка состояния.
      </Text>

      <Labeled label="длинная подпись">
        <Badge tone="warning" icon="alertTriangle">
          Требует повторной проверки после изменения гранулометрического состава
        </Badge>
      </Labeled>

      <Labeled label="строка без пробелов">
        <Badge tone="neutral">{unbreakable}</Badge>
      </Labeled>

      <Labeled label="узкий контейнер">
        <Box padding="sm" border>
          <Stack gap="xs">
            <Badge tone="accent">{longWord}</Badge>
          </Stack>
        </Box>
      </Labeled>
    </Stack>
  ),
};

// 10. Корнер-кейсы
export const EdgeCases: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="одна буква">
        <Badge tone="danger">!</Badge>
      </Labeled>
      <Labeled label="число">
        <Badge tone="accent">0</Badge>
      </Labeled>
      <Labeled label="пустая подпись — так быть не должно">
        <Badge tone="neutral">{''}</Badge>
      </Labeled>
      <Labeled label="только иконка без текста — тоже не должно">
        <Badge tone="success" icon="check">
          {' '}
        </Badge>
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Последние два случая показаны намеренно: бейдж без подписи выглядит как обрезок вёрстки. Если статус нечем
        назвать — это не статус, и его не надо показывать.
      </Text>
    </Stack>
  ),
};

// 11. Вёрстка
export const Anatomy: Story = {
  args: { children: '' },
  render: () => (
    <Spec
      slots={['icon?', 'label']}
      annotate={{
        'padding-block': 'space.2xs',
        'padding-inline': 'space.sm',
        gap: 'space.2xs',
        radius: 'radius.md',
        типографика: 'text.label (12 / 1.35 / 600)',
        фон: 'color.{tone}Subtle',
        текст: 'color.{tone}Text',
      }}
    >
      <Badge tone="success" icon="check">
        Согласовано
      </Badge>
    </Spec>
  ),
};

// 12. Примеры использования
export const Usage: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">В строке списка</Text>
        <Stack gap="xs">
          {[
            { name: 'КМД-1750Т7-Д', tone: 'success' as const, status: 'Согласовано', icon: 'check' as const },
            { name: 'КСД-2200Т-Д', tone: 'accent' as const, status: 'В работе', icon: undefined },
            { name: 'ККД-1500/180', tone: 'warning' as const, status: 'Проверить', icon: 'alertTriangle' as const },
          ].map((row) => (
            <Stack key={row.name} direction="row" gap="md" align="center">
              <Text variant="bodySm">{row.name}</Text>
              <Badge tone={row.tone} icon={row.icon}>
                {row.status}
              </Badge>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <DoDont reason="Цвет статуса — роль. У метки цвет выбирает человек, и красный там ничего не означает; поставив статус меткой, вы обесцениваете красный на всём экране.">
        <Badge tone="danger" icon="x">
          Ошибка расчёта
        </Badge>
        <Tag color="clay">Ошибка расчёта</Tag>
      </DoDont>

      <DoDont reason="Без иконки статус отличается только цветом — он пропадает при дальтонизме, в печати и на плохом мониторе.">
        <Badge tone="warning" icon="alertTriangle">
          Проверить
        </Badge>
        <Badge tone="warning">Проверить</Badge>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: пользовательских меток — там `Tag`. Плашку выбранного объекта закрывает `Chip`.
      </Text>
    </Stack>
  ),
};
