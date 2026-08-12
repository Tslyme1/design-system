import { create } from 'storybook/theming/create';
import { palette, fontFamily } from '../src/tokens/primitives';

/**
 * Темы оболочки Storybook, собранные из наших примитивов.
 *
 * Прямой импорт `tokens/primitives` в продуктовом коде запрещён и ловится
 * линтером. Здесь он законен и необходим: оболочка витрины — не продукт,
 * семантических ролей у неё нет (у сайдбара нет роли «поверхность карточки»),
 * но значения обязаны быть теми же. Иначе витрина покрасится в свой синий,
 * похожий на наш, и разница будет читаться как дефект системы.
 *
 * Storybook принимает только готовые цвета, не переменные: его оболочка
 * живёт в отдельном документе и наших CSS-переменных не видит.
 */

const shared = {
  brandTitle: 'Дизайн-система «Уралмаш»',
  brandTarget: '_self',
  fontBase: fontFamily.body,
  fontCode: fontFamily.mono,
  appBorderRadius: 4,
} as const;

export const lightTheme = create({
  ...shared,
  base: 'light',

  appBg: palette.neutral[100],
  appContentBg: palette.white,
  appPreviewBg: palette.white,
  appBorderColor: palette.neutral[300],

  textColor: palette.neutral[900],
  textMutedColor: palette.neutral[600],
  textInverseColor: palette.white,

  colorPrimary: palette.accent[700],
  colorSecondary: palette.accent[700],

  barBg: palette.neutral[100],
  barTextColor: palette.neutral[600],
  barSelectedColor: palette.accent[700],
  barHoverColor: palette.accent[700],

  inputBg: palette.white,
  inputBorder: palette.neutral[300],
  inputTextColor: palette.neutral[900],
  inputBorderRadius: 4,

  booleanBg: palette.neutral[200],
  booleanSelectedBg: palette.white,
});

export const darkTheme = create({
  ...shared,
  base: 'dark',

  /* Значения тёмной темы — те же ступени лестниц, что подставляет tokens.css
     в тёмном режиме: 900 как фон, 800 как поверхность, 100 как основной текст. */
  appBg: '#17181a',
  appContentBg: '#1d1e20',
  appPreviewBg: '#1d1e20',
  appBorderColor: palette.neutral[800],

  textColor: palette.neutral[100],
  textMutedColor: palette.neutral[500],
  textInverseColor: palette.neutral[900],

  colorPrimary: palette.accent[300],
  colorSecondary: palette.accent[300],

  barBg: '#17181a',
  barTextColor: palette.neutral[500],
  barSelectedColor: palette.accent[300],
  barHoverColor: palette.accent[300],

  inputBg: '#1d1e20',
  inputBorder: palette.neutral[800],
  inputTextColor: palette.neutral[100],
  inputBorderRadius: 4,

  booleanBg: palette.neutral[800],
  booleanSelectedBg: palette.neutral[700],
});
