import type { ReactNode } from 'react';
import { useId } from 'react';
import styles from './Field.module.css';

export type FieldRenderProps = {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean | undefined;
  /**
   * Заполняется только у варианта `floating`: пробел в плейсхолдере —
   * то, на чём держится `:placeholder-shown`. Контрол обязан его прокинуть.
   */
  placeholder?: string;
};

export type FieldProps = {
  /** Подпись поля. Обязательна: поле без подписи — это поле без назначения. */
  label: string;
  /**
   * Контрол. Получает `id`, `aria-describedby` и `aria-invalid`,
   * чтобы подпись и ошибка были связаны с ним программно, а не только визуально.
   */
  children: (props: FieldRenderProps) => ReactNode;
  /**
   * `stacked` — подпись над контролом. Значение по умолчанию, годится везде.
   * `floating` — подпись лежит в поле и уходит наверх при вводе. Для форм,
   * где важна плотность и поля идут в ряд.
   */
  variant?: 'stacked' | 'floating';
  /** Пояснение под полем. Скрывается, когда показана ошибка. */
  hint?: string;
  /** Текст ошибки. Его наличие переводит поле в невалидное состояние. */
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  /**
   * Значок-подсказка рядом с подписью — обычно `Tooltip` вокруг кнопки
   * со значком `info`. Не замена `hint`: тот — обязательное для работы
   * пояснение под полем (например, «было: X»), которое видно всегда;
   * это — необязательный глоссарий термина по наведению или фокусу,
   * без которого можно продолжать работать, просто не узнав a₀ от Va₀.
   */
  labelHint?: ReactNode;
};

/**
 * Обёртка поля формы: подпись + контрол + пояснение или ошибка.
 *
 * Гарантирует одинаковую анатомию всех полей. В аудите поля собирались
 * тремя способами (`.input`, `.field`, `.float-field`), и связь подписи
 * с контролом нигде не была выражена программно.
 *
 * Плавающая подпись оставлена как вариант, а не как отдельный компонент:
 * иначе появляются два способа подписать поле, и они неизбежно расходятся.
 *
 * Ошибка и пояснение занимают одну позицию: ошибка вытесняет пояснение,
 * поэтому высота поля не скачет при валидации.
 */
export function Field({
  label,
  children,
  variant = 'stacked',
  hint,
  error,
  required = false,
  fullWidth = false,
  labelHint,
}: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error || hint);

  const renderProps: FieldRenderProps = {
    id,
    'aria-describedby': hasMessage ? messageId : undefined,
    'aria-invalid': error ? true : undefined,
    ...(variant === 'floating' ? { placeholder: ' ' } : null),
  };

  const wrapperClass = [styles.field, fullWidth ? styles.fullWidth : null].filter(Boolean).join(' ');

  if (variant === 'floating') {
    return (
      <div className={wrapperClass}>
        {/* Подпись идёт после контрола: так она лежит поверх него без
            отдельного слоя. Положение считает `:has()` на самом боксе,
            поэтому глубина вложенности контрола значения не имеет —
            триггер `Select` живёт внутри обёртки `Popover`. */}
        <div className={styles.floatBox}>
          {children(renderProps)}
          <label htmlFor={id} className={[styles.floatLabel, error ? styles.labelError : null].filter(Boolean).join(' ')}>
            {label}
            {required ? ' *' : ''}
            {labelHint ? <span className={styles.labelHint}>{labelHint}</span> : null}
          </label>
        </div>

        {hasMessage ? (
          <span id={messageId} className={[styles.message, error ? styles.messageError : null].filter(Boolean).join(' ')}>
            {error ?? hint}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <label htmlFor={id} className={[styles.label, error ? styles.labelError : null].filter(Boolean).join(' ')}>
        {label}
        {required ? ' *' : ''}
        {labelHint ? <span className={styles.labelHint}>{labelHint}</span> : null}
      </label>

      {children(renderProps)}

      {hasMessage ? (
        <span id={messageId} className={[styles.message, error ? styles.messageError : null].filter(Boolean).join(' ')}>
          {error ?? hint}
        </span>
      ) : null}
    </div>
  );
}
