import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { ControlSizeToken } from '../../tokens';
import { Icon, Stack, Text } from '../../primitives';
import { Button } from '../Button/Button';
import { Popover } from '../Popover/Popover';
import styles from './DatePicker.module.css';

export type DatePickerProps = {
  /** Дата как `ГГГГ-ММ-ДД` — тот же вид, что у `<input type="date">`. `null` — не выбрана. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Текст, пока дата не выбрана. */
  placeholder?: string;
  size?: ControlSizeToken;
  /** Границы выбора, тоже `ГГГГ-ММ-ДД`. День за границей нажать нельзя. */
  min?: string;
  max?: string;
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  /** Приходят из `Field`. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  /**
   * Имя поля там, где подписи нет и не будет — в строке фильтров над
   * таблицей. Везде, где подпись есть, её ставит `Field`, и этот проп
   * не нужен.
   */
  'aria-label'?: string;
};

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/** Родительный падеж — для доступного имени дня: «21 августа 2026». */
const MONTHS_OF = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

/** Неделя начинается с понедельника: календарь русский, а не американский. */
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/**
 * Недель в сетке всегда шесть. У февраля их выходит пять, у марта шесть —
 * панель прыгала бы по высоте на каждом листании, и кнопки под ней вместе
 * с ней.
 */
const WEEKS = 6;

/**
 * Выбор даты.
 *
 * Собственный, а не `<input type="date">`. Нативное поле рисует календарь
 * средствами браузера: ни гарнитура, ни цвета, ни радиусы, ни тёмная тема
 * туда не передаются — CSS до этой панели не достаёт вообще. Посреди
 * интерфейса, собранного из токенов, открывалась панель чужого вида, своя
 * в каждом браузере. Это и есть причина, по которой компонент существует.
 *
 * Панель, закрытие по Esc и клику снаружи отданы `Popover` — здесь только
 * сетка месяца и перемещение по ней.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'дд.мм.гггг',
  size = 'md',
  min,
  max,
  disabled = false,
  invalid = false,
  fullWidth = false,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => parseISO(value), [value]);
  const today = useMemo(() => startOfDay(new Date()), []);

  /** Показанный месяц. Ведётся отдельно от выбора: листать можно, ничего не выбирая. */
  const [view, setView] = useState(() => firstOfMonth(selected ?? today));

  /**
   * День под фокусом. Клавиатура ходит по сетке одним табстопом: сорок два
   * дня, каждый из которых ловит Tab, — это сорок два нажатия, чтобы уйти
   * из календаря дальше по форме.
   */
  const [focused, setFocused] = useState(() => selected ?? today);
  const gridRef = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);

  /* Открытие всегда показывает месяц выбранной даты, а не тот, на котором
     остановилось листание в прошлый раз: панель обязана открываться там,
     где стоит значение поля. */
  useEffect(() => {
    if (!open) return;
    const start = selected ?? today;
    setView(firstOfMonth(start));
    setFocused(start);
  }, [open]);

  /* Фокус переносится следом за клавиатурой, но не отбирается при открытии
     мышью: панель открыта, а курсор ещё в поле. */
  useEffect(() => {
    if (!open || !focusPending.current) return;
    focusPending.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]')?.focus();
  }, [focused, open]);

  const days = useMemo(() => {
    const start = startOfGrid(view);
    return Array.from({ length: WEEKS * 7 }, (_, index) => addDays(start, index));
  }, [view]);

  const minDate = useMemo(() => parseISO(min ?? null), [min]);
  const maxDate = useMemo(() => parseISO(max ?? null), [max]);

  const outOfRange = (day: Date) =>
    (minDate !== null && day.getTime() < minDate.getTime()) ||
    (maxDate !== null && day.getTime() > maxDate.getTime());

  const pick = (day: Date) => {
    if (outOfRange(day)) return;
    onChange(toISO(day));
    setOpen(false);
  };

  const moveFocus = (next: Date) => {
    focusPending.current = true;
    setFocused(next);
    if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
      setView(firstOfMonth(next));
    }
  };

  const onGridKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

    if (event.key in step) {
      event.preventDefault();
      moveFocus(addDays(focused, step[event.key]));
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      /* Понедельник и воскресенье той же недели: строка сетки — это неделя,
         и край строки у неё именно такой. */
      const shift = event.key === 'Home' ? -weekdayIndex(focused) : 6 - weekdayIndex(focused);
      moveFocus(addDays(focused, shift));
      return;
    }

    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      moveFocus(addMonths(focused, event.key === 'PageUp' ? -1 : 1));
    }
  };

  const triggerClass = [
    styles.trigger,
    styles[size],
    invalid ? styles.invalid : null,
    fullWidth ? styles.fullWidth : null,
  ]
    .filter(Boolean)
    .join(' ');

  const label = selected ? formatRu(selected) : null;

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
      /* Плавающая подпись `Field` смотрит на этот атрибут: `:placeholder-shown`
         работает только у input, а здесь кнопка. Тот же уговор, что у `Select`. */
      data-filled={label ? 'true' : 'false'}
      onClick={() => setOpen((v) => !v)}
    >
      <span className={label ? styles.value : styles.placeholder}>{label ?? placeholder}</span>
      <Icon name="calendar" size="sm" />
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
        /* Два действия, которых в сетке нет: «сегодня» — это прыжок и выбор
           разом, «очистить» — единственный способ вернуть поле в пустое.
           Без второго дату, поставленную по ошибке, снять нечем. */
        <Stack direction="row" gap="sm" justify="between">
          <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
            Очистить
          </Button>
          <Button variant="ghost" size="sm" onClick={() => pick(today)}>
            Сегодня
          </Button>
        </Stack>
      }
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <Text variant="label">{`${MONTHS[view.getMonth()]} ${view.getFullYear()}`}</Text>

          <Stack direction="row" gap="2xs">
            <Button
              variant="ghost"
              size="sm"
              icon="chevronLeft"
              aria-label="Предыдущий месяц"
              onClick={() => setView(addMonths(view, -1))}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="chevronRight"
              aria-label="Следующий месяц"
              onClick={() => setView(addMonths(view, 1))}
            />
          </Stack>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAYS.map((day) => (
            <Text key={day} variant="caption" color="textMuted" align="center">
              {day}
            </Text>
          ))}
        </div>

        {/* Сетка объявлена таблицей дат: строка — неделя, ячейка — день.
            Роль здесь не украшение: без неё скринридер читает сорок две
            кнопки подряд, не сообщая ни дня недели, ни того, что это
            вообще календарь. */}
        <div
          ref={gridRef}
          className={styles.grid}
          role="grid"
          aria-label={`${MONTHS[view.getMonth()]} ${view.getFullYear()}`}
          onKeyDown={onGridKeyDown}
        >
          {days.map((day) => {
            const isSelected = selected !== null && sameDay(day, selected);
            const isToday = sameDay(day, today);
            const isOutside = day.getMonth() !== view.getMonth();

            const dayClass = [
              styles.day,
              isSelected ? styles.selected : null,
              isToday && !isSelected ? styles.today : null,
              isOutside ? styles.outside : null,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={toISO(day)}
                type="button"
                className={dayClass}
                role="gridcell"
                aria-selected={isSelected}
                aria-current={isToday ? 'date' : undefined}
                aria-label={`${day.getDate()} ${MONTHS_OF[day.getMonth()]} ${day.getFullYear()}`}
                disabled={outOfRange(day)}
                data-focused={sameDay(day, focused) ? 'true' : 'false'}
                tabIndex={sameDay(day, focused) ? 0 : -1}
                onClick={() => pick(day)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </Popover>
  );
}

/* ---------- Даты ---------- */

/**
 * Разбор `ГГГГ-ММ-ДД` вручную, а не через `new Date(строка)`.
 *
 * Строку такого вида платформа читает как полночь по Гринвичу, и восточнее
 * его `new Date('2026-08-21')` в местном времени оказывается двадцатым.
 * Календарь подсвечивал бы не тот день — молча и только у части
 * пользователей.
 */
function parseISO(value: string | null): Date | null {
  if (!value) return null;

  const parts = value.split('-');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;

  const date = new Date(year, month - 1, day, 12);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatRu(date: Date): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Полдень, а не полночь: перевод часов сдвигает полночь на сутки назад. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate(), 12);
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Понедельник — 0, воскресенье — 6. */
function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** Понедельник той недели, в которую попадает первое число месяца. */
function startOfGrid(month: Date): Date {
  const first = firstOfMonth(month);
  return addDays(first, -weekdayIndex(first));
}
