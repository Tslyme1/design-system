import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';
import { Button } from '@/components';
import { Stack, Text, Field } from '@/primitives';
import { Labeled } from '@spec';
import { crusherOptions, customers, labelOptions, labelOptionsGrouped, placeholder } from '@fixtures';

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
          'Триггер — `button`, а не `input`, поэтому заполненность сообщается через `data-filled`: `:placeholder-shown`, на котором держится плавающая подпись у `Input`, бывает только у полей ввода. Пустой текст плейсхолдера в варианте `floating` подставляет сам `Field` — своё значение `placeholder` туда передавать не нужно, иначе оно окажется под подписью.',
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
    options: labelOptions,
    value: null,
    onChange: () => undefined,
    placeholder,
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
    const [single, setSingle] = useState<string | string[] | null>('a');
    const [multi, setMulti] = useState<string | string[] | null>(['a', 'c']);
    const [custom, setCustom] = useState<string | string[] | null>(null);
    const [floatEmpty, setFloatEmpty] = useState<string | string[] | null>(null);
    const [floatFilled, setFloatFilled] = useState<string | string[] | null>('a');

    return (
      <Stack gap="xl" align="start">
        <Stack gap="xs">
          <Text variant="label">Одиночный выбор с группами</Text>
          <Select options={labelOptionsGrouped} value={single} onChange={setSingle} placeholder={placeholder} />
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Множественный выбор с поиском</Text>
          <Select
            options={labelOptions}
            value={multi}
            onChange={setMulti}
            multiple
            searchable
            placeholder={placeholder}
          />
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Свободный ввод</Text>
          <Select
            options={labelOptions}
            value={custom}
            onChange={setCustom}
            searchable
            allowCustom
            placeholder={placeholder}
            footer={
              <Button variant="ghost" size="sm" iconStart="placeholder" fullWidth>
                Label
              </Button>
            }
          />
        </Stack>

        {/* Плавающая подпись у селекта: два положения рядом, потому что
            дефект был виден только в сравнении. Пока подпись поднята всегда,
            пустой селект и заполненный выглядят одинаково — и то, что
            начального положения нет, заметить не на чем. */}
        <Stack gap="xs">
          <Text variant="label">Плавающая подпись: пусто и заполнено</Text>
          <Stack direction="row" gap="md" align="start">
            <Field label="Label" variant="floating">
              {(props) => <Select {...props} options={labelOptions} value={floatEmpty} onChange={setFloatEmpty} />}
            </Field>
            <Field label="Label" variant="floating">
              {(props) => <Select {...props} options={labelOptions} value={floatFilled} onChange={setFloatFilled} />}
            </Field>
          </Stack>
        </Stack>
      </Stack>
    );
  },
};

export const States: Story = {
  args: { options: [], value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="default">
        <Select options={labelOptions} value={null} onChange={() => undefined} placeholder={placeholder} />
      </Labeled>
      <Labeled label="заполненный">
        <Select options={labelOptions} value="a" onChange={() => undefined} placeholder={placeholder} />
      </Labeled>
      <Labeled label="invalid">
        <Select options={labelOptions} value={null} onChange={() => undefined} placeholder={placeholder} invalid />
      </Labeled>
      <Labeled label="disabled">
        <Select options={labelOptions} value={null} onChange={() => undefined} placeholder={placeholder} disabled />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Отключённый пункт списка («Label 4») остаётся видимым: он объясняет, почему выбрать нельзя, а скрытый пункт
        заставляет искать его снова.
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
          <Text variant="label">Поиск без совпадений — введи «Label 9»</Text>
          <Select options={labelOptions} value={value} onChange={setValue} searchable placeholder={placeholder} />
        </Stack>

        <Stack gap="xs">
          <Text variant="label">Список пуст</Text>
          <Select options={[]} value={null} onChange={() => undefined} placeholder={placeholder} />
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
      {(
        [
          ['sm', '32'],
          ['md', '40'],
          ['lg', '48'],
        ] as const
      ).map(([size, px]) => (
        <Labeled key={size} label={`${size} — ${px}`}>
          <Select
            options={labelOptions}
            value={null}
            onChange={() => undefined}
            size={size}
            placeholder={placeholder}
          />
        </Labeled>
      ))}
    </Stack>
  ),
};

/**
 * Примеры использования: в форме селект живёт внутри `Field` — как любое
 * другое поле. Иконка в футере списка здесь конкретная: «Добавить
 * заказчика» — это плюс, а не абстрактное действие.
 */
export const Usage: Story = {
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
              footer={
                <Button variant="ghost" size="sm" iconStart="plus" fullWidth>
                  Добавить заказчика
                </Button>
              }
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
