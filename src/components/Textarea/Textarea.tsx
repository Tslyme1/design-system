import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

type NativeProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style' | 'cols'>;

export type TextareaProps = NativeProps & {
  /** Невалидное состояние. Текст ошибки ставит `Field`, а не сам контрол. */
  invalid?: boolean;
  fullWidth?: boolean;
  /**
   * Стартовое число строк. Дальше поле растёт по мере ввода —
   * фиксированная высота у блока с текстом запрещена, и здесь тоже:
   * примечание к проекту не обязано помещаться в три строки.
   */
  rows?: number;
};

/**
 * Многострочный ввод.
 *
 * Не использовать для однострочных значений: высота поля — обещание объёма.
 * Поле в три строки под название проекта заставляет писать длинно.
 */
export function Textarea({ invalid = false, fullWidth = false, rows = 3, ...rest }: TextareaProps) {
  const className = [styles.textarea, invalid ? styles.invalid : null, fullWidth ? styles.fullWidth : null]
    .filter(Boolean)
    .join(' ');

  return <textarea {...rest} rows={rows} className={className} aria-invalid={invalid || rest['aria-invalid']} />;
}
