import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper } from './Stepper';
import { Button } from '@/components';
import { Stack, Text, Box, Surface } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { labelSteps, wizardSteps, longWord } from '@fixtures';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: где человек находится в последовательности и сколько осталось.',
          'Анатомия: step × N, внутри marker (номер или галка) + label + description?. Между шагами — соединительная линия, она рисуется псевдоэлементом и не попадает в порядок чтения.',
          'Правила: пройденный шаг помечается галкой, а не номером — номер не отличает «шаг 2» от «шаг 2 пройден». Текущий шаг несёт `aria-current="step"`. Названия шагов — существительные.',
          'Не использовать для: навигации по разделам без порядка — степпер обещает последовательность.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['row', 'column'] },
    current: { control: { type: 'number', min: 0, max: 2 } },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { steps: labelSteps, current: 1, direction: 'row' },
};

export const Variants: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Stack gap="2xl" align="start">
      <Labeled label="row">
        <Box fullWidth>
          <Stepper steps={labelSteps} current={1} />
        </Box>
      </Labeled>
      <Labeled label="column">
        <Stepper steps={labelSteps} current={1} direction="column" />
      </Labeled>
    </Stack>
  ),
};

export const States: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="в начале — ничего не пройдено">
        <Stepper steps={labelSteps} current={0} direction="column" />
      </Labeled>
      <Labeled label="в середине — первый с галкой">
        <Stepper steps={labelSteps} current={1} direction="column" />
      </Labeled>
      <Labeled label="в конце — все пройдены">
        <Stepper steps={labelSteps} current={3} direction="column" />
      </Labeled>
      <Labeled label="шаг недоступен">
        <Stepper
          steps={[labelSteps[0], labelSteps[1], { ...labelSteps[2], disabled: true }]}
          current={1}
          direction="column"
          onStepClick={() => undefined}
        />
      </Labeled>
      <Text variant="caption" color="textMuted">
        hover и focus-visible появляются только при `onStepClick`. Без него шаги — индикатор, и курсор не меняется.
      </Text>
    </Stack>
  ),
};

/** Матрица: направление × положение. Здесь видно, что линия ведёт себя одинаково. */
export const VariantStates: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Stack gap="2xl" align="start">
      {(['row', 'column'] as const).map((direction) => (
        <Stack key={direction} gap="lg" align="start">
          <Text variant="label">{direction}</Text>
          <Stack direction={direction === 'row' ? 'column' : 'row'} gap="xl" align="start">
            {[0, 1, 3].map((current) => (
              <Labeled key={current} label={`current=${current}`}>
                <Box fullWidth={direction === 'row'}>
                  <Stepper steps={labelSteps} current={current} direction={direction} />
                </Box>
              </Labeled>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Content: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="два шага">
        <Stepper steps={[labelSteps[0], labelSteps[1]]} current={1} />
      </Labeled>
      <Labeled label="три шага с пояснениями">
        <Stepper steps={labelSteps} current={1} />
      </Labeled>
      <Labeled label="без пояснений">
        <Stepper steps={labelSteps.map(({ label }) => ({ label }))} current={1} />
      </Labeled>
      <Labeled label="шесть шагов">
        <Stepper
          steps={[...labelSteps, { label: 'Label 4' }, { label: 'Label 5' }, { label: 'Label 6' }].map(({ label }) => ({
            label,
          }))}
          current={2}
        />
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Stack gap="xl" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: название и пояснение обрезаются многоточием, каждое в одну строку, кружок остаётся на
        месте. В `row` первой сжимается соединительная линия — но не в ноль: короткая линия ещё читается как связь
        между шагами, а её отсутствие уже нет. Дальше уступает текст.
      </Text>
      <Box border padding="md" fullWidth>
        <Stepper
          steps={[
            { label: 'Label, который в шаг не помещается и обязан обрезаться', description: 'Description' },
            { label: longWord },
            { label: 'Label 3', description: 'Description, которое длиннее собственного названия шага' },
          ]}
          current={1}
        />
      </Box>
      <Box border padding="md">
        <Stepper steps={labelSteps} current={1} direction="column" />
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Stack gap="xl" align="start">
      <Labeled label="один шаг — последовательности нет">
        <Stepper steps={[labelSteps[0]]} current={0} />
      </Labeled>
      <Labeled label="current больше числа шагов">
        <Stepper steps={labelSteps} current={99} direction="column" />
      </Labeled>
      <Labeled label="current отрицательный">
        <Stepper steps={labelSteps} current={-1} direction="column" />
      </Labeled>
      <Labeled label="пустой список">
        <Box border padding="md">
          <Stepper steps={[]} current={0} />
        </Box>
      </Labeled>
      <Text variant="bodySm" color="textMuted">
        При `current` вне диапазона компонент не падает: все шаги считаются пройденными либо ни одного. Но это
        означает ошибку в вызывающем коде — визард не может стоять на несуществующем шаге.
      </Text>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { steps: labelSteps, current: 1 },
  render: () => (
    <Spec
      slots={['step × N', 'marker (номер | галка)', 'label', 'description?', 'connector (псевдоэлемент)']}
      annotate={{
        'размер маркера': 'control.sm',
        'gap маркер → текст': 'space.sm',
        'gap между шагами': 'space.md',
        'обводка текущего': 'border.strong / color.accent',
        'заливка пройденного': 'color.accent',
        линия: 'hairline / color.border',
        подпись: 'text.body',
        пояснение: 'text.caption',
      }}
    >
      <Stepper steps={labelSteps} current={1} />
    </Spec>
  ),
};

/**
 * Примеры использования: настоящий визард. Названия шагов здесь предметные —
 * в блоках выше на их месте стоят «Label», потому что там показана форма
 * компонента, а не последовательность конкретного экрана.
 */
export const Usage: Story = {
  args: { steps: wizardSteps, current: 1 },
  render: () => {
    const [step, setStep] = useState(1);
    return (
      <Stack gap="2xl" align="start">
        <Stack gap="lg" align="start">
          <Text variant="label">В визарде расчёта</Text>
          <Surface level="flat" border padding="lg" fullWidth>
            <Stack gap="xl">
              <Stepper steps={wizardSteps} current={step} onStepClick={setStep} />
              <Text variant="body">Шаг {step + 1}: {wizardSteps[step]?.label}</Text>
              <Stack direction="row" gap="sm">
                <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  Назад
                </Button>
                <Button variant="primary" onClick={() => setStep((s) => Math.min(wizardSteps.length - 1, s + 1))}>
                  Далее
                </Button>
              </Stack>
            </Stack>
          </Surface>
        </Stack>

        <DoDont reason="Существительное называет содержимое шага и одинаково читается в пройденном и будущем состоянии. Глагол в повелительном наклонении рядом с галкой звучит как невыполненная команда.">
          <Stepper steps={[{ label: 'Дробилка' }, { label: 'Руда' }]} current={1} />
          <Stepper steps={[{ label: 'Выберите дробилку' }, { label: 'Укажите руду' }]} current={1} />
        </DoDont>

        <Text variant="bodySm" color="textMuted">
          Не использовать для: разделов без порядка — там вкладки или меню. Не делать шаги кликабельными без
          `onStepClick`: кликабельность, которая ничего не делает, обманывает.
        </Text>
      </Stack>
    );
  },
};
