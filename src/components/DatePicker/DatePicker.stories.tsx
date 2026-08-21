import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { Field, Stack, Text } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';

/**
 * Даты в историях фиксированные, а не «сегодня»: снимок витрины иначе
 * менялся бы каждые сутки, и сравнить его было бы не с чем.
 */
const DATE = '2026-08-21';
const OTHER = '2026-02-03';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Выбор даты. Собственная панель, а не `<input type="date">`: нативный календарь рисует браузер, и ни гарнитура, ни цвета, ни радиусы, ни тёмная тема в него не передаются.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Обёртка с состоянием: поле без него не меняется, и потрогать его нельзя. */
function Live({
  initial = null,
  ...props
}: { initial?: string | null } & Omit<Parameters<typeof DatePicker>[0], 'value' | 'onChange'>) {
  const [value, setValue] = useState<string | null>(initial);
  return <DatePicker {...props} value={value} onChange={setValue} />;
}

export const Playground: Story = {
  args: {
    value: DATE,
    onChange: () => undefined,
    size: 'md',
  },
  render: (args) => <Live {...args} initial={args.value} />,
};

/** Пустое поле, заполненное и с границами выбора. */
export const Variants: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="дата не выбрана">
        <Live />
      </Labeled>

      <Labeled label="дата выбрана">
        <Live initial={DATE} />
      </Labeled>

      <Labeled label="границы выбора: только вторая половина 2026 года">
        <Live initial={DATE} min="2026-07-01" max="2026-12-31" />
      </Labeled>
    </Stack>
  ),
};

export const States: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="обычное">
        <Live initial={DATE} />
      </Labeled>
      <Labeled label="ошибка">
        <Live initial={DATE} invalid />
      </Labeled>
      <Labeled label="отключено">
        <Live initial={DATE} disabled />
      </Labeled>
    </Stack>
  ),
};

export const VariantStates: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="пустое и отключённое: плейсхолдер приглушается вместе с полем">
        <Live disabled />
      </Labeled>
      <Labeled label="пустое с ошибкой: рамка красная, значение так и не введено">
        <Live invalid />
      </Labeled>
      <Labeled label="заполненное с ошибкой: дата видна, но не подходит">
        <Live initial={OTHER} invalid />
      </Labeled>
    </Stack>
  ),
};

export const Sizes: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Live initial={DATE} size="sm" />
      <Live initial={DATE} size="md" />
      <Live initial={DATE} size="lg" />
      <Text variant="bodySm" color="textMuted">
        Высота поля идёт по шкале контролов, панель у всех размеров одна: день в сетке — цель для указателя, и
        уменьшать её вслед за полем значило бы промахиваться мимо чисел.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="подпись ставит Field, как у любого поля формы">
        <Field label="Дата проекта" fullWidth>
          {(props) => <Live {...props} initial={DATE} fullWidth />}
        </Field>
      </Labeled>

      <Labeled label="плавающая подпись: поле сообщает заполненность атрибутом">
        <Field label="Дата проекта" variant="floating" fullWidth>
          {(props) => <Live {...props} fullWidth />}
        </Field>
      </Labeled>

      <Labeled label="свой плейсхолдер">
        <Live placeholder="Выберите дату" />
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="узкое поле: значение не переносится и не режет значок">
        <div style={{ width: 140 }}>
          <Live initial={DATE} fullWidth />
        </div>
      </Labeled>

      <Labeled label="во всю ширину контейнера">
        <div style={{ width: 420 }}>
          <Live initial={DATE} fullWidth />
        </div>
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        Панель шире поля и от его ширины не зависит: семь колонок по ячейке-контролу — это минимум, ниже которого
        числа перестают быть целью для указателя.
      </Text>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="февраль високосного года — 29 дней">
        <Live initial="2028-02-29" />
      </Labeled>

      <Labeled label="месяц, который начинается с воскресенья: первая неделя почти вся из соседнего">
        <Live initial="2026-03-01" />
      </Labeled>

      <Labeled label="дата вне заданных границ: показана, но выбрать её нельзя">
        <Live initial="2026-01-15" min="2026-07-01" max="2026-12-31" />
      </Labeled>

      <Labeled label="битое значение — поле остаётся пустым, а не падает">
        <Live initial="не дата" />
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        Сетка всегда из шести недель. У февраля их выходит пять, у марта шесть — без этого правила панель прыгала
        бы по высоте на каждом листании, а кнопки под ней уезжали вместе с ней.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { value: DATE, onChange: () => undefined },
  render: () => (
    <Spec
      slots={['поле → значение + значок', 'шапка → месяц + листание', 'дни недели', 'сетка 7 × 6', 'футер панели']}
      annotate={{
        'высота поля': 'control.md',
        'ячейка дня': 'control.sm',
        'промежуток в сетке': 'space.2xs',
        'радиус дня': 'radius.sm',
        наведение: 'color.surfaceSunken',
        выбранный: 'color.accent / color.textOnAccent',
        сегодня: 'color.accentText + обводка hairline',
        'соседний месяц': 'color.textMuted',
        'типографика числа': 'text.bodySm, font.mono',
      }}
    >
      <Live initial={DATE} />
    </Spec>
  ),
};

export const Usage: Story = {
  args: { value: null, onChange: () => undefined },
  render: () => (
    <Stack gap="2xl" align="start">
      <DoDont reason="Дата в фильтре — такое же поле формы, как и остальные: подпись ставит Field, а не соседний текст.">
        <Field label="Дата проекта">{(props) => <Live {...props} initial={DATE} />}</Field>
        <Stack gap="2xs" align="start">
          <Text variant="label">Дата проекта</Text>
          <Live initial={DATE} />
        </Stack>
      </DoDont>

      <DoDont reason="Границы задаются полем, а не проверкой после ввода: день, который нельзя выбрать, не должен нажиматься.">
        <Live initial={DATE} min="2026-01-01" max="2026-12-31" />
        <Live initial="2027-05-04" invalid />
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Диапазон «с — по» собирается из двух полей: у второго `min` равен значению первого. Отдельного компонента
        для диапазона в системе нет намеренно — он был бы третьим способом выбрать дату.
      </Text>
    </Stack>
  ),
};
