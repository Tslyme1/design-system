import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, badgeToneIcons } from './Badge';
import type { BadgeProps, BadgeTone } from './Badge';
import { Stack, Text, Box } from '@/primitives';
import { Tag } from '@/components';
import { Labeled, Spec, DoDont } from '@spec';
import { unbreakable, longWord, label, longLabel } from '@fixtures';
import styles from './Badge.stories.module.css';

const TONES: readonly BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'danger'];

/**
 * Подпись в демонстрационных блоках одна на все роли.
 *
 * Роль сообщают цвет и иконка, а не слово: если рядом с `success` написать
 * «Согласовано», а рядом с `danger` — «Ошибка», витрина начнёт диктовать
 * формулировки, которых система не назначала. Настоящие статусы — в `Usage`.
 */
const COPY: Record<BadgeTone, string> = {
  neutral: label,
  accent: label,
  success: label,
  warning: label,
  danger: label,
};

const meta: Meta<BadgeProps<BadgeTone>> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: статус системы — состояние объекта, а не выбор человека.',
          'Анатомия: icon? / label. Слот `label` обязателен, `icon` — необязателен, но обязателен у warning и danger.',
          'Иконка задаётся булевым `icon`: какая именно — решает роль, а не место применения. Явно указать другую можно, но только из числа допустимых этой роли — `<Badge tone="success" icon="x">` не компилируется. Иконка повторяет смысл цвета, а не украшает: зелёный крестик сообщает провал и успех разом, и читатель верит форме.',
          'Правила: цвет означает смысл, а не оформление; статус, отличимый только по цвету, не читается при дальтонизме и в печати. Подпись — одно-два слова, без точки.',
          'Не использовать для: пользовательских меток — там `Tag`, где цвет означает выбор человека.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    icon: {
      control: 'boolean',
      description: 'Показать иконку роли. Какая именно — выводится из `tone`.',
    },
    inText: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<BadgeProps<BadgeTone>>;

// Порядок экспортов = порядок в сайдбаре. Не переставлять.

// 1. Песочница
export const Playground: Story = {
  args: { children: label, tone: 'success', icon: true },
};

// 2. Варианты
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="xl" align="start">
      <Stack direction="row" gap="lg" wrap align="start">
        {TONES.map((tone) => (
          <Labeled key={tone} label={tone}>
            <Badge tone={tone} icon>
              {COPY[tone]}
            </Badge>
          </Labeled>
        ))}
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">Что разрешено каждой роли</Text>
        <Text variant="bodySm" color="textMuted">
          Первая иконка в строке — та, что подставляет `icon`. Остальные можно указать явно. Всё, чего в строке нет, не
          компилируется: набор ограничен типом, а не договорённостью.
        </Text>
        <Stack gap="xs" align="start">
          {TONES.map((tone) => (
            <Stack key={tone} direction="row" gap="sm" align="center" wrap>
              <Text variant="label">{tone}</Text>
              {badgeToneIcons[tone].map((name) => (
                <Badge key={name} tone={tone} icon={name}>
                  {name}
                </Badge>
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  ),
};

// 8. Наполнение
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="только подпись">
        <Badge tone="neutral">{label}</Badge>
      </Labeled>
      <Labeled label="иконка + подпись">
        <Badge tone="danger" icon>
          {label}
        </Badge>
      </Labeled>
      <Labeled label="иконка роли заменена на допустимую">
        <Badge tone="warning" icon="clock">
          {label}
        </Badge>
      </Labeled>
      <Labeled label="в строке текста">
        <Text variant="body">
          Текст строки{' '}
          <Badge tone="success" icon inText>
            {label}
          </Badge>{' '}
          и продолжение после бейджа
        </Text>
      </Labeled>
      <Labeled label="в строке текста без inText — так не надо">
        <Text variant="body">
          Текст строки{' '}
          <Badge tone="success" icon>
            {label}
          </Badge>{' '}
          и продолжение после бейджа
        </Text>
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Две строки выше стоит сравнить вплотную. Без `inText` бейджу достаётся один межсловный пробел — он слипается с
        соседними словами, — и выравнивание по базовой линии поднимает его над строкой. В раскладке `inText` не нужен:
        там расстояние задаёт `Stack gap`.
      </Text>
      <Labeled label="группа из трёх">
        <Stack direction="row" gap="xs" wrap>
          <Badge tone="success" icon>
            {label}
          </Badge>
          <Badge tone="warning" icon>
            {label}
          </Badge>
          <Badge tone="neutral">{label}</Badge>
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
        <Badge tone="warning" icon>
          {longLabel}
        </Badge>
      </Labeled>

      <Labeled label="строка без пробелов">
        <Badge tone="neutral">{unbreakable}</Badge>
      </Labeled>

      <Labeled label="узкая колонка — подпись обрезается многоточием">
        <Box padding="sm" border>
          <div className={styles.narrowColumn}>
            <Badge tone="success" icon>
              {longLabel}
            </Badge>
          </div>
        </Box>
      </Labeled>

      <Labeled label="колонка уже иконки с подписью — обрезка доходит до первых букв">
        <Box padding="sm" border>
          <div className={styles.tinyColumn}>
            <Badge tone="danger" icon>
              {label}
            </Badge>
          </div>
        </Box>
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        Иконка не сжимается и не обрезается вместе с подписью — она несёт тот же смысл, что цвет, и пропадать первой ей
        нельзя. Если места не хватает даже на пару букв, статус нужно убрать из колонки целиком, а не показывать огрызок.
      </Text>

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
        <Badge tone="success" icon>
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
        gap: 'space.xs',
        radius: 'radius.md',
        типографика: 'text.label (12 / 1.35 / 600)',
        фон: 'color.{tone}Subtle',
        текст: 'color.{tone}Text',
        'inText: margin-inline': 'space.2xs',
        'inText: vertical-align': '−0.15em',
      }}
    >
      <Badge tone="success" icon>
        {label}
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
            { name: 'КМД-1750Т7-Д', tone: 'success' as const, status: 'Согласовано', icon: true },
            { name: 'КСД-2200Т-Д', tone: 'accent' as const, status: 'В работе', icon: false },
            { name: 'ККД-1500/180', tone: 'warning' as const, status: 'Проверить', icon: true },
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
        <Badge tone="danger" icon>
          Ошибка расчёта
        </Badge>
        <Tag color="clay">Ошибка расчёта</Tag>
      </DoDont>

      <DoDont reason="Без иконки статус отличается только цветом — он пропадает при дальтонизме, в печати и на плохом мониторе.">
        <Badge tone="warning" icon>
          Проверить
        </Badge>
        <Badge tone="warning">Проверить</Badge>
      </DoDont>

      <DoDont reason="Внутри строки текста бейджу мало межсловного пробела, а базовая линия поднимает его над строкой. `inText` даёт воздух и опускает бейдж к оптическому центру строки.">
        <Text variant="body">
          Расчёт{' '}
          <Badge tone="success" icon inText>
            Согласовано
          </Badge>{' '}
          от 12.08.2026
        </Text>
        <Text variant="body">
          Расчёт{' '}
          <Badge tone="success" icon>
            Согласовано
          </Badge>{' '}
          от 12.08.2026
        </Text>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Пары «зелёный крестик» в системе не существует: `icon` берёт иконку у роли, а явный список допустимых иконок
        закрыт типом. Это не строгость ради строгости — из двух сигналов, цвета и формы, читатель верит форме, и
        рассогласованная пара сообщает статус наоборот.
      </Text>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: пользовательских меток — там `Tag`. Плашку выбранного объекта закрывает `Chip`.
      </Text>
    </Stack>
  ),
};
