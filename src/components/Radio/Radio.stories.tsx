import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';
import { Stack, Text } from '@/primitives';
import { label, description, labels } from '@fixtures';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: выбор одного варианта из нескольких. Круг сообщает «только один» — форма совпадает со смыслом.',
          'Не использовать для: одиночной радиокнопки вне группы — её нельзя снять. Всегда внутри `RadioGroup`, иначе выбор не будет взаимоисключающим.',
          'В аудите радиокнопок не было ни одной: единственный выбор закрывался флажками, то есть формой, которая обещает возможность выбрать несколько.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label, name: 'mode-playground' },
};

/**
 * Два направления группы. Горизонтальная — только для двух-трёх коротких
 * вариантов: длинные подписи в строку не помещаются и разъезжаются.
 */
export const Variants: Story = {
  render: () => (
    <Stack gap="xl">
      <RadioGroup name="direction-column" legend="Label">
        <Radio label={labels[0]} value="a" defaultChecked />
        <Radio label={labels[1]} value="b" />
      </RadioGroup>

      <RadioGroup name="direction-row" legend="Label" direction="row">
        <Radio label={labels[0]} value="a" defaultChecked />
        <Radio label={labels[1]} value="b" />
      </RadioGroup>
    </Stack>
  ),
};

export const States: Story = {
  render: () => (
    <Stack gap="lg">
      <RadioGroup name="states" legend="Label">
        <Radio label="default" value="a" />
        <Radio label="checked" value="b" defaultChecked />
        <Radio label="с пояснением" value="c" description={description} />
        <Radio label="disabled" value="d" disabled />
      </RadioGroup>
      <Text variant="caption" color="textMuted">
        Подписи здесь называют состояние, а не вариант выбора: у радиокнопки состояние видно только рядом с соседним.
        Внутри группы стрелки переключают выбор, а таб входит и выходит из неё целиком.
      </Text>
    </Stack>
  ),
};

/**
 * Примеры использования: настоящие формулировки. Подпись группы говорит,
 * из чего выбирают, а подписи вариантов — взаимоисключающие значения.
 */
export const Usage: Story = {
  render: () => (
    <Stack gap="xl">
      <RadioGroup name="usage-units" legend="Единицы измерения">
        <Radio label="Миллиметры" value="mm" defaultChecked />
        <Radio label="Сантиметры" value="cm" />
      </RadioGroup>

      <RadioGroup name="usage-mode" legend="Режим расчёта" direction="row">
        <Radio label="Инженерный" value="pro" defaultChecked />
        <Radio label="Упрощённый" value="lite" />
      </RadioGroup>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: одиночной радиокнопки вне группы — её нельзя снять. Для выбора нескольких значений —
        `Checkbox`, форма квадрата обещает именно это.
      </Text>
    </Stack>
  ),
};
