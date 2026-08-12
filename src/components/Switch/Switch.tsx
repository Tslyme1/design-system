import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import styles from './Switch.module.css';

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'type' | 'children'>;

export type SwitchProps = NativeProps & {
  /** Подпись. Формулируется как состояние, а не как действие: «Показывать сетку». */
  label?: ReactNode;
  /** Пояснение под подписью: что изменится, а не повтор подписи. */
  description?: ReactNode;
};

/**
 * Переключатель включено/выключено.
 *
 * Применяется там, где изменение вступает в силу сразу и не требует
 * подтверждения. Если состояние сохраняется только по кнопке «Сохранить» —
 * это флажок, а не переключатель: переключатель обещает немедленный эффект.
 *
 * В аудите роль закрывалась `Checkbox`, из-за чего настройки выглядели
 * как список для множественного выбора.
 */
export function Switch({ label, description, id, disabled, ...rest }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <div className={styles.row}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        id={inputId}
        disabled={disabled}
        className={styles.input}
        aria-describedby={descriptionId}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>

      {label ? (
        <span className={styles.text}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
          {description ? (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
