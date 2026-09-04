import type { ReactNode } from 'react';
import styles from './Tab.module.css';

export type TabProps = {
  /** Подпись пункта. */
  children: ReactNode;
  /** Открыт/выбран сейчас этот пункт. */
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

/**
 * Пункт навигации по разделам одной страницы: подпись плюс полоса снизу
 * у активного пункта.
 *
 * Не путать с `SegmentedControl`: тот — взаимоисключающий контрол формы
 * (`fieldset` + радиокнопки, всегда ровно один вариант «включён» как
 * значение). `Tab` — переход между разделами контента, который остаётся
 * на месте целиком (пункты не переключают видимость панелей, а обычно ведут
 * прокрутку к разделу или подсвечиваются по мере прокрутки мимо него),
 * поэтому и роль другая: обычная кнопка с `aria-current`, как у `HeaderTab`,
 * а не `role="tab"` из паттерна ARIA tabs — тот привязан к скрытию всех
 * панелей, кроме одной, чего здесь нет.
 *
 * Не для шапки сервиса — там уже есть `HeaderTab` на шкале `chrome`
 * с собственным активным состоянием (подложка, не полоса). `Tab` — для
 * навигации внутри страницы или панели: например, оглавление шторки
 * результата с несколькими разделами подряд.
 */
export function Tab({ children, active = false, onClick, disabled = false }: TabProps) {
  return (
    <button
      type="button"
      className={[styles.tab, active ? styles.active : null].filter(Boolean).join(' ')}
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
