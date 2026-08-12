import type { ReactNode } from 'react';
import { Icon } from '../../primitives';
import type { IconName } from '../../primitives';
import styles from './Chip.module.css';

export type ChipProps = {
  /** Название сущности: дробилка, проба руды, проект. */
  children: ReactNode;
  /** Второстепенная часть подписи — ГОК, месторождение. */
  meta?: string;
  icon?: IconName;
  /** Клик по самой плашке. Обычно открывает окно выбора. */
  onClick?: () => void;
  /**
   * Действие в правой части плашки — обычно карандаш «сменить»
   * или шеврон, раскрывающий поповер.
   */
  action?: {
    icon: IconName;
    label: string;
    onClick: () => void;
  };
  /** Плашка выбранного/активного объекта. */
  active?: boolean;
  fullWidth?: boolean;
};

/**
 * Плашка сущности — название выбранного объекта с действием.
 *
 * Показывает, что именно сейчас выбрано, и открывает окно замены.
 * В аудите собиралась вручную из `.input` с иконкой плюс отдельной
 * кнопки-карандаша рядом — то есть поле ввода использовалось как
 * подложка для нередактируемого текста.
 *
 * Не путать с `Tag`: у метки цвет означает пользовательский выбор,
 * а плашка показывает объект и ведёт к действию над ним.
 */
export function Chip({ children, meta, icon, onClick, action, active = false, fullWidth = false }: ChipProps) {
  const className = [
    styles.chip,
    active ? styles.active : null,
    onClick ? styles.clickable : null,
    fullWidth ? styles.fullWidth : null,
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {icon ? <Icon name={icon} size="sm" /> : null}
      <span className={styles.text}>
        <span className={styles.label}>{children}</span>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
      </span>
    </>
  );

  return (
    <span className={className}>
      {onClick ? (
        <button type="button" className={styles.main} onClick={onClick}>
          {body}
        </button>
      ) : (
        <span className={styles.main}>{body}</span>
      )}

      {action ? (
        <button type="button" className={styles.action} onClick={action.onClick} title={action.label} aria-label={action.label}>
          <Icon name={action.icon} size="sm" />
        </button>
      ) : null}
    </span>
  );
}
