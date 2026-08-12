import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';
import { Stack, Text } from '@/primitives';
import { crusher } from '@fixtures';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: действие. `primary` — единственная залитая кнопка системы, и на экране она одна: если их две, значит главное действие не выбрано.',
          'Не использовать для: навигации по ссылке — нужен `Link` (не построен, спросить). Не собирать квадратную кнопку вручную из `ghost` + `Icon`: в аудите это дало три разных написания одного и того же.',
          'Все состояния заведены внутри и переопределению на месте не подлежат.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    iconStart: { control: 'select', options: [undefined, 'plus', 'trash', 'download', 'search'] },
    iconEnd: { control: 'select', options: [undefined, 'chevronDown', 'arrowRight'] },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: 'Рассчитать', variant: 'primary', size: 'md' },
};

/** Четыре варианта. Залитый ровно один — по нему видно главное действие. */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Button variant="primary">Рассчитать</Button>
      <Button variant="secondary">Отмена</Button>
      <Button variant="ghost">Сбросить</Button>
      <Button variant="danger" iconStart="trash">
        Удалить
      </Button>
    </Stack>
  ),
};

/**
 * Наведение и фокус смотри вживую: hover — мышью, focus-visible — табом.
 * Скриншотом их подменять нельзя, иначе расхождение с кодом не заметно.
 */
export const States: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
        <Stack key={variant} direction="row" gap="sm" align="center" wrap>
          <Button variant={variant}>Обычная</Button>
          <Button variant={variant} disabled>
            Недоступна
          </Button>
          <Button variant={variant} loading>
            В работе
          </Button>
          <Text variant="caption" color="textMuted">
            {variant}
          </Text>
        </Stack>
      ))}
    </Stack>
  ),
};

/**
 * Загрузка: текст остаётся на месте, ширина не прыгает, повторное
 * нажатие заблокировано. Кнопка, которая исчезает на время запроса,
 * заставляет гадать, ушёл ли запрос.
 */
export const DataStates: Story = {
  args: { children: '' },
  render: () => {
    const [loading, setLoading] = useState(false);

    return (
      <Stack direction="row" gap="sm" align="center" wrap>
        <Button
          variant="primary"
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1600);
          }}
        >
          Сохранить
        </Button>
        <Button variant="secondary" loading>
          Постоянная загрузка
        </Button>
        <Button variant="primary" icon="download" aria-label="Скачать" loading />
      </Stack>
    );
  },
};

/** Три высоты контрола: 32 / 40 / 48. Иконка масштабируется вместе с ними. */
export const Sizes: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="sm" align="center" wrap>
      <Button size="sm" iconStart="plus">
        Малая — 32
      </Button>
      <Button size="md" iconStart="plus">
        Средняя — 40
      </Button>
      <Button size="lg" iconStart="plus">
        Большая — 48
      </Button>
    </Stack>
  ),
};

/**
 * Кнопка из одной иконки — квадрат по высоте контрола, а не «кнопка
 * с обрезанным текстом». `aria-label` обязателен на уровне типов.
 */
export const IconOnly: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg">
      <Stack direction="row" gap="sm" align="center">
        <Button size="sm" icon="pencil" aria-label="Изменить" />
        <Button size="md" icon="pencil" aria-label="Изменить" />
        <Button size="lg" icon="pencil" aria-label="Изменить" />
        <Text variant="caption" color="textMuted">
          Ширина равна высоте: 32 / 40 / 48
        </Text>
      </Stack>
      <Stack direction="row" gap="sm" align="center">
        <Button variant="primary" icon="plus" aria-label="Добавить" />
        <Button variant="secondary" icon="copy" aria-label="Дублировать" />
        <Button variant="ghost" icon="moreHorizontal" aria-label="Ещё" />
        <Button variant="danger" icon="trash" aria-label="Удалить" />
        <Button variant="secondary" icon="print" aria-label="Печать" disabled />
      </Stack>
    </Stack>
  ),
};

/**
 * Длинная подпись: текст обрезается, кнопка не ломает ряд.
 * Подпись кнопки — глагол; существительное превращает действие в ярлык.
 */
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="md" align="start">
      <Button variant="secondary" iconStart="fileText">
        {`Открыть расчёт ${crusher.long}`}
      </Button>
      <Button variant="primary" fullWidth>
        На всю ширину
      </Button>
    </Stack>
  ),
};
