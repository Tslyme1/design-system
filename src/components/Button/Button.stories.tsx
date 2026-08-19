import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';
import { Stack, Text } from '@/primitives';
import { Labeled, Matrix, DoDont } from '@spec';
import { crusher } from '@fixtures';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;

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
    iconStart: { control: 'select', options: [undefined, 'placeholder', 'plus', 'trash', 'download', 'search'] },
    iconEnd: { control: 'select', options: [undefined, 'placeholder', 'chevronDown', 'arrowRight'] },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: 'Label', variant: 'primary', size: 'md' },
};

/**
 * Четыре варианта. Залитый ровно один — по нему видно главное действие.
 *
 * Подпись у всех одна и та же: вариант различается видом, а не текстом.
 * Прикладные формулировки — в блоке `Usage`; здесь они читались бы как
 * распределение ролей («danger — это всегда удаление»), которого нет.
 *
 * Иконок здесь тоже нет: общий вид кнопки — без иконки. Формы с иконкой
 * собраны в блоке `Content`.
 */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="lg" align="start" wrap>
      {VARIANTS.map((variant) => (
        <Labeled key={variant} label={variant}>
          <Button variant={variant}>Label</Button>
        </Labeled>
      ))}
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
    <Matrix rows={VARIANTS} columns={['default', 'disabled', 'loading']}>
      {(variant, state) => (
        <Button variant={variant} disabled={state === 'disabled'} loading={state === 'loading'}>
          Label
        </Button>
      )}
    </Matrix>
  ),
};

/**
 * Загрузка: видно только индикатор, подпись скрыта — но место под неё
 * сохранено, поэтому ширина не прыгает. Повторное нажатие заблокировано.
 * Кнопка, которая исчезает на время запроса, заставляет гадать,
 * ушёл ли запрос.
 */
export const DataStates: Story = {
  args: { children: '' },
  render: () => {
    const [loading, setLoading] = useState(false);

    return (
      <Stack direction="row" gap="lg" align="start" wrap>
        <Labeled label="нажми — уйдёт в загрузку на 1,6 с">
          <Button
            variant="primary"
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1600);
            }}
          >
            Label
          </Button>
        </Labeled>
        <Labeled label="loading">
          <Button variant="secondary" loading>
            Label
          </Button>
        </Labeled>
        <Labeled label="loading — только иконка">
          <Button variant="primary" icon="placeholder" aria-label="Label" loading />
        </Labeled>
      </Stack>
    );
  },
};

/** Три высоты контрола: 32 / 40 / 48. */
export const Sizes: Story = {
  args: { children: '' },
  render: () => (
    <Stack direction="row" gap="lg" align="start" wrap>
      {(
        [
          ['sm', '32'],
          ['md', '40'],
          ['lg', '48'],
        ] as const
      ).map(([size, px]) => (
        <Labeled key={size} label={`${size} — ${px}`}>
          <Button size={size}>Label</Button>
        </Labeled>
      ))}
    </Stack>
  ),
};

/**
 * Наполнение кнопки: подпись, подпись с иконкой, одна иконка.
 *
 * Общий вид кнопки — без иконки, поэтому в `Variants` её нет. Иконка —
 * это наполнение, и все формы с ней собраны здесь: у каждого варианта
 * своя строка, чтобы было видно, что форма от варианта не зависит.
 *
 * Кнопка из одной иконки — квадрат по высоте контрола, а не «кнопка
 * с обрезанным текстом». `aria-label` у неё обязателен на уровне типов.
 */
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="md" align="start">
        <Text variant="label">Формы наполнения по вариантам</Text>
        <Matrix rows={VARIANTS} columns={['подпись', 'иконка слева', 'иконка справа', 'только иконка']}>
          {(variant, form) => {
            if (form === 'только иконка') {
              return <Button variant={variant} icon="placeholder" aria-label="Label" />;
            }
            return (
              <Button
                variant={variant}
                iconStart={form === 'иконка слева' ? 'placeholder' : undefined}
                iconEnd={form === 'иконка справа' ? 'placeholder' : undefined}
              >
                Label
              </Button>
            );
          }}
        </Matrix>
      </Stack>

      <Stack gap="md" align="start">
        <Text variant="label">Только иконка — ширина равна высоте: 32 / 40 / 48</Text>
        <Stack direction="row" gap="lg" align="start">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Labeled key={size} label={size}>
              <Button size={size} icon="placeholder" aria-label="Label" />
            </Labeled>
          ))}
        </Stack>
      </Stack>

      <Stack gap="md" align="start">
        <Text variant="label">Длина подписи</Text>
        <Stack gap="md" align="start">
          <Labeled label="длинная подпись — кнопка не ломает ряд">
            <Button variant="secondary" iconStart="placeholder">
              {`Label ${crusher.long}`}
            </Button>
          </Labeled>
          <Labeled label="fullWidth">
            <Button variant="primary" fullWidth>
              Label
            </Button>
          </Labeled>
        </Stack>
      </Stack>

      {/* Столбцом и рядом — потому что порознь разница не видна: одна кнопка
          с центрированной подписью выглядит нормально, ломается именно
          перечень. */}
      <Stack gap="md" align="start">
        <Text variant="label">align у fullWidth: содержимое по центру и к началу строки</Text>
        <Stack direction="row" gap="2xl" align="start">
          <Labeled label="center — по умолчанию">
            <Stack gap="2xs" direction="column">
              <Button variant="ghost" size="sm" iconStart="placeholder" fullWidth>
                Label
              </Button>
              <Button variant="ghost" size="sm" iconStart="placeholder" fullWidth>
                {`Label ${crusher.long}`}
              </Button>
            </Stack>
          </Labeled>
          <Labeled label="start — строки меню">
            <Stack gap="2xs" direction="column">
              <Button variant="ghost" size="sm" iconStart="placeholder" align="start" fullWidth>
                Label
              </Button>
              <Button variant="ghost" size="sm" iconStart="placeholder" align="start" fullWidth>
                {`Label ${crusher.long}`}
              </Button>
            </Stack>
          </Labeled>
        </Stack>
      </Stack>

      <Text variant="bodySm" color="textMuted">
        В приложении подпись кнопки — глагол: она обещает действие. Существительное превращает кнопку в ярлык, и
        непонятно, что произойдёт по нажатию. Примеры настоящих подписей — в блоке `Usage`.
      </Text>
    </Stack>
  ),
};

/**
 * Примеры использования. Здесь — и только здесь — иконки конкретные:
 * блок показывает не возможности компонента, а прикладные сценарии,
 * и в них иконка обязана совпадать со смыслом действия.
 */
export const Usage: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">Панель списка проектов</Text>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button variant="primary" iconStart="plus">
            Новый расчёт
          </Button>
          <Button variant="secondary" iconStart="upload">
            Импорт
          </Button>
          <Button variant="ghost" icon="moreHorizontal" aria-label="Ещё" />
        </Stack>
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">Действия над расчётом</Text>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button variant="secondary" size="sm" iconStart="download">
            Скачать PDF
          </Button>
          <Button variant="secondary" size="sm" icon="print" aria-label="Печать" />
          <Button variant="secondary" size="sm" icon="copy" aria-label="Дублировать" />
          <Button variant="danger" size="sm" iconStart="trash">
            Удалить
          </Button>
        </Stack>
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">Футер модалки</Text>
        <Stack direction="row" gap="sm" align="center">
          <Button variant="primary">Сохранить</Button>
          <Button variant="secondary">Отмена</Button>
        </Stack>
      </Stack>

      <DoDont reason="Залитая кнопка означает «главное действие экрана». Если их две, выбор не сделан, и человек решает за автора интерфейса.">
        <Stack direction="row" gap="sm">
          <Button variant="primary">Рассчитать</Button>
          <Button variant="secondary">Сохранить черновик</Button>
        </Stack>
        <Stack direction="row" gap="sm">
          <Button variant="primary">Рассчитать</Button>
          <Button variant="primary">Сохранить черновик</Button>
        </Stack>
      </DoDont>

      <DoDont reason="Подпись кнопки — глагол: она обещает действие. Существительное превращает кнопку в ярлык, и непонятно, что произойдёт по нажатию.">
        <Button variant="secondary" iconStart="fileText">
          Открыть отчёт
        </Button>
        <Button variant="secondary" iconStart="fileText">
          Отчёт
        </Button>
      </DoDont>
    </Stack>
  ),
};
