import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';
import { Stack, Text } from '@/primitives';

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
  args: { label: 'Инженерный режим', name: 'mode-playground' },
};

export const States: Story = {
  render: () => (
    <Stack gap="lg">
      <RadioGroup name="states" legend="Режим расчёта">
        <Radio label="Обычный" value="a" />
        <Radio label="Выбранный" value="b" defaultChecked />
        <Radio
          label="С пояснением"
          value="c"
          description="Пояснение говорит, чем этот вариант отличается от соседнего"
        />
        <Radio label="Недоступный" value="d" disabled />
      </RadioGroup>
      <Text variant="caption" color="textMuted">
        Внутри группы стрелки переключают выбор, а таб входит и выходит из неё целиком.
      </Text>
    </Stack>
  ),
};

/** Горизонтальная группа — только для двух-трёх коротких вариантов. */
export const Direction: Story = {
  render: () => (
    <Stack gap="xl">
      <RadioGroup name="direction-column" legend="Единицы измерения">
        <Radio label="Миллиметры" value="mm" defaultChecked />
        <Radio label="Сантиметры" value="cm" />
      </RadioGroup>

      <RadioGroup name="direction-row" legend="Режим" direction="row">
        <Radio label="Инженерный" value="pro" defaultChecked />
        <Radio label="Упрощённый" value="lite" />
      </RadioGroup>
    </Stack>
  ),
};
