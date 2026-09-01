import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button, Input } from '@/components';
import { Stack, Text, Field } from '@/primitives';
import { longText, label, longLabel } from '@fixtures';
import { Labeled } from '@spec';

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
    title: label,
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
            <Field label={label}>{(props) => <Input {...props} fullWidth />}</Field>
            <Field label={label} variant="floating">
              {(props) => <Input {...props} fullWidth />}
            </Field>
          </Stack>
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
          title={label}
          dismissible={mode !== 'locked'}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setMode(null)}>Label</Button>}>
              <Button variant={mode === 'locked' ? 'danger' : 'primary'} onClick={() => setMode(null)}>
                Label
              </Button>
            </Modal.Footer>
          }
        >
          <Text variant="body">
            {mode === 'locked'
              ? 'Выхода, кроме футера, нет: Esc и клик по затемнению не закрывают окно.'
              : 'Нажми Esc или кликни по затемнению — окно закроется, фокус вернётся на кнопку.'}
          </Text>
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
          title={label}
          size={size ?? 'sm'}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setSize(null)}>Label</Button>}>
              <Button variant="primary" onClick={() => setSize(null)}>
                Label
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
          title={longLabel}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setOpen(false)}>Label</Button>}>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Label
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

/**
 * Ответ на границу: содержимого больше, чем помещается в `max-height: 88vh`
 * окна. Прокручивается только содержимое — шапка с заголовком и футер
 * с действиями остаются на месте и никогда не уезжают за пределы экрана,
 * сколько бы ни было текста внутри.
 */
export const Overflow: Story = {
  args: { open: false, title: '', children: null, onClose: () => undefined },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Stack gap="md">
        <Text variant="bodySm" color="textMuted">
          Заголовок и футер видны всегда — не листаются вместе с содержимым.
        </Text>

        <Labeled label="содержимое выше окна">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Открыть
          </Button>
        </Labeled>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={longLabel}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={() => setOpen(false)}>Label</Button>}>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Label
              </Button>
            </Modal.Footer>
          }
        >
          <Stack gap="md">
            {Array.from({ length: 24 }, (_, i) => (
              <Text key={i} variant="body">
                {i + 1}. {longText}
              </Text>
            ))}
          </Stack>
        </Modal>
      </Stack>
    );
  },
};

/**
 * Примеры использования. Формулировки здесь настоящие: в подтверждении
 * именно текст несёт всю работу — заголовок называет последствие, а кнопка
 * повторяет действие глаголом, чтобы решение было понятно без чтения тела.
 */
export const Usage: Story = {
  args: { open: false, title: '', children: null, onClose: () => undefined },
  render: () => {
    const [open, setOpen] = useState<'confirm' | 'form' | null>(null);
    const close = () => setOpen(null);

    return (
      <>
        <Stack direction="row" gap="sm" wrap>
          <Button variant="danger" onClick={() => setOpen('confirm')}>
            Удалить расчёт
          </Button>
          <Button variant="primary" onClick={() => setOpen('form')}>
            Новый проект
          </Button>
        </Stack>

        <Modal
          open={open === 'confirm'}
          onClose={close}
          title="Удалить расчёт?"
          dismissible={false}
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={close}>Отмена</Button>}>
              <Button variant="danger" onClick={close}>
                Удалить
              </Button>
            </Modal.Footer>
          }
        >
          <Text variant="body">Расчёт и все его этапы будут удалены без возможности восстановления.</Text>
        </Modal>

        <Modal
          open={open === 'form'}
          onClose={close}
          title="Новый проект"
          footer={
            <Modal.Footer aside={<Button variant="ghost" onClick={close}>Отмена</Button>}>
              <Button variant="primary" onClick={close}>
                Создать
              </Button>
            </Modal.Footer>
          }
        >
          <Stack gap="lg">
            <Field label="Название проекта" required>
              {(props) => <Input {...props} fullWidth />}
            </Field>
            <Field label="Заказчик">{(props) => <Input {...props} fullWidth />}</Field>
          </Stack>
        </Modal>
      </>
    );
  },
};
