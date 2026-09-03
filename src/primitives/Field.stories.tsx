import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Stack } from './Stack';
import { Text } from './Text';
import { Button, Input, Tooltip } from '@/components';
import { Labeled } from '@spec';
import { label, description, value, errorText } from '@fixtures';

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
    /* Контрол приходит render-функцией: ни текстом, ни JSON её не задать. */
    children: { control: false },
    variant: { control: 'inline-radio', options: ['stacked', 'floating'] },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label,
    hint: description,
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
        <Field label={label}>{(props) => <Input {...props} fullWidth />}</Field>
      </Stack>
      <Stack gap="sm">
        <Text variant="caption" color="textMuted">
          floating — подпись уходит наверх при вводе
        </Text>
        <Field label={label} variant="floating">
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
      <Labeled label="default + hint">
        <Field label={label} hint={description}>
          {(props) => <Input {...props} fullWidth />}
        </Field>
      </Labeled>

      <Labeled label="required + заполненное">
        <Field label={label} required>
          {(props) => <Input {...props} fullWidth defaultValue={value} />}
        </Field>
      </Labeled>

      <Labeled label="error — вытесняет hint">
        <Field label={label} required error={errorText} hint={description}>
          {(props) => <Input {...props} fullWidth />}
        </Field>
      </Labeled>

      <Labeled label="disabled">
        <Field label={label} hint={description}>
          {(props) => <Input {...props} fullWidth disabled />}
        </Field>
      </Labeled>

      <Labeled label="labelHint — глоссарий по наведению, не то же самое, что hint">
        <Field
          label={label}
          hint="было: 12"
          labelHint={
            <Tooltip content="Расшифровка сокращения или физический смысл параметра — короткий текст для тех, кто не помнит методику наизусть.">
              <Button variant="ghost" size="sm" icon="info" aria-label={`Что означает: ${label}`} />
            </Tooltip>
          }
        >
          {(props) => <Input {...props} fullWidth defaultValue={value} />}
        </Field>
      </Labeled>
    </Stack>
  ),
};

/**
 * Примеры использования: настоящая форма. Подпись поля — то единственное,
 * что объясняет, что в него вводят, поэтому абстрактный «Label» здесь
 * ничего не показал бы.
 */
export const Usage: Story = {
  args: { label: '', children: () => null },
  render: () => (
    <Stack gap="lg">
      <Field label="Название проекта" hint="Отображается в списке проектов">
        {(props) => <Input {...props} fullWidth defaultValue="КМД-1750Т7-Д" />}
      </Field>
      <Field label="Заказчик" required error="Поле обязательно для заполнения">
        {(props) => <Input {...props} fullWidth />}
      </Field>
      <Field label="Комментарий" variant="floating">
        {(props) => <Input {...props} fullWidth />}
      </Field>
      <Text variant="bodySm" color="textMuted">
        Внутри одной формы — один тип подписи. Смешанные `stacked` и `floating` читаются как две разные формы на
        одном экране.
      </Text>
    </Stack>
  ),
};
