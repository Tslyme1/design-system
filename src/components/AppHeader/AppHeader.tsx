import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Icon } from '../../primitives';
import type { IconName } from '../../primitives';
import styles from './AppHeader.module.css';

export type AppHeaderProps = {
  children: ReactNode;
};

/**
 * Полоса шапки сервиса.
 *
 * Живёт на собственной шкале `chrome` (высота 44), а не на шкале контролов:
 * её элементы тянутся на всю высоту полосы, имеют нулевой радиус
 * и разделяются хайрлайнами, а не отступами. Мерить их как кнопки формы
 * нельзя — это разные сущности.
 */
export function AppHeader({ children }: AppHeaderProps) {
  return <header className={styles.header}>{children}</header>;
}

type NativeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

export type HeaderButtonProps = NativeButtonProps & {
  /** Иконка. Для кнопки без подписи — единственное содержимое. */
  icon?: IconName;
  /** Подпись. Без неё кнопка становится квадратной ячейкой 44×44. */
  children?: ReactNode;
  /**
   * Активная вкладка. Ячейка сливается с содержимым под шапкой:
   * заливается цветом поверхности и перекрывает нижнюю границу полосы.
   */
  active?: boolean;
  /** Раскрывающая кнопка — добавляет шеврон справа. */
  expandable?: boolean;
  /**
   * Кнопки управления окном: свернуть, развернуть, закрыть.
   * `close` дополнительно краснеет при наведении.
   */
  chrome?: 'minimize' | 'maximize' | 'close';
};

/**
 * Кнопка в шапке сервиса.
 *
 * Отличается от `Button` не оформлением, а природой: у неё нет
 * собственной высоты и отступов — она заполняет полосу целиком.
 * Поэтому это отдельный компонент, а не вариант кнопки: попытка
 * выразить их одним компонентом даёт проп вроде `variant="header"`,
 * который отменяет половину остальных пропов.
 */
export function HeaderButton({ icon, children, active = false, expandable = false, chrome, ...rest }: HeaderButtonProps) {
  const hasLabel = children !== undefined;

  const className = [
    styles.cell,
    hasLabel ? styles.withLabel : styles.iconOnly,
    active ? styles.active : null,
    chrome === 'close' ? styles.close : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button {...rest} type="button" className={className} aria-current={active ? 'page' : undefined}>
      {icon ? <Icon name={icon} size="md" /> : null}
      {hasLabel ? <span className={styles.label}>{children}</span> : null}
      {expandable ? <Icon name="chevronDown" size="sm" /> : null}
    </button>
  );
}

/** Вертикальный хайрлайн между ячейками шапки. */
export function HeaderDivider() {
  return <span className={styles.divider} aria-hidden="true" />;
}

/** Распорка, отжимающая последующие ячейки к правому краю. */
export function HeaderSpacer() {
  return <span className={styles.spacer} />;
}
