import type { ReactNode } from 'react';
import { Stack, Text, Icon } from '@/primitives';
import type { IconName } from '@/primitives';
import styles from './EmptyState.module.css';

export type EmptyStateProps = {
  /** Что произошло. Формулировать от состояния данных, а не от ошибки системы. */
  title: string;
  /** Что с этим делать. Необязательно, но без этого пользователь остаётся в тупике. */
  description?: string;
  icon?: IconName;
  /** Действие, выводящее из пустого состояния. */
  action?: ReactNode;
};

/**
 * Пустое состояние области с данными.
 *
 * В аудите «Ничего не найдено.» встречалось пять раз в трёх разных видах:
 * дважды с рамкой и скруглением, дважды без, один раз голым текстом.
 * Теперь вид один.
 */
export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <Stack gap="sm" align="center">
        {icon ? <Icon name={icon} size="lg" color="textMuted" /> : null}

        <Text variant="body" color="textMuted" align="center">
          {title}
        </Text>

        {description ? (
          <Text variant="bodySm" color="textMuted" align="center">
            {description}
          </Text>
        ) : null}

        {action ? <div className={styles.action}>{action}</div> : null}
      </Stack>
    </div>
  );
}
