/**
 * СЕМАНТИКА — роли, которые видит прикладной код.
 *
 * Здесь нет ни одного сырого значения: только ссылки на примитивы.
 * Компоненты импортируют ТОЛЬКО отсюда (через `tokens/index.ts`).
 *
 * Правило именования: роль отвечает на вопрос «зачем», а не «как выглядит».
 * `text-muted` — можно. `gray-light` — нельзя: при смене темы имя начнёт врать.
 *
 * Значения цвета отдаются как ссылки на CSS-переменные, а не как hex:
 * тема переопределяет переменную, и компонент об этом не знает.
 */

import { space, radius, typography, controlSize, chrome, modalWidth, borderWidth, duration, easing, zIndex } from './primitives';

/** Цветовые роли. Значения резолвятся из tokens.css и меняются вместе с темой. */
export const color = {
  /* Поверхности */
  /** Фон страницы. Самый нижний слой. */
  bg: 'var(--color-bg)',
  /** Поверхность карточки, поля, меню — на один слой выше фона. */
  surface: 'var(--color-surface)',
  /** Поверхность, поднятая над surface: меню поверх карточки, модалка. */
  surfaceRaised: 'var(--color-surface-raised)',
  /** Приглушённая подложка: заголовок таблицы, полоса шапки, disabled-фон. */
  surfaceSunken: 'var(--color-surface-sunken)',

  /* Текст */
  /** Основной текст. */
  text: 'var(--color-text)',
  /** Второстепенный текст: подписи, единицы, пояснения. */
  textMuted: 'var(--color-text-muted)',
  /** Текст, потерявший активность. Не использовать для второстепенного — есть textMuted. */
  textDisabled: 'var(--color-text-disabled)',
  /** Текст на акцентной заливке. */
  textOnAccent: 'var(--color-text-on-accent)',

  /* Границы */
  /** Хайрлайн: рамки карточек, разделители строк, границы полей. */
  border: 'var(--color-border)',
  /** Граница в состоянии наведения. */
  borderHover: 'var(--color-border-hover)',
  /** Граница активного/сфокусированного контрола. */
  borderStrong: 'var(--color-border-strong)',

  /* Акцент */
  /** Основное действие, активное состояние, фокус. */
  accent: 'var(--color-accent)',
  accentHover: 'var(--color-accent-hover)',
  accentActive: 'var(--color-accent-active)',
  /** Слабая акцентная заливка: выделенная строка, активный сегмент. */
  accentSubtle: 'var(--color-accent-subtle)',
  /** Акцентный текст на светлом фоне — контрастная ступень, а не сам акцент. */
  accentText: 'var(--color-accent-text)',

  /* Статусы */
  danger: 'var(--color-danger)',
  dangerHover: 'var(--color-danger-hover)',
  dangerSubtle: 'var(--color-danger-subtle)',
  dangerText: 'var(--color-danger-text)',

  success: 'var(--color-success)',
  successSubtle: 'var(--color-success-subtle)',
  successText: 'var(--color-success-text)',

  warning: 'var(--color-warning)',
  warningSubtle: 'var(--color-warning-subtle)',
  warningText: 'var(--color-warning-text)',

  /* Служебные */
  /** Затемнение под модалкой. */
  overlay: 'var(--color-overlay)',
  /** Кольцо фокуса. Всегда одно на весь проект. */
  focusRing: 'var(--color-focus-ring)',
} as const;

/** Отступы. Единственный разрешённый словарь расстояний. */
export const spacing = space;

/** Скругления. */
export const cornerRadius = radius;

/** Типографические роли. */
export const textVariant = typography;

/** Высоты интерактивных контролов. */
export const control = controlSize;

/** Размеры оболочки приложения — шапка сервиса. */
export const appChrome = chrome;

/** Ширины модальных окон. */
export const modal = modalWidth;

/** Уровни подъёма. Правило: тень ИЛИ бордер. */
export const elevation = {
  flat: 'var(--shadow-none)',
  raised: 'var(--shadow-sm)',
  overlay: 'var(--shadow-md)',
  modal: 'var(--shadow-lg)',
} as const;

export const stroke = borderWidth;
export const motionDuration = duration;
export const motionEasing = easing;
export const layer = zIndex;

/* ------------------------------------------------------------------ *
 * ЗАКРЫТЫЕ ТИПЫ
 * Именно они делают невалидное значение некомпилируемым.
 * gap="13px" не пройдёт проверку типов — это и есть работающее ограничение.
 * ------------------------------------------------------------------ */
export type SpaceToken = keyof typeof spacing;
export type RadiusToken = keyof typeof cornerRadius;
export type ColorToken = keyof typeof color;
export type TextVariantToken = keyof typeof textVariant;
export type ControlSizeToken = keyof typeof control;
export type ElevationToken = keyof typeof elevation;
export type ModalWidthToken = keyof typeof modal;
export type TagColorToken = 'steel' | 'sage' | 'amber' | 'clay' | 'violet' | 'slate';

/** Роли цвета, допустимые как цвет текста. Отсекает `bg` в пропе `color`. */
export type TextColorToken = Extract<
  ColorToken,
  | 'text'
  | 'textMuted'
  | 'textDisabled'
  | 'textOnAccent'
  | 'accentText'
  | 'dangerText'
  | 'successText'
  | 'warningText'
>;

/** Роли цвета, допустимые как фон поверхности. */
export type SurfaceColorToken = Extract<
  ColorToken,
  | 'bg'
  | 'surface'
  | 'surfaceRaised'
  | 'surfaceSunken'
  | 'accentSubtle'
  | 'dangerSubtle'
  | 'successSubtle'
  | 'warningSubtle'
>;

/** Соответствие токена отступа CSS-переменной — для примитивов раскладки. */
export const spaceVar: Record<SpaceToken, string> = {
  none: 'var(--space-none)',
  '2xs': 'var(--space-2xs)',
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
  '2xl': 'var(--space-2xl)',
};

export const radiusVar: Record<RadiusToken, string> = {
  none: 'var(--radius-none)',
  md: 'var(--radius-md)',
  full: 'var(--radius-full)',
};
