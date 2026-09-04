import type { ReactNode } from 'react';
import { Icon, Surface, Stack, Text } from '../../primitives';
import type { IconName } from '../../primitives';
import styles from './Toast.module.css';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger';

/** Иконка роли — тот же приём, что у `badgeToneIcons`: иконка повторяет смысл цвета, не украшает. */
const TOAST_TONE_ICON: Record<ToastTone, IconName> = {
  neutral: 'info',
  success: 'check',
  warning: 'alertTriangle',
  danger: 'alertTriangle',
};

const TOAST_TONE_COLOR = {
  neutral: 'textMuted',
  success: 'successText',
  warning: 'warningText',
  danger: 'dangerText',
} as const;

export type ToastProps = {
  /** Есть ли сейчас сообщение. Без сообщения — `null`, тост не рисуется вовсе. */
  message: ReactNode | null;
  /**
   * Роль сообщения — тот же смысл цвета, что у `Badge`. По умолчанию
   * `success`: почти все сообщения этого рода — подтверждение свершившегося
   * действия («Проект создан», «Сохранено»).
   */
  tone?: ToastTone;
};

/**
 * Мимолётное подтверждение действия внизу экрана.
 *
 * Не управляет собственным временем жизни: когда убрать сообщение — знает
 * вызывающий код (обычно таймер в паре с состоянием), а не сам тост. Без
 * кнопки закрытия и без интерактивных элементов внутри — тост читают,
 * не отвечают на него; действие, которое можно отменить, — не тост,
 * а `Modal` с двумя кнопками.
 */
export function Toast({ message, tone = 'success' }: ToastProps) {
  if (!message) return null;

  return (
    <div className={styles.host}>
      <Surface level="overlay" radius="md" padding="md" background="surface">
        <Stack direction="row" gap="sm" align="center">
          <Icon name={TOAST_TONE_ICON[tone]} size="sm" color={TOAST_TONE_COLOR[tone]} />
          <Text variant="body">{message}</Text>
        </Stack>
      </Surface>
    </div>
  );
}
