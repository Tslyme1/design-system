import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';
import { Button } from '@/components';
import { Stack, Text, Field } from '@/primitives';
import { crusherOptions, customers } from '@fixtures';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: выбор из списка, который не помещается на экран. Панель отдана `Popover`, здесь только логика выбора.',
          'Не использовать для: двух-трёх взаимоисключающих вариантов, которые помещаются на экран — там `RadioGroup` или `SegmentedControl` (не построен): список ради двух пунктов прячет выбор за лишним кликом.',
          'Триггер — `button`, а не `input`, поэтому заполненность сообщается через `data-filled`: плавающая подпись `Field` держится на `:placeholder-shown`, который работает только у полей ввода.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    allowCustom: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    options: crusherOptions,
    value: null,
    onChange: () => undefined,
    placeholder: 'Выберите дробилку',
    searchable: true,
    fullWidth: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | string[] | null>(args.value);
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

/** Одиночный, множественный, с поиском, с группами, со свободным вводом. */
export const Variants: Story = {
  args: { options: [], value: null, onChange: () => undefined },
  render: () => {
    const [single, setSingle] = useState<string | string[] | null>('kmd-1750');
    const [multi, setMulti] = useState<string | string[] | null>(['kmd-1750', 'sms-741']);
    const [custom, setCustom] = useState<string | string[] | null>(null);

    return (
      <Stack gap="xl" align="start">
        <Stack gap="xs">
          <Text variant="label">Одиночный выбор с группами</Text>
          <Select options={crusherOptions} value={single} onChange={setSingle} placeholder="Выберите дробилку" />
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Множественный выбор с поиском</Text>
          <Select
            options={crusherOptions}
            value={multi}
            onChange={setMulti}
            multiple
            searchable
            placeholder="Типы оборудования"
          />
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Свободный ввод — «Заказчик»</Text>
          <Select
            options={customers}
            value={custom}
            onChange={setCustom}
            searchable
            allowCustom
            placeholder="Начните вводить название"
            footer={
              <Button variant="ghost" size="sm" iconStart="plus" fullWidth>
                Добавить заказчика
              </Button>
            }
          />
        </Stack>
      </Stack>
    );
  },
};

export const States: Story = {
  args: { options: [], value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Select options={crusherOptions} value={null} onChange={() => undefined} placeholder="Обычный" />
      <Select options={crusherOptions} value="kmd-1750" onChange={() => undefined} placeholder="Заполненный" />
      <Select options={crusherOptions} value={null} onChange={() => undefined} placeholder="Невалидный" invalid />
      <Select options={crusherOptions} value={null} onChange={() => undefined} placeholder="Недоступный" disabled />
      <Text variant="caption" color="textMuted">
        Отключённый пункт в списке («СМД-109, снята с производства») остаётся видимым: он объясняет, почему выбрать
        нельзя, а скрытый пункт заставляет искать его снова.
      </Text>
    </Stack>
  ),
};

/**
 * Пустой результат поиска — состояние, которое чаще всего забывают.
 * Введи в поиск то, чего в списке нет.
 */
export const DataStates: Story = {
  args: { options: [], value: null, onChange: () => undefined },
  render: () => {
    const [value, setValue] = useState<string | string[] | null>(null);
    return (
      <Stack gap="xl" align="start">
        <Stack gap="xs">
          <Text variant="label">Поиск без совпадений</Text>
          <Select
            options={crusherOptions}
            value={value}
            onChange={setValue}
            searchable
            placeholder="Введите «щековая роторная»"
          />
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Список пуст</Text>
          <Select options={[]} value={null} onChange={() => undefined} placeholder="Оборудование не заведено" />
        </Stack>
      </Stack>
    );
  },
};

/** Три высоты — те же, что у кнопки и поля. */
export const Sizes: Story = {
  args: { options: [], value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="md" align="start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select
          key={size}
          options={crusherOptions}
          value={null}
          onChange={() => undefined}
          size={size}
          placeholder={`Размер ${size}`}
        />
      ))}
    </Stack>
  ),
};

/** В форме селект живёт внутри `Field` — как любое другое поле. */
export const InContext: Story = {
  args: { options: [], value: null, onChange: () => undefined },
  render: () => {
    const [customer, setCustomer] = useState<string | string[] | null>(null);
    const [crusher, setCrusher] = useState<string | string[] | null>(null);

    return (
      <Stack gap="lg">
        <Field label="Заказчик" required hint="Если заказчика нет в списке — введите название">
          {(props) => (
            <Select
              {...props}
              options={customers}
              value={customer}
              onChange={setCustomer}
              searchable
              allowCustom
              fullWidth
            />
          )}
        </Field>

        <Field label="Дробилка" variant="floating">
          {(props) => (
            <Select {...props} options={crusherOptions} value={crusher} onChange={setCrusher} fullWidth />
          )}
        </Field>
      </Stack>
    );
  },
};
