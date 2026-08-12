import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stack, Text } from '@/primitives';
import { motionDuration, motionEasing } from '@/tokens';
import styles from './Foundations.module.css';

const meta: Meta = {
  title: 'Foundations/Motion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Три длительности и одно ускорение. Больше не нужно: разные кривые в одном интерфейсе читаются как разные системы.',
          'Движение подсказывает связь причины и следствия — откуда взялась панель, куда делось меню. Движение ради движения запрещено.',
        ].join('\n\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PURPOSE: Record<keyof typeof motionDuration, string> = {
  fast: 'Отклик контрола: наведение, нажатие, смена цвета',
  base: 'Появление меню и поповера',
  slow: 'Крупные перемещения: выдвижная панель, модалка',
};

/** Кликабельно: длительность нельзя оценить по числу, её надо увидеть. */
export const Playground: Story = {
  render: () => {
    const [moved, setMoved] = useState(false);

    return (
      <Stack gap="xl">
        <Text variant="bodySm" color="textMuted">
          Нажми на дорожку — квадраты уедут и вернутся. Разница между 120 и 280 мс заметна только в движении.
        </Text>

        {(Object.keys(motionDuration) as (keyof typeof motionDuration)[]).map((token) => (
          <Stack key={token} gap="2xs">
            <Stack direction="row" gap="sm" align="baseline">
              <Text variant="label">{token}</Text>
              <span className={styles.mono}>{motionDuration[token]}</span>
              <Text variant="caption" color="textMuted">
                {PURPOSE[token]}
              </Text>
            </Stack>
            <div
              className={styles.motionTrack}
              onClick={() => setMoved((v) => !v)}
              role="presentation"
            >
              <div
                className={[styles.motionBox, moved ? styles.motionBoxMoved : null].filter(Boolean).join(' ')}
                style={{ ['--sample' as string]: motionDuration[token] }}
              />
            </div>
          </Stack>
        ))}

        <Stack gap="2xs">
          <Text variant="label">Ускорение</Text>
          <span className={styles.mono}>{motionEasing.standard}</span>
          <Text variant="caption" color="textMuted">
            Одно на весь проект: быстрый старт, мягкая остановка.
          </Text>
        </Stack>
      </Stack>
    );
  },
};
