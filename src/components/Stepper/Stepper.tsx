import { Icon } from '../../primitives';
import styles from './Stepper.module.css';

export type Step = {
  /** Название шага. Существительное: «Дробилка», а не «Выберите дробилку». */
  label: string;
  /** Короткое пояснение под названием. */
  description?: string;
  /** Шаг недоступен, пока не пройдены предыдущие. */
  disabled?: boolean;
};

export type StepperProps = {
  steps: Step[];
  /** Индекс текущего шага. Всё до него считается пройденным. */
  current: number;
  /**
   * Переход по клику. Без него шаги — индикатор, а не навигация:
   * кликабельность, которая ничего не делает, обманывает.
   */
  onStepClick?: (index: number) => void;
  direction?: 'row' | 'column';
};

/**
 * Шаги визарда: где человек находится и сколько осталось.
 *
 * Пройденный шаг помечается галкой, а не номером: номер не отличает
 * «шаг 2» от «шаг 2 пройден».
 *
 * Не использовать для навигации по разделам, между которыми нет порядка —
 * степпер обещает последовательность.
 */
export function Stepper({ steps, current, onStepClick, direction = 'row' }: StepperProps) {
  return (
    <ol className={[styles.stepper, styles[direction]].join(' ')}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const interactive = Boolean(onStepClick) && !step.disabled;

        const state = [done ? styles.done : null, active ? styles.active : null, step.disabled ? styles.disabled : null]
          .filter(Boolean)
          .join(' ');

        const body = (
          <>
            <span className={styles.marker} aria-hidden="true">
              {done ? <Icon name="check" size="sm" /> : index + 1}
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{step.label}</span>
              {step.description ? <span className={styles.description}>{step.description}</span> : null}
            </span>
          </>
        );

        return (
          <li key={step.label} className={[styles.step, state].filter(Boolean).join(' ')} aria-current={active ? 'step' : undefined}>
            {interactive ? (
              <button type="button" className={styles.button} onClick={() => onStepClick?.(index)} disabled={step.disabled}>
                {body}
              </button>
            ) : (
              <span className={styles.button}>{body}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
