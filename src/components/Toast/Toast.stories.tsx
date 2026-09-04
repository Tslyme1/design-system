import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toast } from './Toast';
import type { ToastTone } from './Toast';
import { Button } from '@/components';
import { Stack, Text, Box, Surface } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { longLabel } from '@fixtures';

const TONES: readonly ToastTone[] = ['neutral', 'success', 'warning', 'danger'];

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: мимолётное подтверждение действия — что-то произошло, читать не обязательно сейчас же.',
          'Анатомия: icon (роли) + сообщение, плавающей плашкой внизу экрана по центру.',
          'Не управляет собственным временем жизни: когда убрать сообщение, решает вызывающий код (таймер рядом с состоянием), не сам тост.',
          'Не использовать для: действия, которое можно отменить или подтвердить, — там `Modal` с кнопками. Тост не интерактивен и ничего не спрашивает.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { message: 'Проект «Тестовый проект» создан', tone: 'success' },
};

/**
 * `Toast` сам закреплён внизу экрана (`position: fixed`). `contain: layout`
 * на обёртке — не декоративный проп, а единственный стандартный способ
 * сделать саму эту обёртку системой координат для `fixed`-потомка (по
 * спецификации CSS), не трогая сам компонент: иначе все варианты легли бы
 * друг на друга внизу окна витрины, а не рядом, каждый в своей карточке.
 */
export const Variants: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="lg" align="start">
      {TONES.map((tone) => (
        <Labeled key={tone} label={tone}>
          <Box padding="xl" background="surfaceSunken" radius="md">
            <div style={{ position: 'relative', contain: 'layout' }}>
              <Toast message="Сообщение" tone={tone} />
            </div>
          </Box>
        </Labeled>
      ))}
    </Stack>
  ),
};

export const States: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="скрыт — сообщения нет, ничего не рисуется">
        <Text variant="bodySm" color="textMuted">
          {'<Toast message={null} /> === null'}
        </Text>
      </Labeled>
      <Labeled label="показан">
        <Toast message="Сообщение" />
      </Labeled>
    </Stack>
  ),
};

export const VariantStates: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="sm" align="start">
      {TONES.map((tone) => (
        <Toast key={tone} message={`Сообщение — ${tone}`} tone={tone} />
      ))}
      <Text variant="bodySm" color="textMuted">
        Скрытого состояния у роли нет отдельно — «скрыт» означает отсутствие тоста как элемента, а не роль с иным видом.
      </Text>
    </Stack>
  ),
};

/** Обёртка с состоянием: показывает тост на 2 секунды по нажатию — так же, как `useToast` в приложении. */
function Live({ tone = 'success' as ToastTone }: { tone?: ToastTone }) {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setMessage('Готово');
          window.setTimeout(() => setMessage(null), 2000);
        }}
      >
        Показать тост
      </Button>
      <Toast message={message} tone={tone} />
    </>
  );
}

export const Content: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="короткое сообщение">
        <Toast message="Сохранено" />
      </Labeled>
      <Labeled label="длинное сообщение">
        <Toast message="Изменения сохранены в новом проекте «Копия проекта КМД-2200Т от 04.09.2026»" />
      </Labeled>
      <Labeled label="живой пример — появляется и сам пропадает">
        <Live />
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Сообщение не обрезается и не переносится принудительно — плашка растёт по ширине текста, пока не упрётся в
        край экрана (`translateX(-50%)` держит её отцентрованной). Очень длинную строку стоит сократить на стороне
        вызывающего кода, а не полагаться на перенос в тосте.
      </Text>
      <Toast message={longLabel} />
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="message = null — не рисуется вовсе">
        <Toast message={null} />
        <Text variant="bodySm" color="textMuted">
          (здесь нарочно пусто)
        </Text>
      </Labeled>
      <Labeled label="message = '' — пустая строка, тоже ничего не рисует">
        <Toast message="" />
        <Text variant="bodySm" color="textMuted">
          (здесь тоже нарочно пусто)
        </Text>
      </Labeled>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { message: '' },
  render: () => (
    <Spec
      slots={['icon (роли)', 'message']}
      annotate={{
        отступ: 'space.md',
        radius: 'radius.md',
        elevation: 'overlay',
        позиция: 'fixed, bottom: space.xl, по центру',
        'z-index': 'z.toast',
        появление: 'duration.base / easing.standard, сдвиг снизу + прозрачность',
      }}
    >
      <Toast message="Сообщение" />
    </Spec>
  ),
};

export const Usage: Story = {
  args: { message: '' },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">Подтверждение действия</Text>
        <Live tone="success" />
      </Stack>

      <DoDont reason="Тост не читает ответа и сам исчезает — решение, которое требует ответа («удалить безвозвратно?»), нельзя доверить ему: пользователь может не успеть среагировать, пока плашка не пропала.">
        <Toast message="Проект удалён" tone="danger" />
        <Surface level="raised" border padding="md" radius="md">
          <Stack gap="md">
            <Text variant="body">Удалить проект «Тестовый проект»?</Text>
            <Stack direction="row" gap="sm" justify="end">
              <Button variant="secondary" size="sm">
                Отмена
              </Button>
              <Button variant="primary" size="sm">
                Удалить
              </Button>
            </Stack>
          </Stack>
        </Surface>
      </DoDont>
    </Stack>
  ),
};
