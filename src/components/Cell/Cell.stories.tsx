import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Cell } from './Cell';
import { Badge, Button, Checkbox, Popover, Tag } from '@/components';
import { Box, Icon, Stack, Text } from '@/primitives';
import { Labeled, Matrix, Spec, DoDont } from '@spec';
import { label, description, labels, longLabel, unbreakable, longText, value } from '@fixtures';
import styles from './Cell.stories.module.css';

const meta = {
  title: 'Components/Cell',
  component: Cell,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Роль: одна строка списка — левый слот, текст, правый слот. Вариант в `Select`, пункт меню в `Popover`, строка перечня.',
          'Анатомия: leading? / label + description? / trailing?. Раскладка не настраивается: слот слева фиксирован по ширине, текст занимает остаток, правый слот прижат к краю. Настраивается только высота (`size`) и содержимое слотов.',
          'Правила: строка занимает всю ширину списка — иначе фон наведения обрывается по буквам, а подписи встают по центру панели. Левый слот фиксирован по ширине, поэтому подписи соседних строк стоят в одном столбце; строке без иконки в таком списке передаётся `leading={null}`.',
          'Не использовать для: произвольной вёрстки внутри строки — слотов ровно два. Если полей три и их сравнивают между строками сверху вниз, это `Table`. Не использовать как кнопку в форме — там `Button`: у ячейки нет ни рамки, ни веса действия.',
          'До этого компонента ряд собирался заново в каждом месте: в `Select` — своей разметкой, в меню поповера — вручную. Совпадали они приблизительно, и в одной панели оказывались строки с разным отступом до иконки и разной высотой.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['default', 'danger'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: label,
    description,
    size: 'md',
    tone: 'default',
    leading: <Icon name="placeholder" size="sm" />,
    trailing: <Icon name="chevronRight" size="sm" />,
  },
  render: (args) => (
    <div className={styles.panel}>
      <Cell {...args} />
    </div>
  ),
};

/**
 * Варианты — это не оформление строки, а её роль в списке: статичная,
 * интерактивная и разрушающая. Тон `danger` означает потерю данных,
 * а не «строка поважнее».
 */
export const Variants: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Labeled label="статичная — только показывает">
        <div className={styles.panel}>
          <Cell
            leading={<Icon name="placeholder" size="sm" />}
            trailing={
              <Text variant="bodySm" color="textMuted">
                {value}
              </Text>
            }
          >
            {label}
          </Cell>
        </div>
      </Labeled>

      <Labeled label="интерактивная — ведёт к действию">
        <div className={styles.panel}>
          <Cell leading={<Icon name="placeholder" size="sm" />} onClick={() => undefined}>
            {label}
          </Cell>
        </div>
      </Labeled>

      <Labeled label="tone=danger — разрушает данные">
        <div className={styles.panel}>
          <Cell tone="danger" leading={<Icon name="placeholder" size="sm" />} onClick={() => undefined}>
            {label}
          </Cell>
        </div>
      </Labeled>

      <Labeled label="выбранная — состояние данных, а не отклик на курсор">
        <div className={styles.panel}>
          <Cell
            selected
            leading={<Icon name="placeholder" size="sm" />}
            trailing={<Icon name="check" size="sm" color="accentText" />}
            onClick={() => undefined}
          >
            {label}
          </Cell>
        </div>
      </Labeled>
    </Stack>
  ),
};

/** Состояния есть только у интерактивной строки: без `onClick` она ничего не обещает. */
export const States: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <div className={styles.panel}>
        <Stack gap="none">
          <Labeled label="default">
            <Cell leading={<Icon name="placeholder" size="sm" />} onClick={() => undefined}>
              {label}
            </Cell>
          </Labeled>
          <Labeled label="selected">
            <Cell
              selected
              leading={<Icon name="placeholder" size="sm" />}
              trailing={<Icon name="check" size="sm" color="accentText" />}
              onClick={() => undefined}
            >
              {label}
            </Cell>
          </Labeled>
          <Labeled label="disabled">
            <Cell disabled leading={<Icon name="placeholder" size="sm" />} onClick={() => undefined}>
              {label}
            </Cell>
          </Labeled>
          <Labeled label="статичная — не реагирует ни на что">
            <Cell leading={<Icon name="placeholder" size="sm" />}>{label}</Cell>
          </Labeled>
        </Stack>
      </div>

      <Text variant="caption" color="textMuted">
        Наведение и нажатие — мышью, фокус — табом. Отключённая строка не подсвечивается: подсветка означала бы,
        что клик что-то сделает.
      </Text>
    </Stack>
  ),
};

/**
 * Сочетания. Именно здесь видно, что `danger` в отключённой строке гаснет:
 * строка, которая ничего не удалит, не имеет права кричать об удалении.
 */
export const VariantStates: Story = {
  args: { children: '' },
  render: () => (
    <Matrix
      rows={['default', 'danger'] as const}
      columns={['статичная', 'интерактивная', 'selected', 'disabled'] as const}
    >
      {(row, column) => (
        <div className={styles.narrowPanel}>
          <Cell
            size="sm"
            tone={row}
            leading={<Icon name="placeholder" size="sm" />}
            selected={column === 'selected'}
            disabled={column === 'disabled'}
            onClick={column === 'статичная' ? undefined : () => undefined}
          >
            {label}
          </Cell>
        </div>
      )}
    </Matrix>
  ),
};

/**
 * Высота берётся из шкалы контролов — той же, что у полей. Список,
 * раскрытый из поля `md`, обязан идти строками `md`, иначе панель
 * читается как чужая.
 */
export const Sizes: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Labeled key={size} label={size}>
          <div className={styles.panel}>
            <Cell
              size={size}
              leading={<Icon name="placeholder" size={size === 'lg' ? 'md' : 'sm'} />}
              trailing={<Icon name="chevronRight" size="sm" />}
            >
              {label}
            </Cell>
          </div>
        </Labeled>
      ))}
      <Text variant="caption" color="textMuted">
        sm = control.sm, md = control.md, lg = control.lg. Высота минимальная, а не фиксированная: строка
        с пояснением занимает столько, сколько нужно тексту.
      </Text>
    </Stack>
  ),
};

/** Что кладут в слоты и что бывает в тексте. */
export const Content: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <div className={styles.panel}>
        <Stack gap="none">
          <Cell>{label}</Cell>
          <Cell leading={<Icon name="placeholder" size="sm" />}>{label}</Cell>
          <Cell leading={<Icon name="placeholder" size="sm" />} description={description}>
            {label}
          </Cell>
          <Cell leading={<Checkbox checked readOnly tabIndex={-1} />}>{label}</Cell>
          <Cell leading={<Icon name="placeholder" size="sm" />} trailing={<Badge tone="success">{label}</Badge>}>
            {label}
          </Cell>
          <Cell leading={<Icon name="placeholder" size="sm" />} trailing={<Tag color="steel">{label}</Tag>}>
            {label}
          </Cell>
          <Cell
            leading={<Icon name="placeholder" size="sm" />}
            trailing={
              <Text variant="bodySm" color="textMuted">
                {value}
              </Text>
            }
          >
            {label}
          </Cell>
        </Stack>
      </div>

      <Labeled label="иконка не у всех строк — пустой слот резервируется явным null">
        <div className={styles.panel}>
          <Stack gap="none">
            <Cell leading={<Icon name="placeholder" size="sm" />}>{labels[0]}</Cell>
            <Cell leading={null}>{labels[1]}</Cell>
            <Cell leading={<Icon name="placeholder" size="sm" />}>{labels[2]}</Cell>
          </Stack>
        </div>
      </Labeled>

      <DoDont reason="Подписи в списке читаются столбцом. Строка без слота уезжает влево, и столбца больше нет — глазу приходится искать начало каждой строки заново.">
        <div className={styles.panel}>
          <Stack gap="none">
            <Cell leading={<Icon name="placeholder" size="sm" />}>{labels[0]}</Cell>
            <Cell leading={null}>{labels[1]}</Cell>
          </Stack>
        </div>
        <div className={styles.panel}>
          <Stack gap="none">
            <Cell leading={<Icon name="placeholder" size="sm" />}>{labels[0]}</Cell>
            <Cell>{labels[1]}</Cell>
          </Stack>
        </div>
      </DoDont>
    </Stack>
  ),
};

/** Ответ на границе: обрезается текст, слоты остаются на месте. */
export const Overflow: Story = {
  args: { children: '' },
  render: () => (
    <Stack gap="lg" align="start">
      <Text variant="bodySm" color="textMuted">
        Строка не растёт по содержимому и не раздвигает панель: ширину ей даёт список. Первой уступает подпись —
        её начало обычно уже узнаваемо, а слоты несут смысл целиком: иконка не обрезается наполовину, галочка
        выбора не пропадает.
      </Text>

      <Labeled label="длинная подпись и длинное пояснение">
        <div className={styles.panel}>
          <Cell
            leading={<Icon name="placeholder" size="sm" />}
            trailing={<Icon name="check" size="sm" color="accentText" />}
            description={longText}
          >
            {longLabel}
          </Cell>
        </div>
      </Labeled>

      <Labeled label="строка без пробелов">
        <div className={styles.narrowPanel}>
          <Cell leading={<Icon name="placeholder" size="sm" />}>{unbreakable}</Cell>
        </div>
      </Labeled>

      <Labeled label="узкая панель и тяжёлый правый слот">
        <div className={styles.narrowPanel}>
          <Cell leading={<Icon name="placeholder" size="sm" />} trailing={<Badge tone="warning">{label}</Badge>}>
            {longLabel}
          </Cell>
        </div>
      </Labeled>
    </Stack>
  ),
};

export const EdgeCases: Story = {
  args: { children: '' },
  render: () => {
    const [picked, setPicked] = useState<string>(labels[0]);
    return (
      <Stack gap="lg" align="start">
        <Labeled label="ни одного слота — остаётся ровно строка текста">
          <div className={styles.panel}>
            <Cell>{label}</Cell>
          </div>
        </Labeled>

        <Labeled label="оба слота пустые (null) — место зарезервировано слева">
          <div className={styles.panel}>
            <Cell leading={null} trailing={null}>
              {label}
            </Cell>
          </div>
        </Labeled>

        <Labeled label="disabled + onClick — клик не проходит, фокус не берётся">
          <div className={styles.panel}>
            <Cell disabled leading={<Icon name="placeholder" size="sm" />} onClick={() => undefined}>
              {label}
            </Cell>
          </div>
        </Labeled>

        <Labeled label="роль option: Enter и пробел выбирают строку">
          <div className={styles.panel} role="listbox" aria-label={label}>
            <Stack gap="none">
              {labels.slice(0, 3).map((item) => (
                <Cell
                  key={item}
                  role="option"
                  aria-selected={picked === item}
                  selected={picked === item}
                  onClick={() => setPicked(item)}
                  trailing={picked === item ? <Icon name="check" size="sm" color="accentText" /> : null}
                >
                  {item}
                </Cell>
              ))}
            </Stack>
          </div>
        </Labeled>

        <Text variant="bodySm" color="textMuted">
          Строка без роли рисуется кнопкой, и клавиатура достаётся ей от платформы. С ролью (`option`, `menuitem`)
          кнопка недопустима, поэтому Enter и пробел обрабатывает сама ячейка — в одном месте, а не в каждом списке.
        </Text>
      </Stack>
    );
  },
};

export const Anatomy: Story = {
  args: { children: '' },
  render: () => (
    <Spec
      slots={['leading?', 'label', 'description?', 'trailing?']}
      annotate={{
        высота: 'control.{size}, минимальная, не фиксированная',
        'padding-block': 'space.2xs (sm) / space.xs (md) / space.sm (lg)',
        'padding-inline': 'space.sm (sm, md) / space.md (lg)',
        gap: 'space.sm',
        'ширина левого слота': 'space.lg (sm, md) / space.xl (lg)',
        'gap подпись → пояснение': 'space.2xs',
        radius: 'radius.md',
        подпись: 'text.bodySm (sm) / text.body (md) / text.bodyLg (lg)',
        пояснение: 'text.caption',
        hover: 'color.surfaceSunken',
        active: 'color.accentSubtle',
        selected: 'color.accentSubtle',
        'tone=danger': 'color.dangerText, наведение — color.dangerSubtle',
      }}
    >
      <div className={styles.panel}>
        <Cell
          leading={<Icon name="placeholder" size="sm" />}
          trailing={<Icon name="check" size="sm" color="accentText" />}
          description={description}
          onClick={() => undefined}
        >
          {label}
        </Cell>
      </div>
    </Spec>
  ),
};

/**
 * Примеры использования: иконки конкретные, потому что блок показывает
 * прикладные сценарии, а не возможности компонента.
 */
export const Usage: Story = {
  args: { children: '' },
  render: () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
      <Stack gap="2xl" align="start">
        <Stack gap="sm" align="start">
          <Text variant="label">Меню действий в поповере</Text>
          <Popover
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            width="md"
            trigger={
              <Button variant="secondary" iconEnd="moreHorizontal" onClick={() => setMenuOpen((v) => !v)}>
                Действия над проектом
              </Button>
            }
          >
            <Stack gap="none">
              <Cell size="sm" leading={<Icon name="fileText" size="sm" />} onClick={() => setMenuOpen(false)}>
                Открыть проект
              </Cell>
              <Cell size="sm" leading={<Icon name="print" size="sm" />} onClick={() => setMenuOpen(false)}>
                Печать: геометрия
              </Cell>
              <Cell size="sm" leading={<Icon name="print" size="sm" />} onClick={() => setMenuOpen(false)}>
                Печать: грансостав
              </Cell>
              <Cell size="sm" leading={<Icon name="print" size="sm" />} onClick={() => setMenuOpen(false)}>
                Печать: продукт
              </Cell>
              <Cell
                size="sm"
                tone="danger"
                leading={<Icon name="trash" size="sm" />}
                onClick={() => setMenuOpen(false)}
              >
                Удалить в корзину
              </Cell>
            </Stack>
          </Popover>
          <Text variant="bodySm" color="textMuted">
            Пункты одного меню — одна ячейка с одной раскладкой. Ровно этого не хватало, когда меню собиралось
            вручную: подписи вставали по центру панели, а отступ до иконки у каждой строки был свой.
          </Text>
        </Stack>

        <Stack gap="sm" align="start">
          <Text variant="label">Сводка выбранного</Text>
          <Box padding="sm" border>
            <div className={styles.panel}>
              <Stack gap="none">
                <Cell
                  leading={<Icon name="settings" size="sm" />}
                  trailing={
                    <Text variant="bodySm" color="textMuted">
                      КМД-1750Т7-Д
                    </Text>
                  }
                >
                  Дробилка
                </Cell>
                <Cell
                  leading={<Icon name="folder" size="sm" />}
                  trailing={
                    <Text variant="bodySm" color="textMuted">
                      Проба 14-Б
                    </Text>
                  }
                >
                  Руда
                </Cell>
                <Cell leading={<Icon name="clock" size="sm" />} trailing={<Badge tone="success">Согласовано</Badge>}>
                  Статус
                </Cell>
              </Stack>
            </div>
          </Box>
        </Stack>

        <DoDont reason="Красный в системе означает потерю данных. Если им покрасить обычное действие, сигнал обесценивается — и настоящее удаление перестают замечать.">
          <div className={styles.panel}>
            <Cell tone="danger" leading={<Icon name="trash" size="sm" />} onClick={() => undefined}>
              Удалить в корзину
            </Cell>
          </div>
          <div className={styles.panel}>
            <Cell tone="danger" leading={<Icon name="download" size="sm" />} onClick={() => undefined}>
              Скачать отчёт
            </Cell>
          </div>
        </DoDont>

        <Stack gap="sm" align="start">
          <Text variant="label">Соседняя роль</Text>
          <Text variant="bodySm" color="textMuted">
            Три поля в строке, которые сравнивают между собой сверху вниз, — это `Table`, а не ячейка. Отдельное
            действие в форме — `Button`: у него есть рамка и вес, а ячейка их намеренно не имеет.
          </Text>
        </Stack>
      </Stack>
    );
  },
};
