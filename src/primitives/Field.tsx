import type { ReactNode } from 'react';
import { useId } from 'react';
import { Stack } from './Stack';
import { Text } from './Text';

export type FieldProps = {
  /** Подпись поля. Обязательна: поле без подписи — это поле без назначения. */
  label: string;
  /**
   * Контрол. Получает `id`, `aria-describedby` и `aria-invalid`,
   * чтобы подпись и ошибка были связаны с ним программно, а не только визуально.
   */
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
  }) => ReactNode;
  /** Пояснение под полем. Скрывается, когда показана ошибка. */
  hint?: string;
  /** Текст ошибки. Его наличие переводит поле в невалидное состояние. */
  error?: string;
  required?: boolean;
};

/**
 * Обёртка поля формы: подпись + контрол + пояснение/ошибка.
 *
 * Гарантирует одинаковую анатомию всех полей. В аудите поля собирались
 * тремя способами (`.input`, `.field`, `.float-field`), и связь подписи
 * с контролом нигде не была выражена программно.
 *
 * Ошибка и пояснение занимают одну позицию: ошибка вытесняет пояснение,
 * поэтому высота поля не скачет при валидации.
 */
export function Field({ label, children, hint, error, required = false }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <Stack gap="2xs">
      <Text variant="label" as="label" htmlFor={id} color={error ? 'dangerText' : 'text'}>
        {label}
        {required ? ' *' : ''}
      </Text>

      {children({
        id,
        'aria-describedby': hasMessage ? messageId : undefined,
        'aria-invalid': error ? true : undefined,
      })}

      {hasMessage ? (
        <Text variant="caption" color={error ? 'dangerText' : 'textMuted'} as="span" id={messageId}>
          {error ?? hint}
        </Text>
      ) : null}
    </Stack>
  );
}
