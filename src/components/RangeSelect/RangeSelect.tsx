import { useEffect, useState } from 'react';
import type { ControlSizeToken } from '../../tokens';
import { Icon, Stack } from '../../primitives';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Popover } from '../Popover/Popover';
import styles from './RangeSelect.module.css';

/** Границы диапазона как их ввели. Пустая строка — граница не задана, а не ноль. */
export type Range = { from: string; to: string };

export type RangeSelectProps = {
  value: Range;
  /** Отдаётся по «Готово» и по «Сбросить» — не на каждое нажатие клавиши. */
  onChange: (value: Range) => void;
  /**
   * Имя величины: «D, мм». Стоит в поле, пока границы не заданы, и остаётся
   * перед ними, когда заданы, — иначе «2000 — 3500» в строке фильтров
   * не сказало бы, чего именно это границы.
   */
  placeholder: string;
  /** Подсказки в полях панели — обычно края шкалы справочника: «900», «3500». */
  fromHint?: string;
  toHint?: string;
  size?: ControlSizeToken;
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  /** Приходят из `Field`. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  /** Имя поля там, где подписи нет: строка фильтров над таблицей. */
  'aria-label'?: string;
};

const EMPTY: Range = { from: '', to: '' };

/**
 * Отбор по диапазону величины — поле, которое открывает панель с границами.
 *
 * Снаружи это такой же контрол, что и `Select`: то же поле, тот же шеврон,
 * та же высота. Так и задумано — в строке фильтров стоят рядом отбор по
 * значению и отбор по диапазону, и разный вид у них означал бы разную
 * природу, которой нет: и то и другое сужает выборку.
 *
 * Границы применяются по «Готово», а не по каждому нажатию клавиши. Пара
 * полей — это одно условие, и таблица не должна пересобираться посреди
 * его ввода: набирая «2000», пользователь иначе успевает увидеть выборку
 * по «2», «20» и «200».
 */
export function RangeSelect({
  value,
  onChange,
  placeholder,
  fromHint,
  toHint,
  size = 'md',
  disabled = false,
  invalid = false,
  fullWidth = false,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
}: RangeSelectProps) {
  const [open, setOpen] = useState(false);

  /**
   * Черновик панели. Заводится при каждом открытии от применённого:
   * закрытие мимо «Готово» — отказ, и невзятые границы не должны
   * всплывать в следующее открытие.
   */
  const [draft, setDraft] = useState<Range>(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]);

  const commit = (next: Range) => {
    onChange(next);
    setOpen(false);
  };

  const label = summary(value, placeholder);
  const filled = label !== null;

  const triggerClass = [
    styles.trigger,
    styles[size],
    invalid ? styles.invalid : null,
    fullWidth ? styles.fullWidth : null,
  ]
    .filter(Boolean)
    .join(' ');

  const trigger = (
    <button
      type="button"
      id={id}
      className={triggerClass}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      aria-invalid={ariaInvalid || invalid || undefined}
      /* Тот же уговор, что у `Select` и `DatePicker`: плавающая подпись
         `Field` держится на `:placeholder-shown`, а он работает только
         у input — заполненность триггера сообщается атрибутом. */
      data-filled={filled ? 'true' : 'false'}
      onClick={() => setOpen((v) => !v)}
    >
      <span className={filled ? styles.value : styles.placeholder}>{label ?? placeholder}</span>
      <Icon name="chevronDown" size="sm" />
    </button>
  );

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      trigger={trigger}
      placement="bottom-start"
      width="auto"
      fullWidth={fullWidth}
      footer={
        <Stack direction="row" gap="sm" justify="between">
          {/* Сброс правит черновик, а не применённое: иначе одна кнопка
              панели действовала бы сразу, а вторая — по «Готово». */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!draft.from && !draft.to}
            onClick={() => setDraft(EMPTY)}
          >
            Сбросить
          </Button>
          <Button variant="primary" size="sm" onClick={() => commit(draft)}>
            Готово
          </Button>
        </Stack>
      }
    >
      {/* Подписей над полями нет: назначение написано в самих полях
          («от», «до»), а имя величины стоит в поле, из которого панель
          открыли. Две подписи над двумя полями повторяли бы одно слово. */}
      <div className={styles.panel}>
        <Input
          fullWidth
          size="sm"
          type="number"
          inputMode="decimal"
          aria-label={`${placeholder}: не менее`}
          placeholder={fromHint ? `от ${fromHint}` : 'от'}
          value={draft.from}
          onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            /* Иначе нажатие доигрывается дальше: панель к этому моменту
               закрыта, и действие по умолчанию достаётся тому, что
               оказалось под фокусом. */
            event.preventDefault();
            commit(draft);
          }}
        />
        <span className={styles.dash} aria-hidden="true">
          —
        </span>
        <Input
          fullWidth
          size="sm"
          type="number"
          inputMode="decimal"
          aria-label={`${placeholder}: не более`}
          placeholder={toHint ? `до ${toHint}` : 'до'}
          value={draft.to}
          onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            commit(draft);
          }}
        />
      </div>
    </Popover>
  );
}

/**
 * Что написано в поле. `null` — границ нет, показывается имя величины.
 *
 * Одна заданная граница пишется словом («D, мм: от 2000»), обе — тире между
 * числами. Писать «2000 — » с пустым хвостом нельзя: это читается как
 * незаконченный ввод, хотя условие задано и уже применено.
 */
function summary(value: Range, placeholder: string): string | null {
  const from = value.from.trim();
  const to = value.to.trim();

  if (from && to) return `${placeholder}: ${from}—${to}`;
  if (from) return `${placeholder}: от ${from}`;
  if (to) return `${placeholder}: до ${to}`;
  return null;
}
