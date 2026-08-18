import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { Button } from '@/components';
import { Stack, Text, Box } from '@/primitives';
import { Labeled, Matrix, Spec, DoDont } from '@spec';
import { longText, unbreakable, label, labels } from '@fixtures';

const TONES = ['accent', 'muted'] as const;
const STATES = ['default', 'hover', 'focus-visible'] as const;

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: переход по адресу.',
          'Анатомия: label / icon? — иконка появляется только у внешней ссылки и означает уход из приложения.',
          'Правила: подчёркивание есть всегда, а не по наведению: ссылка, отличающаяся от текста только цветом, не читается при дальтонизме. Текст ссылки называет цель («Методика ВНИИ»), а не действие («нажмите здесь»).',
          'Не использовать для: действий — если по нажатию что-то выполняется, а не открывается адрес, нужен `Button`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    external: { control: 'boolean' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: label, href: '#anchor', tone: 'accent' },
};

export const Variants: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="accent">
        <Link href="#anchor">{label}</Link>
      </Labeled>
      <Labeled label="muted">
        <Link href="#anchor" tone="muted">
          {label}
        </Link>
      </Labeled>
      <Labeled label="external">
        <Link href="https://example.com" external>
          {label}
        </Link>
      </Labeled>
      <Labeled label="external + muted">
        <Link href="https://example.com" external tone="muted">
          {label}
        </Link>
      </Labeled>
    </Stack>
  ),
};

export const States: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Stack gap="md" align="start">
      <Link href="#anchor">Наведи мышью</Link>
      <Link href="#anchor">Пройди табом</Link>
      <Text variant="caption" color="textMuted">
        hover — цвет темнеет до accent; focus-visible — кольцо фокуса, подчёркивание снимается, чтобы не спорить с
        кольцом; active — accentActive.
      </Text>
    </Stack>
  ),
};

/** Матрица: тон × состояние. Смотреть вживую — псевдосостояния не подделываются. */
export const VariantStates: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Matrix rows={TONES} columns={STATES}>
      {(tone) => (
        <Link href="#anchor" tone={tone}>
          {label}
        </Link>
      )}
    </Matrix>
  ),
};

export const Content: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="одно слово">
        <Link href="#anchor">{label}</Link>
      </Labeled>
      <Labeled label="внутри абзаца">
        <Text variant="body">
          Текст абзаца, внутри которого стоит <Link href="#anchor">{label}</Link> и продолжается дальше.
        </Text>
      </Labeled>
      <Labeled label="список ссылок">
        <Stack gap="xs">
          {labels.slice(0, 2).map((item) => (
            <Link key={item} href="#anchor">
              {item}
            </Link>
          ))}
          <Link href="https://example.com" external>
            {labels[2]}
          </Link>
        </Stack>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: ссылка переносится вместе с текстом по словам, иконка внешней ссылки остаётся у последнего
        слова и не отрывается на пустую строку.
      </Text>
      <Box padding="md" border>
        <Text variant="body">
          <Link href="https://example.com" external>
            {longText}
          </Link>
        </Text>
      </Box>
      <Box padding="md" border>
        <Text variant="body">
          <Link href="#anchor">{unbreakable}</Link>
        </Text>
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="ссылка без адреса — так быть не должно">
        <Link>Нет href</Link>
      </Labeled>
      <Labeled label="одна буква">
        <Link href="#anchor">?</Link>
      </Labeled>
      <Labeled label="ссылка на текущую страницу">
        <Link href="#top">Наверх</Link>
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Ссылка без `href` не попадает в таб-порядок и не открывается — браузер считает её обычным текстом. Если
        адреса нет, это `Button`.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Spec
      slots={['label', 'icon? (только external)']}
      annotate={{
        gap: 'space.2xs',
        'подчёркивание': 'offset space.2xs',
        цвет: 'color.accentText / color.textMuted',
        hover: 'color.accent',
        фокус: 'focusRing, offset 2px',
      }}
    >
      <Link href="https://example.com" external>
        {label}
      </Link>
    </Spec>
  ),
};

export const Usage: Story = {
  args: { children: '', href: '#anchor' },
  render: () => (
    <Stack gap="2xl" align="start">
      <DoDont reason="Ссылку копируют, открывают в новой вкладке и добавляют в закладки. С кнопкой так нельзя — а действие, наоборот, нельзя открыть в новой вкладке.">
        <Stack gap="xs">
          <Link href="https://example.com" external>
            Паспорт оборудования
          </Link>
          <Text variant="caption" color="textMuted">
            открывает адрес
          </Text>
        </Stack>
        <Stack gap="xs">
          <Link href="#anchor">Пересчитать</Link>
          <Text variant="caption" color="textMuted">
            выполняет действие — здесь нужен Button
          </Text>
        </Stack>
      </DoDont>

      <Stack gap="sm" align="start">
        <Text variant="label">Правильная пара</Text>
        <Stack direction="row" gap="md" align="center">
          <Button variant="primary" size="sm">
            Пересчитать
          </Button>
          <Link href="https://example.com" external>
            Паспорт оборудования
          </Link>
        </Stack>
      </Stack>

      <DoDont reason="«Нажмите здесь» не говорит, куда ведёт ссылка. Скринридер читает список ссылок отдельно от текста, и там остаётся десять одинаковых «здесь».">
        <Link href="#anchor">Методика ВНИИ</Link>
        <Link href="#anchor">Нажмите здесь</Link>
      </DoDont>
    </Stack>
  ),
};
