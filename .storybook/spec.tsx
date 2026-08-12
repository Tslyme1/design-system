import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Stack, Text, Box } from '@/primitives';
import styles from './spec.module.css';

/**
 * Общие хелперы витрины.
 *
 * Подписи вариантов, ячейки матрицы и разбор анатомии рисуются здесь
 * один раз. Если каждый автор оформляет их по-своему, витрина перестаёт
 * читаться как одна система и линейкам в ней перестают верить.
 */

/** Образец с подписью. Подпись — имя пропа, а не описание словами. */
export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack gap="2xs" align="start">
      <span className={styles.token}>{label}</span>
      {children}
    </Stack>
  );
}

/**
 * Матрица «варианты × состояния». Строки — варианты, столбцы — состояния.
 * Именно в ней видно, что сочетание вроде `danger` + `disabled` выглядит
 * сломанно: по одному состоянию за раз этого не заметить.
 */
export function Matrix<R extends string, C extends string>({
  rows,
  columns,
  children,
}: {
  rows: readonly R[];
  columns: readonly C[];
  children: (row: R, column: C) => ReactNode;
}) {
  return (
    <div className={styles.matrix} style={{ ['--matrix-columns' as string]: String(columns.length + 1) }}>
      <span />
      {columns.map((column) => (
        <span key={column} className={styles.token}>
          {column}
        </span>
      ))}

      {rows.map((row) => (
        <Fragment key={row}>
          <span className={styles.token}>{row}</span>
          {columns.map((column) => (
            <span key={`${row}-${column}`} className={styles.cell}>
              {children(row, column)}
            </span>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Разбор вёрстки: слоты компонента и подписанные отступы.
 *
 * Подписи — имена токенов, а не пиксели: пиксели устаревают,
 * имя токена остаётся контрактом.
 */
export function Spec({
  slots,
  annotate,
  children,
}: {
  slots: string[];
  annotate: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <Stack gap="lg" align="start">
      <div className={styles.stage}>{children}</div>

      <Stack gap="sm" align="start">
        <Text variant="label">Слоты</Text>
        <Stack direction="row" gap="sm" wrap>
          {slots.map((slot) => (
            <Box key={slot} padding="xs" background="surfaceSunken" radius="md">
              <span className={styles.token}>{slot}</span>
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack gap="sm" align="start">
        <Text variant="label">Метрики</Text>
        <Stack gap="2xs">
          {Object.entries(annotate).map(([property, token]) => (
            <span key={property} className={styles.token}>
              {property} = {token}
            </span>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

/** Пара «так — не так». «Не так» без причины читается как вкусовщина и обходится. */
export function DoDont({
  doLabel = 'Так',
  dontLabel = 'Не так',
  reason,
  children,
}: {
  doLabel?: string;
  dontLabel?: string;
  reason: string;
  children: [ReactNode, ReactNode];
}) {
  return (
    <Stack gap="sm" align="start">
      <Stack direction="row" gap="xl" wrap align="start">
        <Stack gap="2xs" align="start">
          <Text variant="label" color="successText">
            {doLabel}
          </Text>
          {children[0]}
        </Stack>
        <Stack gap="2xs" align="start">
          <Text variant="label" color="dangerText">
            {dontLabel}
          </Text>
          {children[1]}
        </Stack>
      </Stack>
      <Text variant="caption" color="textMuted">
        {reason}
      </Text>
    </Stack>
  );
}
