import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tab } from './Tab';
import { SegmentedControl } from '@/components';
import { Stack, Text, Box, Surface } from '@/primitives';
import { Labeled, Spec, DoDont } from '@spec';
import { longWord } from '@fixtures';

const meta = {
  title: 'Components/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Роль: переход между разделами страницы или панели, которая остаётся на месте целиком — оглавление, а не переключатель видимых панелей.',
          'Анатомия: подпись плюс полоса снизу у активного пункта. Обычная кнопка с `aria-current`, не `role="tab"` из паттерна ARIA tabs — тот привязан к скрытию всех панелей, кроме одной, чего здесь нет.',
          'Не использовать для: взаимоисключающего контрола формы — там `SegmentedControl`. Не использовать в шапке сервиса — там `HeaderTab` на шкале `chrome`.',
        ].join('\n\n'),
      },
    },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Обёртка с состоянием: набор пунктов навигации живьём. */
function Live({ labels = ['Продукт', 'Этап 1', 'Этап 2'] }: { labels?: string[] }) {
  const [active, setActive] = useState(labels[0]);
  return (
    <Stack direction="row" gap="none">
      {labels.map((label) => (
        <Tab key={label} active={active === label} onClick={() => setActive(label)}>
          {label}
        </Tab>
      ))}
    </Stack>
  );
}

export const Playground: Story = {
  args: { children: 'Продукт', active: true },
};

export const States: Story = {
  args: { children: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="обычный">
        <Tab onClick={() => undefined}>Label</Tab>
      </Labeled>
      <Labeled label="активный">
        <Tab active onClick={() => undefined}>
          Label
        </Tab>
      </Labeled>
      <Labeled label="disabled">
        <Tab disabled onClick={() => undefined}>
          Label
        </Tab>
      </Labeled>
      <Text variant="caption" color="textMuted">
        Наведи мышью и пройди табом: полоса снизу должна плавно проявляться только у активного пункта, фокусное
        кольцо — у любого, disabled — не кликается и не фокусируется мышью.
      </Text>
    </Stack>
  ),
};

export const Content: Story = {
  args: { children: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="два пункта">
        <Live labels={['Продукт', 'Этап 1']} />
      </Labeled>
      <Labeled label="четыре пункта">
        <Live labels={['Продукт', 'Этап 1', 'Этап 2', 'Этап 3']} />
      </Labeled>
      <Labeled label="один пункт">
        <Live labels={['Продукт']} />
      </Labeled>
    </Stack>
  ),
};

export const Overflow: Story = {
  args: { children: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Подпись не переносится по словам — обрезается многоточием в одну строку, полоса снизу остаётся на месте.
        Строка пунктов не сжимается сама: если она не помещается по ширине, прокрутку или перенос задаёт вызывающий
        экран (тот же приём, что у вкладок в шапке сервиса), а не сам `Tab`.
      </Text>
      <Box border padding="md" fullWidth>
        <Stack direction="row" gap="none" wrap>
          <Tab active onClick={() => undefined}>
            Label, который в пункт не помещается и обязан обрезаться
          </Tab>
          <Tab onClick={() => undefined}>{longWord}</Tab>
        </Stack>
      </Box>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { children: 'Label' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="ни один пункт не активен">
        <Stack direction="row" gap="none">
          <Tab onClick={() => undefined}>Label 1</Tab>
          <Tab onClick={() => undefined}>Label 2</Tab>
        </Stack>
      </Labeled>
      <Labeled label="без onClick — не кнопка действия, просто подпись">
        <Tab active>Label</Tab>
      </Labeled>
    </Stack>
  ),
};

export const Anatomy: Story = {
  args: { children: 'Label' },
  render: () => (
    <Spec
      slots={['label', 'полоса снизу (только у активного)']}
      annotate={{
        'padding-block': 'space.sm',
        'padding-inline': 'space.md',
        'толщина полосы': 'border.strong',
        'цвет полосы (активный)': 'color.accent',
        'цвет подписи (обычный)': 'color.textMuted',
        'цвет подписи (активный/наведён)': 'color.text',
      }}
    >
      <Tab active>Label</Tab>
    </Spec>
  ),
};

export const Usage: Story = {
  args: { children: 'Label' },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">Оглавление отчёта в шторке результата</Text>
        <Surface level="flat" border padding="lg" fullWidth>
          <Stack gap="lg">
            <Live />
            <Text variant="bodySm" color="textMuted">
              Клик по пункту прокручивает к разделу; при прокрутке мимо раздела активным становится пункт над ним —
              оба пути ведут к одному и тому же активному состоянию.
            </Text>
          </Stack>
        </Surface>
      </Stack>

      <DoDont reason="Здесь ровно один раздел выбран как «текущий» — оглавление содержимого, которое всё равно целиком на экране, а не значение формы. SegmentedControl обещает одно взаимоисключающее значение, которое сохраняется вместе с формой, а не место прокрутки на странице.">
        <Live labels={['Продукт', 'Этап 1']} />
        <SegmentedControl
          legend="Раздел"
          options={[
            { value: 'product', label: 'Продукт' },
            { value: 'stage1', label: 'Этап 1' },
          ]}
          value="product"
          onChange={() => undefined}
        />
      </DoDont>
    </Stack>
  ),
};
