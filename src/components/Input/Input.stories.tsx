import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Stack, Text, Field } from '@/primitives';

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
  args: { placeholder: 'КМД-1750Т7-Д', size: 'md' },
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
        <Field label="Заказчик" hint="Отображается в списке проектов">
          {(props) => <Input {...props} fullWidth />}
        </Field>
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">floating — подпись уходит наверх при вводе</Text>
        <Text variant="caption" color="textMuted">
          Второй тип. Для плотных форм, где поля идут в ряд.
        </Text>
        <Stack gap="md">
          <Field label="Заказчик" variant="floating">
            {(props) => <Input {...props} fullWidth />}
          </Field>
          <Field label="Заполненное" variant="floating">
            {(props) => <Input {...props} defaultValue="ММК" fullWidth />}
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
    <Stack gap="md">
      <Input placeholder="Обычное" />
      <Input defaultValue="Заполненное" />
      <Input placeholder="Невалидное" invalid />
      <Input defaultValue="Недоступное" disabled />
      <Text variant="caption" color="textMuted">
        Наведение и фокус — мышью и табом: focus-visible не срабатывает на клик.
      </Text>
    </Stack>
  ),
};

/** Три высоты — те же, что у кнопки: поле и кнопка встают в один ряд. */
export const Sizes: Story = {
  render: () => (
    <Stack gap="md">
      <Input size="sm" placeholder="sm — 32" />
      <Input size="md" placeholder="md — 40" />
      <Input size="lg" placeholder="lg — 48" />
    </Stack>
  ),
};

/** Как поле выглядит в работе: всегда внутри `Field`, всегда с подписью. */
export const InContext: Story = {
  render: () => (
    <Stack gap="lg">
      <Field label="Название проекта" hint="Отображается в списке проектов">
        {(props) => <Input {...props} fullWidth defaultValue="КМД-1750Т7-Д" />}
      </Field>
      <Field label="Заказчик" required error="Поле обязательно для заполнения">
        {(props) => <Input {...props} fullWidth />}
      </Field>
    </Stack>
  ),
};
