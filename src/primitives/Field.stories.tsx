import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Stack } from './Stack';
import { Text } from './Text';
import { Input } from '@/components';

const meta = {
  title: 'Primitives/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: подпись, пояснение и ошибка, связанные с контролом программно, а не только визуально. Контрол приходит render-функцией и получает `id`, `aria-describedby`, `aria-invalid`.',
          'Не использовать для: полей без подписи. Поле без подписи — это поле без назначения; если подпись мешает макету, это вопрос к макету.',
          'Плавающая подпись — это `variant`, а не отдельный компонент: иначе появятся два способа подписать поле, и они разойдутся. Держится на `:placeholder-shown`, поэтому контрол обязан прокинуть `placeholder` из render-пропов.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['stacked', 'floating'] },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Название проекта',
    hint: 'Отображается в списке проектов',
    variant: 'stacked',
    children: (props) => <Input {...props} fullWidth />,
  },
};

/** Два способа подписать поле. Внутри одной формы — только один из них. */
export const Variants: Story = {
  args: { label: '', children: () => null },
  render: () => (
    <Stack direction="row" gap="xl" align="start" wrap>
      <Stack gap="sm">
        <Text variant="caption" color="textMuted">
          stacked — подпись над контролом
        </Text>
        <Field label="Заказчик">{(props) => <Input {...props} fullWidth />}</Field>
      </Stack>
      <Stack gap="sm">
        <Text variant="caption" color="textMuted">
          floating — подпись уходит наверх при вводе
        </Text>
        <Field label="Заказчик" variant="floating">
          {(props) => <Input {...props} fullWidth />}
        </Field>
      </Stack>
    </Stack>
  ),
};

/**
 * Ошибка вытесняет пояснение, а не встаёт рядом: два текста под полем
 * заставляют выбирать, какой из них читать.
 */
export const States: Story = {
  args: { label: '', children: () => null },
  render: () => (
    <Stack gap="lg">
      <Field label="Заказчик" hint="Начните вводить название">
        {(props) => <Input {...props} fullWidth />}
      </Field>

      <Field label="Заказчик" required>
        {(props) => <Input {...props} fullWidth defaultValue="ММК" />}
      </Field>

      <Field label="Заказчик" required error="Поле обязательно для заполнения" hint="Это пояснение скрыто ошибкой">
        {(props) => <Input {...props} fullWidth />}
      </Field>

      <Field label="Заказчик" hint="Поле недоступно на этом шаге">
        {(props) => <Input {...props} fullWidth disabled />}
      </Field>
    </Stack>
  ),
};
