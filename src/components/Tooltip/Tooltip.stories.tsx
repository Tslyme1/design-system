import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '@/components';
import { Stack, Text, Box, Field, Icon } from '@/primitives';
import { Input } from '@/components';
import { Labeled, Spec, DoDont } from '@spec';
import { longText, unbreakable } from '@fixtures';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: расшифровка обозначения по наведению и по фокусу.',
          'Анатомия: trigger / bubble. Триггер обязан быть фокусируемым — подсказка только по наведению недоступна с клавиатуры и с сенсорного экрана.',
          'Правила: появляется с задержкой, чтобы не мельтешить при проходе курсором; уходит по Esc. В закрытом состоянии скрыта `visibility`, иначе скринридер читает её постоянно. Связь с триггером — через `aria-describedby`.',
          'Не использовать для: текста, без которого нельзя работать, и для интерактивных элементов внутри — до них нельзя дотянуться мышью, не потеряв подсказку.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom'] },
    delay: { control: { type: 'number', min: 0, max: 1000, step: 100 } },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    content: 'Индекс работы по Бонду, кВт·ч/т',
    children: (
      <Button variant="secondary" size="sm">
        Wi
      </Button>
    ),
  },
};

export const Playground: Story = {
  args: {
    content: 'Индекс работы по Бонду, кВт·ч/т',
    placement: 'top',
    delay: 300,
    children: (
      <Button variant="secondary" size="sm" iconStart="help">
        Wi
      </Button>
    ),
  },
};

export const Variants: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Stack direction="row" gap="2xl" align="center" justify="center">
      <Labeled label="top">
        <Tooltip content="Открывается вверх" placement="top">
          <Button variant="secondary" size="sm">
            Наведи
          </Button>
        </Tooltip>
      </Labeled>
      <Labeled label="bottom">
        <Tooltip content="Открывается вниз" placement="bottom">
          <Button variant="secondary" size="sm">
            Наведи
          </Button>
        </Tooltip>
      </Labeled>
    </Stack>
  ),
};

export const States: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Stack gap="lg" align="start">
      <Tooltip content="Появляется через 300 мс после наведения" delay={300}>
        <Button variant="secondary" size="sm">
          С задержкой
        </Button>
      </Tooltip>
      <Tooltip content="Появляется сразу" delay={0}>
        <Button variant="secondary" size="sm">
          Без задержки
        </Button>
      </Tooltip>
      <Text variant="caption" color="textMuted">
        Проверь три пути: наведение мышью, фокус табом и Esc при открытой подсказке. В закрытом состоянии пузырь не
        должен читаться скринридером — он скрыт `visibility`, а не только прозрачностью.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="на кнопке с текстом">
        <Tooltip content="Индекс работы по Бонду, кВт·ч/т">
          <Button variant="secondary" size="sm">
            Wi
          </Button>
        </Tooltip>
      </Labeled>
      <Labeled label="на квадратной кнопке">
        <Tooltip content="Пояснение к параметру">
          <Button variant="ghost" size="sm" icon="info" aria-label="Пояснение" />
        </Tooltip>
      </Labeled>
      <Labeled label="в подписи поля">
        <Field label="Индекс работы">
          {(props) => (
            <Stack direction="row" gap="xs" align="center">
              <Input {...props} />
              <Tooltip content="Определяется лабораторно по методике Бонда">
                <Button variant="ghost" size="sm" icon="help" aria-label="Что это" />
              </Tooltip>
            </Stack>
          )}
        </Field>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Stack gap="xl" align="center">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: пузырь ограничен по ширине и переносит текст. Если подсказка не помещается в три строки —
        это не подсказка, а пояснение, и его место в `hint` у поля.
      </Text>
      <Tooltip content={longText}>
        <Button variant="secondary" size="sm">
          Длинный текст
        </Button>
      </Tooltip>
      <Tooltip content={unbreakable}>
        <Button variant="secondary" size="sm">
          Строка без пробелов
        </Button>
      </Tooltip>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="пустая подсказка">
        <Tooltip content="">
          <Button variant="secondary" size="sm">
            Нечего показать
          </Button>
        </Tooltip>
      </Labeled>
      <Labeled label="нефокусируемый триггер — так делать нельзя">
        <Tooltip content="До этой подсказки нельзя добраться с клавиатуры">
          <span>
            <Icon name="info" />
          </span>
        </Tooltip>
      </Labeled>
      <Labeled label="триггер у края экрана">
        <Box fullWidth>
          <Stack direction="row" justify="end">
            <Tooltip content="Пузырь центрируется по триггеру: сторона выбирается по месту, но сдвига вдоль оси нет">
              <Button variant="secondary" size="sm">
                У правого края
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Сторона выбирается по свободному месту: у верхней кромки экрана подсказка раскрывается вниз. Чего пока нет —
        сдвига вдоль горизонтали, поэтому у самого края окна пузырь может частично выйти за него.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Spec
      slots={['trigger', 'bubble']}
      annotate={{
        padding: 'space.xs space.sm',
        radius: 'radius.md',
        'отступ от триггера': 'space.2xs',
        'максимальная ширина': 'modal.sm — своей шкалы ширин у системы нет',
        сторона: 'placement — предпочтение, переворот по месту во вьюпорте',
        слой: 'z.overlay',
        тень: 'shadow.md',
        типографика: 'text.bodySm',
        задержка: 'delay 300ms, переход duration.fast',
      }}
    >
      <Tooltip content="Индекс работы по Бонду">
        <Button variant="secondary" size="sm">
          Wi
        </Button>
      </Tooltip>
    </Spec>
  ),
};

export const Usage: Story = {
  args: { content: '', children: <span /> },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">В таблице с сокращениями</Text>
        <Stack direction="row" gap="lg" align="center">
          {[
            { short: 'Wi', full: 'Индекс работы по Бонду, кВт·ч/т' },
            { short: 'F80', full: 'Крупность питания, при которой проходит 80% материала' },
            { short: 'P80', full: 'Крупность продукта, при которой проходит 80% материала' },
          ].map((item) => (
            <Tooltip key={item.short} content={item.full}>
              <Button variant="ghost" size="sm">
                {item.short}
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </Stack>

      <DoDont reason="Подсказка недоступна с сенсорного экрана и исчезает при попытке её прочитать. Всё, без чего нельзя заполнить поле, обязано быть видно постоянно.">
        <Field label="Индекс работы" hint="Определяется лабораторно">
          {(props) => <Input {...props} />}
        </Field>
        <Stack direction="row" gap="xs" align="center">
          <Tooltip content="Обязательное поле, определяется лабораторно">
            <Button variant="ghost" size="sm" icon="help" aria-label="Что это" />
          </Tooltip>
          <Text variant="bodySm" color="textMuted">
            пояснение спрятано в подсказку
          </Text>
        </Stack>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: интерактивного содержимого — до кнопки внутри подсказки нельзя дотянуться мышью, не
        потеряв её. Для этого есть `Popover`.
      </Text>
    </Stack>
  ),
};
