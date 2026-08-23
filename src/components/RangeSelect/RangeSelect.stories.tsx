import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RangeSelect } from './RangeSelect';
import type { Range } from './RangeSelect';
import { Field, Stack, Text } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';

const EMPTY: Range = { from: '', to: '' };
const BOTH: Range = { from: '900', to: '3500' };
const ONLY_FROM: Range = { from: '2000', to: '' };

const meta = {
  title: 'Components/RangeSelect',
  component: RangeSelect,
  parameters: {
    docs: {
      description: {
        component:
          'Отбор по диапазону величины. Снаружи — такое же поле, что и `Select`: в строке фильтров рядом стоят отбор по значению и отбор по диапазону, и разный вид означал бы разную природу. Границы применяются по «Готово».',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof RangeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Обёртка с состоянием: без неё границы не применяются и потрогать поле нельзя. */
function Live({
  initial = EMPTY,
  ...props
}: { initial?: Range } & Omit<Parameters<typeof RangeSelect>[0], 'value' | 'onChange'>) {
  const [value, setValue] = useState<Range>(initial);
  return <RangeSelect {...props} value={value} onChange={setValue} />;
}

export const Playground: Story = {
  args: {
    value: EMPTY,
    onChange: () => undefined,
    placeholder: 'Label',
    fromHint: '900',
    toHint: '3500',
    size: 'md',
  },
  render: (args) => <Live {...args} initial={args.value} />,
};

/** Границы не заданы, задана одна, заданы обе. */
export const Variants: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="границы не заданы — в поле имя величины">
        <Live placeholder="Label" fromHint="900" toHint="3500" />
      </Labeled>

      <Labeled label="задана нижняя — граница пишется словом">
        <Live placeholder="Label" initial={ONLY_FROM} fromHint="900" toHint="3500" />
      </Labeled>

      <Labeled label="заданы обе — тире между числами">
        <Live placeholder="Label" initial={BOTH} fromHint="900" toHint="3500" />
      </Labeled>
    </Stack>
  ),
};

export const States: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="обычное">
        <Live placeholder="Label" />
      </Labeled>
      <Labeled label="ошибка">
        <Live placeholder="Label" invalid />
      </Labeled>
      <Labeled label="отключено">
        <Live placeholder="Label" disabled />
      </Labeled>
    </Stack>
  ),
};

export const VariantStates: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="пустое и отключённое: имя величины приглушается вместе с полем">
        <Live placeholder="Label" disabled />
      </Labeled>
      <Labeled label="заполненное и отключённое: границы видны, менять нельзя">
        <Live placeholder="Label" initial={BOTH} disabled />
      </Labeled>
      <Labeled label="заполненное с ошибкой: границы заданы, но не подходят">
        <Live placeholder="Label" initial={BOTH} invalid />
      </Labeled>
    </Stack>
  ),
};

export const Sizes: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Live placeholder="Label" initial={BOTH} size="sm" />
      <Live placeholder="Label" initial={BOTH} size="md" />
      <Live placeholder="Label" initial={BOTH} size="lg" />
      <Text variant="bodySm" color="textMuted">
        Высота поля идёт по шкале контролов. Поля границ внутри панели всегда `sm`: панель узкая, и контрол
        в полный рост занял бы её целиком.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="подсказки в панели — края шкалы справочника">
        <Live placeholder="Label" fromHint="900" toHint="3500" />
      </Labeled>

      <Labeled label="без подсказок — в полях остаются «от» и «до»">
        <Live placeholder="Label" />
      </Labeled>

      <Labeled label="подпись ставит Field, как у любого поля формы">
        <Field label="Label" fullWidth>
          {(props) => <Live {...props} placeholder="Label" initial={BOTH} fullWidth />}
        </Field>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="узкое поле: сводка обрезается многоточием, шеврон остаётся на месте">
        <div style={{ width: 150 }}>
          <Live placeholder="Длинное имя величины, мм" initial={BOTH} fullWidth />
        </div>
      </Labeled>

      <Labeled label="во всю ширину контейнера">
        <div style={{ width: 420 }}>
          <Live placeholder="Label" initial={BOTH} fullWidth />
        </div>
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        Панель шире поля и от его ширины не зависит: в неё встают два поля границ, и ужимать их до ширины
        фильтра значило бы прятать вводимое число.
      </Text>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="перевёрнутый диапазон: поле показывает введённое, а не исправляет его">
        <Live placeholder="Label" initial={{ from: '3500', to: '900' }} />
      </Labeled>

      <Labeled label="ноль — это граница, а не пустота">
        <Live placeholder="Label" initial={{ from: '0', to: '' }} />
      </Labeled>

      <Labeled label="дробная граница">
        <Live placeholder="Label" initial={{ from: '2.5', to: '3.75' }} />
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        Перевёрнутый диапазон не разворачивается молча: «от 3500 до 900» — это вопрос к тому, кто его ввёл,
        и подменять его на «от 900 до 3500» значит отвечать за пользователя. Пустая выборка сообщает об этом
        честнее.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { value: BOTH, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Spec
      slots={['поле → сводка + шеврон', 'панель → «от» — «до»', 'футер → «Сбросить» и «Готово»']}
      annotate={{
        'высота поля': 'control.md',
        'поля границ': 'control.sm',
        'промежуток в панели': 'space.xs',
        тире: 'color.textMuted',
        'имя величины без границ': 'color.textMuted',
        'сводка с границами': 'color.text',
      }}
    >
      <Live placeholder="Label" initial={BOTH} fromHint="900" toHint="3500" />
    </Spec>
  ),
};

export const Usage: Story = {
  args: { value: EMPTY, onChange: () => undefined, placeholder: 'Label' },
  render: () => (
    <Stack gap="2xl" align="start">
      <DoDont reason="Имя величины остаётся в поле вместе с границами: «2000—3500» без него не говорит, чего это границы.">
        <Live placeholder="Q, т/ч" initial={{ from: '2000', to: '3500' }} />
        <Live placeholder="" initial={{ from: '2000', to: '3500' }} />
      </DoDont>

      <DoDont reason="Диапазон — одно условие, и в строке фильтров он занимает одно поле. Пара полей рядом с селектами читается как два условия и отнимает у строки вдвое больше места.">
        <Stack direction="row" gap="sm" align="center">
          <Live placeholder="D, мм" fromHint="900" toHint="3500" />
          <Live placeholder="Q, т/ч" fromHint="72" toHint="655" />
        </Stack>
        <Stack direction="row" gap="sm" align="center">
          <Field label="D, мм">{(props) => <Live {...props} placeholder="от" />}</Field>
          <Field label="до">{(props) => <Live {...props} placeholder="до" />}</Field>
        </Stack>
      </DoDont>
    </Stack>
  ),
};
