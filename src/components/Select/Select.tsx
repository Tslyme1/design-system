import { useState, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ControlSizeToken } from '../../tokens';
import { Icon } from '../../primitives';
import { Popover } from '../Popover/Popover';
import { Cell } from '../Cell/Cell';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
  /**
   * Чем нарисовать вариант, когда подписи мало: тег своего цвета, значок
   * состояния. Подпись при этом остаётся обязательной — по ней идёт поиск,
   * её же читает скринридер, и она остаётся запасным видом варианта.
   */
  content?: ReactNode;
  /** Второй уровень подписи — пояснение под названием. */
  description?: string;
  /** Заголовок группы, к которой относится вариант. */
  group?: string;
  disabled?: boolean;
};

export type SelectProps = {
  options: SelectOption[];
  /** Выбранное значение. Для `multiple` — массив. */
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  /** Текст, когда ничего не выбрано. */
  placeholder?: string;
  size?: ControlSizeToken;
  /** Выбор нескольких вариантов флажками. */
  multiple?: boolean;
  /**
   * Повторный клик по выбранному варианту снимает выбор — селект
   * возвращается к плейсхолдеру и отдаёт `null`. Выключать только там,
   * где пустого значения не существует (например, обязательный режим
   * расчёта): тогда снять выбор можно лишь выбрав другой вариант.
   */
  clearable?: boolean;
  /** Поле поиска над списком. Включать от ~10 вариантов. */
  searchable?: boolean;
  /**
   * Разрешить значение, которого нет в списке — как «Заказчик»
   * в окне нового проекта, где нового заказчика заводят на месте.
   *
   * Поле ввода появляется вместе с пропом: включать ради него ещё
   * и `searchable` не нужно — вводить свободное значение некуда,
   * пока поля нет.
   */
  allowCustom?: boolean;
  /** Закреплённая строка внизу: «+ Добавить». */
  footer?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  /** Приходят из `Field`. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};

/**
 * Выпадающий список.
 *
 * В аудите такой список собирался заново в каждом месте из `card elev-md`,
 * `menu-row` и вручную выставленного `z-index`. Одиночный и множественный
 * выбор, поиск, группы и футер «+ Добавить» были разными реализациями
 * одного и того же.
 *
 * Панель, закрытие по клику снаружи и по Esc отданы `Popover` — здесь
 * только логика выбора.
 */
export function Select({
  options,
  value,
  onChange,
  placeholder = 'Не выбрано',
  size = 'md',
  multiple = false,
  clearable = true,
  searchable = false,
  allowCustom = false,
  footer,
  disabled = false,
  invalid = false,
  fullWidth = false,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  /**
   * Поле над списком. Поиск и свободный ввод пишут в одно и то же поле,
   * поэтому включает его любой из двух пропов: `allowCustom` без
   * `searchable` обещал значение вне списка, а ввести его было негде —
   * панель открывалась одним списком вариантов.
   */
  const typeable = searchable || allowCustom;

  const selected = useMemo(() => (Array.isArray(value) ? value : value ? [value] : []), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SelectOption[]>();
    for (const option of filtered) {
      const key = option.group ?? '';
      const list = map.get(key);
      if (list) list.push(option);
      else map.set(key, [option]);
    }
    return [...map.entries()];
  }, [filtered]);

  const label = useMemo(() => {
    if (selected.length === 0) return null;
    if (!multiple) return options.find((o) => o.value === selected[0])?.label ?? selected[0];
    if (selected.length === 1) return options.find((o) => o.value === selected[0])?.label ?? selected[0];
    return `Выбрано: ${selected.length}`;
  }, [selected, options, multiple]);

  /**
   * Что показать в поле. Свой вид варианта показывается и здесь: тег,
   * выбранный из списка тегов, обязан остаться тегом и в закрытом поле —
   * иначе список и поле рассказывают об одном значении по-разному.
   * У множественного выбора со счётчиком показывать нечего.
   */
  const display = useMemo(() => {
    if (selected.length !== 1) return label;
    return options.find((o) => o.value === selected[0])?.content ?? label;
  }, [selected, options, label]);

  const pick = (option: SelectOption) => {
    if (option.disabled) return;
    if (multiple) {
      const next = selected.includes(option.value)
        ? selected.filter((v) => v !== option.value)
        : [...selected, option.value];
      onChange(next);
      return;
    }
    /* Одиночный выбор без снятия — ловушка: выбранное значение
       нельзя вернуть в пустое, если в списке всего один вариант. */
    onChange(clearable && selected.includes(option.value) ? null : option.value);
    setOpen(false);
    setQuery('');
  };

  const commitCustom = () => {
    const raw = query.trim();
    if (!raw) return;
    onChange(multiple ? [...selected, raw] : raw);
    setOpen(false);
    setQuery('');
  };

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
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-describedby={describedBy}
      aria-invalid={ariaInvalid || invalid || undefined}
      /* Плавающая подпись держится на `:placeholder-shown`, а он работает
         только у input. Триггер — button, поэтому «пусто/заполнено»
         сообщается атрибутом, на который смотрит Field. */
      data-filled={label ? 'true' : 'false'}
      onClick={() => {
        setOpen((v) => !v);
        if (typeable) window.setTimeout(() => searchRef.current?.focus(), 0);
      }}
    >
      <span className={label ? styles.value : styles.placeholder}>{display ?? placeholder}</span>
      <Icon name="chevronDown" size="sm" />
    </button>
  );

  return (
    <Popover
      open={open}
      onClose={() => {
        if (allowCustom && query.trim()) commitCustom();
        setOpen(false);
      }}
      trigger={trigger}
      placement="bottom-start"
      width="trigger"
      fullWidth={fullWidth}
      footer={footer}
    >
      {typeable ? (
        <input
          ref={searchRef}
          /* Класс размера тот же, что у триггера: поле поиска обязано
             совпадать со строками меню, а не жить по своей шкале. */
          className={[styles.search, styles[size]].join(' ')}
          value={query}
          /* Имя дублирует плейсхолдер намеренно: подписи над полем нет,
             а плейсхолдер доступным именем не считается — без `aria-label`
             поле оставалось безымянным для скринридера. */
          aria-label={allowCustom ? 'Поиск или новое значение' : 'Поиск'}
          placeholder={allowCustom ? 'Поиск или новое значение' : 'Поиск'}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' || !allowCustom) return;
            /* Enter здесь означает «взять введённое» и ничего больше.
               Без `preventDefault` он доигрывался дальше: поле исчезало
               вместе с панелью прямо посреди обработки нажатия, действие
               по умолчанию доставалось тому, что оказалось под фокусом,
               и нажатие уходило в кнопку закрытия окна — селект брал
               значение и уносил с собой всю модалку. */
            e.preventDefault();
            commitCustom();
          }}
        />
      ) : null}

      {grouped.length === 0 ? (
        <div className={styles.empty}>
          {allowCustom && query.trim() ? 'Новое значение — нажмите Enter' : 'Ничего не найдено'}
        </div>
      ) : (
        grouped.map(([group, list]) => (
          <div key={group}>
            {group ? <div className={styles.group}>{group}</div> : null}
            {list.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                /* Раскладка строки — общая `Cell`: тот же ряд стоит в меню
                   поповера и в списках, и собирался он раньше в каждом
                   месте заново. Здесь остаётся только смысл варианта. */
                <Cell
                  key={option.value}
                  size={size}
                  role="option"
                  aria-selected={isSelected}
                  selected={isSelected}
                  disabled={option.disabled}
                  description={option.description}
                  onClick={() => pick(option)}
                  trailing={
                    multiple ? (
                      <Checkbox checked={isSelected} readOnly tabIndex={-1} />
                    ) : isSelected ? (
                      <Icon name="check" size="sm" color="accentText" />
                    ) : null
                  }
                >
                  {option.content ?? option.label}
                </Cell>
              );
            })}
          </div>
        ))
      )}
    </Popover>
  );
}
