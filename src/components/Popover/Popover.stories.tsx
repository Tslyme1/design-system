import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Popover } from './Popover';
import type { PopoverPlacement } from './Popover';
import { Button, Checkbox, Radio, RadioGroup } from '@/components';
import { Stack, Text } from '@/primitives';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: слой поверх содержимого, привязанный к триггеру. Закрывается по Esc и клику снаружи, возвращает фокус на триггер.',
          'Не использовать для: решений, где ответ обязателен — поповер не блокирует интерфейс и закрывается случайным кликом; для этого есть `Modal`. Не использовать для подсказок по наведению — нужен `Tooltip` (не построен).',
          'До этого компонента фильтры, выбор режима и действия над диаграммой были написаны отдельно: три невидимые подложки на весь экран и вручную подобранные z-index — 240, 250, 251, 255, 256. Теперь слой берётся из шкалы.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
    width: { control: 'inline-radio', options: ['auto', 'trigger', 'sm', 'md'] },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    open: false,
    onClose: () => undefined,
    trigger: null,
    children: null,
    placement: 'bottom-start',
    width: 'sm',
    title: 'Label',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <Popover
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        trigger={
          <Button variant="secondary" iconEnd="chevronDown" onClick={() => setOpen((v) => !v)}>
            Label
          </Button>
        }
      >
        <Stack gap="sm">
          <Checkbox label="Label 1" defaultChecked />
          <Checkbox label="Label 2" />
          <Checkbox label="Label 3" />
        </Stack>
      </Popover>
    );
  },
};

/**
 * Размещение и ширина. `placement` — предпочтение, а не приказ: если снизу
 * не помещается, панель раскрывается вверх сама. Проверить можно так —
 * прокрути страницу, чтобы триггер оказался у нижней кромки окна.
 */
export const Variants: Story = {
  args: { open: false, onClose: () => undefined, trigger: null, children: null },
  render: () => {
    const [openAt, setOpenAt] = useState<PopoverPlacement | null>(null);
    const placements: PopoverPlacement[] = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];

    return (
      <Stack direction="row" gap="xl" wrap align="center" justify="center">
        {placements.map((placement) => (
          <Popover
            key={placement}
            open={openAt === placement}
            onClose={() => setOpenAt(null)}
            placement={placement}
            width="sm"
            trigger={
              <Button variant="secondary" onClick={() => setOpenAt((v) => (v === placement ? null : placement))}>
                {placement}
              </Button>
            }
          >
            <Text variant="bodySm">Панель прижата к триггеру: {placement}</Text>
          </Popover>
        ))}
      </Stack>
    );
  },
};

/**
 * Состояния — это поведение: Esc, клик снаружи, возврат фокуса.
 * Проверь табом: после закрытия фокус обязан вернуться на триггер.
 */
export const States: Story = {
  args: { open: false, onClose: () => undefined, trigger: null, children: null },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Stack gap="lg" align="start">
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          width="md"
          title="Label"
          trigger={
            <Button variant="secondary" iconEnd="chevronDown" onClick={() => setOpen((v) => !v)}>
              {open ? 'Открыт' : 'Закрыт'}
            </Button>
          }
          footer={
            <Button variant="primary" size="sm" fullWidth onClick={() => setOpen(false)}>
              Label
            </Button>
          }
        >
          <RadioGroup name="popover-mode" legend="Label">
            <Radio label="Label 1" value="a" defaultChecked />
            <Radio label="Label 2" value="b" />
          </RadioGroup>
        </Popover>

        <Text variant="caption" color="textMuted">
          Нажми Esc или кликни мимо — панель закроется, фокус вернётся на кнопку.
        </Text>
      </Stack>
    );
  },
};

/**
 * Крайние случаи размещения. Здесь проверяется одно: панель обязана остаться
 * в видимой области, чем бы ни был указан `placement`.
 *
 * Правило разрешения — три шага, в этом порядке:
 * 1. сторона (`top` / `bottom`): предпочтённая, если панель помещается;
 *    противоположная, если помещается там; иначе — та, где места больше;
 * 2. выравнивание (`start` / `end`): прижаться к триггеру другим краем
 *    лучше, чем оторваться от него;
 * 3. сдвиг по горизонтали: остаток, который не берётся выравниванием.
 *
 * Порядок не случаен: сдвиг рвёт связь панели с триггером, поэтому он
 * последний — им добирается только то, что не закрыли первые два шага.
 */
export const EdgeCases: Story = {
  args: { open: false, onClose: () => undefined, trigger: null, children: null },
  render: () => {
    const [which, setWhich] = useState<'flip' | 'align' | 'tall' | null>(null);
    const close = () => setWhich(null);
    const toggle = (id: 'flip' | 'align' | 'tall') => () => setWhich(which === id ? null : id);

    return (
      // Без align="start" у внешней колонки: группам нужна вся ширина,
      // иначе триггер «у правого края» окажется у края своего содержимого.
      <Stack gap="xl">
        <Stack gap="xs" align="start">
          <Text variant="label">Сверху не помещается</Text>
          <Popover
            open={which === 'flip'}
            onClose={close}
            placement="top-start"
            width="md"
            title="placement=&quot;top-start&quot;"
            trigger={
              <Button variant="secondary" iconEnd="chevronDown" onClick={toggle('flip')}>
                Открыть вверх
              </Button>
            }
          >
            <Text variant="bodySm" color="textMuted">
              Запрошено раскрытие вверх, но над триггером места нет — панель ушла вниз.
            </Text>
          </Popover>
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Справа не помещается</Text>
          <Stack direction="row" justify="end">
            <Popover
              open={which === 'align'}
              onClose={close}
              placement="bottom-start"
              width="md"
              trigger={
                <Button variant="secondary" iconEnd="chevronDown" onClick={toggle('align')}>
                  У правого края
                </Button>
              }
            >
              <Text variant="bodySm" color="textMuted">
                Запрошено выравнивание по левому краю триггера, но панель шире остатка справа — она прижалась
                правым краем. Если и этого мало, панель дополнительно сдвигается внутрь окна.
              </Text>
            </Popover>
          </Stack>
        </Stack>

        <Stack gap="xs" align="start">
          <Text variant="label">Не помещается нигде</Text>
          <Popover
            open={which === 'tall'}
            onClose={close}
            width="sm"
            title="Двадцать пунктов"
            trigger={
              <Button variant="secondary" iconEnd="chevronDown" onClick={toggle('tall')}>
                Длинный список
              </Button>
            }
          >
            <Stack gap="2xs">
              {Array.from({ length: 20 }, (_, i) => (
                <Text key={i} variant="bodySm">{`Пункт ${i + 1}`}</Text>
              ))}
            </Stack>
          </Popover>
          <Text variant="bodySm" color="textMuted">
            Панель выбирает сторону с бо́льшим запасом и подрезается по нему: содержимое прокручивается внутри,
            заголовок и футер остаются на виду. Прежде она сохраняла предпочтённую сторону и уезжала за кромку.
          </Text>
        </Stack>

        <Text variant="bodySm" color="textMuted">
          Панель рисуется в портале и считается от вьюпорта: контейнер с прокруткой её не режет — в том числе этот,
          холст документации. Размещение пересчитывается на прокрутке любого предка, на изменении размеров окна и на
          изменении размеров самой панели.
        </Text>
      </Stack>
    );
  },
};

/**
 * Примеры использования: три случая из приложения закрываются одной
 * конструкцией. Иконки конкретные — блок прикладной.
 *
 * `chevronDown` у триггера заглушкой не заменяется ни здесь, ни в блоках
 * выше: это не иллюстрация, а признак раскрытия. Без него кнопка не
 * обещает панель.
 */
export const Usage: Story = {
  args: { open: false, onClose: () => undefined, trigger: null, children: null },
  render: () => {
    const [which, setWhich] = useState<'filters' | 'mode' | 'actions' | null>(null);
    const close = () => setWhich(null);

    return (
      <Stack direction="row" gap="sm" wrap align="center">
        <Popover
          open={which === 'filters'}
          onClose={close}
          width="sm"
          title="Фильтры"
          trigger={
            <Button variant="secondary" iconStart="filter" onClick={() => setWhich(which === 'filters' ? null : 'filters')}>
              Фильтры
            </Button>
          }
        >
          <Stack gap="sm">
            <Checkbox label="Рабочие" defaultChecked />
            <Checkbox label="Черновики" />
          </Stack>
        </Popover>

        <Popover
          open={which === 'mode'}
          onClose={close}
          width="trigger"
          trigger={
            <Button variant="secondary" iconEnd="chevronDown" onClick={() => setWhich(which === 'mode' ? null : 'mode')}>
              Инженерный режим
            </Button>
          }
        >
          <RadioGroup name="context-mode" legend="Режим">
            <Radio label="Инженерный" value="pro" defaultChecked />
            <Radio label="Упрощённый" value="lite" />
          </RadioGroup>
        </Popover>

        <Popover
          open={which === 'actions'}
          onClose={close}
          placement="bottom-end"
          trigger={
            <Button
              variant="ghost"
              icon="moreHorizontal"
              aria-label="Действия над диаграммой"
              onClick={() => setWhich(which === 'actions' ? null : 'actions')}
            />
          }
        >
          <Stack gap="2xs" align="start">
            <Button variant="ghost" size="sm" iconStart="download" onClick={close}>
              Скачать
            </Button>
            <Button variant="ghost" size="sm" iconStart="print" onClick={close}>
              Печать
            </Button>
            <Button variant="ghost" size="sm" iconStart="copy" onClick={close}>
              Дублировать
            </Button>
          </Stack>
        </Popover>
      </Stack>
    );
  },
};
