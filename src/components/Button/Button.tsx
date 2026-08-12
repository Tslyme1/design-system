import type { ReactNode, ButtonHTMLAttributes } from 'react';
import type { ControlSizeToken } from '@/tokens';
import { Icon } from '@/primitives';
import type { IconName } from '@/primitives';
import styles from './Button.module.css';

type NativeProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

type ButtonBase = NativeProps & {
  /**
   * `primary` — единственная залитая кнопка системы. На экране она одна:
   * если их две, значит главное действие не выбрано.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: ControlSizeToken;
  /** Растянуть на всю ширину родителя. */
  fullWidth?: boolean;
  /**
   * Показать индикатор загрузки и заблокировать нажатие.
   * Текст сохраняется, чтобы ширина кнопки не прыгала.
   */
  loading?: boolean;
};

/** Кнопка с текстом. Иконки — по краям от подписи. */
type LabelledButtonProps = ButtonBase & {
  children: ReactNode;
  /** Иконка перед текстом. */
  iconStart?: IconName;
  /** Иконка после текста. Для раскрывающих действий — `chevronDown`. */
  iconEnd?: IconName;
  icon?: never;
};

/**
 * Квадратная кнопка из одной иконки. Ширина равна высоте контрола,
 * поэтому такие кнопки выстраиваются в ряд с обычными без подгонки.
 *
 * `aria-label` обязателен на уровне типов: без подписи кнопка нема
 * для скринридера, а в аудите таких было большинство.
 */
type IconOnlyButtonProps = ButtonBase & {
  icon: IconName;
  'aria-label': string;
  children?: never;
  iconStart?: never;
  iconEnd?: never;
  /** Квадратная кнопка не тянется: её ширина — это её высота. */
  fullWidth?: never;
};

export type ButtonProps = LabelledButtonProps | IconOnlyButtonProps;

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
  icon,
  iconStart,
  iconEnd,
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconSize = size === 'sm' ? 'sm' : 'md';
  const iconOnly = icon !== undefined;

  const className = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly ? styles.iconOnly : null,
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
      {iconOnly ? (
        <Icon name={icon} size={iconSize} />
      ) : (
        <>
          {iconStart ? <Icon name={iconStart} size={iconSize} /> : null}
          <span className={styles.label}>{children}</span>
          {iconEnd ? <Icon name={iconEnd} size={iconSize} /> : null}
        </>
      )}
    </button>
  );
}
