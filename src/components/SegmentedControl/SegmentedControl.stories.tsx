import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Select, RadioGroup, Radio } from '@/components';
import { Stack, Text, Box, Field } from '@/primitives';
import type { IconName } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { longWord } from '@fixtures';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: переключение между двумя-тремя взаимоисключающими режимами, видимыми сразу.',
          'Анатомия: group / segment × N, внутри сегмента icon? + label. Разделяются хайрлайном, а не отступом: расстояние означало бы отдельные кнопки.',
          'Правила: один сегмент выбран всегда, снять выбор нельзя. Подписи — одно слово, иначе сегменты разъедутся по ширине. Под капотом радиокнопки, поэтому стрелки переключают выбор.',
          'Не использовать для: четырёх и более вариантов — там `Select`. Не использовать как фильтр, который можно сбросить.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Подписи сегментов в демонстрационных блоках нейтральны: система не
 * назначает сегментам смысл, его выбирает экран. Настоящие режимы —
 * в блоке `Usage`.
 */
const MODES = [
  { value: 'a', label: 'Label 1' },
  { value: 'b', label: 'Label 2' },
];

/** Настоящие режимы приложения — только для блока `Usage`. */
const USAGE_MODES = [
  { value: 'engineer', label: 'Инженерный' },
  { value: 'simple', label: 'Упрощённый' },
];

/** Обёртка с состоянием: у переключателя без состояния нечего показывать. */
function Live({
  options = MODES,
  ...rest
}: {
  options?: { value: string; label: string; icon?: IconName; disabled?: boolean }[];
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  legend?: string;
}) {
  const [value, setValue] = useState(options[0].value);
  return <SegmentedControl legend="Label" {...rest} options={options} value={value} onChange={setValue} />;
}

export const Playground: Story = {
  args: { legend: 'Label', options: MODES, value: 'a', onChange: () => undefined },
  render: (args) => <Live size={args.size} fullWidth={args.fullWidth} />,
};

export const States: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="выбран первый">
        <Live />
      </Labeled>
      <Labeled label="сегмент disabled">
        <Live
          options={[
            { value: 'a', label: 'Label 1' },
            { value: 'b', label: 'Label 2' },
            { value: 'c', label: 'Label 3', disabled: true },
          ]}
        />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Наведи мышью и пройди табом: фокус входит в группу один раз, дальше выбор переключают стрелки. У выбранного
        сегмента не должно быть тени — только заливка, рамка принадлежит группе.
      </Text>
    </Stack>
  ),
};

export const Sizes: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Labeled key={size} label={size}>
          <Live size={size} />
        </Labeled>
      ))}
      <Text variant="caption" color="textMuted">
        Проверь согласованность: вместе с высотой обязаны меняться внутренний отступ и кегль. Рассинхрон видно только
        здесь.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="два сегмента">
        <Live />
      </Labeled>
      <Labeled label="три сегмента">
        <Live
          options={[
            { value: 'a', label: 'Label 1' },
            { value: 'b', label: 'Label 2' },
            { value: 'c', label: 'Label 3' },
          ]}
        />
      </Labeled>
      <Labeled label="с иконками">
        <Live
          options={[
            { value: 'a', label: 'Label 1', icon: 'placeholder' },
            { value: 'b', label: 'Label 2', icon: 'placeholder' },
          ]}
        />
      </Labeled>
      <Labeled label="fullWidth">
        <Box border padding="md" fullWidth>
          <Live fullWidth />
        </Box>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: подпись обрезается многоточием, сегмент не переносится и не растёт вверх. Если подписи
        перестали читаться — вариантов слишком много и нужен `Select`, а не более узкий шрифт.
      </Text>
      <Live
        options={[
          { value: 'a', label: 'Label, который в сегмент не помещается' },
          { value: 'b', label: longWord },
        ]}
      />
      <Live
        options={[
          { value: 'a', label: 'Label 1' },
          { value: 'b', label: 'Label 2' },
          { value: 'c', label: 'Label 3' },
        ]}
      />
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="один сегмент — вырожденный случай">
        <Live options={[{ value: 'only', label: 'Label' }]} />
      </Labeled>
      <Labeled label="все сегменты disabled">
        <Live
          options={[
            { value: 'a', label: 'Label 1', disabled: true },
            { value: 'b', label: 'Label 2', disabled: true },
          ]}
        />
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        Один сегмент — это не выбор, а подпись: переключать нечего. Полностью отключённая группа не сообщает причину;
        рядом обязано быть объяснение, иначе она читается как поломка.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Spec
      slots={['legend (скрыт визуально)', 'segment × N', 'icon?', 'label']}
      annotate={{
        'высота сегмента': 'control.{size}',
        'padding-inline': 'space.md / space.lg / space.xl',
        gap: 'space.2xs',
        radius: 'radius.md (у группы)',
        'разделитель': 'hairline / color.border',
        'фон группы': 'color.surfaceSunken',
        'фон выбранного': 'color.surface',
      }}
    >
      <Live />
    </Spec>
  ),
};

export const Usage: Story = {
  args: { legend: '', options: MODES, value: 'a', onChange: () => undefined },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">В форме — с подписью от Field</Text>
        <Field label="Режим расчёта" hint="Инженерный показывает промежуточные величины">
          {() => <Live options={USAGE_MODES} />}
        </Field>
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">Режим расчёта с иконками — как в приложении</Text>
        <Live
          options={[
            { value: 'engineer', label: 'Инженерный', icon: 'settings' },
            { value: 'simple', label: 'Упрощённый', icon: 'check' },
          ]}
        />
        <Text variant="caption" color="textMuted">
          Иконка здесь конкретная: в блоках выше на её месте стоит заглушка, чтобы вариант не читался как
          рекомендация «режим — обязательно шестерёнка».
        </Text>
      </Stack>

      <DoDont reason="Четыре и больше вариантов не помещаются: подписи обрезаются, и выбор перестаёт читаться. Список прячет варианты за клик, но зато показывает их целиком.">
        <Live
          options={[
            { value: 'a', label: 'Сутки' },
            { value: 'b', label: 'Неделя' },
            { value: 'c', label: 'Месяц' },
          ]}
        />
        <Select
          options={[
            { value: 'a', label: 'Сутки' },
            { value: 'b', label: 'Неделя' },
            { value: 'c', label: 'Месяц' },
            { value: 'd', label: 'Квартал' },
            { value: 'e', label: 'Год' },
          ]}
          value="a"
          onChange={() => undefined}
        />
      </DoDont>

      <DoDont reason="Сегменты показывают режим, между которыми переключаются часто и сразу видят результат. Для выбора значения в форме, который сохраняется вместе с ней, привычнее радиокнопки.">
        <Live options={USAGE_MODES} />
        <RadioGroup name="usage-units" legend="Единицы измерения">
          <Radio label="Миллиметры" value="mm" defaultChecked />
          <Radio label="Сантиметры" value="cm" />
        </RadioGroup>
      </DoDont>
    </Stack>
  ),
};
