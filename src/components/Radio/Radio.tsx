import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { Stack } from '@/primitives';
import styles from './Radio.module.css';

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'type' | 'size'>;

export type RadioProps = NativeProps & {
  label?: ReactNode;
  description?: ReactNode;
};

/**
 * Переключатель одного варианта из нескольких.
 *
 * В аудите радиокнопок не было ни одной: роль единственного выбора
 * закрывалась флажками в меню — то есть элементом, который формой
 * сообщает «можно выбрать несколько». Здесь форма снова совпадает
 * со смыслом: круг — один вариант, квадрат — несколько.
 *
 * Использовать только внутри `RadioGroup` — одиночная радиокнопка
 * не имеет смысла, её нельзя снять.
 */
export function Radio({ label, description, id, disabled, ...rest }: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <span className={[styles.wrapper, disabled ? styles.disabled : null].filter(Boolean).join(' ')}>
      <input {...rest} id={inputId} type="radio" disabled={disabled} className={styles.input} />
      <span className={styles.control} aria-hidden="true">
        <span className={styles.dot} />
      </span>

      {label !== undefined ? (
        <label htmlFor={inputId} className={styles.labelBlock}>
          <span className={styles.label}>{label}</span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </label>
      ) : null}
    </span>
  );
}

export type RadioGroupProps = {
  /** Общее название группы. Обязательно: без него выбор не взаимоисключающий. */
  name: string;
  /** Подпись всей группы — читается скринридером как её заголовок. */
  legend: string;
  children: ReactNode;
  direction?: 'row' | 'column';
};

/**
 * Группа взаимоисключающих вариантов.
 *
 * Задаёт `<fieldset>` и `<legend>`: без них скринридер прочитает
 * варианты как несвязанные, и смысл «одно из» потеряется.
 */
export function RadioGroup({ name, legend, children, direction = 'column' }: RadioGroupProps) {
  return (
    <fieldset className={styles.group} name={name}>
      <legend className={styles.legend}>{legend}</legend>
      <Stack direction={direction} gap={direction === 'row' ? 'lg' : 'sm'}>
        {children}
      </Stack>
    </fieldset>
  );
}
