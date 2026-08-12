import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Stack, Text, Box } from '@/primitives';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: множественный выбор. Форма квадрата сообщает «можно выбрать несколько» — это часть смысла, а не оформление.',
          'Не использовать для: выбора одного варианта из нескольких — там `Radio`. Не использовать как переключатель режима — нужен `Switch` (не построен).',
          'В аудите все 10 флажков проекта были нативными: они выглядели как элементы браузера и не менялись в тёмной теме.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: 'Учитывать влажность питания' },
};

export const States: Story = {
  render: () => (
    <Stack gap="md">
      <Checkbox label="Обычный" />
      <Checkbox label="Отмеченный" defaultChecked />
      <Checkbox label="Частично отмеченный" indeterminate />
      <Checkbox label="С пояснением" description="Пояснение объясняет последствие выбора, а не повторяет подпись" />
      <Checkbox label="Недоступный" disabled />
      <Checkbox label="Недоступный отмеченный" disabled defaultChecked />
      <Text variant="caption" color="textMuted">
        Наведение и фокус — мышью и табом. Подпись кликабельна вместе с квадратом.
      </Text>
    </Stack>
  ),
};

/**
 * Родительский флажок в состоянии `indeterminate` — единственный законный
 * повод его применить: он означает «отмечено не всё», а не третий выбор.
 */
export const InContext: Story = {
  render: () => {
    const items = ['Конусные', 'Щековые', 'Валковые'];
    const [checked, setChecked] = useState<string[]>(['Конусные']);
    const all = checked.length === items.length;
    const some = checked.length > 0 && !all;

    return (
      <Box padding="lg" border>
        <Stack gap="sm">
          <Checkbox
            label="Все типы"
            checked={all}
            indeterminate={some}
            onChange={() => setChecked(all ? [] : items)}
          />
          <Box paddingX="lg">
            <Stack gap="sm">
              {items.map((item) => (
                <Checkbox
                  key={item}
                  label={item}
                  checked={checked.includes(item)}
                  onChange={() =>
                    setChecked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
                  }
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  },
};
