import { useId } from 'react';
import type { ControlSizeToken } from '../../tokens';
import { Icon } from '../../primitives';
import type { IconName } from '../../primitives';
import styles from './SegmentedControl.module.css';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
  disabled?: boolean;
};

export type SegmentedControlProps<T extends string> = {
  /**
   * Два-три взаимоисключающих варианта. Четыре и больше — это `Select`
   * или `RadioGroup`: сегменты станут уже подписи и начнут обрезаться.
   */
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: ControlSizeToken;
  /** Подпись группы для скринридера. Видимую подпись ставит `Field`. */
  legend: string;
  fullWidth?: boolean;
};

/**
 * Переключатель между взаимоисключающими режимами.
 *
 * Все варианты видны сразу — этим он и отличается от `Select`, который
 * прячет выбор за кликом. Применяется, когда вариантов два-три и они
 * коротко называются: «Инженерный / Упрощённый».
 *
 * Не использовать как фильтр с возможностью снять выбор: один сегмент
 * всегда выбран. И не использовать для включения-выключения — там `Switch`.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  legend,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  const name = useId();

  return (
    <fieldset
      className={[styles.group, styles[size], fullWidth ? styles.fullWidth : null].filter(Boolean).join(' ')}
    >
      <legend className={styles.legend}>{legend}</legend>

      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <span key={option.value} className={styles.segment}>
            {/* Радиокнопка, а не кнопки: выбор взаимоисключающий, и стрелки
                должны переключать его так же, как в обычной группе. */}
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className={styles.input}
            />
            <label htmlFor={id} className={styles.label}>
              {option.icon ? <Icon name={option.icon} size="sm" /> : null}
              <span className={styles.text}>{option.label}</span>
            </label>
          </span>
        );
      })}
    </fieldset>
  );
}
