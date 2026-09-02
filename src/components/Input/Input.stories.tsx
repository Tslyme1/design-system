import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Stack, Text, Field } from '@/primitives';
import { Labeled } from '@spec';
import { label, description, placeholder, value } from '@fixtures';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: однострочный ввод. Подпись, пояснение и ошибка — задача `Field`, а не поля.',
          'Варианты: два типа поля — `stacked` (подпись над полем) и `floating` (подпись уходит наверх при вводе). Тип задаётся пропом `variant` у `Field`, потому что различаются они именно подписью; сам `Input` в обоих случаях один и тот же.',
          'Не использовать для: многострочного ввода — нужен `Textarea`. Не смешивать типы в одной форме: два способа подписать соседние поля читаются как две разные формы на одном экране.',
          'Поле без подписи в продукте не существует — здесь оно показано голым только чтобы были видны состояния самого контрола.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { placeholder, size: 'md' },
};

/**
 * Два типа поля. Различаются они только тем, где лежит подпись, поэтому
 * подпись и задаёт тип: проп `variant` стоит на `Field`, а не на `Input`.
 * Иначе появились бы два способа подписать поле, и они разошлись бы —
 * ровно как в аудите разошлись сторибук и приложение.
 *
 * Внутри одной формы используется один тип. Смешивать нельзя: два способа
 * подписать соседние поля читаются как две разные формы на одном экране.
 */
export const Variants: Story = {
  render: () => (
    <Stack direction="row" gap="2xl" align="start" wrap>
      <Stack gap="sm" align="start">
        <Text variant="label">stacked — подпись над полем</Text>
        <Text variant="caption" color="textMuted">
          Тип по умолчанию. Годится везде, подпись видна всегда.
        </Text>
        <Field label={label} hint={description}>
          {(props) => <Input {...props} fullWidth />}
        </Field>
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">floating — подпись уходит наверх при вводе</Text>
        <Text variant="caption" color="textMuted">
          Второй тип. Для плотных форм, где поля идут в ряд.
        </Text>
        <Stack gap="md">
          <Field label={label} variant="floating">
            {(props) => <Input {...props} fullWidth />}
          </Field>
          <Field label={label} variant="floating">
            {(props) => <Input {...props} defaultValue={value} fullWidth />}
          </Field>
        </Stack>
      </Stack>
    </Stack>
  ),
};

/**
 * `invalid` — это подсветка контрола, а не сообщение. Сообщение приходит
 * из `Field error`: цвет рамки не объясняет, что именно не так.
 */
export const States: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <Labeled label="default">
        <Input placeholder={placeholder} />
      </Labeled>
      <Labeled label="заполненное">
        <Input defaultValue={value} />
      </Labeled>
      <Labeled label="invalid">
        <Input placeholder={placeholder} invalid />
      </Labeled>
      <Labeled label="disabled">
        <Input defaultValue={value} disabled />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Наведение и фокус — мышью и табом: focus-visible не срабатывает на клик.
      </Text>
    </Stack>
  ),
};

/** Три высоты — те же, что у кнопки: поле и кнопка встают в один ряд. */
export const Sizes: Story = {
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
          <Input size={size} placeholder={placeholder} />
        </Labeled>
      ))}
    </Stack>
  ),
};

/**
 * Примеры использования: как поле выглядит в работе — всегда внутри `Field`,
 * всегда с подписью. Формулировки здесь настоящие: подпись поля объясняет,
 * что в него вводят, и абстрактный «Label» этого не показывает.
 */
export const Usage: Story = {
  render: () => (
    <Stack gap="lg">
      <Field label="Название проекта" hint="Отображается в списке проектов">
        {(props) => <Input {...props} fullWidth defaultValue="КМД-1750Т7-Д" />}
      </Field>
      <Field label="Заказчик" required error="Поле обязательно для заполнения">
        {(props) => <Input {...props} fullWidth />}
      </Field>
      <Field label="Угол конуса β10" hint="Единица переключается рядом, значение остаётся тем же числом">
        {(props) => <Input {...props} fullWidth type="number" defaultValue="17.5" suffix="град." />}
      </Field>
      <Text variant="bodySm" color="textMuted">
        Поле без подписи в продукте не существует. Голый контрол в блоках выше показан только затем, чтобы были видны
        состояния самого поля.
      </Text>
    </Stack>
  ),
};
