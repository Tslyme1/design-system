import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';
import { Checkbox } from '@/components';
import { Stack, Text, Box } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { longText, unbreakable, label, description, labels, longLabel } from '@fixtures';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: включить или выключить то, что применяется сразу.',
          'Анатомия: track + thumb / label? / description?. Подпись необязательна типами, но обязательна по смыслу: переключатель без подписи не сообщает, что он переключает.',
          'Правила: подпись формулируется как состояние («Автосохранение»), а не как действие («Включить автосохранение») — иначе непонятно, что означает выключенное положение.',
          'Не использовать для: значений, которые сохраняются по кнопке «Сохранить» — там `Checkbox`. Переключатель обещает немедленный эффект.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label, description },
};

/** Состояния базового варианта. Наведение и фокус — мышью и табом. */
export const States: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <Labeled label="выключен">
        <Switch label={label} />
      </Labeled>
      <Labeled label="включён">
        <Switch label={label} defaultChecked />
      </Labeled>
      <Labeled label="disabled">
        <Switch label={label} disabled />
      </Labeled>
      <Labeled label="disabled + включён">
        <Switch label={label} disabled defaultChecked />
      </Labeled>
      <Text variant="caption" color="textMuted">
        Проверь ход бегунка: во включённом положении он обязан стоять у правого края дорожки, а не посередине.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="только подпись">
        <Switch label={label} />
      </Labeled>
      <Labeled label="подпись + пояснение">
        <Switch label={label} description={description} />
      </Labeled>
      <Labeled label="без подписи — так делать нельзя">
        <Switch />
      </Labeled>
      <Labeled label="группа">
        <Stack gap="md">
          {labels.slice(0, 3).map((item, index) => (
            <Switch key={item} label={item} defaultChecked={index === 0} />
          ))}
        </Stack>
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: текст переносится, дорожка остаётся на месте и не сжимается. Переключатель не должен
        уезжать от своей подписи.
      </Text>
      <Box padding="md" border>
        <Stack gap="md">
          <Switch label={longLabel} description={longText} />
          <Switch label={unbreakable} />
        </Stack>
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <Stack gap="lg" align="start">
        <Labeled label="управляемый: состояние снаружи">
          <Switch label={on ? 'Включено' : 'Выключено'} checked={on} onChange={(event) => setOn(event.target.checked)} />
        </Labeled>
        <Labeled label="пустая подпись">
          <Switch label="" />
        </Labeled>
        <Labeled label="пояснение без подписи">
          <Switch description={description} />
        </Labeled>
        <Text variant="bodySm" color="textMuted">
          При увеличении системного шрифта до 200% дорожка не должна наезжать на текст: её размер задан токенами
          контрола, а не em.
        </Text>
      </Stack>
    );
  },
};

export const Anatomy: Story = {
  render: () => (
    <Spec
      slots={['input (невидимый, поверх дорожки)', 'track', 'thumb', 'label?', 'description?']}
      annotate={{
        'ширина дорожки': 'control.md',
        'высота дорожки': 'space.xl',
        'размер бегунка': 'space.lg',
        'внутренний отступ': 'space.2xs',
        'gap до подписи': 'space.sm',
        'ход бегунка': 'control.md − space.lg − space.xs − 2×hairline',
        подпись: 'text.body',
        пояснение: 'text.caption',
      }}
    >
      <Switch label={label} description={description} defaultChecked />
    </Spec>
  ),
};

export const Usage: Story = {
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">В настройках</Text>
        <Box padding="lg" border>
          <Stack gap="md">
            <Switch label="Автосохранение" description="Изменения применяются сразу" defaultChecked />
            <Switch label="Показывать сетку на диаграмме" />
            <Switch label="Единицы в СИ" defaultChecked />
          </Stack>
        </Box>
      </Stack>

      <DoDont reason="Переключатель обещает немедленный эффект. Если значение применяется только по кнопке «Сохранить», человек уйдёт со страницы, считая, что уже всё включил.">
        <Stack gap="sm">
          <Switch label="Автосохранение" defaultChecked />
          <Text variant="caption" color="textMuted">
            применяется сразу
          </Text>
        </Stack>
        <Stack gap="sm">
          <Switch label="Учитывать влажность" />
          <Text variant="caption" color="textMuted">
            применится по «Сохранить» — здесь нужен Checkbox
          </Text>
        </Stack>
      </DoDont>

      <DoDont reason="Подпись-действие не сообщает текущее состояние: непонятно, «Включить» — это то, что сейчас, или то, что произойдёт.">
        <Switch label="Автосохранение" defaultChecked />
        <Switch label="Включить автосохранение" defaultChecked />
      </DoDont>

      <Stack gap="sm" align="start">
        <Text variant="label">Соседняя роль</Text>
        <Checkbox label="Учитывать влажность питания" />
        <Text variant="bodySm" color="textMuted">
          Не использовать для: выбора из двух вариантов — там `SegmentedControl`. Для значения, сохраняемого формой,
          — `Checkbox`.
        </Text>
      </Stack>
    </Stack>
  ),
};
