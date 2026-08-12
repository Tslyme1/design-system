import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { Input } from '@/components';
import { Stack, Text, Box, Field } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { longText, unbreakable } from '@fixtures';

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
          'Правила: высота поля — обещание объёма, поэтому `rows` выбирается по ожидаемому тексту. Растягивание разрешено только по вертикали: по горизонтали поле выедет за раскладку формы.',
          'Не использовать для: однострочных значений — там `Input`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 12 } },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: { placeholder: 'Примечание к расчёту', rows: 3 },
};

export const Playground: Story = {
  args: { placeholder: 'Примечание к расчёту', rows: 3, fullWidth: true },
};

export const States: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <Labeled label="default">
        <Textarea placeholder="Примечание" />
      </Labeled>
      <Labeled label="filled">
        <Textarea defaultValue="Расчёт согласован с технологом" />
      </Labeled>
      <Labeled label="invalid">
        <Textarea defaultValue="Слишком короткое" invalid />
      </Labeled>
      <Labeled label="disabled">
        <Textarea defaultValue="Недоступно на этом шаге" disabled />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Наведение и фокус — мышью и табом. У disabled убрана ручка растягивания: тянуть нечего.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="rows=2 — короткая заметка">
        <Textarea rows={2} placeholder="Одна-две строки" fullWidth />
      </Labeled>
      <Labeled label="rows=6 — развёрнутое примечание">
        <Textarea rows={6} defaultValue={longText} fullWidth />
      </Labeled>
      <Labeled label="в форме, с подписью и пояснением">
        <Field label="Примечание" hint="Попадёт в печатную форму расчёта">
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
        Ответ на границе: текст переносится и поле прокручивается внутри себя, оставаясь заданной высоты. Строка без
        пробелов разрывается принудительно, а не растягивает форму.
      </Text>
      <Box padding="md" border>
        <Stack gap="md">
          <Textarea rows={3} defaultValue={`${longText} ${longText}`} fullWidth />
          <Textarea rows={2} defaultValue={unbreakable} fullWidth />
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
      <Labeled label="rows=1 — вырожденный случай">
        <Textarea rows={1} defaultValue="Здесь нужен Input, а не Textarea" fullWidth />
      </Labeled>
      <Labeled label="только пробелы">
        <Textarea defaultValue="   " />
      </Labeled>
      <Labeled label="перевод строки в начале">
        <Textarea defaultValue={'\n\nТекст после двух пустых строк'} />
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
        'растягивание': 'только по вертикали',
      }}
    >
      <Textarea rows={3} defaultValue="Примечание к расчёту" />
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
              {(props) => <Textarea {...props} rows={4} fullWidth />}
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
