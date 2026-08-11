import type { ReactNode } from 'react';
import { Surface, Stack, Text } from '@/primitives';
import styles from './Card.module.css';

export type CardProps = {
  children?: ReactNode;
  /** Надзаголовок: тип объекта, категория. */
  kicker?: string;
  title?: string;
  /** Слот действий в правом верхнем углу. */
  actions?: ReactNode;
  /**
   * Чертёжные метки по углам — визуальный язык Industry.
   * Снимать их у обрамлённого объекта нельзя: рамка без меток читается
   * как незаконченная.
   */
  blueprint?: boolean;
  onClick?: () => void;
};

/**
 * Карточка — прозрачный контурный объект, а не залитый блок.
 *
 * Скруглять карточки нельзя: система рисует их как чертёжные объекты
 * с прямыми углами.
 *
 * Содержимое свободно: карточка ничего не знает о том, что внутри.
 */
export function Card({ children, kicker, title, actions, blueprint = false, onClick }: CardProps) {
  const hasHeader = Boolean(kicker || title || actions);

  return (
    <Surface
      level="flat"
      border
      radius="none"
      padding="lg"
      background="surface"
      interactive={Boolean(onClick)}
      as={onClick ? 'button' : 'div'}
      fullWidth
    >
      <div className={blueprint ? styles.blueprint : undefined}>
        {blueprint ? (
          <>
            <i className={[styles.corner, styles.tl].join(' ')} aria-hidden="true" />
            <i className={[styles.corner, styles.tr].join(' ')} aria-hidden="true" />
            <i className={[styles.corner, styles.bl].join(' ')} aria-hidden="true" />
            <i className={[styles.corner, styles.br].join(' ')} aria-hidden="true" />
          </>
        ) : null}

        <Stack gap="sm">
          {hasHeader ? (
            <Stack direction="row" gap="md" align="start" justify="between">
              <Stack gap="2xs">
                {kicker ? (
                  <Text variant="caption" color="textMuted">
                    {kicker}
                  </Text>
                ) : null}
                {title ? <Text variant="headingSm">{title}</Text> : null}
              </Stack>
              {actions ? <div className={styles.actions}>{actions}</div> : null}
            </Stack>
          ) : null}

          {children}
        </Stack>
      </div>
    </Surface>
  );
}
