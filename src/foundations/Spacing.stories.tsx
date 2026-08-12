import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { Stack, Text, Box } from '@/primitives';
import { spacing } from '@/tokens';
import type { SpaceToken } from '@/tokens';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Сетка 4px, восемь ступеней. Единственный способ поставить расстояние — `<Stack gap>` или `<Box padding>`.',
          'Прежняя шкала (4px × 0.85 → 3.4 / 6.8 / 10.2…) отменена: четыре самых частотных значения не имели токена вообще, поэтому шкалу обходили — 475 сырых чисел против 42 обращений к токену.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PURPOSE: Record<SpaceToken, string> = {
  none: 'Явный ноль: сброс отступа там, где он ожидается',
  '2xs': 'Между иконкой и подписью внутри одного элемента',
  xs: 'Внутри плотного контрола',
  sm: 'Между соседними контролами в ряду',
  md: 'Внутренний отступ поля, между полями формы',
  lg: 'Внутренний отступ карточки, между блоками внутри секции',
  xl: 'Между секциями',
  '2xl': 'Между крупными частями экрана',
};

export const Playground: Story = {
  render: () => (
    <div className={styles.tokenGrid}>
      {(Object.keys(spacing) as SpaceToken[]).map((token) => (
        <Fragment key={token}>
          <Text variant="label">{token}</Text>
          {/* Ширина полосы равна самому отступу — шкала показывает себя. */}
          <div className={styles.spaceBar} style={{ ['--sample' as string]: spacing[token] }} />
          <Stack gap="2xs">
            <span className={styles.mono}>{spacing[token]}</span>
            <Text variant="caption" color="textMuted">
              {PURPOSE[token]}
            </Text>
          </Stack>
        </Fragment>
      ))}
    </div>
  ),
};

/**
 * Плотность важнее абсолютных значений: внутри группы теснее, чем между
 * группами. Именно это правило делает раскладку читаемой, а не выбор ступени.
 */
export const Rhythm: Story = {
  render: () => (
    <Stack direction="row" gap="2xl" align="start" wrap>
      <Box padding="lg" border>
        <Stack gap="lg">
          <Text variant="label">Верно</Text>
          <Stack gap="xs">
            <Text variant="caption" color="textMuted">
              Заказчик
            </Text>
            <Text variant="body">ММК</Text>
          </Stack>
          <Stack gap="xs">
            <Text variant="caption" color="textMuted">
              Дата расчёта
            </Text>
            <Text variant="body">12.08.2026</Text>
          </Stack>
        </Stack>
      </Box>

      <Box padding="lg" border>
        <Stack gap="sm">
          <Text variant="label">Неверно</Text>
          <Stack gap="sm">
            <Text variant="caption" color="textMuted">
              Заказчик
            </Text>
            <Text variant="body">ММК</Text>
          </Stack>
          <Stack gap="sm">
            <Text variant="caption" color="textMuted">
              Дата расчёта
            </Text>
            <Text variant="body">12.08.2026</Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  ),
};
