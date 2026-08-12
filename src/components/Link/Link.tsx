import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/primitives';
import styles from './Link.module.css';

type NativeProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style' | 'children'>;

export type LinkProps = NativeProps & {
  children: ReactNode;
  /**
   * Ссылка ведёт наружу: добавляет иконку и `rel="noopener noreferrer"`.
   * Иконка здесь обязательна — уход из приложения нельзя сообщать
   * только сменой цвета.
   */
  external?: boolean;
  /** Приглушённая ссылка для второстепенной навигации: хлебные крошки, сноски. */
  tone?: 'accent' | 'muted';
};

/**
 * Текстовая ссылка — переход по адресу.
 *
 * Не использовать для действий: если по нажатию что-то выполняется,
 * а не открывается адрес, нужен `Button`. Ссылку копируют, открывают
 * в новой вкладке и индексируют — с действием так нельзя.
 */
export function Link({ children, external = false, tone = 'accent', target, rel, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      target={external ? target ?? '_blank' : target}
      rel={external ? rel ?? 'noopener noreferrer' : rel}
      className={[styles.link, styles[tone]].join(' ')}
    >
      <span className={styles.label}>{children}</span>
      {external ? <Icon name="arrowRight" size="sm" label="Откроется в новой вкладке" /> : null}
    </a>
  );
}
