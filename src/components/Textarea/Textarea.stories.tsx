import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { Input } from '@/components';
import { Stack, Text, Box, Field } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { longText, unbreakable, label, description, placeholder, value } from '@fixtures';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: многострочный ввод — примечание, комментарий, описание.',
          'Анатомия: поле ввода. Подпись, пояснение и ошибка приходят от `Field`, у самого контрола их нет.',
          'Правила: высота поля — обещание объёма, поэтому `rows` выбирается по ожидаемому тексту. Дальше поле растёт за вводом само: `rows` — нижняя граница, `maxRows` — верхняя, после неё поле прокручивается внутри себя. Ручки растягивания нет — высотой управляет компонент.',
          'Не использовать для: однострочных значений — там `Input`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 12 } },
    maxRows: { control: { type: 'number', min: 2, max: 20 } },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { placeholder, rows: 3, fullWidth: true },
};

export const States: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <Labeled label="default">
        <Textarea placeholder={placeholder} />
      </Labeled>
      <Labeled label="filled">
        <Textarea defaultValue={value} />
      </Labeled>
      <Labeled label="invalid">
        <Textarea defaultValue={value} invalid />
      </Labeled>
      <Labeled label="disabled">
        <Textarea defaultValue={value} disabled />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Наведение и фокус — мышью и табом. Высота во всех состояниях идёт за содержимым, ручки растягивания нет.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="rows=2 — короткая заметка">
        <Textarea rows={2} placeholder={placeholder} fullWidth />
      </Labeled>
      <Labeled label="rows=6 — развёрнутый текст">
        <Textarea rows={6} defaultValue={longText} fullWidth />
      </Labeled>
      <Labeled label="рост за вводом — начните печатать, поле поднимется">
        <Textarea rows={2} placeholder={placeholder} fullWidth />
      </Labeled>
      <Labeled label="maxRows=4 — рост до потолка, дальше прокрутка">
        <Textarea rows={2} maxRows={4} defaultValue={longText} fullWidth />
      </Labeled>
      <Labeled label="в форме, с подписью и пояснением">
        <Field label={label} hint={description}>
          {(props) => <Textarea {...props} fullWidth />}
        </Field>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: без `maxRows` поле идёт за текстом сколько угодно, с `maxRows` — упирается в потолок и
        прокручивается внутри себя. Строка без пробелов разрывается принудительно, а не растягивает форму.
      </Text>
      <Box padding="md" border>
        <Stack gap="md">
          <Textarea rows={3} defaultValue={`${longText} ${longText}`} fullWidth />
          <Textarea rows={3} maxRows={5} defaultValue={`${longText} ${longText}`} fullWidth />
          <Textarea rows={2} maxRows={4} defaultValue={unbreakable} fullWidth />
        </Stack>
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="пустое, без плейсхолдера">
        <Textarea />
      </Labeled>
      <Labeled label="rows=1 — вырожденный случай, здесь нужен Input">
        <Textarea rows={1} defaultValue={value} fullWidth />
      </Labeled>
      <Labeled label="только пробелы">
        <Textarea defaultValue="   " />
      </Labeled>
      <Labeled label="перевод строки в начале">
        <Textarea defaultValue={`\n\n${value} — после двух пустых строк`} />
      </Labeled>
      <Labeled label="maxRows меньше rows — потолок ниже пола, побеждает потолок">
        <Textarea rows={4} maxRows={2} defaultValue={longText} fullWidth />
      </Labeled>
    </Stack>
  ),
};

export const Anatomy: Story = {
  render: () => (
    <Spec
      slots={['textarea']}
      annotate={{
        padding: 'space.sm space.md',
        radius: 'radius.md',
        рамка: 'hairline / color.border',
        типографика: 'text.body',
        'фокус': 'color.accent + focusRing',
        'высота': 'rows … maxRows, за содержимым',
      }}
    >
      <Textarea rows={3} defaultValue={value} />
    </Spec>
  ),
};

export const Usage: Story = {
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">В форме</Text>
        <Box padding="lg" border>
          <Stack gap="lg">
            <Field label="Название проекта">{(props) => <Input {...props} fullWidth />}</Field>
            <Field label="Примечание" hint="Свободный текст, попадёт в печатную форму">
              {(props) => <Textarea {...props} rows={4} maxRows={10} fullWidth />}
            </Field>
          </Stack>
        </Box>
      </Stack>

      <DoDont reason="Высота поля обещает объём. Три строки под название заставляют писать длинно, а однострочное значение в многострочном поле мешает его сравнивать в списке.">
        <Stack gap="xs">
          <Text variant="caption" color="textMuted">
            название — Input
          </Text>
          <Input defaultValue="КМД-1750Т7-Д" />
        </Stack>
        <Stack gap="xs">
          <Text variant="caption" color="textMuted">
            название — Textarea
          </Text>
          <Textarea rows={3} defaultValue="КМД-1750Т7-Д" />
        </Stack>
      </DoDont>

      <Text variant="bodySm" color="textMuted">
        Не использовать для: однострочных значений — там `Input`. Подпись ставит `Field`, плейсхолдер подписью не является.
      </Text>
    </Stack>
  ),
};
