import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Stack, Text, Box } from '@/primitives';
import { Labeled } from '@spec';
import { label, description } from '@fixtures';

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
  args: { label },
};

export const States: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <Labeled label="default">
        <Checkbox label={label} />
      </Labeled>
      <Labeled label="checked">
        <Checkbox label={label} defaultChecked />
      </Labeled>
      <Labeled label="indeterminate">
        <Checkbox label={label} indeterminate />
      </Labeled>
      <Labeled label="с пояснением">
        <Checkbox label={label} description={description} />
      </Labeled>
      <Labeled label="disabled">
        <Checkbox label={label} disabled />
      </Labeled>
      <Labeled label="disabled + checked">
        <Checkbox label={label} disabled defaultChecked />
      </Labeled>
      <Labeled label="disabled + indeterminate">
        <Checkbox label={label} disabled indeterminate />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Наведение и фокус — мышью и табом. Подпись кликабельна вместе с квадратом.
      </Text>
    </Stack>
  ),
};

/**
 * Примеры использования. Родительский флажок в состоянии `indeterminate` —
 * единственный законный повод его применить: он означает «отмечено не всё»,
 * а не третий выбор. Формулировки здесь настоящие: блок показывает
 * прикладной случай, а не форму контрола.
 */
export const Usage: Story = {
  render: () => {
    const items = ['Конусные', 'Щековые', 'Валковые'];
    const [checked, setChecked] = useState<string[]>(['Конусные']);
    const all = checked.length === items.length;
    const some = checked.length > 0 && !all;

    return (
      <Stack gap="sm" align="start">
        <Checkbox
          label="Все типы"
          checked={all}
          indeterminate={some}
          onChange={() => setChecked(all ? [] : items)}
        />
        <Box paddingX="lg">
          <Stack gap="sm" align="start">
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
    );
  },
};
