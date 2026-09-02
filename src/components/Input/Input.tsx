import type { InputHTMLAttributes, ReactNode } from 'react';
import type { ControlSizeToken } from '../../tokens';
import styles from './Input.module.css';

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'size'>;

export type InputProps = NativeProps & {
  size?: ControlSizeToken;
  /** Невалидное состояние. Обычно приходит из `<Field error>`. */
  invalid?: boolean;
  fullWidth?: boolean;
  /**
   * Единица измерения у правого края поля, внутри его рамки — «град.»,
   * «рад.», «мм», «%». Не заменяет подпись `Field`: подпись называет
   * величину, суффикс — единицу, в которой её сейчас вводят (пригождается,
   * когда единица переключается тут же, как в углах камеры дробления).
   *
   * Рассчитан на короткую единицу (несколько знаков), а не произвольное
   * содержимое: место под него зарезервировано фиксированным отступом,
   * а не измерено по факту, — длинный текст обрежется рамкой поля.
   */
  suffix?: ReactNode;
};

/**
 * Текстовое поле.
 *
 * Отдельного варианта с плавающей подписью нет намеренно: в аудите он
 * применялся к двум полям из семидесяти шести, из-за чего одинаковые по роли
 * поля выглядели по-разному. Подпись ставит `<Field>` — одинаково для всех.
 */
export function Input({ size = 'md', invalid = false, fullWidth = false, suffix, ...rest }: InputProps) {
  const inputClassName = [
    styles.input,
    styles[size],
    invalid ? styles.invalid : null,
    suffix ? styles.withSuffix : null,
    !suffix && fullWidth ? styles.fullWidth : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (!suffix) return <input {...rest} className={inputClassName} />;

  const wrapperClassName = [styles.wrapper, styles[size], fullWidth ? styles.wrapperFullWidth : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName}>
      <input {...rest} className={inputClassName} />
      {/* Не участвует в фокусе и не мешает выделению значения курсором. */}
      <span className={styles.suffix} aria-hidden="true">
        {suffix}
      </span>
    </div>
  );
}
