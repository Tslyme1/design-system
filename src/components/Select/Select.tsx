import { useState, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ControlSizeToken } from '../../tokens';
import { Icon } from '../../primitives';
import { Popover } from '../Popover/Popover';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
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
  onChange: (value: string | string[]) => void;
  /** Текст, когда ничего не выбрано. */
  placeholder?: string;
  size?: ControlSizeToken;
  /** Выбор нескольких вариантов флажками. */
  multiple?: boolean;
  /** Поле поиска над списком. Включать от ~10 вариантов. */
  searchable?: boolean;
  /**
   * Разрешить значение, которого нет в списке — как «Заказчик»
   * в окне нового проекта, где нового заказчика заводят на месте.
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

  const pick = (option: SelectOption) => {
    if (option.disabled) return;
    if (multiple) {
      const next = selected.includes(option.value)
        ? selected.filter((v) => v !== option.value)
        : [...selected, option.value];
      onChange(next);
      return;
    }
    onChange(option.value);
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
        if (searchable) window.setTimeout(() => searchRef.current?.focus(), 0);
      }}
    >
      <span className={label ? styles.value : styles.placeholder}>{label ?? placeholder}</span>
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
      {searchable ? (
        <input
          ref={searchRef}
          className={styles.search}
          value={query}
          placeholder={allowCustom ? 'Поиск или новое значение' : 'Поиск'}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && allowCustom) commitCustom();
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
                <div
                  key={option.value}
                  className={[
                    styles.option,
                    isSelected ? styles.optionSelected : null,
                    option.disabled ? styles.optionDisabled : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={option.disabled ? -1 : 0}
                  onClick={() => pick(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      pick(option);
                    }
                  }}
                >
                  <span className={styles.optionText}>
                    <span className={styles.optionLabel}>{option.label}</span>
                    {option.description ? (
                      <span className={styles.optionDescription}>{option.description}</span>
                    ) : null}
                  </span>

                  {multiple ? (
                    <Checkbox checked={isSelected} readOnly tabIndex={-1} />
                  ) : isSelected ? (
                    <Icon name="check" size="sm" color="accentText" />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))
      )}
    </Popover>
  );
}
