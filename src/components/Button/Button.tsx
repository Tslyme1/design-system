import type { ReactNode, ButtonHTMLAttributes } from 'react';
import type { ControlSizeToken } from '@/tokens';
import { Icon } from '@/primitives';
import type { IconName } from '@/primitives';
import styles from './Button.module.css';

type NativeProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

export type ButtonProps = NativeProps & {
  children: ReactNode;
  /**
   * `primary` — единственная залитая кнопка системы. На экране она одна:
   * если их две, значит главное действие не выбрано.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: ControlSizeToken;
  /** Иконка перед текстом. */
  iconStart?: IconName;
  /** Иконка после текста. Для раскрывающих действий — `chevronDown`. */
  iconEnd?: IconName;
  /** Растянуть на всю ширину родителя. */
  fullWidth?: boolean;
  /**
   * Показать индикатор загрузки и заблокировать нажатие.
   * Текст сохраняется, чтобы ширина кнопки не прыгала.
   */
  loading?: boolean;
};

/**
 * Кнопка.
 *
 * Все состояния — hover, active, focus-visible, disabled, loading —
 * заведены здесь и переопределению на месте не подлежат. В аудите
 * состояния дописывались по месту и каждый раз по-разному.
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  iconStart,
  iconEnd,
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : null,
    loading ? styles.loading : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {iconStart ? <Icon name={iconStart} size={size === 'sm' ? 'sm' : 'md'} /> : null}
      <span className={styles.label}>{children}</span>
      {iconEnd ? <Icon name={iconEnd} size={size === 'sm' ? 'sm' : 'md'} /> : null}
    </button>
  );
}
