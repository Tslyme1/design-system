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
          'Три значения. `none` здесь — полноценная роль, а не отсутствие скругления: система рисует карточки и фигуры как чертёжные объекты с прямыми углами.',
          'Прежние `sm` (2px) и `lg` (7px) удалены — по одному применению каждый.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PURPOSE: Record<RadiusToken, string> = {
  none: 'Карточки, панели, ячейки шапки — чертёжный объект',
  md: 'Контролы: кнопка, поле, меню',
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
