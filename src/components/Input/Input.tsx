import type { InputHTMLAttributes } from 'react';
import type { ControlSizeToken } from '../../tokens';
import styles from './Input.module.css';

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'size'>;

export type InputProps = NativeProps & {
  size?: ControlSizeToken;
  /** Невалидное состояние. Обычно приходит из `<Field error>`. */
  invalid?: boolean;
  fullWidth?: boolean;
};

/**
 * Текстовое поле.
 *
 * Отдельного варианта с плавающей подписью нет намеренно: в аудите он
 * применялся к двум полям из семидесяти шести, из-за чего одинаковые по роли
 * поля выглядели по-разному. Подпись ставит `<Field>` — одинаково для всех.
 */
export function Input({ size = 'md', invalid = false, fullWidth = false, ...rest }: InputProps) {
  const className = [styles.input, styles[size], invalid ? styles.invalid : null, fullWidth ? styles.fullWidth : null]
    .filter(Boolean)
    .join(' ');

  return <input {...rest} className={className} />;
}
