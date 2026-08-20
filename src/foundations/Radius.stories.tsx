import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';
import { Stack, Text } from '@/primitives';
import { cornerRadius } from '@/tokens';
import type { RadiusToken } from '@/tokens';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Radius',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Четыре значения, и ступень выбирается по роли объекта, а не по его размеру: `sm` — контрол, `md` — оболочка. Крупная кнопка остаётся на `sm`, маленькая карточка — на `md`.',
          'Прежние `sm` (2px) и `lg` (7px) удалены — по одному применению каждый.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PURPOSE: Record<RadiusToken, string> = {
  none: 'Только ячейки шапки: они примыкают к краям полосы',
  sm: 'Контролы: кнопка, поле, флажок, тег, подсказка',
  md: 'Оболочки: карточка, таблица, меню, модалка',
  full: 'Круглое: аватар, точка статуса, кольцо загрузки',
};

export const Playground: Story = {
  render: () => (
    <div className={styles.tokenGrid}>
      {(Object.keys(cornerRadius) as RadiusToken[]).map((token) => (
        <Fragment key={token}>
          <Text variant="label">{token}</Text>
          <div className={styles.radiusSample} style={{ ['--sample' as string]: cornerRadius[token] }} />
          <Stack gap="2xs">
            <span className={styles.mono}>{cornerRadius[token]}</span>
            <Text variant="caption" color="textMuted">
              {PURPOSE[token]}
            </Text>
          </Stack>
        </Fragment>
      ))}
    </div>
  ),
};
