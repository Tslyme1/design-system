import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';
import { Stack, Text } from '@/primitives';
import { Tag } from '@/components';
import { Labeled, DoDont } from '@spec';
import { crusher, ore, label, description, longLabel, unbreakable } from '@fixtures';
import styles from './Chip.stories.module.css';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: плашка выбранного объекта — что именно сейчас выбрано и что с этим можно сделать.',
          'Не использовать для: пользовательских меток — там `Tag`, где цвет означает выбор пользователя. Плашка показывает объект и ведёт к действию над ним.',
          'В аудите собиралась вручную из `.input` с иконкой плюс отдельной кнопки-карандаша рядом: поле ввода служило подложкой для нередактируемого текста.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: [undefined, 'placeholder', 'settings', 'folder', 'fileText'] },
    active: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: label,
    meta: description,
    icon: 'placeholder',
    action: { icon: 'placeholder', label: 'Label', onClick: () => undefined },
  },
};

/** Три формы: показать, показать выбранное, показать и дать сменить. */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="обычная">
        <Chip icon="placeholder">{label}</Chip>
      </Labeled>
      <Labeled label="активная">
        <Chip icon="placeholder" active>
          {label}
        </Chip>
      </Labeled>
      <Labeled label="с пояснением и действием">
        <Chip
          icon="placeholder"
          meta={description}
          action={{ icon: 'placeholder', label: 'Label', onClick: () => undefined }}
        >
          {label}
        </Chip>
      </Labeled>
    </Stack>
  ),
};

/** Состояния есть только у кликабельной плашки — без `onClick` она статична. */
export const States: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="статичная — не реагирует">
        <Chip icon="placeholder">{label}</Chip>
      </Labeled>
      <Labeled label="кликабельная — hover, active, focus">
        <Chip icon="placeholder" onClick={() => undefined}>
          {label}
        </Chip>
      </Labeled>
      <Labeled label="выбранная">
        <Chip icon="placeholder" onClick={() => undefined} active>
          {label}
        </Chip>
      </Labeled>
      <Text variant="caption" color="textMuted">
        У плашки с `action` два независимых фокуса: сама плашка и кнопка действия.
      </Text>
    </Stack>
  ),
};

/** Длинное обозначение: плашка не растёт бесконечно, текст обрезается. */
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Ответ на границе: обрезается подпись — иконка, пояснение и кнопка действия остаются на месте. Плашка занимает
        ширину, которую ей дала раскладка, и не раздвигает соседей длинным названием.
      </Text>

      <Labeled label="узкая панель — название уходит в многоточие">
        <div className={styles.narrowPanel}>
          <Chip
            icon="placeholder"
            meta={description}
            fullWidth
            action={{ icon: 'placeholder', label: 'Label', onClick: () => undefined }}
          >
            {longLabel}
          </Chip>
        </div>
      </Labeled>

      <Labeled label="панель уже пояснения — обрезка доходит до первых букв">
        <div className={styles.tightPanel}>
          <Chip icon="placeholder" meta={description} fullWidth>
            {longLabel}
          </Chip>
        </div>
      </Labeled>

      <Labeled label="строка без пробелов">
        <div className={styles.narrowPanel}>
          <Chip icon="placeholder" fullWidth>
            {unbreakable}
          </Chip>
        </div>
      </Labeled>

      <Text variant="bodySm" color="textMuted">
        Пояснение и кнопка действия не сжимаются: пояснение отвечает на вопрос «какой именно объект», а кнопка — это
        единственный выход к замене. Первой уступает подпись, потому что её начало обычно уже узнаваемо.
      </Text>

      <Labeled label="на всю ширину — плашка тянется, текст обрезаться не обязан">
        <Chip icon="placeholder" fullWidth>
          {label}
        </Chip>
      </Labeled>
    </Stack>
  ),
};

/**
 * Примеры использования: иконки конкретные, потому что блок показывает
 * прикладные сценарии, а не возможности компонента.
 */
export const Usage: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="2xl" align="start">
      <Stack gap="sm" align="start">
        <Text variant="label">Шаг визарда: что выбрано на этом этапе</Text>
        <Stack gap="sm" align="start">
          <Chip
            icon="settings"
            meta="Конусная, мелкого дробления"
            action={{ icon: 'pencil', label: 'Сменить дробилку', onClick: () => undefined }}
          >
            {crusher.short}
          </Chip>
          <Chip
            icon="folder"
            meta={ore}
            action={{ icon: 'pencil', label: 'Сменить пробу руды', onClick: () => undefined }}
          >
            Проба 14-Б
          </Chip>
        </Stack>
      </Stack>

      <DoDont reason="Плашка показывает выбранный объект и ведёт к действию над ним. Метка означает выбор человека и цвет в ней ничего не сообщает о том, что выбрано в расчёте.">
        <Chip icon="settings" action={{ icon: 'pencil', label: 'Сменить', onClick: () => undefined }}>
          {crusher.short}
        </Chip>
        <Tag color="steel">{crusher.short}</Tag>
      </DoDont>
    </Stack>
  ),
};
