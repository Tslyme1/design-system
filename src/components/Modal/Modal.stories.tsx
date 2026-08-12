import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button, Input } from '@/components';
import { Stack, Text, Field } from '@/primitives';
import { longText } from '@fixtures';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: решение, которое нельзя отложить. Блокирует интерфейс, удерживает фокус внутри и возвращает его на место при закрытии.',
          'Не использовать для: выпадающих меню и поповеров — для них есть `Popover`. Не зашивать внутрь частные решения: анатомия зашита, всё содержимое приходит снаружи.',
          'Единственное место системы, где тень и рамка стоят вместе: без рамки край модалки теряется на тёмной теме.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'lg'] },
    dismissible: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    open: false,
    title: 'Новый проект',
    size: 'sm',
    dismissible: true,
    children: <Text variant="body">{longText}</Text>,
    onClose: () => undefined,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Открыть
        </Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <Stack gap="lg">
            <Field label="Название проекта">{(props) => <Input {...props} fullWidth />}</Field>
            <Field label="Заказчик" variant="floating">
              {(props) => <Input {...props} fullWidth />}
            </Field>
          </Stack>
        </Modal>
      </>
    );
  },
};

/** Две ширины: 560 для решения и короткой формы, 1280 для рабочей области. */
export const Sizes: Story = {
  args: { open: false, title: '', children: null, onClose: () => undefined },
  render: () => {
    const [size, setSize] = useState<'sm' | 'lg' | null>(null);
    return (
      <>
        <Stack direction="row" gap="sm">
          <Button variant="secondary" onClick={() => setSize('sm')}>
            Узкая — 560
          </Button>
          <Button variant="secondary" onClick={() => setSize('lg')}>
            Широкая — 1280
          </Button>
        </Stack>
        <Modal
          open={size !== null}
          onClose={() => setSize(null)}
          title={size === 'lg' ? 'Широкая модалка' : 'Узкая модалка'}
          size={size ?? 'sm'}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setSize(null)}>Отмена</Button>}>
              <Button variant="primary" onClick={() => setSize(null)}>
                Сохранить
              </Button>
            </Modal.Footer>
          }
        >
          <Text variant="body">{longText}</Text>
        </Modal>
      </>
    );
  },
};

/**
 * Состояния модалки — это поведение, а не оформление: удержание фокуса,
 * возврат фокуса на триггер, блокировка прокрутки страницы, Esc и клик по фону.
 * `dismissible={false}` оставляет единственный выход — явное решение в футере.
 */
export const States: Story = {
  args: { open: false, title: '', children: null, onClose: () => undefined },
  render: () => {
    const [mode, setMode] = useState<'dismissible' | 'locked' | null>(null);
    return (
      <>
        <Stack direction="row" gap="sm">
          <Button variant="secondary" onClick={() => setMode('dismissible')}>
            Закрывается по Esc и фону
          </Button>
          <Button variant="danger" onClick={() => setMode('locked')}>
            Требует ответа
          </Button>
        </Stack>

        <Modal
          open={mode !== null}
          onClose={() => setMode(null)}
          title={mode === 'locked' ? 'Удалить расчёт?' : 'Обычная модалка'}
          dismissible={mode !== 'locked'}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setMode(null)}>Отмена</Button>}>
              <Button variant={mode === 'locked' ? 'danger' : 'primary'} onClick={() => setMode(null)}>
                {mode === 'locked' ? 'Удалить' : 'Готово'}
              </Button>
            </Modal.Footer>
          }
        >
          <Text variant="body">
            {mode === 'locked'
              ? 'Расчёт и все его этапы будут удалены без возможности восстановления.'
              : 'Нажми Esc или кликни по затемнению — окно закроется, фокус вернётся на кнопку.'}
          </Text>
        </Modal>
      </>
    );
  },
};

/** Футер: главное действие справа, отступное — слева, через проп `aside`. */
export const Content: Story = {
  args: { open: false, title: '', children: null, onClose: () => undefined },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Длинное содержимое
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Методика расчёта и ограничения применимости результата"
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setOpen(false)}>Отмена</Button>}>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Принять
              </Button>
            </Modal.Footer>
          }
        >
          <Stack gap="md">
            {[longText, longText, longText].map((text, i) => (
              <Text key={i} variant="body">
                {text}
              </Text>
            ))}
          </Stack>
        </Modal>
      </>
    );
  },
};
