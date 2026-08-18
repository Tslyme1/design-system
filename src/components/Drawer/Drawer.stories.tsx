import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '@/components';
import { Stack, Text, Box } from '@/primitives';
import type { IconName } from '@/primitives';
import { crusher, longText } from '@fixtures';
import scene from './Drawer.scene.module.css';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: панель результата рядом с работой, а не вместо неё. Шапка и рабочая область намеренно остаются доступными.',
          'Не использовать для: содержимого, требующего блокировки всего интерфейса — для этого есть `Modal`.',
          '**Требование к родителю:** `position: relative` и `overflow: hidden`. Панель позиционируется абсолютно внутри рабочей области; без точки отсчёта она уедет к краю окна.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['narrow', 'wide'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

type SceneCopy = {
  heading: string;
  trigger: string;
  title: string;
  close: string;
  action: string;
  metricLabel: string;
  metricValue: string;
  icon: IconName;
};

/**
 * Тексты и иконка сцены — данные, а не часть компонента.
 *
 * В демонстрационных блоках они нейтральны: панель показывает форму, и
 * прикладная формулировка читалась бы как назначение («панель — это всегда
 * результат расчёта»). Настоящие тексты подставляет блок `Usage`.
 */
const demoCopy: SceneCopy = {
  heading: 'Label',
  trigger: 'Label',
  title: 'Label',
  close: 'Label',
  action: 'Label',
  metricLabel: 'Label',
  metricValue: 'Value',
  icon: 'placeholder',
};

const usageCopy: SceneCopy = {
  heading: crusher.short,
  trigger: 'Смотреть результат',
  title: 'Результат расчёта',
  close: 'Закрыть',
  action: 'Скачать',
  metricLabel: 'Производительность',
  metricValue: '1 250 т/ч',
  icon: 'download',
};

/** Сцена = рабочая область экрана. Внутри неё панель и живёт. */
function Scene({ size, copy = demoCopy }: { size: 'narrow' | 'wide'; copy?: SceneCopy }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={scene.host}>
      <div className={scene.body}>
        <Stack gap="md" align="start">
          <Text variant="headingSm">{copy.heading}</Text>
          <Text variant="bodySm" color="textMuted">
            Рабочая область остаётся видимой и доступной, пока панель открыта.
          </Text>
          <Button variant="primary" onClick={() => setOpen(true)}>
            {copy.trigger}
          </Button>
        </Stack>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={copy.title}
        size={size}
        footer={
          <Stack direction="row" gap="sm" justify="end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {copy.close}
            </Button>
            <Button variant="primary" iconStart={copy.icon}>
              {copy.action}
            </Button>
          </Stack>
        }
      >
        <Stack gap="md">
          <Text variant="body">{longText}</Text>
          <Box padding="md" background="surfaceSunken">
            <Stack gap="xs">
              <Text variant="label">{copy.metricLabel}</Text>
              <Text variant="body">{copy.metricValue}</Text>
            </Stack>
          </Box>
        </Stack>
      </Drawer>
    </div>
  );
}

export const Playground: Story = {
  args: { open: false, onClose: () => undefined, children: null, size: 'wide' },
  render: (args) => <Scene size={args.size ?? 'wide'} />,
};

/** Две ширины: `wide` — результат расчёта, `narrow` — список сущностей. */
export const Variants: Story = {
  args: { open: false, onClose: () => undefined, children: null },
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text variant="label">wide — min(920px, 64%)</Text>
        <Scene size="wide" />
      </Stack>
      <Stack gap="xs">
        <Text variant="label">narrow — min(420px, 80%)</Text>
        <Scene size="narrow" />
      </Stack>
    </Stack>
  ),
};

/**
 * Состояния — это поведение: Esc, клик по затемнению, возврат фокуса.
 * Открытая и закрытая панель различаются не оформлением, а тем,
 * что происходит с фокусом и прокруткой рабочей области.
 */
export const States: Story = {
  args: { open: false, onClose: () => undefined, children: null },
  render: () => (
    <Stack gap="md">
      <Text variant="bodySm" color="textMuted">
        Открой панель и нажми Esc или кликни по затемнению. Шапка приложения при этом остаётся доступной — это и
        отличает панель от модалки.
      </Text>
      <Scene size="wide" />
    </Stack>
  ),
};

/**
 * Примеры использования: панель результата расчёта — тот самый сценарий,
 * ради которого компонент и появился. Иконка в футере здесь конкретная:
 * действие «Скачать» обязано выглядеть как скачивание.
 */
export const Usage: Story = {
  args: { open: false, onClose: () => undefined, children: null },
  render: () => (
    <Stack gap="md">
      <Text variant="label">«Смотреть результат» на экране расчёта</Text>
      <Scene size="wide" copy={usageCopy} />
      <Text variant="bodySm" color="textMuted">
        Не использовать для: решений, без которых нельзя продолжить — панель не блокирует интерфейс и закрывается
        случайным кликом. Там `Modal`.
      </Text>
    </Stack>
  ),
};
