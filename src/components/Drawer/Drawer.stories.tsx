import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '@/components';
import { Stack, Text, Box } from '@/primitives';
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

/** Сцена = рабочая область экрана. Внутри неё панель и живёт. */
function Scene({ size }: { size: 'narrow' | 'wide' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={scene.host}>
      <div className={scene.body}>
        <Stack gap="md" align="start">
          <Text variant="headingSm">{crusher.short}</Text>
          <Text variant="bodySm" color="textMuted">
            Рабочая область остаётся видимой и доступной, пока панель открыта.
          </Text>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Смотреть результат
          </Button>
        </Stack>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Результат расчёта"
        size={size}
        footer={
          <Stack direction="row" gap="sm" justify="end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
            <Button variant="primary" iconStart="download">
              Скачать
            </Button>
          </Stack>
        }
      >
        <Stack gap="md">
          <Text variant="body">{longText}</Text>
          <Box padding="md" background="surfaceSunken">
            <Stack gap="xs">
              <Text variant="label">Производительность</Text>
              <Text variant="body">1 250 т/ч</Text>
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
