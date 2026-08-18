import type { FormEvent, TextareaHTMLAttributes } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styles from './Textarea.module.css';

type NativeProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'style' | 'cols'>;

export type TextareaProps = NativeProps & {
  /** Невалидное состояние. Текст ошибки ставит `Field`, а не сам контрол. */
  invalid?: boolean;
  fullWidth?: boolean;
  /**
   * Стартовое число строк — нижняя граница высоты. Поле не бывает ниже,
   * даже пустое: высота обещает объём ожидаемого текста.
   */
  rows?: number;
  /**
   * Потолок роста в строках. Дальше поле прокручивается внутри себя.
   * Без него растёт неограниченно — так и надо там, где примечание
   * единственное на странице; в плотной форме потолок обязателен,
   * иначе длинный текст уносит кнопки за экран.
   */
  maxRows?: number;
};

/**
 * Подгоняет высоту под содержимое: `height: auto` сбрасывает прошлое
 * измерение, `scrollHeight` даёт высоту текста, `rows` и `maxRows`
 * зажимают её с двух сторон.
 *
 * Границы считаются здесь, а не в CSS: они выражены в строках, а строка —
 * это `line-height` из токенов типографики, которого в CSS не сложить
 * с паддингами без магических чисел.
 */
function fit(el: HTMLTextAreaElement, rows: number, maxRows?: number) {
  const cs = getComputedStyle(el);
  const line = Number.parseFloat(cs.lineHeight);
  const borders = Number.parseFloat(cs.borderTopWidth) + Number.parseFloat(cs.borderBottomWidth);
  const frame = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom) + borders;

  el.style.height = 'auto';
  const content = el.scrollHeight + borders;

  // `line-height: normal` не парсится в число. Тогда клампа нет —
  // поле просто идёт за содержимым, это лучше, чем схлопнуться в ноль.
  let next = content;
  if (Number.isFinite(line)) {
    next = Math.max(next, line * rows + frame);
    if (maxRows) next = Math.min(next, line * maxRows + frame);
  }

  el.style.height = `${next}px`;
  el.style.overflowY = content > next ? 'auto' : 'hidden';
}

/**
 * Многострочный ввод.
 *
 * Не использовать для однострочных значений: высота поля — обещание объёма.
 * Поле в три строки под название проекта заставляет писать длинно.
 */
export function Textarea({
  invalid = false,
  fullWidth = false,
  rows = 3,
  maxRows,
  onInput,
  ...rest
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const className = [styles.textarea, invalid ? styles.invalid : null, fullWidth ? styles.fullWidth : null]
    .filter(Boolean)
    .join(' ');

  // Первый замер и реакция на значение извне: у управляемого поля текст
  // меняется без ввода — сброс формы, подстановка шаблона.
  useLayoutEffect(() => {
    if (ref.current) fit(ref.current, rows, maxRows);
  }, [rows, maxRows, rest.value, rest.defaultValue]);

  // Ширина поля меняет число переносов, а с ним и высоту.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Наблюдатель срабатывает и на нашу же правку высоты. Пересчёт идёт
    // только когда изменилась ширина — иначе замер кормит сам себя.
    let width = el.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const next = el.getBoundingClientRect().width;
      if (next === width) return;
      width = next;
      fit(el, rows, maxRows);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rows, maxRows]);

  const handleInput = useCallback(
    (event: FormEvent<HTMLTextAreaElement>) => {
      fit(event.currentTarget, rows, maxRows);
      onInput?.(event);
    },
    [rows, maxRows, onInput]
  );

  return (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      onInput={handleInput}
      className={className}
      aria-invalid={invalid || rest['aria-invalid']}
    />
  );
}
