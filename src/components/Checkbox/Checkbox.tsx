import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import styles from './Checkbox.module.css';

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'type' | 'size'>;

export type CheckboxProps = NativeProps & {
  /** Подпись справа от флажка. Кликабельна вместе с ним. */
  label?: ReactNode;
  /** Пояснение под подписью — для строк меню, где нужен второй уровень. */
  description?: ReactNode;
  /**
   * Промежуточное состояние: часть вложенных элементов выбрана.
   * Для строки «Выбрать все» над списком.
   */
  indeterminate?: boolean;
};

/**
 * Флажок.
 *
 * В аудите все 10 флажков были нативными `<input type="checkbox">` без
 * единого стиля — то есть выглядели как элементы браузера, а не системы,
 * и не меняли вид в тёмной теме.
 *
 * Разметка сохраняет нативный input скрытым: так работают клавиатура,
 * скринридер и форма, а рисуется системная рамка.
 */
export function Checkbox({ label, description, indeterminate = false, id, disabled, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <span className={[styles.wrapper, disabled ? styles.disabled : null].filter(Boolean).join(' ')}>
      <input
        {...rest}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        className={styles.input}
        aria-checked={indeterminate ? 'mixed' : undefined}
        ref={(node) => {
          if (node) node.indeterminate = indeterminate;
        }}
      />
      <span className={styles.control} aria-hidden="true">
        <svg viewBox="0 0 16 16" className={styles.mark} focusable="false">
          {indeterminate ? (
            <path d="M4 8h8" />
          ) : (
            <path d="M3.5 8.5 6.5 11.5 12.5 5" />
          )}
        </svg>
      </span>

      {label !== undefined ? (
        <label htmlFor={inputId} className={styles.labelBlock}>
          <span className={styles.label}>{label}</span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </label>
      ) : null}
    </span>
  );
}
