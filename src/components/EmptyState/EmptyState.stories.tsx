import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '@/components';
import { Stack, Surface, Text } from '@/primitives';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: область данных, в которой данных нет. Один вид на весь проект — в аудите было три.',
          'Не использовать для: состояния загрузки — нужен `Skeleton` (не построен). Не использовать для ошибок сети: формулировка идёт от состояния данных, а не от сбоя системы.',
          'Формулировка говорит, что делать дальше. «Ничего не найдено» без действия оставляет пользователя в тупике.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: [undefined, 'search', 'folder', 'fileText', 'alertTriangle'] },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    icon: 'search',
    title: 'Ничего не найдено',
    description: 'Измените условия фильтрации или сбросьте их.',
    action: (
      <Button variant="secondary" size="sm">
        Сбросить фильтры
      </Button>
    ),
  },
};

/**
 * Три случая пустоты различаются не оформлением, а текстом:
 * ещё ничего не создано, поиск не дал результата, доступ ограничен.
 */
export const Content: Story = {
  args: { title: '' },
  render: () => (
    <Stack gap="xl">
      <Surface level="flat" border radius="none" fullWidth>
        <EmptyState
          icon="folder"
          title="Проектов пока нет"
          description="Создайте первый расчёт — он появится в этом списке."
          action={<Button variant="primary" size="sm" iconStart="plus">Новый проект</Button>}
        />
      </Surface>

      <Surface level="flat" border radius="none" fullWidth>
        <EmptyState
          icon="search"
          title="Ничего не найдено"
          description="Измените условия фильтрации или сбросьте их."
          action={<Button variant="secondary" size="sm">Сбросить фильтры</Button>}
        />
      </Surface>

      <Surface level="flat" border radius="none" fullWidth>
        <EmptyState title="Только заголовок" />
      </Surface>

      <Text variant="caption" color="textMuted">
        Описание и действие необязательны, но без действия пустое состояние сообщает только о факте пустоты.
      </Text>
    </Stack>
  ),
};
