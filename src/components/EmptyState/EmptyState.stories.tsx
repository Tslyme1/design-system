import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '@/components';
import { Stack, Surface, Text } from '@/primitives';
import { label, description } from '@fixtures';

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
    icon: {
      control: 'select',
      options: [undefined, 'placeholder', 'search', 'folder', 'fileText', 'alertTriangle'],
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    icon: 'placeholder',
    title: label,
    description,
    action: (
      <Button variant="secondary" size="sm">
        Label
      </Button>
    ),
  },
};

/**
 * Наполнение: полный набор, без действия, только заголовок.
 *
 * Формулировки здесь нейтральны — блок показывает, из чего состоит пустое
 * состояние. Тем, чем случаи пустоты действительно различаются — текстом, —
 * занят блок `Usage`: там видно, что «ещё ничего не создано» и «поиск не дал
 * результата» отличаются не оформлением, а словами.
 */
export const Content: Story = {
  args: { title: '' },
  render: () => (
    <Stack gap="xl">
      <Surface level="flat" border radius="none" fullWidth>
        <EmptyState
          icon="placeholder"
          title={label}
          description={description}
          action={
            <Button variant="primary" size="sm" iconStart="placeholder">
              Label
            </Button>
          }
        />
      </Surface>

      <Surface level="flat" border radius="none" fullWidth>
        <EmptyState icon="placeholder" title={label} description={description} />
      </Surface>

      <Surface level="flat" border radius="none" fullWidth>
        <EmptyState title={label} />
      </Surface>

      <Text variant="caption" color="textMuted">
        Описание и действие необязательны, но без действия пустое состояние сообщает только о факте пустоты.
      </Text>
    </Stack>
  ),
};

/**
 * Примеры использования: иконки конкретные — здесь они помогают отличить
 * «ещё ничего не создано» от «поиск не дал результата» до чтения текста.
 */
export const Usage: Story = {
  args: { title: '' },
  render: () => (
    <Stack gap="2xl">
      <Stack gap="sm">
        <Text variant="label">Список проектов, в котором ещё ничего нет</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <EmptyState
            icon="folder"
            title="Проектов пока нет"
            description="Создайте первый расчёт — он появится в этом списке."
            action={
              <Button variant="primary" size="sm" iconStart="plus">
                Новый проект
              </Button>
            }
          />
        </Surface>
      </Stack>

      <Stack gap="sm">
        <Text variant="label">Фильтр, не давший результата</Text>
        <Surface level="flat" border radius="none" fullWidth>
          <EmptyState
            icon="search"
            title="Ничего не найдено"
            description="Измените условия фильтрации или сбросьте их."
            action={<Button variant="secondary" size="sm">Сбросить фильтры</Button>}
          />
        </Surface>
      </Stack>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: загрузки — там `Skeleton`. Пустота и ожидание — разные состояния, и текст у них разный.
      </Text>
    </Stack>
  ),
};
