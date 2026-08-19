import type { KeyboardEvent, ReactNode } from 'react';
import type { ControlSizeToken } from '../../tokens';
import { Text } from '../../primitives';
import styles from './Cell.module.css';

export type CellProps = {
  /** Основная подпись строки. */
  children: ReactNode;
  /** Второй уровень подписи — пояснение под названием. */
  description?: ReactNode;
  /**
   * Левый слот: иконка, флажок, аватар, номер. Ширина фиксирована шкалой,
   * поэтому подписи соседних строк стоят в одном столбце. Явный `null`
   * резервирует пустой слот — для строки без иконки в списке, где иконки есть.
   */
  leading?: ReactNode;
  /** Правый слот: галочка выбора, значение, `Badge`, шеврон. */
  trailing?: ReactNode;
  /**
   * Высота и типографика строки. Совпадает со шкалой контролов, чтобы
   * список внутри поповера не расходился с полем, из которого он раскрылся.
   */
  size?: ControlSizeToken;
  /**
   * `danger` — строка, разрушающая данные: «Удалить», «Очистить». Красный
   * в системе означает потерю данных, декоративно его брать нельзя.
   */
  tone?: 'default' | 'danger';
  /** Строка выбрана: подсветка заливкой. Галочку в правый слот ставит вызывающий. */
  selected?: boolean;
  disabled?: boolean;
  /** Клик делает строку интерактивной: курсор, hover, focus-visible, active. */
  onClick?: () => void;
  /**
   * Роль строки в конструкции, которая её содержит: `option` в списке
   * `Select`, `menuitem` в меню. Без роли интерактивная строка рисуется
   * кнопкой — тем, чем она и является в одиночку.
   */
  role?: string;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
  id?: string;
};

/** Подпись берёт роль по размеру строки: плотный список — `bodySm`, поле формы — `body`. */
const labelVariant = { sm: 'bodySm', md: 'body', lg: 'bodyLg' } as const;

/**
 * Строка-ячейка: левый слот, текст, правый слот.
 *
 * Один и тот же ряд повторяется в системе везде — вариант в `Select`, пункт
 * меню в `Popover`, строка списка. До этого компонента каждое место
 * выкладывало его заново, и совпадали они только приблизительно: где-то
 * иконка стояла в 8px от текста, где-то в 12, где-то строка тянулась по
 * содержимому и подписи в столбце не выравнивались, а пункт без иконки
 * оказывался левее соседей.
 *
 * Раскладка здесь ровно одна и не настраивается: слоты фиксированы по
 * ширине, текст занимает остаток, правый слот прижат к правому краю.
 * Настраивается только высота (`size`) и то, что в слоты положили.
 *
 * Не использовать как контейнер произвольной вёрстки: два слота и текст —
 * это весь набор. Строке нужно третье поле — это таблица, а не ячейка.
 */
export function Cell({
  children,
  description,
  leading,
  trailing,
  size = 'md',
  tone = 'default',
  selected = false,
  disabled = false,
  onClick,
  role,
  'aria-selected': ariaSelected,
  'aria-checked': ariaChecked,
  'aria-disabled': ariaDisabled,
  id,
}: CellProps) {
  const interactive = Boolean(onClick);

  /* Без роли интерактивная строка — кнопка: клавиатура, фокус и отключение
     достаются от платформы. С ролью (`option`, `menuitem`) кнопка не годится:
     внутри списка её роль обязана быть другой, поэтому обработка клавиш
     перекладывается сюда — но остаётся в одном месте, а не у каждого списка. */
  const Tag = !role && interactive ? 'button' : 'div';

  const className = [
    styles.cell,
    styles[size],
    tone === 'danger' ? styles.danger : null,
    interactive ? styles.interactive : null,
    selected ? styles.selected : null,
    disabled ? styles.disabled : null,
  ]
    .filter(Boolean)
    .join(' ');

  const labelColor = disabled ? 'textDisabled' : tone === 'danger' ? 'dangerText' : 'text';

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (Tag === 'button' || !interactive) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleClick();
  };

  return (
    <Tag
      className={className}
      id={id}
      role={role}
      type={Tag === 'button' ? 'button' : undefined}
      disabled={Tag === 'button' ? disabled : undefined}
      tabIndex={Tag === 'div' && interactive ? (disabled ? -1 : 0) : undefined}
      aria-selected={ariaSelected}
      aria-checked={ariaChecked}
      aria-disabled={ariaDisabled ?? (Tag === 'div' && disabled ? true : undefined)}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={handleKeyDown}
    >
      {/* Пустой слот резервируется явным `null`: в списке, где иконка есть
          не у всех строк, подписи иначе встают в два столбца. */}
      {leading !== undefined ? <span className={styles.leading}>{leading}</span> : null}

      <span className={styles.text}>
        <Text variant={labelVariant[size]} color={labelColor} truncate>
          {children}
        </Text>
        {description ? (
          <Text variant="caption" color={disabled ? 'textDisabled' : 'textMuted'} truncate>
            {description}
          </Text>
        ) : null}
      </span>

      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </Tag>
  );
}
